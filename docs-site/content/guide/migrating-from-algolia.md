# Migrating from Algolia

If you are currently using Algolia and are planning a migration to Typesense, this guide is meant to give you some helpful pointers to help ease your transition.
We've put this together based on common things we've seen Algolia users experience when switching to Typesense.

## API Compatibility

While Typesense _is_ an open source alternative to Algolia that gives you the same instant-search-as-you-type experience,
it also improves on some key aspects of Algolia.
So while you might find many concepts similar in Typesense and Algolia, we've designed Typesense's feature set with a first-principles mindset,
and so the APIs are not wire-compatible with each other by design.

### Type-checking

Typesense encourages you to define a schema for your documents and then type-checks documents you index against this schema to ensure that the data indexed is consistent and doesn't lead to unexpected surprises or subtle errors.
This is very similar to the benefits of type-checking in strongly-typed programming languages like C++, Go, Rust, Java, Kotlin, Swift, Typescript, etc.

In Algolia, you can send any JSON data to be indexed and the data types are preserved as is, even if inconsistent across documents.
So you could have one document with a string field called "timestamp" and another document with an integer field called "timestamp".
This leads to some gotchas during filtering, depending on the type of filter you use.

While Typesense doesn't allow you to have different data types for the same field across documents,
you can configure Typesense to automatically detect the schema for you based on the documents you index (See [Auto-Schema Detection](../latest/api/collections.html#with-auto-schema-detection).)
You can also configure Typesense to automatically attempt to coerce data types based on the detected schema using the [`coerce_or_reject`](../latest/api/documents.html#dealing-with-dirty-data) parameter when importing documents.

### Synchronous Write APIs

In Algolia, all write API calls are queued up internally and applied asynchronously to the index.
You would have to poll the status of writes to know the status of each write operation.
Depending on the size of your dataset you might see a delay between when you make a write API call and when it shows up in the index when searching.

In Typesense, all write API calls are synchronous. There is no polling required to know the status of a write.
If an API call succeeds, it means that the data has been written to a majority of the nodes in the cluster and is available for search.
This also means that these synchronous write API calls containing large batches of data will take longer to complete as the data is being ingested.
Depending on the amount of data being indexed concurrently, if the configured thresholds are exceeded, Typesense might return an `HTTP 503 Lagging or Not Ready` message to ensure that search operations are not affected during high volume writes.
At that point, you would have to retry the write API call after a pause at a later point in time.

## Feature Parity

Typesense is currently at about 85% feature parity with Algolia (see the [feature comparison matrix here](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/)). 
We plan to close the gap based on feedback we get from Algolia users switching over to Typesense.

### Key Features in Algolia, not in Typesense

- Server-side stop-words (can be implemented [client-side](https://github.com/typesense/showcase-books-search/blob/b0b15dc88179566f85db21d2455c2d6c68668d5a/src/app.js#L186-L194))
- Server-side analytics (can be implemented [client-side](./search-analytics.md)).
- Server-side AB-Testing (can be implemented client-side using an AB-Testing framework and using different collections based on the bucket identifier for a user).
- [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) (can be implemented from search terms in [search analytics](./search-analytics.md) data, and putting them in a separate "suggestions" collection.)
- [Optional Filters](https://www.algolia.com/doc/guides/managing-results/rules/merchandising-and-promoting/how-to/how-to-promote-with-optional-filters/)
- AI/ML Features
  - Dynamic Synonym Suggestion
  - User-level personalization
  - AI Re-Ranking
  - Recommendations
- Indexing nested fields (they need to be [flattened](#indexing-nested-fields) to top-level keys in Typesense).
- Querying plurals / singulars of indexed keywords (plurals need to be setup as synonyms in Typesense).
- Drag-and-Drop visual interface for Merchandising (you would use a JSON structure to define merchandising rules in Typesense).

### Key Features in Typesense, not in Algolia

- Multiple (hard) sort orders on a single index (In Algolia you need to create duplicate indices for every hard sort order, eg: sort by price asc, sort by price desc, etc each need a duplicate index in Algolia).
- Validations for field data types when documents are indexed (similar to typed languages) to prevent inconsistent data from getting into the index. (This can be turned off if you need Algolia-like behavior).
- Ability to specify numerical weights for particular fields during search, to give them more priority
- Ability to create [aliases](../latest/api/collection-alias.md) for collections, like symlinks
- In general many parameters that are configurable at the index level in Algolia are dynamically configurable at search time in Typesense, which gives you more flexibility. 
- No limits on record size, maximum index size, number of synonyms, number of rules or number of indices. 
- Ability to self-host
- Can be run in a Continuous Integration environment since it is self-hostable
- Fully Open Source

## Equivalent Features and Concepts

Here is a list of common features and concepts along with what each one is called in Algolia vs Typesense.

### Terminology

| Algolia                                        | Typesense                                                                                                                                                                                                                                                                                                                     |
|:-----------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Every JSON object you index is called a record | Every JSON object you index is called a [`Document`](../latest/api/documents.md)                                                                                                                                                                                                                                              |
| A collection of records is called an `Index`   | A collection of records / documents is a called a [`Collection`](../latest/api/collections.md)                                                                                                                                                                                                                                |
| Distributed Search Network                     | Search Delivery Network (in Typesense Cloud)                                                                                                                                                                                                                                                                                  |

### Features

| Algolia                                                                                                     | Typesense                                                                                                                                                                                                                                                                                     |
|:------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authentication is done via `Application ID` and `API Key`                                                   | Authentication is done via `x-typesense-api-key`                                                                                                                                                                                                                                              |
| Secured or Virtual API Keys                                                                                 | [Scoped API Keys](../latest/api/api-keys.html#generate-scoped-search-key)                                                                                                                                                                                                                     |
| Importing records (without validations and schema)                                                          | Create a collection with [auto-schema detection](../latest/api/collections.html#with-auto-schema-detection) and import documents with [`coerce_or_reject`](../latest/api/documents.html#dealing-with-dirty-data)                                                                              |
| Query rules                                                                                                 | [Overrides](../latest/api/curation.md) aka Curation                                                                                                                                                                                                                                           |
| Merchandising                                                                                               | [Promoting or Excluding results](../latest/api/curation.html#including-or-excluding-documents) via Overrides, or at search time via the [`pinned_hits` or `hidden_hits`](../latest/api/documents.md#search-parameters) search parameter                                                       |
| Dynamic Filtering                                                                                           | [Dynamic Filtering via Overrides](../latest/api/curation.md#dynamic-filtering)                                                                                                                                                                                                                |
| Virtual Index Replicas for sorting                                                                          | In Typesense, a single collection can handle multiple sort orders using [`sort_by`](../latest/api/documents.md#search-parameters), so virtual index replicas are not needed                                                                                                                   |
| Searching multiple indices (aka Federated Search, aka `multipleQueries`)                                    | [`multi_search`](../latest/api/documents.html#federated-multi-search)                                                                                                                                                                                                                         |
| [Ranking and Relevance in Algolia](https://www.algolia.com/doc/guides/managing-results/relevance-overview/) | [Ranking and Relevance in Typesense](./ranking-and-relevance.md).<br/><br/>One key difference in Typesense is that we've tried to simplify the relevance tuning experience, so things work out-of-the-box for most use-cases and we've tried to keep the number of knobs needed to a minimum. |
| [Filtering records](https://www.algolia.com/doc/guides/managing-results/refine-results/filtering/)          | [`filter_by`](../latest/api/documents.md#search-parameters) search parameter filters documents                                                                                                                                                                                                |
| [Faceting records](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/)            | [`facet_by`](../latest/api/documents.md#search-parameters) search parameter facets documents                                                                                                                                                                                                  |
| [Grouping records](https://www.algolia.com/doc/guides/managing-results/refine-results/grouping/)            | [`group_by`](../latest/api/documents.md#search-parameters) search parameter groups documents                                                                                                                                                                                                  |
| GeoSearch with `aroundRadius`, `aroundLatLng`                                                               | [GeoSearch with Typesense](../latest/api/documents.html#geosearch)                                                                                                                                                                                                                            |
| GeoSearch with `insidePolygon`                                                                              | [GeoSearch inside a polygon](../latest/api/documents.html#searching-within-a-geo-polygon)                                                                                                                                                                                                     |
| Controlling GeoSearch precision with `aroundPrecision`                                                      | [`geo_precision` and `exclude_radius`](../latest/api/documents.html#exclude-radius)                                                                                                                                                                                                           | 

### Configuration

| Algolia                                                                                    | Typesense                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|:-------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `searchableAttributes`                                                                     | All fields / attributes that need to be indexed are configured when [creating a collection](../latest/api/collections.html#create-a-collection), and then you can choose to use a subset of fields at search time dynamically using the [`query_by`](../latest/api/documents.md#search-parameters) search parameter.                                                                                                                                                                   |
| `attributesForFaceting` for faceting and filtering                                         | Faceting can be turned on for fields by specifying `facet: true` for the field in the [collection's schema](../latest/api/collections.html#create-a-collection) and then can by changed at search time using [`facet_by`](../latest/api/documents.md#search-parameters)<br/> In Typesense, filter fields need not be set as facets.                                                                                                                                                    |
| `unretrievableAttributes`                                                                  | Can be configured at search time by creating a [Scoped API Key](../latest/api/api-keys.html#generate-scoped-search-key) and embedding the [`exclude_fields`](../latest/api/documents.md#search-parameters) search parameter                                                                                                                                                                                                                                                            |
| `attributesToRetrieve`                                                                     | Can be configured at search time by creating a [Scoped API Key](../latest/api/api-keys.html#generate-scoped-search-key) and embedding the [`include_fields`](../latest/api/documents.md#search-parameters) search parameter                                                                                                                                                                                                                                                            |
| `attributeForDistinct` and `distinct`                                                      | Can be configured at search time using the [`group_by` and `group_limit`](../latest/api/documents.md#search-parameters) search parameters                                                                                                                                                                                                                                                                                                                                              |                                                                                                                                                                                                                                                                                        
| `separatorsToIndex`                                                                        | [`symbols_to_index`](../latest/api/collections.html#schema-arguments) setting when creating a collection                                                                                                                                                                                                                                                                                                                                                                               |
| `removeWordsIfNoResults`                                                                   | [`drop_tokens_threshold`](../latest/api/documents.md#search-parameters) search parameter                                                                                                                                                                                                                                                                                                                                                                                               |
| `disablePrefixOnAttributes`                                                                | [`prefix=false,false,true`](../latest/api/documents.md#search-parameters) search parameter corresponding to the fields in `query_by`                                                                                                                                                                                                                                                                                                                                                   |
| `disableTypoToleranceOnAttributes`                                                         | [`num_typos=false,false,true`](../latest/api/documents.md#search-parameters) search parameter corresponding to the fields in `query_by`                                                                                                                                                                                                                                                                                                                                                |
| [`customRanking`](https://www.algolia.com/doc/api-reference/api-parameters/customRanking/) | Up to 3 sort_by parameters can be specified in the [`sort_by`](../latest/api/documents.md#search-parameters) search parameter. <br><br>Eg: `sort_by=_text_match(buckets: 10):desc,custom_field_1:desc,custom_field_2:desc` <br><br> As of v0.23.0.rc17, this divides the result set into 10 buckets from most relevant results to the least relevant, and forces all items in one bucket into a tie, which causes your custom ranking field to be used for ranking within each bucket. |

### API

| Algolia                                                                                                  | Typesense                                                                                                                                                                             |
|:---------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Importing / Indexing Documents with `saveObjects`                                                        | Import documents using [`/collections/<collection_name>/documents/import`](../latest/api/documents.md#index-multiple-documents) endpoint with `action=upsert`                         |
| `partialUpdateObjects` with `createIfNotExists: true`                                                    | Import documents using [`/collections/<collection_name>/documents/import`](../latest/api/documents.md#index-multiple-documents) endpoint with `action=emplace` (as of `v0.23.0.rc14`) |
| Exporting records using [`browseObjects`](https://www.algolia.com/doc/api-reference/api-methods/browse/) | Export documents using the [`/collections/collection_name/documents/export`](../latest/api/documents.html#export-documents) endpoint                                                  |
| [`searchForFacetValues`](https://www.algolia.com/doc/api-reference/api-methods/search-for-facet-values/) | [`facet_query`](../latest/api/documents.md#search-parameters) search parameter                                                                                                        |

## Migrating Frontend UI components

Algolia has built and open-sourced a suite of Search UI libraries for Vanilla JS, React, Vue and Angular called [InstantSearch](https://github.com/algolia/instantsearch.js).

Typesense supports the same InstantSearch widgets, through the [typesense-instantsearch-adapter](https://github.com/typesense/typesense-instantsearch-adapter).
You would just have to install the adapter into your application via `npm` or `yarn` and [configure it](https://github.com/typesense/typesense-instantsearch-adapter#usage),
and your existing UI widgets will work with your Typesense cluster, without any additional changes in most cases. 

A few widgets need [small changes](https://github.com/typesense/typesense-instantsearch-adapter#widget-specific-instructions) to use them with Typesense.

## Indexing Nested Fields

Typesense currently only supports indexing field values that are integers, floats, strings, booleans and arrays containing each of those data types.
Only these data types can be specified for fields in the collection, which are the ones that will be indexed. 

**Important Side Note:** You can still send nested objects into Typesense, in fields not mentioned in the schema. These will not be indexed or type-checked. They will just be stored on disk and returned if the document is a hit for a search query. 

Typesense specifically does not support indexing nested objects, or arrays of objects. We plan to add support for this shortly as part of ([#227](https://github.com/typesense/typesense/issues/227)).
In the meantime, you would have to flatten objects and arrays of objects into top-level keys before sending the data into Typesense.

For example, a document like this containing nested objects:

```json
{
  "nested_field": {
    "field1": "value1",
    "field2": ["value2", "value3", "value4"],
    "field3": {
      "fieldA": "valueA",
      "fieldB": ["valueB", "valueC", "valueD"]
    }
  }
}  
```

would need to be flattened as:

```json
{
  "nested_field.field1": "value1",
  "nested_field.field2":  ["value2", "value3", "value4"],
  "nested_field.field3.fieldA": "valueA",
  "nested_field.field3.fieldB": ["valueB", "valueC", "valueD"]
}
```

before indexing it into Typesense.

To simplify traversing the data in the results, you might want to send both the flattened and unflattened version of the nested fields into Typesense, 
and only set the flattened keys as indexed in the collection's schema and use them for search/filtering/faceting.
At display time when parsing the results, you can then use the nested version.

## Geo-Distributed Clusters

Algolia calls their Geo-Distributed CDN-like search offering [Distributed Search Network](https://www.algolia.com/doc/guides/scaling/distributed-search-network-dsn/), and is only available for customers who pay annually, as a paid add-on.

In Typesense Cloud, Geo-Distributed CDN-like search offering is called a Search Delivery Network, and is available to all users as a configuration you can choose when you create a new cluster.  

## Pricing Model

Algolia charges by the number of records and number of searches, and you pay for the max of these two dimensions, along with overages if you go over your plan limit.
So if you have high traffic and low number of records or low traffic and large number of records, you'll be paying for the larger number of the two.

**Typesense is free and open source, and can be self-hosted for free.**

Typesense also offers a hosted search service called [Typesense Cloud](https://cloud.typesense.org).
Typesense Cloud pricing is based on the amount of [RAM & CPU](./system-requirements.md) you need to index your data and support your desired traffic concurrency respectively.
It's a flat hourly fee depending on the configuration you choose, plus standard bandwidth charges, similar to AWS, GCP, etc.
There are no per-record or per-search charges unlike Algolia. You can throw as much traffic or data at your cluster as it can handle. 
We've seen this pricing model save up to 95% in search costs for users switching from Algolia to Typesense Cloud.

## Algolia Migration Support

If you plan to migrate to Typesense Cloud from Algolia, we offer FREE [migration consulting support](https://cloud.typesense.org/pricing#switching-from-algolia) with different levels of service based on your Algolia usage.
