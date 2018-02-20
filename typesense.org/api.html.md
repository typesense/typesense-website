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
        curl "http://localhost/collections" -X POST -H "Content-Type: application/json" \
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
        $ curl "http://localhost/collections/companies/documents" -X POST \
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
          </nav>
        </nav>
      </nav>
    </div>

</div>
