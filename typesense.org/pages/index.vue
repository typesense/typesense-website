<template>
  <div>
    <HomeSectionHero />

    <div class="mt-xl-4">
      <div class="container-fluid">
        <h2 class="text-sm-center text-gradient-1 text-shadow-primary-2">
          The Open Source Alternative to Algolia + Pinecone
        </h2>
        <h2 class="text-sm-center text-gradient-1 text-shadow-primary-2">
          The Easier To Use Alternative to Elasticsearch
        </h2>
        <div class="text-sm-center mt-4">
          <NuxtLink to="/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/"
            >Algolia vs Elasticsearch vs Typesense vs Meilisearch</NuxtLink
          >
          <span class="mx-2 d-none d-sm-inline">•</span
          ><br class="d-block d-sm-none" />
          <NuxtLink to="/about/">Our Mission</NuxtLink>
        </div>
        <div class="mt-5">&nbsp;</div>
        <div class="row d-flex justify-content-md-center">
          <div class="col-sm-3">
            <div class="lead">Search meets {{ currentYear }}.</div>
            <p class="mt-3 lead">
              Typesense is a modern, privacy-friendly, open source search engine
              meticulously engineered for
              <em>performance & ease-of-use</em>.
            </p>
            <p class="mt-3 lead">
              It uses cutting-edge search algorithms that take advantage of the
              latest advances in Hardware Capabilities & Machine Learning.
            </p>
          </div>
          <div class="col-sm-5 p-0 mt-5 mt-sm-0">
            <div class="container">
              <div class="row d-flex justify-content-sm-end">
                <div class="col-sm-5">
                  <ul class="use-cases-list lead p-0 m-0">
                    <li>Search-as-you-type</li>
                    <li>Autocomplete</li>
                    <li>Faceted Navigation</li>
                    <li>Geo-Search</li>
                    <li>Fuzzy Search</li>
                  </ul>
                </div>
                <div class="col-sm-6">
                  <ul class="use-cases-list lead p-0 m-0">
                    <li>Semantic Search</li>
                    <li>Similarity Search</li>
                    <li>Recommendations</li>
                    <li>LLM Augmentation</li>
                    <li>Geo-Distributed Cache</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row d-flex justify-content-center mt-4 mx-sm-0">
          <div class="col-sm-auto">
            Read more about
            <a
              href="https://typesense.org/docs/overview/use-cases.html"
              target="_blank"
              >Typesense's use-cases</a
            >
          </div>
        </div>
      </div>
    </div>

    <div class="my-5">&nbsp;</div>

    <HomeBadges />

    <div class="mt-5">&nbsp;</div>

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
            'Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
ul.use-cases-list {
  li {
    list-style: none;
    margin-bottom: 25px;
    &::before {
      content: '';
      display: inline-block;
      background-image: url('~/assets/images/noun-accept-1727505-2eb67d.svg');
      padding-left: 28px;
      background-size: 20px 20px;
      background-repeat: no-repeat;
      height: 22px;
      width: 22px;
      vertical-align: middle;
    }
  }
}
</style>
