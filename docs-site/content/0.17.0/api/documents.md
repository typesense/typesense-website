# Documents

## Index a document

A document to be indexed in a given collection must conform to the schema of the collection.

If the document contains an `id` field of type `string`, Typesense would use that field as the identifier for the document. Otherwise, Typesense would assign an identifier of its choice to the document.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
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
]

$client->collections['companies']->documents->create($document)
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

### Upserting a document
You can also upsert a document.


<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
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
]

$client->collections['companies']->documents->upsert($document)
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

To index multiple documents at the same time, in a batch/bulk operation, see [importing documents]().

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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
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

  <template v-slot:PHP>

```php
$searchParameters = [
  'q'         => 'stark',
  'query_by'  => 'company_name',
  'filter_by' => 'num_employees:>100',
  'sort_by'   => 'num_employees:desc'
]

$client->collections['companies']->documents->search($searchParameters)
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
          "snippet": "<mark>Stark</mark> Industries",
          "matched_tokens": ["Stark"]
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
          ],
          "matched_tokens": [
            ["Malibu", "Malibu"],
            ["Malibu", "Malibu"]
          ]
        }
      ],
      ...
}
```

  </template>
</Tabs>

### Group by
You can aggregate search results into groups or buckets by specify one or more `group_by` fields.

Grouping hits this way is useful in:

* **Deduplication**: By using one or more `group_by` fields, you can consolidate items and remove duplicates in the search results. For example, if there are multiple shoes of the same size, by doing a `group_by=size&group_limit=1`, you ensure that only a single shoe of each size is returned in the search results.
* **Correcting skew**: When your results are dominated by documents of a particular type, you can use `group_by` and `group_limit` to correct that skew. For example, if your search results for a query contains way too many documents of the same brand, you can do a `group_by=brand&group_limit=3` to ensure that only the top 3 results of each brand is returned in the search results.
>NOTE: To group on a particular field, it must be a faceted field.

Grouping returns the hits in a nested structure, that's different from the plain JSON response format we saw earlier. Let's repeat the query we made earlier with a `group_by` parameter:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchParameters = {
  'q'            : 'stark',
  'query_by'     : 'company_name',
  'filter_by'    : 'num_employees:>100',
  'sort_by'      : 'num_employees:desc',
  'group_by'     : 'country',
  'group_limit'  : '1'
}

client.collections('companies').documents().search(searchParameters)
```

  </template>

  <template v-slot:PHP>

```php
$searchParameters = [
  'q'           => 'stark',
  'query_by'    => 'company_name',
  'filter_by'   => 'num_employees:>100',
  'sort_by'     => 'num_employees:desc',
  'group_by'    => 'country',
  'group_limit' => '1'
]

$client->collections['companies']->documents->search($searchParameters)
```

  </template>
  <template v-slot:Python>

```py
search_parameters = {
  'q'           : 'stark',
  'query_by'    : 'company_name',
  'filter_by'   : 'num_employees:>100',
  'sort_by'     : 'num_employees:desc',
  'group_by'    : 'country',
  'group_limit' : '1'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Ruby>

```rb
search_parameters = {
  'q'           => 'stark',
  'query_by'    => 'company_name',
  'filter_by'   => 'num_employees:>100',
  'sort_by'     => 'num_employees:desc',
  'group_by'    => 'country',
  'group_limit' => '1'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Shell>

```bash
search_parameters = {
  'q'           => 'stark',
  'query_by'    => 'company_name',
  'filter_by'   => 'num_employees:>100',
  'sort_by'     => 'num_employees:desc',
  'group_by'    => 'country',
  'group_limit' => '1'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>
</Tabs>

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "facet_counts": [],
  "found": 1,
  "took_ms":1,
  "grouped_hits": [
    {
      "group_key": ["USA"],
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
  ]
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
|filter_by	|no	|Filter conditions for refining your search results.<br><br>A field can be matched against one or more values.<br><br>`country: USA`<br>`country: [USA, UK]`<br><br>To match a string field exactly, you have to mark the field as a facet and use the `:=` operator.<br><br>For eg: `category:=Shoe` will match documents from the category shoes and not from a category like `shoe rack`. You can also filter using multiple values: `category:= [Shoe, Sneaker]`.<br><br>Separate multiple conditions with the `&&` operator.<br><br>For eg: `num_employees:>100 && country: [USA, UK]`<br><br>More examples:<br><br>`num_employees:10`<br>`num_employees:<=10`|
|sort_by	|no	|A list of numerical fields and their corresponding sort orders that will be used for ordering your results. Separate multiple fields with a comma. Up to 3 sort fields can be specified.<br><br>E.g. `num_employees:desc,year_started:asc`<br><br>The text similarity score is exposed as a special `_text_match` field that you can use in the list of sorting fields.<br><br>If one or two sorting fields are specified, `_text_match` is used for tie breaking, as the last sorting field.<br><br>Default:<br><br>If no `sort_by` parameter is specified, results are sorted by:` _text_match:desc,``default_sorting_field:desc`.|
|facet_by	|no	|A list of fields that will be used for faceting your results on. Separate multiple fields with a comma.|
|max_facet_values	|no	|Maximum number of facet values to be returned.|
|facet_query	|no	|Facet values that are returned can now be filtered via this parameter. The matching facet text is also highlighted. For example, when faceting by `category`, you can set `facet_query=category:shoe` to return only facet values that contain the prefix "shoe".|
|num_typos	|no	|Number of typographical errors (1 or 2) that would be tolerated.<br><br>[Damerau–Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) is used to calculate the number of errors.<br><br>Default: `2`|
|page	|no	|Results from this specific page number would be fetched.|
|per_page	|no	|Number of results to fetch per page.<br><br>Default: `10`|
|group_by	|no	|You can aggregate search results into groups or buckets by specify one or more `group_by` fields. Separate multiple fields with a comma.<br><br>NOTE: To group on a particular field, it must be a faceted field.<br><br>E.g. `group_by=country,company_name`
|group_limit	|no	|Maximum number of hits to be returned for every group. If the `group_limit` is set as `K` then only the top K hits in each group are returned in the response.<br><br>Default: `3`|
|include_fields	|no	|Comma-separated list of fields from the document to include in the search result.|
|exclude_fields	|no	|Comma-separated list of fields from the document to exclude in the search result.|
|highlight_full_fields	|no	|Comma separated list of fields which should be highlighted fully without snippeting.<br><br>Default: all fields will be snippeted.|
|highlight_affix_num_tokens	|no	|The number of tokens that should surround the highlighted text on each side.<br><br>Default: `4`|
|highlight_start_tag	|no	|The start tag used for the highlighted snippets.<br><br>Default: `<mark>`|
|highlight_end_tag	|no	|The end tag used for the highlighted snippets.<br><br>Default: `</mark>`|
|snippet_threshold	|no	|Field values under this length will be fully highlighted, instead of showing a snippet of relevant portion.<br><br>Default: `30`|
|drop_tokens_threshold	|no	|If the number of results found for a specific query is less than this number, Typesense will attempt to drop the tokens in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set drop_tokens_threshold to 0 to disable dropping of tokens.<br><br>Default: `10`
|typo_tokens_threshold	|no	|If the number of results found for a specific query is less than this number, Typesense will attempt to look for tokens with more typos until enough results are found.<br><br>Default: `100`|
|pinned_hits	|no	|A list of records to unconditionally include in the search results at specific positions.<br><br>An example use case would be to feature or promote certain items on the top of search results.<br><br>A comma separated list of `record_id:hit_position`. Eg: to include a record with ID 123 at Position 1 and another record with ID 456 at Position 5, you'd specify `123:1,456:5`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.|
|hidden_hits	|no	|A list of records to unconditionally hide from search results.<br><br>A comma separated list of `record_ids` to hide. Eg: to hide records with IDs 123 and 456, you'd specify `123,456`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.|

## Retrieve a document
Fetch an individual document from a collection by using its id.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents('124').retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents['124']->retrieve()
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


## Update a document
Update an individual document from a collection by using its id. The update can be partial, as shown below:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
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
]

$client->collections['companies']->documents['124']->update($document)
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

### Sample Response

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

### Definition
`PATCH ${TYPESENSE_HOST}/collections/:collection/documents/:id`


## Delete documents
Delete an individual document from a collection by using its id.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents('124').delete()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents['124']->delete()
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


You can also delete a bunch of documents that match a specific filter condition:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
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
client.collections['companies'].documents.delete_({'filter_by': 'num_employees:>100'})
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].documents.delete(filter_by: 'num_employees:>100')
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

### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "num_deleted": 24
}
```

  </template>
</Tabs>


### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection/documents?filter_by=X&batch_size=N`


## Export documents

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents().export()
```

  </template>

  <template v-slot:PHP>

```php
$client->collections['companies']->documents->export()
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

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215, "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232, "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531, "country": "AU"}
```

  </template>
</Tabs>

### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/export`


## Import documents
The documents to be imported can be either an array of document objects or be formatted as a newline delimited JSON string (see [JSONL](https://jsonlines.org/)).

**Indexing multiple documents at the same time**
You can index multiple documents via the import API.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```js
let documents = [{
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}]

client.collections('companies').documents().import(documents, {action: 'upsert'})
```

  </template>

  <template v-slot:PHP>

```php
$documents = [[
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
]]

$client->collections['companies']->documents->import($documents, ['action' => 'upsert'])
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

client.collections['companies'].documents.import_(documents, {'action': 'upsert'})
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

client.collections['companies'].documents.import(documents, action: 'upsert')
```

  </template>

</Tabs>

The other allowed `action` modes are `create` and `update`.

**Action modes**

<table>
    <tr>
        <td>create (default)</td>
        <td>Creates a new document. Fails if a document with the same id already exists</td>
    </tr>
    <tr>
        <td>upsert</td>
        <td>	Creates a new document or updates an existing document if a document with the same id already exists.</td>
    </tr>
    <tr>
        <td>update	</td>
        <td>Updates an existing document. Fails if a document with the given id does not exist.</td>
    </tr>
</table>

**Importing a JSONL file**

You can feed the output of a Typesense export operation directly as import to the import end-point since both use JSONL.

Here's an example file:

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json
{"id": "1", "company_name": "Stark Industries", "num_employees": 5215, "country": "USA"}
{"id": "2", "company_name": "Orbit Inc.", "num_employees": 256, "country": "UK"}
```

  </template>
</Tabs>

You can import the above `documents.jsonl` file like this.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
const documentsInJsonl = await fs.readFile("documents.jsonl");
client.collections('companies').documents().import(documentsInJsonl, {action: 'create'});
```

  </template>

  <template v-slot:PHP>

```php
$documentsInJsonl = file_get_contents('documents.jsonl');
client.collections['companies'].documents.import($documentsInJsonl, ['action' => 'create'])
```

  </template>
  <template v-slot:Python>

```py
with open('documents.jsonl') as jsonl_file:
  client.collections['companies'].documents.import_jsonl(jsonl_file.read(), {'action': 'create'})
```

  </template>
  <template v-slot:Ruby>

```rb
documents_jsonl = File.read('documents.jsonl')
collections['companies'].documents.import(documents_jsonl, action: 'create')

```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import?action=create"

```

  </template>
</Tabs>

In the example above, we're importing the documents with the `action` flag set to `create`. This means that the documents will be inserted only if a document with the same `id` is not already found.

As we have seen earlier, you can also use the `upsert` and `update` actions. If you don't provide an `action`, the default mode is `create`.

### Configuring the batch size used for import
By default, Typesense ingests 40 documents at a time into Typesense. To increase this value, use the `batch_size` parameter.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
const documentsInJsonl = await fs.readFile("documents.jsonl");
client.collections('companies').documents().import(documentsInJsonl, {batch_size: 100});
```

  </template>

  <template v-slot:PHP>

```php
$documentsInJsonl = file_get_contents('documents.jsonl');
client.collections['companies'].documents.import($documentsInJsonl, ['batch_size' => 100])
```

  </template>
  <template v-slot:Python>

```py
with open('documents.jsonl') as jsonl_file:
  client.collections['companies'].documents.import_jsonl(jsonl_file.read(), {'batch_size': 100})
```

  </template>
  <template v-slot:Ruby>

```rb
ddocuments_jsonl = File.read('documents.jsonl')
collections['companies'].documents.import(documents_jsonl, batch_size: 100)
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

### Sample response

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json
{"success": true}
{"success": true}
```

  </template>
</Tabs>

Each line of the response indicates the result of each document present in the request body (in the same order). If the import of a single document fails, it does not affect the other documents.

If there is a failure, the response line will include a corresponding error message and as well as the actual document content. For example, the second document had an import failure in the following response:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{"success": true}
{"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
```

  </template>
</Tabs>

### Definition
`POST ${TYPESENSE_HOST}/collections/:collection/documents/import`

