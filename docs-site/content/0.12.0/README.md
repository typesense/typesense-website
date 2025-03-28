---
sitemap:
  priority: 0.3
---

# Typesense v{{ $page.typesenseVersion }}

This section of the documentation is for `v{{ $page.typesenseVersion }}`. Please use the version dropdown in the Navbar to switch to other versions.

To learn more about Typesense, visit the non-version specific section of the documentation [here](/).

The documentation is divided into the following sections:

<DocsSections />

## What's new

This is a major release packed with multiple new features and a few bug fixes.

**Feature**: Raft-based clustering for high write+read availability. We also deprecate the read-only replication feature supported via the --master argument.

**Feature**: Ability to Curate / Merchandize search results is now available in the open source version, via the Overrides feature.

**Feature**: Ability to create Aliases for collections is now available in the open source version.

**Feature**: Allow the maximum number of results returned to be configurable via the max_hits parameter. Previously only the top 500 results were returned.

**Feature**: Facet search: facet values that are returned can now be filtered via the facet_query parameter. The matching facet text is also highlighted.

**Feature**: Allow integer and float values to be facetable.

**Feature**: Facet stats such as min/max/avg are computed for numerical facet fields.

**Feature**: Allow fields to be marked as optional in the schema.

**Feature**: Expose typo_tokens_threshold parameter: If the number of results found for a specific query is less than this number, Typesense will attempt to look for tokens with more typos until enough results are found. Previously, this was hard-coded to 100.

**Feature**: The underlying string similarity score is exposed as _text_match and can be used as a sorting field parameter.

**Security**: Enforce API key authentication always for search end-point. Previously, search endpoint was open unless a search-only API key was explicitly defined.

**Bug-fix**: Ensure that float fields defined as a sorting field accepted integer values.

**Bug-fix**: Fixed an edge case that resulted in incomplete deletion of string array values when a document is deleted.

**Others**: Adopted GPL v3 license.
