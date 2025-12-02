---
sidebarDepth: 1
sitemap:
  priority: 0.7
---

# Synonym Sets

:::warning Breaking Change in v30
When you upgrade to v30, all existing collection-specific synonym definitions will be automatically migrated to the new synonym sets format. Your searches will continue working without any hiccups, but you have to use the new API and client methods for reading and writing to the synonym definitions. If self-hosting, [**perform a snapshot**](https://typesense.org/docs/30.0/api/cluster-operations.html#create-snapshot-for-backups) before upgrading for the Synonyms & Overrides to be migrated to v30.
:::

The synonym sets feature allows you to define search terms that should be considered equivalent. For example: when you define a synonym for `sneaker` as `shoe`, searching for `sneaker` will now return all records with the word `shoe` in them, in addition to records with the word `sneaker`.

Typesense supports two types of synonyms within synonym sets:

1. **One-way synonyms**: Defining the words `iphone` and `android` as one-way synonyms of `smart phone` will cause searches for `smart phone` to return documents containing `iphone` or `android` or both.

2. **Multi-way synonyms**: Defining the words `blazer`, `coat` and `jacket` as multi-way synonyms will cause searches for any one of those words (eg: `coat`) to return documents containing at least one of the words in the synonym set (eg: records with `blazer` or `coat` or `jacket` are returned).

:::tip Precedence
When using Synonym Sets and [Overrides](./curation.md) together, Overrides are handled first since the rules can contain instructions to replace the query. Synonym Sets will then work on the modified query.
:::

:::tip Locale-specific synonyms
When a synonym has a `locale` specified, it will only be applied when searching fields with a matching locale. If no locale is specified for a synonym, it will be applied globally. This helps manage cases where the same word has different meanings across languages.
:::

:::tip Phrase Match Queries & Filtering
Synonyms are not triggered when using Phrase Search or Filtering, by design.

So for eg, `"Site Reliability"` will not return results containing `Infrastructure` even if they are defined as multi-way synonyms, because of the double quotes around `"Site Reliability"` which makes it a phrase search. So only documents that contain that exact full phrase are returned, without any synonym matches.

Also, synonyms are only applied to the tokens in the `q` search parameter, and not to any tokens in the `filter_by` parameter. For eg, if you define a multi-way synonym for `abc <> xyz` and use `filter_by: title:=abc`, it will only match documents where `title=abc`, not `title=xyz`, because filtering is designed to be similar to a SQL `WHERE` condition to do a structured query and synonyms don't apply to filters.
:::

## Create or update a synonym set

### Multi-way synonym

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
synonymSet = {
  items: [
    {
      id: 'coat-synonyms',
      synonyms: ['blazer', 'coat', 'jacket'],
    },
  ],
}

// Creates/updates a synonym set called `clothing-synonyms`
client.synonymSets('clothing-synonyms').upsert(synonymSet)
```

  </template>

  <template v-slot:PHP>

```php
$synonymSet = [
  "items" => [
    [
      "id" => "coat-synonyms",
      "synonyms" => ["blazer", "coat", "jacket"]
    ]
  ]
];

# Creates/updates a synonym set called `clothing-synonyms`
$client->synonymSets['clothing-synonyms']->upsert($synonymSet);
```

  </template>
  <template v-slot:Python>

```py
synonym_set = {
  "items": [
    {
      "id": "coat-synonyms",
      "synonyms": ["blazer", "coat", "jacket"]
    }
  ]
}

# Creates/updates a synonym set called `clothing-synonyms`
client.synonym_sets["clothing-synonyms"].upsert(synonym_set)
```

  </template>
  <template v-slot:Ruby>

```rb
synonym_set = {
  "items" => [
    {
      "id" => "coat-synonyms",
      "synonyms" => ["blazer", "coat", "jacket"]
    }
  ]
}

# Creates/updates a synonym set called `clothing-synonyms`
client.synonym_sets["clothing-synonyms"].upsert(synonym_set)
```

  </template>
  <template v-slot:Java>

```java
SynonymItemSchema synonymItem = new SynonymItemSchema();
synonymItem.setId("coat-synonyms");
synonymItem.addSynonymsItem("blazer").addSynonymsItem("coat").addSynonymsItem("jacket");

SynonymSetCreateSchema synonymSet = new SynonymSetCreateSchema();
synonymSet.addItemsItem(synonymItem);

// Creates/updates a synonym set called `clothing-synonyms`
client.synonymSets("clothing-synonyms").upsert(synonymSet);
```

  </template>
  <template v-slot:Go>

```go
synonymItem := &api.SynonymItemSchema{
  ID:       "coat-synonyms",
  Synonyms: []string{"blazer", "coat", "jacket"},
}

synonymSet := &api.SynonymSetCreateSchema{
  Items: []*api.SynonymItemSchema{synonymItem},
}

// Creates/updates a synonym set called `clothing-synonyms`
client.SynonymSets("clothing-synonyms").Upsert(context.Background(), synonymSet)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/synonym_sets/clothing-synonyms" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [
    {
      "id": "coat-synonyms",
      "synonyms": ["blazer", "coat", "jacket"]
    }
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
  "name": "clothing-synonyms",
  "items": [
    {
      "id": "coat-synonyms",
      "synonyms": ["blazer", "coat", "jacket"]
    }
  ]
}
```

  </template>
</Tabs>

### One-way synonym

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
synonymSet = {
  items: [
    {
      id: 'smart-phone-synonyms',
      root: 'smart phone',
      synonyms: ['iphone', 'android'],
    },
  ],
}

// Creates/updates a synonym set called `tech-synonyms`
client.synonymSets('tech-synonyms').upsert(synonymSet)
```

  </template>

  <template v-slot:PHP>

```php
$synonymSet = [
  "items" => [
    [
      "id" => "smart-phone-synonyms",
      "root" => "smart phone",
      "synonyms" => ["iphone", "android"]
    ]
  ]
];

# Creates/updates a synonym set called `tech-synonyms`
$client->synonymSets['tech-synonyms']->upsert($synonymSet);
```

  </template>
  <template v-slot:Python>

```py
synonym_set = {
  "items": [
    {
      "id": "smart-phone-synonyms",
      "root": "smart phone",
      "synonyms": ["iphone", "android"]
    }
  ]
}

# Creates/updates a synonym set called `tech-synonyms`
client.synonym_sets["tech-synonyms"].upsert(synonym_set)
```

  </template>
  <template v-slot:Ruby>

```rb
synonym_set = {
  "items" => [
    {
      "id" => "smart-phone-synonyms",
      "root" => "smart phone",
      "synonyms" => ["iphone", "android"]
    }
  ]
}

# Creates/updates a synonym set called `tech-synonyms`
client.synonym_sets["tech-synonyms"].upsert(synonym_set)
```

  </template>
  <template v-slot:Java>

```java
SynonymItemSchema synonymItem = new SynonymItemSchema();
synonymItem.setId("smart-phone-synonyms");
synonymItem.addSynonymsItem("iphone").addSynonymsItem("android");
synonymItem.setRoot("smart phone");

SynonymSetCreateSchema synonymSet = new SynonymSetCreateSchema();
synonymSet.addItemsItem(synonymItem);

// Creates/updates a synonym set called `tech-synonyms`
client.synonymSets("tech-synonyms").upsert(synonymSet);
```

  </template>
  <template v-slot:Go>

```go
synonymItem := &api.SynonymItemSchema{
  ID:       "smart-phone-synonyms",
  Root:     pointer.String("smart phone"),
  Synonyms: []string{"iphone", "android"},
}

synonymSet := &api.SynonymSetCreateSchema{
  Items: []*api.SynonymItemSchema{synonymItem},
}

// Creates/updates a synonym set called `tech-synonyms`
client.SynonymSets("tech-synonyms").Upsert(context.Background(), synonymSet)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/synonym_sets/tech-synonyms" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "items": [
    {
      "id": "smart-phone-synonyms",
      "root": "smart phone",
      "synonyms": ["iphone", "android"]
    }
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
  "name": "tech-synonyms",
  "items": [
    {
      "id": "smart-phone-synonyms",
      "root": "smart phone",
      "synonyms": ["iphone", "android"]
    }
  ]
}
```

  </template>
</Tabs>

#### Definition

`PUT ${TYPESENSE_HOST}/synonym_sets/:synonymSetName`

### Arguments

| Parameter              | Required | Description                                                                                                                                                                       |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| items                  | yes      | Array of synonym items, where each item contains the synonym definitions.                                                                                                         |
| items.id               | yes      | Unique identifier for the synonym item.                                                                                                                                           |
| items.synonyms         | yes      | Array of words that should be considered as synonyms.                                                                                                                             |
| items.root             | no       | For 1-way synonyms, indicates the root word that words in the synonyms parameter map to.                                                                                          |
| items.locale           | no       | Locale for the synonym. If specified, the synonym will only be applied when searching a field that has a matching locale. If not specified, the synonym will be applied globally. |
| items.symbols_to_index | no       | By default, special characters are dropped from synonyms. Use this attribute to specify which special characters should be indexed as is.                                         |

After creating a synonym set, be sure to link it to a collection. Read more in the [documentation on linking synonym sets with collections](https://typesense.org/docs/30.0/api/synonyms.html#linking-synonym-sets-with-collections).

## Retrieve a synonym set

We can retrieve a single synonym set.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
client.synonymSets('clothing-synonyms').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->synonymSets['clothing-synonyms']->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.synonym_sets["clothing-synonyms"].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.synonym_sets["clothing-synonyms"].retrieve()
```

  </template>
  <template v-slot:Java>

```java
SynonymSet synonymSet = client.synonymSets("clothing-synonyms").retrieve();
```

  </template>
  <template v-slot:Go>

```go
client.SynonymSets("clothing-synonyms").Retrieve(context.Background())
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/synonym_sets/clothing-synonyms"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "clothing-synonyms",
  "items": [
    {
      "id": "coat-synonyms",
      "synonyms": ["blazer", "coat", "jacket"]
    }
  ]
}
```

  </template>
</Tabs>

#### Definition

`GET ${TYPESENSE_HOST}/synonym_sets/:synonymSetName`

## List all synonym sets

List all synonym sets.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
client.synonymSets().retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->synonymSets->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.synonym_sets.retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.synonym_sets.retrieve()
```

  </template>
  <template v-slot:Java>

```java
List<SynonymSetSchema> synonymSets = client.synonymSets().retrieve();
```

  </template>
  <template v-slot:Go>

```go
client.SynonymSets().Retrieve(context.Background())
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/synonym_sets"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
[
  {
    "name": "clothing-synonyms",
    "items": [
      {
        "id": "coat-synonyms",
        "synonyms": ["blazer", "coat", "jacket"]
      }
    ]
  }
]
```

  </template>
</Tabs>

#### Definition

`GET ${TYPESENSE_HOST}/synonym_sets`

## Delete a synonym set

Delete a synonym set.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
client.synonymSets('clothing-synonyms').delete()
```

  </template>

  <template v-slot:PHP>

```php
$client->synonymSets['clothing-synonyms']->delete();
```

  </template>
  <template v-slot:Python>

```py
client.synonym_sets["clothing-synonyms"].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.synonym_sets["clothing-synonyms"].delete()
```

  </template>
  <template v-slot:Java>

```java
SynonymSetDeleteSchema result = client.synonymSets("clothing-synonyms").delete();
```

  </template>
  <template v-slot:Go>

```go
client.SynonymSets("clothing-synonyms").Delete(context.Background())
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/synonym_sets/clothing-synonyms" -X DELETE \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "clothing-synonyms"
}
```

  </template>
</Tabs>

#### Definition

`DELETE ${TYPESENSE_HOST}/synonym_sets/:synonymSetName`

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
  "synonym_sets": ["clothing-synonyms", "tech-synonyms"]
}
```

### Altering an existing collection

```shell
curl "http://localhost:8108/collections/products" -X PATCH \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
-d '{
    "synonym_sets": ["clothing-synonyms", "tech-synonyms"]
}'
```

## Using synonym sets in search

Synonym sets can be used in search parameters dynamically. The search operation will look for synonyms in:

1. The synonym sets specified in the search parameters
2. The synonym sets linked to the collection

For example, if the collection `products` is linked to `clothing-synonyms` synonym set, the following search request will use synonyms from `clothing-synonyms`, `tech-synonyms`, and `electronics-synonyms`:

```shell
curl "http://localhost:8108/collections/products/documents/search?q=controller&query_by=name&synonym_sets=tech-synonyms,electronics-synonyms" -X GET \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

## Upsert a synonym set item

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
synonymSetItem = {
  root: 'smart phone',
  synonyms: ['iphone', 'android'],
}

// Creates/updates a synonym set called `tech-synonyms`
client.synonymSets('tech-synonyms').items('smart-phone-synonyms').upsert(synonymSetItem)

```

  </template>

  <template v-slot:PHP>

```php
$synonymSetItem = [
  'root' => 'smart phone',
  'synonyms' => ['iphone', 'android'],
];

$client->synonymSets['tech-synonyms']->items['smart-phone-synonyms']->upsert($synonymSetItem);
```

  </template>

  <template v-slot:Python>

```py
synonymSetItem = {
  "root": "smart phone",
  "synonyms": ["iphone", "android"],
}

# Creates/updates a synonym set called `tech-synonyms`
client.synonym_sets['tech-synonyms'].items['smart-phone-synonyms'].upsert(synonymSetItem)
```

  </template>

  <template v-slot:Ruby>

```rb
synonymSetItem = {
  "root": "smart phone",
  "synonyms": ["iphone", "android"],
}

# Creates/updates a synonym set called `tech-synonyms`
client.synonym_sets['tech-synonyms'].items['smart-phone-synonyms'].upsert(synonymSetItem)
```

  </template>

  <template v-slot:Java>

```java
SynonymItemSchema synonymSetItem = new SynonymItemSchema();
synonymSetItem.setId("smart-phone-synonyms");
synonymSetItem.addSynonymsItem("iphone").addSynonymsItem("android");
synonymSetItem.setRoot("smart phone");

client.synonymSets('tech-synonyms').items('smart-phone-synonyms').upsert(synonymSetItem);
```

  </template>

  <template v-slot:Go>

```go
synonymItem := &api.SynonymItemSchema{
  ID:       "smart-phone-synonyms",
  Root:     pointer.String("smart phone"),
  Synonyms: []string{"iphone", "android"},
}

// Creates/updates a synonym set called `tech-synonyms`
client.SynonymSets("tech-synonyms").Items("smart-phone-synonyms").Upsert(context.Background(), synonymItem)

```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/synonym_sets/tech-synonyms/items/smart-phone-synonyms" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "root": "smart phone",
  "synonyms": ["iphone", "android"]
}'
```

  </template>
</Tabs>

#### Definition

`PUT ${TYPESENSE_HOST}/synonym_sets/:synonymSetName/items/:id`



## Retrieve a synonym set item


<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
client.synonymSets('tech-synonyms').items('smart-phone-synonyms').retrieve()
```

  </template>
  <template v-slot:PHP>

```php
$client->synonymSets['tech-synonyms']->items['smart-phone-synonyms']->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.synonym_sets['tech-synonyms'].items['smart-phone-synonyms'].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.synonym_sets['tech-synonyms'].items['smart-phone-synonyms'].retrieve()
```

  </template>
  <template v-slot:Java>

```java
SynonymItemSchema synonymItem = client.synonymSets("tech-synonyms").items("smart-phone-synonyms").retrieve();
```

  </template>
  <template v-slot:Go>

```go
synonymItem, err := client.SynonymSets("tech-synonyms").Items("smart-phone-synonyms").Retrieve(context.Background())
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/synonym_sets/tech-synonyms/items/smart-phone-synonyms"
```

  </template>
</Tabs>

#### Definition

`GET ${TYPESENSE_HOST}/synonym_sets/:synonymSetName/items/:id`



## List all synonym set items


<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
client.synonymSets('tech-synonyms').items().retrieve()
```

  </template>
  <template v-slot:PHP>

```php
$client->synonymSets['tech-synonyms']->items()->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.synonym_sets['tech-synonyms'].items().retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.synonym_sets['tech-synonyms'].items().retrieve()
```

  </template>
  <template v-slot:Java>

```java
SynonymItemSchema synonymItem = client.synonymSets("tech-synonyms").items().retrieve();
```

  </template>
  <template v-slot:Go>

```go
synonymItem, err := client.SynonymSets("tech-synonyms").Items().Retrieve(context.Background())
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/synonym_sets/tech-synonyms/items"
```

  </template>
</Tabs>

#### Definition

`GET ${TYPESENSE_HOST}/synonym_sets/:name/items`

## Delete a synonym set item


<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Go','Shell']">
  <template v-slot:JavaScript>

```js
client.synonymSets('tech-synonyms').items('smart-phone-synonyms').delete()
```

  </template>
  <template v-slot:PHP>

```php
$client->synonymSets['tech-synonyms']->items['smart-phone-synonyms']->delete();
```

  </template>
  <template v-slot:Python>

```py
client.synonym_sets['tech-synonyms'].items['smart-phone-synonyms'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.synonym_sets['tech-synonyms'].items['smart-phone-synonyms'].delete()
```

  </template>
  <template v-slot:Java>

```java
client.synonymSets("tech-synonyms").items("smart-phone-synonyms").delete();
```

  </template>
  <template v-slot:Go>

```go
client.SynonymSets("tech-synonyms").Items("smart-phone-synonyms").Delete(context.Background())
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/synonym_sets/tech-synonyms/items/smart-phone-synonyms" -X DELETE \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Definition

`DELETE ${TYPESENSE_HOST}/synonym_sets/:synonymSetName/items/:id`

## Migration from old synonyms API

:::tip Automatic Migration
All existing synonyms from previous versions have been automatically migrated to the new synonym sets format. Each collection's synonyms are now stored in a synonym set with the same name as the collection, postfixed by `*_synonyms_index` (e.g. `products_synonyms_index`).
:::

### Key differences:

1. **API Endpoints**:

   - Old: `/collections/{collection}/synonyms/*`
   - New: `/synonym_sets/*`

2. **Data Structure**:

   - Old: Direct synonym objects
   - New: Synonym sets containing arrays of synonym items

3. **Collection Association**:

   - Old: Synonyms were directly associated with collections
   - New: Synonym sets are linked to collections via the `synonym_sets` field

4. **Search Usage**:
   - Old: Synonyms were automatically applied based on collection association
   - New: Synonym sets can be dynamically specified in search parameters in addition to collection-linked sets

### Example of migrated data:

**Before (v29 and earlier):**

```json
{
  "id": "coat-synonyms",
  "synonyms": ["blazer", "coat", "jacket"]
}
```

**After (v30):**

```json
{
  "name": "products",
  "items": [
    {
      "id": "coat-synonyms",
      "synonyms": ["blazer", "coat", "jacket"]
    }
  ]
}
```

The new API provides better organization, reusability across collections, and more flexible search-time synonym application.
