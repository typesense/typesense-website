<template>
  <div>
    <HomeSectionHero />

    <HomeSectionFeatureList />

    <div class="mt-4">&nbsp;</div>

    <div class="text-center mt-5">
      <h2 class="text-center text-gradient-1">
        The Open Source Algolia Alternative <br />
        The Easier To Use ElasticSearch Alternative
      </h2>
      <div style="line-height: 2">
        <NuxtLink to="/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/"
          >Algolia vs ElasticSearch vs Typesense vs Meilisearch</NuxtLink
        >
        <span class="mx-2 d-none d-sm-inline">•</span
        ><br class="d-block d-sm-none" />
        <NuxtLink to="/about/">Our Mission</NuxtLink>
      </div>
      <div class="container-fluid">
        <div class="row mt-5 d-flex justify-content-md-center">
          <div class="col-md-4 p-0">
            <p>Search meets {{ currentYear }}.</p>
            <p>
              Typesense is a modern, privacy-friendly, open source search engine
              built from the ground up using cutting-edge search algorithms,
              that take advantage of the latest advances in hardware
              capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">&nbsp;</div>

    <HomeBadges />

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
