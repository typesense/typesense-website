<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'

// v0.23.0 split search/geosearch/multisearch out of documents.html
const { page } = useData()
const router = useRouter()

onMounted(() => {
  const v = (page.value as any).typesenseVersion

  const redirects: Array<{ from: string; to: string }> = [
    { from: `/${v}/api/documents.html#search-parameters`, to: `/${v}/api/search.html#search-parameters` },
    { from: `/${v}/api/documents.html#search`, to: `/${v}/api/search.html#search` },
    { from: `/${v}/api/documents.html#query-parameters`, to: `/${v}/api/search.html#query-parameters` },
    { from: `/${v}/api/documents.html#faceting-parameters`, to: `/${v}/api/search.html#faceting-parameters` },
    { from: `/${v}/api/documents.html#pagination-parameters`, to: `/${v}/api/search.html#pagination-parameters` },
    { from: `/${v}/api/documents.html#grouping-parameters`, to: `/${v}/api/search.html#grouping-parameters` },
    { from: `/${v}/api/documents.html#results-parameters`, to: `/${v}/api/search.html#results-parameters` },
    { from: `/${v}/api/documents.html#caching-parameters`, to: `/${v}/api/search.html#caching-parameters` },
    { from: `/${v}/api/documents.html#typo-tolerance-parameters`, to: `/${v}/api/search.html#typo-tolerance-parameters` },
    { from: `/${v}/api/documents.html#ranking-parameters`, to: `/${v}/api/search.html#ranking-parameters` },
    { from: `/${v}/api/documents.html#filter-results`, to: `/${v}/api/search.html#filter-results` },
    { from: `/${v}/api/documents.html#facet-results`, to: `/${v}/api/search.html#facet-results` },
    { from: `/${v}/api/documents.html#sort-results`, to: `/${v}/api/search.html#sort-results` },
    { from: `/${v}/api/documents.html#sorting-on-strings`, to: `/${v}/api/search.html#sorting-on-strings` },
    { from: `/${v}/api/documents.html#sorting-null-empty-or-missing-values`, to: `/${v}/api/search.html#sorting-null-empty-or-missing-values` },
    { from: `/${v}/api/documents.html#group-results`, to: `/${v}/api/search.html#group-results` },
    { from: `/${v}/api/documents.html#pagination`, to: `/${v}/api/search.html#pagination` },
    { from: `/${v}/api/documents.html#ranking`, to: `/${v}/api/search.html#ranking` },
    { from: `/${v}/api/documents.html#geosearch`, to: `/${v}/api/geosearch.html#geosearch` },
    { from: `/${v}/api/documents.html#searching-within-a-radius`, to: `/${v}/api/geosearch.html#searching-within-a-radius` },
    { from: `/${v}/api/documents.html#searching-within-a-geo-polygon`, to: `/${v}/api/geosearch.html#searching-within-a-geo-polygon` },
    { from: `/${v}/api/documents.html#sorting-by-additional-attributes-within-a-radius`, to: `/${v}/api/geosearch.html#sorting-by-additional-attributes-within-a-radius` },
    { from: `/${v}/api/documents.html#exclude-radius`, to: `/${v}/api/geosearch.html#exclude-radius` },
    { from: `/${v}/api/documents.html#precision`, to: `/${v}/api/geosearch.html#precision` },
    { from: `/${v}/api/documents.html#federated-multi-search`, to: `/${v}/api/federated-multi-search.html#federated-multi-search` },
    { from: `/${v}/api/documents.html#multi-search-parameters`, to: `/${v}/api/federated-multi-search.html#multi-search-parameters` },
  ]

  const path = router.route.path.replace(/^\/docs/, '') || '/'
  const currentPathWithHash = `${path}${window.location.hash}`

  redirects.some((redirect) => {
    if (!currentPathWithHash.startsWith(redirect.from)) return false
    const [toPath] = redirect.to.split('#')
    router.go(withBase(toPath))
    if (redirect.to.includes('#')) {
      setTimeout(() => router.go(withBase(redirect.to)), 1200)
    }
    return true
  })
})
</script>
