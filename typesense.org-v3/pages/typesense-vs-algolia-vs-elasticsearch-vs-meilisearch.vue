<template>
  <img
    class="absolute left-1/2 top-0 z-[-1] -translate-x-1/2 max-md:hidden"
    src="/images/backgrounds/tunnels-top.svg"
    alt="background"
  />
  <div class="site-padding relative flex flex-col !gap-6 max-md:!gap-8">
    <section>
      <section>
        <div class="mb-4 flex gap-4 max-md:mb-2">
          <FlashFill /> <SearchFill />
        </div>
        <h2 class="mb-8 text-center max-md:mb-4">
          Compare Algolia vs Elasticsearch<br />
          vs Meilisearch vs
          <strong>Typesense</strong>
        </h2>
        <p
          class="max-w-[700px] text-justify text-xl leading-[1.8] tracking-[-0.4px] text-text-muted max-md:text-[14px] [&_b]:text-text-primary"
        >
          The table below gives you a practical side-by-side comparison of key
          features and tradeoffs, based on each search engine's public
          documentation.<br />
          We've strived to keep it accurate, but if you notice an issue, please
          open one
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="https://github.com/typesense/typesense-website/issues"
            >here</CustomLink
          >.
        </p>
        <p class="mt-3 w-full max-w-[700px] text-left text-text-muted">
          Explore the focused comparisons:
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="/typesense-vs-algolia/"
            >Algolia</CustomLink
          >,
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="/typesense-vs-elasticsearch/"
            >Elasticsearch</CustomLink
          >, and
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="/typesense-vs-meilisearch/"
            >Meilisearch</CustomLink
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
                  <th class="py-3">Elasticsearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Source Code</td>
                  <td>Fully open source under GPL-3.0</td>
                  <td>Proprietary closed source</td>
                  <td>
                    Free portions offer AGPLv3, SSPL, or Elastic License 2.0.
                    The default distribution and X-Pack remain under Elastic
                    License 2.0
                  </td>
                  <td>
                    Community Edition is open source and MIT-licensed,
                    <br />Enterprise Edition is source-available licensed under
                    Business Source License (BUSL)
                  </td>
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
                      href="https://www.meilisearch.com/docs/resources/internals/storage#:~:text=For%20best%20performance%2C%20Meilisearch%20works%20optimally%20when%20the%20full%20dataset%20fits%20in%20RAM."
                      target="_blank"
                      >Recommends</a
                    >
                    providing enough RAM to hold entire dataset in RAM for ideal
                    performance.
                  </td>
                </tr>
                <tr>
                  <td>Primary Index Location</td>
                  <td>
                    Search index in RAM; source documents and unindexed fields
                    on disk
                  </td>
                  <td>RAM</td>
                  <td>Lucene segments on disk, with filesystem cache in RAM</td>
                  <td>Disk, with RAM used as a cache</td>
                </tr>
                <tr>
                  <td>Pricing Model</td>
                  <td>
                    Free to self-host.<br /><br />
                    Typesense Cloud bills dedicated clusters hourly by RAM and
                    CPU configuration, plus bandwidth, without per-search or
                    per-record charges. The full pricing catalog is public.
                  </td>
                  <td>
                    Build Plan is free to get started. Grow Plan and Grow Plus
                    Plan bill search requests and records; Elevate Plan requires
                    an annual contract with bespoke pricing.
                  </td>
                  <td>
                    Free Basic tier for self-hosting.<br /><br />
                    Elastic Cloud offers resource-based Hosted plans and
                    usage-based Serverless pricing.
                  </td>
                  <td>
                    Free, feature-restricted Community Edition for
                    self-hosting.<br /><br />
                    Meilisearch Cloud publishes single-node estimates, while HA
                    and Enterprise configurations use bespoke pricing available
                    through its sales team.
                  </td>
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
                  <th class="py-3">Elasticsearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Self-Hosted Option</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">SaaS Option</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    High Availability / <br />Fault Tolerance
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Raft-based
                    multi-node clustering with automatic leader election
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Managed
                    three-server Raft clusters that prioritize search
                    availability
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Primary shards
                    with replica copies and automatic replica promotion
                  </td>
                  <td>
                    🔶<br /><br />HA and sharding are offered in the
                    BUSL-licensed Enterprise Edition or Meilisearch Cloud. The
                    MIT Community Edition is single-node. One static leader
                    handles writes, and a failure requires manual promotion
                    before writes resume. <br /><br />
                    <span class="!text-[#DC3545]"
                      >Has
                      <a
                        href="https://github.com/typesense/typesense-website/pull/454#issuecomment-4307510079"
                        target="_blank"
                        >known limitations</a
                      >
                      around fault tolerance, recovery and resilience.</span
                    >
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">GPU Acceleration Support</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Can optionally
                    use a GPU when available.
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Can optionally
                    use a GPU when available.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    CDN-like Geo-Distributed clusters
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Typesense
                    Cloud's Search Delivery Network supports up to 7 regions per
                    cluster from 26 choices, with nearest-node routing
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Available in the
                    paid Distributed Search Network add-on
                  </td>
                  <td>
                    🔶<br /><br />Elastic Cloud Hosted supports up to three
                    availability zones within one region. Geo-distribution
                    requires separate deployments plus cross-cluster search or
                    replication, with teams configuring the remote clusters and
                    regional routing topology.
                  </td>
                  <td>
                    🔶<br /><br />Enterprise replication supports geographically
                    routed reads, but optimal routing is not currently available
                    when sharding and replication are combined.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Runtime Dependencies</td>
                  <td>
                    None. Self-contained C++ binary.<br /><br />Built-in high
                    performance HTTP server that backends and public clients can
                    connect to directly using search-only scoped API keys.
                  </td>
                  <td>N/A, since it's SaaS only</td>
                  <td>
                    Requires the JVM. Elastic's own guidance says Elasticsearch
                    is
                    <a
                      href="https://www.elastic.co/guide/en/elasticsearch/reference/current/ip-filtering.html"
                      target="_blank"
                      >not designed to be publicly accessible</a
                    >, so public applications normally use a backend or reverse
                    proxy.
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
                    <Check class="text-[#263311]" /><br /><br />
                    Fully backward compatible
                  </td>
                  <td>
                    N/A<br /><br />
                    As a SaaS service, Algolia does not expose this detail to
                    end users.
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Backward compatible up to 1 major version.
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Fully backward compatible
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Upgrade Path</td>
                  <td>Replace binary, restart process.</td>
                  <td>Managed SaaS service, doesn't require upgrades.</td>
                  <td>
                    Replace binary, restart process. Re-indexing required if
                    upgrading more than 1 major version.
                  </td>
                  <td>Replace binary, restart process with upgrade option.</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Serverless Offering</td>
                  <td>
                    <Cross class="text-[#490F0F]" /><br /><br />
                    Typesense is a persistent in-memory process that requires an
                    uninterrupted runtime, RAM, and persistent disk.
                  </td>
                  <td>
                    <Cross class="text-[#490F0F]" /><br /><br />
                    Algolia operates managed, stateful
                    <a
                      href="https://www.algolia.com/doc/guides/scaling/infrastructure/classic/servers-clusters"
                      target="_blank"
                      >three-server clusters</a
                    >
                    behind the service.
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Elastic Cloud
                    Serverless
                  </td>
                  <td>
                    <Cross class="text-[#490F0F]" /><br /><br />
                    Meilisearch is a persistent process with memory-mapped
                    storage. Standard Meilisearch Cloud runs on provisioned
                    compute.
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
                  <th class="py-3">Elasticsearch</th>
                  <th class="rounded-r-xl">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">REST API</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Typo Tolerance</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Opt-in per query
                    with the <code>fuzziness</code> parameter, not enabled by
                    default, for performance reasons.
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Query Field Weights &<br />Boosting
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    🔶<br /><br />
                    Partially through ranking rules reordering, numeric weights
                    are not supported
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    🔶<br /><br />
                    Partially supported through ranking rules reordering,
                    numeric weights are not supported
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Scoped API Keys &<br />Multi-tenant indices
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />API keys can
                    carry index restrictions. Document-level security is
                    available on paid tiers.
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Federated Multi-Index Search</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Grouping / Distinct</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Up to one distinct field
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    🔶<br /><br />
                    Up to one distinct field, no support for grouping
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    JOINs across multiple indices
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td>
                    🔶<br /><br />ES|QL supports LOOKUP JOIN; Elasticsearch also
                    has join field types
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Dynamic Sorting</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Sort fields can
                    be defined at query time using a single index
                  </td>
                  <td>
                    🔶<br /><br />Each exhaustive sort order needs a duplicate
                    index, multiplying billable records and cost.
                    <a
                      href="https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/in-depth/relevant-sort/"
                      target="_blank"
                      >Relevant sorting</a
                    >
                    can use virtual replicas, with a subset of settings and
                    limits.
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Sort fields can
                    be defined at query time using a single index
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Sort fields need
                    to be defined upfront, but can be changed at query time,
                    using a single index.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Faceting & Filtering</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Ranking on Filter Scores</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Facet Value Searches</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Result Pinning / Merchandising
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />10 rules per
                    index on Grow Plan; 10,000 per index on Grow Plus Plan and
                    Elevate Plan
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Pinned query included in the free Basic distribution
                  </td>
                  <td>
                    🔶<br /><br />Experimental, pinning-only search rules. Three
                    rules per Cloud project are free; additional rules are a
                    paid add-on.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Synonyms</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Up to 10,000 per
                    index
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Dynamic Synonym Suggestions</td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
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
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Stemming</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Geo Search</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Supports
                    multiple geopoints and geo-polygons
                  </td>
                  <td>
                    <Check class="text-[#263311]" /> <br /><br />Limited to one
                    geo point per document
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /> <br /><br />Limited to one
                    geo point per document
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Automatic Record ID generation
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Cross class="text-[#490F0F]" /><br /><br />IDs need to be
                    pre-generated
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Sort by String field</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Up to 3 tie-breaking sort fields per search query
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />But
                    <a
                      href="https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/how-to/sort-an-index-alphabetically/"
                      target="_blank"
                      >not recommended</a
                    >
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
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
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Only through the cloud offering
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Record Schema Validations</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    with coerced mapping
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Schemaless</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    <a
                      href="https://typesense.org/docs/30.2/api/collections.html#with-auto-schema-detection"
                      target="_blank"
                      >Automatic schema detection</a
                    >
                    or a strict schema.
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    with coerced mapping
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Custom Ranking Rules</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Negative Keyword Search <br />(<code>-query</code>)
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Phrase Search <br />(<code>"some query"</code>)
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Vector Search <br />
                    (Nearest-Neighbor Search)
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Cross class="text-[#490F0F]" /><br /><br />
                    While direct vector search is not available, NeuralSearch
                    combines keyword and vector search and is available on
                    higher plan tiers.
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Semantic Search</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /> <br /><br />Called
                    NeuralSearch and is available on higher plan tiers.
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    <code>semantic_text</code> is generally available; ELSER
                    requires a paid subscription tier
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Natural Language Search</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Built in. Uses
                    an LLM to translate natural-language requests into
                    structured search terms, filters, and sort parameters.
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Similarity Search</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Image Search</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Built-in
                    integration with CLIP for object detection
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Voice Search</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Built-in
                    integration with Whisper for audio clip transcription
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Conversational Search / RAG</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Built-in RAG
                    pipeline with OpenAI, Azure OpenAI, Google, Cloudflare
                    Workers AI, and vLLM
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Agent Studio is
                    generally available and connects supported LLMs to Algolia
                    search and tools
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Agent Builder is
                    an Enterprise-tier feature in self-managed Elasticsearch and
                    Elastic Cloud.
                  </td>
                  <td>
                    🔶<br /><br />Experimental <code>/chats</code> endpoint
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Recommendations</td>
                  <td>
                    <Cross class="text-[#490F0F]" />
                    <br /><br />Not out-of-the-box, but can be
                    <a
                      href="https://typesense.org/docs/guide/recommendations.html"
                      target="_blank"
                    >
                      implemented</a
                    >
                    using Vector Search
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Cross class="text-[#490F0F]" />
                    <br /><br />Not out-of-the-box, but can be implemented using
                    Vector Search
                  </td>
                  <td>
                    <Cross class="text-[#490F0F]" />
                    <br /><br />Not out-of-the-box, but can be implemented using
                    Vector Search
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    User-level Search Personalization
                  </td>
                  <td>
                    <Cross class="text-[#490F0F]" />
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
                    <Check class="text-[#263311]" /><br /><br />
                    Available on higher tiers
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td>
                    <Cross class="text-[#490F0F]" />
                    <br /><br />Not out-of-the-box, but can be implemented using
                    Vector Search
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Collection Aliases</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Collection Swapping</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">A/B Testing Results</td>
                  <td>
                    <Cross class="text-[#490F0F]" />
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
                    <Check class="text-[#263311]" /><br /><br />
                    Available from Grow Plan
                  </td>
                  <td>
                    <Cross class="text-[#490F0F]" />
                    <br /><br />
                    Can be implemented by swapping collections and search
                    parameters based on AB Test Bucket
                  </td>
                  <td>
                    <Cross class="text-[#490F0F]" />
                    <br /><br />
                    Can be implemented by swapping collections and search
                    parameters based on AB Test Bucket
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Query Suggestions</td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td><Cross class="text-[#490F0F]" /></td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Visual Dashboard</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />In Typesense
                    Cloud
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /><br /><br />Kibana</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Search tools in
                    self-hosted deployments, with analytics in Meilisearch Cloud
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Site Crawler</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    <a
                      href="https://github.com/typesense/typesense-docsearch-scraper"
                      target="_blank"
                      >Self-hosted DocSearch crawler</a
                    >
                    for docs sites.
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Hosted DocSearch crawler for docs sites.
                  </td>
                  <td><Cross class="text-[#490F0F]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />DocSearch
                    crawler for docs sites.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Search UI Component Library</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />The
                    Typesense-InstantSearch adapter supports JavaScript, React,
                    Vue, React Native, and Angular
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />InstantSearch.js
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Search UI,
                    requires hosted search
                  </td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />
                    Forked version of InstantSearch.js
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Privacy Friendliness</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Does NOT collect
                    usage analytics or personal data in both Self-Hosted and
                    SaaS options.
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
                  <th class="py-3">Elasticsearch</th>
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
                      href="https://www.meilisearch.com/docs/resources/internals/storage#:~:text=For%20best%20performance%2C%20Meilisearch%20works%20optimally%20when%20the%20full%20dataset%20fits%20in%20RAM."
                      target="_blank"
                    >
                      performance is constrained by available RAM</a
                    >.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Number of Indices</td>
                  <td>No limitation</td>
                  <td>
                    Plan-dependent: 10 on Build Plan, 50 on Grow Plan, and up to
                    1,000 on top tiers
                  </td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Index Size</td>
                  <td>No limitation, only constrained by available RAM</td>
                  <td>100 GB per application; 1 GB on Build Plan</td>
                  <td>No limitation</td>
                  <td>No limitation, only constrained by available disk</td>
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
                  <td>
                    10 KB to 100 KB, depending on plan; 10 KB on Build Plan
                  </td>
                  <td>No limitation</td>
                  <td>No limitation</td>
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
                  <th class="py-3">Elasticsearch</th>
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
                    Public Discord Community<br />
                    Phone<br />
                    Private Slack<br />
                    Paid Prioritized Support
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Support Hours</td>
                  <td>
                    Critical Production Support: 24/7/365 on Typesense Cloud for
                    all users.<br /><br />General support: 24/7/365 for paid
                    prioritized support users. Response SLAs depend on the
                    <CustomLink to="/support/">support tier</CustomLink>
                    you choose.
                  </td>
                  <td>
                    Grow Plan, Grow Plus Plan, and Elevate Plan include weekday
                    business-hours web support.<br /><br />Elevate Plan can add
                    24/7 coverage for P0 and P1 incidents.
                  </td>
                  <td>
                    24/7/365<br />for Platinum and Enterprise prioritized
                    support
                  </td>
                  <td>
                    Standard: Mon-Thu, 8am-10pm Paris time.<br />
                    Paid prioritized support: 24/7/365
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Expert Onboarding & Training</td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Through Paid
                    Support
                  </td>
                  <td><Check class="text-[#263311]" /></td>
                  <td><Check class="text-[#263311]" /></td>
                  <td>
                    <Check class="text-[#263311]" /><br /><br />Through Paid
                    Support
                  </td>
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
  title: "Typesense vs Algolia vs Elasticsearch vs Meilisearch",
  ogTitle: "Typesense vs Algolia vs Elasticsearch vs Meilisearch",
  description:
    "Compare Typesense, Algolia, Elasticsearch, and Meilisearch across deployment options, search features, product limits, and support.",
  ogDescription:
    "Compare Typesense, Algolia, Elasticsearch, and Meilisearch across deployment options, search features, product limits, and support.",
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
