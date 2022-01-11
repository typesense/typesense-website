# Migrating from Algolia

If you are currently using Algolia and are planning a migration to Typesense, this guide is meant to give you some helpful pointers to help ease your transition.
We've put this together based on common things we've seen Algolia users experience when switching to Typesense.

## API Compatability

While Typesense _is_ an open source alternative to Algolia that gives you the same instant-search-as-you-type experience, 
it also improves on some key aspects of Algolia. 
So while you might find many concepts similar in Typesense and Algolia, we've designed Typesense's feature set with a first-principles mindset,
and so the APIs are not wire-compatible with each other by design.

### Synchronous Write APIs

In Algolia, all write API calls are queued up internally and applied asynchronously to the index. 
You would have to poll the status of writes to know the status of each write operation.
Depending on the size of your dataset you might see a delay between when you make a write API call and when it shows up in the index when searching.

In Typesense, all write API calls are synchronous. There is no polling required to know the status of a write. 
If an API call succeeds, it means that the data has been written to a majority of the nodes in the cluster and is available for search.
This also means that these synchronous write API calls containing large batches of data will take longer to complete as the data is being ingested. 
Depending on the amount of data being indexed concurrently, if the configured thresholds are exceeded, Typesense might return an `HTTP 503 Lagging or Not Ready` message to ensure that search operations are not affected during high volume writes.
At that point, you would have to retry the API call after a pause at a later point in time.

## Feature Parity

Typesense is currently at about 85% feature parity with Algolia - see the [feature comparison matrix here](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/). 
We plan to close the gap based on feedback we get from Algolia users switching over to Typesense.

### Key Features in Algolia, not in Typesense

- Server-side stop-words (can be implemented [client-side](https://github.com/typesense/showcase-books-search/blob/b0b15dc88179566f85db21d2455c2d6c68668d5a/src/app.js#L186-L194))
- Server-side analytics (can be implemented [client-side](./search-analytics.md)).
- Server-side AB-Testing (can be implemented client-side using an AB-Testing framework and using different collections based on the bucket identifier for a user).
- Query Suggestions (can be implemented from search terms in analytics data, and putting them in a separate "suggestions" collection.)
- Optional Filters
- AI/ML Features
  - Dynamic Synonym Suggestion
  - User-level personalization
  - AI Re-Ranking
  - Recommendations
- Indexing nested fields (they need to be flattened to top-level keys in Typesense).
- Querying plurals / singulars of indexed keywords (plurals need to be setup as synonyms in Typesense).

### Key Features in Typesense, not in Algolia

- Multiple (hard) sort orders on a single index (In Algolia you need to create duplicate indices for every hard sort order, eg: sort by price asc, sort by price desc, etc each need a duplicate index in Algolia).
- Validations for field data types when documents are indexed (similar to typed languages) to prevent inconsistent data from getting into the index. (This can be turned off if you need Algolia-like behavior).
- Ability to specify numerical weights for particular fields during search, to give them more priority
- Ability to create aliases for collections
- In general many parameters that are configurable at the index level in Algolia are dynamically configurable at search time in Typesense
- No limits on record size or maximum index size
- Ability to self-host
- Can be run in a Continuous Integration environment since it is self-hostable
- Fully Open Source

## Feature Equivalents

Here is a list of features and terminology, along with what each one is called in Algolia vs Typesense.

| Algolia                                                                                                     | Typesense                                                                                                                                                                                                                                                                                                                                                               |
|:------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Every JSON object you index is called a record                                                              | Every JSON object you index is called a [`Document`](../latest/api/documents.md)                                                                                                                                                                                                                                                                                        |
| A collection of records is called an `Index`                                                                | A collection of records / documents is a called a [`Collection`](../latest/api/collections.md)                                                                                                                                                                                                                                                                          |
| Authentication is done via `Application ID` and `API Key`                                                   | Authentication is done via `x-typesense-api-key`                                                                                                                                                                                                                                                                                                                        |
| Importing records (without validations and schema)                                                          | Create a collection with [auto-schema detection](../latest/api/collections.html#with-auto-schema-detection) and import documents with [`coerce_or_reject`](../latest/api/documents.html#dealing-with-dirty-data)                                                                                                                                                        |
| Query rules                                                                                                 | [Overrides](../latest/api/curation.md) aka Curation                                                                                                                                                                                                                                                                                                                     |
| Merchandising                                                                                               | [Promoting or Excluding results](../latest/api/curation.html#including-or-excluding-documents) via Overrides                                                                                                                                                                                                                                                            |
| Dynamic Filtering                                                                                           | [Dynamic Filtering via Overrides](../latest/api/curation.md#dynamic-filtering)                                                                                                                                                                                                                                                                                          |
| Virtual Index Replicas for sorting                                                                          | In Typesense, a single collection can handle multiple sort orders using [`sort_by`](../latest/api/documents.html#arguments), so virtual index replicas are not needed                                                                                                                                                                                                   |
| Distributed Search Network                                                                                  | Search Delivery Network (in Typesense Cloud)                                                                                                                                                                                                                                                                                                                            |
| Secured or Virtual API Keys                                                                                 | [Scoped API Keys](../latest/api/api-keys.html#generate-scoped-search-key)                                                                                                                                                                                                                                                                                               |
| Setting `searchableAttributes`                                                                              | Fields / attributes to search by can be configured dynamically at search time using the [`query_by`](../latest/api/documents.html#arguments) search parameter.                                                                                                                                                                                                          |
| Setting `attributesForFaceting` for faceting and filtering                                                  | Faceting can be turned on for fields by specifying `facet: true` for the field in the [collection's schema](../latest/api/collections.html#create-a-collection) and then can by changed at search time using [`facet_by`](../latest/api/documents.html#arguments)<br/> In Typesense, filter fields need not be set as facets.                                           |
| Setting `unretrievableAttributes`                                                                           | Can be configured at search time by creating a [Scoped API Key](../latest/api/api-keys.html#generate-scoped-search-key) and embedding the [`exclude_fields`](../latest/api/documents.html#arguments) search parameter                                                                                                                                                   |
| Setting `attributesToRetrieve`                                                                              | Can be configured at search time by creating a [Scoped API Key](../latest/api/api-keys.html#generate-scoped-search-key) and embedding the [`include_fields`](../latest/api/documents.html#arguments) search parameter                                                                                                                                                   |
| Setting `attributeForDistinct` and `distinct`                                                               | Can be configured at search time using the [`group_by` and `group_limit`](../latest/api/documents.html#arguments) search parameters                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                        
| Searching multiple indices (aka Federated Search, aka `multipleQueries`)                                    | [`multi_search`](../latest/api/documents.html#federated-multi-search)                                                                                                                                                                                                                                                                                                   |
| [Ranking and Relevance in Algolia](https://www.algolia.com/doc/guides/managing-results/relevance-overview/) | [Ranking and Relevance in Typesense](./ranking-and-relevance.md).<br/> One key difference in Typesense is that we've tried to simplify the relevance tuning experience, so things work out-of-the-box for most use-cases.                                                                                                                                               |
| [Filtering records](https://www.algolia.com/doc/guides/managing-results/refine-results/filtering/)          | [`filter_by`](../latest/api/documents.html#arguments) search parameter filters records                                                                                                                                                                                                                                                                                  |
| Import API Method `saveObjects`                                                                             | Import documents using [`/collections/<collection_name>/documents/import`](../latest/api/documents.md#import-documents) endpoint                                                                                                                                                                                                                                        |
| Exporting records using [`browseObjects`](https://www.algolia.com/doc/api-reference/api-methods/browse/)    | Export documents using the [`/collections/collection_name/documents/export`](../latest/api/documents.html#export-documents) endpoint                                                                                                                                                                                                                                    |
| GeoSearch with `aroundRadius`, `aroundLatLng`, `insidePolygon`, `aroundPrecision`                           | [GeoSearch with Typesense](../latest/api/documents.html#geosearch)                                                                                                                                                                                                                                                                                                      |
| `separatorsToIndex`                                                                                         | [`symbols_to_index`](../latest/api/collections.html#schema-arguments) setting when creating a collection                                                                                                                                                                                                                                                                |
| `removeWordsIfNoResults`                                                                                    | [`drop_tokens_threshold`](../latest/api/documents.html#arguments) search parameter                                                                                                                                                                                                                                                                                      |
| `disablePrefixOnAttributes`                                                                                 | [`prefix=false,false,true`](../latest/api/documents.html#arguments) search parameter corresponding to the fields in `query_by`                                                                                                                                                                                                                                          |
| `disableTypoToleranceOnAttributes`                                                                          | [`num_typos=false,false,true`](../latest/api/documents.html#arguments) search parameter corresponding to the fields in `query_by`                                                                                                                                                                                                                                       |

## UI Components

Algolia has built and open-sourced a suite of Search UI libraries for Vanilla JS, React, Vue and Angular called [InstantSearch](https://github.com/algolia/instantsearch.js).

Typesense supports the same InstantSearch widgets, through the [typesense-instantsearch-adapter](https://github.com/typesense/typesense-instantsearch-adapter).
You would just have to install the adapter into your application via `npm` or `yarn` and [configure it](https://github.com/typesense/typesense-instantsearch-adapter#usage),
and your existing UI widgets will work with your Typesense cluster, without any additional changes in most cases. 

A few widgets need [small changes](https://github.com/typesense/typesense-instantsearch-adapter#widget-specific-instructions) to use them with Typesense. 

## Pricing Model

Algolia charges by the number of records and number of searches, and you pay for the max of these two dimensions.
So if you have high traffic and low number of records or low traffic and large number of records, you'll be paying for the larger number of the two.

**Typesense is open source, and can be self-hosted for free.**

Typesense also offers a hosted search product called [Typesense Cloud](https://cloud.typesense.org).
Typesense Cloud pricing is primarily based on the amount of [RAM & CPU](./system-requirements.md) you need to index your data and support your desired traffic concurrency.
It's a flat hourly fee depending on the configuration you choose, plus standard bandwidth charges.
We've seen this pricing model save up to 95% in search costs for users switching from Algolia to Typesense Cloud. 
