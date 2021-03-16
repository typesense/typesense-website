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

## Search
In Typesense, a search consists of a query against one or more text fields and a list of filters against numerical or facet fields. You can also sort and facet your results.

Due to performance reasons, Typesense limits searches to a maximum of 500 results.

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchParameters = {
  'q'         : 'stark',
  'query_by'  : 'company_name',
  'filter_by' : 'num_employees:>100',
  'sort_by'   : 'num_employees:desc'
}

client.collections('companies').documents().search(searchParameters)
```

  </template>

  <template v-slot:Python>

```py
search_parameters = {
  'q'         : 'stark',
  'query_by'  : 'company_name',
  'filter_by' : 'num_employees:>100',
  'sort_by'   : 'num_employees:desc'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Ruby>

```rb
search_parameters = {
  'q'         => 'stark',
  'query_by'  => 'company_name',
  'filter_by' => 'num_employees:>100',
  'sort_by'   => 'num_employees:desc'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/collections/companies/documents/search\
?q=stark&query_by=company_name&filter_by=num_employees:>100\
&sort_by=num_employees:desc"
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "facet_counts": [],
  "found": 1,
  "took_ms":1,
  "hits": [
    {
      "highlights": [
        {
          "field": "company_name",
          "snippet": "<mark>Stark</mark> Industries"
        }
      ],
      "document": {
        "id": "124",
        "company_name": "Stark Industries",
        "num_employees": 5215,
        "country": "USA"
      }
    }
  ]
}
```

  </template>
</Tabs>

When a `string[]` field is queried, the `highlights` structure would include the corresponding matching array indices of the snippets. For e.g:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
      ...
      "highlights": [
        {
          "field": "addresses",
          "indices": [0,2],
          "snippets": [
            "10880 <mark>Malibu</mark> Point, <mark>Malibu,</mark> CA 90265",
            "10000 <mark>Malibu</mark> Point, <mark>Malibu,</mark> CA 90265"
          ]
        }
      ],
      ...
}
```

  </template>
</Tabs>

### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/search`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|q	|yes	|The query text to search for in the collection.<br><br>Use * as the search string to return all documents. This is typically useful when used in conjunction with `filter_by`.<br><br>For example, to return all documents that match a filter, use:`q=*&filter_by=num_employees:10`|
|query_by	|yes	|One or more `string / string[]` fields that should be queried against. Separate multiple fields with a comma: `company_name, country`<br><br>The order of the fields is important: a record that matches on a field earlier in the list is considered more relevant than a record matched on a field later in the list. So, in the example above, documents that match on the `company_name` field are ranked above documents matched on the `country` field.|
|prefix	|no	|Boolean field to indicate that the last word in the query should be treated as a prefix, and not as a whole word. This is necessary for building autocomplete and instant search interfaces.<br><br>Default: `true`|
|filter_by	|no	|Filter conditions for refining your search results.<br><br>A field can be matched against one or more values.<br><br>`country: USA`<br>`country: [USA, UK]`<br><br>Separate multiple conditions with the `&&` operator.<br><br>For eg: `num_employees:>100 && country: [USA, UK]`<br><br>More examples:<br><br>`num_employees:10`<br>`num_employees:<=10`|
|sort_by	|no	|A list of numerical fields and their corresponding sort orders that will be used for ordering your results. Separate multiple fields with a comma. Up to 2 sort fields can be specified.<br><br>E.g. `num_employees:desc,year_started:asc`<br><br>The text similarity score is exposed as a special `_text_match` field that you can use in the list of sorting fields.<br><br>If one or two sorting fields are specified, `_text_match` is used for tie breaking, as the last sorting field.<br><br>Default:<br><br>If no `sort_by` parameter is specified, results are sorted by:` _text_match:desc,``default_sorting_field:desc`.|
|facet_by	|no	|A list of fields that will be used for faceting your results on. Separate multiple fields with a comma.|
|max_facet_values	|no	|Maximum number of facet values to be returned.|
|num_typos	|no	|Number of typographical errors (1 or 2) that would be tolerated.<br><br>[Damerau–Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) is used to calculate the number of errors.<br><br>Default: `2`|
|page	|no	|Results from this specific page number would be fetched.|
|per_page	|no	|Number of results to fetch per page.<br><br>Default: `10`|
|include_fields	|no	|Comma-separated list of fields from the document to include in the search result.|
|exclude_fields	|no	|Comma-separated list of fields from the document to exclude in the search result.|
|drop_tokens_threshold	|no	|If the number of results found for a specific query is less than this number, Typesense will attempt to drop the tokens in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set drop_tokens_threshold to 0 to disable dropping of tokens.<br><br>Default: `10`|

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

## Export documents

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


## Import documents
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

