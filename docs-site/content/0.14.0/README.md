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

In this release, we announce support for grouping documents on one or more fields. There are also a number of bug fixes.

**Features**

* `Group by`: documents can now be grouped on one or more fields. You can also
limit each group to the top K hits within the documents matching that group.

**Bug Fixes**
* Fixed an edge case in filtering of documents by int64 field.
* Allow float array field to accept integer values (i.e. whole numbers).
* Deletion of records with optional fields.
* Collection schema API response should contain the `optional` attribute of fields in the schema.