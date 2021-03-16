# Typesense v{{ $page.typesenseVersion }}

This section of the documentation is for `v{{ $page.typesenseVersion }}`. Please use the version dropdown in the Navbar to switch to other versions.

To learn more about Typesense, visit the non-version specific section of the documentation [here](/).

The documentation is divided into the following sections:

<DocsSections />

## What's new

In this release, we announce the support for API key management.

**Features**

* **API key management** You can generate API keys with fine-grained access control restrictions for better security.

**Deprecations**

* Command line `--search-only-key` option is removed. Please use the key generation API to generate a key with search-only permission
* The `max_hits` search query parameter is removed. Please use the `per_page` parameter as a replacement.
