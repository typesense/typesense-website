---
sitemap:
  priority: 0.3
---

# Typesense API Reference for v{{ $page.typesenseVersion }}

This section of the documentation details all the API Endpoints available in Typesense and all the parameters you can use with them.

Use the links on the side navigation bar to get to the appropriate section you're looking for.

To learn how to install and run Typesense, see the [Guide section](/guide/README.md) instead.

<br/>

## What's new

This release contains important new features, performance improvements and bug fixes.

### New Features

- Support union / merging of search results across collections containing similar type of fields. ([PR#2051](https://github.com/typesense/typesense/pull/2051))
- Dictionary based stemming: stemming is now configurable through an import of a custom dictionary that maps a word to a root form. ([PR#2062](https://github.com/typesense/typesense/pull/2062))
- Allow search results to be randomized via `sort_by=_rand(seed)` clause. ([PR#1918](https://github.com/typesense/typesense/pull/1918))
- Ability to re-rank hybrid search hits by augmenting their keyword / semantic match score when the hit was identified by only either keyword or vector search. ([PR#1968](https://github.com/typesense/typesense/pull/1968))
- Support decay functions in `sort_by` to support gaussian, linear, and exponential decay of values. ([PR#2036](https://github.com/typesense/typesense/pull/2036))
- Field level `token_separators` and `symbols_to_index` are now supported. ([PR#2118](https://github.com/typesense/typesense/pull/2118))
- Support bucketing of text match scores based on `bucket_size` parameter. ([PR#2120](https://github.com/typesense/typesense/pull/2120))
- Ability to truncate a collection. ([PR#2127](https://github.com/typesense/typesense/pull/2127))
- Index and search on geo polygons. ([PR#2150](https://github.com/typesense/typesense/pull/2150))
- Support `validate_field_names` parameter to disable field name validation in faceting, filtering and grouping operations.

### Enhancements

- Support `distance_threshold` parameter for vector query that uses inner product distance.
- Allow updating of remote model's `api_key` parameter. ([PR#1944](https://github.com/typesense/typesense/pull/1944))
- Support `max_filter_by_candidates` search parameter that controls the number of similar words that Typesense considers during fuzzy search on `filter_by` values (default is `4`).
- Performance and stability fixes for joins.
- API endpoint that returns status of alter schema operations that are in-progress. ([PR#2123](https://github.com/typesense/typesense/pull/2123))
- Faceting performance improvements.

### Bug Fixes

- Fixed fields with `async_reference` property not being restored correctly on restart. 
- Fixed sorting with nested reference fields.
- Addressed edge cases in conversation API.
- Assign default sorting score if reference is not found while sorting by a reference field.
- Fix `distance_threshold` in `vector_query` not working correctly while sorting.
- Add validation to ensure that embedding fields are of type `float[]`.
- Fix vector query format validation error messages.
- Fix race condition in high concurrency image embedding.
- Fix `flat_search_cutoff` not working for hybrid search.

### Deprecations / behavior changes

There are no deprecations / behavior changes in this release.

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
