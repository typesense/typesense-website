<template>
  <footer class="footer navbar fixed-bottom footer-lg py-5">
    <div class="container d-block align-items-start">
      <div class="row">
        <div class="col-sm-5 py-2">
          <div class="text-serif font-weight-light">
            <h3 class="mb-0 text-serif-2">
              <NuxtLink to="/" class="font-weight-bold">Typesense</NuxtLink>
            </h3>
          </div>
          <div class="font-weight-light">
            An open source, typo-tolerant search engine
          </div>
          <div class="mt-4 font-weight-light">
            <address>
              <strong>Typesense Inc.</strong> <br />
              Houston, TX<br /><br />
              <a href="https://twitter.com/typesense" target="_blank"
                >@typesense</a
              ><br />
              <a href="mailto:contact@typesense.org" target="_blank"
                >contact@typesense.org</a
              >
            </address>
          </div>
        </div>

        <div class="col-sm-2 mt-4 mt-md-0">
          <ul class="nav flex-column">
            <li class="nav-item">
              <NuxtLink class="nav-link p-0" to="/">Home</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link p-0" to="/about/">About</NuxtLink>
            </li>
            <li class="nav-item">
              <a class="nav-link p-0" href="/docs/">Documentation</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense"
                >GitHub Repo</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link p-0" href="https://cloud.typesense.org"
                >Typesense Cloud</a
              >
            </li>

            <li class="nav-item">
              <a class="nav-link p-0" href="https://typesense.org/blog/"
                >Blog</a
              >
            </li>
          </ul>
        </div>

        <div class="col-sm-2 mt-4 mt-md-0">
          <ul class="nav flex-column">
            <li class="nav-item"><strong>Libraries</strong></li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-js"
                >Javascript Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-php"
                >PHP Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-ruby"
                >Ruby Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-go"
                >Go Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-python"
                >Python Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-dart"
                >Dart Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/DAXGRID/typesense-dotnet"
                >.Net Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-java"
                >Java Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-swift"
                >Swift Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/runeanielsen/typesense-clj"
                >Clojure Client
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/laravel-scout-typesense-driver"
                >Laravel Scout Driver
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://wordpress.org/plugins/search-with-typesense/?ref=typesense"
                >Wordpress Plugin
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link p-0" href="https://tooljet.com/?ref=typesense"
                >Tooljet Extension
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/gatsby-plugin-typesense"
                >Gatsby Plugin
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-instantsearch-adapter"
                >Instantsearch.js adapter
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/typesense-docsearch.js"
                >Documentation Search
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/docusaurus-theme-search-typesense"
                >Docusaurus Search Theme
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/typesense/firestore-typesense-search"
                >Firebase Extension
              </a>
            </li>
          </ul>
        </div>

        <div class="col-sm-3 mt-4 mt-md-0">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="#"
                onclick="Beacon('navigate', '/ask/'); Beacon('open'); return false;"
                >Contact Us</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://github.com/sponsors/typesense"
                >Sponsor our Open Source Work</a
              >
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link p-0" to="/support/"
                >Prioritized Support</NuxtLink
              >
            </li>
            <li class="nav-item">
              <NuxtLink
                class="nav-link p-0"
                to="/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/"
                >Algolia vs Elasticsearch vs Typesense</NuxtLink
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://join.slack.com/t/typesense-community/shared_invite/zt-mx4nbsbn-AuOL89O7iBtvkz136egSJg"
                >Slack Community</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link p-0" href="https://threads.typesense.org/kb"
                >Community Threads</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
a {
  border-bottom: unset;
}
</style>
