# Why LIKE and ILIKE Fail at Scale: The Hidden Costs of Postgres Pattern Matching

If you are working with Postgres, you have almost certainly come across the `LIKE` and `ILIKE` keywords in some of your queries. When building a new application, adding a quick `WHERE title ILIKE '%search_term%'` is often the fastest way to implement a basic search feature. 

It works perfectly fine, until it doesn't. 

As your database grows from thousands of rows to millions, and as your users begin to expect a fast, Google-like search experience, relying on basic pattern matching starts to show its cracks. In this article, we'll explore why `LIKE` and `ILIKE` break down at scale and what you can do about it.

## The Performance Bottleneck: Full Table Scans

The most immediate issue you'll encounter with `LIKE` and `ILIKE` is performance degradation. 

By default, Postgres uses [B-tree indexes](https://www.postgresql.org/docs/current/btree.html), which are fantastic for exact matches (`=`, `>`, `<`). B-trees are optimized for balance and retrieval efficiency, making them suitable for systems that require frequent data insertions and retrievals. 

However, if you use a wildcard at the *beginning* of your search string (e.g., `ILIKE '%query%'`), Postgres cannot use a standard B-tree index. This is because B-trees store their data in a sorted manner, and a leading wildcard breaks that sorted order. As a result, Postgres must perform a **Sequential Scan** (a full table scan) to find the matching rows.

```sql
-- This query will ignore standard B-tree indexes and scan every row
SELECT * FROM products WHERE description ILIKE '%laptop%';
```

When you have 10,000 rows, a sequential scan might take a few milliseconds. But when you hit 10 million rows, that same query could take seconds. If you have concurrent users running searches, those slow queries will quickly exhaust your database connections and CPU, bringing your application to a halt.

:::tip
While you can use `pg_trgm` to create GIN indexes that support leading wildcards, they come with their own trade-offs: massive index sizes, slower write speeds, and they still don't solve the other problems listed below.
:::

### The Experiment: Searching 5 Million Rows

Let's look at a concrete example. We can easily generate a dummy dataset of 5 million product records in Postgres:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);

-- Insert 5 million rows of dummy data
INSERT INTO products (name, description)
SELECT 
    'Product ' || i,
    'This is a standard description for product ' || i || '. It has some generic text.'
FROM generate_series(1, 5000000) AS i;

-- Inject our target keyword near the end of the table
UPDATE products SET description = 'The ultimate gaming laptop with high specs' WHERE id = 4900000;
```

Now, let's run a typical `ILIKE` search and analyze its performance:

```sql
EXPLAIN ANALYZE SELECT * FROM products WHERE description ILIKE '%gaming laptop%';
```

Here is the output you'll typically see on a standard database instance:

```text
Gather  (cost=1000.00..108052.24 rows=500 width=96) (actual time=1514.831..1547.060 rows=1 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  ->  Parallel Seq Scan on products  (cost=0.00..107002.24 rows=208 width=96) (actual time=1513.529..1523.547 rows=0 loops=3)
"        Filter: (description ~~* '%gaming laptop%'::text)"
        Rows Removed by Filter: 1666666
Planning Time: 0.671 ms
JIT:
  Functions: 6
  Options: Inlining false, Optimization false, Expressions true, Deforming true
  Timing: Generation 1.141 ms, Inlining 0.000 ms, Optimization 0.951 ms, Emission 12.196 ms, Total 14.288 ms
Execution Time: 1547.978 ms
```

In this output, **Seq Scan** means Postgres looked at your query and realized it couldn't use any indexes because of the leading wildcard `%`. Therefore, it had to read the table sequentially, literally checking every row one by one from start to finish. The "Parallel" part just means Postgres threw multiple CPU threads at the problem to try and speed it up. Now imagine concurrent users running this query. This will immediately spike your CPU usage, causing other critical queries to slow down or time out completely, creating a severe performance bottleneck.

### What if we add an Index?

A common follow-up question is: *"Why not just add an index to the description field?"*

If we were to create a standard B-tree index on our dummy table:

```sql
CREATE INDEX idx_products_description ON products(description);
```

And run the exact same `ILIKE '%gaming laptop%'` query, Postgres would **still** perform a Sequential Scan and take the same time to execute the query. There are two main reasons for this:

1. **Leading Wildcards Bypass Indexes:** As mentioned earlier, B-trees store data sorted from left to right. Because our search starts with a wildcard (`%`), the index cannot be used to look up the value.
2. **B-trees are Case-Sensitive:** Even if we removed the leading wildcard and searched for `ILIKE 'gaming laptop%'`, a standard B-tree index is case-sensitive. It cannot be used with the case-insensitive `ILIKE` operator. You would need to create a special functional index (e.g., `LOWER(description)`) just to support it.

Between the leading wildcards and case-insensitivity, Postgres is often forced to bypass your indexes and fall back to brute force. As your dataset grows in size, this brute-force approach becomes completely unsustainable, leading to sluggish search experiences for your users and overloaded database servers.

However, **"Scale"** is not just data volume, it's also user expectations. As an application grows, users expect a modern, consumer-grade search experience. If search is fast but returns zero results like "iphne" or ranks irrelevant results first, the search has still failed at scale from a product perspective.

The Postgres workarounds for these features make the performance even worse. If you try to fix the typo problem using modules like `fuzzystrmatch` or `pg_trgm` on millions of rows, the performance hits are even more catastrophic than a simple sequential scan.

### The Search Engine Contrast

If we take this exact same 5 million row dataset and index it in a purpose-built search engine like Typesense, the performance difference is staggering.

When you issue a search request to Typesense:

```json
{
  "q": "gaming laptop",
  "query_by": "description"
}
```

The response time drops from ~1.5 seconds to 5 milliseconds!

```json
{
  "found": 1,
  "out_of": 5000000,
  "search_time_ms": 5,
  "hits": [
    {
      "document": {
        "id": "4900000",
        "name": "Product 4900000",
        "description": "The ultimate gaming laptop with high specs"
      }
      // Highlights and relevance metadata omitted for brevity
    }
  ]
}
```

Because Typesense is purpose-built for search, it stores data in highly optimized, memory-mapped data structures that don't need to scan every record. The result is instant, search-as-you-type performance that Postgres `ILIKE` simply cannot match at scale.

Typesense also solves additional limitations of Postgres `LIKE`/`ILIKE` searches:

*   **Intelligent Relevance Ranking** - Results are automatically ranked by relevance. You can configure weights so that a match in a product `name` ranks higher than a match in its `description`.
*   **Instant Typo Tolerance** - Typo tolerance is active by default. A search for "iphne" will instantly find "iphone" in under 10ms with zero extra configuration.
*   **Automatic Accent and Character Normalization** - Accents, case variations, and special characters are normalized automatically, meaning "café" and "cafe" match seamlessly.

## Conclusion

Postgres `LIKE` and `ILIKE` pattern matching is a simple and effective solution for prototypes or applications with small datasets. However, as your database scales into the millions of rows, relational databases hit a hard wall in both raw scan times and search relevance UX. Offloading search workloads to a purpose-built search engine like Typesense becomes essential to guarantee sub-millisecond query performance, typo tolerance, and consumer-grade search results.
