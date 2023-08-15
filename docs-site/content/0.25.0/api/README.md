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

This release contains important new features and bug fixes.

### New Features

- **Semantic Search:** Search for conceptually related terms in your dataset, even if the exact keyword does not exist. 
  - [Demo](https://hn-comments-search.typesense.org) | [Docs](https://typesense.org/docs/0.25.0/api/vector-search.html#semantic-search)
- **Hybrid search:** Combine both keyword and semantic / vector search results in a single query using rank fusion
  - [Demo](https://hn-comments-search.typesense.org) | [Docs](https://typesense.org/docs/0.25.0/api/vector-search.html#hybrid-search)
- **Automatic embedding generation:** specify one or more string fields that should be used for generating embeddings during indexing & during search using
    state-of-the-art embedding models, optionally [using a GPU](https://typesense.org/docs/0.25.0/api/vector-search.html#using-a-gpu-optional). 
  - [Example](https://github.com/typesense/showcase-hn-comments-semantic-search/blob/0a10f2ef34e01e79049e7ba42ae8660e80cf524f/scripts/indexDataInTypesense.js#L32-L45) | [Docs](https://typesense.org/docs/0.25.0/api/vector-search.html#using-built-in-models)
- **Integration with OpenAI API, PaLM API and Vertex AI API:** Have Typesense automatically make API calls to remote embedding services like OpenAI / Google, to generate vectors for the JSON data you index in Typesense. 
  - [Example](https://github.com/typesense/showcase-hn-comments-semantic-search/blob/0a10f2ef34e01e79049e7ba42ae8660e80cf524f/scripts/indexDataInTypesense.js#L49-L67) | [Docs](https://typesense.org/docs/0.25.0/api/vector-search.html#using-openai-api)
- **Query Analytics:** Typesense now supports aggregation of popular search queries which can then be used as insights into query patterns. [Docs](https://typesense.org/docs/0.25.0/api/analytics-query-suggestions.html)
- **Query Suggestions:** You can use historical search terms to collected by the Query Analytics feature, to power Query Suggestions.
  - [Docs](https://typesense.org/docs/0.25.0/api/analytics-query-suggestions.html#query-suggestions)
- **Update Documents by Query:** You can now update all documents that match a `filter_by` condition
  - [Docs](https://typesense.org/docs/0.25.0/api/documents.html#update-by-query)
- **Range faceting:** numerical values can be dynamically faceted at query-time by bucketing them into ranges.
  - [Docs](https://typesense.org/docs/0.25.0/api/search.html#faceting-parameters)
- **Pagination using `offset` and `limit`**: This is in addition to the existing `page` and `per_page` mechanism. This new pagination method offers more flexibility and is also useful for GraphQL compatibility.
  - [Docs](https://typesense.org/docs/0.25.0/api/search.html#pagination-parameters)

### Enhancements

- Resolve field names using wildcard: fields can now be resolved in `facet_by`, `query_by`, `include_fields`, `exclude_fields`,
  `highlight_fields` and `highlight_full_fields` when a wildcard expression is used, e.g. `title_*` will match `title_en`.
- Ability to sort grouped hits based on the size of each group, using `sort_by: _group_count:desc`.
- A count is returned for total number of records under each group even if the hits are truncating via `group_limit`.
- The `!=` filtering operation can now be performed against numerical fields. Previously only string fields were supported for this operator.
- Support use of `preset` parameter in embedded API key.
- Support nested dynamic fields. 
- Migrated build system to Bazel.
- New server configuration option (`--reset-peers-on-error`) that makes the cluster forcefully refresh its peers when an
  unrecoverable clustering error happens due to sudden change of peer IPs. There's also an equivalent
  `/operations/reset_peers` API. Be careful while using this option, as it can lead to transient loss of data.

### Bug Fixes

- Fixed updates of nested object field values.
- Fix geopoint indexing in nested fields.
- Fixed some special characters not getting highlighted properly in prefix searches.
- Fixed a bug in phrase matches on array.
- Fixed a socket leak on followers of a cluster when import data fails validation.
- Fixed high memory usage incurred in export/import of large datasets.
- Fixed bad unicode characters in export.
- Fixed errors that were caused by presence of bad Japanese unicode characters in import.
- Fixed broken http/2 support on CURL v8.
- Fixed non-curated members of a group appearing in curated override results.
- Fixed override query rule being case-sensitive.
- Fixed phrase search not considering field weights.

### Deprecations / behavior changes

There are no depreciation or behavior changes in this version.

## Upgrading

Before upgrading your existing Typesense cluster to v{{ $page.typesenseVersion }}, please review the behavior
changes above to prepare your application for the upgrade.

We'd recommend testing on your development / staging environments before upgrading. 

### Typesense Cloud

If you're on Typesense Cloud:

1. Go to [https://cloud.typesense.org/clusters](https://cloud.typesense.org/clusters).
2. Click on your cluster
3. Click on "Cluster Configuration" on the left-side pane, and then click on "Modify"
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
4. Repeat steps 2 and 3 for the other _followers_, leaving the leader node uninterrupted for now.
5. Once all followers have been upgraded to v{{ $page.typesenseVersion }}, stop Typesense on the leader.
6. The other nodes will elect a new leader and keep working. 
7. Replace the binary on the old leader and start the Typesense server back again. 
8. This node will re-join the cluster as a follower, and we are done.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
