---
sitemap:
  priority: 0.3
---

# Build A Search Application

Now that you have Typesense [installed and running](./install-typesense.md), we're now ready to create a Typesense collection, index some documents in it and try searching for them.

## Sample Dataset

To follow along, [download](https://dl.typesense.org/datasets/books.jsonl.tar.gz) this small dataset that we've put together for this walk-through.

## Initializing the client
Let's begin by configuring the Typesense client by pointing it to a Typesense node.

- Be sure to use the same API key that you used to start the Typesense server earlier. 
- Or if you're using Typesense Cloud, click on the "Generate API key" button on the cluster page. This will give you a set of hostnames and API keys to use.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

const Typesense = require('typesense')

let client = new Typesense.Client({
  'nodes': [{
    'host': 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
    'port': '8108',      // For Typesense Cloud use 443
    'protocol': 'http'   // For Typesense Cloud use https
  }],
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

  </template>

  <template v-slot:Java>

```java
Client client;

ArrayList<Node> nodes = new ArrayList<>();
/**
  *
  * @param protocol String describing the protocol
  * @param host String describing the host
  * @param port String describing the port
  */
nodes.add(new Node("http","localhost","3001"));

/**
  * 
  * @param nodes List of Nodes
  * @param connectionTimeout Duration in seconds 
  * @param apiKey String describing the apiKey
  */
Configuration configuration = new Configuration(nodes, Duration.ofSeconds(3),"xyz");

this.client = new Client(configuration);

```

  </template>

  <template v-slot:PHP>

```php
use Typesense\Client;

$client = new Client(
  [
    'api_key'         => '<API_KEY>',
    'nodes'           => [
      [
        'host'     => 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
        'port'     => '8108',      // For Typesense Cloud use 443
        'protocol' => 'http',      // For Typesense Cloud use https
      ],
    ],
    'connection_timeout_seconds' => 2,
  ]
);
```

  </template>
  <template v-slot:Python>

```py
import typesense

client = typesense.Client({
  'nodes': [{
    'host': 'localhost', # For Typesense Cloud use xxx.a1.typesense.net
    'port': '8108',      # For Typesense Cloud use 443
    'protocol': 'http'   # For Typesense Cloud use https
  }],
  'api_key': '<API_KEY>',
  'connection_timeout_seconds': 2
})
```

  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  nodes: [{
    host:     'localhost', # For Typesense Cloud use xxx.a1.typesense.net
    port:     8108,        # For Typesense Cloud use 443
    protocol: 'http'       # For Typesense Cloud use https
  }],
  api_key:  '<API_KEY>',
  connection_timeout_seconds: 2
)
```

  </template>
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY='<API_KEY>'
export TYPESENSE_HOST='http://localhost:8108'

# For Typesense Cloud use:
# export TYPESENSE_HOST='https://xxx.a1.typesense.net'
```

  </template>
</Tabs>

That's it - we're now ready to start interacting with the Typesense server.

## Creating a "books" collection
In Typesense, a collection is a group of related documents that is roughly equivalent to a table in a relational database. When we create a collection, we give it a name and describe the fields that will be indexed when a document is added to the collection.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let booksSchema = {
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

client.collections().create(booksSchema)
  .then(function (data) {
    console.log(data)
  })
```

  </template>

  <template v-slot:Java>

```java
ArrayList<Field> fields = new ArrayList<>();
fields.add(new Field().name("title").type("string"));
fields.add(new Field().name("authors").type("string[]"));
fields.add(new Field().name("image_url").type("string");
fields.add(new Field().name("publication_year").type("int32"));
fields.add(new Field().name("ratings_count").type("int32"));
fields.add(new Field().name("average_rating").type("float"));
fields.add(new Field().name("publication_year_facet").type("string").facet(true));
fields.add(new Field().name("authors_facet").type("string[]").facet(true));

CollectionSchema collectionSchema = new CollectionSchema();
collectionSchema.name("books").fields(fields).defaultSortingField("ratings_count");

CollectionResponse collectionResponse = client.collections().create(collectionSchema);

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
]

$client->collections->create($booksSchema)
```

  </template>
  <template v-slot:Python>

```py
import typesense

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

client.collections.create(books_schema)
```

  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

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

client.collections.create(books_schema)
```

  </template>
  <template v-slot:Shell>

```bash
curl "${TYPESENSE_HOST}/collections" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "books",
        "fields": [
          {"name": "title", "type": "string" },
          {"name": "authors", "type": "string[]" },
          {"name": "image_url", "type": "string" },

          {"name": "publication_year", "type": "int32" },
          {"name": "ratings_count", "type": "int32" },
          {"name": "average_rating", "type": "float" },

          {"name": "authors_facet", "type": "string[]", "facet": true },
          {"name": "publication_year_facet", "type": "string", "facet": true }
        ],
        "default_sorting_field": "ratings_count"
      }'
```

  </template>
</Tabs>

For each field, we define its `name, type` and whether it's a `facet` field. A facet field allows us to cluster the search results into categories and let us drill into each of those categories. We will be seeing faceted results in action at the end of this guide.

We also define a `default_sorting_field` that determines how the results must be sorted when no `sort_by` clause is provided. In this case, books that have more ratings will be ranked higher.

## Adding books to the collection

We're now ready to index some books into the collection we just created.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
var fs = require('fs');
var readline = require('readline');

readline.createInterface({
    input: fs.createReadStream('/tmp/books.jsonl'),
    terminal: false
}).on('line', function(line) {
   let bookDocument = JSON.parse(line);
   client.collections('books').documents().create(bookDocument)
});

})
```

  </template>
  <template v-slot:Java>

```java
File myObj = new File("books.jsonl");
Scanner myReader = new Scanner(myObj);
while (myReader.hasNextLine()) {
    String data = myReader.nextLine();
    client.collections("books").documents().create(data);
}
```

  </template>

  <template v-slot:PHP>

```php
$booksData = file_get_contents('/tmp/books.jsonl')
$booksStrs = explode('\n', $booksData)

foreach($booksStrs as $bookStr) {
  $book = json_decode($bookStr);
  $client->collections['books']->documents->create($book)
}
```

  </template>
  <template v-slot:Python>

```py
import json
import typesense

with open('/tmp/books.jsonl') as infile:
  for json_line in infile:
    book_document = json.loads(json_line)
    client.collections['books'].documents.create(book_document)
```

  </template>
  <template v-slot:Ruby>

```rb
require 'rubygems'
require 'json'
require 'typesense'

File.readlines('/tmp/books.jsonl').each do |json_line|
  book_document = JSON.parse(json_line)
  client.collections['books'].documents.create(book_document)
end
```

  </template>
  <template v-slot:Shell>

```bash
#!/bin/bash
input="/tmp/books.jsonl"
while IFS= read -r line
do
  curl "${TYPESENSE_HOST}/collections/books/documents" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d "$line"
done < "$input"
```

  </template>
</Tabs>

## Searching for books
We will start with a really simple search query - let's search for `harry potter` and ask Typesense to rank books that have more ratings higher in the results.


<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchParameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
}

client.collections('books')
  .documents()
  .search(searchParameters)
  .then(function (searchResults) {
    console.log(searchResults)
  })
```

  </template>
  <template v-slot:Java>

```java
SearchParameters searchParameters = new SearchParameters()
                                                .query("harry")
                                                .queryBy("title")
                                                .sortBy("ratings_count:desc");
SearchResult searchResult = client.collections("books").documents().search(searchParameters);
```

  </template>
  <template v-slot:PHP>

```php
$searchParameters = [
  'q'         => 'harry potter',
  'query_by'  => 'title',
  'sort_by'   => 'ratings_count:desc'
]

$client->collections['books']->documents->search($searchParameters)
}
```

  </template>
  <template v-slot:Python>

```py
search_parameters = {
  'q'         : 'harry',
  'query_by'  : 'title',
  'sort_by'   : 'ratings_count:desc'
}

client.collections['books'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Ruby>

```rb
search_parameters = {
  'q'         => 'harry potter',
  'query_by'  => 'title',
  'sort_by'   => 'ratings_count:desc'
}

client.collections['books'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"${TYPESENSE_HOST}/collections/books/documents/search\
?q=harry+potter&query_by=title&sort_by=ratings_count:desc"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

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

  </template>
</Tabs>


In addition to returning the matching documents, Typesense also highlights where the query terms appear in a document via the `highlight` property.

Want to actually see newest `harry potter` books returned first? No problem, we can change the `sort_by` clause to `publication_year:desc`:

## Filtering results
Now, let's tweak our query to only fetch books that are published before the year 1998. To do that, we just have to add a `filter_by` clause to our query:

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
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
  <template v-slot:Java>

```java
SearchParameters searchParameters = new SearchParameters()
                                                .query("harry")
                                                .queryBy("title")
                                                .filterBy("publication_year:<1998")
                                                .sortBy("ratings_count:desc");
SearchResult searchResult = client.collections("books").documents().search(searchParameters);
```

  </template>

  <template v-slot:PHP>

```php
$searchParameters = [
  'q'         => 'harry potter',
  'query_by'  => 'title',
  'filter_by' => 'publication_year:<1998',
  'sort_by'   => 'publication_year:desc'
]

$client->collections['books']->documents->search($searchParameters)
```

  </template>
  <template v-slot:Python>

```py
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

```rb
search_parameters = {
  'q'         => 'harry potter',
  'query_by'  => 'title',
  'filter_by' => 'publication_year:<1998',
  'sort_by'   => 'publication_year:desc'
}

client.collections['books'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"${TYPESENSE_HOST}/collections/books/documents/search\
?q=harry+potter&query_by=title&sort_by=publication_year:desc\
&filter_by=publication_year:<1998"
```

  </template>
</Tabs>


#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

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

  </template>
</Tabs>


## Faceting
Let's facet the search results by the authors field to see how that works. Let's also use this example to see how Typesense handles typographic errors. Let's search for `experyment` (notice the typo!).


<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let searchParameters = {
  'q'         : 'experyment',
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

  <template v-slot:Java>

```java
SearchParameters searchParameters = new SearchParameters()
                                                .query("experyment")
                                                .queryBy("title")
                                                .facetBy("authors_facet")
                                                .sortBy("average_rating:desc");
SearchResult searchResult = client.collections("books").documents().search(searchParameters);
```

  </template>

  <template v-slot:PHP>

```php
$searchParameters = [
  'q'         => 'experyment',
  'query_by'  => 'title',
  'facet_by'  => 'authors_facet',
  'sort_by'   => 'average_rating:desc'
]

$client->collections['books']->documents->search($searchParameters)
```

  </template>
  <template v-slot:Python>

```py
search_parameters = {
  'q'         : 'experyment',
  'query_by'  : 'title',
  'facet_by' : 'authors_facet',
  'sort_by'   : 'average_rating:desc'
}

client.collections['books'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Ruby>

```rb
search_parameters = {
  'q'         => 'experyment',
  'query_by'  => 'title',
  'facet_by'  => 'authors_facet',
  'sort_by'   => 'average_rating:desc'
}

client.collections['books'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"${TYPESENSE_HOST}/collections/books/documents/search\
?q=experyment&query_by=title&sort_by=average_rating:desc\
&facet_by=authors_facet"
```

  </template>
</Tabs>

As we can see in the result below, Typesense handled the typographic error gracefully and fetched the results correctly. The `facet_by` clause also gives us a neat break-down of the number of books written by each author in the returned search results.

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

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

  </template>
</Tabs>

We've come to the end of our little walk-through. For a detailed dive into Typesense, refer to our [API documentation](../api/README.md).

:::tip
We used a single node in this example, but Typesense can also run in a clustered mode. See the [high availability](./high-availability.md) section for more details.
:::
