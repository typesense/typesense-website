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

- A new `text_match_type` mode called `sum_score` which sums the field-level text match scores to arrive at a document-level score.
  - This mode is helpful in cases where you need to consider a document with more matches across more weighted fields, to be more relevant.
  - [Docs](https://typesense.org/docs/27.0/api/search.html#ranking-and-sorting-parameters)
- Enable/disable typo tolerance on alphanumeric words in the query via the 
  `enable_typos_for_alpha_numerical_tokens` search parameter. Default: `true`.
  - For eg: If you need to disable typo tolerance for a word that contains a mix of letters and numbers like `turbo100`, you can now set `enable_typos_for_alpha_numerical_tokens: false` as a search parameter.
  - [Docs](https://typesense.org/docs/27.0/api/search.html#typo-tolerance-parameters)
- Conversation History from Conversational Searches is now stored as a regular Typesense collection.
  - This is new feature, also has a corresponding breaking change. See the `Deprecations / behavior changes` section below.
  - [Docs](https://typesense.org/docs/27.0/api/conversational-search-rag.html#create-a-conversation-history-collection)
- Support synonyms on query prefixes and typo-corrected query tokens via the `synonym_prefix` 
  and `synonym_num_typos` parameters. 
  - Defaults to [`synonym_prefix: false`](https://typesense.org/docs/27.0/api/search.html#ranking-and-sorting-parameters) and [`synonym_num_typos: 0`](https://typesense.org/docs/27.0/api/search.html#typo-tolerance-parameters).
- Customization of faceting index used for search via the `facet_strategy` parameter.
  - By default, Typesense picks an efficient `facet_strategy` for you based on some built-heuristics. But this flag now lets you explicitly control which strategy to use: `exhaustive` or `top_values` or `automatic` (default).
  - [Docs](https://typesense.org/docs/27.0/api/search.html#faceting-parameters)
- Support nested reference collections (when using JOINs), in `include_fields` search parameter, Eg: `include_fields: $Collection_B(title, $Collection_A(title))`
- Support `sort_by` of nested join fields. Eg: `sort_by: $Collection_B( $Collection_A(price:asc) )`
- Ability to use JOINs when using the documents export endpoint, with the `filter_by` and `include_fields` parameters. 
- Support exact prefix value filtering via the `:=` operation. For example, given `filter_by: name:= S*`.
  we will match `Steve Jobs` but NOT `Adam Stator`.

### Enhancements

**Search Parameters:**

- Added `enable_synonyms` boolean flag to enable/disable the application of synonyms during search (default: `true`).
- Added `filter_curated_hits` search parameter which allows you to customize filter behavior for pinned hits.
- Added search parameter `enable_analytics` that prevents the given query from being used for analytics aggregation.
- Support array fields in `facet_return_parent` search parameter.
- Allow special characters in range facet labels.
- Increase max length of facet value stored to `255` characters.

**Server-side improvements:**

- Added `--filter-by-max-ops` server-side flag that can customize the maximum number of operators that can be present
  in a `filter_by` clause (default: `100`).
- Added `--max-per-page` server-side flag that increases the number of hits that can be fetched within a single page. Default: `250`.
- Allow dynamic update of cache size via the `/config` API with the `cache-num-entries` key.
- Use 64K page size for Jemalloc on ARM64 / Linux.
- Log in-flight search queries during a crash.

**AI Search:**

- Added API key support for vLLM conversation models using the `api_key` parameter
- Suppress punctuations and non-speech tokens from appearing in voice search (e.g. `hmm`).

**API Endpoints:**

- Support `include_fields` and `exclude_fields` in the single document fetch (`GET /collections/x/documents/id`) end-point.
- `GET /collections` API endpoint now respects the collections allowed in the API key associated with the request.
- Support for `exclude_fields` in the `GET /collections` API end-point. This is useful when you have a lot of fields which bloats the payload.

**Performance:**

- Implemented lazy filtering of numerical fields which speeds up a subset of searches when `enable_lazy_filter` boolean parameter is enabled.
- Improved working memory used when loading large embedding models.

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
- Fixed a hanging issue when OpenAI API returned no response.
- Fixed persistence of `range_index` and `stem` field properties.
- Fixed highlighting of text stored in fields inside array of objects.
- Fix `_vector_query` parameter in `sort_by` clause being treated as a sorting field.
- Fix overrides not working with semantic search.
- Fixed a regression in v26 that prevented an empty array from being used as a valid value in filter_by clause.
- Fix `return_id` not being returned in import API response during failures.

### Deprecations / behavior changes

**Conversational Search:**

To address some limitations that we found with the previous design of the conversational search feature, 
we now use a Typesense collection for storing the conversation history. 

During upgrade, we will attempt to create a 
default collection with the name `ts_conversation_history_model_id` and migrate existing conversations 
to this collection. 

**However,** given the edge cases we found and have now fixed with the new approach on multi-node Highly Available 
clusters, this automated migration may not work: if it does not, please refer to the guide on how to 
[re-create the conversation model](https://typesense.org/docs/27.0/api/conversational-search-rag.html).

**Exhaustive `total_values` in facet stats**

We refactored the faceting data structures to improve efficiency. This had an impact on how the `total_values` in
`facet_stats` is computed for low-cardinality facet fields: it's now computed only within the
results returned, instead of on the whole dataset. 

To get an accurate `total_values` for the entire dataset, send this additional search parameter:

```json
{
  "facet_strategy": "exhaustive"
}
```

This will force Typesense to compute facets in an exhaustive manner and allows the `total_values` key in the response to be exact.

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

1. Trigger a snapshot to [create a backup](https://typesense.org/docs/27.0/cluster-operations.html#create-snapshot-for-backups) of your data 
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
