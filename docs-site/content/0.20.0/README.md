# Typesense v{{ $page.typesenseVersion }}

This section of the documentation is for `v{{ $page.typesenseVersion }}`. Please use the version dropdown in the Navbar to switch to other versions.

To learn more about Typesense, visit the non-version specific section of the documentation [here](/).

The documentation is divided into the following sections:

<DocsSections />

## What's new

This release contains new features, performance improvements and important bug fixes.

### New Features

- Auto schema detection: you can now index documents without a pre-defined schema
- Data validation during indexing: configure Typesense to coerce, reject or drop bad values 
- Concurrency improvements: utilize all CPU cores and scale to hundreds of thousands of collections

### Enhancements

- Default sorting field is now optional: when not present, text match score and insertion order are used
- Allow custom key value to be provided [during creation of API keys](https://github.com/typesense/typesense/issues/244)
- Tokenize on special characters [in addition to space and newline](https://github.com/typesense/typesense/issues/241)
- Faster parallel loading of collections on cold start
- Ensure that all queried fields are highlighted in search response
- Reduction in memory consumption of facet fields
- Validate SSL certificate and key before loading SSL certs from disk

### Bug Fixes

- Fixed exact matches [ranking below matches with typos](https://github.com/typesense/typesense/issues/243)
- Fixed a bug in [filtering of string fields](https://github.com/typesense/typesense/issues/254)
- Fixed an edge case involving scoped API keys and embedded filters working with multi-search end-point
- Fixed an edge case involving filtering on negative integers
- Fixed an issue related to [range filter](https://github.com/typesense/typesense/issues/210)
- Fixed a crash while parsing certain rare + long query string parameters
- Fixed collection with [`null` value crashing Typesense](https://github.com/typesense/typesense/issues/251) 
- Fixed a crash when a snapshot was taken on an empty DB but right after a key is created

### Deprecations

- The `catch-up-min-sequence-diff` and `catch-up-threshold-percentage` flags that are used for determining the 
  catch up status of a follower, are replaced with `healthy-read-lag` and `healthy-write-lag` 
  [flags](./guide/configure-typesense.md#using-command-line-arguments).
