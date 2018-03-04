---
layout: page
title: Typesense Guide
nav_label: guide
permalink: /guide/
---

<div class="row no-gutters">
  <div id="doc-col" class="col-md-8">
    <p>Let's begin by installing Typesense, indexing some documents and exploring the data with some search queries.</p>

    <p>For a detailed dive into the Typesense API, refer to our <a href="/api">API documentation</a>.</p>

    <h3 id="install-typesense">Installing Typesense</h3>

    <p>We have pre-built binaries available for Linux (X86_64) and Mac OS X from our
      <a href="/downloads">downloads page</a>.</p>

    <p>We also publish official Docker images for Typesense on
      <a href="https://hub.docker.com/r/typesense/typesense/">Docker hub</a>.</p>

    <h3 id="start-typesense">Starting the Typesense server</h3>

    <p>You can start Typesense with minimal options like this:</p>

    {% code_block run-binary %}
    ```shell
      mkdir /tmp/typesense-data
      ./typesense-server --data-dir=/tmp/typesense-data --api-key=$TYPESENSE_API_KEY
    ```
    {% endcode_block %}

    <p>On Docker, you can run Typesense like this:</p>

    {% code_block run-docker %}
    ```shell
      mkdir /tmp/typesense-data
      docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:0.8.0 \
        --data-dir /data --api-key=$TYPESENSE_API_KEY
    ```
    {% endcode_block %}

    <h4 id="typesense-arguments">Server arguments</h4>

    <table class="table table-striped">
      <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>data-dir</td>
        <td>true</td>
        <td>Path to the directory where data will be stored on disk.</td>
      </tr>
      <tr>
        <td>api-key</td>
        <td>true</td>
        <td>
          API key that allows all operations.
        </td>
      </tr>
      <tr>
        <td>search-only-api-key</td>
        <td>false</td>
        <td>
          API key that allows only searches. Use this to define a separate key for making requests directly from
          Javascript.
        </td>
      </tr>
      <tr>
        <td>listen-address</td>
        <td>false</td>
        <td>
          Address to which Typesense server binds. Default: <code>0.0.0.0</code>
        </td>
      </tr>
      <tr>
        <td>listen-port</td>
        <td>false</td>
        <td>
          Port on which Typesense server listens.. Default: <code>8108</code>
        </td>
      </tr>
      <tr>
        <td>master</td>
        <td>false</td>
        <td>
          Starts the server as a read-only replica by defining the master Typesense server's address in <br />
          <code>http(s)://&lt;master_address&gt;:&lt;master_port&gt;</code> format.
        </td>
      </tr>
      <tr>
        <td>ssl-certificate</td>
        <td>false</td>
        <td>
          Path to the SSL certificate file. You must also define <code>ssl-certificate-key</code> to enable HTTPS.
        </td>
      </tr>
      <tr>
        <td>ssl-certificate-key</td>
        <td>false</td>
        <td>
          Path to the SSL certificate key file. You must also define <code>ssl-certificate</code> to enable HTTPS.
        </td>
      </tr>
      <tr>
        <td>log-dir</td>
        <td>false</td>
        <td>
          By default, Typesense logs to stdout and stderr. To enable logging to a file, provide a path to a
          logging directory.
        </td>
      </tr>
    </table>


    <h3 id="install-client">Installing a client</h3>

    <p>At the moment, we have clients for Javascript, Python, and Ruby. </p>
    <p>We recommend that you use our API client if it's available for your language. It's also easy to
    interact with Typesense through its simple, RESTful HTTP API.</p>

    {% code_block install %}
    ```ruby
    gem install typesense
    ```

    ```python
    pip install typesense
    ```
    {% endcode_block %}

    <h3 id="example-application">Example application</h3>

    <p>At this point, we are all set to start using Typesense. We will create a Typesense collection, index
      some documents in it and try searching for them.</p>

    <p>To follow along, <a href="https://dl.typesense.org/datasets/books.jsonl.tar.gz">download</a> this small dataset
      that we've put together for this walk-through.</p>

    <h4 id="init-client">Initializing the client</h4>

    <p>Let's begin by configuring the Typesense client by pointing it to the Typesense master node.</p>

    <p>Be sure to use the same API key that you used to start the Typesense server earlier.</p>

    {% code_block init-client %}
    ```ruby
      require 'typesense'

      Typesense.configure do |config|
        config.master_node = {
          host:     'localhost',
          port:     8108,
          protocol: 'http',
          api_key:  'abcd'
        }
      end
    ```
    ```python
      import typesense

      typesense.master_node = typesense.Node(
        host='localhost',
        port=8108,
        protocol='http',
        api_key='<API_KEY>'
      )
    ```
    ```shell
      export TYPESENSE_API_KEY='<API_KEY>'
      export TYPESENSE_MASTER='http://localhost:8108'
    ```
    {% endcode_block %}

    <p>That's it - we're now ready to start interacting with the Typesense server.</p>

    <h4 id="create-collection">Creating a "books" collection</h4>

    <p>In Typesense, a collection is a group of related documents that is roughly equivalent to a table in a relational database.
      When we create a collection, we give it a name and describe the fields that will be indexed when a document is
      added to the collection.</p>

    {% code_block create-collection %}
    ```ruby
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

      Typesense::Collections.create(books_schema)
    ```

    ```python
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

      typesense.Collections.create(schema)
    ```

    ```shell
      curl "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
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
    {% endcode_block %}

    <p>For each field, we define its <code>name</code>, <code>type</code> and whether it's a <code>facet</code> field.
    A facet field allows us to cluster the search results into categories and let us drill into each of those categories.
    We will be seeing faceted results in action at the end of this guide.</p>

    <p>We also define a <code>default_sorting_field</code> that determines how the results must be sorted when no
    <code>sort_by</code> clause is provided. In this case, books that have more ratings will be ranked higher.</p>

    <h4 id="index-documents">Adding books to the collection</h4>

    <p>We're now ready to index some books into the collection we just created.</p>

    {% code_block index-documents %}
    ```ruby
      require 'rubygems'
      require 'json'
      require 'typesense'

      File.readlines('/tmp/books.jsonl').each do |json_line|
        book_document = JSON.parse(json_line)
        Typesense::Documents.create('books', book_document)
      end
      ```
    ```python
      import json
      import typesense

      with open('/tmp/books.jsonl') as infile:
        for json_line in infile:
          book_document = json.loads(json_line)
          typesense.Documents.create('books', book_document)
    ```
    ```shell
        #!/bin/bash
        input="/tmp/books.jsonl"
        while IFS= read -r line
        do
          curl "$TYPESENSE_MASTER/collections/books/documents" -X POST \
          -H "Content-Type: application/json" \
          -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
          -d "$line"
        done < "$input"
    ```
    {% endcode_block %}

    <h4 id="search-collection">Searching for books</h4>

    <p>We will start with a really simple search query - let's search for <code>harry potter</code> and ask Typesense
    to rank books that have more ratings higher in the results.</p>

    {% code_block search-collection-1 %}
    ```ruby
      search_parameters = {
        'q'         => 'harry potter',
        'query_by'  => 'title',
        'sort_by'   => 'ratings_count:desc'
      }

      Typesense::Documents.search('books', search_parameters)
    ```

    ```python
      search_parameters = {
        'q'         : 'harry',
        'query_by'  : 'title',
        'sort_by'   : 'ratings_count:desc'
      }

      typesense.Documents.search('books', search_parameters)
    ```

    ```shell
      curl -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
      "$TYPESENSE_MASTER/collections/books/documents/search\
      ?q=harry+potter&query_by=title&sort_by=ratings_count:desc"
    ```
    {% endcode_block %}

    <h5>Sample response</h5>

    {% code_block search-collection-1-response %}
      ```json
      {
        "facet_counts": [],
        "found": 62,
        "hits": [
          {
            "highlight": {
              "title": "<mark>Harry</mark> <mark>Potter</mark> and the Philosopher's Stone"
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
    {% endcode_block %}

    <p>In addition to returning the matching documents, Typesense also highlights where the query terms appear
      in a document via the <code>highlight</code> property.</p>

    <p>Want to actually see newest <code>harry potter</code> books returned first? No problem, we can change the
      <code>sort_by</code> clause to <code>publication_year:desc</code>:</p>

    {% code_block search-collection-2 %}
    ```ruby
      search_parameters = {
        'q'         => 'harry potter',
        'query_by'  => 'title',
        'sort_by'   => 'publication_year:desc'
      }

      Typesense::Documents.search('books', search_parameters)
    ```

    ```python
      search_parameters = {
        'q'         : 'harry',
        'query_by'  : 'title',
        'sort_by'   : 'publication_year:desc'
      }

      typesense.Documents.search('books', search_parameters)
    ```

    ```shell
      curl -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
      "$TYPESENSE_MASTER/collections/books/documents/search\
      ?q=harry+potter&query_by=title&sort_by=publication_year:desc"
    ```
    {% endcode_block %}

    <h5>Sample response</h5>

    {% code_block search-collection-2-response %}
      ```json
      {
        "facet_counts": [],
        "found": 62,
        "hits": [
        {
          "highlight": {
            "title": "<mark>Harry</mark> <mark>Potter</mark> and the Cursed Child..."
          },
          "document": {
            "authors": [
              "John Tiffany", "Jack Thorne", "J.K. Rowling"
            ],
            "authors_facet": [
              "John Tiffany", "Jack Thorne", "J.K. Rowling"
            ],
            "average_rating": 3.75,
            "id": "279",
            "image_url": "https://images.gr-assets.com/books/1470082995m/29056083.jpg",
            "publication_year": 2016,
            "publication_year_facet": "2016",
            "ratings_count": 270603,
            "title": "Harry Potter and the Cursed Child, Parts One and Two"
          }
        },
        ...
        ]
      }
      ```
    {% endcode_block %}

    <p>Now, let's tweak our query to only fetch books that are published before the year <code>1998</code>.
       To do that, we just have to add a <code>filter_by</code> clause to our query:
    </p>

    {% code_block search-collection-3 %}
    ```ruby
      search_parameters = {
        'q'         => 'harry potter',
        'query_by'  => 'title',
        'filter_by' => 'publication_year:<1998',
        'sort_by'   => 'publication_year:desc'
      }

      Typesense::Documents.search('books', search_parameters)
    ```

    ```python
      search_parameters = {
        'q'         : 'harry',
        'query_by'  : 'title',
        'filter_by' : 'publication_year:<1998',
        'sort_by'   : 'publication_year:desc'
      }

      typesense.Documents.search('books', search_parameters)
    ```

    ```shell
      curl -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
      "$TYPESENSE_MASTER/collections/books/documents/search\
      ?q=harry+potter&query_by=title&sort_by=publication_year:desc\
      &filter_by=publication_year:<1998"
    ```
    {% endcode_block %}

    <h5>Sample response</h5>

    {% code_block search-collection-3-response %}
      ```json
      {
        "facet_counts": [],
        "found": 24,
        "hits": [
          {
            "highlight": {
              "title": "<mark>Harry</mark> <mark>Potter</mark> and the Philosopher's Stone"
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
    {% endcode_block %}

    <p>Finally, let's see how Typesense handles typographic errors. Let's search for <code>experyment</code> - noticed the
    typo there? We will also facet the search results by the authors field to see how that works.</p>

    {% code_block search-collection-4 %}
    ```ruby
      search_parameters = {
        'q'         => 'experyment',
        'query_by'  => 'title',
        'facet_by'  => 'authors_facet',
        'sort_by'   => 'average_rating:desc'
      }

      Typesense::Documents.search('books', search_parameters)
    ```

    ```python
      search_parameters = {
        'q'         : 'harry',
        'query_by'  : 'title',
        'facet_by' : 'authors_facet',
        'sort_by'   : 'average_rating:desc'
      }

      typesense.Documents.search('books', search_parameters)
    ```

    ```shell
      curl -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
      "$TYPESENSE_MASTER/collections/books/documents/search\
      ?q=harry+potter&query_by=title&sort_by=average_rating:desc\
      &facet_by=authors_facet"
    ```
    {% endcode_block %}

    <p>As we can see in the result below, Typesense handled the typographic error gracefully and fetched the results
      correctly. The <code>facet_by</code> clause also gives us a neat break-down of the number of books written
    by each author in the returned search results.</p>

    <h5>Sample response</h5>

    {% code_block search-collection-4-response %}
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
    {% endcode_block %}

    <p>We've come to the end of our little example. For a detailed dive into Typesense,
      refer to our <a href="/api">API documentation</a>.</p>

    <h3 id="ranking-relevance">Ranking and relevance</h3>

    <p>Typesense ranks search results using a simple tie-breaking algorithm that relies on two components:</p>

    <p>
      <ol>
        <li>String similarity.</li>
        <li>User-defined <code>sort_by</code> numerical fields.</li>
      </ol>
    </p>

    <p>Typesense computes a string similarity score based on how much a search query overlaps with the
      fields of a given document. Typographic errors are also taken into account here. Let's see how.</p>

    <p>When there is a typo in the query, or during prefix search, multiple tokens could match a given token in the query.
    For e.g. both “john” and “joan” are 1-typo away from “jofn”. Similarly, in the case of a prefix search,
    both “apple” and “apply” would match “app”. In such scenarios, Typesense would use the value of the
    <code>default_sorting_field</code> field to decide whether documents containing "john" or "joan" should be ranked first.
    </p>

    <p>When multiple documents share the same string similarity score, user-defined numerical fields are used to break the tie.
      You can specify upto two such numerical fields.</p>

    <p>For example, let's say that we're searching for books with a query like <code>short story</code>.
      If there are multiple books containing these exact words, then all those documents would have the same
      string similarity score.</p>

    <p>To break the tie, we could specify upto two additional <code>sort_by</code> fields. For instance, we could say,
      <code>sort_by=average_rating:DESC,publication_year:DESC</code>. This would sort the results in the following manner:</p>

    <p>
      <ol>
        <li>All matching records are sorted by string similarity score.</li>
        <li>If any two records share the same string similarity score, sort them by their average rating.</li>
        <li>If there is still a tie, sort the records by year of publication.</li>
      </ol>
    </p>

    <h3 id="read-only-replica">Read-only replica</h3>

    <p>You can run the Typesense server as a read-only replica that asynchronously pulls data from a master Typesense server.</p>

    <p>To start the server as a read-only replica, specify the master's address via the <code>--master</code>
      argument: </p>

    <p><code>--master=http(s)://&lt;master_address&gt;:&lt;master_port&gt;</code></p>

    <p><strong>NOTE:</strong> The master Typesense server maintains a replication log for 24 hours. If you are pointing the
    replica to a master instance that has been running for greater than 24 hours, you need to first stop the master, take
      a copy of the data directory and then then start the replica server by pointing to this backup data directory.</p>

    <p><strong>Client library behavior</strong></p>

    <p>Client libraries will send all writes to the master. Reads will first be sent to the master and if the server
    returns a HTTP 500 or if the connection times out, the read will be sent in a round-robin fashion to the read replicas
    configured.</p>

  </div>

  <div class="col-md-1 row no-gutters"></div>

  <div class="col-md-2 row no-gutters">
    <nav id="navbar-docs" class="position-fixed navbar navbar-light">
      <nav class="nav nav-pills flex-column">
        <a class="nav-link" href="#install-typesense">Installing Typesense</a>
        <a class="nav-link" href="#start-typesense">Starting Typesense</a>
        <a class="nav-link" href="#install-client">Installing a client</a>
        <a class="nav-link" href="#example-application">Example application</a>
        <nav class="nav nav-pills flex-column">
          <a class="nav-link ml-3 my-1" href="#init-client">Initializing the client</a>
          <a class="nav-link ml-3 my-1" href="#create-collection">Creating a books collection</a>
          <a class="nav-link ml-3 my-1" href="#index-documents">Adding some books</a>
          <a class="nav-link ml-3 my-1" href="#search-collection">Searching for books</a>
        </nav>
        <a class="nav-link" href="#ranking-relevance">Ranking &amp; relevance</a>
        <a class="nav-link" href="#read-only-replica">Read-only replica</a>
      </nav>
    </nav>
  </div>
</div>

<div class="row">
  <div class="col-md-8">

  </div>
</div>