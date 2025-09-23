---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Curation

:::warning Breaking Change in v30
When you upgrade to v30, all existing collection-specific synonym definitions will be automatically migrated to the new curation sets format. Your searches will continue working without any hiccups, but you have to use the new API and client methods for reading and writing to the curation definitions.
:::

While Typesense makes it really easy and intuitive to deliver great search results, sometimes you might want to promote certain documents over others. Or, you might want to exclude certain documents from a query's result set.

Using curation, you can include or exclude specific documents for a given query.

:::tip Precedence
When using [Synonyms](./synonyms.md) and Curation together, Curation is handled first since the rules can contain instructions to replace the query. Synonyms will then work on the modified query.
:::

## Create or update an curation set

You can define a comprehensive set of curation rules that specify how search results should be modified for specific queries or filter conditions, and then attach this rule set to a collection. These rules allow you to customize search behavior by promoting certain documents, hiding others, applying additional filters, or modifying sorting behavior when specific conditions are met.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
curation_set = {
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}

// Creates/updates an curation_set called `curate_products`.
client.curationSets().upsert('curate_products', curation_set)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set = [
  "items" => [
    "id" => "customize-apple"
    "rule" => [
    "query" => "apple",
    "match" => "exact"
    ],
    "includes" => [
      ["id" => "422", "position" => 1],
      ["id" => "54", "position" => 2]
    ],
    "excludes" => [
      ["id" => "287"]
    ]
  ]
];

# Creates/updates an override called `customize-apple` in the `companies` collection
$client->curationSets->upsert('curate_products', $curation_set);
```

  </template>
  <template v-slot:Python>

```py
curation_set = {
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}

# Creates/updates an override called `customize-apple` in the `companies` collection
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items" => [{
    "id" => "customize-apple"
    "rule" => {
      "query" => "apple",
      "match" => "exact"
    },
    "includes" => [
      {"id" => "422", "position" => 1},
      {"id" => "54", "position" => 2}
    ],
    "excludes" => [
      {"id" => "287"}
    ]
  }]
}

# Creates/updates an override called `customize-apple` in the `companies` collection
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Dart>

```dart
final curation_set = {
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
};

// Creates/updates an override called `customize-apple` in the `companies` collection
await client.curation_sets.upsert('curate_products', curation_set);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "customize-apple"
    "rule": {
    "query": "apple",
    "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}'
```

  </template>
</Tabs>

### Including or excluding documents

In the following example, we will:

1. Use the `includes` condition to place the documents with ids `422` and `54` in the first and second positions
   respectively.
2. Use the `excludes` condition to remove the document with id `287` from the results.

Typesense allows you to use both `includes` and `excludes` or just one of them for curation.

Note how we are applying these overrides to an `exact` match of the query `apple`. Instead, if we want to match all
queries containing the word `apple`, we will use the `contains` match instead.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
curation_set = {
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}

// Creates/updates an curation_set called `curate_products`.
client.curationSets().upsert('curate_products', curation_set)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set = [
  "items" => [[
    "id" => "customize-apple"
    "rule" => [
    "query" => "apple",
    "match" => "exact"
    ],
    "includes" => [
      ["id" => "422", "position" => 1],
      ["id" => "54", "position" => 2]
    ],
    "excludes" => [
      ["id" => "287"]
    ]
  ]]
];

# Creates/updates an override called `customize-apple` in the `companies` collection
$client->curationSets->upsert('curate_products', $curation_set);
```

  </template>
  <template v-slot:Python>

```py
curation_set = {
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}

# Creates/updates an override called `customize-apple` in the `companies` collection
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items" => [{
    "id" => "customize-apple"
    "rule" => {
      "query" => "apple",
      "match" => "exact"
    },
    "includes" => [
      {"id" => "422", "position" => 1},
      {"id" => "54", "position" => 2}
    ],
    "excludes" => [
      {"id" => "287"}
    ]
  }]
}

# Creates/updates an override called `customize-apple` in the `companies` collection
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Dart>

```dart
final curation_set = {
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
};

// Creates/updates an override called `customize-apple` in the `companies` collection
await client.curation_sets.upsert('curate_products', curation_set);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "customize-apple"
    "rule": {
    "query": "apple",
    "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "curate_products",
  "items": [{
    "id": "customize-apple"
    "rule": {
      "query": "apple",
      "match": "exact"
    },
    "includes": [
      {"id": "422", "position": 1},
      {"id": "54", "position": 2}
    ],
    "excludes": [
      {"id": "287"}
    ]
  }]
}
```

  </template>
</Tabs>

### Add tags to curation items

You can add tags to override rules and then trigger curation by referring to the rule by the tag name directly.

```json
{
    "items": [
    {
      "id": "tagging-example",
      "rule": {
        "query": "iphone pro",
        "match": "exact"
      },
      "tags": ["apple", "iphone"],
      "includes": [{"id": "1348","position": 1}],
      "excludes": [
        {"id": "287"}
      ]
    }
  ]
}
```
Now, when we search the collection, we can pass one or more tags via the `curation_tags` parameter to directly
trigger the curations rules that match the tags:

```json
{
   "curation_tags": "apple,iphone"
}
```

**Additional notes on how rule tagging works**

If `item1` is tagged with `tagA,tagB`, and `item2` is tagged with just `tagA` and `item3` is not tagged:

1. If a search sets `curation_tags` to `tagA`, we only consider curation items that contain `tagA` (`item1` and `item2`)
   with the usual logic -- in alphabetic order of override name and then process both if stop rule processing is false.
2. If a search sets `curation_tags` to `tagA,tagB`, we evaluate any rules that contain both `tagA` and tagB first,
   then rules with either `tagA` or `tagB`, but not overrides that contain no tags. Within each group, we evaluate
   in alphabetic order of override name and process multiple rules if `stop_processing` is `false`.
3. If a search sets no `curation_tags`, we only consider rules that have no tags associated with them.

### Dynamic filtering

In the following example, we will apply a filter dynamically to a query that matches a rule.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
curation_set = {
  "items": [{
    "id": "brand-filter"
    "rule": {
    "query": "{brand} phone",
    "match": "contains"
    },
    "filter_by": "brand:={brand}",
    "remove_matched_tokens": true
  }]
}

// Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
client.curationSets().upsert('curate_products', curation_set)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set = [
  "items" => [
    "id" => "brand-filter"
    "rule" => [
    "query" => "{brand} phone",
    "match" => "contains"
    ],
    "filter_by" => "brand:={brand}",
    "remove_matched_tokens" => true
  ]
]

# Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
$client->curationSets->upsert('curate_products', $curation_set);
```

  </template>
  <template v-slot:Python>
```

  </template>
  <template v-slot:Python>

```py
curation_set = {
  "items": [{
    "id": "brand-filter"
    "rule": {
    "query": "{brand} phone",
    "match": "contains"
    },
    "filter_by": "brand:={brand}",
    "remove_matched_tokens": true
  }]
}

# Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items": [{
    "id": "brand-filter"
    "rule": {
    "query": "{brand} phone",
    "match": "contains"
    },
    "filter_by": "brand:={brand}",
    "remove_matched_tokens": true
  }]
}

# Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Dart>

```dart
final curation_set = {
  "items": [{
    "id": "brand-filter"
    "rule": {
    "query": "{brand} phone",
    "match": "contains"
    },
    "filter_by": "brand:={brand}",
    "remove_matched_tokens": true
  }]
}

# Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "brand-filter"
    "rule": {
    "query": "{brand} phone",
    "match": "contains"
    },
    "filter_by": "brand:={brand}",
    "remove_matched_tokens": true
  }]
}'
```

  </template>
</Tabs>

With this curation_set item in effect, any query that contains a brand will automatically be filtered on the matching brand
directly. In addition, the brand will also be removed from the original query tokens, so that the search is made
only on the remaining tokens.

For example, if someone searches for `sony ericsson phone`, the query will be re-written as `phone` and a
`sony ericsson` brand filter will be directly applied. If you don't wish to remove matching tokens from the query,
set `remove_matched_tokens` to `false`. By default, this parameter is set to `true`.

:::tip Note
Fields used in the query for dynamic filtering should have `facet: true` in their field definition in the schema.
:::

### Curation and filtering

`includes` is used to fix documents at certain positions in the results, but it's possible for these documents to
be filtered out when using `filter_curated_hits: true`.

When this happens, Typesense "slides" any remaining documents added by `includes` up in the results.
For example, say you have a collection of product records that look like this when sorted on a `ranking` field:

```
1. ABC123 (in stock)
2. DEF456 (sold out)
3. XYZ999 (sold out)
4. QWE127 (in stock)
5. BNM847 (in stock)
6. JKL999 (in stock)
7. CVB333 (in stock)
```

Let's say an override is created that uses `includes` to pin the following records to specific positions. The override also has
`filter_curated_hits` set to true, so the documents added by `includes` can be filtered out if they don't match any
`filter_by` conditions:

```
- QWE127 pinned to position 1
- DEF456 pinned to position 2
- CVB333 pinned to position 3
```

When this override is applied to a search, the result will be:

```
1. QWE127 (in stock) <- Position set by includes
2. DEF456 (sold out) <- Position set by includes
3. CVB333 (in stock) <- Position set by includes
4. ABC123 (in stock)
5. XYZ999 (sold out)
6. BNM847 (in stock)
7. JKL999 (in stock)
```

If a `status:=in stock` filter is then added to the search, the sold-out records are removed. This includes `DEF456`,
even though it's one of the records the override is trying to add via `includes` (because it's out of stock and the
override has `filter_curated_hits: true`). The end result is that the two in-stock records from the override appear at
positions 1 and 2, with the remaining records below them:

```
1. QWE127 (in stock) <- Position set by includes
2. CVB333 (in stock) <- Position set by includes (moved up)
3. ABC123 (in stock)
4. BNM847 (in stock)
5. JKL999 (in stock)
```

Document `CVB333` "slides up" to position 2, to take the place of `DEF456` (which has been filtered out).

### Dynamic sorting

Like [dynamic filtering](#dynamic-filtering), Typesense supports dynamic sorting with overrides.

Consider the following schema:

```json
{
  "name": "products",
  "fields": [
    {"name": "title", "type": "string"},
    {"name": "store", "type": "string[]"},
    {"name": "sales", "type": "object"},
    {"name": "sales.store01", "type": "int32"},
    {"name": "sales.store02", "type": "int32"},
    {"name": "inventory", "type": "object"},
    {"name": "inventory.store01", "type": "int32"},
    {"name": "inventory.store02", "type": "int32"}
  ],
  "enable_nested_fields": true
}
```

You can create an override that dynamically sorts results based on the query:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
curation_set = {
  "items": [{
    "id": "dynamic-sort"
    "rule": {
    "query": "{store}",
    "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
  }];
}

// Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
client.curationSets().upsert('curate_products', curation_set)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set = [
  "items" => [[
    "id" => "dynamic-sort"
    "rule" => [
    "query" => "{store}",
    "match" => "exact"
    ],
  "remove_matched_tokens" => true,
  "sort_by" => "sales.{store}:desc, inventory.{store}:desc"
  ]]
];

# Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
$client->curationSets->upsert('curate_products', $curation_set);
```

  </template>
  <template v-slot:Python>

```py
curation_set = {
  "items": [{
    "id": "dynamic-sort"
    "rule": {
      "query": "{store}",
      "match": "exact"
    },
  "remove_matched_tokens": True,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
}

# Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items": [{
    "id": "dynamic-sort"
    "rule": {
      "query" => "{store}",
      "match" => "exact"
    },
  "remove_matched_tokens" => true,
  "sort_by" => "sales.{store}:desc, inventory.{store}:desc",
  }]
}

# Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Dart>

```dart
final override = {
  "items": [{
    "id": "dynamic-sort"
      "rule": {
      "query": "{store}",
      "match": "exact"
    },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
};

# Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
await client.curation_sets.upsert('curate_products', curation_set);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "dynamic-sort"
    "rule": {
      "query": "{store}",
      "match": "exact"
    },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
}'
```

  </template>
</Tabs>

With this override in effect, when someone searches for a store (e.g., "store01"), the results will be sorted by that store's sales in descending order, and then by its inventory in descending order.

You can also use dynamic sorting with filter-based rules:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
curation_set = {
  "items": [{
    "id": "dynamic-sort-filter"
    "rule": {
      "filter_by": "store:={store}",
      "match": "exact"
    },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
}

// Creates/updates an curation_set item called `dynamic-sort-filter` in the `curate_products` curation_set
client.curation_sets().upsert('curate_products', curation_set)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set = [
  "items" => [[
    "id" => "dynamic-sort-filter"
    "rule" => [
      "filter_by" => "store:={store}",
      "match" => "exact"
    ],
    "remove_matched_tokens" => true,
    "sort_by" => "sales.{store}:desc, inventory.{store}:desc"
  ]]
];

// Creates/updates an curation_set item called `dynamic-sort-filter` in the `curate_products` curation_set
$client->curationSets->upsert('curate_products', $curation_set);
```

  </template>
  <template v-slot:Python>

```py
curation_set = {
  "items": [{
    "id" => "dynamic-sort-filter"
    "rule": {
      "filter_by": "store:={store}",
      "match": "exact"
    },
    "remove_matched_tokens": True,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
}

# Creates/updates an curation_set item called `dynamic-sort-filter` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```
  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items": [{
    "id" => "dynamic-sort-filter"
    "rule": {
      "filter_by" => "store:={store}",
      "match" => "exact"
    },
    "remove_matched_tokens" => true,
    "sort_by" => "sales.{store}:desc, inventory.{store}:desc",
  }]
}

# Creates/updates an curation_set item called `dynamic-sort-filter` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Dart>

```dart
final curation_set = {
  "items": [{
    "id" => "dynamic-sort-filter"
    "rule": {
      "filter_by": "store:={store}",
      "match": "exact"
    },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
};

// Creates/updates an curation_set item called `dynamic-sort-filter` in the `curate_products` curation_set
await client.curation_sets.upsert('curate_products', curation_set);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "dynamic-sort-filter"
    "rule": {
      "filter_by": "store:={store}",
      "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc",
  }]
}'
```

  </template>
</Tabs>

This curation will apply the same dynamic sorting when a filter condition matches the store name.

## Retrieve a curation set

Retrieving a curation set associated with a given collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
client.curationSets('curate_products').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->curationSets['curate_products']->retrieve();
```

  </template>

  <template v-slot:Python>

```py
client.curation_sets['curate_products'].retrieve()
```

  </template>

  <template v-slot:Ruby>

```rb
client.curation_sets['curate_products'].retrieve
```

  </template>

  <template v-slot:Dart>

```dart
await client.curation_sets.retrieve('curate_products');
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X GET \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/curation_sets/:name`


## List all curation sets

Listing all curation sets associated with a given collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
client.curationSets().retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->curationSets->retrieve();
```

  </template>

  <template v-slot:Python>

```py
client.curation_sets.retrieve()
```

  </template>

  <template v-slot:Ruby>

```rb
client.curation_sets.retrieve
```

  </template>

  <template v-slot:Dart>

```dart
await client.curation_sets.retrieve();
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets" -X GET \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/curation_sets`

## Delete a curation set

Deleting a curation set associated with a given collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
client.curationSets('curate_products').delete()
```

  </template>

  <template v-slot:PHP>

```php
$client->curationSets['curate_products']->delete();
```

  </template>

  <template v-slot:Python>

```py
client.curation_sets['curate_products'].delete()
```

  </template>
  
  <template v-slot:Ruby>

```rb
client.curation_sets['curate_products'].delete
```

  </template>

  <template v-slot:Dart>

```dart
await client.curation_sets.delete('curate_products');
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X DELETE \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/curation_sets/:name`

## Linking synonym sets with collections

### While creating the collection

```json
{
  "name": "products",
  "fields": [
    {
      "name": "name",
      "type": "string"
    }
  ],
  "curation_sets": ["clothing_curation", "tech_curation"]
}
```

### Altering an existing collection

```shell
curl "http://localhost:8108/collections/products" -X PATCH \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
-d '{
    "curation_sets": ["clothing_curation", "tech_curation"]
}'
```

## Upsert a curation set item

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
const curation_set_item = {
  "rule": {
    "filter_by": "store:={store}",
    "match": "exact"
  },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
}

client.curationSets('curate_products').items('dynamic-sort-filter').upsert(curation_set_item)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set_item = [
  "rule" => [
    "filter_by" => "store:={store}",
    "match" => "exact"
  ],
  "remove_matched_tokens" => true,
  "sort_by" => "sales.{store}:desc, inventory.{store}:desc",
];

$client->curationSets['curate_products']->items['dynamic-sort-filter']->upsert($curation_set_item);
```

  </template>

  <template v-slot:Python>

```py
curation_set_item = {
  "rule": {
    "filter_by": "store:={store}",
    "match": "exact"
  },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
}

client.curation_sets['curate_products'].items['dynamic-sort-filter'].upsert(curation_set_item)
```

  </template>
  
  <template v-slot:Ruby>

```rb
curation_set_item = {
  "rule": {
    "filter_by": "store:={store}",
    "match": "exact"
  },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
}

client.curation_sets['curate_products'].items['dynamic-sort-filter'].upsert(curation_set_item)
```

  </template>

  <template v-slot:Dart>

```dart
final curation_set_item = {
  "rule": {
    "filter_by": "store:={store}",
    "match": "exact"
  },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
}

client.curation_sets['curate_products'].items['dynamic-sort-filter'].upsert(curation_set_item)
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products/items/dynamic-sort-filter" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "rule": {
    "filter_by": "store:={store}",
    "match": "exact"
  },
  "remove_matched_tokens": true,
  "sort_by": "sales.{store}:desc, inventory.{store}:desc",
}'
```

  </template>
</Tabs>

#### Definition
`PUT ${TYPESENSE_HOST}/curation_sets/:name/items/:id`

### Curation `item` parameters



#### Parameters
| Parameter             | Required                                                    | Description                                                                                                                                                                                                                                                                                                  |
|-----------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| rule.query            | One of either `rule.query` or `rule.filter_by` is required. | Indicates what search queries should be overridden.                                                                                                                                                                                                                                                          |
| rule.match            | no                                                          | Indicates whether the match on the query term should be `exact` or `contains`. Required when `rule.query` is set.                                                                                                                                                                                            |
| rule.filter_by        | One of either `rule.query` or `rule.filter_by` is required. | Indicates that the override should apply when the `filter_by` parameter in a search query _exactly_ matches the string specified here (including backticks, spaces, brackets, etc).                                                                                                                          |
| rule.tags             | no                                                          | List of tag values to associate with this override rule.                                                                                                                                                                                                                                                     |
| excludes              | no                                                          | List of document `id`s that should be excluded from the search results.                                                                                                                                                                                                                                      |
| includes              | no                                                          | List of document `id`s that should be included in the search results with their corresponding `positions`.                                                                                                                                                                                                   |
| metadata              | no                                                          | Return a custom JSON object in the Search API response, when this rule is triggered. This can can be used to display a pre-defined message (eg: a promotion banner) on the front-end when a particular rule is triggered.                                                                                    |
| filter_by             | no                                                          | A filter by clause that is applied to any search query that matches the override rule.                                                                                                                                                                                                                       |
| sort_by               | no                                                          | A sort by clause that is applied to any search query that matches the override rule.                                                                                                                                                                                                                         |
| replace_query         | no                                                          | Replaces the current search query with this value, when the search query matches the override rule.                                                                                                                                                                                                          |
| remove_matched_tokens | no                                                          | Indicates whether search query tokens that exist in the override's rule should be removed from the search query. <br/><br/>Default: `true`.                                                                                                                                                                  |
| filter_curated_hits   | no                                                          | When set to `true`, the filter conditions of the query is applied to the curated records as well. <br/><br/>Default: `false`.                                                                                                                                                                                |
| effective_from_ts     | no                                                          | A Unix timestamp that indicates the date/time from which the override will be active. You can use this to create override rules that start applying from a future point in time.                                                                                                                             |
| effective_to_ts       | no                                                          | A Unix timestamp that indicates the date/time until which the override will be active. You can use this to create override rules that stop applying after a period of time.                                                                                                                                  |
| stop_processing       | no                                                          | When set to `true`, override processing will stop at the first matching rule. When set to `false` override processing will continue and multiple override actions will be triggered in sequence. <br/><br/> Overrides are processed in the lexical sort order of their `id` field.<br/><br/>Default: `true`. |

### Using overrides with scoped API keys

When working with [Scoped API keys](./api-keys.md#generate-scoped-search-key) that have filter conditions embedded in them, you can configure override rules to work with those filtered queries. To do this, you need to ensure your override's `rule.filter_by` exactly matches the final filter string that Typesense constructs.

When a scoped API key with a filter condition is used along with a search query that has its own filter, Typesense combines them in this format:

```
(request_filter) && (scoped_api_key_filter)
```

Notice specifically the parentheses and the &&-ing of the filters with spaces.

For example:

1. If your scoped API key has this condition embedded: `{"filter_by":"country: AU"}`
2. And your search request includes: `filter_by=title:hold`
3. The final filter string becomes: `(title:hold) && (country: AU)`

The `rule.filter_by` field in your override definition should exactly be the string in #3 above for the curation rule to be triggered for the given filter and Scoped API key. 

## Retrieve a curation set item

Retrieving a curation set item associated with a given collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
client.curationSets('curate_products').items('dynamic-sort-filter').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->curationSets['curate_products']->items['dynamic-sort-filter']->retrieve();
```

  </template>

  <template v-slot:Python>

```py
client.curation_sets['curate_products'].items['dynamic-sort-filter'].retrieve()
```

  </template>

  <template v-slot:Ruby>

```rb
client.curation_sets['curate_products'].items['dynamic-sort-filter'].retrieve
```

  </template>

  <template v-slot:Dart>

```dart
await client.curation_sets.retrieve('curate_products');
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products/items/dynamic-sort-filter" -X GET \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/curation_sets/:name/items/:id`

## List all curation set items

Listing all curation set items associated with a given curation_set.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
client.curationSets('curate_products').items().retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->curationSets['curate_products']->items()->retrieve();
```

  </template>

  <template v-slot:Python>

```py
client.curation_sets['curate_products'].items().retrieve()
```

  </template>

  <template v-slot:Ruby>

```rb
client.curation_sets['curate_products'].items().retrieve
```

  </template>

  <template v-slot:Dart>

```dart
await client.curation_sets.retrieve('curate_products');
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products/items" -X GET \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/curation_sets/:name/items`


## Delete a curation set item

Deleting a curation set item associated with a given collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
client.curationSets('curate_products').items('dynamic-sort-filter').delete()
```
  </template>

  <template v-slot:PHP>

```php
$client->curationSets['curate_products']->items['dynamic-sort-filter']->delete();
```

  </template>
  <template v-slot:Python>
  
```py
client.curation_sets['curate_products'].items['dynamic-sort-filter'].delete()
```

  </template>
  <template v-slot:Ruby>
  
```rb
client.curation_sets['curate_products'].items['dynamic-sort-filter'].delete
```

  </template>
  <template v-slot:Dart>
  
```dart
await client.curation_sets.delete('curate_products');
```

  </template>
  <template v-slot:Shell>
  
```bash
curl "http://localhost:8108/collections/curation_sets/curate_products/items/dynamic-sort-filter" -X DELETE \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/curation_sets/:name/items/:id`

## Migration from old overrides API

:::tip Automatic Migration
All existing override rules from previous versions have been automatically migrated to the new curation sets format. Each collection's override rules are now stored in a curation set with the same name as the collection, postfixed by `*_curations_index` (e.g. `products_curations_index`).
:::

### Key differences

1. **API Endpoints**:

   - Old: `/collections/{collection}/overrides/*`
   - New: `/curation_sets/*`

2. **Data Structure**:

   - Old: Direct override objects
   - New: Curation sets containing arrays of curation items

3. **Collection Association**:

   - Old: Overrides were directly associated with collections
   - New: Curation sets are linked to collections via the `curation_sets` field

4. **Search Usage**:
   - Old: Overrides were automatically applied based on collection association
   - New: Curation sets can be dynamically specified in search parameters in addition to collection-linked sets

### Example of migrated data

**Before (v29 and earlier):**
```json
{
  "id": "customize-apple",
  "excludes": [
    {
      "id": "287"
    }
  ],
  "includes": [
    {
      "id": "422",
      "position": 1
    },
    {
      "id": "54",
      "position": 2
    }
  ],
  "rule": {
    "match": "exact",
    "query": "apple"
  }
}
```

**After (v30):**
```json
{
  "name": "curated_products",
  "items": [
    {
      "id": "customize-apple",
      "excludes": [
        {
          "id": "287"
        }
      ],
      "includes": [
        {
          "id": "422",
          "position": 1
        },
        {
          "id": "54",
          "position": 2
        },
      ],
      "rule": {
        "match": "exact",
        "query": "apple"
      }
    }
  ]
}
```
The new API provides better organization, reusability across collections, and more flexible search-time curation application.