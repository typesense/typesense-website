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
        Typesense vs <strong>Algolia</strong>
      </h1>
      <p class="intro">
        Typesense is an open source search API and Algolia alternative that
        delivers the same instant search-as-you-type experience for a fraction
        of the cost. Algolia is a fully managed, proprietary search service with
        productized merchandising and experimentation, along with built-in
        recommendations and personalization features at higher plan tiers.
        Typesense combines typo-tolerant keyword search with direct vector
        search, hybrid search, semantic search, and geo search. It also offers
        native integrations with LLMs of your choice to enable Natural Language
        Search and built-in retrieval-augmented generation (RAG). Typesense
        includes built-in high availability and the freedom to self-host or use
        a dedicated Typesense Cloud cluster.
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

    <section class="-mt-20 max-md:-mt-12">
      <h2>Typesense vs Algolia at a glance</h2>
      <p class="mb-2 text-sm text-text-muted md:hidden">
        Swipe horizontally to compare <span aria-hidden="true">→</span>
      </p>
      <div
        class="table-wrapper"
        role="region"
        aria-label="Horizontally scrollable Typesense and Algolia feature comparison table"
        tabindex="0"
      >
        <div class="card">
          <table class="w-full text-sm tracking-tight">
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Area</th>
                <th>Typesense</th>
                <th class="rounded-r-xl">Algolia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>License</td>
                <td>GPL-3.0</td>
                <td>Proprietary</td>
              </tr>
              <tr>
                <td>Hosting</td>
                <td>Free self-hosting or dedicated Typesense Cloud clusters</td>
                <td>Fully managed SaaS with no self-hosted option</td>
              </tr>
              <tr>
                <td>Dataset and index limits</td>
                <td>
                  No plan-based cap on collection count or collection size.
                  Practical capacity depends on provisioned RAM, CPU, disk, and
                  workload.
                </td>
                <td>
                  Algolia's
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/scaling/algolia-service-limits"
                  >
                    <span>published service limits</span>
                  </CustomLink>
                  set Build at 1 GB and 10 indices per application; Grow and
                  Grow Plus at 100 GB application-wide and 50 indices; and
                  Elevate at 100 GB application-wide and 1,000 indices. Replicas
                  count toward index limits, and standard replicas also multiply
                  billable records. Contracted Service Orders may differ.
                </td>
              </tr>
              <tr>
                <td>Typo tolerance</td>
                <td>Enabled by default with up to two typos</td>
                <td>
                  Enabled by default with up to two typos, or three when the
                  first typo is on the initial letter
                </td>
              </tr>
              <tr>
                <td>Vector and hybrid search</td>
                <td>
                  Built-in HNSW, automatic embeddings, tunable hybrid rank
                  fusion, semantic search, and Natural Language Search
                </td>
                <td>
                  No direct vector-search API. NeuralSearch combines keyword and
                  vector results and is available on higher plan tiers.
                </td>
              </tr>
              <tr>
                <td>Multi-tenancy</td>
                <td>
                  Scoped API keys can embed non-overridable filters, field
                  restrictions, and expiry times, so each client can access only
                  its tenant's permitted records and fields
                </td>
                <td>
                  Secured keys can restrict indices and filters and set rate
                  limits and expiry
                </td>
              </tr>
              <tr>
                <td>High availability</td>
                <td>
                  Typesense uses
                  <CustomLink
                    to="https://typesense.org/docs/guide/high-availability.html"
                  >
                    <span>Raft clustering</span>
                  </CustomLink>
                  for HA: a 3-node cluster tolerates 1 failed node and a 5-node
                  cluster tolerates 2, with reads and writes unaffected while
                  quorum remains. Typesense Cloud supports HA clusters that can
                  have 3 to 7 nodes, and automatically reroutes traffic away
                  from failed nodes.
                </td>
                <td>
                  Classic infrastructure uses
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/scaling/infrastructure/classic/servers-clusters"
                  >
                    <span>three-server Raft clusters</span>
                  </CustomLink>
                  that prioritize search availability. Searches continue with 1
                  or 2 servers down, while indexing pauses until all 3 are
                  online.
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
                  distributes data across up to 7 regions per cluster, from
                  among 26 available region choices, and routes searches to the
                  nearest healthy node.
                </td>
                <td>
                  Algolia advertises its
                  <CustomLink
                    to="https://www.algolia.com/distributed-secure/global-infrastructure"
                  >
                    <span>17-region network</span>
                  </CustomLink>
                  globally, while
                  <CustomLink to="https://www.algolia.com/pricing">
                    <span>Grow and Grow Plus</span>
                  </CustomLink>
                  offer hosting only in the US, UK, or EU West. A
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/scaling/infrastructure/classic/distributed-search-network-dsn"
                  >
                    <span>paid DSN</span>
                  </CustomLink>
                  adds one or more regional servers.
                </td>
              </tr>
              <tr>
                <td>Independent geo fields</td>
                <td>
                  Typesense supports
                  <CustomLink
                    to="https://typesense.org/docs/30.2/api/geosearch.html"
                  >
                    <span>multiple named geo fields</span>
                  </CustomLink>
                  using <code>geopoint</code> or <code>geopoint[]</code>,
                  queried independently. For example, one record can have
                  separate <code>pickup_location</code> and
                  <code>delivery_location</code> fields.
                </td>
                <td>
                  Algolia geo search uses the
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/managing-results/refine-results/geolocation"
                  >
                    <span>reserved <code>_geoloc</code> field</span>
                  </CustomLink>
                  with one or several coordinates in a single pool ranked by
                  closest match. It cannot independently filter
                  <code>pickup_location</code> by one geo condition and
                  <code>delivery_location</code> by another within the same
                  record.
                </td>
              </tr>
              <tr>
                <td>Sort orders</td>
                <td>
                  Flexible query-time sorting, without the need to duplicate
                  indices. Sort by up to three fields alongside relevance, geo,
                  or conditional ranking.
                </td>
                <td>
                  Each sort order needs a replica. Standard replicas duplicate
                  records and increase record charges; virtual replicas avoid
                  duplication but are capped at 20, support fewer settings, and
                  do not provide exhaustive sorting.
                </td>
              </tr>
              <tr>
                <td>Merchandising</td>
                <td>
                  Typesense Cloud UI for rules, pinning, hiding, filtering,
                  sorting, and scheduled curations; the same capabilities are
                  available by API
                </td>
                <td>
                  Visual and Manual Editors plus a broader Merchandising Studio
                  for search results, facets, category pages, banners, and
                  redirects
                </td>
              </tr>
              <tr>
                <td>A/B testing</td>
                <td>
                  No built-in A/B dashboard; teams can run experiments through
                  their existing experimentation platform and set Typesense
                  search parameters dynamically at runtime
                </td>
                <td>
                  Built-in A/B testing; requires click and conversion events
                  before results can be measured
                </td>
              </tr>
              <tr>
                <td>Agent tooling</td>
                <td>
                  Built-in
                  <CustomLink
                    to="https://typesense.org/docs/latest/api/conversational-search-rag.html"
                  >
                    <span>Conversational Search (RAG)</span>
                  </CustomLink>
                  grounds answers in indexed data and keeps context for
                  follow-up questions. Choose OpenAI, Azure OpenAI, Google,
                  Cloudflare Workers AI, or a self-hosted vLLM model.
                </td>
                <td>
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/algolia-ai/agent-studio"
                  >
                    <span>Agent Studio</span>
                  </CustomLink>
                  connects a chosen LLM to Algolia search and tools to build
                  assistants grounded in live index data. Its
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/algolia-ai/askai"
                  >
                    <span>Ask AI capability</span>
                  </CustomLink>
                  turns documentation, blogs, and support content into a
                  conversational assistant; it is part of Agent Studio and is
                  not offered as a standalone feature for new applications.
                </td>
              </tr>
              <tr>
                <td>Serverless offering</td>
                <td>
                  No. Typesense is a persistent in-memory process that requires
                  an uninterrupted runtime, RAM, and persistent disk.
                </td>
                <td>
                  No. Although its pricing is usage-based,
                  <CustomLink
                    to="https://www.algolia.com/doc/guides/scaling/infrastructure/classic/servers-clusters"
                  >
                    <span>Algolia operates stateful 128 GB RAM clusters</span>
                  </CustomLink>
                  that store customer indices.
                </td>
              </tr>
              <tr>
                <td>InstantSearch UI</td>
                <td>
                  Typesense offers an adapter that allows Algolia's
                  InstantSearch UI widgets to work with a Typesense backend for
                  JavaScript, React, Vue, React Native, and Angular
                </td>
                <td>
                  JavaScript, React, Vue, iOS, Android, and Flutter libraries
                </td>
              </tr>
              <tr>
                <td>Support coverage</td>
                <td>
                  Typesense Cloud offers
                  <CustomLink to="https://typesense.org/support/">
                    <span>24/7/365 critical production support</span>
                  </CustomLink>
                  with response SLAs starting at 30 minutes. Self-hosted support
                  is community-based.
                </td>
                <td>
                  Grow, Grow Plus, and Elevate include web support during
                  weekday business hours. Elevate offers paid support-plan
                  add-ons;
                  <CustomLink to="https://www.algolia.com/policies/support">
                    <span>Extended Support</span>
                  </CustomLink>
                  covers P0 and P1 incidents 24/7.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="content-section">
      <h2>Your search infrastructure, on your terms</h2>
      <div class="card-grid">
        <article class="content-card">
          <h3>Run Typesense where it fits</h3>
          <p>
            Run the same open-source Typesense engine on infrastructure you
            operate or in a dedicated Typesense Cloud cluster. You can choose
            who runs the infrastructure without changing search engines.
          </p>
          <p>
            Self-hosting gives your team responsibility for provisioning,
            monitoring, upgrades, and scaling. Typesense Cloud handles those
            cluster operations without closing off a self-hosted path later.
            Because both options use the same open-source engine, you avoid
            tying your search implementation to one hosting platform.
          </p>
        </article>
        <article class="content-card">
          <h3>Let Algolia run the service</h3>
          <p>
            Algolia is a proprietary, hosted-only search service. Its classic
            infrastructure is shared by default, with dedicated infrastructure
            available as an add-on.
          </p>
          <p>
            It is a good fit when a vendor-operated SaaS is the priority and
            your team does not need a self-hosted path. The trade-off is
            platform lock-in: because the engine and service are proprietary and
            hosted only, leaving Algolia means rebuilding your search stack when
            migrating to a different search platform.
          </p>
        </article>
      </div>
    </section>

    <section class="pricing-section full-bleed bg-secondary-bg">
      <Badge>PUBLIC LIST-PRICE COMPARISON</Badge>
      <h2>Typesense vs Algolia pricing</h2>
      <p class="mb-2 text-sm text-text-muted md:hidden">
        Swipe horizontally to compare <span aria-hidden="true">→</span>
      </p>
      <div
        class="table-wrapper"
        role="region"
        aria-label="Horizontally scrollable Typesense and Algolia pricing model comparison table"
        tabindex="0"
      >
        <div class="card">
          <table class="w-full text-sm tracking-tight">
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Pricing model</th>
                <th>Typesense</th>
                <th class="rounded-r-xl">Algolia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Self-hosting and starting point</td>
                <td>
                  Free to self-host forever, with infrastructure and operations
                  handled by your team. Typesense Cloud has a one-time free tier
                  with 720 node hours and 10 GB of bandwidth.
                </td>
                <td>
                  No self-hosted option. Build is free for development and
                  includes one million records and 10,000 search requests per
                  month.
                </td>
              </tr>
              <tr>
                <td>How hosted pricing scales</td>
                <td>
                  Typesense Cloud bills dedicated RAM and CPU resources hourly,
                  plus bandwidth, without per-search or per-record charges. For
                  example, a 2 GB burst single-node configuration is about $51
                  per month; 2 GB burst with 3-node HA is about $153 per month.
                  <a href="#real-workload-pricing">
                    <span>See real workload pricing below</span>
                  </a>
                  for more examples.
                </td>
                <td>
                  Grow includes 10,000 search requests per month, then charges
                  $0.50 per 1,000; Grow Plus includes 10,000, then charges $1.75
                  per 1,000. Both include 100,000 records, then charge $0.40 per
                  1,000. Elevate uses custom annual pricing.
                  <CustomLink to="https://www.algolia.com/pricing">
                    <span>View Algolia pricing</span>
                  </CustomLink>
                  for current public rates.
                </td>
              </tr>
              <tr>
                <td>Cost of additional sort orders</td>
                <td>
                  For example, price low-to-high, price high-to-low, and newest
                  can use a single index and query-time <code>sort_by</code>
                  against the same records, without multiplying your costs.
                </td>
                <td>
                  Those same three sort orders each require a replica. Standard
                  replicas duplicate the records and multiply their billable
                  cost. Virtual replicas avoid record duplication but are
                  capped, support fewer settings, and do not provide exhaustive
                  sorting.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="pricing-predictability">
        <CustomLink
          to="https://www.algolia.com/doc/guides/building-search-ui/going-further/optimize-search-request-usage/js"
        >
          <span>Algolia's request-usage guide</span>
        </CustomLink>
        says each keystroke can count as a search request. Typesense Cloud does
        not add a per-search charge, so a traffic spike does not create a
        separate per-request line item. You may still need to resize the cluster
        as your dataset, search concurrency, or latency requirements change, but
        the cost increase is not as steep as it would be with Algolia. See below
        for
        <a href="#real-workload-pricing">
          <span>pricing examples of real search workloads</span>
        </a>
        that show how the costs compare.
      </p>

      <h3 id="real-workload-pricing" class="pricing-heading">
        Pricing Comparison for Real-World Search Workloads
      </h3>
      <p class="pricing-note">
        These five examples are drawn from anonymized usage of actual clusters
        running on Typesense Cloud. They intentionally show a range, not only
        the best cases. Savings vary with dataset shape, number of records, and
        provisioned capacity.
      </p>
      <p class="pricing-note">
        The examples compare dedicated-compute pricing in Typesense Cloud with
        undiscounted public Algolia Grow search-request pricing. Algolia figures
        exclude record charges, negotiated rates, and annual discounts, so they
        are conservative public list-price comparisons, not expected invoices at
        the higher volumes.
      </p>
      <div class="table-wrapper max-md:hidden">
        <div class="card pricing-comparison-card">
          <table class="pricing-comparison-table w-full text-sm tracking-tight">
            <colgroup>
              <col class="pricing-volume-col" />
              <col class="pricing-configuration-col" />
              <col class="pricing-typesense-col" />
              <col class="pricing-algolia-col" />
              <col class="pricing-annual-savings-col" />
              <col class="pricing-savings-col" />
            </colgroup>
            <thead class="bg-blue-in-green text-text-inverted">
              <tr>
                <th class="rounded-l-xl">Search volume</th>
                <th>Typesense Cloud configuration</th>
                <th>Typesense Cloud</th>
                <th>Algolia Grow</th>
                <th>Annual savings</th>
                <th class="rounded-r-xl">Savings %</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="scenario in pricingScenarios"
                :key="scenario.projectedRequests"
              >
                <td>{{ scenario.volume }}</td>
                <td>{{ scenario.configuration }}</td>
                <td>
                  <span class="block">
                    {{ scenario.typesenseMonthly }} / month
                  </span>
                  <span class="block">
                    {{ scenario.typesenseAnnual }} / year
                  </span>
                </td>
                <td>
                  <span class="block">
                    {{ scenario.algoliaMonthly }} / month
                  </span>
                  <span class="block">
                    {{ scenario.algoliaAnnual }} / year
                  </span>
                </td>
                <td>{{ scenario.annualSavings }} / year</td>
                <td>{{ scenario.percentageSavings }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="workload-cards md:hidden">
        <article
          v-for="scenario in pricingScenarios"
          :key="scenario.projectedRequests"
          class="workload-card"
        >
          <div>
            <h4>{{ scenario.volume }}</h4>
            <p class="workload-configuration">
              {{ scenario.configuration }}
            </p>
          </div>
          <dl>
            <div>
              <dt>Typesense Cloud compute cost</dt>
              <dd>
                {{ scenario.typesenseMonthly }} / month<br />
                {{ scenario.typesenseAnnual }} / year
              </dd>
            </div>
            <div>
              <dt>Algolia Grow minimum</dt>
              <dd>
                {{ scenario.algoliaMonthly }} / month<br />
                {{ scenario.algoliaAnnual }} / year
              </dd>
            </div>
            <div class="workload-savings">
              <dt>Annual savings vs public Grow price</dt>
              <dd>
                {{ scenario.annualSavings }} / year
                <span>{{ scenario.percentageSavings }}</span>
              </dd>
            </div>
          </dl>
        </article>
      </div>
      <p class="pricing-disclaimer">
        Annual savings compare these observed Typesense Cloud compute costs with
        Algolia's public Grow rate. They are estimates, not quotes. Figures are
        rounded to the nearest dollar from exact estimates, so monthly and
        annual amounts may differ slightly when multiplied. These examples are
        not sizing guarantees. Dataset shape, query complexity, writes,
        concurrency, latency targets, and capacity headroom all affect the
        resources a workload needs.
      </p>
    </section>

    <section class="content-section">
      <div class="testimonial-layout">
        <div class="testimonial-intro">
          <h2>From teams that switched from Algolia</h2>
          <p class="proof-copy">
            Teams moving from Algolia to Typesense Cloud have reported
            search-cost savings of 50% or more. Typesense preserves the same
            instant, typo-tolerant search-as-you-type experience. If you already
            use InstantSearch, the
            <CustomLink
              to="https://github.com/typesense/typesense-instantsearch-adapter"
            >
              <span>Typesense InstantSearch adapter</span>
            </CustomLink>
            lets you keep your existing widgets in most cases. You can move to
            Typesense Cloud or self-host the same search server.
            <CustomLink
              class="text-primary underline underline-offset-4"
              to="https://typesense.org/docs/guide/migrating-from-algolia.html"
            >
              <span>Read the migration guide</span>
            </CustomLink>
            for implementation details.
          </p>
          <p class="testimonial-stories text-text-muted">
            <CustomLink
              class="text-primary underline underline-offset-4"
              to="https://cloud.typesense.org/pricing/calculator#switching-from-algolia"
            >
              <span>Read more stories from teams that switched</span>
            </CustomLink>
            for additional examples.
          </p>
        </div>
        <div class="testimonial-stack">
          <figure class="testimonial-card">
            <blockquote>
              “our overhead for search is less than 25% of what it used to be.”
            </blockquote>
            <figcaption>
              Joshua S, CTO at Adviise, on costs after moving from Algolia
            </figcaption>
          </figure>
          <figure class="testimonial-card testimonial-card-lime">
            <blockquote>“I had that working in 15 minutes”</blockquote>
            <figcaption>
              Richard S, Full Stack Developer at The Fold Line, on reusing its
              InstantSearch frontend
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="content-section fit-section">
      <div class="fit-grid">
        <article class="fit-card fit-card-algolia">
          <h2>When Algolia is a better fit</h2>
          <ul>
            <li>
              You want packaged personalization and recommendation products
              rather than assembling those workflows in your application.
            </li>
            <li>
              You want a built-in A/B testing dashboard to split traffic and
              measure search experiments without connecting another
              experimentation platform.
            </li>
            <li>
              Your ecommerce team needs a broader no-code merchandising suite
              than Typesense Cloud's curation UI, including facet and category
              merchandising, banners, redirects, or Smart Groups.
            </li>
            <li>
              You use an
              <CustomLink to="https://www.algolia.com/doc/integration">
                <span>Algolia-maintained integration</span>
              </CustomLink>
              for platforms like Shopify, Adobe Commerce, BigCommerce,
              commercetools, or Salesforce B2C Commerce and prefer not to own
              that sync layer.
            </li>
            <li>
              Your primary content lives on a website or docs site, and you want
              Algolia's
              <CustomLink
                to="https://www.algolia.com/doc/tools/crawler/getting-started/create-crawler"
              >
                <span>hosted Crawler</span>
              </CustomLink>
              to extract and index it, then schedule recrawls without building
              or maintaining the ingestion pipeline.
            </li>
            <li>
              You want managed relevance automation such as Dynamic Re-Ranking,
              Query Categorization, AI Synonyms, or NeuralSearch. Availability
              depends on plan, and behavioral features require event data.
            </li>
            <li>
              A hosted-only search service suits your operating model and you do
              not need a self-hosted path.
            </li>
            <li>You want packaged agent tooling such as Agent Studio.</li>
          </ul>
        </article>
        <article class="fit-card fit-card-typesense">
          <h2>When Typesense is a better fit</h2>
          <ul>
            <li>
              Your business is doing well, search is taking off, and costs are
              climbing with it. You would rather skip an annual negotiation with
              Algolia's Sales team. Typesense Cloud publishes its full pricing
              catalog online, charges no per-search or per-record fees, and lets
              you resize your cluster up or down yourself. Its pay-as-you-go
              pricing means you pay for the exact configuration that is running.
            </li>
            <li>
              Your traffic peaks seasonally. Instead of prepaying or
              provisioning for the annual peak, you can resize Typesense Cloud
              for the busy month, then scale back down and pay only for the
              compute used while each configuration runs. You can also call the
              <CustomLink
                to="https://typesense.org/docs/cloud-management-api/v1/cluster-configuration-changes.html"
              >
                <span>Cloud Management API</span>
              </CustomLink>
              from your own scheduler or automation to scale up during the day
              and back down at night.
            </li>
            <li>
              You want to vary searchable fields and weights, filters, facets,
              typo tolerance, grouping, and sorting by page, user, or experiment
              using
              <CustomLink
                to="https://typesense.org/docs/latest/api/search.html#search-parameters"
              >
                <span>runtime search parameters</span>
              </CustomLink>
              and your existing experimentation platform, without cloning an
              index.
            </li>
            <li>
              You want to preserve product, pricing, inventory, or other
              relationships.
              <CustomLink to="https://typesense.org/docs/latest/api/joins.html">
                <span>JOINs</span>
              </CustomLink>
              let you retrieve, filter, facet, and sort across collections
              without copying every relationship into every document.
            </li>
            <li>
              You need several exhaustive sort orders against one collection at
              query time, without replicas or multiplying your costs.
            </li>
            <li>
              You want direct vector and hybrid search primitives with runtime
              control over weighting, distance thresholds, and reranking.
            </li>
            <li>
              You want synchronous writes, where success means the change is
              written to a majority and is already searchable, without polling
              an indexing task.
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="content-section">
      <Badge>MIGRATION WITHOUT A REBUILD</Badge>
      <h2>What teams ask before switching from Algolia</h2>
      <p class="faq-intro">
        Our
        <CustomLink
          class="text-primary underline underline-offset-4"
          to="https://typesense.org/docs/guide/migrating-from-algolia.html"
        >
          <span>Algolia to Typesense Migration Guide</span>
        </CustomLink>
        covers endpoint mappings and rollout guidance.
      </p>
      <div class="faq-list">
        <article>
          <h3>Is Typesense a drop-in API replacement for Algolia?</h3>
          <p>
            Not at the API level. The search concepts
            <CustomLink
              to="https://typesense.org/docs/guide/migrating-from-algolia.html#equivalent-features-and-concepts"
            >
              <span>map closely</span>
            </CustomLink>
            even though backend calls use different endpoints and parameters, so
            those calls need to be translated.
          </p>
        </article>
        <article>
          <h3>Can we keep our InstantSearch frontend?</h3>
          <p>
            Yes!
            <CustomLink
              to="https://github.com/typesense/typesense-instantsearch-adapter"
            >
              <span>The Typesense InstantSearch adapter</span>
            </CustomLink>
            preserves most JavaScript, React, Vue, and Angular InstantSearch
            widgets. Some widgets and options need documented adjustments.
          </p>
        </article>
        <article>
          <h3>How long does an Algolia migration usually take?</h3>
          <p>
            Based on real-world feedback from teams that migrated, the median is
            two to three weeks, with stacks that use InstantSearch often taking
            less time because
            <CustomLink
              to="https://github.com/typesense/typesense-instantsearch-adapter"
            >
              <span>our adapter</span>
            </CustomLink>
            preserves much of the frontend. Data volume, rules, relevance
            tuning, and rollout requirements shape the range.
          </p>
        </article>
        <article>
          <h3>What changes in the indexing workflow?</h3>
          <p>
            Algolia writes return asynchronous task IDs that you poll. Typesense
            writes are synchronous: success means the write reached a majority
            and is searchable. For bulk imports, handle backpressure with a
            retry mechanism using a jittered 10 to 60 second delay. This
            <CustomLink
              to="https://typesense.org/docs/guide/syncing-data-into-typesense.html"
            >
              <span>detailed article on ingesting data into Typesense</span>
            </CustomLink>
            covers the workflow.
          </p>
        </article>
        <article>
          <h3>Is Typesense schema-less like Algolia?</h3>
          <p>
            Yes, Typesense supports both schemaless mode and strict schemas. In
            schemaless mode, Typesense automatically detects fields, while the
            <code>dirty_values</code> setting controls whether mismatched values
            are coerced or rejected. That said, we usually recommend setting up
            a schema to improve validations and keep your index clean.
          </p>
        </article>
        <article>
          <h3>
            Can Typesense handle relationships between records in different
            indices?
          </h3>
          <p>
            Yes. JOINs preserve and query related collections, so you can
            retrieve, filter, facet, and sort across relationships without
            copying them into every document.
          </p>
        </article>
        <article>
          <h3>
            How do Typesense sort orders differ from Algolia virtual replicas?
          </h3>
          <p>
            Typesense applies <code>sort_by</code> at query time, so one
            collection can serve multiple exhaustive sort orders without
            replicas or multiplied record costs. In Algolia, adding standard
            replicas for common sort orders, for example, price ascending, price
            descending, and newest, turns one primary catalog into four full
            copies, multiplying billable records. Virtual replicas avoid record
            copies but still use index slots, are capped at 20 per index,
            support fewer settings, and do not provide exhaustive sorting.
          </p>
        </article>
        <article>
          <h3>How does cost change as traffic grows?</h3>
          <p>
            Typesense costs generally grow much less steeply than Algolia's
            per-search and per-record model because Typesense Cloud bills hourly
            resources and bandwidth without per-search or per-record fees.
            Self-hosting is free. You may still need more capacity as dataset
            size, concurrency, query complexity, and latency requirements grow.
            The
            <a href="#real-workload-pricing">
              <span>real-world pricing examples above</span>
            </a>
            show this range across observed workloads.
          </p>
        </article>
        <article>
          <h3>What happens if an attribute changes type between records?</h3>
          <p>
            Algolia accepts mixed types because
            <CustomLink
              to="https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/in-depth/what-is-in-a-record"
            >
              <span>ordinary attributes are schema-agnostic</span>
            </CustomLink>
            by default. The trade-off is that filters remain type-sensitive: a
            numeric filter such as <code>price &lt; 100</code> only matches
            records where <code>price</code> is numeric, so string-valued prices
            can quietly disappear from that filtered result. Typesense lets you
            choose the contract. Define a schema to reject mismatches, or use
            auto-schema and
            <CustomLink
              to="https://typesense.org/docs/latest/api/documents.html#dealing-with-dirty-data"
            >
              <span>configure <code>dirty_values</code></span>
            </CustomLink>
            to coerce, drop, or reject incompatible input.
          </p>
        </article>
        <article>
          <h3>
            Can filters operate within a nested array of objects, within a
            single object?
          </h3>
          <p>
            Yes. Typesense supports
            <CustomLink
              to="https://typesense.org/docs/30.2/api/search.html#filter-parameters"
            >
              <span>correlated nested-array filters</span>
            </CustomLink>
            using <code>parent.{...}</code>, so every predicate must match the
            same object in the array. For example,
            <code
              >ingredients.{name:=cheese &amp;&amp; concentration:&lt;50}</code
            >
            requires one ingredient object to satisfy both conditions. Algolia's
            <CustomLink
              to="https://support.algolia.com/hc/en-us/articles/9791093481233-Why-is-my-nested-array-not-being-filtered-as-expected"
            >
              <span>nested-array filtering guidance</span>
            </CustomLink>
            explains that predicates can match different elements and recommends
            combining fields or remodeling records.
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
          to="/typesense-vs-elasticsearch/"
        >
          <span>Typesense vs Elasticsearch</span>
        </CustomLink>
        or
        <!-- prettier-ignore -->
        <CustomLink class="text-primary underline underline-offset-4" to="/typesense-vs-meilisearch/"><span>Typesense vs Meilisearch</span></CustomLink
        ><span>.</span>
      </p>
    </section>

    <section class="cta-card">
      <div>
        <h2 class="normal-case">
          Put Typesense to the Test With Your Own Data
        </h2>
        <p>
          Launch a managed cluster or run the same open-source engine yourself.
          Your data and queries will make the trade-off clearer than a feature
          checklist.
        </p>
        <p class="mt-3">
          Switching from Algolia? Our
          <CustomLink
            class="text-white underline underline-offset-2"
            to="https://cloud.typesense.org/pricing/calculator#switching-from-algolia"
          >
            <span>free migration support</span>
          </CustomLink>
          can include an initial consultation and help benchmarking your
          workload. Depending on your current Algolia spend, it can also include
          prioritized support and migration consulting.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <a
          class="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-base font-semibold tracking-[-0.32px] text-white shadow-[-4px_4px_0px_0px] shadow-dark-bg max-md:px-4 max-md:py-2.5 max-sm:text-sm"
          href="https://cloud.typesense.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Typesense Cloud</span>
          <ArrowRight />
        </a>
        <a
          class="flex items-center gap-2 rounded-full bg-bg px-6 py-2 text-base font-semibold tracking-[-0.32px] text-text-primary shadow-[-4px_4px_0px_0px] shadow-dark-bg max-md:px-4 max-md:py-2.5 max-sm:text-sm"
          href="https://github.com/typesense/typesense"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View on GitHub</span>
          <ArrowRight />
        </a>
        <a
          class="flex items-center gap-2 rounded-full bg-bg px-6 py-2 text-base font-semibold tracking-[-0.32px] text-text-primary shadow-[-4px_4px_0px_0px] shadow-dark-bg max-md:px-4 max-md:py-2.5 max-sm:text-sm"
          href="https://cloud.typesense.org/pricing/calculator#switching-from-algolia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Algolia Migration Support</span>
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

const title = "Typesense vs Algolia: Self-Hosted or Managed Search";
const description =
  "Get Algolia's instant search-as-you-type experience with public resource pricing, no per-search fees, and the freedom to self-host.";
const pageUrl = "https://typesense.org/typesense-vs-algolia/";

const pricingScenarios = [
  {
    projectedRequests: 214354,
    volume: "214K searches per month",
    configuration: "2 GB RAM, burst 2 vCPU, single node",
    typesenseMonthly: "$51",
    typesenseAnnual: "$613",
    algoliaMonthly: "$102",
    algoliaAnnual: "$1,226",
    annualSavings: "$613",
    percentageSavings: "50.0%",
  },
  {
    projectedRequests: 848366,
    volume: "848K searches per month",
    configuration: "2 GB RAM, burst 2 vCPU, 3-node HA, 3-region SDN",
    typesenseMonthly: "$168",
    typesenseAnnual: "$2,015",
    algoliaMonthly: "$419",
    algoliaAnnual: "$5,030",
    annualSavings: "$3,015",
    percentageSavings: "59.9%",
  },
  {
    projectedRequests: 948034,
    volume: "948K searches per month",
    configuration: "8 GB RAM, burst 2 vCPU, single node",
    typesenseMonthly: "$139",
    typesenseAnnual: "$1,664",
    algoliaMonthly: "$469",
    algoliaAnnual: "$5,628",
    annualSavings: "$3,964",
    percentageSavings: "70.4%",
  },
  {
    projectedRequests: 4076743,
    volume: "4.1 million searches per month",
    configuration: "2 GB RAM, burst 2 vCPU, single node",
    typesenseMonthly: "$51",
    typesenseAnnual: "$613",
    algoliaMonthly: "$2,033",
    algoliaAnnual: "$24,400",
    annualSavings: "$23,787",
    percentageSavings: "97.5%",
  },
  {
    projectedRequests: 141676354,
    volume: "141.7 million searches per month",
    configuration: "16 GB RAM, 4 vCPU, 3-node HA",
    typesenseMonthly: "$1,073",
    typesenseAnnual: "$12,877",
    algoliaMonthly: "$70,833",
    algoliaAnnual: "$849,998",
    annualSavings: "$837,121",
    percentageSavings: "98.5%",
  },
];

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
        dateModified: "2026-07-29",
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
  @apply max-w-[900px] text-justify text-xl leading-[1.8] tracking-[-0.4px] text-text-muted max-md:text-[14px];
}
.table-wrapper {
  @apply w-full overflow-x-auto overflow-y-hidden rounded-3xl;
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
.pricing-heading {
  scroll-margin-top: 96px;
  @apply mb-3 mt-10 w-full normal-case;
}
.pricing-predictability {
  @apply mt-8 w-full text-left leading-[1.7] text-text-muted;
}
.pricing-predictability a {
  @apply text-primary underline underline-offset-2;
}
.pricing-note {
  @apply mb-6 w-full text-left leading-[1.7] text-text-muted;
}
.pricing-note + .pricing-note {
  @apply -mt-3;
}
.pricing-comparison-card {
  @apply min-w-0;
}
.pricing-comparison-table th,
.pricing-comparison-table td {
  @apply px-3;
}
.pricing-volume-col {
  width: 13%;
}
.pricing-configuration-col {
  width: 25%;
}
.pricing-typesense-col,
.pricing-algolia-col {
  width: 16%;
}
.pricing-annual-savings-col {
  width: 18%;
}
.pricing-savings-col {
  width: 12%;
}
.pricing-comparison-table tbody tr td:first-child {
  width: auto;
}
.workload-cards {
  @apply w-full space-y-4;
}
.workload-card {
  @apply rounded-2xl bg-bg-gray-2 p-5 text-left shadow-lg shadow-black/10;
}
.workload-card h4 {
  @apply mb-2 mt-1 text-2xl text-text-primary;
}
.workload-configuration {
  @apply leading-[1.6] text-text-muted;
}
.workload-card dl {
  @apply mt-5 space-y-3;
}
.workload-card dl > div {
  @apply rounded-xl bg-bg p-4;
}
.workload-card dt {
  @apply mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted;
}
.workload-card dd {
  @apply leading-[1.6] text-text-primary;
}
.workload-card .workload-savings {
  @apply bg-blue-in-green;
}
.workload-card .workload-savings dt,
.workload-card .workload-savings dd {
  @apply text-text-inverted;
}
.workload-savings span {
  @apply ml-2 inline-block rounded-full bg-secondary-bg px-2 py-0.5 text-sm font-semibold text-text-primary;
}
.pricing-disclaimer {
  @apply mt-4 w-full text-left text-sm leading-[1.7] text-text-muted;
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
.proof-copy {
  @apply mb-6 max-w-[780px] text-left leading-[1.7] text-text-muted;
}
.testimonial-layout {
  @apply grid w-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 max-lg:grid-cols-1;
}
.testimonial-intro {
  @apply flex flex-col items-start;
}
.testimonial-intro h2 {
  @apply text-left;
}
.testimonial-intro .proof-copy {
  @apply mb-0 max-w-none;
}
.testimonial-stories {
  @apply mt-5;
}
.testimonial-stack {
  @apply flex flex-col gap-4;
}
.testimonial-card {
  @apply flex flex-col justify-between gap-5 rounded-2xl bg-bg-gray-2 p-6 shadow-lg shadow-black/10 max-md:p-5;
}
.testimonial-card-lime {
  @apply bg-secondary-bg;
}
.testimonial-card blockquote {
  @apply text-xl leading-[1.6] text-text-primary;
}
.testimonial-card figcaption {
  @apply leading-[1.6] text-text-muted;
}
.content-card blockquote {
  @apply text-xl leading-[1.6] text-text-primary;
}
.content-card figcaption {
  @apply mt-4 leading-[1.6] text-text-muted;
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
.fit-card-algolia {
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
.fit-card a {
  @apply text-primary underline underline-offset-2;
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
</style>
