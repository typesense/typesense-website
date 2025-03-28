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

This release contains a few new features and important bug fixes.

### New Features
* Matched tokens are returned in the highlight response structure.
* Customization of the start and end HTML tags used for highlighting (default being the mark tag).
* Delete documents that match a filter query.
* Tokenizer now splits text on new line characters, in addition to space.

### Bug Fixes
* Fixed a bug that prevented single document updates from being available on the Raft log.
* Validate data types of the fields of a collection schema during collection creation.
* Ignore invalid unicode characters when returning search response. Earlier, this was causing a crash in some rare cases.
* Allow the colon character `:` to be present in the filter query value.
