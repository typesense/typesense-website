<template>
  <div>
    <AisInstantSearch :search-client="searchClient" :index-name="INDEX_NAME">
      <AisConfigure :hits-per-page.camel="hitsPerPage" :query="initialQuery" />
      <AisSearchBox
        :class-names="{
          'ais-SearchBox-input': 'form-control',
          'ais-SearchBox-submit': 'd-none',
          'ais-SearchBox-reset': 'd-none',
        }"
      />
      <AisStats class="text-right">
        <span slot-scope="{ nbHits, processingTimeMS }" class="small">
          ✨ Found {{ nbHits.toLocaleString() }} hits out of
          {{ starQueryResults['out_of'].toLocaleString() }} recipes in
          {{ processingTimeMS }} ms
        </span>
      </AisStats>
      <div class="row justify-content-end">
        <div class="col-md-10">
          <AisHits
            :class-names="{
              'ais-Hits-list': 'p-0',
              'ais-Hits-item': 'small p-2 border-bottom border-primary d-block',
            }"
          >
            <div slot="item" slot-scope="{ item }">
              <a :href="item.link" target="_blank">
                <div class="d-flex justify-content-between">
                  <div
                    class="text-truncate d-inline-block"
                    style="max-width: 250px"
                  >
                    {{ item.title }}
                  </div>
                  <div class="d-inline-block">
                    <img
                      src="~/assets/images/np_open_2472908_FFD000.svg"
                      height="12"
                    />
                  </div>
                </div>
              </a>
            </div>
          </AisHits>
        </div>
      </div>
      <div class="row justify-content-end">
        <div class="col-md-10">
          <AisPagination
            :class-names="{
              'ais-Pagination-list': 'd-flex flex-row',
              'ais-Pagination-item': 'mx-2 d-block',
            }"
          />
        </div>
      </div>
    </AisInstantSearch>
  </div>
</template>

<script>
import {
  AisInstantSearch,
  AisHits,
  AisSearchBox,
  AisStats,
  AisPagination,
  AisConfigure,
} from 'vue-instantsearch'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import { SearchClient as TypesenseSearchClient } from 'typesense' // To get the total number of docs

const INDEX_NAME = 'r'

function typesenseServerConfig($config) {
  return {
    apiKey: $config.typesenseSearchOnlyAPIKey,
    nodes: $config.typesenseHosts.map((h) => {
      return {
        host: h,
        port: $config.typesensePort,
        protocol: $config.typesenseProtocol,
      }
    }),
  }
}

export default {
  components: {
    AisInstantSearch,
    AisHits,
    AisSearchBox,
    AisStats,
    AisPagination,
    AisConfigure,
  },
  data({ $config }) {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
      server: typesenseServerConfig($config),
      additionalSearchParameters: {
        queryBy: 'title',
      },
    })

    return {
      searchClient: typesenseInstantsearchAdapter.searchClient,
      INDEX_NAME,
      initialQuery: 'cake',
      hitsPerPage: 5,
      starQueryResults: {},
    }
  },
  async fetch() {
    const typesenseSearchClient = new TypesenseSearchClient(
      typesenseServerConfig(this.$nuxt.$config)
    )
    this.starQueryResults = await typesenseSearchClient
      .collections(INDEX_NAME)
      .documents()
      .search({ q: '*' })
  },
  fetchOnServer: false,
}
</script>
