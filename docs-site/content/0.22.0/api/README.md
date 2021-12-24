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

This release contains new features, performance improvements and important bug fixes.

### New Features

- Customizable word separators: define a list of special characters via the `token_separators` configuration 
  during schema creation. These characters are then used as word separators, _in addition_ to space and new-line characters.
- Index and search special characters: define a list of special characters that will be indexed as text via the 
  `symbols_to_index` configuration during schema creation.
- Dynamic filtering based on rules: overrides now support a `filter_by` clause that can apply filters dynamically to query rules defined in the override.
- Server side caching: cache search requests for a configurable amount of time to improve perceived latencies on heavy queries. Refer to the `use_cache` and `cache_ttl` parameters. By default, caching is disabled.
- Protection against expensive queries via the use of `search_cutoff_ms` parameter that attempts to return results early when the cutoff time has elapsed. This is not a strict guarantee and facet computation is not bound by this parameter.
- Added `geo_precision` sorting option to geo fields. This will bucket geo points into "groups" determined by the given precision value, such that points that fall within the same group are treated as equal, and the next sorting field can be considered for ranking.

### Enhancements

- Reduced memory consumption: 20-30% depending on the shape of your data.
- Improved update performance: updates on string fields are now 5-6x faster.
- Improved search performance: 20-25% faster on a variety of datasets we tested on. 
- Improved parallelization for multi-collection writes: collections are now indexed independently, making indexing much faster when you are writing to hundreds of collections at the same time.
- Allow exhaustive searching via the `exhaustive_search` parameter. Setting `?exhaustive_search=true` will make Typesense consider _all_ prefixes and typo corrections of the words in the query without stopping early when enough results are found (`drop_tokens_threshold` and `typo_tokens_threshold` configurations are ignored).
- Exact filtering on strings (using the `:=` operator) no longer requires the field to be facetable.
- Make minimum word length for 1-char typo and 2-char typos configurable via `min_len_1typo` and `min_len_2typo` parameters. Defaults are 4 and 7 respectively.
- Support filtering by document `id` in filter_by query.
- Support API key permission for creating a specific collection: previously, there was no way to generate an API key that allows you to create a collection with a specific name.
- Allow use of type `auto` for a field whose name does not contain a regular expression.
- Geosearch filter automatically sorts the geo points for the polygon in the correct order: so you don't have to define them in counter clockwise order anymore.

### Bug Fixes

- Fixed edge cases in import of large documents where sometimes, imports hanged mysteriously or ended prematurely.
- Fixed document with duplicate IDs within an import upsert batch being imported as two separate documents.
- Fixed fields with names that contain a regular expression acting as an `auto` type instead of respecting the schema type.
- Fixed a few edge cases in multi-field searching, especially around field weighting and boosting.
- Fixed deletion of collections with slashes or spaces in their names not working: you can now URL encode the names while calling the API.

### Deprecations / behavior changes

- Once you upgrade your Typesense server to `v0.22`, the data directory cannot be used with
  `v0.21.0` binary again. So, please take a snapshot/backup of the data directory before upgrading. 
- The `drop_tokens_threshold` and `typo_tokens_threshold` now default to a value of `1`. 
  If you were relying on the earlier defaults (`10` and `100` respectively), please set these parameters explicitly.
- Minimum word length for 1-char typo correction has been increased to 4. 
  Likewise, minimum length for 2-char typo has been increased to 7. This has helped to reduce false fuzzy matches.
  You can use the `min_len_1typo` and `min_len_2typo` parameters to customize these default values.
- The `id` field cannot be part of the collection schema anymore. You can filter on the implicit `id` field (via `filter_by`)
  but it cannot be queried upon (via `q` and `query_by`). If you wish to search on an identifier, you can define a
  custom field name like `_id` and use that.

## Upgrading

Before upgrading your existing Typesense cluster to v{{ $page.typesenseVersion }}, please review the behavior 
changes above to prepare your application for the upgrade.

### Single node deployment

1. Trigger a snapshot to [create a backup](cluster-operations.html#create-snapshot-for-backups) of your data.
2. Stop Typesense server.
3. Replace the binary via the tar package or via the DEB/RPM installer. 
4. Start Typesense server back again.

### Multi-node deployment

To upgrade a multi-node cluster, we will be proceeding node by node. 

**NOTE:** During the upgrade, we have to ensure that the leader of the cluster is using the **older** Typesense version. 
So we will upgrade the leader last. You can determine whether a node is a leader or follower by the value of the `state` 
field in the `/debug` end-point response.

|State|Role|
|-----|----|
|1|LEADER|
|4|FOLLOWER|

1. Trigger a snapshot to [create a backup](cluster-operations.html#create-snapshot-for-backups) of your data 
   on the leader node.
2. On any follower, stop Typesense and replace the binary via the tar package or via the DEB/RPM installer.
3. Start Typesense server back again and wait for node to rejoin the cluster as a follower and catch-up. 
4. Repeat steps 2 and 3 for the other _followers_, leaving the leader node alone for now.
5. Once all the followers have been upgraded to v{{ $page.typesenseVersion }}, stop Typesense on the leader.
6. The other nodes will elect a new leader and keep working. 
7. Replace the binary on the old leader and start the Typesense server back again. 
8. This node will re-join the cluster as a follower, and we are done.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

## Downgrading

If you need to downgrade back to `v0.21.0` of Typesense for any reason, we've published a patched version `v0.21.1` with some backported changes that allow a v0.21 node to be started on a data directory that was previously upgraded by a `v0.22.0` upgrade. The other option is to clear the data directory (which will wipe out all data), install a previous version afresh and then re-index your data.

<RedirectOldLinks />
