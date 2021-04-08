# Faceting

Faceting is a way to classify search results into smaller groups based on the attributes in each result. For example, in a dataset of books, after users search for a book title, they'd want to categorize the search results by authors, genre, etc. Similarly, in a movie dataset, users may want to search for movies by first grouping them via actor, director, genre, etc. This subclassification of search results is known as Faceting. Faceting is not to be confused with Filtering, as Filtering provides a way to remove results that don't meet certain criteria, while Faceting provides a way to group results into categories.

In a UI based system, facets can be used to refine search results. For exmaple, in [book search demo](https://books-search.typesense.org/), if you search for an author, you can see facet fields in the left navigation panels. You can use either subject facet or author facet to narrow down your search. It also shows the count for the facet fields. In the image below, you can see that the `Fiction` facet has 408 docuemnts, while `Classics` facet has 363 documents.

![Typesense facet example](~@images/typesense-facet.png)

Typesense provides out-of-the-box support for Faceting. To facet results, you first need to define one or more facet fields. This field will allow Typesense to subgroup results into categories and then the search results can be refined in that subgroup. In a book dataset, you can define a facet field on authors or publication year:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
booksSchema = {
  'name': 'books',
  'fields': [
    {'name': 'title', 'type': 'string' },
    {'name': 'authors', 'type': 'string[]' },
    {'name': 'image_url', 'type': 'string' },

    {'name': 'publication_year', 'type': 'int32' },
    {'name': 'ratings_count', 'type': 'int32' },
    {'name': 'average_rating', 'type': 'float' },

    {'name': 'authors_facet', 'type': 'string[]', 'facet': true },
    {'name': 'publication_year_facet', 'type': 'string', 'facet': true },
  ],
  'default_sorting_field': 'ratings_count'
}

```
  </template>

  <template v-slot:PHP>

```php
$booksSchema = [
  'name' => 'books',
  'fields' => [
    ['name' => 'title', 'type' => 'string'],
    ['name' => 'authors', 'type' => 'string[]'],
    ['name' => 'image_url', 'type' => 'string'],

    ['name' => 'publication_year', 'type' => 'int32'],
    ['name' => 'ratings_count', 'type' => 'int32'],
    ['name' => 'average_rating', 'type' => 'float'],

    ['name' => 'authors_facet', 'type' => 'string[]', 'facet' => true],
    ['name' => 'publication_year_facet', 'type' => 'string', 'facet' => true]
  ],
  'default_sorting_field' => 'ratings_count'
];

```
  </template> 
  <template v-slot:Python>

```python
books_schema = {
  'name': 'books',
  'fields': [
    {'name': 'title', 'type': 'string' },
    {'name': 'authors', 'type': 'string[]' },
    {'name': 'image_url', 'type': 'string' },

    {'name': 'publication_year', 'type': 'int32' },
    {'name': 'ratings_count', 'type': 'int32' },
    {'name': 'average_rating', 'type': 'float' },

    {'name': 'authors_facet', 'type': 'string[]', 'facet': True },
    {'name': 'publication_year_facet', 'type': 'string', 'facet': True },
  ],
  'default_sorting_field': 'ratings_count'
}

```
   </template>
   <template v-slot:Ruby>

```ruby
books_schema = {
  'name' => 'books',
  'fields' => [
    {'name' => 'title', 'type' => 'string' },
    {'name' => 'authors', 'type' => 'string[]' },
    {'name' => 'image_url', 'type' => 'string' },

    {'name' => 'publication_year', 'type' => 'int32' },
    {'name' => 'ratings_count', 'type' => 'int32' },
    {'name' => 'average_rating', 'type' => 'float' },

    {'name' => 'authors_facet', 'type' => 'string[]', 'facet' => true },
    {'name' => 'publication_year_facet', 'type' => 'string', 'facet' => true }
  ],
  'default_sorting_field' => 'ratings_count'
}
```
  </template>
</Tabs>

In above example, `authors_facet` and `publication_year_facet` are facet fields. Let's see the faceted search in action!

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
let searchParameters = {
  'q'         : 'experiment',
  'query_by'  : 'title',
  'facet_by' : 'authors_facet',
  'sort_by'   : 'average_rating:desc'
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
$searchParameters = [
  'q'         => 'experiment',
  'query_by'  => 'title',
  'facet_by'  => 'authors_facet',
  'sort_by'   => 'average_rating:desc'
];

$client->collections['books']->documents->search($searchParameters);
```
  </template> 
  <template v-slot:Python>

```python
search_parameters = {
  'q'         : 'experiment',
  'query_by'  : 'title',
  'facet_by' : 'authors_facet',
  'sort_by'   : 'average_rating:desc'
}

client.collections['books'].documents.search(search_parameters)
```
   </template>
   <template v-slot:Ruby>

```ruby
search_parameters = {
  'q'         => 'experiment',
  'query_by'  => 'title',
  'facet_by'  => 'authors_facet',
  'sort_by'   => 'average_rating:desc'
}

client.collections['books'].documents.search(search_parameters)
```
  </template>
</Tabs>

The `facet_by` parameter provides the results grouped by authors. Here is a sample response:

```json
{
  "facet_counts": [
    {
      "field_name": "authors_facet",
      "counts": [
          {
              "count": 2,
              "value": " Käthe Mazur"
          },
          {
              "count": 2,
              "value": "Gretchen Rubin"
          },
          {
              "count": 2,
              "value": "James Patterson"
          },
          {
              "count": 2,
              "value": "Mahatma Gandhi"
          }
      ]
    }
  ],
  "found": 3,
  "hits": [
    {
      "_highlight": {
        "title": "The Angel <mark>Experiment</mark>"
      },
      "document": {
        "authors": [
            "James Patterson"
        ],
        "authors_facet": [
            "James Patterson"
        ],
        "average_rating": 4.08,
        "id": "569",
        "image_url": "https://images.gr-assets.com/books/1339277875m/13152.jpg",
        "publication_year": 2005,
        "publication_year_facet": "2005",
        "ratings_count": 172302,
        "title": "The Angel Experiment"
      }
    },
    ...
  ]
}
```

As you see in the response, by using `facet_by` Typesense can group the results by authors and show you counts of how many of the books in the result set were written by each author. If you facet by an integer field, the result will also show avg, mix, max and sum value of that field in addition to `count`. Let's try that by faceting the search by `ratings_count`. Before running the below search query, make sure that `ratings_count` is a facet field.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
let searchParameters = {
  'q'         : 'experiment',
  'query_by'  : 'title',
  'facet_by' : 'ratings_count',
  'sort_by'   : 'average_rating:desc'
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
$searchParameters = [
  'q'         => 'experiment',
  'query_by'  => 'title',
  'facet_by'  => 'ratings_count',
  'sort_by'   => 'average_rating:desc'
]

$client->collections['books']->documents->search($searchParameters)
```
  </template> 
  <template v-slot:Python>

```python
search_parameters = {
  'q'         : 'experiment',
  'query_by'  : 'title',
  'facet_by' : 'ratings_count',
  'sort_by'   : 'average_rating:desc'
}

client.collections['books'].documents.search(search_parameters)
```
   </template>
   <template v-slot:Ruby>

```ruby
search_parameters = {
  'q'         => 'experiment',
  'query_by'  => 'title',
  'facet_by'  => 'ratings_count',
  'sort_by'   => 'average_rating:desc'
}

client.collections['books'].documents.search(search_parameters)
```
  </template>
</Tabs>

Smaple response:

```json
{
   "facet_counts": [
      {
         "counts": [
            {
               "count": 1,
               "highlighted": "6058",
               "value": "6058"
            },
            {
               "count": 1,
               "highlighted": "28177",
               "value": "28177"
            },
            {
               "count": 1,
               "highlighted": "172302",
               "value": "172302"
            }
         ],
         "field_name": "ratings_count",
         "stats": {
            "avg": 68845.66666666667,
            "max": 172302.0,
            "min": 6058.0,
            "sum": 206537.0
         }
      }
   ],
   "found": 3,
   "hits": [
      {
         "document": {
            "authors": [
               "James Patterson"
            ],
            "authors_facet": [
               "James Patterson"
            ],
            "average_rating": 4.08,
            "id": "569",
            "image_url": "https://images.gr-assets.com/books/1339277875m/13152.jpg",
            "publication_year": 2005,
            "publication_year_facet": "2005",
            "ratings_count": 172302,
            "title": "The Angel Experiment"
         },
      }
      ...
   ]
}
```

Note the additional `stats` field in the result that shows the avg, min, max and sum value for `ratings_count` field. You can limit the number of faceted results using `max_facet_value` parameter. More details on these arguments can be found [here](../../api/documents.html#arguments).
