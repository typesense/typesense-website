---
sitemap:
  priority: 0.7
---

# Typesense API Reference for v{{ $page.typesenseVersion }}

This section of the documentation details all the API Endpoints available in Typesense and all the parameters you can use with them.

Use the links on the side navigation bar to get to the appropriate section you're looking for.

To learn how to install and run Typesense, see the [Guide section](/guide/README.md) instead.

<br/>

## What's new

This release contains new features, performance improvements and important bug fixes.

### New Features

- Customizable word separators and special characters for indexing: it's now possible to split words on special characters and index them as separate words. You can also index and search special characters / symbols.
- Dynamic filtering based on rules: overrides now support a `filter_by` clause that can apply filters dynamically to query rules defined in the override.
- Server side caching: cache search requests for a configurable amount of time to improve perceived latencies on heavy queries. Refer to the `use_cache` and `cache_ttl` parameters. By default, caching is disabled.
- Protection against expensive queries via the use of `search_cutoff_ms` parameter that attempts to return results early when the cutoff time has elapsed. This is not a strict guarantee and facet computation is not bound by this parameter.
- Added `geo_precision` sorting option to geo fields. This will bucket/group geo points into "slots" determined by the given precision value, such that points that fall within the same bucket are treated as equal, and the next sorting field can be considered for ranking.

### Enhancements

- Reduced memory consumption: 20-30% depending on the shape of your data.
- Improved update performance: updates on string fields are now 5-6x faster.
- Improved parallelization for multi-collection writes: collections are now indexed independently, making indexing much faster when you are writing to hundreds of collections at the same time.
- Allow exhaustive searching via the `exhaustive_search` parameter. Setting `?exhaustive_search=true` will make Typesense consider _all_ prefixes and typo corrections of the words in the query without stopping early when enough results are found (`drop_tokens_threshold` and `typo_tokens_threshold` configurations are ignored).
- Make minimum word length for 1-char typo and 2-char typos configurable via `min_len_1typo` and `min_len_2typo` parameters. Defaults are 4 and 7 respectively.
- Support filtering by document `id` in filter_by query.
- Support API key permission for creating a specific collection: previously, there was no way to generate an API key that allows you to create a collection with a specific name.
- Allow use of type `auto` for a field whose name does not contain a regular expression.
- Geosearch filter automatically sorts the geo points for the polygon in the correct order: so you don't have to define them in counter clockwise order anymore.

### Bug Fixes

- Fixed edge cases in import of large documents where sometimes, imports hanged mysteriously or ended prematurely.
- Fixed document with duplicate IDs within an import upsert batch being imported as two separate documents.
- Fixed fields with names that contain a regular expression acting as an `auto` type instead of respecting the schema type.
- Fixed a few edge cases in multi-field searching, especially around field weighting and boosting.
- Fixed deletion of collections with slashes or spaces in their names not working: you can now URL encode the names while calling the API.

### Deprecations / behavioral changes

- The `drop_tokens_threshold` and `typo_tokens_threshold` now default to a value of `1`. 
  If you were relying on the earlier defaults (`10` and `100` respectively), please set these parameters explicitly.
- Minimum word length for 1-char typo correction has been increased to 4. 
  Likewise, minimum length for 2-char typo has been increased to 7. This has helped to reduce false fuzzy matches.
  You can use the `min_len_1typo` and `min_len_2typo` parameters to customize these default values. 

:::tip
This documentation itself is open source. If you find any issues, click on the Edit page button at the bottom of the page and send us a Pull Request.
:::

<RedirectOldLinks />
