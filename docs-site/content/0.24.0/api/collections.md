---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Collections

In Typesense, every record you index is called a `Document` and a group of documents with similar fields is called a `Collection`. 
A Collection is roughly equivalent to a table in a relational database.

## Create a collection

Before we can [add documents](./documents.md#index-a-single-document) to Typesense, we need to first create a `Collection` - we give it a name and describe the fields that will be indexed from our `Documents`.
We call this definition the collection's `schema`, which is just a fancy term to describe the fields (and their [data types](#field-types)) in your documents.

:::tip
It might help to think of defining a collection "schema" as being similar to defining "types" in a strongly-typed programming language like Typescript, C, Java, Dart, Rust, etc.
This ensures that the documents you add to your collection have consistent data types and are validated, and this helps prevent a whole class of errors you might typically see with mis-matched or inconsistent data types across documents.
:::

:::tip Organizing Collections

Read more on how to organize data into collections in this dedicated guide article: [Organizing Collections](/guide/organizing-collections.md).

:::

There are two ways to specify a schema:

1. [Pre-define all the fields to be indexed](#with-pre-defined-schema) from your documents OR
2. [Have Typesense automatically detect your fields and data types](#with-auto-schema-detection) based on the documents you index.

The simplest option is [#2](#with-auto-schema-detection) where you don't have to worry about defining an explicit schema.
But if you need more fine-grained control and/or validation, you want to use [#1](#with-pre-defined-schema) or even mix both together. 

### With pre-defined schema

Let's first create a collection with an explicit, pre-defined schema.

This option gives you fine-grained control over your document fields' [data types](#field-types) and configures your collection to reject documents that don't match the data types defined in your schema ([by default](./documents.md#dealing-with-dirty-data)).

If you want Typesense to automatically detect your schema for you, skip over to [auto-schema detection](#with-auto-schema-detection). 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
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
    Field('company_name', type: Type.string),
    Field('num_employees',type: Type.int32),
    Field('country', type: Type.string, isFacetable: true),
  },
  defaultSortingField: Field('num_employees',type: Type.int32),
);

await client.collections.create(schema);
```
    
  </template>
  <template v-slot:Java>

```java
CollectionSchema collectionSchema = new CollectionSchema();

collectionschema.name("companies")
                .addFieldsItem(new Field().name("company_name").type(FieldTypes.STRING))
                .addFieldsItem(new Field().name("num_employees").type(FieldTypes.INT32))
                .addFieldsItem(new Field().name("country").type(FieldTypes.STRING).facet(true));

CollectionResponse collectionResponse = client.collections().create(collectionSchema);
```

  </template>
  <template v-slot:Swift>

```swift
let schema = CollectionSchema(
  name: "companies",
  fields: [
    Field(name: "company_name", type: "string"),
    Field(name: "num_employees", type: "int32"),
    Field(name: "country", type: "string", facet: true)
  ],
  defaultSortingField: "num_employees"
)
let (collectionResponse, response) = try await client.collections.create(schema: schema)
// collectionResponse is a CollectionResponse object and response refers to
// the HTTP response (URLResponse?) and can be used for debugging
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

See [Schema Parameters](#schema-parameters) for all available options, and [Field Types](#field-types) for all available data types.

**Sample Response**

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

:::warning IMPORTANT NOTE & TIP
All fields you mention in a collection's schema will be indexed _in memory_. 

There might be cases where you don't intend to search / filter / facet / group by a particular field and just want it to be stored (on disk) and returned as is when a document is a search hit.
For eg: you can store image URLs in every document that you might use when displaying search results, but you might not want to text-search the actual URLs. 

You want to NOT mention these fields in the collection's schema or mark these fields as `index: false` (see `fields` [schema parameter](#schema-parameters) below) to mark it as an unindexed field. 
You can have any number of these additional unindexed fields in the documents when adding them to a collection - they will just be stored on disk, and will not take up any memory.
:::

### With auto schema detection
 
If your field names are dynamic and not known upfront, or if you just want to keep things simple and index all fields you send in your documents by default,
auto-schema detection should help you. 

You can define a wildcard field with the name `.*` and  type `auto` to let Typesense automatically 
detect the type of the fields when you [add documents](./documents.md#index-a-single-document) to the collection. 
In fact, you can use **any RegEx expression to define a field name**.

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

#### Faceting fields with auto-schema detection

[Faceting](./search.md#facet-results) is not enabled for a wildcard field `{"name": ".*" , ...}`, since that can consume a lot of memory, 
especially for large text fields. However, you can still explicitly define specific fields (with or without RegEx names) to facet by 
setting `facet: true` for them. 

For e.g, when you define a schema like this:

```json
{
  "name": "companies",
  "fields": [
    {
      "name": ".*_facet",
      "type": "auto",
      "facet": true
    }
  ]
}
```

This will only set field names that end with `_facet` in the document, as a facet.

#### `Geopoint` and auto-schema detection

A [`geopoint` field](#field-types) requires an explicit type definition, as the geo field value is represented as a 2-element 
float field and we cannot differentiate between a lat/long definition and an actual float array.

#### Indexing all but some fields

If you have a case where you do want to index all fields in the document, except for a few fields, you can use the `{"index": false, "optional": true}` settings to exclude fields.

Note: it is not currently possible to have a mandatory field excluded from the indexing, hence the setting to optional.

For eg, if you want to index all fields, except for fields that start with `description_`, you can use a schema like this:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",  
  "fields": [
    {"name": ".*", "type": "auto" },
    {"name": ".*_facet", "type": "auto", "facet": true },
    {"name": "description_.*", "type": "auto", "index": false, "optional": true },
    {"name": "country", "type": "string", "facet": true }
  ]
}
```

  </template>
</Tabs>

:::tip
You can mix auto-schema detection with explicit field definitions.

If an explicit definition is available for a field (`country` in the example above), Typesense will give
preference to that before falling back to the wildcard definition.

When such an explicit field definition is not available, the first document that contains a field with a given name
determines the type of that field. 

For example, if you index a document with a field named `title` and it is a
string, then the next document that contains the field named `title` will be expected to have a string too.
:::

### Schema parameters

| Parameter             | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|:----------------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                  | yes      | Name of the collection you wish to create.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| fields                | yes      | A list of fields that you wish to index for [querying](./search.md#query-parameters), [filtering](./search.md#filter-results) and [faceting](./search.md#facet-results). For each field, you have to specify at least it's `name` and [`type`](#field-types).<br><br> Eg: ```{"name": "title", "type": "string", "facet": false, "index": true}``` <br><br>`name` can be a simple string like `"name": "score"`. Or you can also use a RegEx to specify field names matching a pattern. For eg: if you want to specify that all fields starting with `score_` should be an integer, you can set name as `"name": "score_.*"`.<br><br>**Declaring a field as optional**<br>A field can be declared as optional by setting `"optional": true`.<br><br>**Declaring a field as a facet**<br>A field can be declared as a facetable field by setting `"facet": true`. Faceted fields are indexed verbatim without any tokenization or preprocessing. For example, if you are building a product search, `color` and `brand` could be defined as facet fields. Once a field is enabled for faceting in the schema, it can be used in the [`facet_by` search parameter](./search.md#facet-results).<br><br>**Declaring a field as un-indexed**<br>You can set a field as un-indexed by setting `"index": false`. This is useful when used along with [auto schema detection](#with-auto-schema-detection) and you need to [exclude certain fields from indexing](#indexing-all-but-some-fields). |
| token_separators      | no       | List of symbols or special characters to be used for splitting the text into individual words _**in addition**_ to space and new-line characters.<br><br> For e.g. you can add `-` (hyphen) to this list to make a word like `non-stick` to be split on hyphen and indexed as two separate words.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| symbols_to_index      | no       | List of symbols or special characters to be indexed. <br><br>For e.g. you can add `+` to this list to make the word `c++` indexable verbatim.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 
| default_sorting_field | no       | The name of an `int32 / float` field that determines the order in which the search results are ranked when a `sort_by` clause is not provided during searching. This field must indicate some kind of popularity. For example, in a product search application, you could define `num_reviews` field as the `default_sorting_field`.<br><br>Additionally, when a word in a search query matches multiple possible words (either because of a typo or during a prefix search), this parameter is used to rank such equally matching tokens. For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in a prefix search, both "apple" and "apply" would match the prefix "app". In these cases, the `default_sorting_field` is used as the tie-breaker to rank.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Field types

Typesense allows you to index the following types of fields:

| `type`                       | Description                                                                                                                                                                    |
|:-----------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `string`                     | String values                                                                                                                                                                  |
| `string[]`                   | Array of strings                                                                                                                                                               |
| `int32`                      | Integer values up to 2,147,483,647                                                                                                                                             |
| `int32[]`                    | Array of `int32`                                                                                                                                                               |
| `int64`                      | Integer values larger than 2,147,483,647                                                                                                                                       |
| `int64[]`                    | Array of `int64`                                                                                                                                                               |
| `float`                      | Floating point / decimal numbers                                                                                                                                               |
| `float[]`                    | Array of floating point / decimal numbers                                                                                                                                      |
| `bool`                       | `true` or `false`                                                                                                                                                              |
| `bool[]`                     | Array of booleans                                                                                                                                                              |
| [`geopoint`](geosearch.md)   | Latitude and longitude specified as `[lat, lng]`                                                                                                                               |
| [`geopoint[]`](geosearch.md) | Arrays of Latitude and longitude specified as `[[lat1, lng1], [lat2, lng2]]`                                                                                                   |
| `string*`                    | Special type that automatically converts values to a `string` or `string[]`.                                                                                                   |
| `auto`                       | Special type that automatically attempts to infer the data type based on the documents added to the collection. See [automatic schema detection](#with-auto-schema-detection). |

Here's how to index other common types of data, using the basic primitives in the table above:

- [Nested fields / objects](#indexing-nested-fields)
- [Dates](#indexing-dates)

#### Indexing nested fields

Typesense supports indexing nested objects (and array of objects) from `v0.24`.

You must first enable nested fields at a collection level via the `enable_nested_fields` schema property:

```shell
curl -k "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "docs", 
        "enable_nested_fields": true,
        "fields": [
          {"name": ".*", "type": "auto"}
        ]
      }'
```

The schema can also explicitly index specific object fields or object arrays, e.g.:

```shell
curl -k "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "docs", 
        "enable_nested_fields": true,
        "fields": [
          {"name": "person", "type": "object"},
          {"name": "details", "type": "object[]"},
        ]
      }'
```

When you now search on an object field name, all sub-fields will be automatically searched. Use a dot notation to 
refer to specific sub-fields, e.g. `person.last_name` or `person.school.name`.

**Indexing nested objects via flattening**

You can also flatten objects and arrays of objects into top-level keys before sending the data into Typesense.

For example, a document like this containing nested objects:

```json
{
  "nested_field": {
    "field1": "value1",
    "field2": ["value2", "value3", "value4"],
    "field3": {
      "fieldA": "valueA",
      "fieldB": ["valueB", "valueC", "valueD"]
    }
  }
}  
```

would need to be flattened as:

```json
{
  "nested_field.field1": "value1",
  "nested_field.field2":  ["value2", "value3", "value4"],
  "nested_field.field3.fieldA": "valueA",
  "nested_field.field3.fieldB": ["valueB", "valueC", "valueD"]
}
```

before indexing it into Typesense.

To simplify traversing the data in the results, you might want to send both the flattened and unflattened version of the nested fields into Typesense,
and only set the flattened keys as indexed in the collection's schema and use them for search/filtering/faceting.
At display time when parsing the results, you can then use the nested version.

#### Indexing Dates

Dates need to be converted into [Unix timestamps](https://en.wikipedia.org/wiki/Unix_time) and stored as `int64` fields in Typesense.
Most languages have libraries that help do this conversion for you. 

You'll then be able to use numerical operators like `<`, `>`, etc to filter records that are before or after or between dates. 

## Retrieve a collection
Retrieve the details of a collection, given its name.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
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
  <template v-slot:Swift>

```swift
let (collectionResponse, response) = try await client.collection(name: "companies").retrieve()
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

**Sample Response**

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

**Definition**
`GET ${TYPESENSE_HOST}/collections/:collection`

## List all collections
Returns a summary of all your collections. The collections are returned sorted by creation date, with the most recent collections appearing first.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
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
  <template v-slot:Swift>

```swift
let (collections, response) = try await client.collections().retrieveAll()
// collections is of type [CollectionResponse]
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    "http://localhost:8108/collections"
```

  </template>
</Tabs>

**Sample Response**

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

**Definition**
`GET ${TYPESENSE_HOST}/collections`

## Drop a collection
Permanently drops a collection. This action cannot be undone. For large collections, this might have an impact on read latencies.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
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
  <template v-slot:Swift>

```swift
let (collectionResponse, response) = try await client.collection(name: "companies").delete()
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

**Sample Response**

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

**Definition**
`DELETE ${TYPESENSE_HOST}/collections/:collection`

## Update or alter a collection

Typesense supports adding or removing fields to a collection's schema in-place.

:::tip
Typesense supports updating all fields **except** the `id` field (since it's a special field within Typesense).
:::

Let's see how we can add a new `company_category` field to the `companies` collection and also drop the existing
`num_employees` field.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
update_schema = {
  "fields":[
    {"name":"num_employees", "drop": true},
    {"name":"company_category", "type":"string"}
  ]
}
client.collections('companies').update(update_schema)
```

  </template>

  <template v-slot:PHP>

```php
$update_schema = [
  'fields'    => [
    [
      'name'  => 'num_employees',
      'drop'  => true
    ],
    [
      'name'  => 'company_category',
      'type'  => 'string'
    ]    
  ]
];
$client->collections['companies']->update($update_schema);
```

</template>
<template v-slot:Python>

```py
update_schema = {
  'fields': [    
    {
      'name'  :  'num_employees',
      'drop'  :  True
    },
    {
      'name'  :  'company_category',
      'type'  :  'string'
    }
  ]
}
client.collections['companies'].update(update_schema)
```

</template>
<template v-slot:Ruby>

```rb
update_schema = {
  'fields'    => [
    {
      'name'  => 'num_employees',
      'drop'  => true
    },
    {
      'name'  => 'company_category',
      'type'  => 'string'
    }    
  ]  
}
client.collections['companies'].update(update_schema)
```

</template>
<template v-slot:Dart>

```dart
final updateSchema = UpdateSchema(
  {
    Field('num_employees', drop: true),
    Field('company_category', Type.string)    
  }
);
await client.collection('companies').update(updateSchema);
```

</template>
<template v-slot:Java>

```java
CollectionUpdateSchema updateSchema = new CollectionUpdateSchema();
updateSchema.addFieldsItem(new Field().name("num_employees").drop(true))
            .addFieldsItem(new Field().name("company_category").type(FieldTypes.STRING));
client.collections("companies").update(updateSchema);
```

</template>
<template v-slot:Swift>

```swift
let updateSchema = CollectionUpdateSchema(
  fields: [
    Field(name: "num_employees", drop: true),
    Field(name: "company_category", type: "string")    
  ]
)
try await client.collections.update(updateSchema: updateSchema)
```

</template>

<template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies" \
       -X PATCH \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
       -d '{
         "fields": [
           {"name": "num_employees", "drop": true },
           {"name": "company_category", "type": "string" }           
         ]
       }'
```

</template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
   "fields": [
      {
         "drop": true,
         "name": "num_employees"
      },
      {
         "name": "company_category",
         "facet": false,
         "index": true,
         "infix": false,
         "locale": "",
         "optional": false,
         "sort": false,
         "type": "string"
      }
   ]
}
```

  </template>
</Tabs>

**Definition**
`PATCH ${TYPESENSE_HOST}/collections/:collection`

:::tip
The schema update is a synchronous blocking operation. When the update is in progress, all incoming writes and reads to
_that particular collection_ will wait for the schema update to finish. So, we recommend updating fields one at a time, 
especially for large collections and during off-peak hours.

Alternatively, you can also use the [alias feature](#using-an-alias) to do zero downtime schema changes.
:::

The update operation consists of an initial validation step where the records on-disk are assessed to ensure 
that they are compatible with the proposed schema change. For example, let's say there is a `string` field `A` which 
is already present in the documents on-disk but is not part of the schema. If you try to update the collection 
schema by adding a field `A` with type `integer`, the validation step will reject this change as it's incompatible 
with the type of data already present.

If the validation is successful, the actual schema change is done and the records are 
indexed / re-indexed / dropped as per the requested change. The process is complete as soon as the API call 
returns (make sure you use a large client timeout value). Because of the blocking nature of the update, we 
recommend doing the change during off-peak hours. 
Alternatively, you can also use the [alias feature](#using-an-alias) to do zero downtime schema changes.

### Modifying an existing field

Since Typesense currently only supports adding/deleting a field, any modifications to an existing field should be 
expressed as a drop + add operation. All fields **except** the `id` field can be modified.

For example, to add a `facet` property to the `company_category` field, we will drop + add it in the same change set:

```bash
curl "http://localhost:8108/collections/companies" \
       -X PATCH \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
       -d '{
         "fields": [
           {"name": "company_category", "drop": true }
           {"name": "company_category", "type": "string", "facet": true }   
         ]
       }'
```

### Using an alias

If you need to do zero-downtime schema changes, you could also re-create the collection fully and use 
the [Collection Alias](./collection-alias.md) feature to do a zero-downtime switch over to the new collection:

1. [Create your collection](#create-a-collection) as usual with a timestamped name. For eg: `movies_jan_1`
2. [Create an alias](./collection-alias.md#create-or-update-an-alias) pointing to your collection. For eg: create an alias called `movies` pointing to `movies_jan_1`
3. Use the collection alias in your application to search / index documents in your collection.
4. When you need to make schema changes, create a new timestamped collection with the updated collection schema, for eg: `movies_feb_1` and reindex your data in it.
5. [Update the collection alias](./collection-alias.md#create-or-update-an-alias) to now point to the new collection. Eg: Update `movies` to now point to `movies_feb_1`.
6. [Drop the old collection](#drop-a-collection), `movies_jan_1` in our example.

Once you update the alias, any search / indexing operations will go to the new collection (eg: `movies_feb_1`) 
without you having to do any application-side changes.

### Dynamic field additions

If you only need to _add_ new fields to the schema on the fly, we recommend using [auto-schema detection](#with-auto-schema-detection) 
when creating the collection. You can essentially define RegEx field names and when documents containing 
new field names that match the RegEx come in, the new fields will automatically be added to the schema.
