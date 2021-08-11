---
sitemap:
  priority: 0.7
---

# Collections

In Typesense, a group of related documents is called a collection. A collection is roughly equivalent to a table in a relational database.

## Create a collection

When a `collection` is created, we give it a name and describe the fields that will be indexed from the documents that are added to the `collection`.

From Typesense `v0.20`, we can also create a collection that automatically detects the types of the various fields in the document. 

### With pre-defined schema

Let's first create a collection with an explicit, pre-defined schema.

:::tip
Your documents can contain other fields not mentioned in the collection's schema - they will be stored 
on _disk_ but not indexed in _memory_.
:::

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  'name': 'companies',
  'fields': [
    {
      'name': 'company_name',
      'type': 'string',
      'facet': false
    },
    {
      'name': 'num_employees',
      'type': 'int32',
      'facet': false
    },
    {
      'name': 'country',
      'type': 'string',
      'facet': true
    }
  ],
  'default_sorting_field': 'num_employees'
}

client.collections().create(schema)
```

  </template>

  <template v-slot:PHP>

```php
$schema = [
  'name'      => 'companies',
  'fields'    => [
    [
      'name'  => 'company_name',
      'type'  => 'string'
    ],
    [
      'name'  => 'num_employees',
      'type'  => 'int32'
    ],
    [
      'name'  => 'country',
      'type'  => 'string',
      'facet' => true
    ]
  ],
  'default_sorting_field' => 'num_employees'
];

$client->collections->create($schema);
```

  </template>
  <template v-slot:Python>

```py
schema = {
  'name': 'companies',
  'fields': [
    {
      'name'  :  'company_name',
      'type'  :  'string'
    },
    {
      'name'  :  'num_employees',
      'type'  :  'int32'
    },
    {
      'name'  :  'country',
      'type'  :  'string',
      'facet' :  True
    }
  ],
  'default_sorting_field': 'num_employees'
}

client.collections.create(schema)
```

  </template>
  <template v-slot:Ruby>

```rb
schema = {
  'name'      => 'companies',
  'fields'    => [
    {
      'name'  => 'company_name',
      'type'  => 'string'
    },
    {
      'name'  => 'num_employees',
      'type'  => 'int32'
    },
    {
      'name'  => 'country',
      'type'  => 'string',
      'facet' => true
    }
  ],
  'default_sorting_field' => 'num_employees'
}

client.collections.create(schema)
```

  </template>
  <template v-slot:Dart>

```dart
final schema = Schema(
  'companies',
  {
    Field('company_name', Type.string),
    Field('num_employees', Type.int32),
    Field('country', Type.string, isFacetable: true),
  },
  defaultSortingField: Field('num_employees', Type.int32),
);

await client.collections.create(schema);
```
    
  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections" \
       -X POST \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
       -d '{
         "name": "companies",
         "fields": [
           {"name": "company_name", "type": "string" },
           {"name": "num_employees", "type": "int32" },
           {"name": "country", "type": "string", "facet": true }
         ],
         "default_sorting_field": "num_employees"
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
  "num_documents": 0,
  "fields": [
    {"name": "company_name", "type": "string" },
    {"name": "num_employees", "type": "int32" },
    {"name": "country", "type": "string", "facet": true }
  ],
  "default_sorting_field": "num_employees"
}
```

  </template>
</Tabs>

**Definition**

`POST ${TYPESENSE_HOST}/collections`

#### Field Arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|name	|yes	|Name of the collection you wish to create. <br><br>This can be a simple string like `"name": "score"`. <br><br>Or you can also use a RegEx to specify field names matching a pattern. For eg: if you want to specify that all fields starting with `score_` should be an integer, you can set name as `"name": "score_.*"`. |
|fields	|yes	|A list of fields that you wish to index for querying, filtering and faceting. For each field, you have to specify the `name` and `type`.<br><br>**Declaring a field as optional**<br>A field can be declared as optional by setting `"optional": true`.<br><br>**Declaring a field as a facet**<br>A field can be declared as a facetable field by setting `"facet": true`.<br><br>Faceted fields are indexed verbatim without any tokenization or preprocessing. For example, if you are building a product search, `color` and `brand` could be defined as facet fields.<br><br>**Declaring a field as non-indexable**<br>You can ensure that a field is not indexed by setting `"index": false`. This is useful when used along with [auto schema detection](./collections.md#with-auto-schema-detection).  |
|default_sorting_field	|no	|The name of an `int32 / float` field that determines the order in which the search results are ranked when a `sort_by` clause is not provided during searching. This field must indicate some kind of popularity. For example, in a product search application, you could define `num_reviews` field as the `default_sorting_field`.<br><br>Additionally, when a word in a search query matches multiple possible words (either because of a typo or during a prefix search), this parameter is used to rank such equally matching tokens. For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in a prefix search, both "apple" and "apply" would match the prefix "app".|

#### Field types

Typesense allows you to index the following types of fields:

<table>
  <tr>
    <td>string</td>
  </tr>
  <tr>
    <td>int32</td>
  </tr>
  <tr>
    <td>int64</td>
  </tr>
  <tr>
    <td>float</td>
  </tr>
  <tr>
    <td>bool</td>
  </tr>
  <tr>
    <td><a href="../api/documents.html#geosearch">geopoint</a></td>
  </tr>
</table>

You can define an array or multi-valued field by suffixing a [] at the end:

<table>
  <tr>
    <td>string[]</td>
  </tr>
  <tr>
    <td>int32[]</td>
  </tr>
  <tr>
    <td>int64[]</td>
  </tr>
  <tr>
    <td>float[]</td>
  </tr>
  <tr>
    <td>bool[]</td>
  </tr>
</table>

There are also two special field types that are used for handling data sources with varying schema via 
[automatic schema detection](./collections.md#with-auto-schema-detection).

<table>
  <tr>
    <td>auto</td>
  </tr>
  <tr>
    <td>string*</td>
  </tr>
</table>

### With auto schema detection

While we encourage the use of a schema to ensure that you index only the fields that you need, 
it's not always possible to know upfront what fields your documents might contain.

In such a scenario, you can define a wildcard field with the name `.*` and  type `auto` to let Typesense automatically 
detect the type of the fields automatically. 

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",  
  "fields": [
    {"name": ".*", "type": "auto" }
  ]
}
```

  </template>
</Tabs>

When a `.*` field is defined this way,  all the fields in a document are automatically indexed for **searching and filtering**. 

:::tip
Faceting is not enabled for a wildcard field, i.e., `{"name": ".*" , ...}` since that can consume a lot of memory, 
especially for large text fields. However, you can still explicitly define specific fields to facet by 
setting `facet: true` for them. For e.g. `{"name": ".*_facet", "facet": true" }`.
::: 

You can still define the schema for certain fields explicitly:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",  
  "fields": [
    {"name": ".*", "type": "auto" },
    {"name": ".*_facet", "type": "auto", "facet": true },
    {"name": "country", "type": "string", "facet": true }
  ]
}
```

  </template>
</Tabs>

If an explicit definition is available for a field (`country` in this example), Typesense will give 
preference to that before falling back to the wildcard definition. 

When such an explicit field definition is not available, the first document that contains a field with a given name 
determines the type of that field. For example, if you index a document with a field named `title` and it is a 
string, then the next document that contains the field named `title` will be expected to have a string too.

**NOTE:** A `geopoint` field still requires an explicit field type definition. 

#### Data Coercion

What happens when the next document's `title` field is not a string? _By default,_ Typesense will try to 
coerce the value to the previously inferred type. For example, if you sent a number, Typesense will "stringify" the number 
and store it as a string. However, this may not always work (you can't convert a string to a number). 
When Typesense is unable to coerce the field value to the previously inferred type, the indexing will fail with 
the appropriate error. 

:::tip
You can control this default coercion behavior at write-time with the [`dirty_values`](./documents.md#dealing-with-dirty-data) parameter. 
:::

## Retrieve a collection
Retrieve the details of a collection, given its name.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').retrieve();
```    

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -X GET \
    "http://localhost:8108/collections/companies"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "num_documents": 1250,
  "fields": [
    {"name": "company_name", "type": "string"},
    {"name": "num_employees", "type": "int32"},
    {"name": "country", "type": "string", "facet": true}
  ],
  "default_sorting_field": "num_employees"
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection`


## List all collections
Returns a summary of all your collections. The collections are returned sorted by creation date, with the most recent collections appearing first.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections().retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections.retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections.retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.collections.retrieve();
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    "http://localhost:8108/collections"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
[
  {
    "num_documents": 1250,
    "name": "companies",
    "fields": [
      {"name": "company_name", "type": "string"},
      {"name": "num_employees", "type": "int32"},
      {"name": "country", "type": "string", "facet": true}
    ],
    "default_sorting_field": "num_employees"
  },
  {
    "num_documents": 1250,
    "name": "ceos",
    "fields": [
      {"name": "company_name", "type": "string"},
      {"name": "full_name", "type": "string"},
      {"name": "from_year", "type": "int32"}
    ],
    "default_sorting_field": "from_year"
  }
]
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/collections`


## Drop a collection
Permanently drops a collection. This action cannot be undone. For large collections, this might have an impact on read latencies.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').delete()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->delete();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].delete
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').delete();
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
     -X DELETE \
    "http://localhost:8108/collections/companies"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "num_documents": 1250,
  "fields": [
    {"name": "company_name", "type": "string"},
    {"name": "num_employees", "type": "int32"},
    {"name": "country", "type": "string", "facet": true}
  ],
  "default_sorting_field": "num_employees"
}
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection`
