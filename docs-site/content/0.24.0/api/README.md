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

This release contains new features, performance improvements and important bug fixes.

### New Features

- **Indexing of nested object fields**: feature must be enabled via the `enable_nested_fields` 
  option during collection creation.
- **Cross-field OR and complex filter expressions**: a filter query like 
  `is_premium: true || (price:> 100 && category: shoes)` is now possible.
- **Vector search**: support for both exact & HNSW-based approximate vector searching.
- **Multi-lingual support**: Chinese, Japanese, Korean, Cyrillic and Thai are now supported via the use of field-level 
  `locale` flag in the collection schema.
- **Optional filtering**: `sort_by` clause can now accept an expression whose result is used for sorting, e.g. 
  `sort_by=_eval(brand:nike):desc,_text_match:desc`.
- **Preset search configurations**: manage your search query parameters by storing them within Typesense as a "preset", 
  that you can refer to during query time. This helps in keeping the query parameters hidden away from public view.

### Enhancements

- New `text_match_type` parameter that allows you to customize how multi-field text relevancy score is computed.
- Improve performance of large collection deletions.
- Ability to clone a collection schema (without documents), overrides and synonyms.
- New highlight structure that mimics the original document structure. Nested fields are highlighted only in this new
  structure, which is returned in a key named `highlight` in the JSON response.
- Allow override rules to be processed past the first match via the `stop_processing` flag (default is `true`).
- Support locale and symbols in synonyms via the `locale` and `symbols_to_index` options during synonym creation.
- Allow cloning of collection schema & linked assets (like synonyms, overrides) from a reference collection.
- Support query replacement action in an override via the `replace_query` option.
- Support an override to be active with a given time window via the `effective_from_ts` and `effective_to_ts` options.
- Support `filter_by` rule in overrides.
- New `--skip-writes` flag for starting Typesense in a mode that does not read writes from the Raft log. This is
  useful when the server has crashed due to some recent bad writes that you want to skip over temporarily.
- New `--memory-used-max-percentage` and `--disk-used-max-percentage` flags for preventing writes when a specified 
  memory/disk threshold is breached.
- Allow the imported documents and their `id`s to be returned in the import response via 
  the `return_doc` and `return_id` options.
- API for compacting the on-disk database via the `POST /operations/db/compact` end-point.

### Bug Fixes

- Fixed some edge cases with schema alteration.
- Fixed a race condition in parallel collection creation that manifested on localhost, especially on Mac.
- Fixed an edge case in highlighting involving non-ASCII unicode characters.
- Fixed sort by string not accounting for accented characters.
- Fixed an edge case in numerical facet field values not being fully removed on deletion.
- Fixed HTTPS POST body buffering removing genuine trailing white space in the chunked payload in some cases.
- Fixed float field validation to handle scientific notation.
- Fixed a bug involving exact filter match on array.
- Fixed a few edge cases that showed up in super-large documents that contained greater than 64,000 tokens.
- Implemented automatic log rotation for RocksDB info logs. Previously, one had to restart the server for truncation or 
  perform external truncation via `logrotate`.

### Deprecations / behavior changes

- The default value for `search_cutoff_ms` is now `30000`, i.e. 30 seconds. If you wish to allow searches to run 
  longer than that, you can pass a higher value as a search parameter.
- Disable text match score bucketing, if there are more buckets than the number of results found. Previously, results 
  were being aggregated into a single score.
- The older `highlights` key in the response is deprecated (but is still returned for now). Use the new `highlight` 
  object in the response for highlighting information.
- The `text_match` key in the response is deprecated (but is still returned for now) in favor of the 
  new `text_match_info` object that returns fine grain matching information, including the score.

## Upgrading

Before upgrading your existing Typesense cluster to v{{ $page.typesenseVersion }}, please review the behavior
changes above to prepare your application for the upgrade.

We'd recommend testing on your development / staging environments before upgrading. 

### Typesense Cloud

If you're on Typesense Cloud:

1. Go to [https://cloud.typesense.org/clusters](https://cloud.typesense.org/clusters).
2. Click on your cluster
3. Click on "Modify Configuration" on the right side pane
4. Schedule a time for the upgrade.

### Self Hosted

If you're self-hosting Typesense, here's how to upgrade:

#### Single node deployment

1. Trigger a snapshot to [create a backup](cluster-operations.md#create-snapshot-for-backups) of your data.
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

1. Trigger a snapshot to [create a backup](cluster-operations.md#create-snapshot-for-backups) of your data 
   on the leader node.
2. On any follower, stop Typesense and replace the binary via the tar package or via the DEB/RPM installer.
3. Start Typesense server back again and wait for node to rejoin the cluster as a follower and catch-up (`/health` should return healthy). 
4. Repeat steps 2 and 3 for the other _followers_, leaving the leader node alone for now.
5. Once all the followers have been upgraded to v{{ $page.typesenseVersion }}, stop Typesense on the leader.
6. The other nodes will elect a new leader and keep working. 
7. Replace the binary on the old leader and start the Typesense server back again. 
8. This node will re-join the cluster as a follower, and we are done.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
