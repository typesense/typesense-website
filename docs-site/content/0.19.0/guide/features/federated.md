# Federated Search

Federated or multi search is a way to search for documents in multiple collections as part of a single search query. You can also use multi-search to send multiple search queries to the same collections, essentially giving you a way to batch search queries in a single HTTP request. Federated search can help reduce network latencies. It can also be used to present similar content from other collections, that might encourage users to browse more content across your application. For example, your application might have different collections for `Nike` and `Adidas`. Now, if a user is looking for a shoe from a specific branch and they might not know what other brands are available, the search query can perform a search on both the collections and return relevant results from both the collections. 

For example, if you search for `Canon` on https://www.bhphotovideo.com/, you would see that there are multiple results shown including products, suggestions and help resources:

![bhp federated example](~@images/bhp-federated.png)

Typesense supports searching across multiple collections in a single HTTP request. Let's create a search query for shoes:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
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

```python
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

```ruby
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
</Tabs>

Sample response:

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

In the above example, the user is searching for a `Nike` shoe, but the `multiSerch` query returns results from the `Adidas` collection as well. You can control the number of maximum search requests using the `limit_multi_searches` parameter. By default, there is no limit. You can find more details on the argument [here](../../0.19.0/api/documents.html#federated-multi-search).
