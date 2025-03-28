<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    const redirects = [
      {
        from: `/guide/#install-typesense`,
        to: `/guide/install-typesense.html`,
      },
      {
        from: `/guide/#start-typesense`,
        to: `/guide/install-typesense.html#🎬-start`,
      },
      {
        from: `/guide/#configure-typesense`,
        to: `/${this.$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`,
      },
      {
        from: `/guide/configure-typesense.html`,
        to: `/${this.$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`,
      },
      {
        from: `/guide/#update-typesense`,
        to: `/guide/updating-typesense.html`,
      },
      {
        from: `/guide/#install-client`,
        to: `/guide/installing-a-client.html`,
      },
      {
        from: `/guide/#example-application`,
        to: `/guide/building-a-search-application.html`,
      },
      {
        from: `/guide/#init-client`,
        to: `/guide/building-a-search-application.html#initializing-the-client`,
      },
      {
        from: `/guide/#create-collection`,
        to: `/guide/building-a-search-application.html#creating-a-books-collection`,
      },
      {
        from: `/guide/#index-documents`,
        to: `/guide/building-a-search-application.html#adding-books-to-the-collection`,
      },
      {
        from: `/guide/#search-collection`,
        to: `/guide/building-a-search-application.html#searching-for-books`,
      },
      {
        from: `/guide/#search-ui`,
        to: `/guide/search-ui-components.html`,
      },
      {
        from: `/guide/#typesense-instantsearch-demo`,
        to: `/guide/search-ui-components.html#demo-app`,
      },
      {
        from: `/guide/#ranking-relevance`,
        to: `/guide/ranking-and-relevance.html`,
      },
      {
        from: `/guide/search-delivery-network.html`,
        to: `/guide/typesense-cloud/search-delivery-network.html`,
      },
      {
        from: `/guide/#high-availability`,
        to: `/guide/high-availability.html`,
      },
      { from: `/${this.$page.typesenseVersion}/api/#api-clients`, to: `/${this.$page.typesenseVersion}/api/` },
      {
        from: `/${this.$page.typesenseVersion}/api/#authentication`,
        to: `/${this.$page.typesenseVersion}/api/api-clients.html`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#create-collection`,
        to: `/${this.$page.typesenseVersion}/api/collections.html#create-a-collection`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#index-document`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#index-a-document`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#search-collection`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#search`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#multi-search`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#federated-multi-search`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#retrieve-document`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#retrieve-a-document`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#update-document`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#update-a-document`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#delete-document`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#delete-documents`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#retrieve-collection`,
        to: `/${this.$page.typesenseVersion}/api/collections.html#retrieve-a-collection`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#export-documents`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#export-documents`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#import-documents`,
        to: `/${this.$page.typesenseVersion}/api/documents.html#import-documents`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#list-collection`,
        to: `/${this.$page.typesenseVersion}/api/collections.html#list-all-collections`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#drop-collection`,
        to: `/${this.$page.typesenseVersion}/api/collections.html#drop-a-collection`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#api-keys`,
        to: `/${this.$page.typesenseVersion}/api/api-keys.html`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#create-key`,
        to: `/${this.$page.typesenseVersion}/api/api-keys.html#create-an-api-key`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#retrieve-key`,
        to: `/${this.$page.typesenseVersion}/api/api-keys.html#retrieve-an-api-key`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#list-keys`,
        to: `/${this.$page.typesenseVersion}/api/api-keys.html#list-all-keys`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#delete-key`,
        to: `/${this.$page.typesenseVersion}/api/api-keys.html#list-all-keys`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#generate-scoped-search-key`,
        to: `/${this.$page.typesenseVersion}/api/api-keys.html#generate-scoped-search-key`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#curation`,
        to: `/${this.$page.typesenseVersion}/api/curation.html`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#list-overrides`,
        to: `/${this.$page.typesenseVersion}/api/curation.html#list-all-overrides`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#delete-override`,
        to: `/${this.$page.typesenseVersion}/api/curation.html#delete-an-override`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#aliases`,
        to: `/${this.$page.typesenseVersion}/api/collection-alias.html`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#retrieve-alias`,
        to: `/${this.$page.typesenseVersion}/api/collection-alias.html#retrieve-an-alias`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#list-aliases`,
        to: `/${this.$page.typesenseVersion}/api/collection-alias.html#list-all-aliases`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#delete-alias`,
        to: `/${this.$page.typesenseVersion}/api/collection-alias.html#delete-an-alias`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#synonyms`,
        to: `/${this.$page.typesenseVersion}/api/synonyms.html`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#create-update-multi-synonym`,
        to: `/${this.$page.typesenseVersion}/api/synonyms.html#create-or-update-a-multi-way-synonym`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#retrieve-synonym`,
        to: `/${this.$page.typesenseVersion}/api/synonyms.html#retrieve-a-synonym`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#list-synonyms`,
        to: `/${this.$page.typesenseVersion}/api/synonyms.html#list-all-synonyms`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#delete-synonym`,
        to: `/${this.$page.typesenseVersion}/api/synonyms.html#delete-a-synonym`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#cluster-operations`,
        to: `/${this.$page.typesenseVersion}/api/cluster-operations.html`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#cluster-operations-snapshot`,
        to: `/${this.$page.typesenseVersion}/api/cluster-operations.html#create-snapshot-for-backups`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#cluster-operations-vote`,
        to: `/${this.$page.typesenseVersion}/api/cluster-operations.html#re-elect-leader`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#config-slow-request-log`,
        to: `/${this.$page.typesenseVersion}/api/cluster-operations.html#toggle-slow-request-log`,
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#whats-new`,
        to: `/${this.$page.typesenseVersion}/#what-s-new`
      },
      {
        from: `/${this.$page.typesenseVersion}/api/#errors`,
        to: `/${this.$page.typesenseVersion}/api/api-errors.html`,
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
