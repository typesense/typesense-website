---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Curation

:::warning Breaking Change in v30
When you upgrade to v30, all existing collection-specific override definitions will be automatically migrated to the new curation sets format. Your searches will continue working without any hiccups, but you have to use the new API and client methods for reading and writing to the curation definitions. If self-hosting, [**perform a snapshot**](https://typesense.org/docs/30.0/api/cluster-operations.html#create-snapshot-for-backups) before upgrading for the Synonyms & Overrides to be migrated to v30.
:::

While Typesense makes it really easy and intuitive to deliver great search results, sometimes you might want to promote certain documents over others. Or, you might want to exclude certain documents from a query's result set.

Using curation, you can include or exclude specific documents for a given query.

:::tip Precedence
When using [Synonyms](./synonyms.md) and Curation together, Curation is handled first since the rules can contain instructions to replace the query. Synonyms will then work on the modified query.
:::

## Create or update a curation set

You can define a comprehensive set of curation rules that specify how search results should be modified for specific queries or filter conditions, and then attach this rule set to a collection. These rules allow you to customize search behavior by promoting certain documents, hiding others, applying additional filters, modifying sorting behavior, or diversify the results when specific conditions are met.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Shell']">
  <template v-slot:JavaScript>

```js
curation_set = {
  "items": [{
    "id": "customize-apple",
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
    "id" => "customize-apple",
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
    "id": "customize-apple",
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
client.curation_sets["curate_products"].upsert(curation_set)
```

  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items" => [{
    "id" => "customize-apple",
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
    "id": "customize-apple",
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
    "id": "customize-apple",
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

After creating a curation set, make sure to link it to a collection.You can read more about it in the [documentation on linking curation sets with collections](https://typesense.org/docs/30.0/api/curation.html#linking-curation-sets-with-collections).

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
    "id": "customize-apple",
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
    "id" => "customize-apple",
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
    "id": "customize-apple",
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
    "id" => "customize-apple",
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
    "id": "customize-apple",
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
    "id": "customize-apple",
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
    "id": "customize-apple",
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
    "id": "brand-filter",
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
    [
      "id" => "brand-filter",
      "rule" => [
        "query" => "{brand} phone",
        "match" => "contains"
      ],
      "filter_by" => "brand:={brand}",
      "remove_matched_tokens" => true
    ]
  ]
];

# Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
$client->curationSets->upsert('curate_products', $curation_set);
```

  </template>
  <template v-slot:Python>

```py
curation_set = {
  "items": [{
    "id": "brand-filter",
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
    "id": "brand-filter",
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
    "id": "brand-filter",
    "rule": {
      "query": "{brand} phone",
      "match": "contains"
    },
    "filter_by": "brand:={brand}",
    "remove_matched_tokens": true
  }]
};

// Creates/updates an curation_set item called `brand-filter` in the `curate_products` curation_set
await client.curation_sets.upsert('curate_products', curation_set);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "brand-filter",
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
    "id": "dynamic-sort",
    "rule": {
      "query": "{store}",
      "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
  }]
}

// Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
client.curationSets().upsert('curate_products', curation_set)
```

  </template>

  <template v-slot:PHP>

```php
$curation_set = [
  "items" => [[
    "id" => "dynamic-sort",
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
    "id": "dynamic-sort",
    "rule": {
      "query": "{store}",
      "match": "exact"
    },
    "remove_matched_tokens": True,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
  }]
}

# Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Ruby>

```rb
curation_set = {
  "items" => [{
    "id" => "dynamic-sort",
    "rule" => {
      "query" => "{store}",
      "match" => "exact"
    },
    "remove_matched_tokens" => true,
    "sort_by" => "sales.{store}:desc, inventory.{store}:desc"
  }]
}

# Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
client.curation_sets.upsert('curate_products', curation_set)
```

  </template>
  <template v-slot:Dart>

```dart
final curation_set = {
  "items": [{
    "id": "dynamic-sort",
    "rule": {
      "query": "{store}",
      "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
  }]
};

// Creates/updates an curation_set item called `dynamic-sort` in the `curate_products` curation_set
await client.curation_sets.upsert('curate_products', curation_set);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/curation_sets/curate_products" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [{
    "id": "dynamic-sort",
    "rule": {
      "query": "{store}",
      "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
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
    "id": "dynamic-sort-filter",
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
    "id" => "dynamic-sort-filter",
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
    "id": "dynamic-sort-filter",
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
  "items" => [{
    "id" => "dynamic-sort-filter",
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
    "id": "dynamic-sort-filter",
    "rule": {
      "filter_by": "store:={store}",
      "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
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
    "id": "dynamic-sort-filter",
    "rule": {
      "filter_by": "store:={store}",
      "match": "exact"
    },
    "remove_matched_tokens": true,
    "sort_by": "sales.{store}:desc, inventory.{store}:desc"
  }]
}'
```

  </template>
</Tabs>

This curation will apply the same dynamic sorting when a filter condition matches the store name.


### Diversify results

You can diversify the top 250 results using the Maximum Marginal Relevance (MMR) algorithm, so that a variety of results are shown to users, while still balancing relevance.
You can read more about MMR in [this article](https://www.cs.cmu.edu/~jgc/publication/The_Use_MMR_Diversity_Based_LTMIR_1998.pdf).

Here's the formula that MMR uses:

$$
\text{MMR} = \arg\max_{D_i \in R \setminus S}
\Big[
    \lambda \ \text{Sim}_{1}(D_i, Q)
    - (1 - \lambda) \ \max_{D_j \in S} \text{Sim}_{2}(D_i, D_j)
\Big]
$$

**Where:**
- $R$ : Set of all the documents that matched the query.
- $S$ : Diversified result set.
- $D_i$ : Current document that is present in R but not yet in S.
- $\lambda$ : Controls the balance between relevance to the query and diversity of results. When 1, the results will have no diversity and when 0, the results will have maximum diversity.
- $\text{Sim}_{1}(D_i, Q)$ : Relevance of the current document with respect to the query.
- $\max_{D_j \in S} \text{Sim}_{2}(D_i, D_j)$ : Maximum similarity value between the current document and all the documents of S.

We can define an override with a `diversity` parameter like:
```json
{
  "id": "override_id",
  "rule": {
    "tags": [
      "screen_pattern_rule"
    ]
  },
  "diversity": {
    "similarity_metric": [
      {
        "field": "tags",
        "method": "jaccard",
        "weight": 0.7
      },
      {
        "field": "app_id",
        "method": "equality",
        "weight": 0.3
      }
    ]
  }
}
```

**Sim<sub>1</sub>**, i.e. relevance to the query is calculated by default for every document. `similarity_metric` is used to calculate **Sim<sub>2</sub>**, i.e. similarity of two documents. For the above example, we will calculate similarity using [Jaccard_index](https://en.wikipedia.org/wiki/Jaccard_index) on the `tags` field and using equality (1 if the values are same, 0 otherwise) on the `app_id` field.

The `λ` of the MMR equation can be customized by sending `diversity_lambda` along with the query like:

```json
{
  "q": "*",
  "curation_tags": "screen_pattern_rule",
  "diversity_lambda": 0.75
}
```
Its default value is `0.5`.


Instead of using `curation_tags`, diversity overrides can also be defined with specific rules regarding [query/filter matches](#parameters), which are invoked dynamically.

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
  "sort_by": "sales.{store}:desc, inventory.{store}:desc"
};

await client.curation_sets['curate_products'].items['dynamic-sort-filter'].upsert(curation_set_item);
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
  "sort_by": "sales.{store}:desc, inventory.{store}:desc"
}'
```

  </template>
</Tabs>

#### Definition
`PUT ${TYPESENSE_HOST}/curation_sets/:name/items/:id`

### Curation `item` parameters



#### Parameters
| Parameter                          | Required                                                    | Description                                                                                                                                                                                                                                                                                                                                                             |
|------------------------------------|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| rule.query                         | One of either `rule.query` or `rule.filter_by` is required. | Indicates what search queries should be overridden.                                                                                                                                                                                                                                                                                                                     |
| rule.match                         | no                                                          | Indicates whether the match on the query term should be `exact` or `contains`. Required when `rule.query` is set.                                                                                                                                                                                                                                                       |
| rule.filter_by                     | One of either `rule.query` or `rule.filter_by` is required. | Indicates that the override should apply when the `filter_by` parameter in a search query _exactly_ matches the string specified here (including backticks, spaces, brackets, etc).                                                                                                                                                                                     |
| rule.tags                          | no                                                          | List of tag values to associate with this override rule.                                                                                                                                                                                                                                                                                                                |
| excludes                           | no                                                          | List of document `id`s that should be excluded from the search results.                                                                                                                                                                                                                                                                                                 |
| includes                           | no                                                          | List of document `id`s that should be included in the search results with their corresponding `positions`.                                                                                                                                                                                                                                                              |
| metadata                           | no                                                          | Return a custom JSON object in the Search API response, when this rule is triggered. This can can be used to display a pre-defined message (eg: a promotion banner) on the front-end when a particular rule is triggered.                                                                                                                                               |
| filter_by                          | no                                                          | A filter by clause that is applied to any search query that matches the override rule.                                                                                                                                                                                                                                                                                  |
| sort_by                            | no                                                          | A sort by clause that is applied to any search query that matches the override rule.                                                                                                                                                                                                                                                                                    |
| replace_query                      | no                                                          | Replaces the current search query with this value, when the search query matches the override rule.                                                                                                                                                                                                                                                                     |
| remove_matched_tokens              | no                                                          | Indicates whether search query tokens that exist in the override's rule should be removed from the search query. <br/><br/>Default: `true`.                                                                                                                                                                                                                             |
| filter_curated_hits                | no                                                          | When set to `true`, the filter conditions of the query is applied to the curated records as well. <br/><br/>Default: `false`.                                                                                                                                                                                                                                           |
| effective_from_ts                  | no                                                          | A Unix timestamp that indicates the date/time from which the override will be active. You can use this to create override rules that start applying from a future point in time.                                                                                                                                                                                        |
| effective_to_ts                    | no                                                          | A Unix timestamp that indicates the date/time until which the override will be active. You can use this to create override rules that stop applying after a period of time.                                                                                                                                                                                             |
| stop_processing                    | no                                                          | When set to `true`, override processing will stop at the first matching rule. When set to `false` override processing will continue and multiple override actions will be triggered in sequence. <br/><br/> Overrides are processed in the lexical sort order of their `id` field.<br/><br/>Default: `true`.                                                            |
| diversity                          | no                                                          | Uses Maximum Marginal Relevance(MMR), diversifies the top 250 hits based on pre-defined similarity metric                                                                                                                                                                                                                                                               |
| diversity.similarity_metric        | yes                                                         | List of metric objects containing details of the `field`, `method` and the `weight` to be used to calculate the similarity value of two documents.                                                                                                                                                                                                                      |
| diversity.similarity_metric.field  | yes                                                         | Name of the field. The field must be defined with `facet: true` for an array type or `sort: true` otherwise.                                                                                                                                                                                                                                                            |
| diversity.similarity_metric.method | yes                                                         | Method to be used to calculate the similarity of the documents. `equality` checks for an exact match of the field value(s) and `jaccard` computes the [Jaccard_index](https://en.wikipedia.org/wiki/Jaccard_index) using the values of the field. `equality` can be used for both array and single type fields but `jacaard` can only be used with an array type field. |
| diversity.similarity_metric.weight | yes                                                         | Weight of this field in calculating the total similarity value.                                                                                                                                                                                                                                                                                                         |

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
        }
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
