# Documents

## Index a document

A document to be indexed in a given collection must conform to the schema of the collection.

If the document contains an `id` field of type `string`, Typesense would use that field as the identifier for the document. Otherwise, Typesense would assign an identifier of its choice to the document.

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
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


### Sample Response

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

### Definition
`POST ${TYPESENSE_HOST}/collections/:collection/documents`


## Retrieve a document
Fetch an individual document from a collection by using its id.

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents('124').retrieve()
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
  <template v-slot:Shell>

```bash
$ curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET \
      "http://localhost:8108/collections/companies/documents/124"
```

  </template>
</Tabs>

### Sample Response

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

### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/:id`


## Delete a document
Delete an individual document from a collection by using its id.

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents('124').delete()
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
    "http://localhost:8108/collections/companies/documents/124"
```

  </template>
</Tabs>

### Sample Response

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

### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection/documents/:id`

## Export documents from a collection

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents().export()
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET
    "http://localhost:8108/collections/companies/documents/export"
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js

['{"company_name":"Stark Industries","country":"USA","id":"124","num_employees":5215}',\
'{"company_name":"Future Technology","country":"UK","id":"125","num_employees":1232}',\
'{"company_name":"Random Corp.","country":"AU","id":"126","num_employees":531}']
```

  </template>

  <template v-slot:Python>

```py
[u'{"company_name":"Stark Industries","country":"USA","id":"124","num_employees":5215}',\
u'{"company_name":"Future Technology","country":"UK","id":"125","num_employees":1232}',\
u'{"company_name":"Random Corp.","country":"AU","id":"126","num_employees":531}']
```

  </template>
  <template v-slot:Ruby>

```rb
[
"{\"id\": \"124\", \"company_name\": \"Stark Industries\", \"num_employees\": 5215, \
\"country\": \"US\"}",
"{\"id\": \"125\", \"company_name\": \"Future Technology\", \"num_employees\": 1232, \
\"country\": \"UK\"}",
"{\"id\": \"126\", \"company_name\": \"Random Corp.\", \"num_employees\": 531, \
\"country\": \"AU\"}"
]
```

  </template>
  <template v-slot:Shell>

```bash
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215,\
"country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232,\
"country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531,\
"country": "AU"}
```

  </template>
</Tabs>


### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/export`


## Import documents into a collection
The documents to be imported must be formatted in a newline delimited JSON stucture.
You can feed the output file from a Typesense export operation directly as import.

Here's an example file:

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json
{"name": "Stark Industries", "num_employees": 5215, "country": "USA"}
{"name": "Orbit Inc.", "num_employees": 256, "country": "UK"}
```

  </template>
</Tabs>

You can import the above `documents.jsonl` file like this.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import"

```

  </template>
</Tabs>

### Sample response

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json
{
  "items":[
    { "success":true },
    { "success":true },
    { "success":true }
  ],
  "num_imported":3,
  "success":true
}
```

  </template>
</Tabs>

The response will consist of an items array that indicates the result of each document present in the request to be imported (in the same order). If the import of a single document fails, it does not affect the remaining documents

If there is a failure, the response item will include a corresponding error message. For example, the second document had an import failure in the following response:


<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "items":[
    { "success":true },
    { "success":false, "error": "Bad JSON." },
    { "success":true }
  ],
  "num_imported":2,
  "success":false
}
```

  </template>
</Tabs>

### Definition
`POST ${TYPESENSE_HOST}/collections/:collection/documents/import`

