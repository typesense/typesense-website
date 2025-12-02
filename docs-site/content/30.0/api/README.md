---
sitemap:
  priority: 0.7
---

# Typesense API Reference for v{{ $page.typesenseVersion }}

This section of the documentation details all the API Endpoints available in Typesense and all the parameters you can use with them.

Use the links on the side navigation bar to get to the appropriate section you're looking for.

To learn how to install and run Typesense, see the [Guide section](https://typesense.org/docs/guide/) instead.

<br/>

## What's new

::: warning RC Version
This version is still in RC (Release Candidate) stages, which means that we're actively iterating on it. 
The changelog below is a running list of changes, and we'll be updating it as we release new RC versions. 

Most RC builds are stable to run in production, since we fix any reported issues quickly and/or deprecate RC versions that have known issues swiftly.
But as with any version, we recommend that you test RC versions in your staging / dev environment before upgrading production.
:::

This release contains new features, enhancements, performance improvements, bug fixes and important API changes for synonyms, curation rules and analytics rules.

### New Features

- **Diversify Search Results**: Using Maximum Marginal Relevance (MMR), you can now diversify the top 250 hits on a pre-defined similarity metric. [(Docs)](https://typesense.org/docs/30.0/api/curation.html#diversify-results)
- **Global Synonyms**: Synonyms are now top-level resources, and can be shared between collections. [(Docs)](https://typesense.org/docs/30.0/api/synonyms.html)
- **Global Curation Rules**: Curations are also top-level resources now, and can be shared between multiple collections. [(Docs)](https://typesense.org/docs/30.0/api/curation.html)
- **New features in JOINs**:
  - `facet_by` now supports JOINed reference fields. [(Docs)](https://typesense.org/docs/30.0/api/search.html#facet-referencing)
  - Fetch related docs count for a document in a joined collection with the `include_fields` param. [(Docs)](https://typesense.org/docs/30.0/api/joins.html#get-number-of-related-documents)
  - Support sorting and limit on joined fields with `include_fields` parameter. [(Docs)](https://typesense.org/docs/30.0/api/joins.html#Sorting-and-limiting-on-joined-collection-docs)
  - Support for altering reference fields in the collection schema.
  - New `cascade_delete: false` JOIN parameter for a `reference` field, to override the default behavior of document being cascade deleted in case all the documents it references are deleted.
    Requires `async_reference` parameter to be `true`. [(Docs)](https://typesense.org/docs/30.0/api/joins.html#cascade-delete)
- **New features in Union Search**:
  - Support for `group_by` with Union search. [(Docs)](https://typesense.org/docs/30.0/api/federated-multi-search.html#grouping-with-union)
  - Support for the `pinned_hits` search parameter in Union search.
  - Support for filtering out duplicates when using Union search with a new flag called `remove_duplicates`. [(Docs)](https://typesense.org/docs/30.0/api/federated-multi-search.html#removing-duplicates-in-union-search)
- **Facet Sampling**: Make facet sampling dynamic using the new `facet_sample_slope` search parameter. [(Docs)](https://typesense.org/docs/30.0/api/search.html#faceting-parameters)
- **IPv6 Support**: Typesense now supports binding to and serving requests over IPv6 addresses, enabling seamless integration and connectivity in modern IPv6-only or dual-stack networks.

### Enhancements

- Support for (optionally) copying documents when cloning collections. [(Docs)](https://typesense.org/docs/30.0/api/collections.html#clone-collection-with-documents)
- Support for `!` as a standalone negation operator in filters, allowing `field:![value]` syntax as an alternative to `field:!=[value]`.
- Support for Azure OpenAI models in Natural Language Search. [(Docs)](https://typesense.org/docs/30.0/api/natural-language-search.html#supported-model-types)
- Support for GCP service account authentication for auto-embedding with GCP models. [(Docs)](https://typesense.org/docs/30.0/api/vector-search.html#service-account-authentication)
- Configurable token truncation for string fields to improve exact match filtering on long strings, using the new `truncate` parameter in the collection schema. [(Docs)](https://typesense.org/docs/30.0/api/collections.html#field-parameters)
- Return an error message when a field is declared that references another field of the same collection.
- New `group_max_candidates` search parameter which overrides the behavior of `group_by` queries introduced in [v29.0](https://typesense.org/docs/29.0/api/#deprecations-behavior-changes) where `found` value is an approximation. When `group_max_candidates` is passed, `found` will be accurate up until its value. [(Docs)](https://typesense.org/docs/30.0/api/search.html#grouping-parameters)
- Allow non-indexed nested fields to still be marked as required.
- Improved synonym matching logic: Previously, synonym matches with a higher number of tokens (query/synonym) would be ranked higher. Now, matches are ranked by how well they match the query/synonyms overall, not just by the number of matched tokens.
- Use Transliterator objects pool to enhance tokenization performance of Cyrillic and Chinese languages.
- Support for dynamic `facet_return_parent` fields. [(Docs)](https://typesense.org/docs/30.0/api/search.html#faceting-parameters).
- Support for sending an empty array to avoid embedding generation for an optional auto embedding field when indexing a document.
- Highlight the actual search query when augmenting the search query with Natural Language search.

### Bug Fixes

- Fix parsing of `_eval()` expressions when backticks are used to wrap strings containing parentheses.
- Ensure unique analytics IDs are generated when queries differ by `filter_by` or `analytics_tag` metadata to prevent aggregation issues.
- Fix search highlighting to use field-specific token separators instead of collection-level ones for consistent behavior.
- Return `201` status code when creating conversational models, personalization models, or natural language search models to follow REST conventions.
- Fix custom OpenAI-compatible endpoint URLs not being used for auto-embedding.
- Fix schema updates with embedding fields incorrectly requiring `api_key` validation for local models.
- Fix console logging to output info messages to stdout and warnings/errors to stderr instead of all to stderr.
- Fix phrase query highlighting to highlight only exact phrase matches instead of every individual keyword occurrence.
- Set user agent when initializing HTTP client for external API calls.
- Fix hyphen handling in negation searches to only apply special treatment when token starts with `-`.
- Fix query sub-tokenization to respect field-level `symbols_to_index` and `token_separators` configuration.
- Fix union search pagination bug where global pagination parameters were not passed to individual queries.
- Fix missing groups in case of high cardinality fields.
- Fix various deadlock scenarios related to async reference fields.
- Fix an edge case in `group_by` query along with `infix` search. 
- Fix a crash while searching when updates are happening in parallel.
- Fixed the override matching for wildcard queries, dynamic filter, dynamic sort, and placeholders.
- Fix sort using `_eval()` for `id` fields.
- Fix missing vector distance in results when doing hybrid search with union search.
- Fix missing results when querying a stemmed field with `drop_tokens_threshold` set.
- Fix an edge case where field name can be empty.
- Fix synonym resolution when `synonym_prefix` is disabled.
- Fix allowing the addition of the same field multiple times when altering the collection.
- Fix an edge case that enables using resolved synonyms as prefixes when prefix search is enabled.
- Fix adding the field to schema despite an error, when sorting is enabled for a field that has `auto` as its type.
- Fix `max_bytes` parameters usage for the OpenAI's o-series and GPT-5 models.
- Prevent usage of `temperature` parameter for the o-series and GPT-5 models since it is not supported.
- Fix curation rule matching when doing semantic search with embedding generation.

### Deprecations / behavior changes

- ⚠️ **Synonyms** are no longer nested under Collections. We now have a top-level resource called a "**Synonym Set**" which is a list of synonyms that can be attached to one or more collections, or can be dynamically sent as a search parameter. Existing synonyms will be auto-migrated to synonym sets automatically on upgrading. [(Docs)](https://typesense.org/docs/30.0/api/synonyms.html)
- ⚠️ **Overrides** (aka Curation Rules) are no longer nested under Collections. Similar to synonym sets, we now have a top-level resource called a "**Curation Set**" that can be attached to one or more collections, or can be dynamically sent as a search parameter. Existing overrides will be auto-migrated to curation sets automatically on upgrading. The [`override_tags`](https://typesense.org/docs/29.0/api/search.html#ranking-and-sorting-parameters) parameter has also been renamed to `curation_tags`. [(Docs)](https://typesense.org/docs/30.0/api/curation.html)
- ⚠️ The structure of **Analytics Rules** has changed. Old rules will be automatically migrated to the new structure internally. Read more here. [(Docs)](https://typesense.org/docs/30.0/api/analytics-query-suggestions.html)
- The export endpoint doesn't stop streaming the response if an error is encountered while loading a document from disk. The error is logged and is also returned in the response stream.

:::warning ⚠️ Breaking Changes
Please make sure to **update your client libraries** to the latest version, **review the specific documentation links provided above** and make any required changes to your code base if you programmatically create these resources using the API, before upgrading to this version. If self-hosting, [**perform a snapshot**](https://typesense.org/docs/30.0/api/cluster-operations.html#create-snapshot-for-backups) before upgrading for the Synonyms & Overrides to be migrated to v30.
:::

## Upgrading

Before upgrading your existing Typesense cluster to v{{ $page.typesenseVersion }}, please review the behavior
changes above to prepare your application for the upgrade.

We'd recommend testing on your development / staging environments before upgrading.

Follow this [upgrade guide](https://typesense.org/docs/guide/updating-typesense.html), depending on your mode of deployment.


## Downgrading

If you use synonyms, overrides (curation rules) or analytics rules in previous versions of Typesense, we will auto-migrate them to the new resources (Synonym Sets, Curation Sets and the new format for analytics rules) on upgrading.
However, if you make any changes to these resources, and then downgrade later, those changes will not be ported back to the old version after downgrade.

Besides the above caveat, you can safely downgrade to any version above `v27`.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
