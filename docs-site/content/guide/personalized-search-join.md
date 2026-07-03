# Personalizing Search Results with JOINs

Personalized search tailors search results to individual users or user groups based on their characteristics, preferences, or context. This is commonly used in e-commerce platforms to show tier-based pricing, subscription services to filter content by access level, multi-tenant applications to restrict data by organization, marketplaces to display region-specific inventory or pricing, user-generated records where users can create favorites and search through their favorites, etc.

This guide shows you how to use Typesense's <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html`">JOIN feature</RouterLink> to personalize search results by combining data from multiple collections at query time.

We'll use a practical example of implementing tier-based product pricing, where different users (VIP, GOLD, SILVER) see different prices for the same products.

## The Problem

Modern applications often need to serve different data to different users. In our e-commerce example, let's say you have the following criteria:

* VIP users get better prices.
* Different regions have different pricing.
* Promotions vary by user segment.

Let's say you have:

* A **products** <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">collection</RouterLink>  with base pricing.
* A **pricing overrides** collection based on user tier and region.

You need to handle search queries like:

* "Show me the price of Apple Watch for a GOLD tier user in Europe".
* "What's the VIP pricing for wireless headphones in the US?".
* "Search for laptops with SILVER tier pricing in Asia".

In each case, you want to show user-specific data when available and fall back to defaults otherwise. This is a common pattern across many personalization use cases.

## Traditional Approach (SQL)

In a relational database like MySQL or PostgreSQL, you would typically use a `LEFT JOIN` with `COALESCE` to merge personalized pricing:

```sql
SELECT 
  p.id,
  p.name,
  p.base_price,
  COALESCE(up.custom_price, p.base_price) AS final_price
FROM products p
LEFT JOIN user_prices up 
  ON p.id = up.product_id
  AND up.tier = 'VIP'
  AND up.region = 'IN'
WHERE 
  p.name ILIKE '%wireless%'
ORDER BY p.rating DESC
LIMIT 20;
```

While this works, it comes with challenges at scale:

* **Index management**: You need multiple manually-tuned indexes for text search, JOIN conditions, and sorting. Each consumes disk space and slows writes.
* **Concurrency**: Each concurrent user runs a separate JOIN, consuming CPU and memory. Under high load, connection pool exhaustion and lock contention become bottlenecks.
* **Scaling**: Horizontal scaling requires complex sharding or read replicas. Adding personalization dimensions (promotions, A/B tests) makes queries exponentially more complex.
* **Limited search**: `ILIKE` doesn't support typo tolerance, synonym matching, or relevance ranking.

## Typesense Approach

Typesense allows you to combine full-text search, filtering, and JOINs across collections in a single query, while handling these operations in-memory with sub-millisecond latency. It scales horizontally by adding nodes, and requires no manual index management or query optimization.

Let's see how this works in practice. In the following example, we'll create three collections: `products`, `user_prices`, and `inventory`. The `products` collection will store product information, `user_prices` will store user-specific pricing, and `inventory` will track regional stock levels.

## Step 1: Define Collections

First, create a collection schema for your products:

```json
{
  "name": "products",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "name", "type": "string" },
    { "name": "description", "type": "string" },
    { "name": "category", "type": "string", "facet": true },
    { "name": "brand", "type": "string", "facet": true },
    { "name": "rating", "type": "float" },
    { "name": "base_price", "type": "float" },
    { "name": "tags", "type": "string[]", "facet": true }
  ],
  "default_sorting_field": "rating"
}
```

Next, create a collection for user-specific pricing:

```json
{
  "name": "user_prices",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "product_id", "type": "string", "reference": "products.id", "async_reference": true },
    { "name": "tier", "type": "string", "facet": true },
    { "name": "region", "type": "string", "facet": true },
    { "name": "custom_price", "type": "float" },
    { "name": "promotion", "type": "string", "optional": true, "facet": true }
  ]
}
```

Finally, create a collection for regional inventory tracking:

```json
{
  "name": "inventory",
  "fields": [
    { "name": "product_id", "type": "string", "reference": "products.id", "async_reference": true },
    { "name": "warehouse", "type": "string", "facet": true },
    { "name": "in_stock", "type": "bool" },
    { "name": "quantity", "type": "int32" }
  ]
}
```

The `reference` field in the `user_prices` and `inventory` collections enables JOINs with the `products` collection.

:::tip
Notice that we've also set <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html#asynchronous-references`"><code>async_reference: true</code></RouterLink> on these fields. This allows documents in `user_prices` and `inventory` to be indexed successfully even if the referenced `products` document doesn't exist yet. Typesense will automatically resolve the relationship when the referenced document is indexed later.
:::

## Step 2: Index Sample Data

Download the sample dataset:

```bash
curl -O https://dl.typesense.org/personalized-search-join-sample-dataset.tar.gz
tar -xzf personalized-search-join-sample-dataset.tar.gz
```

This should give you three files:

- inventory.jsonl
- products.jsonl and 
- user_prices.jsonl

Load all datasets into Typesense:

```shell
curl -X POST "http://localhost:8108/collections/products/documents/import?action=create" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -H "Content-Type: text/plain" \
  --data-binary @products.jsonl

curl -X POST "http://localhost:8108/collections/user_prices/documents/import?action=create" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -H "Content-Type: text/plain" \
  --data-binary @user_prices.jsonl

curl -X POST "http://localhost:8108/collections/inventory/documents/import?action=create" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -H "Content-Type: text/plain" \
  --data-binary @inventory.jsonl
```

Here's an example of what a product document looks like:

```json
{
  "id": "p1",
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
  "category": "electronics",
  "brand": "SoundMax",
  "rating": 4.7,
  "base_price": 5000,
  "tags": ["audio", "wireless", "noise-cancelling"]
}
```

A corresponding pricing override for VIP users in the US:

```json
{
  "product_id": "p1",
  "tier": "VIP",
  "region": "US",
  "custom_price": 4200
}
```

And an inventory record for the same product:

```json
{
  "product_id": "p1",
  "warehouse": "US-WEST",
  "in_stock": true,
  "quantity": 150
}
```

The datasets include products across different categories, with pricing overrides for various tier and region combinations, and inventory records for different warehouses. Some products intentionally have no pricing overrides, which we'll use later to demonstrate fallback behavior.

## Step 3: Query with JOIN

### Basic Query

To search for products and include personalized pricing for a VIP user in the US:

```json
{
  "searches": [
    {
      "collection": "products",
      "q": "wireless headphones",
      "query_by": "name,description,tags",
      "filter_by": "$user_prices(tier:=VIP && region:=US)",
      "include_fields": "$user_prices(custom_price)"
    }
  ]
}
```

The `$user_prices(...)` syntax in `filter_by` triggers the JOIN with the `user_prices` collection and filters for matching pricing records. The `include_fields` parameter with `$user_prices(custom_price)` specifies which fields to include from the joined collection. The join relationship is established through the `reference` field defined in the `user_prices` collection schema.

**Important:** By default, Typesense performs an **inner join**. This means only products that have a matching record in `user_prices` will appear in results. Products without a VIP/US pricing override will be excluded entirely. If you want all products to appear regardless of whether they have personalized pricing, see the section below.

Notice how this is already much simpler than the SQL approach we saw earlier? The Typesense query is more concise and easier to understand. It can be easily extended with additional parameters like <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#faceting-parameters`">facets</RouterLink>, <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#filter-parameters`">filters</RouterLink>, and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#sort-results`">sorting</RouterLink>.

### Including Products Without Personalized Pricing

The basic query above uses an inner join, which excludes products without matching pricing records. Any product in the dataset that has no entries in `user_prices` for the specified tier and region will not appear in results.

To include **all** matching products and attach personalized pricing only when available, use a **left join** by combining `id:*` (which matches all documents) with the JOIN filter using the `||` (OR) operator:

```json
{
  "searches": [
    {
      "collection": "products",
      "q": "premium",
      "query_by": "name,description",
      "filter_by": "id:* || $user_prices(tier:=VIP && region:=US)",
      "include_fields": "$user_prices(custom_price)"
    }
  ]
}
```

With the left join, products that have VIP/US pricing overrides will include the `custom_price` from `user_prices`, while products without matching pricing records will still appear in results with only their `base_price`.

Here's how the two approaches compare for the same search query:

| Product | Has VIP/US pricing? | Inner Join result | Left Join result |
|---------|---------------------|-------------------|------------------|
| Product A | ✅ Yes | ✅ Returned with `custom_price` | ✅ Returned with `custom_price` |
| Product B | ✅ Yes | ✅ Returned with `custom_price` | ✅ Returned with `custom_price` |
| Product C | ❌ No | ❌ Excluded from results | ✅ Returned with `base_price` only |

Your application logic can then check whether personalized pricing exists and fall back to `base_price` when it doesn't (see the [Fallback Strategies](#fallback-strategies) section below).

### Advanced Query with Faceting and Sorting

For a production-ready search experience with facets, filters, and sorting:

```json
{
  "searches": [
    {
      "collection": "products",
      "q": "wireless headphones",
      "query_by": "name,description,tags",
      "filter_by": "rating:>=4.0 && category:=electronics && $user_prices(tier:=VIP && region:=US)",
      "include_fields": "$user_prices(custom_price,promotion)",
      "facet_by": "brand,category,tags",
      "max_facet_values": 20,
      "sort_by": "_text_match:desc,rating:desc",
      "per_page": 20,
      "page": 1,
      "highlight_fields": "name,description",
      "highlight_full_fields": "name,description"
    }
  ]
}
```

This query:

* **Searches** across name, description, and tags with typo tolerance.
* **Filters** for high-rated electronics.
* **Facets** by brand, category, and tags for refinement.
* **Sorts** by relevance first, then rating.
* **Highlights** matching terms in results.
* **Joins** personalized pricing for VIP users in the US.
* **Paginates** results (20 per page).

### Multi-Dimensional Personalization

For complex personalization with multiple conditions:

```json
{
  "searches": [
    {
      "collection": "products",
      "q": "laptop",
      "query_by": "name,description,tags",
      "filter_by": "rating:>=4.0 && $user_prices((tier:=VIP && region:=US && promotion:=summer_sale) || (tier:=VIP && region:=US))",
      "include_fields": "$user_prices(custom_price,promotion)",
      "facet_by": "brand,category"
    }
  ]
}
```

This query uses the `||` (OR) operator to match pricing records where:

1. The user has VIP tier, US region, **and** an active `summer_sale` promotion, **or**
2. The user has VIP tier and US region (regardless of promotion).

If both conditions match, all matching records are returned. Your application logic can then prioritize the promotion price over the regular tier price (see the [Fallback Strategies](#fallback-strategies) section below).

### Sorting by Personalized Price

To sort products by their personalized price from the joined collection, use the `$collection(field:direction)` syntax in `sort_by`:

```json
{
  "searches": [
    {
      "collection": "products",
      "q": "*",
      "query_by": "name",
      "filter_by": "$user_prices(tier:=VIP && region:=US)",
      "include_fields": "$user_prices(custom_price)",
      "sort_by": "$user_prices(custom_price:asc)"
    }
  ]
}
```

This sorts products by their personalized VIP price in ascending order. The `$user_prices(custom_price:asc)` syntax in `sort_by` tells Typesense to use the `custom_price` field from the joined `user_prices` collection for sorting.

### Multiple JOINs

Typesense supports joining multiple collections in a single query. Since we already created and loaded the `inventory` collection, we can query across all three collections using multiple `$collection(...)` references:

```json
{
  "searches": [
    {
      "collection": "products",
      "q": "laptop",
      "query_by": "name,description",
      "filter_by": "$user_prices(tier:=VIP && region:=US) && $inventory(warehouse:=US-WEST && in_stock:=true)",
      "include_fields": "$user_prices(custom_price), $inventory(warehouse,quantity)"
    }
  ]
}
```

This query returns products with both personalized pricing and regional inventory information, allowing you to show VIP prices only for items actually in stock at the relevant warehouse.

## Result Structure

Each product in the search results will include matching joined records as a nested object. When a single record matches from the joined collection:

```json
{
  "document": {
    "id": "p1",
    "name": "Wireless Headphones",
    "base_price": 5000,
    "user_prices": {
      "custom_price": 4200
    }
  }
}
```

When multiple records match (e.g., when a product has pricing for multiple tiers or when using the `id:*` filter), the joined field will be an array:

```json
{
  "document": {
    "id": "p1",
    "name": "Wireless Headphones",
    "base_price": 5000,
    "user_prices": [
      { "custom_price": 4200, "tier": "VIP" },
      { "custom_price": 4500, "tier": "GOLD" }
    ]
  }
}
```

Since the result format varies (object vs array) depending on the number of matches, you can use the `strategy: nest_array` option in `include_fields` to always return an array — even when there's only one match. This makes it easier to handle results consistently in your frontend code:

```json
{
  "include_fields": "$user_prices(custom_price,tier, strategy: nest_array)"
}
```

## Performance and Best Practices

### Query Performance

Typesense handles JOINs efficiently:

* **No index management**: Typesense automatically indexes all fields.
* **In-memory operations**: JOINs are computed in-memory for sub-millisecond performance.
* **Horizontal scaling**: Add more nodes to handle increased query load.
* **No connection pooling issues**: Typesense uses HTTP/2 for efficient connection reuse.

### Indexing Strategy

For optimal performance with personalized search:

1. **Keep pricing overrides in a separate collection**: This allows you to update prices without re-indexing products.
2. **Use reference fields**: The `reference` field type enables efficient JOINs.
3. **Index only what you need**: Don't add unnecessary fields to the pricing collection.
4. **Use faceting wisely**: Facet only on fields users will filter by.

### Handling High Concurrency

With thousands of concurrent users:

* Each query is independent and doesn't lock resources.
* Typesense's distributed architecture scales horizontally.
* Query results can be cached at the application level using user tier + region as cache keys.
* No query planner overhead - queries execute immediately.

### Data Volume Considerations

Typesense stores data in-memory, so plan your RAM capacity based on the size of your collections. Key factors that affect memory usage include the number of documents, the number and types of fields, and whether faceting is enabled.

For large datasets with millions of pricing records, consider:

* **Scoping your pricing collection**: Only index active pricing records rather than historical data.
* **Benchmarking your workload**: Test with realistic data volumes and query patterns to determine the right cluster configuration.
* **Scaling horizontally**: Add more nodes to distribute the dataset and query load across the cluster.

### Fallback Strategies

When using a left join, products without personalized pricing will not have a `user_prices` field in the response. Implement graceful fallbacks in your application:

```javascript
function getFinalPrice(product) {
  // Try to get personalized price
  if (product.user_prices && product.user_prices.length > 0) {
    // Check for promotion price first
    const promoPrice = product.user_prices.find(p => p.promotion);
    if (promoPrice) return promoPrice.custom_price;
    
    // Otherwise use regular tier price
    return product.user_prices[0].custom_price;
  }
  
  // Fallback to base price
  return product.base_price;
}
```

### Multi-Tier Fallback Query

For complex fallback logic (VIP → GOLD → base), make multiple searches:

```javascript
const searches = [
  {
    collection: "products",
    q: "laptop",
    query_by: "name,description",
    filter_by: "$user_prices(tier:=VIP && region:=US)",
    include_fields: "$user_prices(custom_price)"
  },
  {
    collection: "products",
    q: "laptop",
    query_by: "name,description",
    filter_by: "$user_prices(tier:=GOLD && region:=US)",
    include_fields: "$user_prices(custom_price)"
  }
];

// Merge results with priority to VIP pricing
const results = mergeWithPriority(vipResults, goldResults, baseResults);
```

## Comparing Approaches

| Capability              | SQL (e.g. PostgreSQL)                      | Typesense                           |
| ----------------------- | ------------------------------------------ | ----------------------------------- |
| JOINs                   | Yes                                        | Yes                                 |
| Full-text search        | Basic (ILIKE, trgm)                        | Advanced (typo tolerance, ranking)  |
| Typo tolerance          | No                                         | Yes (built-in)                      |
| Faceting                | Manual (GROUP BY)                          | Built-in                            |
| Personalization         | Complex (multiple indexes)                 | Simple (`$collection()` in queries) |
| Performance tuning      | Required (indexes, VACUUM, query planning) | Minimal (auto-indexed)              |
| Horizontal scaling      | Complex (sharding, replication)            | Built-in (add nodes)                |
| Query latency           | Degrades under load with JOINs             | Low-latency in-memory operations    |
| Index management        | Manual (CREATE INDEX, REINDEX)             | Automatic                           |
| Concurrent query impact | High (locks, connection pools)             | Low (in-memory, no locks)           |
| Memory usage            | Disk-based (slower)                        | In-memory (faster)                  |
| Highlighting            | Manual                                     | Built-in                            |
| Synonyms                | Manual (dictionaries)                      | Built-in                            |
| Geo-search              | PostGIS extension required                 | Built-in                            |

Read more about <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html`">JOINs in Typesense</RouterLink> including other relationship types like <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html#one-to-one-relation`">one-to-one</RouterLink>, <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html#many-to-many-relation`">many-to-many</RouterLink>, and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html#nested-joins`">nested joins</RouterLink>.

## Conclusion

Typesense's JOIN feature provides a powerful yet simple way to implement personalized search without the complexity and performance overhead of traditional database approaches. By combining collections at query time, you can deliver personalized results based on user attributes, preferences, or context while maintaining clean data separation between base content and user-specific overrides.

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
