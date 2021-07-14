---
sitemap:
  priority: 0.7
---

# Documents

## Index a document

A document to be indexed in a given collection must conform to the schema of the collection.

If the document contains an `id` field of type `string`, Typesense would use that field as the identifier for the document. Otherwise, Typesense would assign an identifier of its choice to the document. Note that the id should not include spaces or any other characters that require [encoding in urls](https://www.w3schools.com/tags/ref_urlencode.asp).

<Tabs :tabs="['JavaScript','PHP','Python','Ruby',  'Shell']">
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

### Upsert
You can also upsert a document.


<Tabs :tabs="['JavaScript','PHP','Python','Ruby',  'Shell']">
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

To index multiple documents at the same time, in a batch/bulk operation, see [importing documents](#import-documents).

#### Sample Response

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

#### Definition
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
];

$client->collections['companies']->documents->search($searchParameters);
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
  <template v-slot:Dart>

```dart
final searchParameters = {
  'q': 'stark',
  'query_by': 'company_name',
  'filter_by': 'num_employees:>100',
  'sort_by': 'num_employees:desc'
};

await client.collection('companies').documents.search(searchParameters);
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

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "facet_counts": [],
  "found": 1,
  "out_of": 1,
  "page": 1,
  "request_params": {
    "collection_name": "companies",
    "per_page": 10,
    "q": "stark"
  },
  "search_time_ms": 1,
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
      "text_match": 130916
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

:::tip
To group on a particular field, it must be a faceted field.
:::

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
];

$client->collections['companies']->documents->search($searchParameters);
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
  <template v-slot:Dart>

```dart
final searchParameters = {
  'q': 'stark',
  'query_by': 'company_name',
  'filter_by': 'num_employees:>100',
  'sort_by': 'num_employees:desc',
  'group_by': 'country',
  'group_limit': '1'
};

await client.collection('companies').documents.search(searchParameters);
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
  "out_of": 1,
  "page": 1,
  "request_params": {
    "collection_name": "companies",
    "per_page": 10,
    "q": "stark"
  },
  "search_time_ms": 1,
  "grouped_hits": [
    {
      "group_key": ["USA"],
      "hits": [
        {
          "highlights": [
            {
              "field": "company_name",
              "matched_tokens": ["Stark"],
              "snippet": "<mark>Stark</mark> Industries"
            }
          ],
          "document": {
            "id": "124",
            "company_name": "Stark Industries",
            "num_employees": 5215,
            "country": "USA"
          },
          "text_match": 130916
        }
      ]
    }
  ]
}
```

  </template>
</Tabs>


### Geosearch

Typesense supports geo search on fields containing the `geopoint` type. 

Let's create a collection called `places` with a field called `location` of type `geopoint`.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  'name': 'places',
  'fields': [
    {
      'name': 'title',
      'type': 'string'
    },
    {
      'name': 'points',
      'type': 'int32'
    },
    {
      'name': 'location',
      'type': 'geopoint'
    }
  ],
  'default_sorting_field': 'points'
}

client.collections().create(schema)
```

  </template>

<template v-slot:PHP>

```php
$schema = [
  'name'      => 'places',
  'fields'    => [
    [
      'name'  => 'title',
      'type'  => 'string'
    ],
    [
      'name'  => 'points',
      'type'  => 'int32'
    ],
    [
      'name'  => 'location',
      'type'  => 'geopoint'
    ]
  ],
  'default_sorting_field' => 'points'
];

$client->collections->create($schema);
```

  </template>

<template v-slot:Python>

```py
schema = {
  'name': 'places',
  'fields': [
    {
      'name'  :  'title',
      'type'  :  'string'
    },
    {
      'name'  :  'points',
      'type'  :  'int32'
    },
    {
      'name'  :  'location',
      'type'  :  'geopoint'
    }
  ],
  'default_sorting_field': 'points'
}

client.collections.create(schema)
```

  </template>

<template v-slot:Ruby>

```rb
schema = {
  'name'      => 'places',
  'fields'    => [
    {
      'name'  => 'title',
      'type'  => 'string'
    },
    {
      'name'  => 'points',
      'type'  => 'int32'
    },
    {
      'name'  => 'location',
      'type'  => 'geopoint'
    }
  ],
  'default_sorting_field' => 'points'
}

client.collections.create(schema)
```

  </template>

  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/collections" -X POST 
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "places",
        "fields": [
          {"name": "title", "type": "string" },
          {"name": "points", "type": "int32" }, 
          {"name": "location", "type": "geopoint"}
        ],
        "default_sorting_field": "points"
      }'
```

  </template>
</Tabs>

Let's now index a document.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let document = {
  'title': 'Louvre Museuem',
  'points': 1,
  'location': [48.86093481609114, 2.33698396872901]
}

client.collections('places').documents().create(document)
```

  </template>

<template v-slot:PHP>

```php
$document = [
  'title'   => 'Louvre Museuem',
  'points'  => 1,
  'location' => array(48.86093481609114, 2.33698396872901)
];

$client->collections['places']->documents->create($document);
```

  </template>

<template v-slot:Python>

```py
document = {
  'title': 'Louvre Museuem',
  'points': 1,
  'location': [48.86093481609114, 2.33698396872901]
}

client.collections['places'].documents.create(document)
```

  </template>

<template v-slot:Ruby>

```rb
document = {
  'title'    =>   'Louvre Museuem',
  'points'   =>   1,
  'location' =>  [48.86093481609114, 2.33698396872901]
}

client.collections['places'].documents.create(document)
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/places/documents" -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{"points":1,"title":"Louvre Museuem", "location": [48.86093481609114, 2.33698396872901]}'
```

  </template>
</Tabs>

We can now search for places within a given radius of a given latlong 
(use `mi` for miles and `km` for kilometers). In addition, let's also sort the records that are closest to a given 
location (this location can be the same or different from the latlong used for filtering).

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchParameters = {
  'q'         : '*',
  'query_by'  : 'title',
  'filter_by' : 'location:(48.90615915923891, 2.3435897727061175, 5 km)',
  'sort_by'   : 'location(48.853, 2.344):asc'
}

client.collections('companies').documents().search(searchParameters)
```

  </template>

<template v-slot:PHP>

```php
$searchParameters = [
  'q'         => '*',
  'query_by'  => 'title',
  'filter_by' => 'location:(48.90615915923891, 2.3435897727061175, 5 km)',
  'sort_by'   => 'location(48.853, 2.344):asc'
];

$client->collections['companies']->documents->search($searchParameters);
```

  </template>

<template v-slot:Python>

```py
search_parameters = {
  'q'         : '*',
  'query_by'  : 'title',
  'filter_by' : 'location:(48.90615915923891, 2.3435897727061175, 5 km)',
  'sort_by'   : 'location(48.853, 2.344):asc'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>

<template v-slot:Ruby>

```rb
search_parameters = {
  'q'         => '*',
  'query_by'  => 'title',
  'filter_by' => 'location:(48.90615915923891, 2.3435897727061175, 5 km)',
  'sort_by'   => 'location(48.853, 2.344):asc'
}

client.collections['companies'].documents.search(search_parameters)
```

  </template>

  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/collections/places/documents/search?q=*&query_by=title&\
filter_by=location:(48.853,2.344,5 km)&sort_by=sort_by=location(48.853, 2.344):asc"
```

  </template>
</Tabs>

The above example uses "5 km" as the radius, but you can also use miles, e.g. 
`location:(48.90615915923891, 2.3435897727061175, 2 mi)`.

You can also filter for documents within any arbitrary shaped polygon! The polygon's points must be defined in a 
**counter-clockwise (i.e. anti-clockwise) direction**.

```shell
location:(48.8662, 2.3255, 48.8581, 2.3209, 48.8561, 2.3448, 48.8641, 2.3469)
```



#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/search`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|q	|yes	|The query text to search for in the collection.<br><br>Use * as the search string to return all documents. This is typically useful when used in conjunction with `filter_by`.<br><br>For example, to return all documents that match a filter, use:`q=*&filter_by=num_employees:10`.<br><br>To exclude words in your query explicitly, prefix the word with the `-` operator, e.g. `q: 'electric car -tesla'`.|
|query_by	|yes	|One or more `string / string[]` fields that should be queried against. Separate multiple fields with a comma: `company_name, country`<br><br>The order of the fields is important: a record that matches on a field earlier in the list is considered more relevant than a record matched on a field later in the list. So, in the example above, documents that match on the `company_name` field are ranked above documents matched on the `country` field.|
|query_by_weights	|no	|The relative weight to give each `query_by` field when ranking results. This can be used to boost fields in priority, when looking for matches.<br><br>Separate each weight with a comma, in the same order as the `query_by` fields. For eg: `query_by_weights: 1,1,2` with `query_by: field_a,field_b,field_c` will give equal weightage to `field_a` and `field_b`, and will give twice the weightage to `field_c` comparatively.|
|prefix	|no	|Indicates that the last word in the query should be treated as a prefix, and not as a whole word. This is necessary for building autocomplete and instant search interfaces. Set this to `false` to disable prefix searching for all queried fields. <br><br>You can control the behavior of prefix search on a per field basis. For example, if you are querying 3 fields and want to enable prefix searching only on the first field, use `?prefix=true,false,false`. The order should match the order of fields in `query_by`.<br><br>Default: `true` (prefix searching is enabled for all fields).|
|filter_by	|no	|Filter conditions for refining your search results.<br><br>A field can be matched against one or more values.<br><br>`country: USA`<br><br>`country: [USA, UK]` returns documents that have `country` of `USA` OR `UK`.<br><br>To match a string field exactly, you have to mark the field as a facet and use the `:=` operator. For eg: `category:= Shoe` will match documents from the category shoes and not from a category like `shoe rack`.<br><br>You can also filter using multiple values and use the backtick character to denote a string literal: <code>category:= [\`Running Shoes, Men\`, Sneaker]</code>.<br><br>Not equals / negation is supported for string and boolean facet fields, e.g. `filter_by=author:!= JK Rowling`<br><br>Get numeric values between a min and max value, using the range operator `[min..max]`<br><br>For eg: `num_employees:[10..100]`<br><br>Separate multiple conditions with the `&&` operator.<br><br>For eg: `num_employees:>100 && country: [USA, UK]`<br><br>More examples:<br><br>`num_employees:10`<br>`num_employees:<=10`|
|sort_by	|no	|A list of numerical fields and their corresponding sort orders that will be used for ordering your results. Separate multiple fields with a comma. Up to 3 sort fields can be specified.<br><br>E.g. `num_employees:desc,year_started:asc`<br><br>The text similarity score is exposed as a special `_text_match` field that you can use in the list of sorting fields.<br><br>If one or two sorting fields are specified, `_text_match` is used for tie breaking, as the last sorting field.<br><br>Default:<br><br>If no `sort_by` parameter is specified, results are sorted by: `_text_match:desc,default_sorting_field:desc`.|
|facet_by	|no	|A list of fields that will be used for faceting your results on. Separate multiple fields with a comma.|
|max_facet_values	|no	|Maximum number of facet values to be returned.|
|facet_query	|no	|Facet values that are returned can now be filtered via this parameter. The matching facet text is also highlighted. For example, when faceting by `category`, you can set `facet_query=category:shoe` to return only facet values that contain the prefix "shoe".|
|prioritize_exact_match	|no	|By default, Typesense prioritizes documents whose field value matches exactly with the query. Set this parameter to `false` to disable this behavior. <br><br>Default: `true`|
|page	|no	|Results from this specific page number would be fetched.|
|per_page	|no	|Number of results to fetch per page.<br><br>Default: `10` <br><br> NOTE: Only upto 250 hits can be fetched per page.|
|group_by	|no	|You can aggregate search results into groups or buckets by specify one or more `group_by` fields. Separate multiple fields with a comma.<br><br>NOTE: To group on a particular field, it must be a faceted field.<br><br>E.g. `group_by=country,company_name`
|group_limit	|no	|Maximum number of hits to be returned for every group. If the `group_limit` is set as `K` then only the top K hits in each group are returned in the response.<br><br>Default: `3`|
|include_fields	|no	|Comma-separated list of fields from the document to include in the search result.|
|exclude_fields	|no	|Comma-separated list of fields from the document to exclude in the search result.|
|highlight_fields|no | Comma separated list of fields that should be highlighted with snippetting. You can use this parameter to highlight fields that you don't query for, as well.<br><br>Default: all queried fields will be highlighted.|
|highlight_full_fields	|no	|Comma separated list of fields which should be highlighted fully without snippeting.<br><br>Default: all fields will be snippeted.|
|highlight_affix_num_tokens	|no	|The number of tokens that should surround the highlighted text on each side.<br><br>Default: `4`|
|highlight_start_tag	|no	|The start tag used for the highlighted snippets.<br><br>Default: `<mark>`|
|highlight_end_tag	|no	|The end tag used for the highlighted snippets.<br><br>Default: `</mark>`|
|snippet_threshold	|no	|Field values under this length will be fully highlighted, instead of showing a snippet of relevant portion.<br><br>Default: `30`|
|num_typos	|no	|Maximum number of typographical errors (0, 1 or 2) that would be tolerated.<br><br>[Damerau–Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) is used to calculate the number of errors.<br><br>Default: `2`|
|typo_tokens_threshold	|no	|If at least `typo_tokens_threshold` number of results are not found for a specific query, Typesense will attempt to look for results with more typos until `num_typos` is reached or enough results are found. Set `typo_tokens_threshold` to `0` to disable typo tolerance.<br><br>Default: `100`|
|drop_tokens_threshold	|no	|If at least `drop_tokens_threshold` number of results are not found for a specific query, Typesense will attempt to drop tokens (words) in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set `drop_tokens_threshold` to `0` to disable dropping of tokens.<br><br>Default: `10`
|pinned_hits	|no	|A list of records to unconditionally include in the search results at specific positions.<br><br>An example use case would be to feature or promote certain items on the top of search results.<br><br>A comma separated list of `record_id:hit_position`. Eg: to include a record with ID 123 at Position 1 and another record with ID 456 at Position 5, you'd specify `123:1,456:5`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.|
|hidden_hits	|no	|A list of records to unconditionally hide from search results.<br><br>A comma separated list of `record_ids` to hide. Eg: to hide records with IDs 123 and 456, you'd specify `123,456`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.|
|enable_overrides|no|If you have some overrides defined but want to disable all of them for a particular search query, set `enable_overrides` to `false`. <br><br>Default: `true` |
|pre_segmented_query|no|Set this parameter to `true` if you wish to split the search query into space separated words yourself. When set to `true`, we will only split the search query by space, instead of using the locale-aware, built-in tokenizer.<br><br>Default: `false` |
|limit_hits	|no	|Maximum number of hits that can be fetched from the collection. Eg: `200`<br><br>`page * per_page` should be less than this number for the search request to return results.<br><br>Default: no limit<br><br>You'd typically want to generate a scoped API key with this parameter embedded and use that API key to perform the search, so it's automatically applied and can't be changed at search time.|


## Federated / Multi Search
You can send multiple search requests in a single HTTP request, using the Multi-Search feature. This is especially useful to avoid round-trip network latencies incurred otherwise if each of these requests are sent in separate HTTP requests.

You can also use this feature to do a **federated search** across multiple collections in a single HTTP request.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchRequests = {
  'searches': [
    {
      'collection': 'products',
      'q': 'shoe',
      'filter_by': 'price:=[50..120]'
    },
    {
      'collection': 'brands',
      'q': 'Nike'
    }
  ]
}

// Search parameters that are common to all searches go here
let commonSearchParams =  {
    'query_by': 'name',
}

client.multiSearch.perform(searchRequests, commonSearchParams)
```

  </template>

  <template v-slot:PHP>

```php
$searchRequests = [
  'searches' => [
    [
      'collection' => 'products',
      'q' => 'shoe',
      'filter_by' => 'price:=[50..120]'
    ],
    [
      'collection' => 'brands',
      'q' => 'Nike'
    ]
  ]
];

// Search parameters that are common to all searches go here
$commonSearchParams =  [
    'query_by' => 'name',
];

$client->multiSearch->perform($searchRequests, $commonSearchParams);
```

  </template>
  <template v-slot:Python>

```py
search_requests = {
  'searches': [
    {
      'collection': 'products',
      'q': 'shoe',
      'filter_by': 'price:=[50..120]'
    },
    {
      'collection': 'brands',
      'q': 'Nike'
    }
  ]
}

# Search parameters that are common to all searches go here
common_search_params =  {
    'query_by': 'name',
}

client.multi_search.perform(search_requests, common_search_params)
```

  </template>
  <template v-slot:Ruby>

```rb
search_requests = {
  'searches': [
    {
      'collection': 'products',
      'q': 'shoe',
      'filter_by': 'price:=[50..120]'
    },
    {
      'collection': 'brands',
      'q': 'Nike'
    }
  ]
}

# Search parameters that are common to all searches go here
common_search_params =  {
    'query_by': 'name',
}

client.multi_search.perform(search_requests, common_search_params)
```

  </template>
  <template v-slot:Dart>

```dart
final searchRequests = {
  'searches': [
    {
      'collection': 'products',
      'q': 'shoe',
      'filter_by': 'price:=[50..120]'
    },
    {
      'collection': 'brands',
      'q': 'Nike'
    }
  ]
};

# Search parameters that are common to all searches go here
final commonSearchParams =  {
    'query_by': 'name',
};

await client.multiSearch.perform(searchRequests, queryParams: commonSearchParams);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/multi_search?query_by=name" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "searches": [
            {
              "collection": "products",
              "q": "shoe",
              "filter_by": "price:=[50..120]"
            },
            {
              "collection": "brands",
              "q": "Nike"
            }
          ]
        }'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "results": [
    {
      "facet_counts": [],
      "found": 1,
      "hits": [
        {
          "document": {
            "name": "Blue shoe",
            "brand": "Adidas",
            "id": "126",
            "price": 50
          },
          "highlights": [
            {
              "field": "name",
              "matched_tokens": [
                "shoe"
              ],
              "snippet": "Blue <mark>shoe</mark>"
            }
          ],
          "text_match": 130816
        }
      ],
      "out_of": 10,
      "page": 1,
      "request_params": {
        "per_page": 10,
        "q": "shoe"
      },
      "search_time_ms": 1
    },
    {
      "facet_counts": [],
      "found": 1,
      "hits": [
        {
          "document": {
            "name": "Nike shoes",
            "brand": "Nike",
            "id": "391",
            "price": 60
          },
          "highlights": [
            {
              "field": "name",
              "matched_tokens": [
                "Nike"
              ],
              "snippet": "<mark>Nike</mark>shoes"
            }
          ],
          "text_match": 144112
        }
      ],
      "out_of": 5,
      "page": 1,
      "request_params": {
        "per_page": 10,
        "q": "Nike"
      },
      "search_time_ms": 1
    },
  ]
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/multi_search`

### Arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|limit_multi_searches	|no	|Max number of search requests that can be sent in a multi-search request. Eg: `20`<br><br>Default: no limit<br><br>You'd typically want to generate a scoped API key with this parameter embedded and use that API key to perform the search, so it's automatically applied and can't be changed at search time. |

::: tip
The `results` array in a `multi_search` response is guaranteed to be in the same order as the queries you send in the `searches` array in your request.
:::


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
  <template v-slot:Shell>

```bash
$ curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET \
      "http://localhost:8108/collections/companies/documents/124"
```

  </template>
</Tabs>

#### Sample Response

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

#### Definition
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

#### Sample Response

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

#### Definition
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE \
    "http://localhost:8108/collections/companies/documents/124"
```

  </template>
</Tabs>

#### Sample Response

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

#### Definition
`DELETE ${TYPESENSE_HOST}/collections/:collection/documents/:id`

### Delete by query

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
  <template v-slot:Dart>

```dart
await client.collection('companies').documents.delete({'filter_by': 'num_employees:>100'});
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

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "num_deleted": 24
}
```

  </template>
</Tabs>


#### Definition
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET \
    "http://localhost:8108/collections/companies/documents/export"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```json
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215, "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232, "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531, "country": "AU"}
```

  </template>
</Tabs>

While exporting, you can use the following parameters to control the result of the export:

|Parameter|Description|
| -------------- | ----------- |
|filter_by|Restrict the exports to documents that satisfies the filter query.|
|include_fields|List of fields that will be present in the export documents.|
|exclude_fields|List of fields that should not be present in the export documents.|

#### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/export`


## Import documents

You can index multiple documents in a batch using the import API.

#### Definition
`POST ${TYPESENSE_HOST}/collections/:collection/documents/import`

The documents to import need to be formatted as a newline delimited JSON string, aka [JSONLines](https://jsonlines.org/) format.
This is essentially one JSON object per line, without commas between documents. For example, here are a set of 3 documents represented in JSONL format.

```js
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215, "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232, "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531, "country": "AU"}
```

If you are using one of our client libraries, you can also pass in an array of documents and the library will take care of converting it into JSONL.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let documents = [{
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}]

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

await client.collection('companies').documents.importDocuments(documents);
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents/import?action=create" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -X POST \
        -d '{"id": "124","company_name": "Stark Industries","num_employees": 5215,"country": "USA"}
            {"id": "125","company_name": "Acme Corp","num_employees": 2133,"country": "CA"}'
```

  </template>
</Tabs>

Besides `create`, the other allowed `action` modes are `upsert` and `update`.

#### Action modes

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
</table>

### Import a JSONL file

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
client.collections['companies'].documents.import($documentsInJsonl, ['action' => 'create']);
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
  <template v-slot:Dart>

```dart
final file = File('documents.jsonl');
await client.collection('companies').documents.importJSONL(file.readAsStringSync());

```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import?action=create"

```

  </template>
</Tabs>

<br/>

### Import a JSON file

If you have a file in JSON format, you can convert it into JSONL format using [`jq`](https://github.com/stedolan/jq):

```shell
cat documents.json | jq -c .[] > documents.jsonl
```

Once you have the JSONL file, you can then import it following the [instructions above](#import-a-jsonl-file) to import a JSONL file.

### Import a CSV file

If you have a CSV file with column headers, you can convert it into JSONL format using [`mlr`](https://github.com/johnkerl/miller):

```shell
mlr --c2j cat documents.csv > documents.jsonl
```

Once you have the JSONL file, you can then import it following the [instructions above](#import-a-jsonl-file) to import a JSONL file.

### Configure batch size

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
client.collections['companies'].documents.import($documentsInJsonl, ['batch_size' => 100]);
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
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import?batch_size=100"
```

  </template>
</Tabs>

**NOTE**: Larger batch sizes will consume larger transient memory during import.

#### Sample Response

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

## Dealing with Dirty Data

The `dirty_values` parameter determines what Typesense should do when the type of a particular field being 
indexed does not match the previously inferred type for that field.


| Value      | Behavior                                            |
| -------------- | ----------- |-------------------------------------------------------|
|`coerce_or_reject`  | Attempt coercion of the field's value to previously inferred type. If coercion fails, reject the write outright with an error message. |
|`coerce_or_drop`    | Attempt coercion of the field's value to previously inferred type. If coercion fails, drop the particular field and index the rest of the document.  |
|`drop`              | Drop the particular field and index rest of the document. |
|`reject`            | Reject the document outright. |

**Default behaviour** 

If a wildcard (`.*`) field is defined in the schema _or_ if the schema contains any field 
name with a regular expression (e.g a field named `.*_name`), the default behavior is `coerce_or_reject`. Otherwise, 
the default behavior is `reject` (this ensures backward compatibility with older Typesense versions).

### Indexing a document with dirty data

Let's now attempt to index a document with a `title` field that contains an integer. We will assume that this
field was previously inferred to be of type `string`. Let's use the `coerce_or_reject` behavior here:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
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

Similarly, we can use the `dirty_values` parameter for the update and import operations as well.

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
