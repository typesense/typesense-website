<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'

// mounted on legacy landing pages to forward old hash anchors to new pages
const { page, theme } = useData()
const router = useRouter()

onMounted(() => {
  const v = (page.value as any).typesenseVersion
  const L = (theme.value as any).typesenseLatestVersion

  const redirects: Array<{ from: string; to: string }> = [
    { from: `/guide/#install-typesense`, to: `/guide/install-typesense.html` },
    { from: `/guide/#start-typesense`, to: `/guide/install-typesense.html#🎬-start` },
    { from: `/guide/#configure-typesense`, to: `/${L}/api/server-configuration.html` },
    { from: `/guide/configure-typesense.html`, to: `/${L}/api/server-configuration.html` },
    { from: `/guide/#update-typesense`, to: `/guide/updating-typesense.html` },
    { from: `/guide/#install-client`, to: `/guide/installing-a-client.html` },
    { from: `/guide/#example-application`, to: `/guide/building-a-search-application.html` },
    { from: `/guide/#init-client`, to: `/guide/building-a-search-application.html#initializing-the-client` },
    { from: `/guide/#create-collection`, to: `/guide/building-a-search-application.html#creating-a-books-collection` },
    { from: `/guide/#index-documents`, to: `/guide/building-a-search-application.html#adding-books-to-the-collection` },
    { from: `/guide/#search-collection`, to: `/guide/building-a-search-application.html#searching-for-books` },
    { from: `/guide/#search-ui`, to: `/guide/search-ui-components.html` },
    { from: `/guide/#typesense-instantsearch-demo`, to: `/guide/search-ui-components.html#demo-app` },
    { from: `/guide/#ranking-relevance`, to: `/guide/ranking-and-relevance.html` },
    { from: `/guide/search-delivery-network.html`, to: `/guide/typesense-cloud/search-delivery-network.html` },
    { from: `/guide/#high-availability`, to: `/guide/high-availability.html` },
    { from: `/${v}/api/#api-clients`, to: `/${v}/api/` },
    { from: `/${v}/api/#authentication`, to: `/${v}/api/api-clients.html` },
    { from: `/${v}/api/#create-collection`, to: `/${v}/api/collections.html#create-a-collection` },
    { from: `/${v}/api/#index-document`, to: `/${v}/api/documents.html#index-a-document` },
    { from: `/${v}/api/#search-collection`, to: `/${v}/api/documents.html#search` },
    { from: `/${v}/api/#multi-search`, to: `/${v}/api/documents.html#federated-multi-search` },
    { from: `/${v}/api/#retrieve-document`, to: `/${v}/api/documents.html#retrieve-a-document` },
    { from: `/${v}/api/#update-document`, to: `/${v}/api/documents.html#update-a-document` },
    { from: `/${v}/api/#delete-document`, to: `/${v}/api/documents.html#delete-documents` },
    { from: `/${v}/api/#retrieve-collection`, to: `/${v}/api/collections.html#retrieve-a-collection` },
    { from: `/${v}/api/#export-documents`, to: `/${v}/api/documents.html#export-documents` },
    { from: `/${v}/api/#import-documents`, to: `/${v}/api/documents.html#import-documents` },
    { from: `/${v}/api/#list-collection`, to: `/${v}/api/collections.html#list-all-collections` },
    { from: `/${v}/api/#drop-collection`, to: `/${v}/api/collections.html#drop-a-collection` },
    { from: `/${v}/api/#api-keys`, to: `/${v}/api/api-keys.html` },
    { from: `/${v}/api/#create-key`, to: `/${v}/api/api-keys.html#create-an-api-key` },
    { from: `/${v}/api/#retrieve-key`, to: `/${v}/api/api-keys.html#retrieve-an-api-key` },
    { from: `/${v}/api/#list-keys`, to: `/${v}/api/api-keys.html#list-all-keys` },
    { from: `/${v}/api/#delete-key`, to: `/${v}/api/api-keys.html#list-all-keys` },
    { from: `/${v}/api/#generate-scoped-search-key`, to: `/${v}/api/api-keys.html#generate-scoped-search-key` },
    { from: `/${v}/api/#curation`, to: `/${v}/api/curation.html` },
    { from: `/${v}/api/#list-overrides`, to: `/${v}/api/curation.html#list-all-overrides` },
    { from: `/${v}/api/#delete-override`, to: `/${v}/api/curation.html#delete-an-override` },
    { from: `/${v}/api/#aliases`, to: `/${v}/api/collection-alias.html` },
    { from: `/${v}/api/#retrieve-alias`, to: `/${v}/api/collection-alias.html#retrieve-an-alias` },
    { from: `/${v}/api/#list-aliases`, to: `/${v}/api/collection-alias.html#list-all-aliases` },
    { from: `/${v}/api/#delete-alias`, to: `/${v}/api/collection-alias.html#delete-an-alias` },
    { from: `/${v}/api/#synonyms`, to: `/${v}/api/synonyms.html` },
    { from: `/${v}/api/#create-update-multi-synonym`, to: `/${v}/api/synonyms.html#create-or-update-a-multi-way-synonym` },
    { from: `/${v}/api/#retrieve-synonym`, to: `/${v}/api/synonyms.html#retrieve-a-synonym` },
    { from: `/${v}/api/#list-synonyms`, to: `/${v}/api/synonyms.html#list-all-synonyms` },
    { from: `/${v}/api/#delete-synonym`, to: `/${v}/api/synonyms.html#delete-a-synonym` },
    { from: `/${v}/api/#cluster-operations`, to: `/${v}/api/cluster-operations.html` },
    { from: `/${v}/api/#cluster-operations-snapshot`, to: `/${v}/api/cluster-operations.html#create-snapshot-for-backups` },
    { from: `/${v}/api/#cluster-operations-vote`, to: `/${v}/api/cluster-operations.html#re-elect-leader` },
    { from: `/${v}/api/#config-slow-request-log`, to: `/${v}/api/cluster-operations.html#toggle-slow-request-log` },
    { from: `/${v}/api/#whats-new`, to: `/${v}/#what-s-new` },
    { from: `/${v}/api/#errors`, to: `/${v}/api/api-errors.html` },
  ]

  const base = '/docs'
  const path = router.route.path.replace(new RegExp(`^${base}`), '') || '/'
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
