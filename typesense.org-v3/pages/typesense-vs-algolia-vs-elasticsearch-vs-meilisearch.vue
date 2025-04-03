<template>
  <img
    class="absolute left-1/2 top-0 z-[-1] -translate-x-1/2 max-md:hidden"
    src="/images/backgrounds/tunnels-top.svg"
    alt="background"
  />
  <div class="site-padding relative flex flex-col !gap-[120px]">
    <section class="mt-[120px] max-md:mt-24">
      <section>
        <div class="mb-4 flex gap-4 max-md:mb-2">
          <FlashFill /> <SearchFill />
        </div>
        <h2 class="mb-8 text-center max-md:mb-4">
          Compare Algolia vs ElasticSearch<br />
          vs Meilisearch vs
          <strong>Typesense</strong>
        </h2>
        <p
          class="max-w-[700px] text-justify text-xl leading-[1.8] tracking-[-0.4px] text-text-muted max-md:text-[14px] [&_b]:text-text-primary"
        >
          This table is meant to give you an objective side-by-side comparison
          of key features in each search engine and is based on each search
          engine's documentation.<br /><br />
          We've strived to provide accurate information below, but if you notice
          any issues, please open an issue
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="https://github.com/typesense/typesense-website/issues"
            >here</CustomLink
          >.
        </p>
      </section>
    </section>
    <div class="flex flex-col gap-[150px] max-md:gap-[100px]">
      <section>
        <h3>Overview</h3>
        <div class="table-wrapper">
          <div class="card">
            <table class="w-full text-sm leading-[1.1] tracking-tight">
              <thead class="bg-blue-in-green text-text-inverted">
                <tr>
                  <th class="rounded-l-xl py-3 pl-4 text-left"></th>
                  <th>Typesense</th>
                  <th>Algolia</th>
                  <th class="py-3">ElasticSearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Source Code</td>
                  <td>Fully open source</td>
                  <td>Proprietary closed source</td>
                  <td>Source-available, licensed under SSPL</td>
                  <td>Fully open source</td>
                </tr>
                <tr>
                  <td>First Commit</td>
                  <td>2015</td>
                  <td>2012</td>
                  <td>2010</td>
                  <td>2018</td>
                </tr>
                <tr>
                  <td>Built Using</td>
                  <td>C++</td>
                  <td>C++</td>
                  <td>Java</td>
                  <td>Rust</td>
                </tr>
                <tr>
                  <td>Core Search Algorithm</td>
                  <td>Built from the ground-up</td>
                  <td>Built from the ground-up</td>
                  <td>Built on top of Lucene</td>
                  <td>Built from the ground-up</td>
                </tr>
                <tr>
                  <td>Best Suited For</td>
                  <td>
                    Instant Search-as-you-type Experiences for data sets that
                    can fit in RAM, up to 24 TB (or current commercially
                    available RAM size).
                  </td>
                  <td>
                    Instant Search-as-you-type Experiences for datasets up to
                    128 GB in size.
                  </td>
                  <td>
                    General-purpose search & aggregations over petabyte-scale
                    datasets (eg: log data)
                  </td>
                  <td>
                    Instant Search-as-you-type Experiences for use cases that
                    don't require a highly-available fault-tolerant setup.
                    <a
                      href="https://www.meilisearch.com/docs/learn/advanced/storage#:~:text=For%20the%20best%20performance%2C%20it%20is%20recommended%20to%20provide%20the%20same%20amount%20of%20RAM%20as%20the%20size%20the%20database%20takes%20on%20disk%2C%20so%20all%20the%20data%20structures%20can%20fit%20in%20memory"
                      target="_blank"
                      >Recommends</a
                    >
                    providing enough RAM to hold entire dataset in RAM for ideal
                    performance.
                  </td>
                </tr>
                <tr>
                  <td>Primary Index Location</td>
                  <td>RAM</td>
                  <td>RAM</td>
                  <td>Disk, with RAM cache</td>
                  <td>Disk with Memory Mapped files</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        <h3>Deployment</h3>
        <div class="table-wrapper">
          <div class="card">
            <table class="w-full text-sm leading-[1.1] tracking-tight">
              <thead class="bg-blue-in-green text-text-inverted">
                <tr>
                  <th class="rounded-l-xl py-3 pl-4 text-left"></th>
                  <th>Typesense</th>
                  <th>Algolia</th>
                  <th class="py-3">ElasticSearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Self-Hosted Option</td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">SaaS Option</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    High Availability / <br />Fault Tolerance
                  </td>
                  <td><Check /><br /><br />RAFT-based multi-node clustering</td>
                  <td><Check /><br /><br />RAFT-based multi-node clustering</td>
                  <td><Check /><br /><br />Active-passive replication</td>
                  <td>
                    <Cross /><br /><br />Only supports a single-node setup,
                    which creates a single point of failure and so is not fault
                    tolerant / production-ready.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">GPU Acceleration Support</td>
                  <td>
                    <Check /><br /><br />Can optionally use a GPU when
                    available.
                  </td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                  <td>
                    <Check /><br /><br />Can optionally use a GPU when
                    available.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    CDN-like Geo-Distributed clusters
                  </td>
                  <td>
                    <Check /><br /><br />Supported in self-hosted and SaaS
                    options, called Search Delivery Network
                  </td>
                  <td>
                    <Check /><br /><br />Available in Premium tier, called
                    Distributed Search Network
                  </td>
                  <td>
                    <Cross /><br /><br />Not available as part of hosted
                    offering
                  </td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Runtime Dependencies</td>
                  <td>
                    None. Self-contained binary. <br /><br />Built-in high
                    performance HTTP server, that can be exposed to the frontend
                    directly.
                  </td>
                  <td>N/A, since it's SaaS only</td>
                  <td>
                    Requires JVM, and an application backend. <br /><br />Cannot
                    be directly exposed to frontend - requires use of nginx,
                    apache or the like as a reverse proxy in front
                  </td>
                  <td>
                    None. Self-contained binary. <br /><br />Built-in high
                    performance HTTP server, that can be exposed to the frontend
                    directly. Recommends use of nginx, apache or the like as a
                    reverse proxy in front, to manage the renewal of the SSL
                    certificate
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Index Backward Compatibility</td>
                  <td>
                    <Check /><br /><br />
                    Fully backward compatible
                  </td>
                  <td>
                    N/A<br /><br />
                    As a SaaS service, Algolia does not expose this detail to
                    end users.
                  </td>
                  <td>
                    <Check /><br /><br />
                    Backward compatible up to 1 major version.
                  </td>
                  <td>
                    <Check /><br /><br />
                    Fully backward compatible
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Upgrade Path</td>
                  <td>
                    Replace binary, restart process. Documents are available for search after the re-indexing is finished.
                  </td>
                  <td>Managed SaaS service, doesn't require upgrades.</td>
                  <td>
                    Replace binary, restart process. Re-indexing required if
                    upgrading more than 1 major version.
                  </td>
                  <td>
                    Replace binary, restart process with upgrade option. No re-indexing required.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        <h3>Features</h3>
        <div class="table-wrapper">
          <div class="card">
            <table class="w-full text-sm leading-[1.1] tracking-tight">
              <thead class="bg-blue-in-green text-text-inverted">
                <tr>
                  <th class="rounded-l-xl py-3 pl-4 text-left"></th>
                  <th>Typesense</th>
                  <th>Algolia</th>
                  <th class="py-3">ElasticSearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">REST API</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Typo Tolerance</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td>
                    <Check /><br /><br />But slow and
                    <a
                      href="https://www.algolia.com/blog/engineering/algolia-v-elasticsearch-relevance/"
                      target="_blank"
                      >affects relevance</a
                    >
                  </td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Query Field Weights &<br />Boosting
                  </td>
                  <td><Check /></td>
                  <td>
                    🔶<br /><br />
                    Through ranking rules reordering
                  </td>
                  <td><Check /></td>
                  <td>
                    🔶<br /><br />
                    Through ranking rules reordering
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Scoped API Keys &<br />Multi-tenant indices
                  </td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Federated Multi-Index Search</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Grouping / Distinct</td>
                  <td><Check /></td>
                  <td>
                    <Check /><br /><br />
                    Upto one distinct field
                  </td>
                  <td><Check /></td>
                  <td>
                    🔶<br /><br />
                    Upto one distinct field, no support for grouping
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    JOINs across multiple indices
                  </td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Dynamic Sorting</td>
                  <td>
                    <Check /><br /><br />Sort fields can be defined at query
                    time using a single index
                  </td>
                  <td>
                    🔶<br /><br />Duplicate indices need to be created for each
                    sort order, for
                    <a
                      href="https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/in-depth/exhaustive-sort/"
                      target="_blank"
                      >Exhaustive Sorting</a
                    >.<br /><br />
                    Virtual replica indices can be used for
                    <a
                      href="https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/in-depth/relevant-sort/"
                      target="_blank"
                      >Relevant Sorting</a
                    >.
                  </td>
                  <td>
                    <Check /><br /><br />Sort fields can be defined at query
                    time using a single index
                  </td>
                  <td>
                    <Check /><br /><br />Sort fields need to be defined upfront,
                    but can be changed at query time, using a single index.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Faceting & Filtering</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Ranking on Filter Scores</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Facet Value Searches</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Result Pinning / Merchandising
                  </td>
                  <td><Check /></td>
                  <td>
                    <Check /><br /><br />Upto 10 results in Free Tier, Upto
                    10,000 results in Premium Tier
                  </td>
                  <td>
                    <Check /><br /><br />
                    Available only in closed-source version
                  </td>
                  <td><Check /><br /><br />
                    <a
                        href="https://www.meilisearch.com/blog/document-boosting"
                        target="_blank"
                        >Through a second index</a>
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Synonyms</td>
                  <td><Check /></td>
                  <td><Check /><br /><br />Upto 10,000 per index</td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Dynamic Synonym Suggestions</td>
                  <td><Cross /></td>
                  <td><Check /><br /><br />Available in Premium Tier</td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Language support</td>
                  <td>All languages</td>
                  <td>All languages</td>
                  <td>All languages</td>
                  <td>All languages</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Stop words</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Stemming</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Geo Search</td>
                  <td><Check /></td>
                  <td><Check /><br /><br />Limited to one geo point</td>
                  <td><Check /></td>
                  <td><Check /><br /><br />Limited to one geo point</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Automatic Record ID generation
                  </td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /><br /><br />IDs needs to be pre-generated</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Sort by String field</td>
                  <td>
                    <Check /><br /><br />
                    Up to 3 tie-breaking sort fields per search query
                  </td>
                  <td>
                    <Check /><br /><br />But
                    <a
                      href="https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/how-to/sort-an-index-alphabetically/"
                      target="_blank"
                      >not recommended</a
                    >
                  </td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Search Analytics</td>
                  <td>
                    <a
                      href="https://typesense.org/docs/guide/search-analytics.html"
                      target="_blank"
                      >Client-side and Server-side</a
                    >
                  </td>
                  <td>Client-side and Server-side</td>
                  <td><Cross /></td>
                  <td>
                    <Check /><br /><br />
                    Only through the cloud offering
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Record Schema Validations</td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td>
                    <Check /><br /><br />
                    with coerced mapping
                  </td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Schemaless</td>
                  <td>
                    <Check /><br /><br />
                    <a
                      href="https://typesense.org/docs/0.24.0/api/collections.html#with-auto-schema-detection"
                      target="_blank"
                      >Automatic schema detection</a
                    >
                    needs to be enabled.
                  </td>
                  <td><Check /></td>
                  <td>
                    <Check /><br /><br />
                    with coerced mapping
                  </td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Custom Ranking Rules</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Negative Keyword Search <br />(<code>-query</code>)
                  </td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Phrase Search <br />(<code>"some query"</code>)
                  </td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Vector Search <br />
                    (Nearest-Neighbor Search)
                  </td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Semantic Search</td>
                  <td><Check /></td>
                  <td><Check /> <br /><br />Called NeuralSearch</td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Similarity Search</td>
                  <td>
                    <Check /><br /><br />Can be implemented using Vector Search
                  </td>
                  <td><Cross /></td>
                  <td>
                    <Check /><br /><br />Can be implemented using Vector Search
                  </td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Image Search</td>
                  <td><Check /><br /><br />Built-in integration with CLIP</td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Voice Search</td>
                  <td>
                    <Check /><br /><br />Built-in integration with Whisper
                  </td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Conversational Q&A Search</td>
                  <td>
                    <Check /><br /><br />Built-in RAG pipeline and integration
                    with OpenAI and Cloudflare LLMs
                  </td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Recommendations</td>
                  <td>
                    <br /><br />Not out-of-the-box, but can be
                    <a
                      href="https://typesense.org/docs/guide/recommendations.html"
                      target="_blank"
                    >
                      implemented</a
                    >
                    using Vector Search
                  </td>
                  <td><Check /></td>
                  <td>
                    <br /><br />Not out-of-the-box, but can be implemented using
                    Vector Search
                  </td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    User-level Search Personalization
                  </td>
                  <td>
                    <br /><br />Not out-of-the-box, but can be
                    <a
                      href="https://typesense.org/docs/guide/personalization.html"
                      target="_blank"
                    >
                      implemented</a
                    >
                    using Vector Search.
                  </td>
                  <td>
                    <Check /><br /><br />
                    Premium Tier
                  </td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Collection Aliases</td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Collection Swapping</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">A/B Testing Results</td>
                  <td>
                    <br /><br />
                    <a
                      href="https://typesense.org/docs/guide/ab-testing.html"
                      target="_blank"
                      >Can be implemented</a
                    >
                    by swapping collections and search parameters based on AB
                    Test Bucket
                  </td>
                  <td>
                    <Check /><br /><br />
                    Premium Tier
                  </td>
                  <td><Cross /></td>
                  <td>
                    <br /><br />
                    Can be implemented by swapping collections and search
                    parameters based on AB Test Bucket
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Query Suggestions</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                  <td><Cross /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Visual Dashboard</td>
                  <td><Check /><br /><br />In Typesense Cloud</td>
                  <td><Check /></td>
                  <td><br /><br />3rd party plugins</td>
                  <td><Check /><br /><br />Search only</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Site Crawler</td>
                  <td>
                    <Check /><br /><br />
                    <a
                      href="https://typesense.org/docs/guide/docsearch.html"
                      target="_blank"
                      >DocSearch crawler</a
                    >
                    for docs sites.
                  </td>
                  <td>
                    <Check /><br /><br />
                    DocSearch crawler for docs sites.<br />
                    General site crawler is part of Premium Tier.
                  </td>
                  <td><Cross /></td>
                  <td>
                    <Check /><br /><br />DocSearch crawler for docs sites.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Search UI Component Library</td>
                  <td><Check /><br /><br />Supports InstantSearch.js</td>
                  <td><Check /><br /><br />InstantSearch.js</td>
                  <td>
                    <Check /><br /><br />Search UI, requires hosted search
                  </td>
                  <td>
                    <Check /><br /><br />Forked version of InstantSearch.js
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Privacy Friendliness</td>
                  <td>
                    <Check /><br /><br />Does NOT collect usage analytics or
                    personal data in both Self-Hosted and SaaS options.
                  </td>
                  <td>
                    🔶<br /><br />Collects personal data, usage analytics & IP
                    addresses.
                  </td>
                  <td>
                    🔶<br /><br />
                    Collects personal data, hardware information, RAM used,
                    unique fingerprint ID for licensing.
                  </td>
                  <td>
                    🔶<br /><br /><a
                      href="https://docs.meilisearch.com/learn/what_is_meilisearch/telemetry.html#exhaustive-list-of-all-collected-data"
                      target="_blank"
                      >Collects</a
                    >
                    hardware information, total number of documents, number of
                    document updates, server uptime, search settings, etc.
                    Opt-out supported.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        <h3>Limits</h3>
        <div class="table-wrapper">
          <div class="card">
            <table class="w-full text-sm leading-[1.1] tracking-tight">
              <thead class="bg-blue-in-green text-text-inverted">
                <tr>
                  <th class="rounded-l-xl py-3 pl-4 text-left"></th>
                  <th>Typesense</th>
                  <th>Algolia</th>
                  <th class="py-3">ElasticSearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Number of Documents</td>
                  <td>No limitation, only constrained by available RAM</td>
                  <td>Unknown</td>
                  <td>
                    No limitation, only constrained by available disk space
                  </td>
                  <td>
                    No limitation, constrained by available disk space and
                    <a
                      href="https://docs.meilisearch.com/learn/advanced/storage.html#:~:text=it%20is%20recommended%20to%20provide%20the%20same%20amount%20of%20RAM%20as%20the%20size%20the%20database%20takes%20on%20disk,%20so%20all%20the%20data%20structures%20can%20fit%20in%20memory"
                      target="_blank"
                    >
                      performance is constrained by available RAM</a
                    >.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Number of Indices</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>200 for Linux/MacOS, 20 for Windows</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Index Size</td>
                  <td>No limitations, only constrained by available RAM</td>
                  <td>128 GB</td>
                  <td>No limitation</td>
                  <td>500GB</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Words per field</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Record Size</td>
                  <td>No limitation</td>
                  <td>10KB</td>
                  <td>No limitation</td>
                  <td>2GB</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Number of API Keys</td>
                  <td>No limitation</td>
                  <td>5000</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        <h3>Support</h3>
        <div class="table-wrapper">
          <div class="card">
            <table class="w-full text-sm leading-[1.1] tracking-tight">
              <thead class="bg-blue-in-green text-text-inverted">
                <tr>
                  <th class="rounded-l-xl py-3 pl-4 text-left"></th>
                  <th>Typesense</th>
                  <th>Algolia</th>
                  <th class="py-3">ElasticSearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Channels</td>
                  <td>
                    GitHub issues<br />
                    Email<br />
                    Public Slack Community<br />
                    Phone<br />
                    Private Slack<br />
                    Paid Prioritized Support
                  </td>
                  <td>
                    GitHub issues<br />
                    Email<br />
                    Public Slack Community<br />
                    Phone<br />
                    Paid Prioritized Support
                  </td>
                  <td>
                    GitHub issues<br />
                    Email<br />
                    Public Slack Community<br />
                    Paid Prioritized Support
                  </td>
                  <td>
                    GitHub issues<br />
                    Email<br />
                    Public Discord Community
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Support Hours</td>
                  <td>24 x 7 x 365 <br />for Paid Prioritized Support</td>
                  <td>
                    Mon - Fri; Business Hours<br />
                    9am - 5pm in user timezone<br />for Paid Prioritized Support
                  </td>
                  <td>
                    24 x 7 x 365 <br />for Platinum and Enterprise Prioritized
                    Support
                  </td>
                  <td>
                    8am - 10pm (Paris Time), <br />Mon - Thu<br />
                    for Enterprise customers
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Expert Onboarding & Training</td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Check /></td>
                  <td><Cross /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <img
      class="absolute bottom-[-1000px] left-1/2 z-[-1] w-max -translate-x-1/2 scale-x-110 max-md:bottom-[-220px] max-md:scale-[2]"
      src="/images/backgrounds/tunnels-bottom.svg"
      alt="background"
    />
  </div>
</template>
<script lang="ts" setup>
useSeoMeta({
  title: "About Us | Typesense",
  ogTitle: "About Us | Typesense",
  description:
    "We are a lean team of engineers passionate about making great search technology accessible to everyone. Our goal is to democratize search.",
  ogDescription:
    "We are a lean team of engineers passionate about making great search technology accessible to everyone. Our goal is to democratize search.",
});
import Check from "@/assets/icons/check.svg";
import Cross from "@/assets/icons/cross.svg";
import Dots from "@/assets/images/dots.svg";
import FlashFill from "@/assets/icons/flash-fill.svg";
import SearchFill from "@/assets/icons/search-fill.svg";
</script>

<style scoped>
section {
  @apply flex flex-col items-center;
}
.table-wrapper {
  @apply w-full overflow-x-auto overflow-y-hidden rounded-3xl;
}
.card {
  @apply relative w-full min-w-[900px] bg-bg-gray-2 p-4 max-sm:w-full;
  box-shadow: -5.05px 4.04px 34.34px 0px rgba(0, 0, 0, 0.1);
}
h3 {
  @apply mb-4 text-center text-[36px] max-md:mb-3;
}
table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0 6px;
}
table a {
  @apply underline underline-offset-2;
}
td,
th {
  @apply p-4 text-left align-top;
}
td {
  @apply leading-[1.5] text-text-muted;
}
th {
  @apply font-medium;
}
tbody tr {
  @apply bg-bg;
}
tbody tr td:first-child {
  @apply rounded-l-xl px-4 py-3 text-left font-bold text-text-primary;
  width: 28%;
}
tbody tr td:last-child {
  @apply rounded-r-xl;
}
@media not all and (min-width: 640px) {
  td {
    @apply py-5;
  }
}
</style>
