<template>
  <footer class="footer navbar fixed-bottom footer-lg py-5">
    <div class="container d-block align-items-start">
      <div class="row">
        <div class="col-sm-5 py-2">
          <div class="text-serif font-weight-light">
            <h4 class="mb-0 text-serif-2">
              <NuxtLink to="/" class="font-weight-bold">Typesense</NuxtLink>
            </h4>
          </div>
          <div class="font-weight-light">
            Fast, open source, typo-tolerant search engine
          </div>
          <div class="mt-5 font-weight-light">
            <address>
              <strong>Typesense, Inc.</strong> <br />
              Houston, TX<br />
              <a href="https://twitter.com/typesense" target="_blank"
                >@typesense</a
              >
              |
              <a href="mailto:contact@typesense.org" target="_blank"
                >contact@typesense.org</a
              >
            </address>
          </div>
          <div class="font-weight-light small">
            Typesense® is a registered trademark of Typesense, Inc.
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
                href="https://typesense.link/slack-community"
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
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
    text-decoration-color: darken($primary, 5%);
  }
}
</style>
