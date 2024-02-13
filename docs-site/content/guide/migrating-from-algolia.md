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
you can configure Typesense to automatically detect the schema for you based on the documents you index (See <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#with-auto-schema-detection`">Auto-Schema Detection</RouterLink>.)
You can also configure Typesense to automatically attempt to coerce data types based on the detected schema using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#dealing-with-dirty-data`">`coerce_or_reject`</RouterLink> parameter when importing documents.

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

- Server-side AB-Testing (can be implemented [client-side](./ab-testing.md) using an AB-Testing framework and using different collections based on the bucket identifier for a user)
- Out-of-the-box AI/ML Features
  - Dynamic Synonym Suggestion
  - Out-of-the-box event tracking
  - Out-of-the-box user-level personalization (can be implemented by bringing the output of machine learning models into Typesense. Read more [here](./personalization.md#user-level-personalization))
  - Out-of-the-box recommendations ([Here's](./recommendations.md) a guide on how to implement recommendations in Typesense using ML models and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">Vector Search</RouterLink>).

### Key Features in Typesense, not in Algolia

- Multiple (hard) sort orders on a single index (In Algolia you need to create duplicate indices for every hard sort order, eg: sort by price asc, sort by price desc, etc each need a duplicate index in Algolia)
- Validations for field data types when documents are indexed (similar to typed languages) to prevent inconsistent data from getting into the index. (This can be turned off if you need Algolia-like behavior)
- Ability to specify numerical weights for particular fields during search, to give them more priority
- Ability to store vectors from your own machine learning models and do <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">nearest neighbor searches</RouterLink>
- Ability to use embedding models like OpenAI, PaLM API or built-in models like S-BERT, E-5, etc in order to implement hybrid (semantic + keyword) search and integrate with Large Language Models (LLMs). 
- Ability to create <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collection-alias.html`">aliases</RouterLink> for collections, like symlinks
- In general many parameters that are configurable at the index level in Algolia are dynamically configurable at search time in Typesense, which gives you more flexibility
- No limits on record size, maximum index size, number of synonyms, number of rules or number of indices
- Ability to self-host
- Can be run in a Continuous Integration environment since it is self-hostable
- Fully Open Source

## Equivalent Features and Concepts

Here is a list of common features and concepts along with what each one is called in Algolia vs Typesense.

### Terminology

| Algolia                                        | Typesense                                                                                                                                                         |
|:-----------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Every JSON object you index is called a record | Every JSON object you index is called a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html`">`Document`</RouterLink>               |
| A collection of records is called an `Index`   | A collection of records / documents is a called a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">`Collection`</RouterLink> |
| Distributed Search Network                     | Search Delivery Network (in Typesense Cloud)                                                                                                                      |
| NeuralSearch                                   | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#hybrid-search`">Hybrid Search</RouterLink>, which is essentially Semantic Search + Keyword Vector Search with automatic embedding generation.

### Features

| Algolia                                                                                                                | Typesense                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|:-----------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authentication is done via `Application ID` and `API Key`                                                              | Authentication is done via `x-typesense-api-key`                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Secured or Virtual API Keys                                                                                            | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">Scoped API Keys</RouterLink>                                                                                                                                                                                                                                                                                                                                                   |
| Importing records (without validations and schema)                                                                     | Create a collection with <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#with-auto-schema-detection`">auto-schema detection</RouterLink> and import documents with <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#dealing-with-dirty-data`">`coerce_or_reject`</RouterLink>                                                                                                                                           |
| Query rules                                                                                                            | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/curation.html`">Overrides</RouterLink> aka Curation (Typesense Cloud also has a drag-drop management interface for Overrides).                                                                                                                                                                                                                                                                                            |
| [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/)    | Also called [Query Suggestions](./query-suggestions.md) in Typesense. Can be created with <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/analytics-query-suggestions.html`">Analytics Rules</RouterLink>.                                                                                                                                                                                                                                                                |
| Merchandising                                                                                                          | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/curation.html#including-or-excluding-documents`">Promoting or Excluding results</RouterLink> via Overrides, or at search time via the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`pinned_hits` or `hidden_hits`</RouterLink> search parameter                                                                                                                     |
| Dynamic Filtering                                                                                                      | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/curation.html#dynamic-filtering`">Dynamic Filtering via Overrides</RouterLink>                                                                                                                                                                                                                                                                                                                                            |
| Virtual Index Replicas for sorting                                                                                     | In Typesense, a single collection can handle multiple sort orders using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`sort_by`</RouterLink>, so virtual index replicas are not needed                                                                                                                                                                                                                                                  |
| Searching multiple indices (aka Federated Search, aka `multipleQueries`)                                               | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#federated-multi-search`">`multi_search`</RouterLink>                                                                                                                                                                                                                                                                                                                                                       |
| [Ranking and Relevance in Algolia](https://www.algolia.com/doc/guides/managing-results/relevance-overview/)            | [Ranking and Relevance in Typesense](./ranking-and-relevance.md).<br/><br/>One key difference in Typesense is that we've tried to simplify the relevance tuning experience, so things work out-of-the-box for most use-cases and we've tried to keep the number of knobs needed to a minimum.                                                                                                                                                                                                |
| [Filtering records](https://www.algolia.com/doc/guides/managing-results/refine-results/filtering/)                     | [<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`filter_by`</RouterLink> search parameter filters documents                                                                                                                                                                                                                                                                                                                              |
| [Faceting records](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/)                       | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`facet_by`</RouterLink> search parameter facets documents                                                                                                                                                                                                                                                                                                                                 |
| [Grouping records](https://www.algolia.com/doc/guides/managing-results/refine-results/grouping/)                       | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`group_by`</RouterLink> search parameter groups documents                                                                                                                                                                                                                                                                                                                                 |
| GeoSearch with `aroundRadius`, `aroundLatLng`                                                                          | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#geosearch`">GeoSearch with Typesense</RouterLink>                                                                                                                                                                                                                                                                                                                                                          |
| GeoSearch with `insidePolygon`                                                                                         | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#searching-within-a-geo-polygon`">GeoSearch inside a polygon</RouterLink>                                                                                                                                                                                                                                                                                                                                   |
| GeoSearch with `insideBoundingBox`                                                                                     | If the diagonal ends of the bounding box are the coordinates `[A,X]` and `[B,Y]`, you can get the other two coordinates of the bounding box using this pattern: `[A,Y]` and `[B,X]` (essentially interchanging the individual lat / lng). With these 4 coordinates, you can now use Typesense's <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#searching-within-a-geo-polygon`">polygon GeoSearch feature</RouterLink> to search inside the bounding box. |
| Controlling GeoSearch precision with `aroundPrecision`                                                                 | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#exclude-radius`">`geo_precision` and `exclude_radius`</RouterLink>                                                                                                                                                                                                                                                                                                                                         | 

### Configuration

| Algolia                                                                                    | Typesense                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|:-------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `searchableAttributes`                                                                     | All fields / attributes that need to be indexed are configured when <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#create-a-collection`">creating a collection</RouterLink>, and then you can choose to use a subset of fields at search time dynamically using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`query_by`</RouterLink> search parameter.                                                                                              |
| `attributesForFaceting` for faceting and filtering                                         | Faceting can be turned on for fields by specifying `facet: true` for the field in the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#create-a-collection`">collection's schema</RouterLink> and then can by changed at search time using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`facet_by`</RouterLink><br/> In Typesense, filter fields need not be set as facets.                                                                               |
| `unretrievableAttributes`                                                                  | Can be configured at search time by creating a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">Scoped API Key</RouterLink> and embedding the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`exclude_fields`</RouterLink> search parameter                                                                                                                                                                                       |
| `attributesToRetrieve`                                                                     | Can be configured at search time by creating a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">Scoped API Key</RouterLink> and embedding the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`include_fields`</RouterLink> search parameter                                                                                                                                                                                       |
| `attributeForDistinct` and `distinct`                                                      | Can be configured at search time using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`group_by` and `group_limit`</RouterLink> search parameters                                                                                                                                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                        
| `separatorsToIndex`                                                                        | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#schema-arguments`">`symbols_to_index`</RouterLink> setting when creating a collection                                                                                                                                                                                                                                                                                                                                                                          |
| `removeWordsIfNoResults`                                                                   | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`drop_tokens_threshold`</RouterLink> search parameter                                                                                                                                                                                                                                                                                                                                                                                           |
| `disablePrefixOnAttributes`                                                                | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`prefix=false,false,true`</RouterLink> search parameter corresponding to the fields in `query_by`                                                                                                                                                                                                                                                                                                                                               |
| `disableTypoToleranceOnAttributes`                                                         | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`num_typos=false,false,true`</RouterLink> search parameter corresponding to the fields in `query_by`                                                                                                                                                                                                                                                                                                                                            |
| [`customRanking`](https://www.algolia.com/doc/api-reference/api-parameters/customRanking/) | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">Up to 3 sort_by parameters can be specified in the [`sort_by`</RouterLink> search parameter. <br><br>Eg: `sort_by=_text_match(buckets: 10):desc,custom_field_1:desc,custom_field_2:desc` <br><br> As of v0.23.0, this divides the result set into 10 buckets from most relevant results to the least relevant, and forces all items in one bucket into a tie, which causes your custom ranking field to be used for ranking within each bucket. |

### API

| Algolia                                                                                                      | Typesense                                                                                                                                                                                                                                           |
|:-------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Importing / Indexing Documents with `saveObjects`                                                            | Import documents using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">`/collections/<collection_name>/documents/import`</RouterLink> endpoint with `action=upsert`                    |
| `partialUpdateObjects` with `createIfNotExists: true`                                                        | Import documents using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">`/collections/<collection_name>/documents/import`</RouterLink> endpoint with `action=emplace` (as of `v0.23.0`) |
| Exporting records using the [`browseObjects`](https://www.algolia.com/doc/api-reference/api-methods/browse/) | Export documents using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#export-documents`">`/collections/collection_name/documents/export`</RouterLink> endpoint                                                   |
| [`searchForFacetValues`](https://www.algolia.com/doc/api-reference/api-methods/search-for-facet-values/)     | <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`facet_query`</RouterLink> search parameter                                                                                                      |

## Migrating Frontend UI components

Algolia has built and open-sourced a suite of Search UI libraries for Vanilla JS, React, Vue and Angular called [InstantSearch](https://github.com/algolia/instantsearch.js).

Typesense supports the same InstantSearch widgets, through the [typesense-instantsearch-adapter](https://github.com/typesense/typesense-instantsearch-adapter).
You would just have to install the adapter into your application via `npm` or `yarn` and [configure it](https://github.com/typesense/typesense-instantsearch-adapter#usage),
and your existing UI widgets will work with your Typesense cluster, without any additional changes in most cases. 

A few widgets need [small changes](https://github.com/typesense/typesense-instantsearch-adapter#widget-specific-instructions) to use them with Typesense.

## Migrating Data from Algolia into Typesense

You'd typically want to update your application's backend that currently sends JSON data into Algolia, to send the same JSON data to Typesense.
This way you're sending data directly from your primary data store into Typesense.

But if you want a quick way to do a one-time export of your data in Algolia into Typesense, to explore Typesense or to do a backfill, here's how:

### Step 1: Export the data from Algolia

Install the [Algolia CLI](https://www.algolia.com/doc/tools/cli/get-started/overview/) and then run:

```shell
algolia objects browse YOUR_INDEX_NAME > documents-raw.jsonl
```

This will export your Algolia records into a JSONL file.

### Step 2: Transform the data

#### ID fields
Algolia uses a field called `objectId` to uniquely identify records and Typesense uses a field called `id` for the same purpose. 

So let's use [`jq`](https://jqlang.github.io/jq/) to copy the value of the `objectId` field to a new field called `id` in the JSONL file we downloaded above:

```shell
jq -c '(to_entries[] | select(.key | ascii_downcase == "objectid")).key as $key | .["id"] = .[$key]' documents-raw.jsonl > documents-with-ids.jsonl
```

#### Timestamps (optional)

To be able to sort by date/timestamps, you would need to convert any date/timestamps in iso8601 to a Unix timestamp (epoch time). 

Here's a one-liner to do this:

```shell
jq -c 'if .your_iso_timestamp_field then .your_iso_timestamp_field |= (sub("\\.[0-9]+"; "") | strptime("%Y-%m-%dT%H:%M:%SZ") | mktime) else . end' documents-with-ids.jsonl > documents.jsonl
```

### Step 3: Create a collection

Create a collection in Typesense following the instructions <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">here</RouterLink>.

You want to set `facet: true` for any fields you've configured as a facetable field in Algolia.

[Here's](https://github.com/typesense/typesense-collection-schema-generator/blob/master/README.md) a little utility to help you generate a first-draft Typesense Collection schema from a sample JSON object from your dataset: 

```bash
npx typesense-collection-schema-generator@latest <path_to_input_json_document_file> <path_to_output_typesense_collection_schema_json_file>
```

### Step 4: Import your documents

You can now <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#import-a-jsonl-file`">import</RouterLink> the transformed JSONL file from above into your
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#create-a-collection`">Typesense Collection</RouterLink>
using this snippet:

```shell
export TYPESENSE_API_KEY=xyz
export TYPESENSE_HOST=xxx.a1.typesense.net
export TYPESENSE_PROTOCOL=https
export TYPESENSE_COLLECTION_NAME=YOUR_INDEX_NAME

#  We're parallelize-ing the import using the `parallel` command (make sure you install it first):

parallel --block -5 -a documents.jsonl --tmpdir /tmp --pipepart --cat 'curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST -T {} "${TYPESENSE_PROTOCOL}://${TYPESENSE_HOST}/collections/${TYPESENSE_COLLECTION_NAME}/documents/import?action=upsert"'
```

:::tip Tips
- Increase `-5` in the command above to a larger number to reduce the size of each chunk being imported into Typesense.
- If you see a "Bad Request" or "Connection Refused" error, you might need to adjust the escaping / quotes in the command above for your particular shell.
- If you see a 404, please make you have <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#create-a-collection`">created your Typesense Collection</RouterLink> before running the import command above.
:::

### Step 5: Import query rules

If you use Algolia's Query Rules feature to curate your search results based on conditions, you can import those rules using this utility we've put together:

```bash
npx algolia-query-rules-to-typesense@latest <path/to/algolia_rules_export.json> <path/to/typesense_overrides_output.json>
```

To get the Algolia rules export file, go to the "Rules" section of your Algolia index, and you'll find a download icon to export the rules as JSON.

You can then import these converted JSON rules (`typesense_overrides_output.json`) into Typesense using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/curation.html`">Typesense Overrides API</RouterLink>.

## Geo-Distributed Clusters

Algolia calls their Geo-Distributed CDN-like search offering [Distributed Search Network](https://www.algolia.com/doc/guides/scaling/distributed-search-network-dsn/), and is only available for customers who pay annually, as a paid add-on.

In Typesense Cloud, Geo-Distributed CDN-like search offering is called a Search Delivery Network, and is available to all users as a configuration you can choose when you create a new cluster.  

## Pricing Model

Algolia charges by the number of records and number of searches (or key strokes if you've implemented search-as-you-type), and you pay for the max of these two dimensions, along with overages if you go over your plan limit.
So if you have high traffic and low number of records or low traffic and large number of records, you'll be paying for the larger number of the two.

**Typesense is free and open source, and can be self-hosted for free.**

Typesense also offers a hosted search service called [Typesense Cloud](https://cloud.typesense.org).
Typesense Cloud pricing is based on the amount of [RAM & CPU](./system-requirements.md) you need to index your data and support your desired traffic concurrency respectively.
It's a flat hourly fee depending on the configuration you choose, plus standard bandwidth charges, similar to AWS, GCP, etc.
There are no per-record or per-search charges unlike Algolia. You can throw as much traffic or data at your cluster as it can handle. 
We've seen this pricing model save up to 95% in search costs for users switching from Algolia to Typesense Cloud.

## Algolia Migration Support

If you plan to migrate to Typesense Cloud from Algolia, we offer FREE [migration consulting support](https://cloud.typesense.org/pricing#switching-from-algolia) with different levels of service based on your Algolia usage.
