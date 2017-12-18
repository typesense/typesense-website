---
title: API Reference

language_tabs:
  - shell  

toc_footers:  
  - <a href='https://typesense.org/'>Typesense Home</a>

includes:
  - errors

search: false
---

# Overview

Welcome to the Typesense API documentation. At the moment, we have API clients for <code>Java</code>, <code>Ruby</code>, 
and <code>Python</code>. 

This documentation itself is open source! Please leave your feedback as issues in the GitHub repo or fork it to 
contribute changes!

<aside class="notice">
We recommend that you use our API client library if it is available for your language.
</aside>

# Authentication

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
          "${TYPESENSE_HOST}/collections"
```

```shell
# For JSON requests
$ curl "${TYPESENSE_HOST}/collections"\
       "?x-typesense-api-key=${TYPESENSE_API_KEY}"
```

Authentication is done via the `X-TYPESENSE-API-KEY` HTTP header.

Optionally, you can also send the API key as a `x-typesense-api-key` GET parameter. Please use this only for 
JSONP requests from Javascript (since you can't set custom headers on JSONP requests).

Typesense requires a authentication header or GET parameter to be present on all API requests sent to the server.

# Collections

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
             "prefix_sort_field": "num_employees"
          }' 
      
```

> Example Response

```json
{
  "name": "companies",
  "fields": [
    {"name": "company_name", "type": "string" },
    {"name": "num_employees", "type": "int32" },
    {"name": "country", "type": "string", "facet": true }
  ],
  "prefix_sort_field": "num_employees"
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
        <td>prefix_sort_field</td>
        <td>false</td>
        <td>
            Name of the numeric field whose value should be used to sort terms that share the same prefix 
            during prefix searches. If this field is not provided tokens sharing the same prefix are ordered 
            based on their frequency of occurrence in the collection. <strong>Recommended for autocomplete use cases.</strong>             
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
$ curl "${TYPESENSE_HOST}/collections/companies" \
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

> Example Response

```json
{
    "id": "124"
}
```

A document to be indexed in a given collection must conform to the schema of the collection.

### Definition

`POST ${TYPESENSE_HOST}/collections/:collection`

<aside class="notice">
If the document contains an `id` field of type `string`, Typesense would use that field as the identifier for the 
document. Otherwise, Typesense would assign an identifier of its choice to the document.
</aside>

## Search a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
     "${TYPESENSE_HOST}/collections/companies/search\
     ?q=stark&query_by=company_name&filter_by=num_employees:>100\
     &sort_by=num_employees:desc"
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
      "id": "124",
      "company_name": "Stark Industries",
      "num_employees": 5215,
      "country": "USA"
    }
  ]
}
```
  
In Typesense, a search consists of a query against one or more text fields and a list of filters against numerical or 
facet fields. You can also sort and facet your results.

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection/search`

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
        <td>false</td>
        <td>Boolean field to indicate that the last word in the query should be treated as a prefix, and not as a whole 
        word. This is used for building autocomplete and instant search interfaces.</td>
    </tr>
    <tr>
        <td>sort_prefixes_by</td>
        <td>false</td>
        <td>Only applicable for prefix searches. If there are multiple terms that share a given query 
        prefix (e.g. "app"), this parameter determines how the matching terms (e.g. "apple", "apply", "apps") are 
        ordered. Must be either: <br /> <br /> 
        <code>PREFIX_SORT_FIELD</code> or <code>TERM_FREQUENCY</code>. <br /> <br />
        
        <code>PREFIX_SORT_FIELD</code>: Terms are ranked by the value of 
        the <code>prefix_sort_field</code> specified during collection creation.<br /><br />
            
        <code>TERM_FREQUENCY</code>: Terms that occur more frequently in the collection are ranked first.<br /><br />        
        
        <strong>Default: </strong> <code>PREFIX_SORT_FIELD</code> if a <code>prefix_sort_field</code> was provided when the 
        collection was created. Otherwise, defaults to <code>TERM_FREQUENCY</code>.
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

### Ranking &amp; relevance

Typesense ranks search results using a simple tie-breaking algorithm that relies on two components:

<ol>
    <li>String similarity.</li>
    <li>User-defined <code>sort_by</code> numerical fields (optional).</li>
</ol>
   
Typesense computes a string similarity score based on how much a query overlaps with the `query_by` fields 
of a given document. Typographic errors are also taken into account.

When multiple documents share the same string similarity score, user-defined numerical fields are used to break the tie. 
You can specify upto two such numerical fields. 

For example, let's say that we're searching for books with a query like <code>short story</code>. 
If there are multiple books containing those words, then all those records would have the same string similarity score.

To break the tie, we could specify upto two additional `sort_by` fields. For instance, we could say, 
<code>sort_by=rating:DESC,year_published:DESC</code>. This would sort the results in the following manner:
 
  <ol>
    <li>All matching records are sorted by string similarity score.</li>
    <li>If any two records share the same string similarity score, sort them by their rating.</li>
    <li>If there is still a tie, sort the records by year of publication.</li>
  </ol>

## Retrieve a document

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X GET
       "${TYPESENSE_HOST}/collections/companies/124"
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

`GET ${TYPESENSE_HOST}/collections/:collection/:id`

## Delete a document

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X DELETE
       "${TYPESENSE_HOST}/collections/companies/124"
```

> Example Response

```json
{
    "id": "124"
}
```

Delete an individual document from a collection by using its ID.

### Definition

`DELETE ${TYPESENSE_HOST}/collections/:collection/:id`

## Retrieve a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X GET
       "${TYPESENSE_HOST}/collections/companies"
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
  "prefix_sort_field": "num_employees"
}
```

Retrieve the details of a collection, given its name.

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection`

## Export a collection

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
       -X GET
       "${TYPESENSE_HOST}/collections/companies/export"
```

> Example Response

```json
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215,\
 "country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232,\
 "country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531,\
 "country": "AU"}
```

Export all documents in a collection in [JSON lines format](http://jsonlines.org/).

### Definition

`GET ${TYPESENSE_HOST}/collections/:collection/export`


## List all collections

```shell
$ curl -H "X-TYPESENSE-API-KEY: ${API_KEY}" \
     "${TYPESENSE_HOST}/collections"
```

> Example Response

```json
{  
  "collections": [
    {   
      "name": "companies",
      "num_documents": 1250
    },
    {   
      "name": "employees"
      "num_documents": 24638
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

> Example Response

```json
{
    "id": "1"
}
```

Permanently drops a collection. This action cannot be done. For large collections, this might have an impact on read 
latencies.

### Definition

`DELETE ${TYPESENSE_HOST}/collections/:collection`