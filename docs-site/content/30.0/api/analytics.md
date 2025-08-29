---
sidebarDepth: 2
sitemap:
priority: 0.7
---

# Analytics

Typesense can aggregate search queries and track user interaction events (clicks, conversions, visits) for query suggestions, document popularity scoring, and personalization.

### Analytics rule types and event types

- **Analytics rule types (`type`)**:
  - `popular_queries`: Aggregate the most frequently occurring queries into a destination collection.
  - `nohits_queries`: Track queries that produced zero results, to identify content gaps.
  - `counter`: Increment a numeric counter field on documents based on user interaction events.
  - `log`: Log raw analytics events for downstream processing. Log-type rules are used for personalization model training and also consulted during inference.

- **Supported event types (`event_type`)**:
  - `query`: A search query event (optionally with metadata like `filter_by`, `analytics_tag`).
  - `click`: A user clicked a document returned in search results.
  - `conversion`: A user completed a conversion action (e.g. purchase) for a document.
  - `visit`: A page/document view event, useful for recommendations.

## Enabling the feature

### When Self-Hosting

The analytics feature needs to be explicitly enabled via the `--enable-search-analytics` and `--analytics-dir`
flags for analytics features to work.

```bash
./typesense-server --data-dir=/path/to/data --api-key=abcd \
  --enable-search-analytics=true \
  --analytics-dir=/path/to/analytics-data \
  --analytics-flush-interval=60
```

The `--analytics-flush-interval` flag determines how often the analytics events are aggregated and persisted to their respective destination collection or the disk for log events.

Set this to a smaller value (minimum value is `60` seconds) to get more frequent updates to the suggestion collection. Default value is: `3600` seconds (every hour).

### On Typesense Cloud

We automatically set `--enable-search-analytics=true` and `--analytics-flush-interval=300` (every 5 minutes) in
Typesense Cloud (more context in the section above).

### Disabling for specific queries

To disable analytics aggregation for specific search queries (for e.g. those originating from a test script), you can
set `enable_analytics: false` as a search query parameter.

## Create analytics rules

You can create a single analytics rule or multiple rules in one request. Use `rule_tag` to label rules for easy retrieval later.

### Create a single rule

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const rule = {
  name: 'homepage_popular_queries',
  type: 'popular_queries',
  collection: 'products',
  event_type: 'query',
  rule_tag: 'homepage',
  params: {
    destination_collection: 'product_queries',
    limit: 100,
    capture_search_requests: true,
  },
}

await client.analytics.rules().create(rule)
```

  </template>

  <template v-slot:Ruby>

```rb
rule = {
  'name' => 'homepage_popular_queries',
  'type' => 'popular_queries',
  'collection' => 'products',
  'event_type' => 'query',
  'rule_tag' => 'homepage',
  'params' => {
    'destination_collection' => 'product_queries',
    'limit' => 100,
    'capture_search_requests' => true,
  }
}

typesense.analytics.rules.create(rule)
```

  </template>

  <template v-slot:Go>

```go
rule := map[string]interface{}{
  "name":       "homepage_popular_queries",
  "type":       "popular_queries",
  "collection": "products",
  "event_type": "query",
  "rule_tag":   "homepage",
  "params": map[string]interface{}{
    "destination_collection":  "product_queries",
    "limit":                   100,
    "capture_search_requests": true,
  },
}

_, err := client.Analytics().Rules().Create(context.Background(), rule)
_ = err
```

  </template>
  
  <template v-slot:Python>

```python
rule = {
    "name": "homepage_popular_queries",
    "type": "popular_queries",
    "collection": "products",
    "event_type": "query",
    "rule_tag": "homepage",
    "params": {
        "destination_collection": "product_queries",
        "limit": 100,
        "capture_search_requests": True,
    },
}

client.analytics.rules.create(rule)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
        "name": "homepage_popular_queries",
        "type": "popular_queries",
        "collection": "products",
        "event_type": "query",
        "rule_tag": "homepage",
        "params": {
          "destination_collection": "product_queries",
          "limit": 100,
          "capture_search_requests": true
        }
      }'
```

  </template>
</Tabs>

### Create multiple rules (array)

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const rules = [
  {
    name: 'homepage_popular_queries',
    type: 'popular_queries',
    collection: 'products',
    event_type: 'query',
    rule_tag: 'homepage',
    params: { destination_collection: 'product_queries', limit: 100, capture_search_requests: true },
  },
  {
    name: 'homepage_nohits_queries',
    type: 'nohits_queries',
    collection: 'products',
    event_type: 'query',
    rule_tag: 'homepage',
    params: { destination_collection: 'no_hits_queries', limit: 100 },
  },
]

await client.analytics.rules().create(rules)
```

  </template>

  <template v-slot:Ruby>

```rb
rules = [
  {
    'name' => 'homepage_popular_queries',
    'type' => 'popular_queries',
    'collection' => 'products',
    'event_type' => 'query',
    'rule_tag' => 'homepage',
    'params' => { 'destination_collection' => 'product_queries', 'limit' => 100, 'capture_search_requests' => true }
  },
  {
    'name' => 'homepage_nohits_queries',
    'type' => 'nohits_queries',
    'collection' => 'products',
    'event_type' => 'query',
    'rule_tag' => 'homepage',
    'params' => { 'destination_collection' => 'no_hits_queries', 'limit' => 100 }
  }
]

typesense.analytics.rules.create(rules)
```

  </template>

  <template v-slot:Go>

```go
rules := []map[string]interface{}{
  {
    "name":       "homepage_popular_queries",
    "type":       "popular_queries",
    "collection": "products",
    "event_type": "query",
    "rule_tag":   "homepage",
    "params": map[string]interface{}{
      "destination_collection":  "product_queries",
      "limit":                   100,
      "capture_search_requests": true,
    },
  },
  {
    "name":       "homepage_nohits_queries",
    "type":       "nohits_queries",
    "collection": "products",
    "event_type": "query",
    "rule_tag":   "homepage",
    "params": map[string]interface{}{
      "destination_collection": "no_hits_queries",
      "limit":                  100,
    },
  },
}

_, err := client.Analytics().Rules().Create(context.Background(), rules)
_ = err
```

  </template>
  
  <template v-slot:Python>

```python
rules = [
    {
        "name": "homepage_popular_queries",
        "type": "popular_queries",
        "collection": "products",
        "event_type": "query",
        "rule_tag": "homepage",
        "params": {"destination_collection": "product_queries", "limit": 100, "capture_search_requests": True},
    },
    {
        "name": "homepage_nohits_queries",
        "type": "nohits_queries",
        "collection": "products",
        "event_type": "query",
        "rule_tag": "homepage",
        "params": {"destination_collection": "no_hits_queries", "limit": 100},
    },
]

client.analytics.rules.create(rules)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '[
        {
          "name": "homepage_popular_queries",
          "type": "popular_queries",
          "collection": "products",
          "event_type": "query",
          "rule_tag": "homepage",
          "params": {"destination_collection": "product_queries", "limit": 100, "capture_search_requests": true}
        },
        {
          "name": "homepage_nohits_queries",
          "type": "nohits_queries",
          "collection": "products",
          "event_type": "query",
          "rule_tag": "homepage",
          "params": {"destination_collection": "no_hits_queries", "limit": 100}
        }
      ]'
```

  </template>
</Tabs>

## Popular Queries

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
  "name": ruleName,
  "type": "popular_queries",
  "collection": "products",
  "event_type": "query",
  "params": {
    "destination_collection": "product_queries",
    "expand_query": false,
    "limit": 1000,
    "capture_search_requests": true
  }
}

client.analytics.rules().upsert(ruleName, ruleConfiguration)
```

  </template>

  <template v-slot:Ruby>

```rb
rule_name = 'product_queries_aggregation'
rule_configuration = {
  'name' => rule_name,
  'type' => 'popular_queries',
  'collection' => 'products',
  'event_type' => 'query',
  'params' => {
    'destination_collection' => 'product_queries',
    'expand_query' => false,
    'limit' => 1000,
    'capture_search_requests' => true
  }
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

  <template v-slot:Go>

```go
ruleName := "product_queries_aggregation"
ruleConfiguration := map[string]interface{}{
  "name":        ruleName,
  "type":        "popular_queries",
  "collection":  "products",
  "event_type":  "query",
  "params": map[string]interface{}{
    "destination_collection":   "product_queries",
    "expand_query":             false,
    "limit":                    1000,
    "capture_search_requests":  true,
  },
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
  
  <template v-slot:Python>

```python
ruleName = 'product_queries_aggregation'
ruleConfiguration = {
  "name": ruleName,
  "type": "popular_queries",
  "collection": "products",
  "event_type": "query",
  "params": {
    "destination_collection": "product_queries",
    "expand_query": False,
    "limit": 1000,
    "capture_search_requests": True
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
        "collection": "products",
        "event_type": "query",
        "params": {
            "destination_collection": "product_queries",
            "expand_query": false,
            "limit": 1000,
            "capture_search_requests": true
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

If you wish to send the search queries as events via the API, you can create an analytics rule that defines a `query`
event for consumption. By setting `capture_search_requests` to `false` in the rule, only the search queries sent via the
API will be aggregated.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const rule = {
  name: 'product_queries_aggregation',
  type: 'popular_queries',
  collection: 'products',
  event_type: 'query',
  params: {
    destination_collection: 'product_queries',
    limit: 1000,
    capture_search_requests: false,
  },
}

await client.analytics.rules().create(rule)
```

  </template>

  <template v-slot:Ruby>

```rb
rule = {
  'name' => 'product_queries_aggregation',
  'type' => 'popular_queries',
  'collection' => 'products',
  'event_type' => 'query',
  'params' => {
    'destination_collection' => 'product_queries',
    'limit' => 1000,
    'capture_search_requests' => false,
  }
}

typesense.analytics.rules.create(rule)
```

  </template>

  <template v-slot:Go>

```go
rule := map[string]interface{}{
  "name":       "product_queries_aggregation",
  "type":       "popular_queries",
  "collection": "products",
  "event_type": "query",
  "params": map[string]interface{}{
    "destination_collection":  "product_queries",
    "limit":                   1000,
    "capture_search_requests": false,
  },
}

_, err := client.Analytics().Rules().Create(context.Background(), rule)
_ = err
```

  </template>
  
  <template v-slot:Python>

```python
rule = {
    "name": "product_queries_aggregation",
    "type": "popular_queries",
    "collection": "products",
    "event_type": "query",
    "params": {
        "destination_collection": "product_queries",
        "limit": 1000,
        "capture_search_requests": False,
    },
}

client.analytics.rules.create(rule)
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
        "collection": "products",
        "event_type": "query",
        "params": {
          "destination_collection": "product_queries",
          "limit": 1000,
          "capture_search_requests": false
        }
      }'
```

  </template>
</Tabs>

With this rule in place, you can now directly send the queries as `query` events, via the API.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const event = {
  name: "product_queries_aggregation",
  event_type: "query",
  data: {
    q: "running shoes",
    user_id: "1234",
  },
}

client.analytics.events().create(event)
```

  </template>

  <template v-slot:Ruby>

```rb
event = {
  "name" => "product_queries_aggregation",
  "event_type" => "query",
  "data" => {
    "q" => "running shoes",
    "user_id" => "1234",
  }
}

typesense.analytics.events.create(event)
```

  </template>

  <template v-slot:Go>

```go
event := map[string]interface{}{
  "name":       "product_queries_aggregation",
  "event_type": "query",
  "data": map[string]interface{}{
    "q":       "running shoes",
    "user_id": "1234",
  },
}

client.Analytics().Events().Create(context.Background(), event)
```

  </template>
  
  <template v-slot:Python>

```python
event = {
    "name": "product_queries_aggregation",
    "event_type": "query",
    "data": {
        "q": "running shoes",
        "user_id": "1234",
    },
}
resp = client.analytics.events.create(event)
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "event_type": "query",
            "name": "product_queries_aggregation",
            "data": {
                  "q": "running shoes",
                  "user_id": "1234"
            }
        }'
```

  </template>
</Tabs>


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

### Query Analytics with Meta Fields

Typesense supports tracking additional metadata along with search queries for analytics purposes. Currently, this is limited to `filter_by` and `analytics_tag` fields.

#### Setting up Meta Fields Analytics

First, create a collection to store the queries with meta fields. The schema should include fields for the meta data you want to track:

```json
{
  "name": "top_queries",
  "fields": [
    { "name": "q", "type": "string" },
    { "name": "filter_by", "type": "string" },
    { "name": "analytics_tag", "type": "string" },
    { "name": "count", "type": "int32" }
  ]
}
```

Then, create an analytics rule that specifies which meta fields to track:

```json
{
  "name": "top_search_queries",
  "type": "popular_queries",
  "collection": "hnstories",
  "event_type": "query",
  "params": {
    "limit": 100,
    "expand_query": true,
    "meta_fields": ["analytics_tag", "filter_by"],
    "destination_collection": "top_queries"
  }
}
```

The `meta_fields` array in the analytics rule specifies which meta fields should be tracked and stored in the destination collection.

#### Using Meta Fields in Search

When making search requests, you can include the meta fields as query parameters:

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     "http://localhost:8108/collections/hnstories/documents/search?q=iron&query_by=title&filter_by=points:>100&analytics_tag=oxford"
```

Typesense will aggregate these queries along with their meta fields in the destination collection. The aggregated data will look like this:

```json
{
  "facet_counts": [],
  "found": 1,
  "hits": [
    {
      "document": {
        "count": 1,
        "analytics_tag": "oxford",
        "filter_by": "points:>100",
        "id": "9677940243608161791",
        "q": "iron"
      },
      "highlight": {},
      "highlights": []
    }
  ],
  "out_of": 1,
  "page": 1,
  "request_params": {
    "collection_name": "top_queries",
    "first_q": "*",
    "per_page": 10,
    "q": "*"
  },
  "search_cutoff": false,
  "search_time_ms": 0
}
```

:::warning
To use meta fields analytics:

1. The destination collection must have the corresponding meta fields in its schema (e.g., `filter_by` and `analytics_tag`)
2. The analytics rule must include these fields in the `meta_fields` array
3. If either of these conditions is not met, the meta fields will not be stored
:::

## No hits Queries

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
  "name": ruleName,
  "type": "nohits_queries",
  "collection": "products",
  "event_type": "query",
  "params": {
    "destination_collection": "no_hits_queries",
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
  'name' => rule_name,
  'type' => 'nohits_queries',
  'collection' => 'products',
  'event_type' => 'query',
  'params' => {
    'destination_collection' => 'no_hits_queries',
    'limit' => 1000
  }
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

  <template v-slot:Go>

```go
ruleName := "product_no_hits"
ruleConfiguration := map[string]interface{}{
  "name":        ruleName,
  "type":        "nohits_queries",
  "collection":  "products",
  "event_type":  "query",
  "params": map[string]interface{}{
    "destination_collection": "no_hits_queries",
    "limit": 1000,
  },
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
    <template v-slot:Python>

```python
ruleName = 'product_no_hits'
ruleConfiguration = {
  "name": ruleName,
  "type": "nohits_queries",
  "collection": "products",
  "event_type": "query",
  "params": {
    "destination_collection": "no_hits_queries",
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
        "collection": "products",
        "event_type": "query",
        "params": {
            "destination_collection": "no_hits_queries",
            "limit": 1000
        }
      }'
```

  </template>

</Tabs>

## Counter events

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
    "name": ruleName,
    "type": "counter",
    "collection": "products",
    "event_type": "click",
    "params": {
        "destination_collection": "products",
        "counter_field": "popularity",
        "weight": 1
    }
}

client.analytics.rules().upsert(ruleName, ruleConfiguration)
```

  </template>

<template v-slot:Ruby>

```rb
rule_name = 'product_clicks'
rule_configuration = {
    "name" => rule_name,
    "type" => "counter",
    "collection" => "products",
    "event_type" => "click",
    "params" => {
        "destination_collection" => "products",
        "counter_field" => "popularity",
        "weight" => 1
    }
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

<template v-slot:Go>

```go
ruleName := "product_clicks"
ruleConfiguration := map[string]interface{}{
  "name":        ruleName,
  "type":        "counter",
  "collection":  "products",
  "event_type":  "click",
  "params": map[string]interface{}{
    "destination_collection": "products",
    "counter_field":          "popularity",
    "weight":                 1,
  },
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
  <template v-slot:Python>

```python
ruleName = 'product_clicks'
ruleConfiguration = {
    "name": ruleName,
    "type": "counter",
    "collection": "products",
    "event_type": "click",
    "params": {
        "destination_collection": "products",
        "counter_field": "popularity",
        "weight": 1
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
        "collection": "products",
        "event_type": "click",
        "params": {
            "destination_collection": "products",
            "counter_field": "popularity",
            "weight": 1
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

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const event = {
  name: "products_click_event",
  event_type: "click",
  data: {
    doc_id: "1024",
    user_id: "111112",
  },
}

client.analytics.events().create(event)
```

  </template>

  <template v-slot:Ruby>

```rb
event = {
  "name" => "products_click_event",
  "event_type" => "click",
  "data" => {
    "doc_id" => "1024",
    "user_id" => "111112",
  }
}

typesense.analytics.events.create(event)
```

  </template>

  <template v-slot:Go>

```go
event := map[string]interface{}{
  "name":       "products_click_event",
  "event_type": "click",
  "data": map[string]interface{}{
    "doc_id":  "1024",
    "user_id": "111112",
  },
}

client.Analytics().Events().Create(context.Background(), event)
```

  </template>
  
  <template v-slot:Python>

```python
event = {
    "name": "products_click_event",
    "event_type": "click",
    "data": {
        "doc_id": "1024",
        "user_id": "111112",
    },
}
resp = client.analytics.events.create(event)
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "event_type": "click",
            "name": "products_click_event",
            "data": {
                  "doc_id": "1024",
                  "user_id": "111112"
            }
        }'
```

  </template>
</Tabs>

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


<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const rules = [
  {
    name: 'product_clicks',
    type: 'counter',
    collection: 'products',
    event_type: 'click',
    params: {
      destination_collection: 'products',
      counter_field: 'popularity',
      weight: 1,
    },
  },
  {
    name: 'products_purchases',
    type: 'counter',
    collection: 'products',
    event_type: 'conversion',
    params: {
      destination_collection: 'products',
      counter_field: 'popularity',
      weight: 2,
    },
  },
]

await client.analytics.rules().create(rules)
```

  </template>

  <template v-slot:Ruby>

```rb
rules = [
  {
    'name' => 'product_clicks',
    'type' => 'counter',
    'collection' => 'products',
    'event_type' => 'click',
    'params' => {
      'destination_collection' => 'products',
      'counter_field' => 'popularity',
      'weight' => 1,
    }
  },
  {
    'name' => 'products_purchases',
    'type' => 'counter',
    'collection' => 'products',
    'event_type' => 'conversion',
    'params' => {
      'destination_collection' => 'products',
      'counter_field' => 'popularity',
      'weight' => 2,
    }
  }
]

typesense.analytics.rules.create(rules)
```

  </template>

  <template v-slot:Go>

```go
rules := []map[string]interface{}{
  {
    "name":       "product_clicks",
    "type":       "counter",
    "collection": "products",
    "event_type": "click",
    "params": map[string]interface{}{
      "destination_collection": "products",
      "counter_field":          "popularity",
      "weight":                 1,
    },
  },
  {
    "name":       "products_purchases",
    "type":       "counter",
    "collection": "products",
    "event_type": "conversion",
    "params": map[string]interface{}{
      "destination_collection": "products",
      "counter_field":          "popularity",
      "weight":                 2,
    },
  },
}

_, err := client.Analytics().Rules().Create(context.Background(), rules)
_ = err
```

  </template>
  
  <template v-slot:Python>

```python
rules = [
    {
        "name": "product_clicks",
        "type": "counter",
        "collection": "products",
        "event_type": "click",
        "params": {
            "destination_collection": "products",
            "counter_field": "popularity",
            "weight": 1,
        },
    },
    {
        "name": "products_purchases",
        "type": "counter",
        "collection": "products",
        "event_type": "conversion",
        "params": {
            "destination_collection": "products",
            "counter_field": "popularity",
            "weight": 2,
        },
    },
]

client.analytics.rules.create(rules)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '[
        {
          "name": "product_clicks",
          "type": "counter",
          "collection": "products",
          "event_type": "click",
          "params": {"destination_collection": "products", "counter_field": "popularity", "weight": 1}
        },
        {
          "name": "products_purchases",
          "type": "counter",
          "collection": "products",
          "event_type": "conversion",
          "params": {"destination_collection": "products", "counter_field": "popularity", "weight": 2}
        }
      ]'
```

  </template>
</Tabs>

You can now send `conversion` and `click` event via the API.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const event = {
  name: "products_purchases",
  event_type: "conversion",
  data: {
    doc_id: "1022",
    user_id: "111117",
  },
}

client.analytics.events().create(event)
```

  </template>

<template v-slot:Ruby>

```rb
event = {
  "name" => "products_purchases",
  "data" => {
    "doc_id" => "1022",
    "user_id" => "111117",
  }
}

typesense.analytics.events.create(event)
```

  </template>

<template v-slot:Go>

```go
event := map[string]interface{}{
  "name":       "products_purchases",
  "data": map[string]interface{}{
    "doc_id":  "1022",
    "user_id": "111117",
  },
}

client.Analytics().Events().Create(context.Background(), event)
```

  </template>
  <template v-slot:Python>

```python
event = {
    "name": "products_purchases",
    "data": {
        "user_id": "1022",
        "doc_id": "111117",
    },
}
resp = client.analytics.events.create(event)
```

  </template>

<template v-slot:Shell>

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "name": "products_purchases",
            "data": {
                  "doc_id": "1022",
                  "user_id": "111117"
            }
        }'
```

</template>

</Tabs>

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const event = {
  name: "product_clicks",
  event_type: "conversion",
  data: {
    doc_id: "1022",
    user_id: "111117",
  },
}

client.analytics.events().create(event)
```

  </template>

<template v-slot:Ruby>

```rb
event = {
  "name" => "product_clicks",
  "data" => {
    "doc_id" => "1022",
    "user_id" => "111117",
  }
}

typesense.analytics.events.create(event)
```

  </template>

<template v-slot:Go>

```go
event := map[string]interface{}{
  "name":       "product_clicks",
  "data": map[string]interface{}{
    "doc_id":  "1022",
    "user_id": "111117",
  },
}

client.Analytics().Events().Create(context.Background(), event)
```

  </template>
  <template v-slot:Python>

```python
event = {
    "name": "product_clicks",
    "data": {
        "user_id": "1022",
        "doc_id": "111117",
    },
}
resp = client.analytics.events.create(event)
```

  </template>

<template v-slot:Shell>

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -d '{
            "name": "product_clicks",
            "data": {
                  "doc_id": "1022",
                  "user_id": "111117"
            }
        }'

```

</template>

</Tabs>

Since we've configured a `conversion` event to have a weight of `2`, the `popularity` field in the `products`
collection will be incremented by `2` for every conversion event.


## Log events

Create `log` rules to store raw analytics events. These logs are used to train personalization models and can also be leveraged during inference to personalize results.

### Create a log rule

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
let ruleName = 'product_events_log'
let ruleConfiguration = {
  "name": ruleName,
  "type": "log",
  "collection": "products",
  "event_type": "click"
}

client.analytics.rules().upsert(ruleName, ruleConfiguration)
```

  </template>

  <template v-slot:Ruby>

```rb
rule_name = 'product_events_log'
rule_configuration = {
  'name' => rule_name,
  'type' => 'log',
  'collection' => 'products',
  'event_type' => 'click'
}

typesense.analytics.rules.upsert(rule_name, rule_configuration)
```

  </template>

  <template v-slot:Go>

```go
ruleName := "product_events_log"
ruleConfiguration := map[string]interface{}{
  "name":       ruleName,
  "type":       "log",
  "collection": "products",
  "event_type": "click",
}

client.Analytics().Rules().Upsert(context.Background(), ruleName, ruleConfiguration)
```

  </template>
  
  <template v-slot:Python>

```python
ruleName = 'product_events_log'
ruleConfiguration = {
  "name": ruleName,
  "type": "log",
  "collection": "products",
  "event_type": "click",
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
        "name": "product_events_log",
        "type": "log",
        "collection": "products",
        "event_type": "click"
      }'
```

  </template>
</Tabs>

### Sending log events

Once the log rule is in place, send events using the configured rule name and event type. Include relevant fields in `data` (e.g., `doc_id`, `user_id` for click/conversion; `q`, `analytics_tag`, `filter_by` for query).

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
const event = {
  name: 'product_events_log',
  event_type: 'click',
  data: {
    doc_id: '1024',
    user_id: '111112',
  },
}

client.analytics.events().create(event)
```

  </template>

  <template v-slot:Ruby>

```rb
event = {
  "name" => "product_events_log",
  "event_type" => "click",
  "data" => {
    "doc_id" => "1024",
    "user_id" => "111112",
  }
}

typesense.analytics.events.create(event)
```

  </template>

  <template v-slot:Go>

```go
event := map[string]interface{}{
  "name":       "product_events_log",
  "event_type": "click",
  "data": map[string]interface{}{
    "doc_id":  "1024",
    "user_id": "111112",
  },
}

client.Analytics().Events().Create(context.Background(), event)
```

  </template>
  <template v-slot:Python>

```python
event = {
    "name": "product_events_log",
    "event_type": "click",
    "data": {
        "doc_id": "1024",
        "user_id": "111112",
    },
}
resp = client.analytics.events.create(event)
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/analytics/events" -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{
            "event_type": "click",
            "name": "product_events_log",
            "data": {
                  "doc_id": "1024",
                  "user_id": "111112"
            }
        }'
```

  </template>
</Tabs>

## Listing all rules

The listing API allows you to list all the analytics rules stored in your Typesense cluster. Optionally filter results by `rule_tag`.

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">


  <template v-slot:JavaScript>

```js
// Retrieve all rules
typesense.analytics.rules().retrieve()

// Optionally filter by rule_tag
typesense.analytics.rules().retrieve({ rule_tag: 'homepage' })
```

  </template>

  <template v-slot:Ruby>

```rb
# Retrieve all rules
typesense.analytics.rules.retrieve

# Optionally filter by rule_tag
typesense.analytics.rules.retrieve(rule_tag: 'homepage')
```

  </template>

  <template v-slot:Go>

```go
// Retrieve all rules
client.Analytics().Rules().Retrieve(context.Background())

// Optionally filter by rule_tag
client.Analytics().Rules().Retrieve(context.Background(), map[string]interface{}{"rule_tag": "homepage"})
```

  </template>

  <template v-slot:Python>

```python
# Retrieve all rules
client.analytics.rules.retrieve()

# Optionally filter by rule_tag
client.analytics.rules.retrieve(rule_tag="homepage")
```

  </template>


  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/rules" \
      -X GET \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"

# Filter by rule_tag
curl -k "http://localhost:8108/analytics/rules?rule_tag=homepage" \
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

## Retrieve analytics events

Retrieve the most recent analytics events for a specific user and analytics rule name.

Retrieving events is only supported for `log`-type analytics rules. Ensure the analytics rule was created with `type: log`; other rule types do not expose retrievable event logs.

### Parameters

| Parameter | Type    | Required | Description                                    |
|:----------|:--------|:---------|:-----------------------------------------------|
| user_id   | string  | Yes      | Identifier of the user whose events to return. |
| name      | string  | Yes      | Analytics rule name.                            |
| n         | integer | Yes      | Number of events to return (max 1000).         |

<Tabs :tabs="['JavaScript','Ruby','Go','Python','Shell']">
  <template v-slot:JavaScript>

```js
// Fetch recent events for a user and rule
const params = { user_id: '1234', name: 'product_queries_aggregation', n: 10 }
const events = await client.analytics.events().retrieve(params)
```

  </template>

  <template v-slot:Ruby>

```rb
events = typesense.analytics.events.retrieve(user_id: '1234', name: 'product_queries_aggregation', n: 10)
```

  </template>

  <template v-slot:Go>

```go
events, err := client.Analytics().Events().Retrieve(context.Background(), "1234", "product_queries_aggregation", 10)
```

  </template>
  
  <template v-slot:Python>

```python
events = client.analytics.events.retrieve(user_id="1234", name="product_queries_aggregation", n=10)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/analytics/events?user_id=1234&name=product_queries_aggregation&n=10" \
     -X GET \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>