<template>
  <div class="container mt-xxl-5">
    <h2 class="text-center text-gradient-1">
      Features you love, minus the complexity
    </h2>
    <div class="text-center">Neatly wrapped in an intuitive RESTful API</div>

    <div class="grid mt-5">
      <div v-for="feature in features" :key="feature.name">
        <HomeFeature v-bind="feature" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          name: 'Typo Tolerance',
          description:
            'Spellng Mistakes? Not a problem. Typesense automatically tries to correct typos.',
          icon: require('~/assets/images/typo_tolerance_icon.svg'),
        },
        {
          name: 'Tunable Ranking',
          description:
            'Tailor your results to perfection via flexible and fast query-time sorting.',
          icon: require('~/assets/images/tunable_ranking_icon.svg'),
        },
        {
          name: 'Result Pinning',
          description:
            'Pin specific records in a particular position to feature or merchandize them.',
          icon: require('~/assets/images/result_pinning_icon.svg'),
        },
        {
          name: 'Synonyms',
          description:
            'Show results for pants when users search for trousers, or vice-versa, when you define them as synonyms.',
          icon: require('~/assets/images/synonyms_icon.svg'),
        },
        {
          name: 'Multi-tenant API Keys',
          description:
            'Store multiple users’ data in a single index, create API keys for each user that restrict access to just their data.',
          icon: require('~/assets/images/api_keys_icon.svg'),
        },
        {
          name: 'Dynamic Sorting',
          description:
            'Sort records on the fly by any fields in your document. For eg: sort by price, sort by popularity, etc. No duplicate indices needed.',
          icon: require('~/assets/images/sorting_icon.svg'),
        },
        {
          name: 'Grouping & Distinct',
          description:
            'Provide more varietry in your results by grouping results. Eg: combine all color variations of a shirt into a single result.',
          icon: require('~/assets/images/grouping_icon.svg'),
        },
        {
          name: 'Filtering & Faceting',
          description:
            'Only fetch records that match a given filter. Aggregate field values and get counts, min, max and avg of values across records.',
          icon: require('~/assets/images/filter_icon.svg'),
        },
        {
          name: 'Geo Search',
          description:
            'Search & sort results within a certain distance from a latitude/longitude or within a polygon region.',
          icon: require('~/assets/images/geo_search_icon.svg'),
        },
        {
          name: 'Federated Search',
          description:
            'Search one or more collections in a single query. Eg: search for both products and brands, given a single search query.',
          icon: require('~/assets/images/federated_search_icon.svg'),
        },
        {
          name: 'Easy High Availability',
          description:
            'Build a resilient production-grade search service, with a few simple steps.',
          icon: require('~/assets/images/high_availability_icon.svg'),
        },
        {
          name: 'Easy Version Upgrades',
          description:
            'Replace the binary, and restart the process. Typesense will automatically re-index your data in the new version.',
          icon: require('~/assets/images/easy_version_upgrades_icon.svg'),
        },
      ],
    }
  },
}
</script>

<style scoped>
.grid {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-column-gap: 40px;
  grid-row-gap: 28px;
  justify-content: space-evenly;
  align-content: space-evenly;
}
</style>
