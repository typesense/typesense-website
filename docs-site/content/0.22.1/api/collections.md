---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Collections

In Typesense, a group of related documents is called a collection. A collection is roughly equivalent to a table in a relational database.

## Create a collection

When a `collection` is created, we give it a name and describe the fields that will be indexed from the documents that are added to the `collection`.
We call this the collection's `schema`, which is just a fancy term to describe your documents' structure.

It might help to think of a collection "schema" as being similar to defining "types" in a strongly-typed programming language like Typescript, C, Java, Dart, Rust, etc.
This ensures that the documents you add to your collection have consistent data types and are validated, and this helps prevent a whole class of errors you might typically see with mis-matched or inconsistent data types across documents.

:::tip
From Typesense `v0.20`, we can also create a collection that [automatically detects](#with-auto-schema-detection) the types of the various fields in the document. 
:::

### With pre-defined schema

Let's first create a collection with an explicit, pre-defined schema.


:::tip
Your documents can contain other fields not mentioned in the collection's schema - they will be stored 
on _disk_ but not indexed in _memory_. So, while they will be part of the document in the search response, 
you can't query on them.
:::

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
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
  <template v-slot:Java>

```java
CollectionSchema collectionSchema = new CollectionSchema();

collectionschema.name("companies")
                .addFieldsItem(new Field().name("company_name").type(Field.TypeEnum.STRING))
                .addFieldsItem(new Field().name("num_employees").type(Field.TypeEnum.INT32))
                .addFieldsItem(new Field().name("country").type(Field.TypeEnum.STRING).facet(true));

CollectionResponse collectionResponse = client.collections().create(collectionSchema);
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

:::warning
All fields you mention in a collection's schema will be indexed _in memory_. 

There might be cases where you don't intend to search / filter / facet / group by a particular field and just want it to be stored (on disk) and returned as is when a document is a search hit.

You can just have these additional fields in the documents when adding them to a collection, and need not mention them in your collection schema.
They will be stored on disk, and will not take up any memory.
:::


#### Schema Arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|name	|yes	|Name of the collection you wish to create. <br><br>This can be a simple string like `"name": "score"`. <br><br>Or you can also use a RegEx to specify field names matching a pattern. For eg: if you want to specify that all fields starting with `score_` should be an integer, you can set name as `"name": "score_.*"`. |
|fields	|yes	|A list of fields that you wish to index for querying, filtering and faceting. For each field, you have to specify the `name` and `type`.<br><br>**Declaring a field as optional**<br>A field can be declared as optional by setting `"optional": true`.<br><br>**Declaring a field as a facet**<br>A field can be declared as a facetable field by setting `"facet": true`.<br><br>Faceted fields are indexed verbatim without any tokenization or preprocessing. For example, if you are building a product search, `color` and `brand` could be defined as facet fields.<br><br>**Declaring a field as non-indexable**<br>You can ensure that a field is not indexed by setting `"index": false`. This is useful when used along with [auto schema detection](#with-auto-schema-detection) and you need to [exclude certain fields from indexing](#indexing-all-but-some-fields).  |
|token_separators	|no	| List of symbols or special characters to be used for splitting the text into individual words _**in addition**_ to space and new-line characters.<br><br> For e.g. you can add `-` (hyphen) to this list to make a word like `non-stick` to be split on hyphen and indexed as two separate words. |
|symbols_to_index	|no	| List of symbols or special characters to be indexed. <br><br>For e.g. you can add `+` to this list to make the word `c++` indexable verbatim. |
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
[automatic schema detection](#with-auto-schema-detection).

| Special Type |Description |
|:---|:---|
| auto | Automatically attempts to infer the data type based on the documents added to the collection. See [automatic schema detection](#with-auto-schema-detection). |
| string* | Automatically converts values to a string. |

### With auto schema detection

While we encourage the use of a schema to ensure that you index only the fields that you need to search / filter / facet in memory, 
it's not always possible to know upfront what fields your documents might contain.

In such a scenario, you can define a wildcard field with the name `.*` and  type `auto` to let Typesense automatically 
detect the type of the fields automatically. In fact, you can use **any RegEx expression to define a field name**.

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

:::warning
Faceting is not enabled for a wildcard field `{"name": ".*" , ...}`, since that can consume a lot of memory, 
especially for large text fields. However, you can still explicitly define specific fields (with or without RegEx names) to facet by 
setting `facet: true` for them. 

For e.g. `{"name": ".*_facet", "facet": true" }`. This will only set field names that end with `_facet` in the document, as a facet.
::: 

:::warning
A `geopoint` field requires an explicit type definition, as the geo field value is represented as a 2-element 
float field and we cannot differentiate between a lat/long definition and an actual float array.
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

#### Indexing all but some fields

If you have a case where you do want to index all fields in the document, except for a few fields, you can use the `index: false` setting to exclude fields.

For eg, if you want to index all fields, except for fields that start with `description_`, you can use a schema like this:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",  
  "fields": [
    {"name": ".*", "type": "auto" },
    {"name": ".*_facet", "type": "auto", "facet": true },
    {"name": "description_.*", "type": "auto", "index": false },
    {"name": "country", "type": "string", "facet": true }
  ]
}
```

  </template>
</Tabs>


#### Data Coercion

Say you've set `type: auto` for a particular field (or fields) (eg: `popularity_score`) in a collection and send the first document as:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "title": "A Brief History of Time",
  "author": "Stephen Hawking",
  "popularity_score": 4200
}
```

  </template>
</Tabs>

Since `popularity_score` has `type: auto`, the data-type will automatically be set to `int64` internally. 

What happens when the next document's `popularity_score` field is not an integer field, but a string? For eg:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "title": "The Hunger Games",
  "author": "Suzanne Collins",
  "popularity_score": "4230"
}
```

  </template>
</Tabs>

_By default,_ Typesense will try to coerce (convert) the value to the previously inferred type. 
So in this example, since the first document had a numeric data-type for `popularity_score`, the second document's `popularity_score` field will be coerced to an integer from string.

However, this may not always work - (for eg: say the value has alphabets, it can't be coerced to an integer). 
In such cases, when Typesense is unable to coerce the field value to the previously inferred type, the indexing will fail with the appropriate error.

:::tip
You can control this default coercion behavior at write-time with the [`dirty_values`](./documents.md#dealing-with-dirty-data) parameter. 
:::

## Retrieve a collection
Retrieve the details of a collection, given its name.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
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
  <template v-slot:Java>

```java
CollectionResponse collection = client.collections("companies").retrieve();
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
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
  <template v-slot:Java>

```java
CollectionResponse[] collectionResponses = client.collections().retrieve();
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
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
 <template v-slot:Java>

```java
CollectionResponse collectionResponse = client.collections("companies").delete();
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
