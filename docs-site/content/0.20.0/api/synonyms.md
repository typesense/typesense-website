---
sitemap:
  priority: 0.7
---

# Synonyms
The synonyms feature allows you to define search terms that should be considered equivalent. For eg: when you define a synonym for `sneaker` as `shoe`, searching for `sneaker` will now return all records with the word `shoe` in them, in addition to records with the word `sneaker`.

Typesense supports two types of synonyms:

1. **Multi-way synonyms**: Defining words `ABC, DEF and XYZ` (for eg) as multi-way synonyms will cause searches for any one of those words (eg: `DEF`) to return records containing at least one of the words in the synonym set (eg: records with `ABC` or `DEF` or `XYZ` are returned).

2. **One-way synonyms**: Defining the words `DEF` and `XYZ` as one-way synonyms of `ABC` will cause searches for `DEF` or `XYZ` to return records containing `ABC`.

## Create or update a synonym

### Multi-way synonym

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
synonym = {
  "synonyms": ["blazer", "coat", "jacket"]
}

// Creates/updates a synonym called `coat-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('coat-synonyms', synonym)
```

  </template>

  <template v-slot:Java>

```java
SearchSynonymSchema synonym = new SearchSynonymSchema();
synonym.addSynonymsItem("blazer").addSynonymsItem("coat").addSynonymsItem("jacket");

// Creates/updates a synonym called `coat-synonyms` in the `products` collection
client.collections("products").synonyms().upsert("coat-synonyms", synonym);
```

  </template>

  <template v-slot:PHP>

```php
$synonym = [
  "synonyms" => ["blazer", "coat", "jacket"]
];

# Creates/updates a synonym called `coat-synonyms` in the `products` collection
$client->collections['products']->synonyms->upsert('coat-synonyms', $synonym);
```

  </template>
  <template v-slot:Python>

```py
synonym = {
  "synonyms": ["blazer", "coat", "jacket"]
}

# Creates/updates a synonym called `coat-synonyms` in the `products` collection
client.collections['products'].synonyms.upsert('coat-synonyms', synonym)
```

  </template>
  <template v-slot:Ruby>

```rb
synonym = {
  "synonyms" => ["blazer", "coat", "jacket"]
}

# Creates/updates a synonym called `coat-synonyms` in the `products` collection
client.collections['products'].synonyms.upsert('coat-synonyms', synonym)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/products/synonyms/coat-synonyms" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "synonyms": ["blazer", "coat", "jacket"]
}'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "coat-synonyms",
  "synonyms": ["blazer", "coat", "jacket"]
}
```

  </template>
</Tabs>

### One-way synonym

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
synonym = {
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
}

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('blazer-synonyms', synonym)
```

  </template>


  <template v-slot:Java>

```java
SearchSynonymSchema synonym = new SearchSynonymSchema();
synonym.addSynonymsItem("coat").addSynonymsItem("jacket");
synonym.root("blazer");

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections("products").synonyms().upsert("blazer-synonyms", synonym);
```

  </template>

  <template v-slot:PHP>

```php
$synonym = [
  'root' => 'blazer',
  'synonyms' => ['coat', 'jacket'],
];

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
$client->collections['products']->synonyms->upsert('blazer-synonyms', $synonym);
```

  </template>
  <template v-slot:Python>

```py
synonym = {
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
}

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('blazer-synonyms', synonym)
```

  </template>
  <template v-slot:Ruby>

```rb
synonym = {
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
}

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('blazer-synonyms', synonym)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/products/synonyms/coat-synonyms" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
    "root": "blazer",
    "synonyms": ["coat", "jacket"]
}'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id":"coat-synonyms",
  "root":"blazer",
  "synonyms": ["coat", "jacket"]
}
```

  </template>
</Tabs>

#### Definition
`PUT ${TYPESENSE_HOST}/collections/:collection/synonyms/:id`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|synonyms	|yes	|Array of words that should be considered as synonyms.|
|root	|no	|For 1-way synonyms, indicates the root word that words in the synonyms parameter map to.|

## Retrieve a synonym
We can retrieve a single synonym.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('products').synonyms('coat-synonyms').retrieve()
```

  </template>

  <template v-slot:Java>

```java
SearchSynonym searchSynonym = client.collections("products").synonyms("coat-synonyms").retrieve();
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['products']->synonyms['coat-synonyms']->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections('products').synonyms('coat-synonyms').retrieve
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections('products').synonyms('coat-synonyms').retrieve
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" "http://localhost:8108/collections/products/synonyms"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "coat-synonyms",
  "root":"",
  "synonyms": ["blazer", "coat", "jacket"]
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/synonyms/:id`

## List all synonyms
List all synonyms associated with a given collection.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('products').synonyms().retrieve()
```

  </template>

  <template v-slot:Java>

```java
SearchSynonymsResponse searchSynonymsResponse =  client.collections("products").synonyms().retrieve();
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['products']->synonyms->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections['products'].synonyms.retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['products'].synonyms.retrieve
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/collections/products/synonyms"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "synonyms": [
    {
      "id": "coat-synonyms",
      "root": "",
      "synonyms": ["blazer", "coat", "jacket"]
    }
  ]
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/synonyms`

## Delete a synonym
Delete a synonym associated with a collection.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('products').synonyms('coat-synonyms').delete()
```

  </template>

  <template v-slot:Java>

```java
SearchSynonym searchSynonym = client.collections("products").synonyms("coat-synonyms").delete();
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['products']->synonyms['coat-synonyms']->delete();
```

  </template>
  <template v-slot:Python>

```py
client.collections['products'].synonyms['coat-synonyms'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['products'].synonyms['coat-synonyms'].delete
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/products/synonyms/coat-synonyms" -X DELETE \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "coat-synonyms"
}
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection/synonyms/:id`

