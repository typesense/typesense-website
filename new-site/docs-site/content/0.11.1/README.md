# Typesense v{{ $page.typesenseVersion }}

This section of the documentation is for `v{{ $page.typesenseVersion }}`. Please use the version dropdown in the Navbar to switch to other versions.

To learn more about Typesense, visit the non-version specific section of the documentation [here](/).

The documentation is divided into the following sections:

<DocsSections />

## What's new

This is a maintenance release with important bug fixes.

- **[Bug]** Duplicate facet counts when faceting across multiple query fields.
- **[Bug]** Excessive memory consumption of string array fields.
- **[Feature]** Match score is exposed in search results.
