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

This is a maintenance release with minor bug fixes.

- **[Bug]** Ensure that default sorting field exists in schema during collection creation.
- **[Bug]** Fixed the environment variable examples mentioned in the commandline help text.
- **[Bug]** Ensure that the `hits` and `found` JSON fields were always returned in response, even if the query produced no results.
