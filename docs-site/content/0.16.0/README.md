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

The primary focus of this release is to provide update support for documents.

**Features**
* Support partial updates or upserts of documents.
* Parameterize the number of tokens that surround a highlight via the new `highlight_affix_num_tokens` parameter.

**Bug Fixes**
* When a document is not imported due to an error, the full document was not always being returned in the import response. This has been addressed in this release.
