---
sidebarDepth: 2
sitemap:
priority: 0.7
---

# Analytics & Query Suggestions

Typesense can aggregate search queries for both analytics purposes and for query suggestions.

## Enabling the feature

### When Self-Hosting

The Search analytics feature needs to be explicitly enabled via the `--enable-search-analytics` and `--analytics-dir=/path/to/tsanalytics` flags 
for query suggestions and other analytics features to work.

```bash
./typesense-server --data-dir=/tmp/data --api-key=abcd --enable-search-analytics=true --analytics-dir=/tmp/tsanalytics --analytics-flush-interval=60
```

Search queries are first aggregated in-memory in every Typesense node independently and then persisted in a configured search suggestions collection (see below) periodically. 

The `--analytics-flush-interval` flag determines how often the search query aggregations are persisted to the suggestion collection. 

Set this to a smaller value (minimum value is `60` seconds) to get more frequent updates to the suggestion collection. Default value is: `3600` seconds (every hour).

### On Typesense Cloud

We automatically set `--enable-search-analytics=true` and `--analytics-flush-interval=300` (every 5 minutes) in Typesense Cloud (more context in the section above).

## Query suggestions

You can capture the search queries that are happening in the system and use that to either track the popular queries or power an autosuggest 
feature with them.

### Create a collection for queries

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

### Create an analytics rule

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
    "expand_query": false,
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
curl -k "http://localhost:8108/analytics/rules" \
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

**Automatically expanding prefix search queries:**

While creating the analytics rule, you can set `expand_query: true` to make Typesense aggregate the expanded versions 
of the search queries made. For e.g. if a user stops typing at `sho` and the hits were fetched for the word `shoe`, 
setting this parameter to `true` will make Typesense aggregate the word `shoe` instead of `sho`. By default, this parameter
is set to `false`, i.e. we will capture the actual user queries (including prefix queries) without any expansion.

**NOTE:** This aggregation will happen every 5 minutes on Typesense Cloud.


### Query suggestion UX

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

#### Aggregation key

When you send a search query to the source collection, you can optionally send a `x-typesense-user-id` parameter or 
a `X-TYPESENSE-USER-ID` header to indicate the user who made this particular search request. When not specified, Typesense uses the client IP address for aggregation by default.

Since Typesense could be used for type-ahead searches, a search query is counted for aggregation only when there is 
at least a **4-second pause** after the query. For example, `f -> fo -> foo -> 4 second pause` will register the `foo` query.

:::tip
When testing locally, please be mindful of this 4-second pause and also the `analytics-flush-interval` configuration. 

If you send a lot of queries to the source collection in a short period of time, search terms might not appear in the destination collection right away.  
:::

## No hits queries

Like popular queries, you can track queries that produced no hits as well. You can use these queries to identify gaps in your content.

### Create a collection for queries

Let's first create a new collection to which search queries that produce no hits will be aggregated and logged to.

This collection is just like any other Typesense collection, except that it is automatically populated by Typesense with 
no-hits search queries.

The `q` and `count` fields are mandatory.

<Tabs :tabs="['JavaScript','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  "name": "no_hits_queries",
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
  'name'      => 'no_hits_queries',
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
        "name": "no_hits_queries",
        "fields": [
          {"name": "q", "type": "string" },
          {"name": "count", "type": "int32" }
        ]
      }'
```

  </template>
</Tabs>

### Create an analytics rule

We will track the most `1000` frequently occurring queries that don't produce a hit when the `products` collection is searched. These queries are then 
aggregated in `no_hits_queries` collection.

<Tabs :tabs="['JavaScript','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let ruleName =  'product_queries_aggregation'
let ruleConfiguration = {
  "type": "nohits_queries",
  "params": {
    "source": {
      "collections": ["products"]
    },
    "destination": {
      "collection": "no_hits_queries"
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
  'type' => 'nohits_queries',
  'params' => {
    'source' => {
      'collections' => ['products']
    },
    'destination' => {
      'collection' => 'no_hits_queries'
    },
    'limit' => 1000
  }
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
        "name": "product_no_hits",
        "type": "nohits_queries",
        "params": {
            "source": {
                "collections": ["products"]
            },
            "destination": {
                "collection": "no_hits_queries"
            },
            "limit": 1000
        }
      }'
```

  </template>

</Tabs>


## Aggregating click counts

Typesense allows you to track how often a particular document is clicked on. You can use then use this counter value for ranking the results on popularity.

Let's say there's a collection with a `popularity` field that we will use for tracking clicks:

```json
{                                        
  "name": "products",           
  "fields": [       
    {"name": "title", "type": "string"},
    {"name": "popularity", "type": "int32", "optional": true}
  ]                                    
}
```

We mark the `popularity` field as `optional` since we want to skip this field during indexing and let Typesense increment the value of this field based on 
user interactions.

### Create an analytics rule

Let's define a `counter` analytics rule that will increment this field whenever a click event happens.

<Tabs :tabs="['JavaScript','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let ruleName =  'product_queries_aggregation'
let ruleConfiguration = {
    "name": "products_popularity",
    "type": "counter",
    "params": {
        "source": {
            "collections": ["products"],
            "events":  [
              {"type": "click", "weight": 1, "name": "products_click_counter"}
            ]
        },
        "destination": {
            "collection": "products",
            "counter_field": "popularity"
        }
    }
}

client.analytics.rules().upsert(ruleName, ruleConfiguration)
```

  </template>

<template v-slot:Ruby>

```rb
rule_name = 'popular_queries'
rule_configuration = {
    "name" => "products_popularity",
    "type" => "counter",
    "params" => {
        "source": {
            "collections" => ["products"],
            "events" =>  [
              {"type" => "click", "weight" => 1, "name" => "products_click_counter"}
            ]
        },
        "destination" => {
            "collection" => "products",
            "counter_field" => "popularity"
        }
    }
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

<template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
        "name": "products_popularity",
        "type": "counter",
        "params": {
            "source": {
                "collections": ["products"],
                "events":  [
                    {"type": "click", "weight": 1, "name": "products_click_counter"}
                ]
            },
            "destination": {
                "collection": "products",
                "counter_field": "popularity"
            }
        }
      }'
```

</template>

</Tabs>

The counter rule indicates which collection must be tracked and where the counter value should be stored. The `weight` property of the event parameter 
determines the size of the increments. In this case, we want to increment the `popularity` field by 1 every time a click is made against that document.

### Send click events

Once this counter rule is in-place, you can send start sending click events using the event name that we configured in the counter rule 
earlier (`products_click_counter`):

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
      "type": "click",
      "name": "products_click_counter",
      "data": {
            "q": "nike shoes",
            "doc_id": "1024",
            "user_id": "111112"
      }
}'
```

The click events are aggregated, and the `popularity` field in the collection is incremented based on the frequency specified by the 
`--analytics-flush-interval` option.

## Listing all rules

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
