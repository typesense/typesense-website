---
sidebarDepth: 2
sitemap:
priority: 0.7
---

# Query Analytics

Typesense helps you aggregate search queries for both analytics and for query suggestions.

## Create a collection for aggregation

Let's first create a collection where the queries will be aggregated. 

The `q` and `count` fields are mandatory.

```bash
curl -k "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "product_queries",
        "fields": [
          {"name": "q", "type": "string" },
          {"name": "count", "type": "int32" }
        ]
      }'
```

## Create an analytics rule

We can now create a `popular_queries` analytics rule that stores the most frequently occurring search queries 
in the collection we created above. We limit the popular queries to the top 1000 queries via the `limit` parameter. 

```bash
curl -k "http://localhost:8108/analytics/rules" -X POST -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "product_queries_aggregation",
        "type": "popular_queries",
        "params": {
            "source": {
                "collections": ["products"]
            },
            "destination": {
                "collection": "product_queries"
            },
            "limit": 1000
        }
        
    }'
```

That's it. Searches will now be aggregated: whenever you make a search on the source collection (`products` in this case), 
the query will be sent to the destination collection for aggregation, based on the `analytics-flush-interval` configuration on 
your Typesense cluster. **NOTE:** This aggregation will happen every 10 minutes on Typesense Cloud.

When you query the source collection, you can optionally send a `x-typesense-user-id` parameter or 
a `X-TYPESENSE-USER-ID` header to indicate the user who made this particular search request (by default, Typesense uses the 
client IP address for aggregation).

Since Typesense could be used for type-ahead searches, a search query is counted for aggregation only when there is 
atleast a **4 second pause** after the query. For example, `f -> fo -> foo -> 4 second pause` will register the `foo` query.

:::tip
Be mindful of this 4-second interval. When you are testing locally make sure that you don't fire too many queries 
in a short interval and expect all of them to be aggregated.
:::

## List all rules

The listing API allows you to list all the analytics rules stored in your Typesense cluster.

```bash
curl -k "http://localhost:8108/analytics/rules" -X GET -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" 
```

## Remove the analytics rule

Removing the analytics will stop aggregation of new queries, but the already aggregated queries will still be present
in the `product_queries` collection.

```bash
curl -k "http://localhost:8108/analytics/rules/product_queries_aggregation" -X DELETE -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" 
```