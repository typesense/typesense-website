# Comparison with Alternatives

## Side-by-side feature comparison

If reading a big block of text is not your thing, see a side-by-side feature comparison matrix [here](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/).

## Typesense vs Elasticsearch

Elasticsearch is a large piece of software, that takes non-trivial amount of effort to setup, administer, scale and fine-tune. It offers you a few thousand configuration parameters to get to your ideal configuration. So it's better suited for large teams who have the bandwidth to get it production-ready, regularly monitor it and scale it, especially when they have a need to store billions of documents and petabytes of data (eg: logs).

Typesense is built specifically for decreasing the "time to market" for a delightful search experience. It is a light-weight yet powerful & scalable alternative that focuses on Developer Happiness and Experience with a clean well-documented API, clear semantics and smart defaults, so it just works well out-of-the-box, without you having to turn many knobs.

Elasticsearch also runs on the JVM, which by itself can be quite an effort to tune to run optimally. Typesense, on the other hand, is a single light-weight self-contained native binary, so it's simple to setup and operate.

See a side-by-side feature comparison [here](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/).

## Typesense vs Algolia

Algolia is a proprietary, hosted, search-as-a-service product that works well, when cost is not an issue. From our experience, fast growing sites and apps quickly run into search & indexing limits, accompanied by expensive plan upgrades as they scale.

Typesense on the other hand is an open-source product that you can run on your own infrastructure or use our managed SaaS offering - Typesense Cloud. The open source version is free to use (besides of course your own infra costs). With Typesense Cloud we do not charge by records or search operations. Instead, you get a dedicated cluster and you can throw as much data and traffic at it as it can handle. You only pay a fixed hourly cost & bandwidth charges for it, depending on the configuration your choose, similar to most modern cloud platforms.

From a product perspective, Typesense is closer in spirit to Algolia than Elasticsearch. However, we've addressed some important limitations with Algolia:

Algolia requires separate indices for each sort order, which counts towards your plan limits. Most of the index settings like fields to search, fields to facet, fields to group by, ranking settings, etc are defined upfront when the index is created vs being able to set them on the fly at query time.

With Typesense, these settings can be configured at search time via query parameters which makes it very flexible and unlocks new use cases. Typesense is also able to give you sorted results with a single index, vs having to create multiple. This helps reduce memory consumption.

Algolia offers the following features that Typesense does not have currently: built-in personalization and recommendations. You can still implement these in Typesense, using Typesense's underlying vector store.

See a side-by-side feature comparison [here](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/).

## Typesense vs Meilisearch

Meilisearch is an open search engine written in Rust and is close in spirit to Algolia.

It aims to be on parity with Algolia in terms of architecture, which is good as it relates to a familiar experience for developers,
but is also bad in that the engine has unfortunately inherited some of Algolia's quirks in the process.

For example, additional sort orders require duplicate indices in both Algolia and Meilisearch, which increases costs and memory requirements.

Based on the project's documented limitations, it seems to be geared for small dataset sizes,
and specifically for cases where high availability is not a requirement. Since it does not have multi-node clustering or node-node replication, it is not production-ready yet.

That said, Meilisearch is a relatively new project, and while it's not suited for serious production use-cases today,
the project has a good team & momentum behind it. We're eager to see how the project evolves.

See a side-by-side feature comparison [here](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/).
