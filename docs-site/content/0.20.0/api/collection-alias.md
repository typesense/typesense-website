---
sitemap:
  priority: 0.3
---

# Collection Alias
An alias is a virtual collection name that points to a real collection. If you're familiar with symbolic links on Linux, it's very similar to that.

Aliases are useful when you want to reindex your data in the background on a new collection and switch your application to it without any changes to your code. Let's take an example.

Let's say we have a collection called `companies_june10` and an alias called `companies` pointing to that collection.

`collection ---> companies_june10`

On the next day (June 11), we will create a new collection called `companies_june11` and start indexing the documents in the background into this collection. When we are done indexing, if we updated the `companies` alias to point to this new collection, your application would immediately start querying against the freshly indexed collection.

`collection ---> companies_june11`

Convenient isn't it? Let's now look at how we can create, update and manage aliases.

## Create or Update an alias

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
aliased_collection = {
  'collection_name': 'companies_june11'
}

// Creates/updates an alias called `companies` to the `companies_june11` collection
client.aliases().upsert('companies', aliased_collection)
```

  </template>

  <template v-slot:Java>

```java
CollectionAlias collectionAlias = new CollectionAlias();
collectionAlias.collectionName("companies_june11");

client.aliases().upsert("companies", collectionAlias);
```

  </template>

  <template v-slot:PHP>

```php
$aliasedCollection = [
  'collection_name' => 'companies_june11'
]

# Creates/updates an alias called `companies` to the `companies_june11` collection
$client->aliases->upsert('companies', $aliasedCollection)
```

  </template>
  <template v-slot:Python>

```py
aliased_collection = {
  'collection_name': 'companies_june11'
}

# Creates/updates an alias called `companies` to the `companies_june11` collection
client.aliases.upsert('companies', aliased_collection)
```

  </template>
  <template v-slot:Ruby>

```rb
aliased_collection = {
  'collection_name' => 'companies_june11'
}

# Creates/updates an alias called `companies` to the `companies_june11` collection
client.aliases.upsert('companies', aliased_collection)
```

  </template>
  <template v-slot:Dart>

```dart
final aliasedCollection = {
  'collection_name': 'companies_june11'
};

// Creates/updates an alias called `companies` to the `companies_june11` collection
await client.aliases.upsert('companies', aliased_collection);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/aliases/companies" -X PUT \
    -H "Content-Type: application/json" \
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "collection_name": "companies_june11"
    }'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "collection_name": "companies_june11",
}
```

  </template>
</Tabs>

#### Definition
`PUT ${TYPESENSE_HOST}/aliases/:alias`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|collection_name	|yes	|Name of the collection you wish to map the alias to.|

## Retrieve an alias
We can find out which collection an alias points to by fetching it.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.aliases('companies').retrieve()
```

  </template>

  <template v-slot:Java>

```java
CollectionAlias collectionAlias = client.aliases("companies").retrieve();
```

  </template>

  <template v-slot:PHP>

```php
$client->aliases['companies']->retrieve()
```

  </template>
  <template v-slot:Python>

```py
client.aliases['companies'].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.aliases['companies'].retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.alias('companies').retrieve();
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    "http://localhost:8108/aliases/companies"

```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "collection_name": "companies_june11",
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/aliases/:alias`

## List all aliases
List all aliases and the corresponding collections that they map to.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.aliases().retrieve()
```

  </template>

  <template v-slot:Java>

```java
CollectionAliasesResponse collectionAliasesResponse = client.aliases().retrieve();
```

  </template>

  <template v-slot:PHP>

```php
$client->aliases->retrieve()
```

  </template>
  <template v-slot:Python>

```py
client.aliases.retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.aliases.retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.aliases.retrieve();
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     "http://localhost:8108/aliases"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "aliases": [
    {
      "name": "companies",
      "collection_name": "companies_june11"
    },
    {
      "name": "employees",
      "collection_name": "employees_june11"
    }
  ]
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/aliases`

## Delete an alias

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.aliases('companies').delete()
```

  </template>

  <template v-slot:Java>

```java
CollectionAlias collectionAlias = client.aliases("companies").delete();
```

  </template>

  <template v-slot:PHP>

```php
$client->aliases['companies']->delete()
```

  </template>
  <template v-slot:Python>

```py
client.aliases['companies'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.aliases['companies'].delete
```

  </template>
  <template v-slot:Dart>

```dart
await client.alias('companies').delete();
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/aliases/companies" -X DELETE
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "collection_name": "companies_june11"
}
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/aliases/:alias`

