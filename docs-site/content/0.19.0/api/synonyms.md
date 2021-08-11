---
sitemap:
  priority: 0.3
---

# Synonyms
The synonyms feature allows you to define search terms that should be considered equivalent. For eg: when you define a synonym for `sneaker` as `shoe`, searching for `sneaker` will now return all records with the word `shoe` in them, in addition to records with the word `sneaker`.

Typesense supports two types of synonyms:

1. **One-way synonyms**: Defining the words `iphone` and `android` as one-way synonyms of `smart phone` will cause searches for `smart phone` to return documents containing `iphone` or `android` or both.

2. **Multi-way synonyms**: Defining the words `blazer`, `coat` and `jacket` as multi-way synonyms will cause searches for any one of those words (eg: `coat`) to return documents containing at least one of the words in the synonym set (eg: records with `blazer` or `coat` or `jacket` are returned).

## Create or update a synonym

### Multi-way synonym

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
synonym = {
  "synonyms": ["blazer", "coat", "jacket"]
}

// Creates/updates a synonym called `coat-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('coat-synonyms', synonym)
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
synonym = {
  "root": "smart phone",
  "synonyms": ["iphone", "android"]
}

// Creates/updates a synonym called `smart-phone-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('smart-phone-synonyms', synonym)
```

  </template>

  <template v-slot:PHP>

```php
$synonym = [
  'root' => 'smart phone',
  'synonyms' => ['iphone', 'android'],
];

// Creates/updates a synonym called `smart-phone-synonyms` in the `products` collection
$client->collections['products']->synonyms->upsert('smart-phone-synonyms', $synonym);
```

  </template>
  <template v-slot:Python>

```py
synonym = {
  "root": "smart phone",
  "synonyms": ["iphone", "android"]
}

// Creates/updates a synonym called `smart-phone-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('smart-phone-synonyms', synonym)
```

  </template>
  <template v-slot:Ruby>

```rb
synonym = {
  "root": "smart phone",
  "synonyms": ["iphone", "android"]
}

// Creates/updates a synonym called `smart-phone-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('smart-phone-synonyms', synonym)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/products/synonyms/smart-phone-synonyms" -X PUT \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
    "root": "smart phone",
    "synonyms": ["iphone", "android"]
}'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id":"smart-phone-synonyms",
  "root":"smart phone",
  "synonyms": ["iphone", "android"]
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('products').synonyms('coat-synonyms').retrieve()
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('products').synonyms().retrieve()
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('products').synonyms('coat-synonyms').delete()
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

