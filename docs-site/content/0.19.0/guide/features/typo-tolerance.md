# Typo Tolerance

Typo, short for typographical error, is a mistake made while typing something. A typo is generally an unintentional mistake that can happen due to typing faster or typing on a screen where the keypad is small. However, sometimes your users might not know the exact spelling of the word and they type what they think is an approximation of the exact term, in the hope that the system would understand and bring up the relevant results. 

Typesense can handle typos out of the box. It can understand what users are looking for even if there is a mistake in the search query and provide relevant results.  Let's see it in action! To follow this example, first [create](https://typesense.org/docs/0.19.0/api/collections.html#create-a-collection) a collection named "companies" and [index](https://typesense.org/docs/0.19.0/api/documents.html#index-a-document) a sample document. Now, let's perform a search (notice the typo!): 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
let searchParameters = {
  'q'         : 'stork',
  'query_by'  : 'company_name',
  'sort_by'   : 'num_employees:desc'
}

client.collections('companies').documents().search(searchParameters)
```
  </template>

  <template v-slot:PHP>

```php
$searchParameters = [
  'q'         => 'stork',
  'query_by'  => 'company_name',
  'sort_by'   => 'num_employees:desc'
];

$client->collections['companies']->documents->search($searchParameters);
```
  </template> 
  <template v-slot:Python>

```python
search_parameters = {
  'q'         : 'stork',
  'query_by'  : 'company_name',
  'sort_by'   : 'num_employees:desc'
}

client.collections['companies'].documents.search(search_parameters)
```
   </template>
   <template v-slot:Ruby>

```ruby
search_parameters = {
  'q'         => 'stork',
  'query_by'  => 'company_name',
  'sort_by'   => 'num_employees:desc'
}

client.collections['companies'].documents.search(search_parameters)
```
  </template>
</Tabs>

Here is the sample response:

```json
{
   "facet_counts": [],
   "found": 1,
   "hits": [
      {
         "document": {
            "company_name": "Stark Industries",
            "country": "USA",
            "id": "124",
            "num_employees": 5215
         },
         "highlights": [
            {
               "field": "company_name",
               "matched_tokens": [
                  "Stark"
               ],
               "snippet": "<mark>Stark</mark> Industries"
            }
         ],
         "text_match": 130560
      }
   ],
   "out_of": 1,
   "page": 1,
   "request_params": {
      "collection_name": "companies",
      "per_page": 10,
      "q": "stork"
   },
   "search_time_ms": 0
}
```

Typesense can get you the relevant results even if there is a typo in the search query. You can control the extent of typo toleration using the `num_typos` argument. The default value is 2. You can also keep looking for results with more typos until a threshold is reached using the `typo_tokens_threshold` argument. More details on these arguments can be found [here](https://typesense.org/docs/0.19.0/api/documents.html#arguments).


