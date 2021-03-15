# Collections

In Typesense, a group of related documents is called a collection. A collection is roughly equivalent to a table in a relational database.

## Create a collection
When a `collection` is created, we give it a name and describe the fields that will be indexed from the documents that are added to the `collection`.

Your documents can contain other fields not mentioned in the collection's schema - they will be stored but not indexed.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  'name': 'companies',
  'num_documents': 0,
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
]

$client->collections->create($schema)
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
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
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

### Sample Response

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

### Definition
`POST ${TYPESENSE_HOST}/collections`

### Arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|name	|yes	|Name of the collection you wish to create. |
|fields	|yes	|A list of fields that you wish to index for querying, filtering and faceting. For each field, you have to specify the `name` and `type`.<br><br>**Declaring a field as optional**<br>A field can be declared as optional by setting `"optional": true`.<br><br>**Declaring a field as a facet**<br>A field can be declared as a facetable field by setting `"facet": true`.<br><br>Faceted fields are indexed verbatim without any tokenization or preprocessing. For example, if you are building a product search, `color` and `brand` could be defined as facet fields.|
|default_sorting_field	|yes	|The name of an `int32 / float` field that determines the order in which the search results are ranked when a `sort_by` clause is not provided during searching. This field must indicate some kind of popularity. For example, in a product search application, you could define `num_reviews` field as the `default_sorting_field`.<br><br>Additionally, when a word in a search query matches multiple possible words (either because of a typo or during a prefix search), this parameter is used to rank such equally matching tokens. For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in a prefix search, both "apple" and "apply" would match the prefix "app".|

### Supported search field types
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


## Search a collection
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
|snippet_threshold	|no	|Field values under this length will be fully highlighted, instead of showing a snippet of relevant portion.<br><br>Default: `30`|
|drop_tokens_threshold	|no	|If the number of results found for a specific query is less than this number, Typesense will attempt to drop the tokens in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set drop_tokens_threshold to 0 to disable dropping of tokens.<br><br>Default: `10`
|typo_tokens_threshold	|no	|If the number of results found for a specific query is less than this number, Typesense will attempt to look for tokens with more typos until enough results are found.<br><br>Default: `100`|
|pinned_hits	|no	|A list of records to unconditionally include in the search results at specific positions.<br><br>An example use case would be to feature or promote certain items on the top of search results.<br><br>A comma separated list of `record_id:hit_position`. Eg: to include a record with ID 123 at Position 1 and another record with ID 456 at Position 5, you'd specify `123:1,456:5`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.|
|hidden_hits	|no	|A list of records to unconditionally hide from search results.<br><br>A comma separated list of `record_ids` to hide. Eg: to hide records with IDs 123 and 456, you'd specify `123,456`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.|


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
$client->collections['companies']->retrieve()
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET
    "http://localhost:8108/collections/companies"
```

  </template>
</Tabs>

### Sample Response

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

### Definition
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
$client->collections->retrieve()
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" "http://localhost:8108/collections"
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "collections": [
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
      "default_sorting_field": "num_employees"
    }
  ]
}
```

  </template>
</Tabs>

### Definition
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
$client->collections['companies']->delete()
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE
    "http://localhost:8108/collections/companies"
```

  </template>
</Tabs>

### Sample Response

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

### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection`
