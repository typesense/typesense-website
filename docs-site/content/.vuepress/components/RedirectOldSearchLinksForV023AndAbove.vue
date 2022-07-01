<template>
  <div></div>
</template>

<script>
// As of v0.23.0, we split search, geosearch and multisearch into their own dedicated pages
// We want to redirect old links pointing to the documents.html page to their own dedicated pages.

export default {
  mounted() {
    const redirects = [
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#search`,
        to: `/${this.$page.typesenseVersion}/api/search.html#search`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#search-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#search-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#query-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#query-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#faceting-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#faceting-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#pagination-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#pagination-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#grouping-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#grouping-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#results-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#results-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#caching-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#caching-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#typo-tolerance-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#typo-tolerance-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#ranking-parameters`,
        to: `/${this.$page.typesenseVersion}/api/search.html#ranking-parameters`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#filter-results`,
        to: `/${this.$page.typesenseVersion}/api/search.html#filter-results`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#facet-results`,
        to: `/${this.$page.typesenseVersion}/api/search.html#facet-results`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#sort-results`,
        to: `/${this.$page.typesenseVersion}/api/search.html#sort-results`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#sorting-on-strings`,
        to: `/${this.$page.typesenseVersion}/api/search.html#sorting-on-strings`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#sorting-null-empty-or-missing-values`,
        to: `/${this.$page.typesenseVersion}/api/search.html#sorting-null-empty-or-missing-values`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#group-results`,
        to: `/${this.$page.typesenseVersion}/api/search.html#group-results`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#pagination`,
        to: `/${this.$page.typesenseVersion}/api/search.html#pagination`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#ranking`,
        to: `/${this.$page.typesenseVersion}/api/search.html#ranking`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#geosearch`,
        to: `/${this.$page.typesenseVersion}/api/geosearch.html#geosearch`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#searching-within-a-radius`,
        to: `/${this.$page.typesenseVersion}/api/geosearch.html#searching-within-a-radius`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#searching-within-a-geo-polygon`,
        to: `/${this.$page.typesenseVersion}/api/geosearch.html#searching-within-a-geo-polygon`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#sorting-by-additional-attributes-within-a-radius`,
        to: `/${this.$page.typesenseVersion}/api/geosearch.html#sorting-by-additional-attributes-within-a-radius`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#exclude-radius`,
        to: `/${this.$page.typesenseVersion}/api/geosearch.html#exclude-radius`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#precision`,
        to: `/${this.$page.typesenseVersion}/api/geosearch.html#precision`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#federated-multi-search`,
        to: `/${this.$page.typesenseVersion}/api/federated-multi-search.html#federated-multi-search`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/documents.html#multi-search-parameters`,
        to: `/${this.$page.typesenseVersion}/api/federated-multi-search.html#multi-search-parameters`,
      },
    ]

    const currentPathWithHash = `${this.$router.currentRoute.path}${this.$router.currentRoute.hash}`
    redirects.some(redirect => {
      if (currentPathWithHash.startsWith(redirect.from)) {
        const [path, anchor] = redirect.to.split('#')
        this.$router.push(path)
        if (anchor) {
          setTimeout(() => {
            this.$router.replace(redirect.to)
          }, 1200)
        }
        return true
      }
    })
  },
}
</script>
