---
layout: page
title: API Documentation
nav_label: api
permalink: /api/
---

<div class="row no-gutters">
    <div id="doc-col" class="col-md-8">
      <h3 id="introduction">Introduction</h3>
      <p>Welcome to the Typesense API documentation. This documentation itself is open source.
        Please leave your feedback as issues on the
        <a href="https://github.com/typesense/typesense-website/issues">GitHub repo</a> or send us a pull-request
        to contribute edits.</p>

      <p>To learn how to install and run Typesense, see our <a href="/guide">getting started guide</a>.</p>

      <h3 id="api-clients">API clients</h3>

      <p>At the moment, we have API clients for Javascript, Python, and Ruby. </p>
      <p>We recommend that you use our API client library if it is available for your language.</p>

      {% code_block install %}
        ```ruby
           gem install typesense
        ```

        ```python
           pip install typesense
        ```
        
        ```javascript
          // Node.js
          npm install typesense

          // Browser
          <script src="dist/typesense.min.js"></script>
        ```
      {% endcode_block %}

      <p>If you're using our Javascript client to access Typesense directly from the browser, be sure to start the
        Typesense server with the <code>--enable-cors</code> flag. </p>

      <h3 id="authentication">Authentication</h3>

      {% code_block authenticate %}
      ```ruby
        require 'typesense'

        client = Typesense::Client.new(
          master_node: {
            host:     'localhost',
            port:     8108,
            protocol: 'http',
            api_key:  '<API_KEY>'
          },

          read_replica_nodes: [
            {
              host:     'read_replica_1',
              port:     8108,
              protocol: 'http',
              api_key:  '<API_KEY>'
            }
          ],

          timeout_seconds: 2
        )
      ```

      ```python
        import typesense

        client = typesense.Client({
          'master_node': {
            'host': 'localhost',
            'port': '8108',
            'protocol': 'http',
            'api_key': '<API_KEY>'
          },
          'read_replica_nodes': [{
            'host': 'read_replica_1',
            'port': '8108',
            'protocol': 'http',
            'api_key': '<API_KEY>'
          }],
          'timeout_seconds': 2
        })
      ```
      
      ```javascript
        /*
         *  Our Javascript client library works on both the client and the browser.
         *  When using the library on the browser, please be sure to use the
         *  search-only API Key rather than the master API key since the latter
         *  has write access to Typesense and you don't want to expose that.
         */
        let client = new Typesense.Client({
          'masterNode': {
            'host': 'master',
            'port': '8108',
            'protocol': 'http',
            'apiKey': '<API_KEY>'
          },
          'readReplicaNodes': [{
            'host': 'read_replica_1',
            'port': '8108',
            'protocol': 'http',
            'apiKey': '<API_KEY>'
          }],
          'timeoutSeconds': 2
        })
      ```
      

      ```shell
          # API authentication is done via the `X-TYPESENSE-API-KEY` HTTP header.
          curl -H "X-TYPESENSE-API-KEY: <API_KEY>" "http://localhost:8108/collections"
      ```
      {% endcode_block %}

      <h3 id="usage">Usage</h3>

      <p>In Typesense, a group of related documents is called a <code>collection</code>. A <code>collection</code> is roughly
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
              'type'  => 'string'
            },
            {
              'name'  => 'num_employees',
              'type'  => 'int32'
            },
            {
              'name'  => 'country',
              'type'  => 'string',
              'facet' => true
            }
          ],
          'default_sorting_field' => 'num_employees'
        }

        client.collections.create(schema)
      ```
      ```python
        schema = {
          'name': 'companies',
          'fields': [
            {
              'name'  :  'company_name',
              'type'  :  'string'
            },
            {
              'name'  :  'num_employees',
              'type'  :  'int32'
            },
            {
              'name'  :  'country',
              'type'  :  'string',
              'facet' :  True
            }
          ],
          'default_sorting_field': 'num_employees'
        }

        client.collections.create(schema)
      ```

      ```javascript
        let schema = {
          'name': 'companies',
          'num_documents': 0,
          'fields': [
            {
              'name': 'company_name',
              'type': 'string',
              'facet': false
            },
            {
              'name': 'num_employees',
              'type': 'int32',
              'facet': false
            },
            {
              'name': 'country',
              'type': 'string',
              'facet': true
            }
          ],
          'default_sorting_field': 'num_employees'
        }
        
        client.collections().create(schema)
      ```
      
      ```shell
        curl "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
               -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
                 "name": "companies",
                 "fields": [
                   {"name": "company_name", "type": "string" },
                   {"name": "num_employees", "type": "int32" },
                   {"name": "country", "type": "string", "facet": true }
                 ],
                 "default_sorting_field": "num_employees"
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
          "default_sorting_field": "num_employees"
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
            <p>A list of fields that you wish to index for querying, filtering and faceting.</p>

            <p>Apart from specifying the <code>name</code> and <code>type</code> for each field, a field of
              type <code>string</code> or <code>string[]</code> can be declared as a faceted field by
            setting its <code>facet</code> property to <code>true</code>.</p>
            <p>Faceted fields are indexed <strong>verbatim</strong> without any tokenization or preprocessing.
              For example, if you are building a product search, <code>color</code> and <code>brand</code> could be
              defined as facet fields.</p>
          </td>
        </tr>
        <tr>
          <td>default_sorting_field</td>
          <td>yes</td>
          <td>
            <p>The name of an <code>int32</code> / <code>float</code> field that determines the order in which
            the search results are ranked when a <code>sort_by</code> clause is not provided during searching.
              This field must indicate some kind of popularity. For example, in a product search
              application, you could define <code>num_reviews</code> field as the <code>default_sorting_field</code>.
            </p>

            <p>Additionally, when a word in a search query matches multiple possible words (either because of a typo or
              during a prefix search), this parameter is used to rank such equally matching tokens.
              For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in a
              prefix search, both "apple" and "apply" would match the prefix "app".</p>
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

        client.collections['companies'].documents.create(document)
        ```

        ```python
        document = {
          'id': '124',
          'company_name': 'Stark Industries',
          'num_employees': 5215,
          'country': 'USA'
        }

        client.collections['companies'].documents.create(document)
        ```

        ```javascript
          let document = {
            'id': '124',
            'company_name': 'Stark Industries',
            'num_employees': 5215,
            'country': 'USA'
          }

          client.collections('companies').documents().create(document)
        ```

        ```shell
        curl "http://localhost:8108/collections/companies/documents" -X POST \
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

        client.collections['companies'].documents.search(search_parameters)
      ```

      ```python
        search_parameters = {
          'q'         : 'stark',
          'query_by'  : 'company_name',
          'filter_by' : 'num_employees:>100',
          'sort_by'   : 'num_employees:desc'
        }

        client.collections['companies'].documents.search(search_parameters)
      ```

      ```javascript
        let searchParameters = {
          'q'         : 'stark',
          'query_by'  : 'company_name',
          'filter_by' : 'num_employees:>100',
          'sort_by'   : 'num_employees:desc'
        }

        client.collections('companies').documents().search(searchParameters)
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
              "highlight": {
                "field": "company_name",
                "snippet": "<mark>Stark</mark> Industries"
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
          <td>yes</td>
          <td>
            <p>The query text to search for in the collection.</p>
            <p>
                Use <code>*</code> as the search string to return all documents. This is typically useful when used in 
                conjunction with <code>filter_by</code>.</p>
                <p>For example, to return all documents that match a filter, use: <br/>
                <code>q=*&filter_by=num_employees:10</code> </p>
          </td>
        </tr>
        <tr>
          <td>query_by</td>
          <td>yes</td>
          <td>
            <p>One or more <code>string</code> / <code>string[]</code> fields that should be queried against.
              Separate multiple fields with a comma: <code>company_name, country</code></p>

            <p>The order of the fields is important: a record that matches on a field earlier in the list is
              considered more relevant than a record matched on a field later in the list.
              So, in the example above, documents that match on the <code>company_name</code> field are ranked above
              documents matched on the <code>country</code> field.</p></td>
        </tr>
        <tr>
          <td>prefix</td>
          <td>no</td>
          <td><p>Boolean field to indicate that the last word in the query should be treated as a prefix, and not as a whole
            word. This is necessary for building autocomplete and instant search interfaces.</p>
            <p>Default: <code>true</code></p>
          </td>
        </tr>
        <tr>
          <td>filter_by</td>
          <td>no</td>
          <td><p>Filter conditions for refining your search results. Separate multiple conditions
            with <code>&&</code> operator. Examples:</p>
            <p><code>num_employees:10</code></p>
            <p><code>num_employees:<=100 && country:[USA, UK]</code></p>
            <p><code>country: USA</code></p>

          </td>
        </tr>
        <tr>
          <td>sort_by</td>
          <td>no</td>
          <td>
            <p>A list of numerical fields and their corresponding sort orders that will be used for ordering your results.
            Separate multiple fields with a comma. Currently, upto 2 sort fields can be specified.</p>
            <p>E.g. <code>num_employees:desc,year_started:asc</code></p>

            <p>If no <code>sort_by</code> parameter is specified, results are sorted by the
              <code>default_sorting_field</code> defined during the collection's creation.</p>
          </td>
        </tr>
        <tr>
          <td>facet_by</td>
          <td>no</td>
          <td><p>A list of fields that will be used for faceting your results on. Separate multiple fields with a comma.</p></td>
        </tr>
        <tr>
          <td>num_typos</td>
          <td>no</td>
          <td><p>Number of typographical errors (1 or 2) that would be tolerated.</p>

            <p><a href="https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance">Damerau–Levenshtein distance</a>
              is used to calculate the number of errors.</p>

            <p>Default: <code>2</code></p>
          </td>
        </tr>
        <tr>
          <td>page</td>
          <td>no</td>
          <td><p>Results from this specific page number would be fetched.</p></td>
        </tr>
        <tr>
          <td>per_page</td>
          <td>no</td>
          <td><p>Number of results to fetch per page.</p></td>
        </tr>
        <tr>
          <td>include_fields</td>
          <td>no</td>
          <td><p>Comma-separated list of fields from the document to include in the search result.</p></td>
        </tr>
        <tr>
          <td>exclude_fields</td>
          <td>no</td>
          <td><p>Comma-separated list of fields from the document to exclude in the search result.</p></td>
        </tr>        
        <tr>
          <td>drop_tokens_threshold</td>
          <td>no</td>
          <td>
              <p>
                  If the number of results found for a specific query is less than this number, Typesense will attempt 
                  to drop the tokens in the query until enough results are found. Tokens that have the least individual hits 
                  are dropped first. Set <code>drop_tokens_threshold</code> to <code>0</code> to disable dropping of tokens.
              </p>
              <p>
                Default: <code>10</code>
              </p>
          </td>
        </tr>        
      </table>

      <h4 id="retrieve-document">Retrieve a document</h4>

      Fetch an individual document from a collection by using its <code>id</code>.

      {% code_block retrieve-document %}
      ```ruby
        client.collections['companies'].documents['124'].retrieve
      ```

      ```python
        client.collections['companies'].documents['124'].retrieve()
      ```

      ```javascript
        client.collections('companies').documents('124').retrieve()
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
        client.collections['companies'].documents['124'].delete
      ```

      ```python
        client.collections['companies'].documents('124').delete()
      ```

      ```javascript
        client.collections('companies').documents('124').delete()
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
        client.collections['companies'].retrieve
      ```

      ```python
        client.collections['companies'].retrieve()
      ```

      ```javascript
        client.collections('companies').retrieve()
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
          "default_sorting_field": "num_employees"
        }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>GET ${TYPESENSE_HOST}/collections/:collection</code></p>

      <h4 id="export-collection">Export a collection</h4>

      {% code_block export-collection %}
      ```ruby
        client.collections['companies'].documents.export
      ```

      ```python
        client.collections['companies'].documents.export()
      ```

      ```javascript
        client.collections('companies').documents().export()
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
        
        ```javascript
          ['{"company_name":"Stark Industries","country":"USA","id":"124","num_employees":5215}',\
          '{"company_name":"Future Technology","country":"UK","id":"125","num_employees":1232}',\
          '{"company_name":"Random Corp.","country":"AU","id":"126","num_employees":531}']
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
        client.collections.retrieve
      ```

      ```python
        client.collections.retrieve()
      ```

      ```javascript
        client.collections().retrieve()
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
            "default_sorting_field": "num_employees"
          },
          {
            "num_documents": 1250,
            "name": "ceos",
            "fields": [
              {"name": "company_name", "type": "string"},
              {"name": "full_name", "type": "string"},
              {"name": "from_year", "type": "int32"}
            ],
            "default_sorting_field": "num_employees"
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
        client.collections['companies'].delete
      ```

      ```python
        client.collections['companies'].delete()
      ```
      
      ```javascript
        client.collections('companies').delete()
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
        "default_sorting_field": "num_employees"
      }
      ```
      {% endcode_block %}

      <h5>Definition</h5>

      <p><code>DELETE ${TYPESENSE_HOST}/collections/:collection</code></p>

      <h3 id="errors">API errors</h3>

      <p>Typesense API uses standard HTTP response codes to indicate the success or failure of a request.</p>

      <p>Codes in the 2xx range indicate success, codes in the 4xx range indicate an error given the information provided
      (e.g. a required parameter was omitted), and codes in the 5xx range indicate an error with the Typesense service itself.
      </p>

      <table class="table table-striped">
        <tr>
          <th>Error Code</th>
          <th>Meaning</th>
        </tr>

        <tr>
          <td>400</td>
          <td>Bad Request - The request could not be understood due to malformed syntax.</td>
        </tr>

        <tr>
          <td>401</td>
          <td>Unauthorized - Your API key is wrong.</td>
        </tr>

        <tr>
          <td>404</td>
          <td>Not Found - The requested resource is not found.</td>
        </tr>

        <tr>
          <td>409</td>
          <td>Conflict - When a resource already exists.</td>
        </tr>

        <tr>
          <td>422</td>
          <td>Unprocessable Entity - Request is well-formed, but cannot be processed.</td>
        </tr>

        <tr>
          <td>503</td>
          <td>Service Unavailable - We’re temporarily offline. Please try again later.</td>
        </tr>
      </table>
    </div>

  <div class="col-md-1 row no-gutters"></div>

    <div class="col-md-2 row no-gutters">
      <nav id="navbar-docs" class="position-fixed navbar navbar-light">
        <nav class="nav nav-pills flex-column">
          <a class="nav-link" href="#introduction">Introduction</a>
          <a class="nav-link" href="#api-clients">API clients</a>
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
          <a class="nav-link" href="#errors">API errors</a>
        </nav>
      </nav>
    </div>

</div>
