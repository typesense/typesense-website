---
sidebarDepth: 2
sitemap:
priority: 0.7
---

# Analytics & Query Suggestions

Typesense can aggregate search queries for both analytics purposes and for query suggestions.

## Enable the feature

### When Self-Hosting

The Search analytics feature needs to be explicitly enabled via the `--enable-search-analytics` flag for query suggestions and other analytics features to work.

```bash
./typesense-server --data-dir=/tmp/data --api-key=abcd --enable-search-analytics=true --analytics-flush-interval=60
```

Search queries are first aggregated in-memory in every Typesense node independently and then persisted in a configured search suggestions collection (see below) periodically. 

The `--analytics-flush-interval` flag determines how often the search query aggregations are persisted to the suggestion collection. 

Set this to a smaller value (minimum value is `60` seconds) to get more frequent updates to the suggestion collection. Default value is: `3600` seconds (every hour).

### On Typesense Cloud

We automatically set `--enable-search-analytics=true` and `--analytics-flush-interval=300` (every 5 minutes) in Typesense Cloud (more context in the section above).

## Create a collection for aggregation

Let's first create a new collection to which search queries will be aggregated and logged to.

This collection is just like any other Typesense collection, except that it is automatically populated by Typesense with search queries that were sent to other collections.

The `q` and `count` fields are mandatory.

<Tabs :tabs="['JavaScript','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  "name": "product_queries",
  "fields": [
    {"name": "q", "type": "string" },
    {"name": "count", "type": "int32" }
  ]
}

client.collections().create(schema)
```

  </template>

  <template v-slot:Ruby>

```rb
schema = {
  'name'      => 'product_queries',
  'fields'    => [
    {
      'name'  => 'q',
      'type'  => 'string'
    },
    {
      'name'  => 'count',
      'type'  => 'int32'
    }
  ],
  'default_sorting_field' => 'count'
}

client.collections.create(schema)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/collections" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
        "name": "product_queries",
        "fields": [
          {"name": "q", "type": "string" },
          {"name": "count", "type": "int32" }
        ]
      }'
```

  </template>
</Tabs>

## Create an analytics rule

We can now create a `popular_queries` analytics rule that stores the most frequently occurring search queries 
in the collection we created above. We limit the popular queries to the top 1000 queries via the `limit` parameter. 

<Tabs :tabs="['JavaScript','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let ruleName =  'product_queries_aggregation'
let ruleConfiguration = {
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
}

client.analytics.rules().upsert(ruleName, ruleConfiguration)
```

  </template>

  <template v-slot:Ruby>

```rb
rule_name = 'popular_queries'
rule_configuration = {
  'type' => 'popular_queries',
  'params' => {
    'source' => {
      'collections' => ['products']
    },
    'destination' => {
      'collection' => 'product_queries'
    },
    'limit' => 1000
  }
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" 
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
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

  </template>

</Tabs>


That's it! 

Search queries will now be aggregated and stored in the `product_queries` (destination) collection, whenever you make a search on the `products` (source) collection.

Queries will be aggregated and sent to the destination collection based on the `analytics-flush-interval` configuration on 
your Typesense cluster. 

**NOTE:** This aggregation will happen every 5 minutes on Typesense Cloud.

### Aggregation key

When you send a search query to the source collection, you can optionally send a `x-typesense-user-id` parameter or 
a `X-TYPESENSE-USER-ID` header to indicate the user who made this particular search request. When not specified, Typesense uses the client IP address for aggregation by default.

Since Typesense could be used for type-ahead searches, a search query is counted for aggregation only when there is 
at least a **4-second pause** after the query. For example, `f -> fo -> foo -> 4 second pause` will register the `foo` query.

:::tip
When testing locally, please be mindful of this 4-second pause and also the `analytics-flush-interval` configuration. 

If you send a lot of queries to the source collection in a short period of time, search terms might not appear in the destination collection right away.  
:::

## List all rules

The listing API allows you to list all the analytics rules stored in your Typesense cluster.

<Tabs :tabs="['JavaScript','Ruby','Shell']">


  <template v-slot:JavaScript>

```js
typesense.analytics.rules().retrieve()
```

  </template>

  <template v-slot:Ruby>

```rb
typesense.analytics.rules.retrieve
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X GET \ 
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" 
```

  </template>
</Tabs>

## Remove a rule

Removing an analytics rule will stop aggregation of new queries, but the already aggregated queries will still be present in the destination collection.

<Tabs :tabs="['JavaScript','Ruby','Shell']">


  <template v-slot:JavaScript>

```js
typesense.analytics.rules('product_queries_aggregation').delete()
```

  </template>

  <template v-slot:Ruby>

```rb
typesense.analytics.rules['product_queries_aggregation'].delete
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules/product_queries_aggregation" 
      -X DELETE \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" 
```

  </template>
</Tabs>

## Query Suggestions

Once you've set up the analytics rules above, top search terms will start appearing in the destination collection. 

You can now use the data in this collection just like any other Typesense collection and send search queries to it, to power a query suggestion UX. 

You can also send queries to your main indices in parallel to show both query suggestions and actual results side-by-side, using [multi_search](federated-multi-search.md).

<Tabs :tabs="['JavaScript','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchRequests = {
  'searches': [
    {
      'collection': 'product_queries',
      'q': 'shoe',
      'query_by': 'q'
    },
    {
      'collection': 'products',
      'q': 'shoe',
      'query_by': 'product_name'
    }
  ]
}

client.multiSearch.perform(searchRequests, {})
```

  </template>

  <template v-slot:Ruby>

```rb
search_requests = {
  'searches' => [
    {
      'collection' => 'product_queries',
      'q' => 'shoe',
      'query_by' => 'q'
    },
    {
      'collection' => 'products',
      'q' => 'shoe',
      'query_by' => 'q'
    }
  ]
}

client.multi_search.perform(search_requests, {})
```

  </template>
 
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/multi_search" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "searches": [
            {
              "collection": "product_queries",
              "q": "shoe",
              "query_by": "q"
            },
            {
              "collection": "products",
              "q": "shoe",
              "query_by": "q"
            }
          ]
        }'
```

  </template>
</Tabs>
