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

- **Joins:** Connect one or more collections via common reference fields and join them during query time. This 
  allows you to model SQL-like relationships elegantly.
- **Analytics:** Ability to track popular records, queries that don't produce hits and logging events to file.
- **Voice search:** Capture and send query via voice data -- we will transcribe (via Whispher model) and provide search results. 
- **Built-in conversational RAG:** You can now seamlessly run a vector search and then pass the result to an LLM 
  for summarizing the result as an answer.
- **Improved faceting and filtering performance:** Query planner has been optimized to handle many common patterns better.
- **Stemming:** Snowball stemmer can be enabled for fields so that the field values are stemmed before indexing.
- **Prefix filtering:** During filtering, you can now query on records that begin with a given prefix string. For example, 
  `company_name: Acm*` will return names that begin with `acm`.
- **Stop words:**  Specify a list of common words (e.g. `the`, `was`, etc.) that should be excluded from the 
  indexing and search process to improve search relevance and performance.
- **Personalized vector search via historical queries:** The `vector_query` parameter supports a `qs` parameter that accepts a 
  comma list of historical search queries. We compute the average embedding of these queries and use that as the vector for search.
- **NOT contains**: You can exclude results that contains a specific string. For example, `"filter_by": "artist:! Jackson"`
  will exclude all documents whose `artist` field value contains the word `jackson`.
- **Excluding IDs via filtering:** The `id` field now support the `:!=` operation, so `"filter_by": "id:!=[id1, id2]"` 
  will exclude documents that have an `id` value of `id1` or `id2`.
- **Adding custom metadata to collection schema:** While creating a collection you can send a `metadata` object field, 
  which is persisted along with collection schema. This is useful for record keeping.

### Enhancements

- **Curate / override by tags:** You can tag override rules with tags and then trigger curation by referring to the rule 
  by the tag name directly.
- **Store metadata with override rules:** With override metadata, you can set up a curation rule that matches a query 
  and the search end-point will return the pre-defined metadata associated for that rule. This can can be used to display a 
  message on the front-end.
- **Sort facets alphabetically or by the value of another field:** Sort facet values can now be sorted in 
  alphabetical order for display via `"facet_by": "phone(sort_by: _alpha:asc)"` or on the value of another field
  via `"facet_by": "recipe.name(sort_by: recipe.calories:asc)"`
- **Fetching parent of faceted field:** When you facet on a nested field like `color.name` you can now set 
  `"facet_return_parent": "color.name"`. This will return the parent color object as parent property in the facet response.
- **Configurable HNSW Parameters:** `M`, `efConstruction` and `efSearch` have been made configurable.
- **Disable typos for numerical tokens:** Use `enable_typos_for_numerical_tokens: false` parameter to disable typos on numerical.
- **Customize URL for OpenAI embedding API:** This allows you to use other OpenAI compatible APIs.
- **Pagination for collections, synonyms & overrides listing:** These API end-points now support `limit` and `offset` GET parameters. 
- Integration with Cloudflare Workers AI for RAG.
- Expose information about applied typo tolerance or dropped tokens in `text_match_info` response.
- Option to ignore "not found" error when deleting an object that's already deleted.
  query tokens which are often model numbers or identifiers.
- Added ability to create non-indexed, but required fields.
- Exposed swap usage as a metric in `/metrics.json` API.
- The `/health` API returns additional information about memory/disk exhaustion.
- Support overriding wildcard query via `"q": "*"` in rules.
- Build support for Apple M1 / M2
- Add support for image embeddings using CLIP.
- Add option to expand search query for suggestion aggregation.
- Auto deletion of expired API keys when the `autodelete: true` property is set during key creation.
- Make cache num entries configurable.
- Add flag for logging search query at the start of req cycle.
- Improved on-disk compaction: prunes older records more aggressively, leading to better bounds on data storage.

### Bug Fixes

- Fixed multiple synonym substitutions in query yielding no results.
- Fix `typo_tokens_threshold` not considering the number of grouped hits.
- Fixed odd behavior when `_eval` condition in `sort_by` contained a comma.
- Fixed `object` type auto-creating schema for nested fields even for non-indexed fields.
- Fixed open quote present in search query treated as phrase search.
- Fixed facet by range not working with decimal numbers or with numerical labels or labels that contain spaces.
- Fixed extra new line showing up in the import API response.
- Fixed face range end values being exclusive in nature when it should be inclusive.
- Fixed edge cases in handling unicode in German / Thai locales.
- Fixed facet counts being incorrect when combined with grouping and pinning.
- Fixed highlighting quirks on long documents.
- Fixed inheritance of sort field property for nested fields.
- Fixed propagation of dynamic field properties for child nested fields.
- Fixed some edge cases in phrase search.
- Fixed update doc API returning 200 status code, instead of 201.

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


## Downgrading

Once you upgrade to `v0.25` of Typesense Server the internal structure of the data directory becomes incompatible with older versions of Typesense. 

However, if you need to downgrade to `v0.24`, we've released a special version `v0.24.2` that backports these data structure changes back to `0.24` while keeping other `0.24.1` features as is.

So `v0.25` can only be downgraded to `v0.24.2`. 

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
