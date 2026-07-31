<template>
  <img
    class="absolute left-1/2 top-0 z-[-1] -translate-x-1/2 max-md:hidden"
    src="/images/backgrounds/tunnels-top.svg"
    alt="background"
  />
  <div class="site-padding relative flex flex-col !gap-[120px] md:!-mt-10">
    <section>
      <div class="mb-4 flex gap-4 max-md:mb-2">
        <FlashFill />
        <SearchFill />
      </div>
      <h1 class="mb-8 text-center normal-case max-md:mb-4">
        Typesense vs <strong>Meilisearch</strong>
      </h1>
      <p class="intro">
        Both products offer fast, typo-tolerant search with filters, facets, geo
        search, and hybrid search. Meilisearch is interesting when its
        memory-mapped storage lets an index exceed available RAM and that
        associated performance tradeoff is acceptable. Its production
        replication can keep reads available, but it requires Enterprise Edition
        or Cloud, and a failed static leader blocks writes until manual
        promotion. Typesense is more battle-tested in high-scale production
        environments, and includes automatic Raft leader election in its
        open-source server, along with type validation, stable JOINs and nested
        filters, Natural Language Search, and RAG.
      </p>
      <p
        class="mt-5 w-full max-w-[900px] text-left text-text-muted max-md:text-[14px] max-md:leading-[1.8]"
      >
        For a broader view, see the
        <CustomLink
          class="text-primary underline underline-offset-4"
          to="/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/"
        >
          <span
            v-text="
              'full Typesense, Algolia, Elasticsearch, and Meilisearch comparison'
            "
          />
        </CustomLink>
        covering all four products.
      </p>
    </section>

    <section class="-mt-20 max-md:-mt-20">
      <h2 class="normal-case">Typesense vs Meilisearch at a glance</h2>
      <p class="mb-2 text-sm text-text-muted md:hidden">
        Swipe left to see Meilisearch <span aria-hidden="true">→</span>
      </p>
      <div
        class="table-wrapper"
        role="region"
        aria-label="Horizontally scrollable Typesense and Meilisearch feature comparison table"
        tabindex="0"
      >
        <div class="card">
          <table class="w-full text-sm tracking-tight">
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Area</th>
                <th>Typesense</th>
                <th class="rounded-r-xl">Meilisearch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Core search</td>
                <td>
                  Typo-tolerant keyword search, filtering, faceting, query-time
                  sorting, geo search, vector search, semantic search, and
                  hybrid search
                </td>
                <td>
                  Typo-tolerant keyword search, filtering, faceting, query-time
                  sorting, geo search, vector search, semantic search, and
                  hybrid search
                </td>
              </tr>
              <tr>
                <td>License and hosting</td>
                <td>
                  All API capabilities, including Raft high availability, are
                  available in the open-source server. Self-host it free or run
                  the same server in a dedicated Typesense Cloud cluster.
                </td>
                <td>
                  Community Edition is MIT licensed. Enterprise Edition code is
                  public under a source-available BUSL license, but it
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.meilisearch.com/docs/resources/self_hosting/enterprise_edition#what-is-the-meilisearch-enterprise-edition"><span>cannot be freely used in production</span></CustomLink
                  ><span>.</span>
                  Production sharding and replication require Enterprise Edition
                  or Cloud.
                </td>
              </tr>
              <tr>
                <td>Storage and memory</td>
                <td>
                  Keeps fields used for search, filtering, sorting, and faceting
                  in memory; source documents and unindexed fields remain on
                  disk
                </td>
                <td>
                  Memory-mapped LMDB storage can serve indexes larger than RAM,
                  though Meilisearch
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.meilisearch.com/docs/resources/internals/storage#memory-mapping"><span>performs best when it has enough RAM to hold the entire dataset</span></CustomLink
                  ><span>.</span>
                </td>
              </tr>
              <tr>
                <td>Schema and validation</td>
                <td>
                  With ingestion-time type validation, Typesense supports
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/collections.html#automatic-schema-detection"
                  >
                    <span>automatic schema detection or strict schemas</span>
                  </CustomLink>
                  to keep collections clean
                </td>
                <td>
                  Schema-less. Mixed field types are accepted. Meilisearch's
                  <CustomLink
                    to="https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/how_to/sort_results#add-attributes-to-sortableattributes"
                  >
                    <span>sorting guidance warns</span>
                  </CustomLink>
                  that they can produce unexpected order.
                </td>
              </tr>
              <tr>
                <td>Typo tolerance</td>
                <td>Enabled by default and tunable per query and per field</td>
                <td>
                  Enabled by default, with index-level thresholds and
                  exclusions. It can be disabled for selected attributes or
                  words, but typo thresholds cannot be changed per query.
                </td>
              </tr>
              <tr>
                <td>Runtime sorting</td>
                <td>
                  Choose one or more sort fields and directions at query time on
                  one collection. For example, price low-to-high, price
                  high-to-low, and newest all use <code>sort_by</code>.
                </td>
                <td>
                  Choose one or more sort fields and directions at query time on
                  one index after configuring sortable attributes. For example,
                  price low-to-high, price high-to-low, and newest do not need
                  separate indexes.
                </td>
              </tr>
              <tr>
                <td>Nested arrays of objects</td>
                <td>
                  Stable
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/search.html#filter_by"
                  >
                    <span>correlated nested-object filters</span>
                  </CustomLink>
                  keep multiple conditions bound to the same object inside an
                  array
                </td>
                <td>
                  Precise array relationships use experimental foreign keys.
                  This model is
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.meilisearch.com/docs/capabilities/indexing/how_to/document_relations#limitations"><span>unavailable with remote sharding</span></CustomLink
                  ><span>,</span>
                  and a foreign filter returns an error when its related-side
                  condition matches more than 100 documents.
                </td>
              </tr>
              <tr>
                <td>Relationships between collections</td>
                <td>
                  Stable
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/joins.html"
                  >
                    <span>cross-collection JOINs</span>
                  </CustomLink>
                  with filtering, nested joins, field inclusion, faceting, and
                  sorting
                </td>
                <td>
                  Experimental one-way foreign keys and hydration are
                  unavailable with remote sharding. A foreign filter returns an
                  error when its related-side condition matches more than 100
                  documents.
                </td>
              </tr>
              <tr>
                <td>Geo fields per record</td>
                <td>
                  Any number of independently queryable named geo fields. For
                  example, one record can have separate pickup, delivery,
                  warehouse, and service-area locations.
                </td>
                <td>
                  Each record supports one reserved <code>_geo</code> point for
                  distance sorting, plus one <code>_geojson</code> point or
                  shape. Distance sorting does not work with
                  <code>_geojson</code>.
                </td>
              </tr>
              <tr>
                <td>Vector, semantic, and hybrid search</td>
                <td>
                  HNSW semantic and hybrid search with built-in models, OpenAI,
                  Azure OpenAI, OpenAI-compatible APIs, Google Gemini or Vertex
                  AI, and user-provided vectors
                </td>
                <td>
                  Semantic and hybrid search with DiskANN and embedders for
                  OpenAI, Hugging Face, Cohere, Mistral, Voyage, Gemini,
                  Cloudflare, Ollama, custom REST APIs, and user-provided
                  vectors
                </td>
              </tr>
              <tr>
                <td>Natural Language Search</td>
                <td>
                  Typesense has
                  <CustomLink
                    to="https://typesense.org/docs/guide/natural-language-search.html#natural-language-search-is-now-built-in-to-typesense-v29"
                  >
                    <span>built-in Natural Language Search</span>
                  </CustomLink>
                  that uses an LLM to turn requests such as “the most powerful
                  car under $50K” into structured search terms, filters, and
                  sort parameters.
                </td>
                <td>
                  There is no built-in equivalent for translating a
                  natural-language request into structured search, filter, and
                  sort parameters. Semantic search and conversational RAG solve
                  different problems.
                </td>
              </tr>
              <tr>
                <td>Conversational Search / RAG</td>
                <td>
                  Production
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/conversational-search-rag.html"
                  >
                    <span>conversational search API</span>
                  </CustomLink>
                  with streaming, conversation history, and configurable LLM
                  models
                </td>
                <td>
                  RAG chat with streaming and workspaces is available, but it
                  remains an
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.meilisearch.com/docs/capabilities/conversational_search/getting_started/setup#enable-chat-completions"><span>experimental feature</span></CustomLink
                  ><span>.</span>
                </td>
              </tr>
              <tr>
                <td>Multi-tenancy</td>
                <td>
                  Scoped keys can lock each user to permitted organizations,
                  roles, fields, query limits, and an expiry time without a
                  server round trip
                </td>
                <td>
                  JWT tenant tokens can restrict indexes, enforce document
                  filters, and expire
                </td>
              </tr>
              <tr>
                <td>Search analytics</td>
                <td>
                  Available in the open-source server and Typesense Cloud,
                  including search, click, conversion, and visit events
                </td>
                <td>
                  Meilisearch Cloud has a search analytics dashboard for
                  queries, no-result rate, latency, clicks, conversions, and
                  geographic distribution
                </td>
              </tr>
              <tr>
                <td>Merchandising and curation</td>
                <td>
                  The open-source API and Typesense Cloud UI support includes,
                  excludes, query replacement, filters, sort controls, and
                  rule-based curations
                </td>
                <td>
                  <CustomLink
                    to="https://www.meilisearch.com/docs/capabilities/search_rules/advanced/pinning_behavior#pinning-does-not-change-ranking"
                  >
                    <span>Search rules are experimental and pinning-only</span>
                  </CustomLink>
                  today. Three rules per Cloud project are free; additional
                  rules are a paid add-on.
                </td>
              </tr>
              <tr>
                <td>High availability</td>
                <td>
                  <CustomLink
                    to="https://typesense.org/docs/guide/high-availability.html"
                  >
                    <span>Raft clustering</span>
                  </CustomLink>
                  in the open-source server with automatic leader election.
                  Typesense Cloud supports 3 to 7 nodes and reroutes traffic
                  away from failed nodes.
                </td>
                <td>
                  Enterprise Edition or Cloud replication automatically retries
                  a network search on another replica when a remote is
                  unavailable. One static leader handles every write. There is
                  no automatic leader election, so leader failure blocks writes
                  until manual promotion, a
                  <CustomLink
                    to="https://github.com/typesense/typesense-website/pull/454#issuecomment-4307510079"
                  >
                    <span>known limitation</span>
                  </CustomLink>
                  for write availability.
                </td>
              </tr>
              <tr>
                <td>Geo distribution</td>
                <td>
                  Typesense Cloud's
                  <CustomLink
                    to="https://typesense.org/docs/guide/typesense-cloud/search-delivery-network.html"
                  >
                    <span>Search Delivery Network</span>
                  </CustomLink>
                  distributes a cluster across up to 7 regions from 26 choices,
                  routes searches to the nearest node, and fails over
                  automatically
                </td>
                <td>
                  Enterprise replication supports geographically routed reads.
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.meilisearch.com/blog/sharding-replication#replication-high-read-availability-and-geo-distribution"><span>Optimal routing is not currently available when sharding and replication are combined</span></CustomLink
                  ><span>.</span>
                </td>
              </tr>
              <tr>
                <td>InstantSearch UI</td>
                <td>
                  The
                  <CustomLink
                    to="https://github.com/typesense/typesense-instantsearch-adapter"
                  >
                    <span>Typesense-InstantSearch adapter</span>
                  </CustomLink>
                  lets Algolia's widgets work with Typesense for JavaScript,
                  React, Vue, and Angular
                </td>
                <td>
                  <code>instant-meilisearch</code> connects Meilisearch to the
                  InstantSearch.js ecosystem
                </td>
              </tr>
              <tr>
                <td>Hosted crawler</td>
                <td>
                  The
                  <CustomLink
                    to="https://github.com/typesense/typesense-docsearch-scraper"
                  >
                    <span>Typesense DocSearch scraper</span>
                  </CustomLink>
                  crawls and indexes documentation sites, but the crawler must
                  be self-hosted
                </td>
                <td>
                  Meilisearch Cloud includes a hosted crawler with JavaScript
                  rendering, DocSearch mode, and schema extraction
                </td>
              </tr>
              <tr>
                <td>Serverless offering</td>
                <td>No. Typesense runs as provisioned persistent compute.</td>
                <td>
                  No. Standard Meilisearch Cloud runs on provisioned persistent
                  compute.
                </td>
              </tr>
              <tr>
                <td>Support hours</td>
                <td>
                  Typesense Cloud includes
                  <CustomLink to="https://cloud.typesense.org/support-plans">
                    <span>24/7/365 critical production support</span>
                  </CustomLink>
                  for HA clusters, with faster response targets on higher
                  support tiers
                </td>
                <td>
                  Email support is included in Cloud. Enterprise offers 24/7
                  support targets, including a one-hour target for urgent
                  production outages.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="content-section">
      <h2>How the storage and replication models affect production</h2>
      <div class="card-grid">
        <article class="content-card">
          <h3>Typesense keeps indexed search structures in memory</h3>
          <p>
            Typesense sizes memory around the fields you search, filter, facet,
            and sort. Fields that only need to be returned for display purposes
            can stay unindexed on disk, so the whole source document does not
            need to occupy the in-memory search index.
          </p>
          <p>
            Every HA node holds a full replica. Raft automatically elects a new
            leader after a node failure, healthy nodes continue serving reads,
            and writes resume without operator promotion. That behavior and the
            full API surface are included in both the open-source server and
            Typesense Cloud.
          </p>
        </article>
        <article class="content-card">
          <h3>
            Meilisearch can trade RAM for disk reads, with a performance cost
          </h3>
          <p>
            Meilisearch uses memory-mapped storage. It performs best when the
            full dataset fits in RAM, but an index can be larger than memory
            when the workload and storage can tolerate uncached page reads. Once
            data spills beyond RAM, cache misses require disk reads and
            performance depends more heavily on storage.
          </p>
          <p>
            Enterprise Edition or Cloud replication can automatically serve a
            network search from another replica when a remote fails. Writes
            still pass through one static leader. If that leader fails, writes
            stop until an operator manually promotes another instance.
          </p>
          <p class="font-semibold text-red-600">
            This creates a single point of failure, making Meilisearch
            unsuitable for critical production workloads that cannot tolerate
            write downtime or manual intervention.
          </p>
        </article>
      </div>
    </section>

    <section class="pricing-section full-bleed bg-secondary-bg">
      <Badge>PUBLIC PRICING EXAMPLES</Badge>
      <h2>How the Cloud pricing models differ</h2>
      <p class="pricing-intro">
        Standard single-node Meilisearch Cloud has public estimates, while its
        HA and Enterprise configurations require a quote from its sales team.
        Typesense publishes its full configuration catalog, including HA.
      </p>
      <p class="mb-2 text-sm text-text-muted md:hidden">
        Swipe left to see Meilisearch <span aria-hidden="true">→</span>
      </p>
      <div
        class="table-wrapper"
        role="region"
        aria-label="Horizontally scrollable Typesense and Meilisearch pricing comparison table"
        tabindex="0"
      >
        <div class="card">
          <table class="w-full text-sm tracking-tight">
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Pricing area</th>
                <th>Typesense</th>
                <th class="rounded-r-xl">Meilisearch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Self-hosting</td>
                <td>
                  Free to self-host forever, including Raft high availability,
                  analytics, JOINs, nested filters, and the complete search API
                </td>
                <td>
                  Community Edition is free to self-host, but is feature
                  restricted. Production sharding and replication require an
                  Enterprise agreement.
                </td>
              </tr>
              <tr>
                <td>Managed Cloud starting point</td>
                <td>
                  For example, one Oregon node with 0.5 GB RAM, 2 vCPU, and a
                  1-hour burst window is $0.03 per hour, $21.60 per month, or
                  $259.20 per year.
                  <CustomLink
                    to="https://cloud.typesense.org/pricing/calculator"
                  >
                    <span>View the full Typesense Cloud catalog</span>
                  </CustomLink>
                </td>
                <td>
                  Meilisearch Cloud starts at $20 per month. Its public resource
                  estimator shows an XS example with 0.5 vCPU, 1 GB RAM, and 32
                  GiB of disk at about $23 per month, or $276 per year.
                </td>
              </tr>
              <tr>
                <td>How cloud costs scale</td>
                <td>
                  Dedicated clusters are billed hourly by RAM and CPU
                  configuration, plus bandwidth, without per-search or
                  per-record fees. The full single-node and HA catalog is
                  public. Resize from the dashboard or automate changes through
                  the Cloud Management API.
                </td>
                <td>
                  Standard single-node usage and resource estimates are public.
                  HA, sharding, dedicated resources, and other Enterprise
                  capabilities require a
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.meilisearch.com/pricing"><span>custom sales quote</span></CustomLink
                  ><span>.</span>
                </td>
              </tr>
              <tr>
                <td>High availability</td>
                <td>
                  For example, the same 0.5 GB, 2 vCPU, 1-hour burst, Oregon
                  configuration with 3-node HA is $0.12 per hour, $86.40 per
                  month, or $1,036.80 per year.
                </td>
                <td>
                  Replication and sharding require Enterprise Edition or Cloud.
                  HA topology, dedicated resources, and related Enterprise
                  pricing require a custom quote.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p class="pricing-note">
        These are examples, not equivalent workload sizes. Meilisearch can trade
        RAM for disk reads, while Typesense sizes memory around indexed fields.
        Compare the smallest configuration on each service that meets the same
        latency, concurrency, indexing, and availability target with your data.
      </p>
    </section>

    <section class="content-section">
      <div class="fit-grid">
        <article class="fit-card fit-card-meilisearch">
          <h2>When Meilisearch is a better fit</h2>
          <ul>
            <li>
              The index is larger than the RAM budget, and the workload can
              accept memory-mapped reads from fast storage.
            </li>
            <li>
              Schema-less ingestion matters more than enforcing consistent field
              types at write time.
            </li>
            <li>
              The deployment fits within Community Edition's feature set, and a
              permissive MIT license matters more than production sharding or
              replication.
            </li>
            <li>
              Relevance tuning calls for direct priority ordering of ranking
              rules and Meilisearch's bucket-sort model.
            </li>
            <li>
              Semantic and hybrid search need its provider-specific embedders,
              custom REST support, DiskANN storage, or multiple named embedders
              in one index.
            </li>
            <li>
              A hosted crawler should come bundled with the Cloud service.
            </li>
            <li>
              A Rust codebase is a concrete preference for the engineers who
              will operate or contribute to the search engine.
            </li>
            <li>
              The team is comfortable with capabilities that are experimental,
              Cloud-only, Enterprise-only, or governed by BUSL license terms.
            </li>
          </ul>
        </article>
        <article class="fit-card fit-card-typesense">
          <h2>When Typesense is a better fit</h2>
          <ul>
            <li>
              Your search use case requires high availability and cannot afford
              a single point of failure or manual operator intervention.
              Typesense uses Raft with automatic leader election to keep the
              cluster available through node failures.
            </li>
            <li>
              One open-source server should provide the full API surface,
              including high availability, analytics, JOINs, nested filters,
              semantic search, RAG, and curation.
            </li>
            <li>
              The data model needs flexible or strict schemas with
              ingestion-time type validation, plus mature nested-object filters
              and cross-collection JOINs.
            </li>
            <li>
              Relevance and merchandising need runtime control, including
              per-query and per-field typo settings, query-time sorting,
              filters, curations, and scoped keys.
            </li>
            <li>
              The search experience combines typo-tolerant keyword search,
              semantic and hybrid search, RAG, and Natural Language Search that
              builds structured search parameters from prose.
            </li>
            <li>
              Records need several independent geo fields, or global users need
              nearest-node routing and automatic regional failover.
            </li>
            <li>
              Pricing needs to be transparent before talking to sales. Typesense
              Cloud publishes its full single-node and HA configuration catalog,
              while Meilisearch gates HA and Enterprise pricing behind a sales
              conversation.
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="content-section">
      <h2>What teams ask before choosing Typesense or Meilisearch</h2>
      <p class="faq-intro">
        The products overlap on fast application search, but the operational
        model and the maturity of advanced features can change the decision.
      </p>
      <div class="faq-list">
        <article>
          <h3>Is Meilisearch more memory efficient than Typesense?</h3>
          <p>
            It can be when the index is larger than RAM and the workload
            tolerates disk reads. Meilisearch uses memory-mapped LMDB, but once
            data spills beyond RAM, cache misses move work to disk and can
            increase latency. Typesense keeps the fields used for search,
            filters, facets, and sorting in memory, while unindexed source
            fields stay on disk. Benchmark the smallest configuration that meets
            the same latency and concurrency target instead of comparing nominal
            RAM.
          </p>
        </article>
        <article>
          <h3>Can both engines run highly available clusters?</h3>
          <p>
            Yes for Typesense, and with material caveats for Meilisearch.
            Typesense includes Raft clustering and automatic leader election in
            the open-source server, which avoids single points of failure for
            production search use cases. Meilisearch requires Enterprise Edition
            or Cloud for replication. Network searches can automatically fall
            back to another replica, but one static leader owns writes, and a
            leader failure blocks them until manual promotion.
          </p>
        </article>
        <article>
          <h3>Is Typesense schema-less like Meilisearch?</h3>
          <p>
            Not exactly, though it can feel that way. Typesense can infer field
            types automatically, then validates future records against them. It
            also supports strict schemas. Meilisearch accepts documents without
            a schema, including mixed types for the same field, which is
            convenient for ingestion but can
            <!-- prettier-ignore -->
            <CustomLink to="https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/how_to/sort_results#add-attributes-to-sortableattributes"><span>produce surprising sort behavior</span></CustomLink
            ><span>.</span>
          </p>
        </article>
        <article>
          <h3>Can both engines filter within nested arrays of objects?</h3>
          <p>
            Consider a single record that has an array-of-objects field called
            <code>variants</code>:
            <code
              >[{ color: "red", size: "M" }, { color: "blue", size: "L" }]</code
            >. A filter for red and L should not falsely match by taking the
            color from one variant and the size from another. Typesense binds
            both conditions to the same nested object. Meilisearch's precise
            path remodels variants as related records using experimental foreign
            keys. That model is unavailable with remote sharding, and a foreign
            filter returns an error when its related-side condition matches more
            than 100 documents.
          </p>
        </article>
        <article>
          <h3>Do both support semantic and hybrid search?</h3>
          <p>
            Yes. Meilisearch offers a broad embedder catalog and DiskANN.
            Typesense combines HNSW vector search with typo-tolerant keyword
            search, filters, and facets. It also adds Natural Language Search
            for structured query generation and a RAG API.
          </p>
        </article>
        <article>
          <h3>Can we keep an InstantSearch frontend?</h3>
          <p>
            Yes! Both products provide adapters for the InstantSearch ecosystem.
            The
            <CustomLink
              to="https://github.com/typesense/typesense-instantsearch-adapter"
            >
              <span>Typesense-InstantSearch adapter</span>
            </CustomLink>
            supports InstantSearch.js and the React, Vue, and Angular
            integrations, so much of the existing UI can stay in place.
          </p>
        </article>
        <article>
          <h3>How do we migrate from Meilisearch to Typesense?</h3>
          <p>
            Export from your source of truth, map Meilisearch index settings to
            a Typesense schema, bulk import, translate query parameters, and
            replay representative searches before cutting over. For large
            imports, process each record's response and retry when Typesense
            asks the client to slow down.
          </p>
        </article>
        <article>
          <h3>Does Rust versus C++ matter when choosing a search engine?</h3>
          <p>
            Not by itself. Meilisearch is written in Rust and Typesense in C++,
            but language alone is not a meaningful buyer-level differentiator.
            Compare architecture and behavior under the actual workload,
            including latency, reliability, relevance, operations, and cost. A
            team that plans to contribute deeply to the engine may still have a
            language preference.
          </p>
        </article>
      </div>
    </section>

    <section class="content-section">
      <h2>Compare other search platforms</h2>
      <p class="text-center text-text-muted">
        Read
        <CustomLink
          class="text-primary underline underline-offset-4"
          to="/typesense-vs-algolia/"
        >
          <span>Typesense vs Algolia</span>
        </CustomLink>
        or
        <!-- prettier-ignore -->
        <CustomLink class="text-primary underline underline-offset-4" to="/typesense-vs-elasticsearch/"><span>Typesense vs Elasticsearch</span></CustomLink
        ><span>.</span>
      </p>
    </section>

    <section class="cta-card">
      <div>
        <h2 class="normal-case">Let Your Workload Make the Decision</h2>
        <p>
          Bring your real dataset, queries, write rate, and latency target.
          Launch a managed cluster or run the same open-source Typesense engine
          yourself, then compare the smallest configuration that meets the bar.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <a
          class="cta-button cta-button-primary"
          href="https://cloud.typesense.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Typesense Cloud</span>
          <ArrowRight />
        </a>
        <a
          class="cta-button cta-button-white"
          href="https://github.com/typesense/typesense"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View on GitHub</span>
          <ArrowRight />
        </a>
      </div>
    </section>

    <img
      class="absolute bottom-[-1000px] left-1/2 z-[-1] w-max -translate-x-1/2 scale-x-110 max-md:bottom-[-220px] max-md:scale-[2]"
      src="/images/backgrounds/tunnels-bottom.svg"
      alt="background"
    />
  </div>
</template>

<script lang="ts" setup>
import ArrowRight from "@/assets/icons/arrow-right.svg";
import FlashFill from "@/assets/icons/flash-fill.svg";
import SearchFill from "@/assets/icons/search-fill.svg";

const title = "Typesense vs Meilisearch: A Production Comparison";
const description =
  "Compare Typesense and Meilisearch on open-source HA, memory strategy, semantic search, RAG, JOINs, curation, and transparent Cloud pricing.";
const pageUrl = "https://typesense.org/typesense-vs-meilisearch/";

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        mainEntityOfPage: pageUrl,
        dateModified: "2026-07-30",
        author: {
          "@type": "Organization",
          name: "Typesense, Inc.",
          url: "https://typesense.org/",
        },
        publisher: {
          "@type": "Organization",
          name: "Typesense, Inc.",
          url: "https://typesense.org/",
        },
      }),
    },
  ],
});
</script>

<style scoped>
section {
  @apply flex flex-col items-center;
}
h2 {
  @apply mb-6 text-center;
}
.intro {
  @apply max-w-[900px] text-left text-xl leading-[1.8] tracking-[-0.4px] text-text-muted max-md:text-[14px];
}
.table-wrapper {
  @apply w-full overflow-x-auto overflow-y-hidden rounded-3xl;
  scrollbar-color: rgb(60 70 220) transparent;
  scrollbar-width: thin;
}
.card {
  @apply relative w-full min-w-[760px] bg-bg-gray-2 p-4;
  box-shadow: -5.05px 4.04px 34.34px 0px rgba(0, 0, 0, 0.1);
}
table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0 6px;
}
table a {
  @apply text-primary underline underline-offset-2;
}
td,
th {
  @apply p-4 text-left align-top;
}
td {
  @apply leading-[1.6] text-text-muted;
}
th {
  @apply font-medium;
}
tbody tr {
  @apply bg-bg;
}
tbody tr td:first-child {
  @apply rounded-l-xl font-bold text-text-primary;
  width: 24%;
}
tbody tr td:last-child {
  @apply rounded-r-xl;
}
.content-section {
  @apply w-full;
}
.full-bleed {
  @apply shadow-[0_0_0_100vmax] shadow-secondary-bg;
  clip-path: inset(0 -100vmax);
}
.pricing-section {
  @apply py-14 max-md:py-10;
}
.pricing-intro {
  @apply mb-6 max-w-[820px] text-left leading-[1.7] text-text-muted;
}
.pricing-note {
  @apply mt-6 w-full text-left leading-[1.7] text-text-muted;
}
.card-grid {
  @apply grid w-full grid-cols-2 gap-6 max-md:grid-cols-1;
}
.content-card,
.faq-list article {
  @apply rounded-3xl bg-bg-gray-2 p-8 text-text-muted shadow-lg shadow-black/10 max-md:p-5;
}
.content-card h3,
.faq-list h3 {
  @apply mb-4 normal-case text-text-primary;
}
.content-card p + p {
  @apply mt-4;
}
.content-card ul {
  @apply list-disc space-y-4 pl-6 leading-[1.7];
}
.fit-grid {
  @apply grid w-full grid-cols-2 gap-6 max-md:grid-cols-1;
}
.fit-card {
  @apply rounded-3xl p-8 text-text-muted shadow-lg shadow-black/10 max-md:p-5;
}
.fit-card-meilisearch {
  @apply bg-bg-gray-2;
}
.fit-card-typesense {
  @apply bg-secondary-bg;
}
.fit-card h2 {
  @apply text-left text-text-primary;
}
.fit-card ul {
  @apply list-disc space-y-4 pl-6 leading-[1.7];
}
.faq-intro {
  @apply mb-6 max-w-[780px] text-left leading-[1.7] text-text-muted;
}
.faq-list {
  @apply grid w-full grid-cols-2 gap-6 max-md:grid-cols-1;
}
.faq-list p {
  @apply leading-[1.7];
}
.faq-list a {
  @apply text-primary underline underline-offset-2;
}
.cta-card {
  @apply w-full flex-row justify-between gap-8 rounded-3xl bg-primary p-10 text-text-inverted max-md:flex-col max-md:items-start max-md:p-6;
}
.cta-card h2 {
  @apply mb-3 text-left;
}
.cta-card p {
  @apply max-w-[620px] leading-[1.7];
}
.cta-button {
  @apply flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold tracking-[-0.32px] shadow-[-4px_4px_0px_0px] shadow-dark-bg max-md:px-4 max-md:py-2.5 max-sm:text-sm;
}
.cta-button-primary {
  @apply bg-primary text-white;
}
.cta-button-white {
  @apply bg-bg text-text-primary;
}
</style>
