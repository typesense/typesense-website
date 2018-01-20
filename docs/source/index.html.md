---
title: API Reference

language_tabs:
  - shell: curl
  - ruby  

toc_footers:  
  - <a href='https://typesense.org/'>Typesense Home</a>

includes:
  - errors

search: false
---

# Overview

Welcome to the Typesense API documentation. At the moment, we have API clients for <code>Javascript</code>, 
<code>Python</code>, and <code>Ruby</code>. 

This documentation itself is open source! Please leave your feedback as issues in the GitHub repo or fork it to 
contribute changes!

<aside class="notice">
We recommend that you use our API client library if it is available for your language.
</aside>

# Installation

You can download the [binary packages](https://github.com/wreally/typesense/releases) that we publish for 
Linux (x86-64) and Mac.

If you use Docker, you can also use our [official Docker image](https://hub.docker.com/r/typesense/typesense/).

# Quickstart

Starting Typesense with the bare minimal arguments:

<code>
./typesense-server --data-dir /path/to/data-dir --api-key=Hu52dwsas2AdxdE --listen-port 8108
</code>

You can also start Typesense from our official Docker image: 

<code>
docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:0.8.0 --data-dir /data --api-key=Hu52dwsas2AdxdE --listen-port 8108
</code>

### Arguments

<table>
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
</table>


# Authentication

```shell
# Recommended way to send the API key
$ curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
          "${TYPESENSE_HOST}/collections"
```

```shell
# For JSONP requests
$ curl "${TYPESENSE_HOST}/collections"\
"?x-typesense-api-key=${TYPESENSE_SEARCH_ONLY_KEY}"
```

API authentication is done via the `X-TYPESENSE-API-KEY` HTTP header. Set it to the value of the <code>api-key</code> 
argument used when the Typesense server is started.

If you wish to search a collection directly from Javascript with JSONP, you can send the API key via the
`x-typesense-api-key` GET parameter. We recommend using this approach only for JSONP, since custom headers can't be set 
on JSONP requests.

Typesense requires either the authentication header or the GET parameter to be present on all API requests 
sent to the server.

<aside class="notice">
When you search Typesense directly from the browser, your API key is accessible to your visitors. Therefore, you should 
specify a separate <code>search-only-api-key</code> when you start Typesense, and only use that key for search 
requests from the browser.
</aside>

# Usage

In Typesense, a group of documents is called a `collection`. A `collection` is roughly equivalent to a table in a 
relational database.

## Create a collection

```shell
$ curl "${TYPESENSE_HOST}/collections" \
       -X POST \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
       -d '{
             "name": "companies",
             "fields": [
               {"name": "company_name", "type": "string" },
               {"name": "num_employees", "type": "int32" },
               {"name": "country", "type": "string", "facet": true }
             ],
             "token_ranking_field": "num_employees"
          }' 
      
```

```ruby
schema = {
  'name'                => 'companies',
  'fields'              => [
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


> Example Response

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

When a `collection` is created, we give it a name and describe the fields that will be indexed from the documents 
added to the collection.

<aside class="notice">
Your documents can contain other fields not mentioned in the collection's schema - they will be simply stored but 
not indexed.
</aside>

### Definition

`POST ${TYPESENSE_HOST}/collections`

### Arguments

<table>
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>name</td>
        <td>true</td>
        <td>Name of the collection you wish to create.</td>
    </tr>    
    <tr>
        <td>fields</td>
        <td>true</td>
        <td>
            Definition of fields that you wish to index for querying, filtering and faceting. <br /><br />            
            A field of type <code>string</code> or <code>string[]</code> can be declared as a faceted field by 
            setting its <code>facet</code> property to <code>true</code>. Faceted fields are indexed 
            <strong>verbatim</strong> without any tokenization or preprocessing.
        </td>
    </tr>    
    <tr>
        <td>token_ranking_field</td>
        <td>false</td>
        <td>
        Name of a numerical field whose value will be used to rank the tokens that match a given token in the 
        query. <br /><br />        
        When there is a typo in the query, or during prefix search, multiple tokens could match a given token 
        in the query. For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in the case of a 
        prefix search, both "apple" and "apply" would match "app".<br /><br />                 
        If this field is not defined, tokens are ordered based on their frequency of occurrence in the collection. 
        <strong>Strongly recommended for instance search and autocomplete use cases.</strong>             
        </td>
    </tr>
</table>

### Supported search field types

Typesense allows you to index the following types of fields:

<table>
    <tr><td><code>string</td></tr>
    <tr><td><code>int32</code></td></tr>
    <tr><td><code>int64</code></td></tr>
    <tr><td><code>float</code></td></tr>    
    <tr><td><code>bool</code></td></tr>    
</table>

You can define an array or multi-valued field by using a `[]` at the end:

<table>
    <tr><td><code>string[]</td></tr>
    <tr><td><code>int32[]</code></td></tr>
    <tr><td><code>int64[]</code></td></tr>
    <tr><td><code>float[]</code></td></tr>   
    <tr><td><code>bool[]</code></td></tr>   
</table>

## Index a document

```shell
$ curl "${TYPESENSE_HOST}/collections/companies/documents" \
       -X POST \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
       -d '{
            "id": "124",
            "company_name": "Stark Industries",
            "num_employees": 5215,
            "country": "USA"
          }'
```

```ruby
document = {
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
}

Typesense::Documents.create('companies', document)
```

> Example Response

```json
{
  "id": "124",
  "company_name": "Stark Industries",
  "num_employees": 5215,
  "country": "USA"
}
```

A document to be indexed in a given collection must conform to the schema of the collection.

### Definition

`POST ${TYPESENSE_HOST}/collections/:collection/documents`

<aside class="notice">
If the document contains an `id` field of type `string`, Typesense would use that field as the identifier for the 
document. Otherwise, Typesense would assign an identifier of its choice to the document.
</aside>

## Search a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
     "${TYPESENSE_HOST}/collections/companies/documents/search\
     ?q=stark&query_by=company_name&filter_by=num_employees:>100\
     &sort_by=num_employees:desc"
```

```ruby
search_parameters = {
  'q'         => 'stark',
  'query_by'  => 'company_name',
  'filter_by' => 'num_employees:>100',
  'sort_by'   => 'num_employees:desc'
}
      
Typesense::Documents.search('companies', search_parameters)
```

> Example Response

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
  
In Typesense, a search consists of a query against one or more text fields and a list of filters against numerical or 
facet fields. You can also sort and facet your results.

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection/documents/search`

### Arguments

<table>
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

<aside class="notice">
    Due to performance reasons, Typesense limits searches to a maximum of 500 results.
</aside>

## Retrieve a document

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X GET
       "${TYPESENSE_HOST}/collections/companies/documents/124"
```

```ruby
Typesense::Documents.retrieve('companies', '124')
```

> Example Response

```json
{  
  "id": "124",
  "company_name": "Stark Industries",
  "num_employees": 5215,
  "country": "USA"
}
```

Fetch an individual document from a collection by using its ID.

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection/documents/:id`

## Delete a document

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X DELETE
       "${TYPESENSE_HOST}/collections/companies/documents/124"
```

```ruby
Typesense::Documents.delete('companies', '124')
```

> Example Response

```json
{
    "id": "124",
    "company_name": "Stark Industries",
    "num_employees": 5215,
    "country": "USA"
}
```

Delete an individual document from a collection by using its ID.

### Definition

`DELETE ${TYPESENSE_HOST}/collections/:collection/documents/:id`

## Retrieve a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X GET
       "${TYPESENSE_HOST}/collections/companies"
```

```ruby
Typesense::Collections.retrieve('companies')
```

> Example Response

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

Retrieve the details of a collection, given its name.

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection`

## Export a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X GET
       "${TYPESENSE_HOST}/collections/companies/documents/export"
```

```ruby
Typesense::Documents.export('companies')
```

> Example Response

```shell
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215,\
 "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232,\
 "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531,\
 "country": "AU"}
```

```ruby
[
  {"id": "124", "company_name": "Stark Industries", "num_employees": 5215, \
    "country": "US"},
  {"id": "125", "company_name": "Future Technology", "num_employees": 1232, \
    "country": "UK"},
  {"id": "126", "company_name": "Random Corp.", "num_employees": 531, \
    "country": "AU"}
]
```

Export all documents in a collection in [JSON lines format](http://jsonlines.org/) (only in cURL, client libraries return an array of documents).

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection/documents/export`


## List all collections

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
     "${TYPESENSE_HOST}/collections"
```

```ruby
Typesense::Collections.retrieve_all
```

> Example Response

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

Returns a summary of all your collections. The collections are returned sorted by creation date, 
with the most recent collections appearing first.

### Definition

`GET ${TYPESENSE_HOST}/collections`

## Drop a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X DELETE
       "${TYPESENSE_HOST}/collections/companies"
```

```ruby
Typesense::Collections.delete('companies')
```

> Example Response

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

Permanently drops a collection. This action cannot be done. For large collections, this might have an impact on read 
latencies.

### Definition

`DELETE ${TYPESENSE_HOST}/collections/:collection`

# Ranking &amp; relevance

Typesense ranks search results using a simple tie-breaking algorithm that relies on two components:

<ol>
    <li>String similarity.</li>
    <li>User-defined <code>sort_by</code> numerical fields.</li>
</ol>
   
Typesense computes a string similarity score based on how much a search query overlaps with the 
fields of a given document. Typographic errors are also taken into account here. Let's see how:

When there is a typo in the query, or during prefix search, multiple tokens could match a given token in the query. 
For e.g. both “john” and “joan” are 1-typo away from “jofn”. Similarly, in the case of a prefix search, 
both “apple” and “apply” would match “app”. In such scenarios, Typesense would use the value of the 
<code>token_ranking_field</code> field to decide whether documents containing "john" or "joan" should be ranked first. 
If a <code>token_ranking_field</code> field is not associated with the collection, then Typesense would rank the 
documents containing the most frequently occuring tokens first.

When multiple documents share the same string similarity score, user-defined numerical fields are used to break the tie. 
You can specify upto two such numerical fields. 

For example, let's say that we're searching for books with a query like <code>short story</code>. 
If there are multiple books containing these exact words, then all those documents would have the same string similarity score.

To break the tie, we could specify upto two additional `sort_by` fields. For instance, we could say, 
<code>sort_by=rating:DESC,year_published:DESC</code>. This would sort the results in the following manner:
 
<ol>
    <li>All matching records are sorted by string similarity score.</li>
    <li>If any two records share the same string similarity score, sort them by their rating.</li>
    <li>If there is still a tie, sort the records by year of publication.</li>
</ol>

# Read-only replica

You can run Typesense as a read-only replica that asynchronously pulls data from a master Typesense server.

To start the server as a read-only replica, specify the master's address via the `--master` 
argument. Example: <br />

<code>--master=http(s)://&lt;master_address&gt;:&lt;master_port&gt;</code>
 
<strong>NOTE:</strong> The master Typesense server maintains a replication log for 24 hours. If you are pointing the 
replica to a master instance that has been running for greater than 24 hours, you need to first stop the master, take 
a copy of the data directory and then then start the replica server by pointing to this backup data directory.