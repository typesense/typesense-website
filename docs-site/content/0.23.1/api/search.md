---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Search

In Typesense, a search consists of a query against one or more text fields and a list of filters against numerical or facet fields.
You can also sort and facet your results.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
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
  <template v-slot:Java>

```java
SearchParameters searchParameters = new SearchParameters()
                                        .q("stark")
                                        .queryBy("company_name")
                                        .filterBy("num_employees:>100")
                                        .sortBy("num_employees:desc");
SearchResult searchResult = client.collections("companies").documents().search(searchParameters);
```

  </template>
  <template v-slot:Swift>

```swift
let searchParameters = SearchParameters(
  q: "stark",
  queryBy: "company_name",
  filterBy: "num_employees:>100",
  sortBy: "num_employees:desc"
)
let (searchResult, response) = try await client.collection(name: "companies").documents().search(searchParameters, for: Company.self)
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

**Sample Response**

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
      },
      "text_match": 130916
    }
  ]
}
```

  </template>
</Tabs>

When a `string[]` field is queried, the `highlights` structure will include the corresponding matching array indices of the snippets. For e.g:

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

## Search Parameters

### Query parameters

| Parameter           | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|:--------------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| q                   | yes      | The query text to search for in the collection.<br><br>Use `*` as the search string to return all documents. This is typically useful when used in conjunction with `filter_by`.<br><br>For example, to return all documents that match a filter, use:`q=*&filter_by=num_employees:10`.<br><br>To exclude words in your query explicitly, prefix the word with the `-` operator, e.g. `q: 'electric car -tesla'`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| query_by            | yes      | One or more `string / string[]` fields that should be queried against. Separate multiple fields with a comma: `company_name, country`<br><br>The order of the fields is important: a record that matches on a field earlier in the list is considered more relevant than a record matched on a field later in the list. So, in the example above, documents that match on the `company_name` field are ranked above documents matched on the `country` field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| prefix              | no       | Indicates that the last word in the query should be treated as a prefix, and not as a whole word. This is necessary for building autocomplete and instant search interfaces. Set this to `false` to disable prefix searching for all queried fields. <br><br>You can also control the behavior of prefix search on a per field basis. For example, if you are querying 3 fields and want to enable prefix searching only on the first field, use `?prefix=true,false,false`. The order should match the order of fields in `query_by`. If a single value is specified for `prefix` the same value is used for all fields specified in `query_by`.<br><br>Default: `true` (prefix searching is enabled for all fields).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| infix               | no       | Since infix searching requires an additional data structure, you have to enable it on a per-field basis like this:<br><br> ```{"name": "part_number", "type": "string", "infix": true }```<br><br>If infix index is enabled for this field, infix searching can be done on a per-field basis by sending a comma separated string parameter called infix to the search query. This parameter can have 3 values: <br> <ul><li>`off`: infix search is disabled, which is default</li><li>`always`: infix search is performed along with regular search</li><li>`fallback`: infix search is performed if regular search does not produce results</li></ul>For example, if you are querying two fields via `?query_by=title,part_number`, you can enable infix searching only for the `part_number` field, by sending `?infix=off,always` (in the same order of the fields in `query_by`).<br><br>There are also 2 parameters that allow you to control the extent of infix searching:<br><br>`max_extra_prefix` and `max_extra_suffix` which specify the maximum number of symbols before or after the query that can be present in the token. For example: query "K2100" has 2 extra symbols in "6PK2100". By default, any number of prefixes/suffixes can be present for a match.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| split_join_tokens   | no       | Treat space as typo: search for `q=basket ball` if `q=basketball` is not found or vice-versa. Splitting/joining of tokens will only be attempted if the original query produces no results. To always trigger this behavior, set value to `always`. To disable, set value to `off`. <br><br>Default: `fallback`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| pre_segmented_query | no       | Set this parameter to `true` if you wish to split the search query into space separated words yourself. When set to `true`, we will only split the search query by space, instead of using the locale-aware, built-in tokenizer.<br><br>Default: `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Filter parameters

| Parameter           | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|:--------------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| filter_by           | no       | Filter conditions for refining your search results.<br><br>A field can be matched against one or more values.<br><br>Examples:<br>- `country: USA`<br>- `country: [USA, UK]` returns documents that have `country` of `USA` OR `UK`.<br><br>**Exact Filtering:**<br>To match a string field exactly, you can use the `:=` operator. For eg: `category:= Shoe` will match documents from the category shoes and not from a category like `shoe rack`.<br><br>**Escaping Commas:**<br>You can also filter using multiple values and use the backtick character to denote a string literal: <code>category:= [\`Running Shoes, Men\`, Sneaker]</code>.<br><br>**Negation:**<br>Not equals / negation is supported for string and boolean facet fields, e.g. `filter_by=author:!=JK Rowling` or multiple negations of a facet that should not be included in the query: `filter_by=author:!=[JK Rowling,Gilbert Patten]`<br><br>**Numeric Filtering:**<br>Filter documents with numeric values between a min and max value, using the range operator `[min..max]` or using simple comparison operators `>`, `>=` `<`, `<=`, `=`.  <br><br>Examples:<br>-`num_employees:[10..100]`<br>-`num_employees:<40`<br>-`num_employees:[10..100,40]` (Filter docs where value is between 10 to 100 or exactly 40).<br><br>**Multiple Conditions:**<br>Separate multiple conditions with the `&&` operator.<br><br>Examples:<br>- `num_employees:>100 && country: [USA, UK]`<br>- `categories:=Shoes && categories:=Outdoor`<br><br>To do ORs across _different_ fields (eg: Color is blue OR category is Shoe), you want to split each condition into separate queries in a [multi-query](federated-multi-search.md) request and then aggregate the text match scores across requests. <br><br>**Filtering Arrays:**<br>filter_by can be used with array fields as well. <br><br>For eg: If `genres` is a `string[]` field: <br><br>- `genres:=[Rock, Pop]` will return documents where the `genres` array field contains `Rock OR Pop`. <br>- `genres:=Rock && genres:=Acoustic` will return documents where the `genres` array field contains both `Rock AND Acoustic`. <br><br>**Geo Filtering:**<br> Read more about [GeoSearch and filtering](geosearch.md) in this dedicated section. |

### Ranking and Sorting parameters

| Parameter                 | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|:--------------------------|:---------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| query_by_weights          | no       | The relative weight to give each `query_by` field when ranking results. Values can be between `0` and `127`. This can be used to boost fields in priority, when looking for matches.<br><br>Separate each weight with a comma, in the same order as the `query_by` fields. For eg: `query_by_weights: 1,1,2` with `query_by: field_a,field_b,field_c` will give equal weightage to `field_a` and `field_b`, and will give twice the weightage to `field_c` comparatively.<br><br>Default: If no explicit weights are provided, fields earlier in the `query_by` list will be considered to have greater weight.                                                                                                                                                                                                                                                                                                             |
| sort_by                   | no       | A list of fields and their corresponding sort orders that will be used for ordering your results. Separate multiple fields with a comma. Up to 3 sort fields can be specified.<br><br>E.g. `num_employees:desc,year_started:asc`<br><br>The text similarity score is exposed as a special `_text_match` field that you can use in the list of sorting fields.<br><br>If one or two sorting fields are specified, `_text_match` is used for tie breaking, as the last sorting field.<br><br>Default:<br><br>If no `sort_by` parameter is specified, results are sorted by: `_text_match:desc,default_sorting_field:desc`.<br><br>**GeoSort**: When using [GeoSearch](geosearch.md), documents can be sorted around a given lat/long using `location_field_name(48.853, 2.344):asc`. You can also sort by additional fields within a radius. Read more [here](geosearch.md#sorting-by-additional-attributes-within-a-radius). |
| prioritize_exact_match    | no       | By default, Typesense prioritizes documents whose field value matches exactly with the query. Set this parameter to `false` to disable this behavior. <br><br>Default: `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| prioritize_token_position | no       | Make Typesense prioritize documents where the query words appear earlier in the text.<br><br>Default: `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| pinned_hits               | no       | A list of records to unconditionally include in the search results at specific positions.<br><br>An example use case would be to feature or promote certain items on the top of search results.<br><br>A comma separated list of `record_id:hit_position`. Eg: to include a record with ID 123 at Position 1 and another record with ID 456 at Position 5, you'd specify `123:1,456:5`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.                                                                                                                                                                                                                                                                                                                                                            |
| hidden_hits               | no       | A list of records to unconditionally hide from search results.<br><br>A comma separated list of `record_ids` to hide. Eg: to hide records with IDs 123 and 456, you'd specify `123,456`.<br><br>You could also use the Overrides feature to override search results based on rules. Overrides are applied first, followed by pinned_hits and finally hidden_hits.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| enable_overrides          | no       | If you have some overrides defined but want to disable all of them for a particular search query, set `enable_overrides` to `false`. <br><br>Default: `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Pagination parameters

| Parameter | Required | Description                                                                                                                                                                                                                                                                                              |
|:----------|:---------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| page      | no       | Results from this specific page number would be fetched.<br><br>Page numbers start at `1` for the first page.<br><br>Default: `1`                                                                                                                                                                        |
| per_page  | no       | Number of results to fetch per page.<br><br>When `group_by` is used, `per_page` refers to the number of _groups_ to fetch per page, in order to properly preserve pagination. <br><br>Default: `10` <br><br> NOTE: Only upto 250 hits (or groups of hits when using `group_by`) can be fetched per page. |


### Faceting parameters

| Parameter             | Required | Description                                                                                                                                                                                                                                                                                                                                                               |
|:----------------------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| facet_by              | no       | A list of fields that will be used for faceting your results on. Separate multiple fields with a comma.                                                                                                                                                                                                                                                                   |
| max_facet_values      | no       | Maximum number of facet values to be returned. <br><br>Default: `10`                                                                                                                                                                                                                                                                                                      |
| facet_query           | no       | Facet values that are returned can now be filtered via this parameter. The matching facet text is also highlighted. For example, when faceting by `category`, you can set `facet_query=category:shoe` to return only facet values that contain the prefix "shoe".<br><br>Use the `facet_query_num_typos` parameter to control the _fuzziness_ of this facet value filter. |
| facet_query_num_typos | no       | Controls the _fuzziness_ of the facet query filter. Default: `2`.                                                                                                                                                                                                                                                                                                         |


### Grouping parameters

| Parameter   | Required | Description                                                                                                                                                                                                                                                   |
|:------------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| group_by    | no       | You can aggregate search results into groups or buckets by specify one or more `group_by` fields. Separate multiple fields with a comma.<br><br>NOTE: To group on a particular field, it must be a faceted field.<br><br>E.g. `group_by=country,company_name` |
| group_limit | no       | Maximum number of hits to be returned for every group. If the `group_limit` is set as `K` then only the top K hits in each group are returned in the response.<br><br>Default: `3`                                                                            |

### Results parameters

| Parameter                  | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                |
|:---------------------------|:---------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| include_fields             | no       | Comma-separated list of fields from the document to include in the search result.                                                                                                                                                                                                                                                                                                                          |
| exclude_fields             | no       | Comma-separated list of fields from the document to exclude in the search result. <br/><br>You can use this parameter in a scoped API key to exclude / hide potentially sensitive fields like `out_of` and `search_time_ms` from the search API response.                                                                                                                                                  |
| highlight_fields           | no       | Comma separated list of fields that should be highlighted with snippetting. You can use this parameter to highlight fields that you don't query for, as well. <br><br>Default: all queried fields will be highlighted. <br><br> Set to `none` to disable snippetting fully.                                                                                                                                |
| highlight_full_fields      | no       | Comma separated list of fields which should be highlighted fully without snippeting.<br><br>Default: all fields will be snippeted.  <br><br> Set to `none` to disable highlighting fully.                                                                                                                                                                                                                  |
| highlight_affix_num_tokens | no       | The number of tokens that should surround the highlighted text on each side. This controls the length of the snippet. <br><br>Default: `4`                                                                                                                                                                                                                                                                 |
| highlight_start_tag        | no       | The start tag used for the highlighted snippets.<br><br>Default: `<mark>`                                                                                                                                                                                                                                                                                                                                  |
| highlight_end_tag          | no       | The end tag used for the highlighted snippets.<br><br>Default: `</mark>`                                                                                                                                                                                                                                                                                                                                   |
| snippet_threshold          | no       | Field values under this length will be fully highlighted, instead of showing a snippet of relevant portion.<br><br>Default: `30`                                                                                                                                                                                                                                                                           |
| limit_hits                 | no       | Maximum number of hits that can be fetched from the collection. Eg: `200`<br><br>`page * per_page` should be less than this number for the search request to return results.<br><br>Default: no limit<br><br>You'd typically want to generate a scoped API key with this parameter embedded and use that API key to perform the search, so it's automatically applied and can't be changed at search time. |
| search_cutoff_ms           | no       | Typesense will attempt to return results early if the cutoff time has elapsed. This is not a strict guarantee and facet computation is not bound by this parameter.<br><br>Default: no search cutoff happens.                                                                                                                                                                                              |
| max_candidates             | no       | Control the number of words that Typesense considers for typo and prefix searching .<br><br>Default: `4` (or `10000` if `exhaustive_search` is enabled).                                                                                                                                                                                                                                                   |
| exhaustive_search          | no       | Setting this to `true` will make Typesense consider all variations of prefixes and typo corrections of the words in the query exhaustively, without stopping early when enough results are found (`drop_tokens_threshold` and `typo_tokens_threshold` configurations are ignored). <br><br>Default: `false`                                                                                                |

### Typo-Tolerance parameters

| Parameter             | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|:----------------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| num_typos             | no       | Maximum number of typographical errors (0, 1 or 2) that would be tolerated.<br><br>[Damerau–Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) is used to calculate the number of errors.<br><br>You can also control `num_typos` on a per field basis. For example, if you are querying 3 fields and want to disable typo tolerance on the first field, use `?num_typos=0,1,1`. The order should match the order of fields in `query_by`. If a single value is specified for `num_typos` the same value is used for all fields specified in `query_by`. <br><br>Default: `2` (`num_typos` is `2` for *all* fields specified in `query_by`). |
| min_len_1typo         | no       | Minimum word length for 1-typo correction to be applied. The value of `num_typos` is still treated as the maximum allowed typos. <br><br>Default: `4`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| min_len_2typo         | no       | Minimum word length for 2-typo correction to be applied. The value of `num_typos` is still treated as the maximum allowed typos. <br><br>Default: `7`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| typo_tokens_threshold | no       | If at least `typo_tokens_threshold` number of results are not found for a specific query, Typesense will attempt to look for results with more typos until `num_typos` is reached or enough results are found. Set `typo_tokens_threshold` to `0` to disable typo tolerance.<br><br>Default: `1`                                                                                                                                                                                                                                                                                                                                                                                    |
| drop_tokens_threshold | no       | If at least `drop_tokens_threshold` number of results are not found for a specific query, Typesense will attempt to drop tokens (words) in the query until enough results are found. Tokens that have the least individual hits are dropped first. Set `drop_tokens_threshold` to `0` to disable dropping of tokens.<br><br>Default: `1`                                                                                                                                                                                                                                                                                                                                            |

### Caching parameters

| Parameter | Required | Description                                                                                                                                                                                             |
|:----------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| use_cache | no       | Enable server side caching of search query results. By default, caching is disabled.<br><br>Default: `false`                                                                                            |
| cache_ttl | no       | The duration (in seconds) that determines how long the search query is cached. This value can only be set as part of a [scoped API key](./api-keys.md#generate-scoped-search-key).<br><br>Default: `60` |

## Filter Results

You can use the `filter_by` search parameter to filter results by a particular value(s) or logical expressions.

For eg: if you have dataset of movies, you can apply a filter to only return movies in a certain genre or published after a certain date, etc.

You'll find detailed documentation for `filter_by` in the [Search Parameters](#search-parameters) table above.

## Facet Results

You can use the `facet_by` search parameter to have Typesense return aggregate counts of values for one or more fields.
For integer fields, Typesense will also return min, max, sum and average values, in addition to counts.

For eg: if you have a [dataset of songs](https://songs-search.typesense.org/) like in the screenshot below,
the **_count_** next to each of the "Release Dates" and "Artists" on the left is obtained by faceting on the `release_date` and `artist` fields.

![Facting Usecase Example](~@images/faceting_usecase_example.png)

This is useful to show users a summary of results, so they can refine the results further to get to what they're looking for efficiently.

Note that you need to enable faceting on a field using `{fields: [{facet: true, name: "<field>", type: "<datatype>"}]}` in the [Collection Schema](./collections.md#create-a-collection) before using it in `facet_by`.

You'll find detailed documentation for `facet_by` in the [Facet Parameters](#faceting-parameters) table above.

## Sort Results

You can use the `sort_by` search parameter to sort results by upto 3 fields.

The text similarity score is exposed as a special `_text_match` field that you can use in the list of sorting fields.

### Sorting on strings

While sorting is enabled by default on numerical and boolean fields, sorting on a string field is only allowed
if that field has `sort` property enabled in the collection schema. For e.g. here's a collection schema where
sorting is allowed on the `email` string field.

```shell
{
  "name": "users",
  "fields": [
    {"name": "name", "type": "string" },
    {"name": "email", "type": "string", "sort": true }
  ]
}
```

In the `users` collection defined above, the `email` field can be sorted upon, but the `name` field is not sortable.

:::tip
Sorting on a string field requires the construction of a separate index that can consume a lot of memory
for long string fields (like `description`) or in large datasets. So, care must be taken to enable sorting on only
relevant string fields.
:::

### Sorting null, empty or missing values

For optional numerical fields, missing or `null` values are always sorted to the end _regardless_ of the sort order.

In the case of optional string fields, empty (`""`), missing or `null` string values are considered to
have the "highest" value, so on ascending sort, these values are placed at the end of the results. Likewise,
on descending sort, these values are placed at the top of the results.

For both numerical and string fields, you can use the `missing_values` parameter to alter this behavior.
For example, here's how you can ensure that titles with null/empty/missing values are present at the top of the result
set in an ascending sort:

```shell
sort_by=title(missing_values: first):asc
```

Likewise, to ensure that null/empty/missing values appear at the end of the results in a descending sort:

```shell
sort_by=title(missing_values: last):desc
```

The possible values of `missing_values` are: `first` or `last`.

You'll find detailed documentation for `sort_by` in the [Ranking Parameters](#ranking-parameters) table above.

## Group Results

You can aggregate search results into groups or buckets by specify one or more `group_by` fields.

Grouping hits this way is useful in:

* **Deduplication**: By using one or more `group_by` fields, you can consolidate items and remove duplicates in the search results. For example, if there are multiple shoes of the same size, by doing a `group_by=size&group_limit=1`, you ensure that only a single shoe of each size is returned in the search results.
* **Correcting skew**: When your results are dominated by documents of a particular type, you can use `group_by` and `group_limit` to correct that skew. For example, if your search results for a query contains way too many documents of the same brand, you can do a `group_by=brand&group_limit=3` to ensure that only the top 3 results of each brand is returned in the search results.

:::tip
To group on a particular field, it must be a faceted field.
:::

Grouping returns the hits in a nested structure, that's different from the plain JSON response format we saw earlier. Let's repeat the query we made earlier with a `group_by` parameter:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Swift','Shell']">
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
  <template v-slot:Java>

```java
SearchParameters searchParameters = new SearchParameters()
                                        .q("stark")
                                        .queryBy("company_name")
                                        .filterBy("num_employees:>100")
                                        .sortBy("num_employees:desc")
                                        .groupBy("country")
                                        .groupLimit(1);
SearchResult searchResult = client.collections("companies").documents().search(searchParameters);
```
  </template>
  <template v-slot:Swift>

```swift
let searchParameters = SearchParameters(
  q: "stark",
  queryBy: "company_name",
  filterBy: "num_employees:>100",
  sortBy: "num_employees:desc",
  groupBy: "country",
  groupLimit: 1
)
let (searchResult, response) = try await client.collection(name: "companies").documents().search(searchParameters, for: Company.self)
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

**Definition**

`GET ${TYPESENSE_HOST}/collections/:collection/documents/search`

## Pagination

You can use the `page` and `per_page` search parameters to control pagination of results.

By default, Typesense returns the top 10 results (`page: 1`, `per_page: 10`).

You'll find detailed documentation for these pagination parameters in the [Pagination Parameters](#pagination-parameters) table above.

## Ranking

By default, Typesense ranks results by a `text_match` relevance score it calculates.

You can use various Search Parameters to influence the text match score, sort results by additional parameters and conditionally promote or hide results.
Read more in the [Ranking and Relevance Guide](../../guide/ranking-and-relevance.md).
