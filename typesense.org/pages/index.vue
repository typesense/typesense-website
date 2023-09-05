<template>
  <div>
    <HomeSectionHero />

    <div class="text-center mt-xl-4">
      <h2 class="text-center text-gradient-1">
        The Open Source Alternative to Algolia + Pinecone <br />
        The Easier To Use Alternative to Elasticsearch
      </h2>
      <div style="line-height: 2">
        <NuxtLink to="/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/"
          >Algolia vs Elasticsearch vs Typesense vs Meilisearch</NuxtLink
        >
        <span class="mx-2 d-none d-sm-inline">•</span
        ><br class="d-block d-sm-none" />
        <NuxtLink to="/about/">Our Mission</NuxtLink>
      </div>
      <div class="container-fluid">
        <div class="row mt-5 d-flex justify-content-md-center">
          <div class="col-md-5 p-0">
            <div class="lead">Search meets {{ currentYear }}.</div>
            <p class="mt-5">
              Typesense is a modern, privacy-friendly, open source search engine
              built from the ground up using cutting-edge search algorithms,
              that take advantage of the latest advances in <br />Hardware
              Capabilities & Machine Learning.
            </p>

            <div class="row mt-3 d-flex justify-content-center">
              <div class="col-sm-4 text-left">
                <ul>
                  <li>Search-as-you-type</li>
                  <li>Autocomplete</li>
                  <li>Faceted Navigation</li>
                  <li>Geo-Search</li>
                </ul>
              </div>
              <div class="col-sm-4 text-left">
                <ul>
                  <li>Semantic Search</li>
                  <li>Similarity Search</li>
                  <li>Recommendations</li>
                  <li>LLM Augmentation</li>
                </ul>
              </div>
            </div>

            <div class="row d-flex justify-content-center mx-2 mx-sm-0">
              <div class="col-sm-10 text-left text-sm-center">
                Read more about
                <a
                  href="https://typesense.org/docs/overview/use-cases.html"
                  target="_blank"
                  >Typesense's use-cases here.</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">&nbsp;</div>

    <HomeSectionUsersAndMentions />

    <div class="mt-5">&nbsp;</div>

    <HomeSectionFeatureList />

    <div class="my-5">&nbsp;</div>

    <HomeSectionDeveloperExperience />

    <div class="mt-3">&nbsp;</div>

    <HomeSectionAPILibraries class="mt-5" />

    <div class="mt-1">&nbsp;</div>

    <HomeSectionShowcase class="mt-5" />

    <div class="mt-3">&nbsp;</div>

    <HomeSectionSupport class="mt-5" />

    <div class="mt-5">&nbsp;</div>
    <div class="my-5 text-center">
      <HomeCTAs />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and each of use.',
        },
      ],
    }
  },
}
</script>
