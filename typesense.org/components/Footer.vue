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
              3415 S Sepulveda Blvd<br />
              Suite 1100<br />
              Los Angeles, CA<br /><br />
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
                >Github Repo</a
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
            <NuxtLink
              class="nav-link p-0"
              to="/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/"
              >Algolia vs ElasticSearch vs Typesense</NuxtLink
            >
            <li class="nav-item">
              <a
                class="nav-link p-0"
                href="https://join.slack.com/t/typesense-community/shared_invite/zt-mx4nbsbn-AuOL89O7iBtvkz136egSJg"
                >Slack Community</a
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
