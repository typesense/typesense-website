---
sidebarDepth: 1
sitemap:
  priority: 0.7
---

# Typesense Guide for v{{ $page.typesenseVersion }}

The guide section of the documentation walks you through how to use Typesense `v{{ $page.typesenseVersion }}` in different scenarios. Use the links on the side navigation bar to get to the appropriate section you're looking for.

For a detailed dive into the Typesense API, refer to our [API documentation](../api/README.md).

<br/>

## What's new

This release contains new features, performance improvements and important bug fixes.

### New Features

- [Geosearch](../api/documents.md#geosearch): Use the `geopoint` data type to index locations, filter and sort on them. We support filtering on 
  records within a given radius and as well as within any arbitrarily defined geo polygon.
- Wrap literal strings in `filter_by` values using backticks to ensure that the commas in filter values 
  don't get parsed as a list separator. Example: <code>filter_by: primary_artist_name:=[\`Apple, Inc.\`]</code>
- Support exclude / not equals operator for filtering string and boolean facets. Example: `filter_by=author:!= JK Rowling`
- Ability to turn off prefix search on a per field basis. For example, if you are querying 3 fields and want to enable 
  prefix searching only on the first field, use `?prefix=true,false,false`. The order should match the order in `query_by`.
- You can now highlight fields that you don't query for. Use `?highlight_fields=title` to specify a custom list of 
  fields that should be highlighted.
- Add `filter_by`, `include_fields` and `exclude_fields` options to `documents/export` endpoint. 

### Enhancements

- Increased maximum supported length of HTTP query string to 4K characters: if you wish to send larger payloads, use
  the [multi-search end-point](../api/documents.md#federated-multi-search).
- Accept `null` values for [optional fields](https://github.com/typesense/typesense/issues/266).
- Support for indexing pre-segmented text: you can now index content from any logographic language into Typesense 
  if you are able to segment / split the text into space-separated words yourself before indexing and querying. You 
  should also set `?pre_segmented_query=true` during searching.
- If you have some overrides defined but want to disable all of them during query time, you can now do that 
  by setting `?enable_overrides=false`.

### Bug Fixes

- Fixed some edge cases with typo correction not finding the correct matches
- Ensure that exact matches are [ranked above others](https://github.com/typesense/typesense/issues/191). 
  Set `?prioritize_exact_match=false` to disable this behavior.
- Fixed `collections:*` API key permission which was not previously being recognized by the authentication engine.
- Fixed float facets being displayed with imprecise precision when displayed as string.

### Deprecations

- There is a change in the `upsert` behavior to conform to existing popular conventions: The upsert action 
  now requires the whole document to be sent for indexing. If you wish to update part of a document, use the `update` action.


:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
