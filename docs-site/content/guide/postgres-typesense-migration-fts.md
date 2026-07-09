# Migrating from PostgreSQL to Typesense for Full-Text Search

When adding search functionality to an application backed by PostgreSQL, developers naturally start with the tools built into the database. PostgreSQL is an exceptional database that excels at transactional consistency, relational queries, and JOINs. It also provides highly capable native tools for moderate full-text search requirements. For many applications, particularly those where search is a secondary feature, PostgreSQL is more than sufficient.

However, as search becomes a central feature of an application, user expectations increase. Modern search experiences require high query throughput, instant autocomplete, typo tolerance, relevance tuning, faceting, and dynamic merchandising. While it is possible to build these features using PostgreSQL, doing so introduces significant operational complexity.

This article explores the journey of implementing search in PostgreSQL. We will start with basic pattern matching and typo tolerance using `pg_trgm`, explore PostgreSQL's native Full Text Search (FTS) capabilities, and finally examine the operational challenges of extending these features at scale and how Typesense addresses them.

---

## Performance of LIKE and ILIKE

The most immediate bottleneck with `LIKE` and `ILIKE` queries is search performance on large tables.

By default, PostgreSQL uses [B-tree indexes](https://www.postgresql.org/docs/current/btree.html) for primary and secondary indexes. B-trees are highly optimized for exact matches (`=`) and range comparisons (`>`, `<`). They can also optimize prefix searches (e.g., `LIKE 'laptop%'`) and can handle case-insensitive lookups if configured as expression indexes (e.g., `CREATE INDEX ON products (LOWER(description))`).

However, if you place a wildcard at the beginning of your search string (for example, `ILIKE '%laptop%'`), a standard B-tree index cannot be used. B-tree indexes rely on the sorted order of keys from left to right. A leading wildcard bypasses this sorted structure, forcing PostgreSQL to fall back on a **Sequential Scan** (a full table scan).

```sql
-- This query bypasses B-tree indexes and scans every row
SELECT * FROM products WHERE description ILIKE '%laptop%';
```

---

## Test dataset with 5 million rows

To see the impact of full table scans, let's create a dataset of 5 million product records in PostgreSQL:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);

-- Insert 5 million rows of test data
INSERT INTO products (name, description)
SELECT 
    'Product ' || i,
    'This is a standard description for product ' || i || '. It has some generic text.'
FROM generate_series(1, 5000000) AS i;

-- Insert a target keyword near the end of the table
UPDATE products SET description = 'The ultimate gaming laptop with high specs' WHERE id = 4900000;
```

Running a standard wildcard search on this table highlights the performance cost:

```sql
EXPLAIN ANALYZE SELECT * FROM products WHERE description ILIKE '%gaming laptop%';
```

This query produces an execution plan similar to this:

```text
Gather  (cost=1000.00..108052.24 rows=500 width=96) (actual time=1514.831..1547.060 rows=1 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  ->  Parallel Seq Scan on products  (cost=0.00..107002.24 rows=208 width=96) (actual time=1513.529..1523.547 rows=0 loops=3)
        Filter: (description ~~* '%gaming laptop%'::text)
        Rows Removed by Filter: 1666666
Planning Time: 0.671 ms
Execution Time: 1547.978 ms
```

Because of the leading wildcard `%`, PostgreSQL performs a sequential scan across every row to evaluate the filter expression. While parallel workers mitigate this, the query still takes over 1.5 seconds. Under concurrent search traffic, sequential scans quickly consume CPU resources, leading to query queues and timeouts.

---

## Typo tolerance with pg_trgm

To handle spelling mistakes and optimize wildcard searches, PostgreSQL includes the `pg_trgm` extension.

### How trigrams work
A trigram is a group of three consecutive characters extracted from a string. When generating trigrams, PostgreSQL prefixes the string with two spaces and suffixes it with one space. 

You can inspect the trigrams generated for any string using `show_trgm()`:

```sql
SELECT show_trgm('apple');
-- Output: {"  a"," ap","app","le ","ppl","ple"}
```

To calculate similarity between two strings, PostgreSQL uses the **Jaccard similarity coefficient** i.e, the size of the intersection of their trigrams divided by the size of their union.

Comparing `"apple"` and `"aple"`:
*   Trigrams of `"apple"`: `{"  a"," ap","app","le ","ppl","ple"}` (6 trigrams)
*   Trigrams of `"aple"`: `{"  a"," ap","apl","ple","le "}` (5 trigrams)
*   Intersection: `{"  a"," ap","le ","ple"}` (4 trigrams)
*   Union: `{"  a"," ap","apl","app","le ","ppl","ple"}` (7 trigrams)
*   **Similarity score**: `4 / 7 ≈ 0.57`

### Querying with pg_trgm
With the extension enabled (`CREATE EXTENSION pg_trgm;`), you can measure string similarity and run similarity-based queries:

```sql
-- Compute raw similarity
SELECT similarity('gaming laptop', 'gaming leptop'); -- Returns ~0.65

-- Filter using the % similarity operator
SELECT * FROM products 
WHERE name % 'gaming leptop'
ORDER BY similarity(name, 'gaming leptop') DESC;
```

The `%` operator evaluates to `true` if the Jaccard similarity exceeds the threshold configured by `pg_trgm.similarity_threshold` (default is `0.3`). You can adjust this threshold to control search sensitivity:

```sql
SET pg_trgm.similarity_threshold = 0.4;
```

---

## Trigram indexes

Running similarity queries without a dedicated index still forces a sequential scan, calculating trigrams for every row. PostgreSQL supports two index types to optimize trigram matches.
- **GIN** [Generalized Inverted Index](https://www.postgresql.org/docs/current/gin.html).
- **GiST** [Generalized Search Tree](https://www.postgresql.org/docs/current/gist.html).

```sql
-- Create a GIN trigram index
CREATE INDEX idx_products_name_trgm_gin ON products USING gin (name gin_trgm_ops);

-- Create a GiST trigram index
CREATE INDEX idx_products_name_trgm_gist ON products USING gist (name gist_trgm_ops);
```

### Trade-offs between GIN and GiST

Choosing between GIN and GiST depends on your read-to-write ratio and disk space:

| Feature | GIN Index | GiST Index |
| :--- | :--- | :--- |
| **Search Speed** | Fast (resolves trigrams directly via an inverted index) | Slower (requires traversing multiple nodes) |
| **Write/Update Overhead** | High (updating the inverted index is write-intensive) | Low (faster inserts and updates) |
| **Index Size on Disk** | Large (often 2–3x larger than GiST) | Small (compact structure) |
| **Primary Use Case** | Read-heavy search with infrequent writes | Write-heavy tables or limited disk space |

Since our `products` table is read-heavy, let's add a **GIN** index and observe the impact on our wildcard query performance.

```sql
CREATE INDEX idx_products_description_trgm
ON products
USING gin (description gin_trgm_ops);
```

We can now rerun our original query with `EXPLAIN ANALYZE` to see the new execution plan.

```sql
EXPLAIN ANALYZE
SELECT * FROM products WHERE description ILIKE '%gaming laptop%';
```

After adding a GIN index, PostgreSQL uses a Bitmap Index Scan instead of a Sequential Scan, reducing execution time significantly for this workload.

```plaintext
Bitmap Heap Scan on products  (cost=1859.51..3744.23 rows=500 width=96) (actual time=0.823..0.832 rows=1 loops=1)
  Recheck Cond: (description ~~* '%gaming laptop%'::text)
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on idx_products_description_trgm  (cost=0.00..1859.38 rows=500 width=0) (actual time=0.775..0.775 rows=1 loops=1)
        Index Cond: (description ~~* '%gaming laptop%'::text)
Planning Time: 2.563 ms
Execution Time: 1.078 ms
```

---

## PostgreSQL Full Text Search (FTS)

While `pg_trgm` provides typo tolerance and speeds up wildcard search queries, PostgreSQL also includes a mature, native Full Text Search engine designed for linguistic processing. 

FTS works by parsing text into a `tsvector` (a sorted list of distinct lexical tokens, or "lexemes") and querying it using a `tsquery`.

### A realistic FTS query

```sql
-- Add a GIN index for FTS
CREATE INDEX idx_products_description_fts 
ON products 
USING gin (to_tsvector('english', description));

-- Search using websearch_to_tsquery for a Google-like query syntax
SELECT 
    id, 
    name, 
    ts_rank(to_tsvector('english', description), websearch_to_tsquery('english', '"gaming laptop" or desktop -refurbished')) AS rank,
    ts_headline('english', description, websearch_to_tsquery('english', '"gaming laptop" or desktop -refurbished')) AS snippet
FROM products
WHERE to_tsvector('english', description) @@ websearch_to_tsquery('english', '"gaming laptop" or desktop -refurbished')
ORDER BY rank DESC
LIMIT 10;
```

### Strengths of PostgreSQL FTS

PostgreSQL's FTS engine is extremely capable out of the box:
*   **Stemming and Stop Words**: It automatically removes common words (like "the" or "and") and normalizes words to their root forms (e.g., "running" and "ran" become "run").
*   **Ranking**: The `ts_rank` function provides sophisticated document scoring based on lexical frequency.
*   **Dictionaries and Field Weighting**: You can configure custom dictionaries and assign relative weights (A, B, C, D) to different columns (like boosting `name` over `description`).
*   **Highlighting**: The `ts_headline` function dynamically generates text snippets highlighting the matched query terms.

### Limitations at scale

Despite its strengths, extending PostgreSQL FTS to support modern search UX features introduces significant operational complexity:
*   **Typo tolerance is not native**: While FTS handles stemming, it doesn't handle misspellings. Combining `pg_trgm` with FTS requires complex query orchestration.
*   **Autocomplete requires additional work**: Implementing instant search-as-you-type requires generating prefix queries, managing multiple index types, and tuning for latency.
*   **Synonyms require dictionaries**: Managing synonyms and curations requires manually maintaining and reloading PostgreSQL dictionary files on the database server.
*   **Relevance tuning becomes manual**: Continuously tweaking `ts_rank` weights or combining text relevance with business metrics (like popularity or rating) involves writing increasingly complex SQL.
*   **Faceting requires implementation**: Extracting dynamic aggregations (like category counts or price ranges) requires complex `GROUP BY` queries that can degrade performance on large result sets.
*   **Index size and write degradation**: GIN indexes map every generated lexeme and trigram back to the row IDs. Larger indexes place greater pressure on the buffer cache and may reduce cache efficiency. Furthermore, PostgreSQL updates search indexes synchronously as part of the transaction, which can introduce write latency on high-throughput systems.

---

## Migrating to Typesense

To overcome the operational complexity of building advanced search features in PostgreSQL, you can migrate your search workloads directly to Typesense.

### How Typesense structures search data

Dedicated search engines optimize for a different workload than relational databases:
*   **In-Memory Indexes**: Typesense stores search indexes in memory (mapped to disk for persistence), avoiding slow disk operations during query execution.
*   **Asynchronous Indexing**: Unlike PostgreSQL, which updates search indexes as part of the transaction, Typesense indexes documents independently after synchronization.
*   **Adaptive Radix Tree (ART)**: Typesense utilizes an Adaptive Radix Tree to index prefixes. This structure provides efficient prefix lookups with complexity proportional to the search key length, returning results as the user types without generating high CPU load. ART can also handle the fuzzy/typo-tolerance + prefix case natively in one structure, where Postgres needs two separate indexes/extensions bolted together to get similar coverage.

### Keeping data in sync

When offloading search workloads, PostgreSQL remains your primary database and source of truth. You do not need to duplicate your entire database into Typesense. Instead, you only index the specific fields required for search and filtering (like `name` and `description`), along with a primary key to link back to PostgreSQL.

To keep Typesense in sync with PostgreSQL, you have two common approaches:
*   **Batch Synchronization**: Run a periodic script that queries recently updated rows in PostgreSQL and pushes those changes to Typesense in batches.
*   **Change Data Capture (CDC)**: For real-time synchronization, use a tool like [Debezium](https://debezium.io/). Debezium reads the PostgreSQL write-ahead logs (WAL) and streams every insert, update, or delete event to Typesense asynchronously.

### Search capabilities comparison

Instead of writing complex SQL to compose search features, Typesense provides them natively.

#### Typo tolerance
Typesense automatically handles misspellings based on word length without needing to configure similarity thresholds.
```text
iphnoe

↓

iphone
```

#### Prefix search
You do not need to construct wildcard queries. Typesense instantly returns useful results for partial words.
```text
iph

↓

iphone
```

#### Search-as-you-type
Relevant matches are returned instantly at each keystroke.
```text
User types:
g
ga
gam
gami
gaming
```

#### Field weighting
Boosting matches in a title over a description requires a simple configuration rather than complex text ranking functions.
```text
Boost `title` over `description`
```

#### Faceting
Extracting dynamic filters and counts is built-in and requires no `GROUP BY` logic.
```text
Brand
Category
Price
Rating
```

#### Synonyms
Instead of editing database dictionary files, you can define synonyms dynamically via the API or a dashboard.
```text
tv

↓

television
```

#### Curations and Merchandising
You can pin products or boost specific brands dynamically.
```text
Pin "MacBook Pro" for the query "laptop"
Boost brand "Apple"
```

#### Highlighting
Typesense returns highlighted text snippets natively in the response payload without requiring functions like `ts_headline()` to compose them.

#### Search analytics
Query analytics and popular search tracking are built into the search platform rather than implemented separately in your backend.

---

## Conclusion

PostgreSQL provides excellent search capabilities for many applications, especially when search is not the primary workload. Features like Full Text Search and `pg_trgm` allow developers to build capable search experiences without introducing another system.

As search becomes a central feature of an application—with requirements like typo tolerance, autocomplete, relevance tuning, faceting, custom ranking, and high query throughput—the operational complexity of extending PostgreSQL increases. At that point, dedicated search engines such as Typesense become attractive because they are purpose-built for those workloads while allowing PostgreSQL to remain the source of truth.
