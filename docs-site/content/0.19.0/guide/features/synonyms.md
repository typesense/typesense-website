# Synonyms

Synonyms allow you to define equivalent search terms. For example, blazers and coats could be considered synonyms. Once these are defined as synonyms in Typesense, a search query for blazer would bring up results with coats as well.

Typesense has two types of synonyms, one-way and multi-way. With one-way synonyms, you can define synonyms for one root word. In multi-way synonyms, you can define a set of words as synonyms. Let's define a one-way synonym for blazer:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
synonym = {
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
}

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections('products').synonyms().upsert('blazer-synonyms', synonym)
```
  </template>

  <template v-slot:PHP>

```php
$synonym = [
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
];

// Creates/updates a synonym called `blazer-synonyms` in the `products` collection
$client->collections['products']->synonyms()->upsert('blazer-synonyms', $synonym);
```
  </template>
  <template v-slot:Python>

```python
synonym = {
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
}

# Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections['products'].synonyms().upsert('blazer-synonyms', synonym)
```
   </template>
   <template v-slot:Ruby>

```ruby
synonym = {
  "root": "blazer",
  "synonyms": ["coat", "jacket"]
}

# Creates/updates a synonym called `blazer-synonyms` in the `products` collection
client.collections['products'].synonyms().upsert('blazer-synonyms', synonym)
```
  </template>
</Tabs>

Sample response:

```json
{
  "id":"coat-synonyms",
  "root":"blazer",
  "synonyms": ["coat", "jacket"]
}
```

In the above example, any query for blazer would bring up results for coat and jacket as well. Similary, you can create a multi-way synonym as well:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby', 'Shell']">
  <template v-slot:JavaScript>

```javascript
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
]

# Creates/updates a synonym called `coat-synonyms` in the `products` collection
$client->collections['products']->synonyms->upsert('coat-synonyms', $synonym)
```
  </template>
  <template v-slot:Python>

```python
synonym = {
  "synonyms": ["blazer", "coat", "jacket"]
}

# Creates/updates a synonym called `coat-synonyms` in the `products` collection
client.collections['products'].synonyms.upsert('coat-synonyms', synonym)
```
   </template>
   <template v-slot:Ruby>

```ruby
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

For [multi-way synonym](../../api/synonyms.html#multi-way-synonym), you don't need to define the root word. You can find more details on synonyms [here](../../api/synonyms.html).
