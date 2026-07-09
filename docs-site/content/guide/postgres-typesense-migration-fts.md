# Migrating from PostgreSQL to Typesense for Full-Text Search

When adding search functionality to an application backed by PostgreSQL, it's natural to start with the tools built into the database. PostgreSQL is widely used for transactional applications and provides native support for full-text search. For many applications, particularly those where search is a secondary feature, PostgreSQL is sufficient.

However, modern search experiences require instant autocomplete, typo tolerance, relevance tuning, faceting, and dynamic merchandising. While it is possible to build these features using PostgreSQL, doing so introduces additional implementation and operational work.

This guide compares how common search capabilities are implemented in PostgreSQL versus Typesense.

## Test dataset

All PostgreSQL execution plans and performance metrics in this guide are based on a test dataset containing ~5 million product records. The equivalent Typesense examples assume these records are indexed with `id`, `name`, and `description` fields.

---

## Implementation Comparison

| Capability | PostgreSQL | Typesense |
| :--- | :--- | :--- |
| **Basic substring search** | `ILIKE` | `q` |
| **Typo tolerance** | `pg_trgm` + GIN index | Built-in |
| **Full text search** | `tsvector` + `tsquery` | Built-in |
| **Ranking** | `ts_rank` | Built-in |
| **Highlighting** | `ts_headline` | Built-in |
| **Prefix search** | Multiple approaches | Built-in |
| **Faceting** | `GROUP BY` | Built-in |

---

## Architecture overview

When offloading search workloads, PostgreSQL remains your primary database and source of truth. In many deployments, only the fields required for search and filtering are indexed into Typesense.

### Query flow
Search requests are sent directly to Typesense to ensure low latency. Typesense returns the matching document IDs (and any fields needed for rendering the UI), and the application can fetch the full relational data from PostgreSQL if necessary.

```plaintext
             Search Request
                   │
             Typesense
                   │
             Product IDs
                   │
             PostgreSQL
```

### Keeping data synchronized
To keep Typesense in sync with PostgreSQL, developers typically use Change Data Capture (CDC) tools like [Debezium](https://debezium.io/). Debezium reads the PostgreSQL write-ahead logs (WAL) and streams every insert, update, or delete event to Typesense asynchronously.

```plaintext
PostgreSQL
     │
Debezium
     │
Typesense
```

---

## Basic substring search

### PostgreSQL

The simplest way to search in PostgreSQL is using the `ILIKE` operator for case-insensitive pattern matching.

```sql
SELECT * FROM products WHERE description ILIKE '%laptop%';
```

**Implementation considerations:**
If you place a wildcard at the beginning of your search string (`%laptop`), standard B-tree indexes cannot be used. PostgreSQL performs a sequential scan across every row to evaluate the filter expression. While parallel workers mitigate this, the query quickly consumes CPU resources under concurrent search traffic. For example, queries against a 5M products table:

```sql
EXPLAIN ANALYZE SELECT * FROM products WHERE description ILIKE '%gaming laptop%';
```

```plaintext
Gather  (cost=1000.00..108052.24 rows=500 width=96) (actual time=1514.831..1547.060 rows=1 loops=1)
  ->  Parallel Seq Scan on products  (cost=0.00..107002.24 rows=208 width=96) (actual time=1513.529..1523.547 rows=0 loops=3)
        Filter: (description ~~* '%gaming laptop%'::text)
        Rows Removed by Filter: 1666666
Execution Time: 1547.978 ms
```

### Equivalent implementation in Typesense

Typesense handles basic substring search natively through the `q` parameter. Search requests are served directly from the search index without requiring SQL pattern matching.

```json
{
  "q": "laptop",
  "query_by": "description"
}
```

---

## Typo tolerance

### PostgreSQL

To handle spelling mistakes and optimize wildcard searches, we enable the `pg_trgm` extension. A trigram is a group of three consecutive characters extracted from a string.

You enable the extension, configure the similarity threshold, create a Generalized Inverted Index (GIN), and write a similarity query:

```sql
CREATE EXTENSION pg_trgm;

SET pg_trgm.similarity_threshold = 0.3;

CREATE INDEX idx_products_description_trgm ON products USING gin (description gin_trgm_ops);

SELECT * FROM products 
WHERE description % 'gaming leptop'
ORDER BY similarity(description, 'gaming leptop') DESC;
```

**Implementation considerations:**
After adding a GIN index, PostgreSQL uses a Bitmap Index Scan instead of a Sequential Scan, reducing execution time significantly. However, GIN indexes map every generated trigram back to the row IDs. Larger indexes place greater pressure on the buffer cache and may reduce cache efficiency. Furthermore, PostgreSQL updates search indexes synchronously as part of the transaction, which can impact write performance.

### Equivalent implementation in Typesense

Typo tolerance is enabled by default in Typesense. The engine uses an Adaptive Radix Tree (ART) to efficiently perform prefix and fuzzy lookups

```json
{
  "q": "gaming leptop",
  "query_by": "description"
}
```

---

## Full text search and Ranking

### PostgreSQL

PostgreSQL provides a native Full Text Search engine designed for linguistic processing. It parses text into a `tsvector` (a sorted list of distinct lexical tokens) and queries it using a `tsquery`.

To implement full text search with ranking and highlighting, you create a specialized index, generate a query, rank the results using `ts_rank`, and extract snippets using `ts_headline`:

```sql
CREATE INDEX idx_products_description_fts 
ON products 
USING gin (to_tsvector('english', description));

SELECT 
    id, 
    name, 
    ts_rank(
        to_tsvector('english', description), 
        websearch_to_tsquery('english', '"gaming laptop" or desktop -refurbished')
    ) AS rank,
    ts_headline(
        'english', 
        description, 
        websearch_to_tsquery('english', '"gaming laptop" or desktop -refurbished')
    ) AS snippet
FROM products
WHERE to_tsvector('english', description) @@ websearch_to_tsquery('english', '"gaming laptop" or desktop -refurbished')
ORDER BY rank DESC
LIMIT 10;
```

**Implementation considerations:**
`ts_rank` calculates scores purely based on lexical statistics. If you need to factor in business metrics (like product popularity or rating), you must implement custom scoring formulas directly in your SQL. Furthermore, because FTS relies on exact dictionary matching, it does not handle typos natively. To achieve typo-tolerant full text search, you must maintain both a GIN trigram index and a `tsvector` index, and write application logic that first corrects misspelled words using trigrams before passing them to the FTS engine.

### Equivalent implementation in Typesense

Full text search, ranking, and highlighting are built into the core engine. You define the fields to search, and Typesense returns highlighted text snippets natively in the response payload. 

```json
{
  "q": "gaming laptop",
  "query_by": "name,description",
  "query_by_weights": "2,1"
}
```

Field weighting (`query_by_weights`) allows you to boost matches in a title over a description using a simple configuration parameter.

---

## Autocomplete and Prefix search

### PostgreSQL

Implementing search-as-you-type (autocomplete) in PostgreSQL requires generating prefix queries and often managing multiple index types to handle both prefix matching and typo tolerance simultaneously. 

Developers typically use `tsquery` with prefix matching (e.g., `gaming:*`) or `LIKE 'gaming%'` combined with trigrams, requiring careful query construction to balance latency and accuracy.

```sql
SELECT *
FROM products
WHERE name ILIKE 'gam%';
```

```sql
SELECT *
FROM products
WHERE to_tsvector('english', name)
      @@ to_tsquery('english', 'gam:*');
```

### Equivalent implementation in Typesense

Typesense utilizes an Adaptive Radix Tree (ART) to index prefixes. This structure provides efficient prefix lookups with complexity proportional to the search key length. Relevant matches are returned instantly at each keystroke. 

```json
{
  "q": "gam",
  "query_by": "name",
  "prefix": true
}
```

---

## Faceting

### PostgreSQL

Extracting dynamic aggregations, such as category counts or price ranges for a search interface, requires computing aggregates across the result set using `GROUP BY`.

```sql
SELECT 
    category, 
    COUNT(*) as count
FROM products
WHERE to_tsvector('english', description) @@ websearch_to_tsquery('english', 'laptop')
GROUP BY category;
```

**Implementation considerations:**
As the search logic becomes more complex (incorporating trigrams, `ts_rank`, and complex `WHERE` clauses), calculating dynamic `GROUP BY` aggregates alongside the search results requires executing multiple expensive queries or complex Common Table Expressions (CTEs), which can degrade performance on large datasets.

### Equivalent implementation in Typesense

Extracting dynamic filters and counts requires no `GROUP BY` logic. You simply specify the `facet_by` parameter.

```json
{
  "q": "laptop",
  "query_by": "description",
  "facet_by": "brand,category,price"
}
```

Typesense automatically returns the facet counts for "Apple", "Electronics", and price brackets alongside the search results in a single request.

---

## Synonyms and Merchandising

### PostgreSQL

Managing synonyms (e.g., matching "tv" to "television") requires maintaining and reloading PostgreSQL dictionary files on the database server. Merchandising tasks, such as pinning a specific product to the top of the results for a specific query, require building custom application-level logic to inject those records into the SQL results.

### Equivalent implementation in Typesense

Synonyms and curations (merchandising) can be defined dynamically via the API or a dashboard without touching the underlying search schema.

```json
// Create a synonym
{
  "synonyms": ["tv", "television"]
}

// Create a curation (override)
{
  "rule": {
    "match": "exact",
    "query": "laptop"
  },
  "includes": [
    {"id": "macbook-pro-14", "position": 1}
  ]
}
```

---

## When to use what

The decision to scale search beyond PostgreSQL is rarely about raw query latency, but rather about the architectural overhead of query concurrency, write frequency, and search complexity.

| PostgreSQL is often sufficient when... | Consider Typesense when... |
| :--- | :--- |
| Search is a secondary feature of the application | Search is a primary part of the user experience |
| Basic substring search or Full Text Search meets your requirements | You need autocomplete and search-as-you-type |
| PostgreSQL's built-in ranking is sufficient | You need typo tolerance, synonyms, and relevance tuning |
| You prefer to keep search within your primary database | You want to offload search workloads to a dedicated search engine |
| Search traffic is relatively modest | You expect high search concurrency or search-intensive workloads |

The two systems are often used together rather than as replacements for one another. PostgreSQL continues to manage transactional data, while Typesense indexes the fields required for search, providing a dedicated engine optimized for low-latency, feature-rich search experiences.
