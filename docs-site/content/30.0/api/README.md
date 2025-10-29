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

This release contains important new features, performance improvements and bug fixes.

### New Features

- Diversify search results: Using Maximum Marginal Relevance(MMR), the top 250 hits can be diversified based on pre-defined similarity metric. [PR#2572](https://github.com/typesense/typesense/pull/2572)
- IPv6 Support: Typesense now supports binding to and serving requests over IPv6 addresses, enabling seamless integration and connectivity in modern IPv6-only or dual-stack networks.
- Support faceting on joined reference field ([Docs](https://typesense.org/docs/30.0/api/search.html#facet-referencing))
- Show related_docs count for a document in joined collection with `include_fields` param [PR#2461] (https://github.com/typesense/typesense/pull/2461)
- Make facet sampling dynamic by adding `facet_sample_slope` param ([Docs](https://typesense.org/docs/30.0/api/search.html#faceting-parameters))
- Support sorting and limit on joined fields with include_fields param([Docs](https://typesense.org/docs/30.0/api/joins.html#Sorting-and-limiting-on-joined-collection-docs))
- Support `group_by` for Union search ([Docs](https://typesense.org/docs/30.0/api/federated-multi-search.html#union-search))

### Enhancements

- Add support for optional document copying when cloning collections ([Docs](https://typesense.org/docs/30.0/api/collections.html#clone-collection-with-documents)).
- Support `!` as standalone negation operator in filters, allowing `field:![value]` syntax as alternative to `field:!=[value]`.
- Add support for Azure OpenAI models in Natural Language Search ([Docs](https://typesense.org/docs/30.0/api/natural-language-search.html#supported-model-types)).
- Add configurable token truncation for string fields to improve exact match filtering on long strings ([Docs](https://typesense.org/docs/30.0/api/collections.html#field-parameters)).
- Add GCP service account authentication for auto-embedding with GCP models ([Docs](https://typesense.org/docs/30.0/api/vector-search.html#service-account-authentication)).
- Return an error message when a field is declared that references another field of the same collection. [PR#2456](https://github.com/typesense/typesense/pull/2456)
- Add `cascade_delete: false` parameter for a `reference` field to override the default behavior of document being cascade deleted in case all the documents it references are deleted. It requires `async_reference` parameter to be `true`. [PR#2582](https://github.com/typesense/typesense/pull/2582)
- Add `group_max_candidates` search parameter which overrides the behavior of `group_by` queries introduced in [v29.0](https://typesense.org/docs/29.0/api/#deprecations-behavior-changes) where `found` value is an approximation. When `group_max_candidates` is passed, `found` will be accurate up until its value. [PR#2599](https://github.com/typesense/typesense/pull/2599)
- Allow non-indexed nested fields to still be required. [PR#2603](https://github.com/typesense/typesense/pull/2603)
- Improved synonym matching logic: Previously, synonym matches with a higher number of tokens (query/synonym) would be ranked higher. Now, matches are ranked by how well they match the query/synonyms overall, not just by the number of matched tokens.
- Use Transliterator objects pool to enhance tokenization performance of cyrilic and chinese langauges [PR#2412] (https://github.com/typesense/typesense/pull/2412)
- Support dynamic `facet_return_parent` fields ([Docs](https://typesense.org/docs/30.0/api/search.html#faceting-parameters))
- Support `pinned_hits` with union search [PR#2422] (https://github.com/typesense/typesense/pull/2422)
- Support altering reference fields [PR#2445] (https://github.com/typesense/typesense/pull/2445)
- Filter out duplicates when using `Union` search with flag `remove_duplicates`. Defaults to `true`.

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
- Fix union search pagination bug where global pagination parameters were not passed to individual queries. [PR#2428](https://github.com/typesense/typesense/pull/2428)
- Fix missing groups in case of high cardinality fields. [PR#2436](https://github.com/typesense/typesense/pull/2436)
- Fix various deadlock scenarios related to async reference fields.
- Fix an edge case in group_by query along with infix search. [PR#2517](https://github.com/typesense/typesense/pull/2517)
- Fix a crash while searching when updates are happening in parallel.
- Fixed the override matching for wildcard queries, dynamic filter, dynamic sort, and placeholders.
- Fix sort using `_eval()` for `id` fields

### Deprecations / behavior changes
- The export endpoint now doesn't stop streaming the response if an error is encounterd while loading a document from disk. The error is logged and is also returned in the response stream.

- `/collections/:collection/synonyms` are now moved to `/synonym_sets` ([Docs](https://typesense.org/docs/30.0/api/synonyms))
- `/collection/:collection/overrides` are now movied to `/curation_sets` ([Docs](https://typesense.org/docs/30.0/api/curation))
- The analytics rule format has changed. Find out more, ([Docs](https://typesense.org/docs/30.0/api/analytics-query-suggestions))

:::warning Breaking Changes

The three changes listed above are **breaking changes**.
Please make sure to **update your client libraries** to the latest version, **review the specific documentation links provided above** and make any required changes **before upgrading your Typesense server**.

:::

## Upgrading

Before upgrading your existing Typesense cluster to v{{ $page.typesenseVersion }}, please review the behavior
changes above to prepare your application for the upgrade.

We'd recommend testing on your development / staging environments before upgrading.

Follow this [upgrade guide](https://typesense.org/docs/guide/updating-typesense.html), depending on your mode of deployment.


## Downgrading

If you wish to downgrade back to an earlier version of Typesense server, you can safely downgrade to `v28` of `v27`.

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
