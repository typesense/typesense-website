---
layout: page
title: API Documentation
nav_label: api
permalink: /api/
---

<div class="row no-gutters">
    <div id="doc-col" class="col-md-8">
      <h3 id="introduction">Introduction</h3>
      <p>Welcome to the Typesense API documentation.</p>

      <p>This documentation itself is open source. Please leave your feedback as issues in the GitHub repo or
        fork it to contribute changes!</p>

      <h3 id="installation">Installation</h3>

      <p>At the moment, we have API clients for Javascript, Python, and Ruby. </p>
      <p>We recommend that you use our API client library if it is available for your language.</p>

      {% code_block install %}
        ```ruby
           gem install typesense
        ```

        ```python
           pip install typesense
        ```
      {% endcode_block %}

      <h3 id="authentication">Authentication</h3>

      {% code_block authenticate %}
      ```ruby
        Typesense.configure do |config|
          config.master_node = {
            host:     'localhost',
            port:     8108,
            protocol: 'http',
            api_key:  'abcd'
          }

          config.read_replica_nodes = [
            {
              host:     'read_replica_1',
              port:     8108,
              protocol: 'http',
              api_key:  'abcd'
            },
            {
              host:     'read_replica_2',
              port:     8108,
              protocol: 'http',
              api_key:  'abcd'
            }
          ]

          config.timeout = 10
        end
      ```

      ```python
        import typesense

        typesense.master_node = typesense.Node(
          host='localhost',
          port=8108,
          protocol='http',
          api_key='abcd'
        )
        typesense.read_replica_nodes = [
          typesense.Node(
            host='localhost',
            port=9108,
            protocol='http',
            api_key='abcd'
          )
        ]
      ```

      ```shell
          # API authentication is done via the `X-TYPESENSE-API-KEY` HTTP header.
          curl -H "X-TYPESENSE-API-KEY: abcd" "http://localhost:8108/collections"

          # For JSONP requests (since custom headers can't be set on JSONP requests)
          curl "http://localhost:8108/collections?x-typesense-api-key=abcd"
      ```
      {% endcode_block %}

      <h3 id="usage">Usage</h3>

      <p>In Typesense, a group of documents is called a <code>collection</code>. A <code>collection</code> is roughly
        equivalent to a table in a relational database.
      </p>

      <h4 id="create-collection">Create a collection</h4>

      <p>When a <code>collection</code> is created, we give it a name and describe the fields that will be indexed
        from the documents that are added to the <code>collection</code>.</p>

      <p>
        Your documents can contain other fields not mentioned in the collection's schema - they will be stored but
        not indexed.
      </p>

      {% code_block create-collection %}
      ```ruby
        schema = {
          'name'      => 'companies',
          'fields'    => [
            {
              'name'  => 'company_name',
              'type'  => 'string',
              'facet' => false
            },
            {
              'name'  => 'num_employees',
              'type'  => 'int32',
              'facet' => false
            },
            {
              'name'  => 'country',
              'type'  => 'string',
              'facet' => true
            }
          ],
          'token_ranking_field' => 'num_employees'
        }

        Typesense::Collections.create(schema)
      ```
      ```python
        schema = {
          'name': 'companies',
          'fields': [
            {
              'name'  :  'company_name',
              'type'  :  'string',
              'facet' :  False
            },
            {
              'name'  :  'num_employees',
              'type'  :  'int32',
              'facet' :  False
            },
            {
              'name'  :  'country',
              'type'  :  'string',
              'facet' :  True
            }
          ],
          'token_ranking_field': 'num_employees'
        }

        typesense.Collections.create(schema)
      ```
      ```shell
        curl "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
               -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{\
                 "name": "companies",
                 "fields": [
                   {"name": "company_name", "type": "string" },
                   {"name": "num_employees", "type": "int32" },
                   {"name": "country", "type": "string", "facet": true }
                 ],
                 "token_ranking_field": "num_employees"
               }'
      ```
      {% endcode_block %}


      <h5>Sample response</h5>

      {% code_block create-collection-response %}
      ```json
        {
          "name": "companies",
          "num_documents": 0,
          "fields": [
            {"name": "company_name", "type": "string" },
            {"name": "num_employees", "type": "int32" },
            {"name": "country", "type": "string", "facet": true }
          ],
          "token_ranking_field": "num_employees"
        }
      ```
      {% endcode_block %}

      <h5>Definition</h5>
      <p><code>POST ${TYPESENSE_HOST}/collections</code></p>

      <h5>Arguments</h5>

      <table class="table table-striped">
        <tr>
          <th>Parameter</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>name</td>
          <td>yes</td>
          <td>Name of the collection you wish to create.</td>
        </tr>
        <tr>
          <td>fields</td>
          <td>yes</td>
          <td>
            Definition of fields that you wish to index for querying, filtering and faceting. <br /><br />
            A field of type <code>string</code> or <code>string[]</code> can be declared as a faceted field by
            setting its <code>facet</code> property to <code>true</code>. Faceted fields are indexed
            <strong>verbatim</strong> without any tokenization or preprocessing.
          </td>
        </tr>
        <tr>
          <td>token_ranking_field</td>
          <td>no</td>
          <td>
            Name of a numerical field whose value will be used to rank the tokens that match a given token in the
            query. <br /><br />
            When there is a typo in the query, or during prefix search, multiple tokens could match a given token
            in the query. For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in the case of a
            prefix search, both "apple" and "apply" would match "app".<br /><br />
            If this field is not defined, tokens are ordered based on their frequency of occurrence in the collection.
            <strong>Strongly recommended for instant search and autocomplete use cases.</strong>
          </td>
        </tr>
      </table>

      <h5>Supported search field types</h5>

      <p>Typesense allows you to index the following types of fields:</p>

      <table class="table table-striped">
        <tr><td><code>string</code></td></tr>
        <tr><td><code>int32</code></td></tr>
        <tr><td><code>int64</code></td></tr>
        <tr><td><code>float</code></td></tr>
        <tr><td><code>bool</code></td></tr>
      </table>

      <p>You can define an array or multi-valued field by suffixing a <code>[]</code> at the end:</p>

      <table class="table table-striped">
        <tr><td><code>string[]</code></td></tr>
        <tr><td><code>int32[]</code></td></tr>
        <tr><td><code>int64[]</code></td></tr>
        <tr><td><code>float[]</code></td></tr>
        <tr><td><code>bool[]</code></td></tr>
      </table>


      <h4 id="index-document">Index a document</h4>

      <p>A document to be indexed in a given collection must conform to the schema of the collection.</p>

      <p>
        If the document contains an `id` field of type `string`, Typesense would use that field as the identifier for the
        document. Otherwise, Typesense would assign an identifier of its choice to the document.
      </p>

      {% code_block index-document %}
        ```ruby
        document = {
          'id'            => '124',
          'company_name'  => 'Stark Industries',
          'num_employees' => 5215,
          'country'       => 'USA'
        }

        Typesense::Documents.create('companies', document)
        ```

        ```python
        document = {
          'id': '124',
          'company_name': 'Stark Industries',
          'num_employees': 5215,
          'country': 'USA'
        }

        typesense.Documents.create('companies', document)
        ```
        ```shell
        $ curl "http://localhost:8108/collections/companies/documents" -X POST \
                -H "Content-Type: application/json" \
                -H "X-TYPESENSE-API-KEY: abcd" \
                -d '{
                  "id": "124",
                  "company_name": "Stark Industries",
                  "num_employees": 5215,
                  "country": "USA"
                }'
        ```
      {% endcode_block %}

      <h5>Sample Response</h5>

      {% code_block index-document-response %}
      ```json
      {
        "id": "124",
        "company_name": "Stark Industries",
        "num_employees": 5215,
        "country": "USA"
      }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>POST ${TYPESENSE_HOST}/collections/:collection/documents</code></p>

      <h4 id="search-collection">Search a collection</h4>

      <p>In Typesense, a search consists of a query against one or more text fields and a list of filters against numerical or
        facet fields. You can also sort and facet your results.</p>

      <p>Due to performance reasons, Typesense limits searches to a maximum of 500 results.</p>

      {% code_block search-collection %}
      ```ruby
        search_parameters = {
          'q'         => 'stark',
          'query_by'  => 'company_name',
          'filter_by' => 'num_employees:>100',
          'sort_by'   => 'num_employees:desc'
        }

        Typesense::Documents.search('companies', search_parameters)
      ```

      ```python
        search_parameters = {
          'q'         : 'stark',
          'query_by'  : 'company_name',
          'filter_by' : 'num_employees:>100',
          'sort_by'   : 'num_employees:desc'
        }

        typesense.Documents.search('companies', search_parameters)
      ```

      ```shell
        curl -H "X-TYPESENSE-API-KEY: abcd" \
            "http://localhost:8108/collections/companies/documents/search\
            ?q=stark&query_by=company_name&filter_by=num_employees:>100\
            &sort_by=num_employees:desc"
      ```
      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block search-collection-response %}
      ```json
        {
          "facet_counts": [],
          "found": 1,
          "took_ms": 1,
          "hits": [
            {
              "_highlight": {
                "description": "<mark>Stark</mark> Industries"
              },
              "document": {
                "id": "124",
                "company_name": "Stark Industries",
                "num_employees": 5215,
                "country": "USA"
              }
            }
          ]
        }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>GET ${TYPESENSE_HOST}/collections/:collection/documents/search</code></p>

      <h5>Arguments</h5>

      <table class="table table-striped">
        <tr>
          <th>Parameter</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>q</td>
          <td>true</td>
          <td>The query text to search for in the collection.</td>
        </tr>
        <tr>
          <td>query_by</td>
          <td>true</td>
          <td>A list of `string` or `string[]` fields that should be queried against. Separate multiple fields with a comma.
            <br /><br />
            The order of the fields is important: a matching record on a field higher in the list is considered more
            relevant than a record matched on a field later in the list.</td>
        </tr>
        <tr>
          <td>filter_by</td>
          <td>false</td>
          <td>Filter conditions for refining your search results. Separate multiple conditions
            with <code>&&</code>. <br /><br />
            E.g. <code>num_employees:<100 && country:[USA, UK]</code></td>
        </tr>
        <tr>
          <td>sort_by</td>
          <td>false</td>
          <td>A list of numerical fields and their corresponding sort orders that will be used for ordering your results.
            Separate multiple fields with a comma. Currently, upto 2 sort fields can be specified. <br /><br />
            E.g. <code>num_employees:desc,year_started:asc</code></td>
        </tr>
        <tr>
          <td>facet_by</td>
          <td>false</td>
          <td>A list of fields that will be used for faceting your results on. Separate multiple fields with a comma.</td>
        </tr>
        <tr>
          <td>num_typos</td>
          <td>false</td>
          <td>The number of typographical errors (1 or 2) that would be tolerated. Default: 2</td>
        </tr>
        <tr>
          <td>prefix</td>
          <td>true</td>
          <td>Boolean field to indicate that the last word in the query should be treated as a prefix, and not as a whole
            word. This is necessary for building autocomplete and instant search interfaces.</td>
        </tr>
        <tr>
          <td>rank_tokens_by</td>
          <td>false</td>
          <td>When a token/word in the search query matches multiple possible words (either because of a typo or during prefix
            search), this parameter determines the priority of the matching tokens. For e.g. both "john" and "joan" are
            1-typo away from "jofn". In a prefix search, both "apple" and "apply" would match "app".
            <br /> <br />
            The value of <code>rank_tokens_by</code> must be: <br /> <br />
            <code>TOKEN_RANKING_FIELD</code> or <code>TERM_FREQUENCY</code>. <br /> <br />

            <code>TOKEN_RANKING_FIELD</code>: Tokens are ranked by the value of
            the <code>token_ranking_field</code> specified during collection creation.<br /><br />

            <code>TERM_FREQUENCY</code>: Tokens that occur more frequently in the collection are ranked first.<br /><br />

            <strong>Default: </strong> <code>TOKEN_RANKING_FIELD</code> if a <code>token_ranking_field</code> was provided
            when the collection was created. Otherwise, <code>TERM_FREQUENCY</code> is used.
          </td>
        </tr>
        <tr>
          <td>page</td>
          <td>false</td>
          <td>Results from this specific page number would be fetched.</td>
        </tr>
        <tr>
          <td>per_page</td>
          <td>false</td>
          <td>Number of results to fetch per page.</td>
        </tr>
        <tr>
          <td>callback</td>
          <td>false</td>
          <td>Name of the callback function to be used for <code>JSONP</code> response.</td>
        </tr>
      </table>

      <h4 id="retrieve-document">Retrieve a document</h4>

      Fetch an individual document from a collection by using its <code>id</code>.

      {% code_block retrieve-document %}
      ```ruby
        Typesense::Documents.retrieve('companies', '124')
      ```

      ```python
        typesense.Documents.retrieve('companies', '124')
      ```

      ```shell
        $ curl -H "X-TYPESENSE-API-KEY: abcd" -X GET \
              "http://localhost:8108/collections/companies/documents/124"
      ```
      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block retrieve-document-response %}
      ```json
        {
          "id": "124",
          "company_name": "Stark Industries",
          "num_employees": 5215,
          "country": "USA"
        }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>GET ${TYPESENSE_HOST}/collections/:collection/documents/:id</code></p>

      <h4 id="delete-document">Delete a document</h4>

      <p>Delete an individual document from a collection by using its <code>id</code>.</p>

      {% code_block delete-document %}
      ```ruby
        Typesense::Documents.delete('companies', '124')
      ```

      ```python
        typesense.Documents.delete('companies', '124')
      ```

      ```shell
        curl -H "X-TYPESENSE-API-KEY: abcd" -X DELETE \
            "http://localhost:8108/collections/companies/documents/124"
      ```
      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block delete-document-response %}
      ```json
        {
          "id": "124",
          "company_name": "Stark Industries",
          "num_employees": 5215,
          "country": "USA"
        }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>DELETE ${TYPESENSE_HOST}/collections/:collection/documents/:id</code></p>

      <h4 id="retrieve-collection">Retrieve a collection</h4>

      <p>Retrieve the details of a collection, given its name.</p>

      {% code_block retrieve-collection %}
      ```ruby
      Typesense::Collections.retrieve('companies')
      ```

      ```python
      typesense.Collections.retrieve('companies')
      ```

      ```shell
        curl -H "X-TYPESENSE-API-KEY: abcd" -X GET
            "http://localhost:8108/collections/companies"
      ```
      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block retrieve-collection-response %}
      ```json
        {
          "name": "companies",
          "num_documents": 1250,
          "fields": [
            {"name": "company_name", "type": "string"},
            {"name": "num_employees", "type": "int32"},
            {"name": "country", "type": "string", "facet": true}
          ],
          "token_ranking_field": "num_employees"
        }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>GET ${TYPESENSE_HOST}/collections/:collection</code></p>

      <h4 id="export-collection">Export a collection</h4>

      {% code_block export-collection %}
      ```ruby
        Typesense::Documents.export('companies')
      ```

      ```python
        typesense.Documents.export('companies')
      ```

      ```shell
        curl -H "X-TYPESENSE-API-KEY: abcd" -X GET
            "http://localhost:8108/collections/companies/documents/export"
      ```
      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block export-collection-response %}
        ```ruby
          [
          "{\"id\": \"124\", \"company_name\": \"Stark Industries\", \"num_employees\": 5215, \
          \"country\": \"US\"}",
          "{\"id\": \"125\", \"company_name\": \"Future Technology\", \"num_employees\": 1232, \
          \"country\": \"UK\"}",
          "{\"id\": \"126\", \"company_name\": \"Random Corp.\", \"num_employees\": 531, \
          \"country\": \"AU\"}"
          ]
        ```

        ```python
          [u'{"company_name":"Stark Industries","country":"USA","id":"124","num_employees":5215}',\
          u'{"company_name":"Future Technology","country":"UK","id":"125","num_employees":1232}',\
          u'{"company_name":"Random Corp.","country":"AU","id":"126","num_employees":531}']
        ```

        ```shell
          {"id": "124", "company_name": "Stark Industries", "num_employees": 5215,\
          "country": "US"}
          {"id": "125", "company_name": "Future Technology", "num_employees": 1232,\
          "country": "UK"}
          {"id": "126", "company_name": "Random Corp.", "num_employees": 531,\
          "country": "AU"}
        ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>GET ${TYPESENSE_HOST}/collections/:collection/documents/export</code></p>

      <h4 id="list-collection">List all collections</h4>

      <p>Returns a summary of all your collections. The collections are returned sorted by creation date,
        with the most recent collections appearing first.</p>

      {% code_block list-collection %}
      ```ruby
        Typesense::Collections.retrieve_all
      ```

      ```python
        typesense.Collections.retrieve_all()
      ```

      ```shell
        curl -H "X-TYPESENSE-API-KEY: abcd" "http://localhost:8108/collections"
      ```
      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block list-collection-response %}
      ```json
      {
        "collections": [
          {
            "num_documents": 1250,
            "name": "companies",
            "fields": [
              {"name": "company_name", "type": "string"},
              {"name": "num_employees", "type": "int32"},
              {"name": "country", "type": "string", "facet": true}
            ],
            "token_ranking_field": "num_employees"
          },
          {
            "num_documents": 1250,
            "name": "ceos",
            "fields": [
              {"name": "company_name", "type": "string"},
              {"name": "full_name", "type": "string"},
              {"name": "from_year", "type": "int32"}
            ],
            "token_ranking_field": "num_employees"
          }
        ]
      }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>GET ${TYPESENSE_HOST}/collections</code></p>

      <h4 id="drop-collection">Drop a collection</h4>

      <p>Permanently drops a collection. This action cannot be done. For large collections, this might have an impact on read
        latencies.</p>

      {% code_block drop-collection %}
      ```ruby
        Typesense::Collections.delete('companies')
      ```

      ```python
        typesense.Collections.delete('companies')
      ```

      ```shell
        curl -H "X-TYPESENSE-API-KEY: abcd" -X DELETE
            "http://localhost:8108/collections/companies"
      ```

      {% endcode_block %}

      <h5>Sample response</h5>

      {% code_block drop-collection-response %}
      ```json
      {
        "name": "companies",
        "num_documents": 1250,
        "fields": [
          {"name": "company_name", "type": "string"},
          {"name": "num_employees", "type": "int32"},
          {"name": "country", "type": "string", "facet": true}
        ],
        "token_ranking_field": "num_employees"
      }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>DELETE ${TYPESENSE_HOST}/collections/:collection</code></p>

    </div>

  <div class="col-md-1 row no-gutters"></div>

    <div class="col-md-2 row no-gutters">
      <nav id="navbar-docs" class="position-fixed navbar navbar-light">
        <nav class="nav nav-pills flex-column">
          <a class="nav-link" href="#introduction">Introduction</a>
          <a class="nav-link" href="#installation">Installation</a>
          <a class="nav-link" href="#authentication">Authentication</a>
          <a class="nav-link" href="#usage">Usage</a>
          <nav class="nav nav-pills flex-column">
            <a class="nav-link ml-3 my-1" href="#create-collection">Create a collection</a>
            <a class="nav-link ml-3 my-1" href="#index-document">Index a document</a>
            <a class="nav-link ml-3 my-1" href="#search-collection">Search a collection</a>
            <a class="nav-link ml-3 my-1" href="#retrieve-document">Retrieve a document</a>
            <a class="nav-link ml-3 my-1" href="#delete-document">Delete a document</a>
            <a class="nav-link ml-3 my-1" href="#retrieve-collection">Retrieve a collection</a>
            <a class="nav-link ml-3 my-1" href="#export-collection">Export a collection</a>
            <a class="nav-link ml-3 my-1" href="#list-collection">List all collections</a>
            <a class="nav-link ml-3 my-1" href="#drop-collection">Drop a collection</a>
          </nav>
        </nav>
      </nav>
    </div>

</div>
