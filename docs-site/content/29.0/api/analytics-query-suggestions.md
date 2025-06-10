---
sidebarDepth: 2
sitemap:
priority: 0.7
---

# Analytics & Query Suggestions

Typesense can aggregate search queries for both analytics purposes and for query suggestions.

## Enabling the feature

### When Self-Hosting

The Search analytics feature needs to be explicitly enabled via the `--enable-search-analytics` and `--analytics-dir`
flags for query suggestions and other analytics features to work.

```bash
./typesense-server --data-dir=/path/to/data --api-key=abcd \
  --enable-search-analytics=true \
  --analytics-dir=/path/to/analytics-data \
  --analytics-flush-interval=60
```

The `--analytics-flush-interval` flag determines how often the search query aggregations are persisted to the suggestion collection.

Set this to a smaller value (minimum value is `60` seconds) to get more frequent updates to the suggestion collection. Default value is: `3600` seconds (every hour).

### On Typesense Cloud

We automatically set `--enable-search-analytics=true` and `--analytics-flush-interval=300` (every 5 minutes) in
Typesense Cloud (more context in the section above).

### Disabling for specific queries

To disable analytics aggregation for specific search queries (for e.g. those originating from a test script), you can
set `enable_analytics: false` as a search query parameter.

## Query suggestions

You can capture the search queries that are happening in the system and use that to either track the popular queries or power an autosuggest
feature with them.

### Create a collection for queries

Let's first create a new collection to which search queries will be aggregated and logged to.

This collection is just like any other Typesense collection, except that it is automatically populated by Typesense with search queries that were sent to other collections.

The `q` and `count` fields are mandatory.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
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

  <template v-slot:Go>

```go
schema := &api.CollectionSchema{
  Name: "product_queries",
  Fields: []api.Field{
    {Name: "q", Type: "string"},
    {Name: "count", Type: "int32"},
  }}

client.Collections().Create(context.Background(), schema)
```

  </template>
  
  <template v-slot:Python>

```python
let schema = {
  "name": "product_queries",
  "fields": [
    {"name": "q", "type": "string" },
    {"name": "count", "type": "int32" }
  ]
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

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
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
rule_name = 'product_queries_aggregation'
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

  <template v-slot:Go>

```go
ruleName := "product_queries_aggregation"
ruleConfiguration := &api.AnalyticsRuleUpsertSchema{
  Type: "popular_queries",
  Params: api.AnalyticsRuleParameters{
    Source: api.AnalyticsRuleParametersSource{
      Collections: []string{"products"},
    },
    Destination: api.AnalyticsRuleParametersDestination{
      Collection: "product_queries",
    },
    ExpandQuery: pointer.False(),
    Limit:       pointer.Int(1000),
  },
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
  
  <template v-slot:Python>

```python
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
    "expand_query": False,
    "limit": 1000
  }
}

client.analytics.rules.upsert(ruleName, ruleConfiguration)
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

Please note that the `popular_queries` analytics type will only track queries that have a search result.

**Automatically expanding prefix search queries:**

While creating the analytics rule, you can set `expand_query: true` to make Typesense aggregate the expanded versions
of the search queries made. For e.g. if a user stops typing at `sho` and the hits were fetched for the word `shoe`,
setting this parameter to `true` will make Typesense aggregate the word `shoe` instead of `sho`. By default, this parameter
is set to `false`, i.e. we will capture the actual user queries (including prefix queries) without any expansion.

**NOTE:** This aggregation will happen every 5 minutes on Typesense Cloud.

### Send events via API

If you wish to send the search queries as events via the API, you can create an analytics rule that defines a `search`
event for consumption. By setting `enable_auto_aggregation` to `false`, only the search queries sent via the
API will be aggregated.

```json
{
  "name": "product_queries_aggregation",
  "type": "popular_queries",
  "params": {
    "source": {
      "collections": [
        "products"
      ],
      "enable_auto_aggregation": false,
      "events": [
        {
          "type": "search",
          "name": "products_search_event"
        }
      ]
    },
    "destination": {
      "collection": "product_queries"
    },
    "limit": 1000
  }
}
```

With this rule in place, you can now directly send the queries as `search` events, via the API.

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "type": "search",
            "name": "products_search_event",
            "data": {
                  "q": "running shoes",
                  "user_id": "1234"
            }
        }'
```


### Query suggestion UX

Once you've set up the analytics rules above, top search terms will start appearing in the destination collection.

You can now use the data in this collection just like any other Typesense collection and send search queries to it, to power a query suggestion UX.

You can also send queries to your main indices in parallel to show both query suggestions and actual results side-by-side, using [multi_search](federated-multi-search.md).

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
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

  <template v-slot:Go>

```go
searchRequests := api.MultiSearchSearchesParameter{
  Searches: []api.MultiSearchCollectionParameters{
    {
      Collection: pointer.Any("product_queries"),
      Q:          pointer.Any("shoe"),
      QueryBy:    pointer.Any("q"),
    },
    {
      Collection: pointer.Any("products"),
      Q:          pointer.Any("shoe"),
      QueryBy:    pointer.Any("product_name"),
    },
  },
}

client.MultiSearch.Perform(context.Background(), &api.MultiSearchParams{}, searchRequests)
```

  </template>
  
  <template v-slot:Python>

```python
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

client.multi_search.perform(searchRequests, {})
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

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
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

  <template v-slot:Go>

```go
schema := &api.CollectionSchema{
  Name: "no_hits_queries",
  Fields: []api.Field{
    {Name: "q", Type: "string"},
    {Name: "count", Type: "int32"},
  }}

client.Collections().Create(context.Background(), schema)
```

  </template>
    <template v-slot:Python>

```python
let schema = {
  "name": "no_hits_queries",
  "fields": [
    {"name": "q", "type": "string" },
    {"name": "count", "type": "int32" }
  ]
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

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
let ruleName =  'product_no_hits'
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
rule_name = 'product_no_hits'
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

  <template v-slot:Go>

```go
ruleName := "product_no_hits"
ruleConfiguration := &api.AnalyticsRuleUpsertSchema{
  Type: api.AnalyticsRuleUpsertSchemaTypeNohitsQueries,
  Params: api.AnalyticsRuleParameters{
    Source: api.AnalyticsRuleParametersSource{
      Collections: []string{"products"},
    },
    Destination: api.AnalyticsRuleParametersDestination{
      Collection: "no_hits_queries",
    },
    Limit: pointer.Int(1000),
  },
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
    <template v-slot:Python>

```python
let ruleName =  'product_no_hits'
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

client.analytics.rules.upsert(ruleName, ruleConfiguration)
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

## Counting events for popularity

Typesense allows you to track how often a particular document is clicked on or purchased. You can then use this
counter value to [rank search results based on popularity](/guide/ranking-and-relevance.md#ranking-based-on-relevance-and-popularity).

Let's say there's a collection with a `popularity` field that we will use as a counter:

```json
{
  "name": "products",
  "fields": [
    {"name": "title", "type": "string"},
    {"name": "popularity", "type": "int32", "optional": true}
  ]
}
```

We mark the `popularity` field as `optional` since we want to skip this field during indexing and let Typesense
increment the value of this field based on user interactions.

### Create an analytics rule

Let's define a `counter` analytics rule that will increment this field whenever a click event happens.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
let ruleName =  'product_clicks'
let ruleConfiguration = {
    "type": "counter",
    "params": {
        "source": {
            "collections": ["products"],
            "events":  [
              {"type": "click", "weight": 1, "name": "products_click_event"}
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
rule_name = 'product_clicks'
rule_configuration = {
    "type" => "counter",
    "params" => {
        "source": {
            "collections" => ["products"],
            "events" =>  [
              {"type" => "click", "weight" => 1, "name" => "products_click_event"}
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

<template v-slot:Go>

```go
ruleName := "product_clicks"
ruleConfiguration := &api.AnalyticsRuleUpsertSchema{
  Type: "counter",
  Params: api.AnalyticsRuleParameters{
    Source: api.AnalyticsRuleParametersSource{
      Collections: []string{"products"},
      Events: &[]struct {
        Name   string  "json:\"name\""
        Type   string  "json:\"type\""
        Weight float32 "json:\"weight\""
      }{
        {Type: "click", Weight: 1, Name: "products_click_event"},
      },
    },
    Destination: api.AnalyticsRuleParametersDestination{
      Collection:   "products",
      CounterField: pointer.Any("popularity"),
    },
  },
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
  <template v-slot:Python>

```python
let ruleName =  'product_clicks'
let ruleConfiguration = {
    "type": "counter",
    "params": {
        "source": {
            "collections": ["products"],
            "events":  [
              {"type": "click", "weight": 1, "name": "products_click_event"}
            ]
        },
        "destination": {
            "collection": "products",
            "counter_field": "popularity"
        }
    }
}

client.analytics.rules.upsert(ruleName, ruleConfiguration)
```

  </template>

<template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
        "name": "product_clicks",
        "type": "counter",
        "params": {
            "source": {
                "collections": ["products"],
                "events":  [
                    {"type": "click", "weight": 1, "name": "products_click_event"}
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

The counter rule indicates which collection must be tracked and where the counter value should be stored.
The `weight` property of the event parameter determines the size of the increments. In this case, we want to increment
the `popularity` field by 1 every time a `click` event is sent to Typesense that's associated with that document.

### Sending click events

Once this counter rule is in-place, you can send start sending click events using the event name that we configured in the counter rule
earlier (`products_click_counter`):

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "type": "click",
            "name": "products_click_event",
            "data": {
                  "doc_id": "1024",
                  "user_id": "111112"
            }
        }'
```

The click events are aggregated, and the `popularity` field of the document with `id` specified in the
`doc_id` event data is incremented. Frequency of aggregation is controlled by the `--analytics-flush-interval` option.

:::tip
Ensure that the `doc_id` sent in the event payload matches with the actual `id` of the document stored in the
destination collection.
:::

### Aggregating multiple events

In fact, you can set up a counter rule that gives different weights to different events.

| Event Type | Description                                                             |
|:-----------|:------------------------------------------------------------------------|
| click      | Tracking clicks against documents returned in search response.          |
| conversion | Tracking conversion (e.g. purchase) of specific documents.              |
| visit      | Tracking page visits to specific documents, useful for recommendations. |

Let's setup a rule for aggregating both `click` and `conversion` events.

```json
{
  "name": "products_popularity",
  "type": "counter",
  "params": {
    "source": {
      "collections": [
        "products"
      ],
      "events": [
        {
          "type": "click",
          "weight": 1,
          "name": "products_click_event"
        },
        {
          "type": "conversion",
          "weight": 2,
          "name": "products_purchase_event"
        }
      ]
    },
    "destination": {
      "collection": "products",
      "counter_field": "popularity"
    }
  }
}
```

You can now send a `conversion` event via the API.

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "type": "conversion",
            "name": "products_purchase_event",
            "data": {
                  "doc_id": "1022",
                  "user_id": "111117"
            }
        }'
```

Since we've configured a `conversion` event to have a weight of `2`, the `popularity` field in the `products`
collection will be incremented by `2` for every conversion event.

## Listing all rules

The listing API allows you to list all the analytics rules stored in your Typesense cluster.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">


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

  <template v-slot:Go>

```go
client.Analytics().Rules().Retrieve(context.Background())
```

  </template>

  <template v-slot:Python>

```python
client.analytics.rules.retrieve()
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

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">


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

  <template v-slot:Go>

```go
client.Analytics().Rule("product_queries_aggregation").Delete(context.Background())
```

  </template>


  <template v-slot:Python>

```python
client.analytics.rules('product_queries_aggregation').delete()
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