<template>
  <div>
    <header>
      <Navbar color-scheme="dark" />
    </header>
    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <h1 class="display-4">
              Compare Typesense<br />
              vs Algolia<br />
              vs ElasticSearch<br />
              vs Meilisearch
            </h1>
            <p>
              This table is meant to give you an objective side-by-side
              comparison of key features in each search engine and is based on
              each search engine's documentation.
            </p>
            <p class="mt-2">
              We've strived to provide accurate information below, but if you
              notice any issues, please open an issue
              <a
                href="https://github.com/typesense/typesense-website/issues"
                target="_blank"
                >here</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-3">
        <div class="col-md-12">
          <h3 class="mb-3">Overview</h3>
          <div class="table-responsive">
            <table
              class="table table-condensed feature-list"
              data-sticky-header="true"
            >
              <thead class="thead-dark">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Typesense</th>
                  <th scope="col">Algolia</th>
                  <th scope="col">ElasticSearch</th>
                  <th scope="col">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Source Code</td>
                  <td>Fully open source</td>
                  <td>Proprietary closed source</td>
                  <td>Source-available, licensed under SSPL</td>
                  <td>
                    Currently open source, with plans for closed-source
                    extensions in the future
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">First Commit</td>
                  <td>2015</td>
                  <td>2012</td>
                  <td>2010</td>
                  <td>2018</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Built Using</td>
                  <td>C++</td>
                  <td>C++</td>
                  <td>Java</td>
                  <td>Rust</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Core Search Algorithm</td>
                  <td>Built from the ground-up</td>
                  <td>Built from the ground-up</td>
                  <td>Built on top of Lucene</td>
                  <td>Built from the ground-up</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Best Suited For</td>
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
                    Instant Search-as-you-type Experiences for up to a few
                    hundred thousand records, that don't require a
                    production-grade highly-available setup.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Primary Index Location</td>
                  <td>RAM</td>
                  <td>RAM</td>
                  <td>Disk, with RAM cache</td>
                  <td>RAM</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="mt-5 mb-3">Deployment Options</h3>
          <div class="table-responsive">
            <table class="table table-condensed feature-list">
              <thead class="thead-dark">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Typesense</th>
                  <th scope="col">Algolia</th>
                  <th scope="col">ElasticSearch</th>
                  <th scope="col">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Self-Hosted Option</td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>✅️</td>
                  <td>✅️</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">SaaS Option</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">High Availability</td>
                  <td>✅<br /><br />RAFT-based multi-node clustering</td>
                  <td>✅<br /><br />RAFT-based multi-node clustering</td>
                  <td>✅<br /><br />Active-passive replication</td>
                  <td class="text-danger">
                    ❌<br /><br />Only supports a single-node setup, which
                    creates a potential single point of failure and so is not
                    production-ready.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    CDN-like Geo-Distributed clusters
                  </td>
                  <td>
                    ✅<br /><br />Supported in self-hosted and SaaS options,
                    called Search Delivery Network
                  </td>
                  <td>
                    ✅<br /><br />Available in Premium tier, called Distributed
                    Search Network
                  </td>
                  <td>
                    ❌<br /><br />Not available as part of hosted offering
                  </td>
                  <td>❌</td>
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
                    Requires use of nginx, apache or the like as a reverse proxy
                    in front, before exposing to frontend
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Index Backward Compatibility</td>
                  <td>
                    ✅<br /><br />
                    Fully backward compatible
                  </td>
                  <td>
                    ✅<br /><br />
                    Fully backward compatible
                  </td>
                  <td>
                    ✅<br /><br />
                    Fully backward compatible
                  </td>
                  <td>
                    ❌<br /><br />
                    Not backward compatible across versions. Version upgrades
                    require re-indexing.
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Upgrade Path</td>
                  <td>Replace binary, restart process</td>
                  <td>Managed SaaS service, doesn't require upgrades</td>
                  <td>Replace binary, restart process</td>
                  <td>Replace binary, re-index all documents</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="mt-5 mb-3">Features</h3>
          <div class="table-responsive">
            <table class="table table-condensed feature-list">
              <thead class="thead-dark">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Typesense</th>
                  <th scope="col">Algolia</th>
                  <th scope="col">ElasticSearch</th>
                  <th scope="col">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">REST API</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Typo Tolerance</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>
                    ✅️<br /><br />But slow and
                    <a
                      href="https://www.algolia.com/blog/engineering/algolia-v-elasticsearch-relevance/"
                      target="_blank"
                      >affects relevance</a
                    >
                  </td>
                  <td>✅️</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Query Field Weights &<br />Boosting
                  </td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Scoped API Keys &<br />Multi-tenant indices
                  </td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Federated Multi-Index Search</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Grouping / Distinct</td>
                  <td>✅️</td>
                  <td>
                    ✅<br /><br />
                    Upto one distinct field
                  </td>
                  <td>✅️</td>
                  <td>
                    ✅<br /><br />
                    Upto one distinct field
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Dynamic Sorting</td>
                  <td>
                    ✅<br /><br />Sort fields can be defined at query time using
                    a single index
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
                    ✅<br /><br />Sort fields can be defined at query time using
                    a single index
                  </td>
                  <td>
                    ❌<br /><br />Duplicate indices need to be created for each
                    sort order
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Faceting & Filtering</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>
                    🔶<br /><br />
                    Only string-type facets
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Facet Value Searches</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Result Pinning / Merchandising
                  </td>
                  <td>✅️</td>
                  <td>
                    ✅<br /><br />Upto 10 results in Free Tier, Upto 10,000
                    results in Premium Tier
                  </td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Synonyms</td>
                  <td>✅️</td>
                  <td>✅️<br /><br />Upto 10,000 per index</td>
                  <td>✅️</td>
                  <td>✅️</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Dynamic Synonym Suggestions</td>
                  <td>❌️</td>
                  <td>✅️<br /><br />Available in Premium Tier</td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Language support</td>
                  <td>
                    All languages, expect
                    <a
                      href="https://github.com/typesense/typesense/issues/228"
                      target="_blank"
                      >logographic ones</a
                    >
                  </td>
                  <td>All languages</td>
                  <td>All languages</td>
                  <td>Latin-based languages, English, and kanji languages</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Stop words</td>
                  <td>❌</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Geo Search</td>
                  <td>✅</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Automatic Record ID generation
                  </td>
                  <td>✅</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌<br /><br />IDs needs to be pre-generated</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Sort by String field</td>
                  <td>❌</td>
                  <td>
                    ✅<br /><br />But
                    <a
                      href="https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/how-to/sort-an-index-alphabetically/"
                      target="_blank"
                      >not recommended</a
                    >
                  </td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Search Analytics</td>
                  <td>Client-side, through InstantSearch.js</td>
                  <td>Client-side and Server-side</td>
                  <td>❌</td>
                  <td>Client-side, through InstantSearch.js</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Record Validations</td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>
                    ✅<br /><br />
                    with coerced mapping
                  </td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Custom Ranking Rules</td>
                  <td>
                    ✅<br /><br />
                    Upto 3 fields
                  </td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Negative Keyword Search <br />(<code>-query</code>)
                  </td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    Exact Keyword Search <br />(<code>"query"</code>)
                  </td>
                  <td>❌</td>
                  <td>✅️</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    User-level Search Personalization
                  </td>
                  <td>❌</td>
                  <td>
                    ✅<br /><br />
                    Premium Tier
                  </td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Collection Aliases</td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>✅️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">A/B Testing Results</td>
                  <td>❌</td>
                  <td>
                    ✅<br /><br />
                    Premium Tier
                  </td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Query Suggestions</td>
                  <td>❌</td>
                  <td>✅️</td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Visual Dashboard</td>
                  <td>✅<br /><br />In Typesense Cloud</td>
                  <td>✅️</td>
                  <td>🔶️<br /><br />3rd party plugins</td>
                  <td>✅️<br /><br />Search only</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Site Crawler</td>
                  <td>❌</td>
                  <td>✅<br /><br />Premium Tier</td>
                  <td>❌</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Search UI Component Library</td>
                  <td>✅<br /><br />Supports InstantSearch.js</td>
                  <td>✅<br /><br />InstantSearch.js</td>
                  <td>✅<br /><br />Search UI, requires hosted search</td>
                  <td>✅<br /><br />Supports InstantSearch.js</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Privacy Friendliness</td>
                  <td>
                    ✅<br /><br />Does NOT collect usage analytics, personal
                    data, or IP addresses in both Self-Hosted and SaaS options.
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
                    🔶<br /><br />Collects personal data, hardware information,
                    number of documents per index, number of document updates &
                    server uptime.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="mt-5 mb-3">Limits</h3>
          <div class="table-responsive">
            <table class="table table-condensed feature-list">
              <thead class="thead-dark">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Typesense</th>
                  <th scope="col">Algolia</th>
                  <th scope="col">ElasticSearch</th>
                  <th scope="col">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Maximum Indices</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>200</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Index Size</td>
                  <td>No limitations, only constrained by available RAM</td>
                  <td>128 GB</td>
                  <td>No limitation</td>
                  <td>100GB default, can be modified</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Words per field</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>No limitation</td>
                  <td>1000</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Maximum Record Size</td>
                  <td>No limitation</td>
                  <td>10KB</td>
                  <td>No limitation</td>
                  <td>Not published</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="mt-5 mb-3">Support</h3>
          <div class="table-responsive">
            <table class="table table-condensed feature-list">
              <thead class="thead-dark">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Typesense</th>
                  <th scope="col">Algolia</th>
                  <th scope="col">ElasticSearch</th>
                  <th scope="col">Meilisearch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="font-weight-bold">Channels</td>
                  <td>
                    Github issues<br />
                    Email<br />
                    Community<br />
                    Phone<br />
                    Slack<br />
                    Paid Prioritized Support
                  </td>
                  <td>
                    Github issues<br />
                    Email<br />
                    Community<br />
                    Phone<br />
                    Paid Prioritized Support
                  </td>
                  <td>
                    Github issues<br />
                    Email<br />
                    Community<br />
                    Paid Prioritized Support
                  </td>
                  <td>
                    Github issues<br />
                    Email<br />
                    Community
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Expert Onboarding & Training</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Typesense vs Algolia vs Elasticsearch vs Meilisearch Comparison',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'A side-by-side, feature-by-feature comparison of search engine alternatives available today.',
        },
      ],
    }
  },
}
</script>

<style scoped>
.jumbotron {
  background-color: unset;
  margin-bottom: 0;
  padding-bottom: 1rem;
}

td {
  width: 20%;
}
</style>
