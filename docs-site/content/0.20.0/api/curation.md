---
sitemap:
  priority: 0.3
---

# Curation
While Typesense makes it really easy and intuitive to deliver great search results, sometimes you might want to promote certain documents over others. Or, you might want to exclude certain documents from a query's result set.

Using overrides, you can include or exclude specific documents for a given query.

## Create or update an override
In the following example, we are overriding the search results by placing the documents with ids `422` and `54` in the first and second positions respectively via the includes condition. Additionally, we're ensuring that the document with id `287` is not returned at all via the `excludes` condition. You need to specify only one of `exclude` or `include`.

Note how we are applying these overrides to an `exact` match of the query `apple`. Instead, if we want to match all queries that contained the word `apple`, we will use the `contains` match instead.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
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

  <template v-slot:Java>

```java
SearchOverrideSchema searchOverrideSchema = new SearchOverrideSchema();

List<SearchOverrideInclude> searchOverrideIncludes = new ArrayList<>();
searchOverrideIncludes.add(new SearchOverrideInclude().id("422").position(1));
searchOverrideIncludes.add(new SearchOverrideInclude().id("54").position(2));

List<SearchOverrideExclude> searchOverrideExcludes = new ArrayList<>();
searchOverrideExcludes.add(new SearchOverrideExclude().id("287"));

searchOverrideSchema.rule(new SearchOverrideRule().query("apple").match("exact"))
                    .includes(searchOverrideIncludes)
                    .excludes(searchOverrideExcludes);

// Creates/updates an override called `customize-apple` in the `companies` collection
SearchOverride searchOverride = client.collections("companies").overrides().upsert("customize-apple", searchOverrideSchema);

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

#### Definition
`PUT ${TYPESENSE_HOST}/collections/:collection/overrides/:id`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|excludes	|no	|List of document `id`s that should be excluded from the search results.|
|includes	|no	|List of document `id`s that should be included in the search results with their corresponding `positions`.|
|rule.query	|yes	|Indicates what search queries should be overridden.|
|rule.match	|yes	|Indicates whether the match on the query term should be `exact` or `contains`.|

## List all overrides
Listing all overrides associated with a given collection.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').overrides().retrieve()
```

  </template>

  <template v-slot:Java>

```java
SearchOverridesResponse searchOverridesResponse = client.collections("companies").overrides().retrieve();
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

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').overrides('customize-apple').retrieve()
```

  </template>

  <template v-slot:Java>

```java
SearchOverride searchOverride = client.collections("companies").overrides("customize-apple").retrieve();
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

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').overrides('customize-apple').delete()
```

  </template>

  <template v-slot:Java>

```java
SearchOverride searchOverride = client.collections("companies").overrides("customize-apple").delete();
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

