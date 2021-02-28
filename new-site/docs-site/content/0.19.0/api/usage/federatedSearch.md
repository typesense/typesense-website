# Federated / Multi Search
You can send multiple search requests in a single HTTP request, using the Multi-Search feature. This is especially useful to avoid round-trip network latencies incurred otherwise if each of these requests are sent in separate HTTP requests.

You can also use this feature to do a **federated search** across multiple collections in a single HTTP request.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
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

  <template v-slot:Php>

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
]

// Search parameters that are common to all searches go here
$commonSearchParams =  [
    'query_by' => 'name',
]

$client->multiSearch->perform($searchRequests, $commonSearchParams)
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

### Sample Response

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

### Definition
`POST ${TYPESENSE_HOST}/multi_search`

### Arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|limit_multi_searches	|no	|Max number of search requests that can be sent in a multi-search request. Eg: `20`<br><br>Default: no limit<br><br>You'd typically want to generate a scoped API key with this parameter embedded and use that API key to perform the search, so it's automatically applied and can't be changed at search time.