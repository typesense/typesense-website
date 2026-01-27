---
sitemap:
  priority: 0.3
---

# Typesense API Reference for v{{ $page.typesenseVersion }}

This section of the documentation details all the API Endpoints available in Typesense and all the parameters you can use with them.

Use the links on the side navigation bar to get to the appropriate section you're looking for.

To learn how to install and run Typesense, see the [Guide section](https://typesense.org/docs/guide/) instead.

<br/>

## What's new

This release contains important new features, performance improvements and bug fixes.

### New Features

- **Natural Language Search:** Typesense can now detect user intent in natural language queries and convert them into structured search queries using LLMs. 
  This allows a user query like `q: A Honda or BMW with at least 200 hp` to be understood and executed by Typesense as `filter_by: make:[Honda, BMW] && engine_hp:>=200` automatically. ([Docs](https://typesense.org/docs/29.0/api/natural-language-search.html))
- **Dynamic Sorting in Overrides:** Typesense now supports dynamic sorting rules within override definitions, similar to dynamic filtering.
  This enables query-dependent sorting of results through override rules ([Docs](https://typesense.org/docs/29.0/api/curation.html#dynamic-sorting)).
- **Filter multiple properties within a nested array of objects**: You can now scope filter expressions to a specific nested object within an array field ([Docs](https://typesense.org/docs/guide/tips-for-filtering.html#filtering-nested-array-objects)).
- **Streaming support for conversations:** responses from LLM APIs are now directly streamed, allowing you to build interactive chat experiences. ([Docs](https://typesense.org/docs/29.0/api/conversational-search-rag.html#streaming-conversations)).
- **Support adding meta fields to query analytics documents**: You can now pass the `filter_by` search parameter and a new `analytics_tag` search parameter that you can set to any string you need, to be stored with your popular and no-hits queries. This gives you additional context around the search. ([Docs](https://typesense.org/docs/29.0/api/analytics-query-suggestions.html#query-analytics-with-meta-fields)).
- You can now fetch JOIN reference fields in the GET document API ([Docs](https://typesense.org/docs/29.0/api/joins.html#reference-fields-in-document-retrieval))

### Enhancements

- Improved group-by performance and resource usage, especially when high cardinality fields (like `productId`) are used for grouping.
- Improved performance of numeric range queries.
- Return uniform API response structure when `union: true` is set, regardless of number of collections queried.
- Ability to customize RocksDB parameters like write buffer sizes for better performance. ([Docs](https://typesense.org/docs/29.0/api/server-configuration.html#on-disk-db-fine-tuning)).
- Support for filtering with nested object fields in overrides.
- Ability to do image search using user-uploaded images at runtime ([Docs](https://typesense.org/docs/29.0/api/image-search.html#search-for-similar-images-with-dynamic-image)).
- Support for configuring the max `group_limit` via a new server-side parameter called `max-group-limit` ([Docs](https://typesense.org/docs/29.0/api/server-configuration.html#search-limits)).
- Support caching for remote query embeddings via `embedding-cache-num-entries` server-side parameter ([Docs](https://typesense.org/docs/29.0/api/server-configuration.html#resource-usage)).
- Support for sorting when doing a one-to-many JOIN ([Docs](https://typesense.org/docs/29.0/api/joins.html#sorting-on-one-to-many-joins)).
- Support for bucketing on vector distance ([Docs](https://typesense.org/docs/29.0/api/vector-search.html#vector-distance-bucketing)).
- Improved synonym matching when multiple synonym definitions match a given search query. 
- New Cache hit/miss statistics (`cache_hit_count`, `cache_miss_count`, `cache_hit_ratio`) are now exposed in `stats.json`
- Support for Azure OpenAI and Google Gemini in conversation models.
- Support dimension truncation for GCP text embedding models, by setting `num_dim`.
- Add support for Azure OpenAI for embedding generation.
- Support for `document_task` and `query_task` support for GCP text embedding models.
- Support for OpenAI compatible conversation models using the `openai_url` (base) and `openai_path` parameters.
- The region parameter is now configurable for GCP models for text embedding.

### Bug Fixes

- Fixed a few bugs related to updates of deeply nested field values.
- Fixed phrase search queries being stemmed.
- Respect field-level tokenization config in filters.
- Fixed facet sum being wrong when negative values are added.
- Fixed vector query parsing with backticks escaping special characters. 
- Improve reliability of joins during imports.
- Fixed broken `cache-num-entries` server side parameter.
- Exclude x-typesense-user-id from cache key to make cache global. 
- Fixed import of large stemming dictionaries.
- Fixed auth token refreshing problem for GCP-based embedding generation.
- Fixed vector search not working reliably with 3 `sort_by` fields.
- Fixed a bug caused by using `flat_search_cutoff` along with filtering for vector search.
- Tweak rank computation for fusion scoring - two keyword search results with same text match score should have the same keyword search rank.
- Improved reliability of CLIP embeddings under high concurrency.
- Fixed a bug with collection truncation, requiring unnecessary parameters. 
- Fixed a bug where the alter operations endpoint was returning the incorrect document counter.
- Fixed a bug where analytics counters only worked with int32 fields.

### Deprecations / behavior changes

-  For `group_by` queries, the `found` value returned in the response is no longer an exact number. It's an 
   approximation of the number of groups found, and is guaranteed to be within 2% of the actual number of groups found.

## Upgrading

Before upgrading your existing Typesense cluster to v{{ $page.typesenseVersion }}, please review the behavior
changes above to prepare your application for the upgrade.

We'd recommend testing on your development / staging environments before upgrading. 

Follow this [upgrade guide](https://typesense.org/docs/guide/updating-typesense.html), depending on your mode of deployment. 


## Downgrading

If you wish to downgrade back to an earlier version of Typesense server, you can safely downgrade to `v28` or `v27`.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
