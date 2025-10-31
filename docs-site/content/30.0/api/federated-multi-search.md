---
sidebarDepth: 1
sitemap:
  priority: 0.7
---

# Federated / Multi Search

Multi search allows you to make multiple search requests in a single HTTP request. It helps you avoid
round-trip network latencies incurred otherwise if each of these requests are sent as separate HTTP requests.

You can use it in two different modes:

- **Federated search**: each search request in the multi-search payload returns results as independently.
- **Union search**: the response of each search request is merged into a single unified order.

## Federated search

With **federated search**, you can use a`multi_search` request to search across multiple collections
in a single HTTP request, with the search results being independent of each other.

For eg: in an ecommerce products dataset, you can show results from both a "products" collection,
and a "brands" collection to the user, by searching them in parallel with a `multi_search` request.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart','Java','Go','Shell']">
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
  <template v-slot:Java>

```java
HashMap<String,String > search1 = new HashMap<>();
HashMap<String,String > search2 = new HashMap<>();

search1.put("collection","products");
search1.put("q","shoe");
search1.put("filter_by","price:=[50..120]");

search2.put("collection","brands");
search2.put("q","Nike");

List<HashMap<String, String>> searches = new ArrayList<>();
searches.add(search1);
searches.add(search2);

HashMap<String, List<HashMap<String ,String>>> searchRequests = new HashMap<>();
searchRequests.put("searches",searches);

HashMap<String,String> commonSearchParams = new HashMap<>();
commonSearchParams.put("query_by","name");

client.multiSearch.perform(searchRequests, commonSearchParams);
```

  </template>
  <template v-slot:Go>

```go
searchRequests := api.MultiSearchSearchesParameter{
  Searches: []api.MultiSearchCollectionParameters{
    {
      Collection: "products",
      Q:          pointer.String("shoe"),
      FilterBy:   pointer.String("price:=[50..120]"),
    },
    {
      Collection: "brands",
      Q:          pointer.String("Nike"),
    },
  },
}

// Search parameters that are common to all searches go here
commonSearchParams := &api.MultiSearchParams{
  QueryBy: pointer.String("name"),
}

client.MultiSearch.Perform(context.Background(), commonSearchParams, searchRequests)
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

**Sample Response**

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
    }
  ]
}
```

  </template>
</Tabs>

**Definition**

`POST ${TYPESENSE_HOST}/multi_search`

::: tip
For federated search, the `results` array in a `multi_search` response is guaranteed to be in the same order
as the queries you send in the `searches` array in your request.
:::

## Union search

The search results returned by each of the search queries in a `multi_search` request can be merged into a
single ordered set of hits via the `union` option.

In the following example, we are making two different search requests to the same collection (although different collections can also be mentioned). Each search query is filtering the `posts` collection by two different usernames.

Since the `union` property is set to `true`, the response from each of these two search queries will be merged
into a single ordered set of hits.

```bash
curl 'http://localhost:8108/multi_search?page=1&per_page=2' -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '
{
  "union": true,
  "searches": [
    {
      "collection": "posts",
      "q": "*",
      "filter_by": "user_name:stark_industry"
    },
    {
      "collection": "posts",
      "q": "*",
      "filter_by": "user_name:rogers_steve"
    }
  ]
}'
```

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "found": 3,
  "hits": [
    {
      "document": {
        "content": "USA",
        "id": "124",
        "likes": 5215,
        "user_name": "stark_industry"
      },
      "highlight": {},
      "highlights": []
    },
    {
      "document": {
        "content": "CA",
        "id": "125",
        "likes": 2133,
        "user_name": "rogers_steve"
      },
      "highlight": {},
      "highlights": []
    }
  ],
  "out_of": 3,
  "page": 1,
  "search_cutoff": false,
  "search_time_ms": 0,
  "union_request_params": [
    {
      "collection": "posts",
      "first_q": "*",
      "per_page": 2,
      "q": "*"
    },
    {
      "collection": "posts",
      "first_q": "*",
      "per_page": 2,
      "q": "*"
    }
  ]
}
```
  </template>
</Tabs>

Unlike SQL, results of any search requests can be merged regardless of the type or count of fields mentioned in `query_by`, `include_fields`, `exclude_fields`, etc.
Since the results of each search are merged into one final result, union differs from `multi_search` in the following ways:
* The pagination parameters (`page`, `per_page`, `offset`, `limit`, and `limit_hits`) of individual searches are ignored. Only global pagination parameters passed as query parameters are considered.
* Sorting requires the type, count, and order of the sorting fields of every search request to be the same. For example:
```bash
{
  "union": true,
  "searches": [
    {
      ...
      "sort_by": "user_name:asc"
      ...
    },
    {
      ...
      "sort_by": "rating:asc"
      ...
    }
  ]
}
```
will return an error since the types (`user_name: string`, `rating: float`) are different.
<br><br>
Union search removes duplicates by default. Which can be turned off using flag `remove_duplicates: false`

### Grouping with Union
Union supports `group_by` operations with flag `group_by` params in searches like below,

```bash
curl 'http://localhost:8108/multi_search?page=1&per_page=2' -X POST \
     -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '
{
  "union": true,
  "searches": [
    {
      "collection": "posts",
      "q": "*",
      "filter_by": "user_name:stark_industry",
      "group_by": "content",
      "group_limit": 2
    },
    {
      "collection": "comments",
      "q": "*",
      "filter_by": "user_name:rogers_steve",
      "group_by": "content"
    }
  ]
}'
```
**NOTE**: Union searches with grouping should be uniform in shape. i.e either all searches should contain grouping params or none of them.

## `multi_search` Parameters

You can use any of the [Search Parameters here](./search.md#search-parameters) for each individual search operation within a `multi_search` request.

In addition, you can use the following parameters with `multi_search` requests:

| Parameter            | Required | Description                                                                                                                                                                                                                                                                                                                                   |
|----------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| limit_multi_searches | no	      | Max number of search requests that can be sent in a multi-search request. Eg: `20`<br><br>Default: `50`<br><br>You want to generate a [scoped API key](./api-keys.md##generate-scoped-search-key) with this parameter embedded and use that API key to perform the search, so it's automatically applied and can't be changed at search time. |
| x-typesense-api-key  | no	      | You can embed a separate search API key for each search within a multi_search request. <br><br> This is useful when you want to apply different embedded filters for each collection in individual [scoped API keys](./api-keys.md##generate-scoped-search-key).                                                                              |


## Example UI Implementation

Here's a demo Frontend app that shows you how to implement a Federated Search UI: [federated-search.typesense.org](https://federated-search.typesense.org/).

Here's the source code for it: [https://github.com/typesense/showcase-federated-search/blob/master/src/app.js](https://github.com/typesense/showcase-federated-search/blob/master/src/app.js)