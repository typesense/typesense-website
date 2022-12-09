---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Documents

Every record you index in Typesense is called a `Document`.

## Index documents

A document to be indexed in a given collection must conform to the [schema of the collection](./collections.md#create-a-collection).

If the document contains an `id` field of type `string`, Typesense will use that field as the identifier for the document. 
Otherwise, Typesense will assign an auto-generated identifier to the document. 

:::warning NOTE
The `id` should not include spaces or any other characters that require [encoding in urls](https://www.w3schools.com/tags/ref_urlencode.asp).
:::

### Index a single document

If you need to index a document in response to some user action in your application, you can use the single document create endpoint.

If you need to index multiple documents at a time, we highly recommend using the [import documents](#index-multiple-documents) endpoint, which is optimized for bulk imports.
For eg: If you have 100 documents, indexing them using the import endpoint at once will be much more performant than indexing documents one a time. 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby', 'Dart', 'Java', 'Swift', 'Shell']">
  <template v-slot:JavaScript>

```js
let document = {
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}

client.collections('companies').documents().create(document)
```

  </template>

  <template v-slot:PHP>

```php
$document = [
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
];

$client->collections['companies']->documents->create($document);
```

  </template>
  <template v-slot:Python>

```py
document = {
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}

client.collections['companies'].documents.create(document)
```

  </template>
  <template v-slot:Ruby>

```rb
document = {
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
}

client.collections['companies'].documents.create(document)
```

  </template>
  <template v-slot:Dart>

```dart
final document = {
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
};

await client.collection('companies').documents.create(document);
```

  </template>
  <template v-slot:Java>

```java
HashMap<String, Object> document = new HashMap<>();
document.put("id","124");
document.put("company_name","Stark Industries");
document.put("num_employees",5215);
document.put("country","USA");

client.collections("companies").documents().create(document);
```

  </template>
  <template v-slot:Swift>

```swift
//Primarily make sure that the document type is defined as a Codable struct/class
struct Company: Codable {
  var id: String?
  var company_name: String?
  var num_employees: Int?
  var country: String?
}

let document = Company(
  id: "124",
  company_name: "Stark Industries",
  num_employees: 5215,
  country: "USA"
)

let documentData = try encoder.encode(document)
let (data, response) = try await client.collection(name: "companies").documents().create(document: documentData)
let documentResponse = try decoder.decode(Company.self, from: data!)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents" -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "id": "124",
          "company_name": "Stark Industries",
          "num_employees": 5215,
          "country": "USA"
        }'
```

  </template>
</Tabs>

#### Upsert a single document

The endpoint will replace a document with the same `id` if it already exists, or create a new document if one doesn't already exist with the same `id`.

If you need to upsert multiple documents at a time, we highly recommend using the [import documents](#index-multiple-documents) endpoint with `action=upsert`, which is optimized for bulk upserts.
For eg: If you have 100 documents, upserting them using the import endpoint at once will be much more performant than upserting documents one a time.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby', 'Dart', 'Java', 'Swift', 'Shell']">
  <template v-slot:JavaScript>

```js
let document = {
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}

client.collections('companies').documents().upsert(document)
```

  </template>

  <template v-slot:PHP>

```php
$document = [
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
];

$client->collections['companies']->documents->upsert($document);
```

  </template>
  <template v-slot:Python>

```py
document = {
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}

client.collections['companies'].documents.upsert(document)
```

  </template>
  <template v-slot:Ruby>

```rb
document = {
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
}

client.collections['companies'].documents.upsert(document)
```

  </template>
  <template v-slot:Dart>

```dart
final document = {
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
};

await client.collection('companies').documents.upsert(document);
```

  </template>
  <template v-slot:Java>

```java
HashMap<String, Object> document = new HashMap<>();

document.put("id","124");
document.put("company_name","Stark Industries");
dpocument.put("num_employees",5215);
document.put("country","USA");

client.collections("companies").documents().upsert(document);
```

  </template>
  <template v-slot:Swift>

```swift
let document = Company(
  id: "124",
  company_name: "Stark Industries",
  num_employees: 5215,
  country: "USA"
)

let documentData = try encoder.encode(document)
let (data, response) = try await client.collection(name: "companies").documents().upsert(document: documentData)
let documentResponse = try decoder.decode(Company.self, from: data!)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents?action=upsert" -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "id": "124",
          "company_name": "Stark Industries",
          "num_employees": 5215,
          "country": "USA"
        }'
```

  </template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "124",
  "company_name": "Stark Industries",
  "num_employees": 5215,
  "country": "USA"
}
```

  </template>
</Tabs>

**Definition**

`POST ${TYPESENSE_HOST}/collections/:collection/documents`

### Index multiple documents

You can index multiple documents in a batch using the import API.

When indexing multiple documents, this endpoint is much more performant, than calling the [single document create endpoint](#index-a-single-document) multiple times in quick succession.

The documents to import need to be formatted as a newline delimited JSON string, aka [JSONLines](https://jsonlines.org/) format.
This is essentially one JSON object per line, without commas between documents. For example, here are a set of 3 documents represented in JSONL format.

```json lines
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215, "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232, "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531, "country": "AU"}
```

If you are using one of our client libraries, you can also pass in an array of documents and the library will take care of converting it into JSONL.

You can also [convert from CSV to JSONL](#import-a-csv-file) and [JSON to JSONL](#import-a-json-file) before importing to Typesense. 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
let documents = [{
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}]

// IMPORTANT: Be sure to increase connectionTimeoutSeconds to at least 5 minutes or more for imports,
//  when instantiating the client

client.collections('companies').documents().import(documents, {action: 'create'})
```

  </template>

  <template v-slot:PHP>

```php
$documents = [[
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
]];

// IMPORTANT: Be sure to increase the connection timeout in your HTTP library to at least 5 minutes or more for imports

$client->collections['companies']->documents->import($documents, ['action' => 'create']);
```

  </template>
  <template v-slot:Python>

```py
documents = [{
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}]

# IMPORTANT: Be sure to increase connection_timeout_seconds to at least 5 minutes or more for imports,
#  when instantiating the client

client.collections['companies'].documents.import_(documents, {'action': 'create'})
```

  </template>
  <template v-slot:Ruby>

```rb
documents = [{
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
}]

# IMPORTANT: Be sure to increase connection_timeout_seconds to at least 5 minutes or more for imports,
#  when instantiating the client

client.collections['companies'].documents.import(documents, action: 'create')
```

  </template>
  <template v-slot:Dart>

```dart
final documents = [
  {
    'id': '124',
    'company_name': 'Stark Industries',
    'num_employees': 5215,
    'country': 'USA'
  }
];

// IMPORTANT: Be sure to increase connectionTimeout to at least 5 minutes or more for imports,
//  when instantiating the client

await client.collection('companies').documents.importDocuments(documents);
```

  </template>
  <template v-slot:Java>

```java
HashMap<String, Object> document1 = new HashMap<>();
HashMap<String, String> queryParameters = new HashMap<>();
ArrayList<HashMap<String, Object>> documentList = new ArrayList<>();

document1.put("id","124");
document1.put("company_name", "Stark Industries");
document1.put("num_employees", 5215);
document1.put("country", "USA");

documentList.add(document1);

ImportDocumentsParameters importDocumentsParameters = new ImportDocumentsParameters();
importDocumentsParameters.action("create");

// IMPORTANT: Be sure to increase connectionTimeout to at least 5 minutes or more for imports,
//  when instantiating the client

client.collections("Countries").documents().import_(documentList, importDocumentsParameters);
```

  </template>
  <template v-slot:Swift>

```swift
let documents = [
  Company(
    id: "124",
    company_name: "Stark Industries",
    num_employees: 5125,
    country: "USA"
  )
]

var jsonLStrings:[String] = []
for doc in documents {
    let data = try encoder.encode(doc)
    let str = String(data: data, encoding: .utf8)!
    jsonLStrings.append(str)
}

let jsonLString = jsonLStrings.joined(separator: "\n")
let jsonL = Data(jsonLString.utf8)

// IMPORTANT: Be sure to increase connectionTimeoutSeconds to at least 5 minutes or more for imports,
//  when instantiating the client

let (data, response) = try await client.collection(name: "companies").documents().importBatch(jsonL)

```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents/import?action=create" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -H "Content-Type: text/plain" \
        -X POST \
        -d '{"id": "124","company_name": "Stark Industries","num_employees": 5215,"country": "USA"}
            {"id": "125","company_name": "Acme Corp","num_employees": 2133,"country": "CA"}'
```

  </template>
</Tabs>

#### Action modes (Batch create, upsert, update & emplace)

Besides batch-creating documents, you can also use the `?action` query parameter to batch-upsert and batch-update documents.

<table>
    <tr>
        <td>create (default)</td>
        <td>Creates a new document. Fails if a document with the same id already exists</td>
    </tr>
    <tr>
        <td>upsert</td>
        <td>Creates a new document or updates an existing document if a document with the same id already exists. 
           Requires the whole document to be sent. For partial updates, use the <code>update</code> action below.</td>
    </tr>
    <tr>
        <td>update	</td>
        <td>Updates an existing document. Fails if a document with the given id does not exist. You can send 
            a partial document containing only the fields that are to be updated.</td>
    </tr>
    <tr>
        <td>emplace	</td>
        <td>Creates a new document or updates an existing document if a document with the same id already exists.
            You can send either the whole document or a partial document for update.</td>
    </tr>
</table>

**Definition**

`POST ${TYPESENSE_HOST}/collections/:collection/documents/import`

**Sample Response**

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json lines
{"success": true}
{"success": true}
```

  </template>
</Tabs>

Each line of the response indicates the result of each document present in the request body (in the same order). If the import of a single document fails, it does not affect the other documents.

If there is a failure, the response line will include a corresponding error message and as well as the actual document content. For example, the second document had an import failure in the following response:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json lines
{"success": true}
{"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
```

  </template>
</Tabs>

:::warning NOTE
The import endpoint will always return a `HTTP 200 OK` code, regardless of the import results of the individual documents.

We do this because there might be some documents which succeeded on import and others that failed, and we don't want to return an HTTP error code in those partial scenarios.
To keep it consistent, we just return HTTP 200 in all cases.

So always be sure to check the API response for any `{success: false, ...}` records to see if there are any documents that failed import.
:::

#### Configure batch size

By default, Typesense ingests 40 documents at a time into Typesense - after every 40 documents are ingested, Typesense will then service the search request queue, before switching back to imports.
To increase this value, use the `batch_size` parameter.

Note that this parameter controls server-side batching of documents sent in a single import API call. 
Increasing this value might affect search performance, so we'd recommend that you not change the default unless you really need to.
You can also do client-side batching, by sending your documents over multiple import API calls (potentially in parallel).

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
const documentsInJsonl = await fs.readFile("documents.jsonl");
client.collections('companies').documents().import(documentsInJsonl, {batch_size: 100});
```

  </template>

  <template v-slot:PHP>

```php
$documentsInJsonl = file_get_contents('documents.jsonl');
client.collections['companies'].documents.import($documentsInJsonl, ['batch_size' => 100]);
```

  </template>
  <template v-slot:Python>

```py
with open('documents.jsonl') as jsonl_file:
  client.collections['companies'].documents.import_(jsonl_file.read().encode('utf-8'), {'batch_size': 100})
```

  </template>
  <template v-slot:Ruby>

```rb
documents_jsonl = File.read('documents.jsonl')
collections['companies'].documents.import(documents_jsonl, batch_size: 100)
```

  </template>
  <template v-slot:Dart>

```dart
final file = File('documents.jsonl');
await client.collection('companies').documents.importJSONL(file.readAsStringSync(), options: {'batch_size': 100});
```

  </template>
  <template v-slot:Java>

```java
File myObj = new File("documents.jsonl");
Scanner myReader = new Scanner(myObj);
String documentsInJsonl;
while (myReader.hasNextLine()) {
    String documentsInJsonl = datdocumentsInJsonl.append(myReader.nextLine());
}

ImportDocumentsParameters queryParameters = new ImportDocumentsParameters();
queryParameters.batchSize(100);

client.collections("companies").documents().import_(documentsInJsonl, queryParameters)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import?batch_size=100"
```

  </template>
</Tabs>

**NOTE**: Larger batch sizes will consume larger transient memory during import.

### Dealing with Dirty Data

The `dirty_values` parameter determines what Typesense should do when the type of a particular field being
indexed does not match the previously [inferred](./collections.md#with-auto-schema-detection) type for that field, or the one [defined](./collections.md#with-pre-defined-schema) in the collection's schema.

This parameter can be sent with any of the document write API endpoints, for both single documents and multiple documents.

| Value              | Behavior                                                                                                                                            |
|:-------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| `coerce_or_reject` | Attempt coercion of the field's value to previously inferred type. If coercion fails, reject the write outright with an error message.              |
| `coerce_or_drop`   | Attempt coercion of the field's value to previously inferred type. If coercion fails, drop the particular field and index the rest of the document. |
| `drop`             | Drop the particular field and index the rest of the document.                                                                                       |
| `reject`           | Reject the document outright.                                                                                                                       |

**Default behaviour**

If a wildcard (`.*`) field is defined in the schema _or_ if the schema contains any field
name with a regular expression (e.g a field named `.*_name`), the default behavior is `coerce_or_reject`. Otherwise,
the default behavior is `reject` (this ensures backward compatibility with older Typesense versions).

#### Indexing a document with dirty data

Let's now attempt to index a document with a `title` field that contains an integer. We will assume that this
field was previously inferred to be of type `string`. Let's use the `coerce_or_reject` behavior here:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Shell']">
  <template v-slot:JavaScript>

```js
let document = {
    'title': 1984,
    'points': 100
}

client.collections('titles').documents().create(document, {
    "dirty_values": "coerce_or_reject"
})
```

</template>

<template v-slot:PHP>

```php
$document = ['title'  => 1984, 'points' => 100];
$client->collections['titles']->documents->create($document, [
    'dirty_values' => 'coerce_or_reject',
]);
```

</template>
<template v-slot:Python>

```py
document = {'title': 1984, 'points': 100}
client.collections['titles'].documents.create(document, {
    'dirty_values': 'coerce_or_reject'
})
```

</template>
<template v-slot:Ruby>

```rb
document = {'title'  => 1984, 'points' => 100}
client.collections['titles'].documents.create(document, 
    dirty_values: 'coerce_or_reject'
)
```

</template>
<template v-slot:Dart>

```dart
final document = {'title': 1984, 'points': 100};

await client.collection('companies').documents.create(document, options: {'dirty_values': 'coerce_or_reject'};

```

</template>
  <template v-slot:Java>

```java
ImportDocumentsParameters queryParameters = new ImportDocumentsParameters();
queryParameters.dirtyValues(ImportDocumentsParameters.DirtyValuesEnum.COERCE_OR_REJECT);
queryParameters.action("upsert");
String[] authors = {"shakspeare","william"};
HashMap<String, Object> hmap = new HashMap<>();
hmap.put("title", 111);
hmap.put("authors",authors);
hmap.put("publication_year",1666);
hmap.put("ratings_count",124);
hmap.put("average_rating",3.2);
hmap.put("id","2");
client.collections("books").documents().create(hmap,queryParameters);
```

  </template>
<template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/titles/documents?dirty_values=coerce_or_reject" -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "title": 1984,
          "points": 100
        }'
```

  </template>
</Tabs>

Similarly, we can use the `dirty_values` parameter for the [update](#update-a-document), [upsert](#upsert-a-single-document) and [import](#index-multiple-documents) operations as well.

### Indexing all values as string

Typesense provides a convenient way to store all fields as strings through the use of the `string*` field type.

Defining a type as `string*` allows Typesense to accept both singular and multi-value/array values.

Let's say we want to ingest data from multiple devices but want to store them as strings since each device could
be using a different data type for the same field name (e.g. one device could send an `record_id` as an integer,
while another device could send an `record_id` as a string).

To do that, we can define a schema as follows:

```json
{
  "name": "device_data",
  "fields": [
    {"name": ".*", "type": "string*" }
  ]
}
``` 

Now, Typesense will automatically convert any single/multi-valued data into their corresponding string
representations automatically when data is indexed with the `dirty_values: "coerce_or_reject"` mode.

You can see how they will be transformed below:

<Tabs :tabs="['Input','Output']">
  <template v-slot:Input>

```json
{
  "record_id": 141414,
  "values": [76.24, 88, 100.67]
}
```

</template>

<template v-slot:Output>

```json
{
  "record_id": "141414",
  "values": ["76.24", "88", "100.67"]
}
```

</template>
</Tabs>


### Import a JSONL file

You can import a JSONL file or you can import the output of a Typesense [export operation](#export-documents) directly as import to the [import end-point](#index-multiple-documents) since both use JSONL.

Here's an example file:

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json lines
{"id": "1", "company_name": "Stark Industries", "num_employees": 5215, "country": "USA"}
{"id": "2", "company_name": "Orbit Inc.", "num_employees": 256, "country": "UK"}
```

  </template>
</Tabs>

You can import the above `documents.jsonl` file like this.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
const documentsInJsonl = await fs.readFile("documents.jsonl");
client.collections('companies').documents().import(documentsInJsonl, {action: 'create'});
```

  </template>

  <template v-slot:PHP>

```php
$documentsInJsonl = file_get_contents('documents.jsonl');
client.collections['companies'].documents.import($documentsInJsonl, ['action' => 'create']);
```

  </template>
  <template v-slot:Python>

```py
with open('documents.jsonl') as jsonl_file:
  client.collections['companies'].documents.import_(jsonl_file.read().encode('utf-8'), {'action': 'create'})
```

  </template>
  <template v-slot:Ruby>

```rb
documents_jsonl = File.read('documents.jsonl')
collections['companies'].documents.import(documents_jsonl, action: 'create')

```

  </template>
  <template v-slot:Dart>

```dart
final file = File('documents.jsonl');
await client.collection('companies').documents.importJSONL(file.readAsStringSync());

```

  </template>
  <template v-slot:Java>

```java
File myObj = new File("/books.jsonl");
ImportDocumentsParameters queryParameters = new ImportDocumentsParameters();
Scanner myReader = new Scanner(myObj);
StringBuilder data = new StringBuilder();
while (myReader.hasNextLine()) {
    data.append(myReader.nextLine()).append("\n");
}
client.collections("books").documents().import_(data.toString(), queryParameters);
```

  </template>
  <template v-slot:Swift>

```swift
let urlPath = URL(fileURLWithPath: "<PATH_TO>/documents.jsonl")
let jsonL = try Data(contentsOf: urlPath)

let (data, response) = try await client.collection(name: "companies").documents().importBatch(jsonL)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -X POST \
      -T documents.jsonl \
      "http://localhost:8108/collections/companies/documents/import?action=create"

```

  </template>
</Tabs>

<br/>

### Import a JSON file

If you have a file in JSON format, you can convert it into JSONL format using [`jq`](https://github.com/stedolan/jq):

```shell
jq -c '.[]' documents.json > documents.jsonl
```

Once you have the JSONL file, you can then import it following the [instructions above](#import-a-jsonl-file) to import a JSONL file.

### Import a CSV file

If you have a CSV file with column headers, you can convert it into JSONL format using [`mlr`](https://github.com/johnkerl/miller):

```shell
mlr --icsv --ojsonl cat documents.csv > documents.jsonl
```

Once you have the JSONL file, you can then import it following the [instructions above](#import-a-jsonl-file) to import a JSONL file.

### Import other file types

Typesense is primarily a JSON store, optimized for fast search. 
So if you can extract data from other file types and convert it into structured JSON, you can import it into Typesense and search through it.

For eg, here's one library you can use to [convert DOCX files to JSON](https://github.com/microsoft/Simplify-Docx). 
Once you've extracted the JSON, you can then [index](#index-documents) them in Typesense just like any other JSON file.

In general, you want to find libraries to convert your file type to JSON, and index that JSON into Typesense to search through it.


## Retrieve a document

Fetch an individual document from a collection by using its `id`.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents('124').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents['124']->retrieve();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].documents['124'].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].documents['124'].retrieve
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').document('124').retrieve();
```

  </template>
  <template v-slot:Java>

```java
Hashmap<String, Object> document = client.collections("companies").documents("124").retrieve();
```

  </template>
  <template v-slot:Swift>

```swift
let (data, response) = try await client.collection(name: "companies").document(id: "124").retrieve()
let document = try decoder.decode(Company.self, from: data!)
```

  </template>
  <template v-slot:Shell>

```bash
$ curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET \
      "http://localhost:8108/collections/companies/documents/124"
```

  </template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "124",
  "company_name": "Stark Industries",
  "num_employees": 5215,
  "country": "USA"
}
```

  </template>
</Tabs>

**Definition**

`GET ${TYPESENSE_HOST}/collections/:collection/documents/:id`


## Update a document

Update an individual document from a collection by using its id. The update can be partial, as shown below:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
let document = {
  'company_name': 'Stark Industries',
  'num_employees': 5500
}

client.collections('companies').documents('124').update(document)
```

  </template>

  <template v-slot:PHP>

```php
$document = [
  'company_name'  => 'Stark Industries',
  'num_employees' => 5500
];

$client->collections['companies']->documents['124']->update($document);
```

  </template>
  <template v-slot:Python>

```py
document = {
  'company_name': 'Stark Industries',
  'num_employees': 5500
}

client.collections['companies'].documents['124'].update(document)
```

  </template>
  <template v-slot:Ruby>

```rb
document = {
  'company_name'  => 'Stark Industries',
  'num_employees' => 5500
}

client.collections['companies'].documents['124'].update(document)
```

  </template>
  <template v-slot:Dart>

```dart
final document = {
  'company_name': 'Stark Industries',
  'num_employees': 5500
};

await client.collection('companies').document('124').update(document);
```

  </template>
  <template v-slot:Java>

```java
HashMap<String, Object> document = new HashMap<>();
document.put("company_name","Stark Industries"); 
document.put("num_employees",5500);

HashMap<String, Object> updatedDocument = client.collections("companies").documents("124").update(document) 
```

  </template>
  <template v-slot:Swift>

```swift
let document = Company(
  company_name: "Stark Industries",
  num_employees: 5500,
)

let documentData = try encoder.encode(document)
let (data, response) = try await client.collection(name: "companies").document(id: "124").update(newDocument: documentData)
let documentResponse = try decoder.decode(Company.self, from: data!)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents/124" -X PATCH \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "company_name": "Stark Industries",
          "num_employees": 5500
        }'
```

  </template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "company_name": "Stark Industries",
  "num_employees": 5500
}
```

  </template>
</Tabs>

**Definition**

`PATCH ${TYPESENSE_HOST}/collections/:collection/documents/:id`

:::tip
To update multiple documents, use the import endpoint with [`action=update`](#action-modes-batch-create-upsert-update-emplace) or [`action=upsert`](#action-modes-batch-create-upsert-update-emplace). 
:::

## Delete documents

### Delete a single document

Delete an individual document from a collection by using its `id`.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents('124').delete()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents['124']->delete();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].documents['124'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].documents['124'].delete
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').document('124').delete();
```

  </template>
  <template v-slot:Java>

```java
HashMap<String, Object> deletedDocument = client.collections("companies").documents("124").delete();
```

  </template>
  <template v-slot:Swift>

```swift
let (data, response) = try await client.collection(name: "companies").document(id: "124").delete()
let document = try decoder.decode(Company.self, from: data!)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
    "http://localhost:8108/collections/companies/documents/124"
```

  </template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "124",
  "company_name": "Stark Industries",
  "num_employees": 5215,
  "country": "USA"
}
```

  </template>
</Tabs>

**Definition**

`DELETE ${TYPESENSE_HOST}/collections/:collection/documents/:id`

### Delete by query

You can also delete a bunch of documents that match a specific [`filter_by`](search.md#filter-results) condition:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents().delete({'filter_by': 'num_employees:>100'})
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents->delete(['filter_by' => 'num_employees:>100']));
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].documents.delete({'filter_by': 'num_employees:>100'})
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].documents.delete(filter_by: 'num_employees:>100')
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').documents.delete({'filter_by': 'num_employees:>100'});
```

  </template>
  <template v-slot:Java>

```java
DeleteDocumentsParameters deleteDocumentsParameters = new DeleteDocumentsParameters();
deleteDocumentsParameters.filterBy("num_employees:>100");

client.collections("companies").documents().delete(deleteDocumentsParameters);
```

  </template>
  <template v-slot:Swift>

```swift
let (data, response) = try await client.collection(name: "companies").documents().delete(filter: "num_employees:>100")
let document = try decoder.decode(Company.self, from: data!)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
"http://localhost:8108/collections/companies/documents?filter_by=num_employees:>=100&batch_size=100"

```

  </template>
</Tabs>

Use the `batch_size` parameter to control the number of documents that should deleted at a time. A larger value will speed up deletions, but will impact performance of other operations running on the server.

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "num_deleted": 24
}
```

  </template>
</Tabs>


**Definition**

`DELETE ${TYPESENSE_HOST}/collections/:collection/documents?filter_by=X&batch_size=N`

:::tip
To delete multiple documents by ID, you can use `filter_by=id: [id1, id2, id3]`.

To delete all documents in a collection, you can use a filter that matches all documents in your collection.
For eg, if you have an `int32` field called `popularity` in your documents, you can use `filter_by=popularity:>0` to delete all documents.
Or if you have a `bool` field called `in_stock` in your documents, you can use `filter_by=in_stock:[true,false]` to delete all documents.  

:::

## Export documents

Export documents in a collection in JSONL format.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents().export()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents->export();
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].documents.export()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].documents.export
```

  </template>
  <template v-slot:Dart>

```dart
await client.collection('companies').documents.exportJSONL();
```

  </template>
  <template v-slot:Java>

```java
ExportDocumentsParameters exportDocumentsParameters = new ExportDocumentsParameters();
exportDocumentsParameters.setIncludeFields("id,publication_year,authors");
client.collections("companies").documents().export(exportDocumentsParameters);
```

  </template>
  <template v-slot:Swift>

```swift
let (data, response) = try await client.collection(name: "companies").documents().export()
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET \
    "http://localhost:8108/collections/companies/documents/export"
```

  </template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json lines
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215, "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232, "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531, "country": "AU"}
```

  </template>
</Tabs>

While exporting, you can use the following parameters to control the result of the export:

| Parameter      | Description                                                                                         |
|:---------------|:----------------------------------------------------------------------------------------------------|
| filter_by      | Restrict the exports to documents that satisfies the [`filter by` query](search.md#filter-results). |
| include_fields | List of fields that should be present in the exported documents.                                    |
| exclude_fields | List of fields that should not be present in the exported documents.                                |

**Definition**

`GET ${TYPESENSE_HOST}/collections/:collection/documents/export`

<RedirectOldSearchLinksForV023AndAbove />