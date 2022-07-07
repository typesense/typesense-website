---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Curation
While Typesense makes it really easy and intuitive to deliver great search results, sometimes you might want to promote certain documents over others. Or, you might want to exclude certain documents from a query's result set.

Using overrides, you can include or exclude specific documents for a given query.

## Create or update an override

### Including or excluding documents

In the following example, we will:

1. Use the `includes` condition to place the documents with ids `422` and `54` in the first and second positions 
   respectively.
2. Use the `excludes` condition to remove the document with id `287` from the results. 
   
Typesense allows you to use both `includes` and `excludes` or just one of them for curation.

Note how we are applying these overrides to an `exact` match of the query `apple`. Instead, if we want to match all 
queries containing the word `apple`, we will use the `contains` match instead.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
override = {
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
}

// Creates/updates an override called `customize-apple` in the `companies` collection
client.collections('companies').overrides().upsert('customize-apple', override)
```

  </template>

  <template v-slot:PHP>

```php
$override = [
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
];

# Creates/updates an override called `customize-apple` in the `companies` collection
$client->collections['companies']->overrides->upsert('customize-apple', $override);
```

  </template>
  <template v-slot:Python>

```py
override = {
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
}

# Creates/updates an override called `customize-apple` in the `companies` collection
client.collections['companies'].overrides.upsert('customize-apple', override)
```

  </template>
  <template v-slot:Ruby>

```rb
override = {
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
}

# Creates/updates an override called `customize-apple` in the `companies` collection
client.collections['companies'].overrides.upsert('customize-apple', override)
```

  </template>
  <template v-slot:Dart>

```dart
final override = {
  "rule": {"query": "apple", "match": "exact"},
  "includes": [
    {"id": "422", "position": 1},
    {"id": "54", "position": 2}
  ],
  "excludes": [
    {"id": "287"}
  ]
};

// Creates/updates an override called `customize-apple` in the `companies` collection
await client.collection('companies').overrides.upsert('customize-apple', override);
```

  </template>
  <template v-slot:Java>

```java
SearchOverrideSchema searchOverrideSchema = new SearchOverrideSchema();

searchOverrideSchema.addIncludesItem(new SearchOverrideInclude().id("422").position(1))
                    .addIncludesItem(new SearchOverrideInclude().id("54").position(2))
                    .addExcludesItem(new SearchOverrideExclude().id("287"))
                    .rule(new SearchOverrideRule().query("apple").match(SearchOverrideRule.MatchEnum.EXACT))

// Creates/updates an override called `customize-apple` in the `companies` collection
SearchOverride searchOverride = client.collections("companies").overrides().upsert("customize-apple", searchOverrideSchema);

```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/overrides/customize-apple" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
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
}'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

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

  </template>
</Tabs>

### Dynamic filtering

In the following example, we will apply a filter dynamically to a query that matches a rule.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
override = {
  "rule": {
    "query": "{brand} phone",
    "match": "contains"
  },
  "filter_by": "brand:={brand}",
  "remove_matched_tokens": true
}

// Creates/updates an override called `brand-filter` in the `companies` collection
client.collections('companies').overrides().upsert('brand-filter', override)
```

  </template>

  <template v-slot:PHP>

```php
$override = [
  "rule" => [
    "query" => "{brand} phone",
    "match" => "contains"
  ],
  "filter_by" => "brand:={brand}",
  "remove_matched_tokens" => true
];

# Creates/updates an override called `brand-filter` in the `companies` collection
$client->collections['companies']->overrides->upsert('brand-filter', $override);
```

  </template>
  <template v-slot:Python>

```py
override = {
  "rule": {
    "query": "{brand} phone",
    "match": "contains"
  },
  "filter_by": "brand:={brand}",
  "remove_matched_tokens": True
}

# Creates/updates an override called `brand-filter` in the `companies` collection
client.collections['companies'].overrides.upsert('brand-filter', override)
```

  </template>
  <template v-slot:Ruby>

```rb
override = {
  "rule": {
    "query": "{brand} phone",
    "match": "contains"
  },
  "filter_by": "brand:={brand}",
  "remove_matched_tokens": true
}

# Creates/updates an override called `brand-filter` in the `companies` collection
client.collections['companies'].overrides.upsert('brand-filter', override)
```

  </template>
  <template v-slot:Dart>

```dart
final override = {
  "rule": {
    "query": "{brand} phone",
    "match": "contains"
  },
  "filter_by": "brand:={brand}",
  "remove_matched_tokens": true
};

// Creates/updates an override called `brand-filter` in the `companies` collection
await client.collection('companies').overrides.upsert('brand-filter', override);
```

  </template>
  <template v-slot:Java>

```java
SearchOverrideSchema searchOverrideSchema = new SearchOverrideSchema();

searchOverrideSchema.rule(new SearchOverrideRule().query("{brand} phone")
                    .match(SearchOverrideRule.MatchEnum.CONTAINS))

// Creates/updates an override called `customize-apple` in the `companies` collection
SearchOverride searchOverride = client.collections("companies").overrides().upsert("brand-filter", searchOverrideSchema);

```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/overrides/brand-filter" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "rule": {
    "query": "{brand} phone",
    "match": "contains"
  },
  "filter_by": "brand:={brand}",
  "remove_matched_tokens": true
}'
```

  </template>
</Tabs>

With this override in effect, any query that contains a brand will automatically be filtered on the matching brand 
directly. In addition, the brand will also be removed from the original query tokens, so that the search is made 
only on the remaining tokens. 

For example, if someone searches for `sony ericsson phone`, the query will be re-written as `phone` and a 
`sony ericsson` brand filter will be directly applied. If you don't wish to remove matching tokens from the query, 
set `remove_matched_tokens` to `false`. By default, this parameter is set to `true`.

### Override parameters

#### Definition
`PUT ${TYPESENSE_HOST}/collections/:collection/overrides/:id`

#### Parameters
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|rule.query	|yes	|Indicates what search queries should be overridden.|
|rule.match	|yes	|Indicates whether the match on the query term should be `exact` or `contains`.|
|excludes	|no	|List of document `id`s that should be excluded from the search results.|
|includes	|no	|List of document `id`s that should be included in the search results with their corresponding `positions`.|
|filter_by	|no	|A filter by clause that is applied to any search query that matches the override rule.|
|remove_matched_tokens	|no	|Indicates whether search query tokens that exist in the override's rule should be removed from the search query. <br/><br/>Default: `true`.|
|filter_curated_hits	|no	|When set to `true`, the filter conditions of the query is applied to the curated records as well. <br/><br/>Default: `false`.|


## List all overrides
Listing all overrides associated with a given collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').overrides().retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->overrides->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].overrides.retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].overrides.retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').overrides.retrieve();
```

  </template>
  <template v-slot:Java>

```java
SearchOverridesResponse searchOverridesResponse = client.collections("companies").overrides().retrieve();
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/collections/companies/overrides"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "overrides":[
    {
      "id":"customize-apple",
      "excludes":[
        {
          "id":"287"
        }
      ],
      "includes":[
        {
          "id":"422",
          "position":1
        },
        {
          "id":"54",
          "position":2
        }
      ],
      "rule":{
        "match":"exact",
        "query":"apple"
      }
    }
  ]
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/overrides`


## Retrieve an override
Fetch an individual override associated with a collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').overrides('customize-apple').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->overrides['customize-apple']->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].overrides['customize-apple'].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].overrides['customize-apple'].retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').override('customize-apple').retrieve();
```

  </template>
  <template v-slot:Java>

```java
SearchOverride searchOverride = client.collections("companies").overrides("customize-apple").retrieve();
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/overrides/customize-apple" -X GET \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id":"customize-apple",
  "excludes":[
    {
      "id":"287"
    }
  ],
  "includes":[
    {
      "id":"422",
      "position":1
    },
    {
      "id":"54",
      "position":2
    }
  ],
  "rule":{
    "match":"exact",
    "query":"apple"
  }
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/overrides/:id`


## Delete an override
Deleting an override associated with a collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').overrides('customize-apple').delete()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->overrides['customize-apple']->delete();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].overrides['customize-apple'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].overrides['customize-apple'].delete
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').override('customize-apple').delete();
```

  </template>
  <template v-slot:Java>

```java
SearchOverride searchOverride = client.collections("companies").overrides("customize-apple").delete();
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/overrides/customize-apple" -X DELETE \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "customize-apple"
}
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection/overrides/:id`

