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

- Enable/disable typo tolerance on alphanumerical words in the query via the 
  `enable_typos_for_alpha_numerical_tokens` search parameter. Default: `true`.
- Storing the history of the conversational search feature as a regular Typesense collection.
- Support synonyms on query prefixes and typo-corrected query tokens via the `synonym_prefix` 
  and `synonym_num_typos` parameters. Defaults to `synonym_prefix: false` and `synonym_num_typos: 0`.
- Support nested reference collections in `include_fields` search parameter, e.g. `$Coll_B(title, $Coll_A(title))`
- Customization of faceting index used for search via the `facet_index_type` parameter.
- Support `sort_by` of nested join field.
- Allow joining in export of documents.
- Add `sum_score` mode for `text_match_type` which sums the field-level text match scores to arrive at a document-level score.

### Enhancements

- Added `enable_synonyms` boolean flag to enable/disable the application of synonyms during search (default: `true`).
- Added `filter_curated_hits` search parameter which allows you to customize filter behavior for pinned hits.
- Added `filter-by-max-ops` server-side flag that can customize the maximum number of operators that can be present 
  in a `filter_by` clause (default: `100`).
- Collection listing API now respects the collections allowed in the API key associated with the request.
- Use 64K page size for Jemalloc on ARM64 / Linux.
- Added `--max-per-page` server-side flag that increases the number of hits that can be fetched within a single page. Default: `250`. 
- Implemented lazy filtering of numerical fields which speeds up a subset of searches when `enable_lazy_filter` boolean parameter is enabled.
- Log in-flight search queries during a crash.
- Added search parameter `enable_analytics` that prevents the given query from being used for analytics aggregation.
- Suppress punctuations and non-speech tokens from appearing in voice search (e.g. `hmm`).
- Support array fields in `facet_return_parent` search parameter. 
- Increase max length of facet value stored to `255` characters.
- Allow special characters in range facet labels.
- Added API key support for vLLM conversation models.
- Allow dynamic update of cache size via the `/config` API with the `cache-num-entries` key.
- Support exact prefix value filtering via the `:=` operation. For example, given `filter_by: name:= S*`.
  we will match `Steve Jobs` but NOT `Adam Stator`.
- Support `include_fields` and `exclude_fields` in the single document fetch end-point.

### Bug Fixes

- Fixed a few bugs in the use of conversational search feature on a HA set-up.
- Fixed an edge case in use of `_eval()` along with hybrid search.
- Fixed an edge case in vector query by document ID returning k+1 hits.
- Fixed a bug in the use of `flat_search_cutoff` parameter of vector search that returned suboptimal results.
- Fixed a few bugs and edge cases involving reference fields and joins.
- Fixed wildcard query not excluding un-indexed fields while searching.
- Fixed a crash that occurred while loading collections that's related to indexing a collection not referenced by other collections.
- Fixed an edge case in the sorting clause of `_eval` operation that caused a rare crash.
- Fixed stemming for non-English locales.
- Fixed semantic search faceting happening on the entire result set instead of only on `k` returned docs.
- Fixed geosearch not returning real distances when `precision` parameter was used. 
- Fixed quirks around deletion of analytics event rules.
- Fixed an issue with deletion & update of array reference fields.
- Return `store` field property in collection schema response.

### Deprecations / behavior changes

The conversational search feature now uses a Typesense collection for storing the conversation history. During 
upgrade, we will create a default collection with the name `default_conversation_history_<timestamp>` and migrate 
existing conversations to this collection.  

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

1. Trigger a snapshot to [create a backup](https://typesense.org/docs/26.0/cluster-operations.html#create-snapshot-for-backups) of your data, for safety purposes.
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

1. Trigger a snapshot to [create a backup](https://typesense.org/docs/26.0/cluster-operations.html#create-snapshot-for-backups) of your data 
   on the leader node.
2. On any follower, stop Typesense and replace the binary via the tar package or via the DEB/RPM installer.
3. Start Typesense server back again and wait for node to rejoin the cluster as a follower and catch-up (`/health` should return healthy). 
4. Repeat steps 2 and 3 for the other _followers_, leaving the leader node uninterrupted for now.
5. Once all followers have been upgraded to v{{ $page.typesenseVersion }}, stop Typesense on the leader.
6. The other nodes will elect a new leader and keep working. 
7. Replace the binary on the old leader and start the Typesense server back again. 
8. This node will re-join the cluster as a follower, and we are done.


## Downgrading

If you wish to downgrade back to an earlier version of Typesense server, you can safely downgrade to either `v26` or `v0.25.x`. 

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
