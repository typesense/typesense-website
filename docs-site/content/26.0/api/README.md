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

### New Versioning Scheme

Starting with this release, we're dropping the `0.x.y` versioning scheming and switching to a `x.y` versioning scheme. 

So we're going from `0.25 --> 26.0`.

Typesense has been production-ready for a few years now, and is actively used at scale in production, serving billions of search requests per month just on Typesense Cloud, and several billions more in self-hosted clusters.

We originally intended the `0.x` versioning scheme to communicate that there might be backward in-compatible changes between versions. 
In reality though, we've only had to do two backward incompatible changes over the years. 
However, the usage of the previous `0.x` versioning scheme seemed to mis-communicate Typesense's production-readiness among new users, causing confusion.

Switching from `0.x` to `1.x` also seemed to mis-communicate the progress and feature-set maturity we've built over the years.
So we decided to simply drop the `0.` and switch to whole numbers for major version, to convey Typesense's progress over the last 8 years.

### New Features

- **JOINs:** Connect one or more collections via common reference fields and join them during query time. This 
  allows you to model SQL-like relationships elegantly.
- **Analytics:** Ability to track popular records, queries that don't produce hits and logging events to a file.
- **Voice search:** Capture and send query via voice recordings -- Typesense will transcribe (via Whisper model) and provide search results.
- **Image search:** Search through images using text descriptions of their contents, or perform similarity searches, using the CLIP model.
- **Built-in conversational search (RAG):** You can now seamlessly run a vector search and then pass the result to an LLM 
  for summarizing the result as an answer.
- **Stemming:** Snowball stemmer can be enabled for fields so that the field values are stemmed before indexing. This is helpful for different word-forms of the same root word (eg: plurals / singular).
- **Prefix filtering:** During filtering, you can now query on records that begin with a given prefix string. For example, 
  `company_name: Acm*` will return names that begin with `acm`.
- **Stop words:**  Specify a list of common words (e.g. `the`, `was`, etc.) that should be excluded from the 
  indexing and search process to improve search relevance and performance.
- **Personalized vector search via historical queries:** The `vector_query` parameter supports a `qs` parameter that accepts a 
  comma-separated list of historical search queries. We compute the average embedding of these queries and use that as the vector for search.
- **Optional filtering / Filter scoring:** You can now use `_eval` in `sort_by` and assign scores to records that match particular filters, to boost or bury a set of records together.
  the filter expression.

### Enhancements

- **Sort facets alphabetically or by the value of another field:** Sort facet values can now be sorted in
  alphabetical order for display via `"facet_by": "phone(sort_by: _alpha:asc)"` or on the value of another field
  via `"facet_by": "recipe.name(sort_by: recipe.calories:asc)"`
- **Fetching parent of faceted field:** When you facet on a nested field like `color.name` you can now set
  `"facet_return_parent": "color.name"`. This will return the parent color object as parent property in the facet response.
- **Improved faceting and filtering performance:** Query planner has been optimized to handle many common patterns better.
- **NOT contains**: Exclude results that contains a specific string during filtering. For example, `"filter_by": "artist:! Jackson"`
  will exclude all documents whose `artist` field value contains the word `jackson`.
- **Excluding IDs via filtering:** The `id` field now support the `:!=` operation, so `"filter_by": "id:!=[id1, id2]"`
  will exclude documents that have an `id` value of `id1` or `id2`.
- **Curate / override by tags:** You can tag override rules with tags and then trigger curation by referring to the rule 
  by the tag name directly at search time.
- **Configurable HNSW Parameters:** `M`, `efConstruction` and `efSearch` have been made configurable.
- **Disable typos for numerical tokens:** Use `enable_typos_for_numerical_tokens: false` parameter to disable typos on numerical.
- **Customize URL for OpenAI embedding API:** This allows you to use other OpenAI compatible APIs.
- **Pagination for collections, synonyms & overrides listing:** These API end-points now support `limit` and `offset` GET parameters.
- **Store custom metadata with collection schema:** While creating a collection you can send a `metadata` object field,
  which is persisted along with collection schema. This is useful for record keeping.
- **Store metadata with override rules:** Store a `metadata` object within an override, so that the search end-point response
  will return the pre-defined metadata associated for that rule. This can can be used to display a message on the front-end.
- Prevent the contents of a field from being stored on-disk via the `store: false` field property.
- Integration with Cloudflare Workers AI for RAG.
- Expose information about applied typo tolerance or dropped tokens in `text_match_info` response.
- Option to ignore "not found" error when deleting an object that's already deleted.
- Allow a field which is configured as `index: false` + `optional: false`. Previously this was not allowed.
- Exposed swap usage as a metric in `/metrics.json` API.
- The `/health` API returns additional information about memory/disk exhaustion.
- Support overriding wildcard query via `"q": "*"` in rules.
- Build support for Apple M1 / M2 / M3
- Add option to expand prefix search query via the `expand_query` parameter for suggestion aggregation.
- Auto deletion of expired API keys when the `autodelete: true` property is set during key creation.
- Make the size of search cache configurable via the `--cache-num-entries` server flag. Default is `1000`.
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

1. Trigger a snapshot to [create a backup](cluster-operations.md#create-snapshot-for-backups) of your data, for safety purposes.
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

Once you upgrade to `v26` of Typesense Server, you can only downgrade back to `v0.25.x`. 

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
