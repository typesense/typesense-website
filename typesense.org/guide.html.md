---
layout: page
title: Getting Started
nav_label: guide
permalink: /guide/
---

<div class="row no-gutters">
  <div id="doc-col" class="col-md-8">
    <p>Let's get you started with a quick guide that will show you how to install Typesense, index some documents
    and explore the data with some search queries.</p>

    <p>If you are looking for a detailed dive into Typesense, refer to our <a href="/api">API documentation</a>.</p>

    <h3 id="install-typesense">Install Typesense</h3>

    <p>We have pre-built binaries available for Linux (X86_64) and Mac OS X from our
      <a href="/downloads">downloads page</a>.</p>

    <p>We also publish official Docker images for Typesense on
      <a href="https://hub.docker.com/r/typesense/typesense/">Docker hub</a>.</p>

    <h3 id="install-typesense">Starting the Typesense server</h3>

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


    <h3 id="install-client">Install a client</h3>

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

    <h3 id="sample-application">Sample application</h3>

    <p>At this point, we are all set to start using Typesense. We will create a Typesense collection, index
      some documents in it and try searching for them.</p>

    <p>To follow along, download this small dataset that we've put together for this walk-through.</p>

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
          {'name' => 'original_title', 'type' => 'string' },
          {'name' => 'author_names', 'type' => 'string[]' },
          {'name' => 'image_url', 'type' => 'string' },

          {'name' => 'original_publication_year', 'type' => 'int32' },
          {'name' => 'ratings_count', 'type' => 'int32' },
          {'name' => 'average_rating', 'type' => 'float' },

          {'name' => 'authors', 'type' => 'string[]', 'facet' => true },
          {'name' => 'publication_year_str', 'type' => 'string', 'facet' => true }
        ],
        'token_ranking_field' => 'ratings_count'
      }

      Typesense::Collections.create(books_schema)
    ```

    ```python
      import typesense

      books_schema = {
        'name': 'books',
        'fields': [
          {'name': 'original_title', 'type': 'string' },
          {'name': 'author_names', 'type': 'string[]' },
          {'name': 'authors', 'type': 'string[]', 'facet': True },
          {'name': 'original_publication_year', 'type': 'int32' },
          {'name': 'publication_year_str', 'type': 'string', 'facet': True },
          {'name': 'ratings_count', 'type': 'int32' },
          {'name': 'average_rating', 'type': 'float' },
          {'name': 'image_url', 'type': 'string' }
        ],
        'token_ranking_field': 'ratings_count'
      }

      typesense.Collections.create(schema)
    ```
    {% endcode_block %}

    <p>For each field, we define its <code>name</code>, <code>type</code> and whether it's a <code>facet</code> field.
    A facet field allows us to cluster the search results into categories and let us drill into each of those categories.
    We will be seeing faceted results in action in just a bit.</p>

    <h4 id="index-documents">Adding books to the collection</h4>

    <p>We're now ready to index some books into the collection we just created.</p>

    {% code_block index-documents %}
    ```ruby
      # TODO
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
      curl "$TYPESENSE_MASTER/collections/companies/books" -X POST \
            -H "Content-Type: application/json" \
            -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
            -d '{
              "id": "124",
              "company_name": "Stark Industries",
              "num_employees": 5215,
              "country": "USA"
            }'
    ```
    {% endcode_block %}

    <h4 id="search-collection">Searching for books</h4>

    <p>We will start with a really simple search query - let's search for <code>harry potter</code> and ask Typesense
    to rank books that have a better rating higher in the results.</p>

    {% code_block search-collection %}
    ```ruby
      search_parameters = {
        'q'         => 'harry potter',
        'query_by'  => 'original_title',
        'sort_by'   => 'average_rating:desc'
      }

      Typesense::Documents.search('books', search_parameters)
    ```

    ```python
      search_parameters = {
        'q'         : 'harry',
        'query_by'  : 'original_title',
        'sort_by'   : 'average_rating:desc'
      }

      typesense.Documents.search('books', search_parameters)
    ```

    ```shell
      curl -H "X-TYPESENSE-API-KEY: $TYPESENSE_API_KEY" \
      "$TYPESENSE_MASTER/collections/books/documents/search\
      ?q=harry+potter&query_by=original_title&sort_by=average_rating:desc"
    ```
    {% endcode_block %}

  </div>

  <div class="col-md-1 row no-gutters"></div>

  <div class="col-md-2 row no-gutters">
    <nav id="navbar-docs" class="position-fixed navbar navbar-light">
      <nav class="nav nav-pills flex-column">
        <a class="nav-link" href="#install-typesense">Install Typesense</a>
        <a class="nav-link" href="#install-client">Install a client</a>
        <a class="nav-link" href="#sample-application">Sample application</a>
      </nav>
    </nav>
  </div>
</div>

<div class="row">
  <div class="col-md-8">

  </div>
</div>