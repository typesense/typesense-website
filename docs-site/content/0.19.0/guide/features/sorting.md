# Sorting

Sorting is the ordering of search results either in ascending or descending order based on one or more parameters..

Typesense has in-built support for sorting. While creating a collection, you must define a `default_sorting_field`. Users can sort the results by defining the `sort_by` parameter in the search query. If `sort_by` field is not present, then the default field defined earlier would be used to sort results. For example, while searching for a book in a [books](../../api/#creating-a-books-collection) collection, the search query can be defined as:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
let searchParameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
}

client.collections('books').documents().search(searchParameters)
```
  </template>

  <template v-slot:PHP>

```php
$searchParameters = [
  'q'         : 'harry',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
];

$client->collections['books']->documents->search($searchParameters);
```
  </template> 
  <template v-slot:Python>

```python
search_parameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
}

client.collections['books'].documents.search(search_parameters)
```
   </template>
   <template v-slot:Ruby>

```ruby
search_parameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
}

client.collections['books'].documents.search(search_parameters)
```
  </template>
</Tabs>

Sample response:

```json
{
  "facet_counts": [],
  "found": 62,
  "hits": [
    {
      "highlights": [
        {
          "field": "title",
          "snippet": "<mark>Harry</mark> <mark>Potter</mark> and the Philosopher's Stone"
        }
      ],
      "document": {
        "authors": [
          "J.K. Rowling", "Mary GrandPré"
        ],
        "authors_facet": [
          "J.K. Rowling", "Mary GrandPré"
        ],
        "average_rating": 4.44,
        "id": "2",
        "image_url": "https://images.gr-assets.com/books/1474154022m/3.jpg",
        "publication_year": 1997,
        "publication_year_facet": "1997",
        "ratings_count": 4602479,
        "title": "Harry Potter and the Philosopher's Stone"
      }
    },
    ...
  ]
}
```

Here the documents would be sorted by the `ratings_count` field in descending order. You can specify up to 3 fields for sorting. More details on using `sort_by` argument can be found [here](../../api/documents.html#arguments).
