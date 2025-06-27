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

- **Natural Language Search:** Added support for converting natural language queries into structured search filters using LLMs. 
  This allows queries like `A Honda or BMW with at least 200 hp` to be understood and executed by Typesense ([PR#2357](https://github.com/typesense/typesense/pull/2357))
- **Dynamic Sorting in Overrides:** Typesense now supports dynamic sorting rules within override definitions, similar to dynamic filtering.
  This enables query-dependent sorting of results through override rules ([#2386](https://github.com/typesense/typesense/pull/2386)).
- **Filter for two properties within a nested object array**: added ability to scope filter expressions to a specific 
  nested object within an array field ([PR#2268](https://github.com/typesense/typesense/pull/2268)).
- **Streaming support for conversations:** responses from LLM APIs are now directly streamed, allowing you to build interactive chat experiences. ([PR#2246](https://github.com/typesense/typesense/pull/2246)).
- **Support adding meta fields to query analytics documents**: You can now pass `filter_by` and `analytics_tag` fields along ([PR#2204](https://github.com/typesense/typesense/pull/2204)).

### Enhancements

- Improved group-by performance and resource usage, especially when high cardinality fields (like `productId`) are used for grouping.
- Support fetching reference fields in the GET document API ([PR#2379](https://github.com/typesense/typesense/pull/2379))
- Return uniform API response structure when `union: true` is set, regardless of number of collections queried.
- Optimization that speed up numeric range queries.
- Tweak rank computation for fusion scoring: Two keyword search results with same text match score should have the same keyword search rank  ([PR#2185](https://github.com/typesense/typesense/pull/2185)).
- Configurable RocksDB parameters: customize RocksDB parameters like write buffer sizes for better performance.
- Add support for filtering with nested object fields in collection overrides ([PR#2353](https://github.com/typesense/typesense/pull/2353)).
- Add Azure OpenAI and Gemini support for conversation models ([PR#2336](https://github.com/typesense/typesense/pull/2336)).
- Add GCP support for conversation models ([PR#2297](https://github.com/typesense/typesense/pull/2297)).
- Add task type support for GCP embedding models ([PR#2301](https://github.com/typesense/typesense/pull/2301)).
- Support query by image ([PR#2307](https://github.com/typesense/typesense/pull/2307)).
- Support for custom OpenAI conversation model path ([PR#2281](https://github.com/typesense/typesense/pull/2281)).
- Make `group_limit` configurable: a new server-side parameter called `max-group-limit` that allows customization of the maximum value that can be used in the group_limit search parameter ([PR#2275](https://github.com/typesense/typesense/pull/2275)).
- Support caching for remote query embeddings ([PR#2260](https://github.com/typesense/typesense/pull/2260)).
- Support multiple matches in collection joins for sorting ([PR#2258](https://github.com/typesense/typesense/pull/2258)).
- Add bucketing support for sorting by vector distance ([PR#2255](https://github.com/typesense/typesense/pull/2255)).
- Parameterize OpenAI embedding path ([PR#2251](https://github.com/typesense/typesense/pull/2251)).
- Support custom OpenAI compatible servers for conversation models ([PR#2239](https://github.com/typesense/typesense/pull/2239)).
- Add dimension truncation support for GCP models ([PR#2235](https://github.com/typesense/typesense/pull/2235)).
- Add support for Azure OpenAI for embedding generation ([PR#2176](https://github.com/typesense/typesense/pull/2176)).
- Improved synonym matching when multiple synonym definitions match a given search query. 
- Cache hit/miss statistics (`cache_hit_count`, `cache_miss_count`, `cache_hit_ratio`) are now exposed in `metrics.json`
- The region parameter is now configurable for GCP models for text embedding.

### Bug Fixes

- Fixed a few bugs related to updates of deeply nested field values.
- Fixed phrase search queries being stemmed.
- Respect field-level tokenization config in filters ([PR#2292](https://github.com/typesense/typesense/pull/2292)).
- Fixed facet sum being wrong when negative values are added.
- Fixed vector query parsing with backticks escaping special characters. 
- Improve reliability of joins during imports.
- Fixed broken `cache-num-entries` server side parameter.
- Exclude x-typesense-user-id from cache key to make cache global. 
- Fixed import of large stemming dictionaries.
- Fixed auth token refreshing problem for GCP-based embedding generation.
- Fixed vector search not working reliably with 3 `sort_by` fields.
- Fixed a bug caused by using `flat_search_cutoff` along with filtering for vector search.
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
