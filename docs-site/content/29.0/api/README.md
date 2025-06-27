---
sitemap:
  priority: 0.7
---

# Typesense API Reference for v{{ $page.typesenseVersion }}

This section of the documentation details all the API Endpoints available in Typesense and all the parameters you can use with them.

Use the links on the side navigation bar to get to the appropriate section you're looking for.

To learn how to install and run Typesense, see the [Guide section](/guide/README.md) instead.

<br/>

## What's new

This release contains important new features, performance improvements and bug fixes.

### New Features

- **Natural Language Search:** Typesense can now convert natural language queries into structured search queries for you, using LLMs. 
  This allows a user query like `q: A Honda or BMW with at least 200 hp` to be understood and executed by Typesense as `filter_by: make:[Honda, BMW] && engine_hp:>=200` automatically. ([Docs](./natural-language-search.md))
- **Dynamic Sorting in Overrides:** Typesense now supports dynamic sorting rules within override definitions, similar to dynamic filtering. 
  This enables query-dependent sorting of results through override rules ([Docs](./curation.md#dynamic-sorting)).
- **Filter for two properties within a nested array of objects**: You can now scope filter expressions to a specific nested object within an array field ([Docs](./../../guide/tips-for-filtering.md#filtering-nested-array-objects)).
- **Streaming support for conversations:** responses from LLM APIs are now directly streamed, allowing you to build interactive chat experiences. ([Docs](./conversational-search-rag.md#streaming-conversations)).
- **Support adding meta fields to query analytics documents**: You can now pass the `filter_by` search parameter and a new `analytics_tag` search parameter that you can set to any string you need, to be stored with your popular and no-hits queries. This gives you additional context around the search. ([Docs](./analytics-query-suggestions.md#query-analytics-with-meta-fields)).
- You can now fetch JOIN reference fields in the GET document API ([Docs](./joins.md#reference-fields-in-document-retrieval))

### Enhancements

- Improved group-by performance and resource usage, especially when high cardinality fields (like `productId`) are used for grouping.
- Improved performance of numeric range queries.
- Return uniform API response structure when `union: true` is set, regardless of number of collections queried.
- Ability to customize RocksDB parameters like write buffer sizes for better performance. ([Docs](./server-configuration.md#on-disk-db-fine-tuning)).
- Support for filtering with nested object fields in overrides.
- Ability to do image search using user-uploaded images at runtime ([Docs](./image-search.md#search-for-similar-images-with-dynamic-image)).
- Support for configuring the max `group_limit` via a new server-side parameter called `max-group-limit` ([Docs](./server-configuration.md#search-limits)).
- Support caching for remote query embeddings via `embedding-cache-num-entries` server-side parameter ([Docs](./server-configuration.md#resource-usage)).
- Support for sorting when doing a one-to-many JOIN ([Docs](./joins.md#sorting-on-one-to-many-joins)).
- Support for bucketing on vector distance ([Docs](./vector-search.md#vector-distance-bucketing)).
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

### Typesense Cloud

If you're on Typesense Cloud:

1. Go to [https://cloud.typesense.org/clusters](https://cloud.typesense.org/clusters).
2. Click on your cluster
3. Click on "Cluster Configuration" on the left-side pane, and then click on "Modify"
4. Select a new Typesense Server version in the dropdown
5. Schedule a time for the upgrade.

### Self Hosted

If you're self-hosting Typesense, here's how to upgrade:

#### Single node deployment

1. Trigger a snapshot to [create a backup](https://typesense.org/docs/28.0/api/cluster-operations.html#create-snapshot-for-backups) of your data, for safety purposes.
2. Stop Typesense server.
3. Replace the binary via the tar package or via the DEB/RPM installer. 
4. Start Typesense server back again.

#### Multi-node deployment

To upgrade a multi-node cluster, we will be proceeding node by node to ensure the cluster remains healthy during the rolling upgrade.

**NOTE:** During the upgrade, we have to ensure that the leader of the cluster is using the **older** Typesense version. 
So we will upgrade the leader last. You can determine whether a node is a leader or follower by the value of the `state` 
field in the `/debug` end-point response.

| State | Role     |
|-------|----------|
| 1     | LEADER   |
| 4     | FOLLOWER |

1. Trigger a snapshot to [create a backup](https://typesense.org/docs/28.0/api/cluster-operations.html#create-snapshot-for-backups) of your data 
   on the leader node.
2. On any follower, stop Typesense and replace the binary via the tar package or via the DEB/RPM installer.
3. Start Typesense server back again and wait for node to rejoin the cluster as a follower and catch-up (`/health` should return healthy). 
4. Repeat steps 2 and 3 for the other _followers_, leaving the leader node uninterrupted for now.
5. Once all followers have been upgraded to v{{ $page.typesenseVersion }}, stop Typesense on the leader.
6. The other nodes will elect a new leader and keep working. 
7. Replace the binary on the old leader and start the Typesense server back again. 
8. This node will re-join the cluster as a follower, and we are done.


## Downgrading

If you wish to downgrade back to an earlier version of Typesense server, you can safely downgrade to `v27`.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
