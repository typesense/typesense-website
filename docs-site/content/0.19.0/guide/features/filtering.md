# Filtering

Filtering is the process of excluding results that don't meet certain criteria. Filtering can help users narrow down their searches and find the most relevant result. For example, in a books dataset, users might be looking for a specific book by an author. They can filter the data with the author's name and limit the number of results they need to look through.

Filtering and Faceting can work together in UI based systems. In our [Book Search Showcase](https://books-search.typesense.org/), if you search for an author, you would see facets on the left navigation panel. The faceted fields in this case are `Subject` and `Authors`.  The widget will show the values and count of documents. But once you click on a facet value, a filter would be applied that will exclude the documents that don't meet the condition. In the image below, when we click on `Fiction`, a filter would be applied to the search results.

![Typesense filter example](~@images/typesense-filter.png)

With Typesense, you can add `filter_by` parameter to your search query to filter results. For example, in a book dataset if you want to search for books that are published before 1998, you can run the following query:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
let searchParameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'filter_by' : 'publication_year:<1998',
  'sort_by'   : 'publication_year:desc'
}

client.collections('books')
  .documents()
  .search(searchParameters)
  .then(function (searchResults) {
    console.log(searchResults)
  })
```
  </template>

  <template v-slot:PHP>

```php
$$searchParameters = [
  'q'         => 'harry potter',
  'query_by'  => 'title',
  'filter_by' => 'publication_year:<1998',
  'sort_by'   => 'publication_year:desc'
];

$client->collections['books']->documents->search($searchParameters);
```
  </template> 
  <template v-slot:Python>

```python
search_parameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'filter_by' : 'publication_year:<1998',
  'sort_by'   : 'publication_year:desc'
}

client.collections['books'].documents.search(search_parameters)
```
   </template>
   <template v-slot:Ruby>

```ruby
search_parameters = {
  'q'         => 'harry potter',
  'query_by'  => 'title',
  'filter_by' => 'publication_year:<1998',
  'sort_by'   => 'publication_year:desc'
}

client.collections['books'].documents.search(search_parameters)
```
  </template>
</Tabs>

Here is a sample response:

```json
{
  "facet_counts": [],
  "found": 24,
  "hits": [
    {
      "highlights": {
        "title": {
          "field": "title",
          "snippet": "<mark>Harry</mark> <mark>Potter</mark> and the Philosopher's Stone"
        }
      },
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

You can also filter results by matching a field with more than one value. More details on the argument can be found [here](../../api/documents.html#arguments).
