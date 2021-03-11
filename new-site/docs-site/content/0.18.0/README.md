# Typesense v{{ $page.typesenseVersion }}

This section of the documentation is for `v{{ $page.typesenseVersion }}`. Please use the version dropdown in the Navbar to switch to other versions.

To learn more about Typesense, visit the non-version specific section of the documentation [here](/).

The documentation is divided into the following sections:

<DocsSections />

## What's new

This release contains a few new features and important bug fixes.

### New Features
* Support for query synonyms.
* Better search relevance when searching across multiple fields: addressed some edge cases in multi-field queries.
* Ability to assign custom weights to each field being queried upon.
* Total documents in a collection is now returned in every response via the `out_of` key.
* Exclusion operator `-` for excluding individual query tokens from results.
* Vote API for triggering rotation of leader.
* On-demand snapshot API: allows you to create a backup with a single API call.
* Support for expiry of API keys
* Support regexp for defining allowed collection names of an API key.
* Support operators in multi-valued numerical filter.
* Support bulk imports of upto 3 GB in POST body.

### Bug Fixes
* Fixed an edge case in fuzzy search that missed some tokens during exact searches.
* Prefix matches are assigned lesser importance than exact matches.
* Debug end-point is now available even when node is not ready to serve searches.
* Fixed >= operator not working well with negative values.
* Fixed non-ascii characters not encoded properly in highlight snippet.
* Fixed issue where duplicate results were returned across pages.
* Fixed issue with pinned results being duplicated.

### Performance Improvements
* Faster snapshot transfer and copy in multi-regional clusters.
* Speed up filters on numerical fields.
