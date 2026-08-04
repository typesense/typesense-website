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
        Typesense vs <strong>Elasticsearch</strong>
      </h1>
      <p class="intro">
        Elasticsearch takes a kitchen-sink approach: search, analytics,
        observability, security incident monitoring, and much more in one
        platform. That breadth is powerful, but developers building site and app
        search also inherit a JVM, mappings, shards, Query DSL, and a broad
        operating surface with a few thousand configuration parameters (we
        actually grepped through the Elasticsearch codebase to count this).
        Typesense unbundles that platform to zoom in on just site and app
        search. It ships sane defaults and exposes a deliberately chosen subset
        of runtime controls for cases that need tuning.
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
      <p
        class="mt-3 w-full max-w-[900px] text-left text-text-muted max-md:text-[14px] max-md:leading-[1.8]"
      >
        Comparing alternatives? Use the
        <CustomLink
          class="text-primary underline underline-offset-4"
          to="/elasticsearch-alternatives/"
        >
          <span>Elasticsearch alternatives guide</span>
        </CustomLink>
        to compare options by workload.
      </p>
    </section>

    <section class="-mt-20 w-full max-w-[1160px] self-center max-md:-mt-16">
      <h2 class="normal-case">Typesense vs Elasticsearch at a glance</h2>
      <p class="mb-2 text-sm text-text-muted md:hidden">
        Swipe horizontally to compare <span aria-hidden="true">→</span>
      </p>
      <div
        class="table-wrapper"
        role="region"
        aria-label="Horizontally scrollable Typesense and Elasticsearch feature comparison table"
        tabindex="0"
      >
        <div class="card">
          <table class="w-full text-sm tracking-tight">
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Area</th>
                <th>Typesense</th>
                <th class="rounded-r-xl">Elasticsearch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>License and hosting</td>
                <td>
                  The complete API surface is available in the open-source
                  server under GPL-3.0. Self-host it free forever or run the
                  same engine in a dedicated Typesense Cloud cluster.
                </td>
                <td>
                  Elasticsearch
                  <CustomLink to="https://www.elastic.co/blog/licensing-change">
                    <span>left Apache 2.0</span>
                  </CustomLink>
                  for SSPL and ELv2 in 2021, then
                  <CustomLink
                    to="https://www.elastic.co/blog/elasticsearch-is-open-source-again"
                  >
                    <span>added AGPLv3</span>
                  </CustomLink>
                  to the free portions in 2024. The default distribution and
                  X-Pack remain under ELv2. Self-managed has a free Basic tier
                  plus paid subscriptions; Elastic Cloud is paid.
                </td>
              </tr>
              <tr>
                <td>Product scope</td>
                <td>
                  Purpose-built for search inside websites, SaaS products,
                  mobile apps, and devices, including catalogs, marketplaces,
                  documentation, and in-product search
                </td>
                <td>
                  A distributed search and analytics platform spanning
                  application search, logs, observability, security incident
                  monitoring, ES|QL, and Kibana
                </td>
              </tr>
              <tr>
                <td>Runtime and storage</td>
                <td>
                  One self-contained native binary built in C++. Fields used for
                  search, filtering, sorting, and faceting stay in memory;
                  source documents and unindexed fields stay on disk.
                </td>
                <td>
                  JVM-based, with Lucene segments on disk and heavy use of the
                  filesystem cache. Elastic's production guidance asks teams to
                  <CustomLink
                    to="https://www.elastic.co/docs/deploy-manage/production-guidance/elasticsearch-in-production-environments"
                  >
                    <span
                      >plan heap, storage, mappings, shards, replicas, node
                      roles, and cluster health</span
                    >
                  </CustomLink>
                  as part of running the platform.
                </td>
              </tr>
              <tr>
                <td>Typo tolerance</td>
                <td>
                  Enabled by default, with per-query and per-field controls for
                  how forgiving a search should be
                </td>
                <td>
                  Fuzzy matching is configured through the query. Elastic Search
                  UI's Elasticsearch connector has
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.elastic.co/docs/reference/search-ui/api-core-configuration#fuzziness"><span>fuzziness disabled by default</span></CustomLink
                  ><span>.</span>
                </td>
              </tr>
              <tr>
                <td>Runtime search configuration</td>
                <td>
                  Change searchable fields and weights, filters, facets, typo
                  settings, grouping, ranking, and sorting on each request
                  through a focused search API
                </td>
                <td>
                  Query DSL, runtime fields, analyzers, and search templates
                  provide deep flexibility. Teams assemble and govern more
                  moving parts to shape an application-search experience.
                </td>
              </tr>
              <tr>
                <td>Schema and mapping changes</td>
                <td>
                  Automatic schema detection or a strict schema, with
                  ingestion-time type validation to keep collections clean
                </td>
                <td>
                  Dynamic mapping can infer field types. Because an
                  <CustomLink
                    to="https://www.elastic.co/docs/manage-data/data-store/mapping/update-mappings-examples"
                  >
                    <span
                      >existing field's type cannot be changed in place</span
                    >
                  </CustomLink>
                  after it is mapped, changing the type requires a new index and
                  reindexing.
                </td>
              </tr>
              <tr>
                <td>Relationships and JOINs</td>
                <td>
                  Query-time cross-collection JOINs through reference fields,
                  with filtering, faceting, sorting, nested joins, and field
                  inclusion
                </td>
                <td>
                  Nested documents, parent-child join fields, and ES|QL LOOKUP
                  JOIN cover several relationship models, each with different
                  modeling and performance tradeoffs
                </td>
              </tr>
              <tr>
                <td>Runtime sorting</td>
                <td>
                  Sort by up to three fields alongside relevance, geo distance,
                  or conditional ranking without duplicating a collection
                </td>
                <td>
                  Sort by one or more fields at query time. Scripted and
                  specialized sorts add further control.
                </td>
              </tr>
              <tr>
                <td>Geo search</td>
                <td>
                  Multiple independently queryable named geo fields per record,
                  polygon search, geo filtering, faceting, and distance sorting
                </td>
                <td>
                  Multiple <code>geo_point</code> and
                  <code>geo_shape</code> fields per document, with a broad set
                  of geo queries and aggregations
                </td>
              </tr>
              <tr>
                <td>Vector, semantic, and hybrid search</td>
                <td>
                  HNSW-based vector search, automatic or user-provided
                  embeddings, semantic search, and tunable hybrid rank fusion
                  across keyword and vector signals
                </td>
                <td>
                  kNN, <code>semantic_text</code>, hybrid retrieval, and
                  inference integrations. The
                  <CustomLink to="https://www.elastic.co/subscriptions/">
                    <span
                      >self-managed matrix puts reciprocal rank fusion for
                      hybrid search on Enterprise, and packaged ELSER for ML
                      nodes on Platinum or Enterprise</span
                    >
                  </CustomLink>
                  tiers.
                </td>
              </tr>
              <tr>
                <td>Natural Language Search</td>
                <td>
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/natural-language-search.html"
                  >
                    <span>Built-in Natural Language Search</span>
                  </CustomLink>
                  uses an LLM to turn a request such as “waterproof hiking shoes
                  under $150” into structured search terms, filters, and sort
                  parameters.
                </td>
                <td>
                  Elastic Agent Builder handles natural-language questions
                  through agents and tools over Elastic data. It is an
                  <CustomLink to="https://www.elastic.co/subscriptions/">
                    <span>Enterprise-tier feature</span>
                  </CustomLink>
                  in both self-managed Elasticsearch and Elastic Cloud, not part
                  of the free, open-source surface. It is a broader agent
                  workflow rather than request-time search-parameter
                  translation.
                </td>
              </tr>
              <tr>
                <td>Conversational Search / RAG</td>
                <td>
                  Built-in
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/conversational-search-rag.html"
                  >
                    <span>Conversational Search and RAG</span>
                  </CustomLink>
                  with streaming, conversation history, and OpenAI, Azure
                  OpenAI, Google, Cloudflare Workers AI, or self-hosted vLLM
                  models
                </td>
                <td>
                  The same Enterprise-tier Agent Builder creates conversational
                  agents that search, reason over, and take actions on
                  Elasticsearch data through built-in or custom tools and a
                  chosen LLM.
                </td>
              </tr>
              <tr>
                <td>Multi-tenancy</td>
                <td>
                  Scoped API keys can lock a client to permitted tenants,
                  filters, fields, query limits, and an expiry time
                </td>
                <td>
                  API keys can carry role descriptors and index restrictions.
                  The
                  <CustomLink to="https://www.elastic.co/subscriptions/">
                    <span
                      >self-managed subscription matrix places document-level
                      security on paid tiers</span
                    >
                  </CustomLink>
                  for query-filtered access.
                </td>
              </tr>
              <tr>
                <td>Direct client access</td>
                <td>
                  Backends, browsers, mobile apps, and devices can all query
                  Typesense. Public clients can connect directly using
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/api-keys.html#generate-scoped-search-key"
                  >
                    <span>search-only scoped API keys</span>
                  </CustomLink>
                  that restrict collections, filters, fields, query limits, and
                  expiry. This avoids an extra backend proxy hop, reducing
                  latency and backend work.
                </td>
                <td>
                  Elastic's own security guidance says Elasticsearch is
                  <CustomLink
                    to="https://www.elastic.co/guide/en/elasticsearch/reference/current/ip-filtering.html"
                  >
                    <span>not designed to be publicly accessible</span>
                  </CustomLink>
                  over the internet, even with IP filtering. Public applications
                  normally place a backend or proxy between the client and
                  cluster.
                </td>
              </tr>
              <tr>
                <td>Analytics and aggregations</td>
                <td>
                  Faceting plus purpose-built search, click, conversion, and
                  visit analytics for improving an application-search experience
                </td>
                <td>
                  A general aggregations framework, ES|QL, transforms, and
                  Kibana for analyzing search, logs, security, and operational
                  data
                </td>
              </tr>
              <tr>
                <td>Merchandising and curation</td>
                <td>
                  Open-source APIs and a Typesense Cloud UI for pinning, hiding,
                  filtering, sorting, query replacement, scheduled curations,
                  and rule-based overrides
                </td>
                <td>
                  Pinned queries, rank features, function scores, and Query DSL
                  can implement curation. The
                  <!-- prettier-ignore -->
                  <CustomLink to="https://www.elastic.co/subscriptions/cloud/"><span>Cloud subscription matrix places packaged Query Rules on its Enterprise tier</span></CustomLink
                  ><span>.</span>
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
                  with automatic leader election. A 3-node cluster preserves
                  quorum after 1 node fails, then continues serving reads and
                  writes after automatic failover.
                </td>
                <td>
                  Primary shards have replica copies, and Elasticsearch
                  automatically promotes a replica when a primary fails.
                  Elastic's self-managed reference architecture requires
                  <CustomLink
                    to="https://www.elastic.co/docs/deploy-manage/reference-architectures/hotfrozen-high-availability"
                  >
                    <span>enough nodes across three failure zones</span>
                  </CustomLink>
                  for high availability, plus deliberate shard placement and
                  allocation awareness.
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
                  automatically.
                </td>
                <td>
                  Elasticsearch supports multi-zone deployments and
                  cross-cluster search and replication. Teams design the
                  regional cluster and routing topology for their use case.
                </td>
              </tr>
              <tr>
                <td>InstantSearch and search UI</td>
                <td>
                  The
                  <CustomLink
                    to="https://github.com/typesense/typesense-instantsearch-adapter"
                  >
                    <span>Typesense InstantSearch adapter</span>
                  </CustomLink>
                  lets Algolia's JavaScript, React, Vue, and Angular widgets
                  work with a Typesense backend.
                </td>
                <td>
                  Elastic Search UI provides headless and React components with
                  an Elasticsearch connector. Its API differs from
                  InstantSearch.
                </td>
              </tr>
              <tr>
                <td>Support coverage</td>
                <td>
                  Typesense Cloud offers
                  <CustomLink to="https://cloud.typesense.org/support-plans">
                    <span>24/7/365 critical production support</span>
                  </CustomLink>
                  with response targets starting at 30 minutes. Self-hosted
                  support is community-based.
                </td>
                <td>
                  Elastic Cloud offers Standard, Gold, Platinum, and Enterprise
                  support levels. Platinum and Enterprise
                  <CustomLink to="https://www.elastic.co/pricing/cloud-hosted">
                    <span>include a 99.95% monthly uptime SLA</span>
                  </CustomLink>
                  for eligible Cloud services.
                </td>
              </tr>
              <tr>
                <td>Serverless offering</td>
                <td>
                  No. Typesense runs as provisioned persistent compute, either
                  self-hosted or in a dedicated Cloud cluster.
                </td>
                <td>
                  Yes. Elastic Cloud Serverless autoscales and meters ingest,
                  search, machine learning, storage, and data transfer rather
                  than exposing node resources.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="content-section">
      <Badge>NO PHD REQUIRED</Badge>
      <h2>
        Site and app search<br />
        without the rocket science
      </h2>
      <p class="section-intro">
        Elasticsearch's breadth is useful when one platform needs to serve many
        data workloads. Typesense makes a narrower product decision: solve site
        and app search exceptionally well, keep the defaults sensible, surface
        the controls developers regularly need, and resist long-tail features
        that would make every developer carry more complexity. Deep search
        infrastructure expertise is optional.
      </p>
      <div class="card-grid">
        <article class="content-card content-card-typesense">
          <h3>Typesense narrows the decisions you need to make</h3>
          <p>
            Typo tolerance, prefix search, faceting, highlighting, grouping,
            curation, geo search, and search analytics work through one focused
            API. Product teams can change the knobs that materially affect the
            search experience at runtime without first designing a general data
            platform.
          </p>
          <p>
            Typesense is intentionally opinionated. Common site and app search
            cases should work with sane defaults. More specialized cases get
            focused controls. Some long-tail features are deliberately left out
            when they would make the product harder for everyone else to learn
            and operate.
          </p>
        </article>
        <article class="content-card">
          <h3>Elasticsearch gives specialists a much larger toolbox</h3>
          <p>
            Elasticsearch gives experts control over analyzers, mappings, Query
            DSL, shards, replicas, node roles, data tiers, ingest pipelines, and
            cluster topology. That control pays off when search is one part of a
            larger analytics, observability, or security system.
          </p>
          <p>
            For a straightforward site-search problem, it can feel like taking a
            bulldozer to an anthill. The tool is immensely capable, but the team
            still owns every one of those controls, plus the work of finding the
            right settings across a very broad platform.
          </p>
        </article>
      </div>
    </section>

    <section class="testimonial-section">
      <div class="testimonial-card">
        <div class="testimonial-copy">
          <Badge>FROM AN ELASTICSEARCH MIGRATION</Badge>
          <h2>One workload, measured before and after</h2>
          <p>
            After moving from Elasticsearch to Typesense, @nucknyan shared this
            graph showing latency dropping from roughly 300 ms to roughly 50 ms,
            with better ranking too. Their follow-up says it best:
          </p>
          <blockquote class="testimonial-quote">
            <p>
              This is what I like to call “brick-shittingly good improvement”
            </p>
          </blockquote>
          <p class="testimonial-closer">
            Benchmark your real workload and see what Typesense can do.
          </p>
          <CustomLink
            class="testimonial-link"
            to="https://x.com/jasonbosco/status/1701438265704776043"
          >
            <span>View the post on X</span>
            <ArrowRight />
          </CustomLink>
        </div>
        <a
          class="testimonial-image-link"
          href="https://x.com/jasonbosco/status/1701438265704776043"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View the Elasticsearch to Typesense latency comparison on X"
        >
          <img
            class="testimonial-image"
            src="https://pbs.twimg.com/media/F5y4wvdWYAAnVOc.jpg"
            alt="Screenshot of an Elasticsearch to Typesense migration testimonial with a graph falling from about 300 milliseconds to about 50 milliseconds"
            width="1192"
            height="1758"
            loading="lazy"
          />
        </a>
      </div>
    </section>

    <section class="pricing-section full-bleed bg-secondary-bg">
      <Badge>PUBLIC REFERENCE PRICES</Badge>
      <h2>What each Cloud bill is measuring</h2>
      <p class="pricing-intro">
        Both Typesense and Elasticsearch publish pricing, but the units reflect
        different products. Typesense Cloud prices dedicated search clusters.
        Elastic prices a broader hosted or serverless data platform with
        subscription tiers and more usage dimensions.
      </p>
      <p class="mb-2 text-sm text-text-muted md:hidden">
        Swipe horizontally to compare <span aria-hidden="true">→</span>
      </p>
      <div
        class="table-wrapper"
        role="region"
        aria-label="Horizontally scrollable Typesense and Elasticsearch pricing comparison table"
        tabindex="0"
      >
        <div class="card">
          <table class="w-full text-sm tracking-tight">
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Pricing area</th>
                <th>Typesense</th>
                <th class="rounded-r-xl">Elasticsearch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Self-hosting</td>
                <td>
                  Free to self-host forever, including high availability,
                  analytics, vector and hybrid search, Natural Language Search,
                  RAG, JOINs, and curation
                </td>
                <td>
                  Basic self-managed capabilities are free. Platinum and
                  Enterprise subscriptions add paid features and support. The
                  default distribution uses ELv2.
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
                  Elastic's public Hosted reference is a 120 GB, two-zone
                  production configuration: Standard starts at $99 per month,
                  Gold at $114, Platinum at $131, and Enterprise at $184. That
                  is $1,188 to $2,208 per year.
                  <CustomLink to="https://www.elastic.co/pricing/cloud-hosted">
                    <span>View Elastic's reference configuration</span>
                  </CustomLink>
                </td>
              </tr>
              <tr>
                <td>How Cloud costs scale</td>
                <td>
                  Dedicated clusters are billed hourly by RAM and CPU
                  configuration, plus bandwidth, without per-search or
                  per-record fees. The full single-node and HA configuration
                  catalog is public, and clusters can be resized from the
                  dashboard or Cloud Management API.
                </td>
                <td>
                  Elastic Cloud Hosted scales with deployment resources, region,
                  and subscription level. Serverless meters usage rather than
                  node resources while autoscaling the underlying service.
                </td>
              </tr>
              <tr>
                <td>Feature boundaries</td>
                <td>
                  The same search API is available in the open-source server and
                  every Typesense Cloud cluster. Managed operations and
                  prioritized support are the paid services.
                </td>
                <td>
                  Elastic's
                  <CustomLink to="https://www.elastic.co/subscriptions/">
                    <span
                      >self-managed subscription matrix splits capabilities
                      across Basic, Platinum, and Enterprise</span
                    >
                  </CustomLink>
                  tiers, while Cloud adds Standard and Gold levels. Some
                  packaged ML and advanced retrieval capabilities require a
                  higher tier.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p class="pricing-note">
        These are public reference points, not equivalent workloads. Elastic's
        120 GB, two-zone example is not RAM-equivalent to the Typesense
        configuration. Compare the smallest setup on each service that meets the
        same dataset, indexing rate, query concurrency, latency, and
        availability targets.
      </p>
    </section>

    <section class="content-section fit-section">
      <div class="fit-grid">
        <article class="fit-card fit-card-elasticsearch">
          <h2>When Elasticsearch is a better fit</h2>
          <ul>
            <li>
              Search is one part of a broader logging, observability, security
              incident monitoring, or analytics platform, and consolidating
              those workloads matters more than keeping application search
              small.
            </li>
            <li>
              Your team needs complex aggregations, ES|QL investigations, Kibana
              dashboards, or transforms over operational and analytical data.
            </li>
            <li>
              You operate very large distributed datasets that need explicit
              shard placement, hot, warm, cold, or frozen data tiers,
              cross-cluster search, and topology control.
            </li>
            <li>
              Specialized analyzers, token filters, scoring scripts, percolator
              queries, or deep Lucene and Query DSL behavior are central to the
              product.
            </li>
            <li>
              Kibana, Logstash, Beats, Elastic Agent, and the wider Elastic
              integration ecosystem are already standard parts of your data
              stack.
            </li>
            <li>
              You need Elastic's packaged document-level security, role model,
              and higher-tier governance capabilities across a broader data
              platform.
            </li>
            <li>
              You want Agent Builder to search and take actions across Elastic
              data using built-in and custom tools, not only to power a
              site-search or product-search experience.
            </li>
          </ul>
        </article>
        <article class="fit-card fit-card-typesense">
          <h2>When Typesense is a better fit</h2>
          <ul>
            <li>
              The actual job is search inside a website or application, and you
              do not want every engineer on your team to become an
              Elasticsearch, Lucene, and JVM specialist.
            </li>
            <li>
              You want fast, typo-tolerant search-as-you-type behavior with
              sensible defaults, then the freedom to change fields, weights,
              filters, typo settings, ranking, and sort orders at request time
              without maintaining a web of mappings and templates.
            </li>
            <li>
              You prefer one native binary and want to avoid JVM heap sizing,
              shard strategy, node roles, mapping explosions, and reindex
              workflows that are infrastructure overhead rather than product
              requirements.
            </li>
            <li>
              One engine should cover keyword, vector, semantic, hybrid, geo,
              Natural Language Search, RAG, JOINs, curation, and search
              analytics without adopting an observability platform.
            </li>
            <li>
              The complete API surface, including Raft high availability, should
              stay available in the open-source server, with the option to
              self-host or use the same engine in Typesense Cloud.
            </li>
            <li>
              Field types should be validated at ingestion time, with automatic
              schema detection or strict schemas, instead of managed through
              mapping updates and reindexing.
            </li>
            <li>
              You want a public dedicated-cluster catalog with self-service
              resizing and no per-search or per-record fees.
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="content-section">
      <Badge>BEFORE YOU MIGRATE</Badge>
      <h2>What teams ask before choosing Typesense or Elasticsearch</h2>
      <p class="faq-intro">
        The deciding question is not which product has the longer feature list.
        It is whether your workload benefits from Elasticsearch's breadth enough
        to justify the larger learning and operating surface.
      </p>
      <div class="faq-list">
        <article>
          <h3>Is Typesense a drop-in replacement for Elasticsearch?</h3>
          <p>
            No. The data model, indexing endpoints, query syntax, and response
            shape differ. A migration means creating a Typesense schema,
            importing from your source of truth, translating queries, and
            testing relevance against representative searches. The payoff is a
            much smaller application-search surface after the move.
          </p>
        </article>
        <article>
          <h3>
            Does Typesense replace Elasticsearch for logs or observability?
          </h3>
          <p>
            No. Elasticsearch is often the better choice for logs, security
            incident monitoring, observability, ES|QL, and broad aggregations.
            Typesense is focused on search experiences inside websites and
            applications.
          </p>
        </article>
        <article>
          <h3>Is Elasticsearch open source?</h3>
          <p>
            That answer has changed a few times in the last few years, so we're
            all confused now. Jokes aside, Elasticsearch
            <CustomLink to="https://www.elastic.co/blog/licensing-change">
              <span>moved from Apache 2.0 to SSPL and ELv2</span>
            </CustomLink>
            in 2021, then called itself
            <CustomLink
              to="https://www.elastic.co/blog/elasticsearch-is-open-source-again"
            >
              <span>open source again</span>
            </CustomLink>
            in 2024 after adding AGPLv3 as an option for the free portions. SSPL
            and ELv2 are still offered, while the default distribution and
            X-Pack remain under ELv2. So, is Elasticsearch open source? Yes,
            maybe, maybe not, depending on the version, component, and offering
            you're talking about. Typesense's full server is open source under
            GPL-3.0.
          </p>
        </article>
        <article>
          <h3>Can both run highly available production clusters?</h3>
          <p>
            Yes. Typesense uses Raft and automatic leader election.
            Elasticsearch automatically promotes replica shards when a primary
            fails. The difference is the operating surface: self-managed
            Elasticsearch HA also involves shard allocation, node roles, failure
            zones, and cluster topology. In Typesense, the same Raft layer built
            into the same binary handles replication, quorum, leader election,
            and automatic failover. You just point the binaries at one another's
            IP addresses.
          </p>
        </article>
        <article>
          <h3>Why is Elasticsearch harder to operate for app search?</h3>
          <p>
            It solves more categories of problems. That means operators also
            reason about the JVM, shards, replicas, mappings, and cluster
            recovery. Elastic Cloud automates part of that work, but the
            concepts still shape architecture and cost. Typesense removes many
            of those decisions by focusing on site and app search and providing
            a batteries-included, out-of-the-box developer experience that
            reduces the time it takes to build delightful search experiences.
          </p>
        </article>
        <article>
          <h3>Do both support vector, semantic, and hybrid search?</h3>
          <p>
            Yes. Both support vector retrieval, semantic search, and hybrid
            ranking. Elasticsearch exposes a broad retrieval and inference
            platform. Typesense combines those capabilities with typo-tolerant
            keyword search and adds built-in Natural Language Search for
            generating structured search parameters, plus Conversational Search
            and RAG.
          </p>
        </article>
        <article>
          <h3>How should we compare Cloud pricing?</h3>
          <p>
            Benchmark the same dataset, indexing workload, query mix, latency,
            concurrency, and HA target. Elasticsearch and Typesense use
            different storage and memory models, so nominal RAM or disk alone is
            not an equivalent comparison. Typesense Cloud publishes every
            dedicated configuration and bills hourly resources plus bandwidth.
            Elastic offers Hosted resource pricing and Serverless usage meters.
            Then include the engineering time required to learn, maintain,
            babysit, and troubleshoot each setup. Infrastructure is only one
            line in the total cost of ownership.
          </p>
        </article>
        <article>
          <h3>What should we test before migrating?</h3>
          <p>
            Replay representative searches, typo-heavy queries, filters, facets,
            sort orders, geo searches, and indexing bursts. Compare relevance,
            p95 latency, memory, write throughput, failover, and operating
            effort. Test with the data shape you will run in production, not
            just a synthetic feature checklist.
          </p>
        </article>
      </div>
    </section>

    <section class="content-section">
      <h2>Compare other search platforms</h2>
      <p class="text-center text-text-muted">
        Compare
        <CustomLink
          class="text-primary underline underline-offset-4"
          to="/algolia-vs-elasticsearch/"
        >
          <span>Algolia vs Elasticsearch</span>
        </CustomLink>
        directly, or read
        <CustomLink
          class="text-primary underline underline-offset-4"
          to="/typesense-vs-algolia/"
        >
          <span>Typesense vs Algolia</span>
        </CustomLink>
        or
        <!-- prettier-ignore -->
        <CustomLink class="text-primary underline underline-offset-4" to="/typesense-vs-meilisearch/"><span>Typesense vs Meilisearch</span></CustomLink
        ><span>.</span>
      </p>
    </section>

    <section class="cta-card">
      <div>
        <h2 class="normal-case">Benchmark the Search, Not the Feature Count</h2>
        <p>
          Bring your real data, queries, indexing rate, and latency target.
          Launch a managed cluster or run the open-source server, then see how
          much search infrastructure the workload actually needs.
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

const title = "Typesense vs Elasticsearch: Focused App Search";
const description =
  "Compare Typesense's focused site and app search with Elasticsearch's broader platform across operations, semantic search, high availability, and pricing.";
const pageUrl = "https://typesense.org/typesense-vs-elasticsearch/";

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
  @apply w-full max-w-[1160px] self-center;
}
.testimonial-section {
  @apply w-full max-w-[1160px] self-center;
}
.testimonial-card {
  @apply grid w-full grid-cols-[minmax(0,0.85fr)_minmax(320px,0.65fr)] items-center gap-10 rounded-3xl bg-blue-in-green p-10 text-text-inverted shadow-lg shadow-black/10 max-md:grid-cols-1 max-md:gap-6 max-md:p-5;
}
.testimonial-copy {
  @apply flex flex-col items-start;
}
.testimonial-copy h2 {
  @apply mb-4 text-left text-text-inverted;
}
.testimonial-copy p {
  @apply mb-6 max-w-[620px] text-left leading-[1.7] text-text-inverted/90;
}
.testimonial-quote {
  @apply relative mb-6 ml-6 max-w-[560px] border-l-2 border-white/40 pl-8 max-md:ml-4 max-md:pl-6;
}
.testimonial-quote::before {
  content: "“";
  position: absolute;
  top: -1.75rem;
  left: -0.45rem;
  color: rgb(255 255 255 / 45%);
  font-family: Georgia, serif;
  font-size: 6rem;
  line-height: 1;
}
.testimonial-copy .testimonial-quote p {
  @apply mb-0 text-xl font-semibold italic leading-[1.5] text-text-inverted max-md:text-lg;
}
.testimonial-copy .testimonial-closer {
  @apply mb-6;
}
.testimonial-link {
  @apply flex items-center gap-2 font-semibold text-text-inverted underline underline-offset-4;
}
.testimonial-image-link {
  @apply block overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-black/20;
}
.testimonial-image {
  @apply block h-auto w-full rounded-xl;
}
.section-intro {
  @apply mb-8 max-w-[840px] text-left leading-[1.7] text-text-muted;
}
.full-bleed {
  @apply shadow-[0_0_0_100vmax] shadow-secondary-bg;
  clip-path: inset(0 -100vmax);
}
.pricing-section {
  @apply py-14 max-md:py-10;
}
.pricing-intro {
  @apply mb-6 max-w-[840px] text-left leading-[1.7] text-text-muted;
}
.pricing-note {
  @apply mt-6 w-full max-w-[1160px] text-left leading-[1.7] text-text-muted;
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
.content-card-typesense {
  @apply bg-secondary-bg;
}
.fit-grid {
  @apply grid w-full grid-cols-2 gap-6 max-md:grid-cols-1;
}
.fit-card {
  @apply rounded-3xl p-8 text-text-muted shadow-lg shadow-black/10 max-md:p-5;
}
.fit-card-elasticsearch {
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
