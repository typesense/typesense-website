# Typesense v{{ $page.typesenseVersion }}

This section of the documentation is for `v{{ $page.typesenseVersion }}`. Please use the version dropdown in the Navbar to switch to other versions.

To learn more about Typesense, visit the non-version specific section of the documentation [here](/).

The documentation is divided into the following sections:

<DocsSections />

## What's new

This release contains several new features, bug fixes and performance improvements.

**Performance Improvements**

* Adopted jemalloc: we're now using jemalloc as the memory allocator. In our tests, jemalloc showed significantly better performance and lower memory fragmentation.
* Streaming import: You can now safely import large number of documents into Typesense without a drastic impact on search latency. We've also changed the output format of the import end-point: the response will now be in JSON lines rather than as a full-fledged JSON document.
* Significant performance improvement in wildcard queries and faceting involving array fields.

**Features**

* Allow default sorting field to be an int64.
* Ensured that the server returns a 503 response when it is still catching up on the writes from the leader. This threshold can be controlled by the `--catch-up-threshold-percentage argument` (default: `95`).
* Data snapshot interval can now be customized by the `--snapshot-interval-seconds argument` (default: `3600`).
* Metrics API: we've added a `/metrics.json` end-point that returns CPU, storage and memory metrics.
* Exact filtering on string field: It's now possible to match a facet-enabled string field exactly in the filter query by using the := operator.

**Bug Fixes**
* Clustering improvements: We've fixed a number of performance issues and edge cases by extensively benchmarking the clustering implementation via multi-region deployments.
* Fixed a race condition that sometimes prevented a Typesense node from recognizing custom generated API keys.
* Fixed an edge case in text match score calculation that caused relevancy issues on long queries.
* Fixed a crash that happened when an int32 field was filtered by a number exceeding the range of a valid int32 value.
