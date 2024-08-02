<template>
  <div>
    <AisInstantSearch
      :search-client="searchClient"
      :index-name="INDEX_NAME"
      :initial-ui-state="initialUiState"
    >
      <AisConfigure :hits-per-page.camel="hitsPerPage" />
      <div class="row no-gutters">
        <div class="col-sm-1">
          <img
            class="try-it-out-arrow"
            src="~assets/images/try_it_out.svg"
            height="70"
            width="95"
            alt="Try it out"
          />
        </div>
        <div class="col-sm-11">
          <Transition name="fade">
            <AisSearchBox
              placeholder="Search for a recipe..."
              :autofocus="true"
              :class-names="{
                'ais-SearchBox-input':
                  'form-control form-control-lg search-demo-search-input',
                'ais-SearchBox-submit': 'd-none',
                'ais-SearchBox-reset': 'd-none',
              }"
            />
          </Transition>
        </div>
      </div>

      <Transition name="fade">
        <AisStats class="text-right mb-4">
          <span
            slot-scope="{ nbHits, processingTimeMS }"
            class="small text-gray-200"
          >
            ✨ Found {{ nbHits.toLocaleString() }} recipes out of
            {{ starQueryResults['out_of'].toLocaleString() }} in
            {{ parseInt(processingTimeMS) === 0 ? 1 : processingTimeMS }} ms
          </span>
        </AisStats>
      </Transition>
      <div class="row justify-content-end mt-3">
        <div class="col-sm-3"></div>
        <div class="col-sm-9">
          <Transition name="fade">
            <AisHits
              :transform-items="transformSearchHits"
              :class-names="{
                'ais-Hits-list': 'p-0',
                'ais-Hits-item': 'small pb-4 d-block',
              }"
            >
              <div slot="item" slot-scope="{ item }">
                <a :href="item.link" target="_blank" class="nav-link p-0">
                  <div class="d-flex justify-content-between">
                    <div
                      class="text-truncate d-inline-block text-gray-200"
                      style="max-width: 280px"
                    >
                      <ais-highlight attribute="title" :hit="item" />
                    </div>
                    <div class="d-inline-block">
                      <img
                        src="~/assets/images/open_link_icon.svg"
                        height="12"
                      />
                    </div>
                  </div>
                </a>
              </div>
            </AisHits>
          </Transition>
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
  AisConfigure,
  AisHighlight,
} from 'vue-instantsearch'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const INDEX_NAME = 'r'

function typesenseServerConfig($config) {
  const serverConfig = {
    apiKey: $config.typesenseSearchOnlyAPIKey,
    nodes: $config.typesenseHosts.map((h) => {
      return {
        host: h,
        port: $config.typesensePort,
        protocol: $config.typesenseProtocol,
      }
    }),
    connectionTimeoutSeconds: 1,
  }
  if ($config.typesenseHostNearest) {
    serverConfig.nearestNode = {
      host: $config.typesenseHostNearest,
      port: $config.typesensePort,
      protocol: $config.typesenseProtocol,
    }
  }
  return serverConfig
}

export default {
  components: {
    AisInstantSearch,
    AisHits,
    AisSearchBox,
    AisStats,
    AisConfigure,
    AisHighlight,
  },
  data({ $config }) {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
      server: typesenseServerConfig($config),
      additionalSearchParameters: {
        query_by: 'title',
        prioritize_exact_match: false,
      },
    })

    return {
      searchClient: typesenseInstantsearchAdapter.searchClient,
      INDEX_NAME,
      initialUiState: {
        r: {
          query: 'steamed',
        },
      },
      hitsPerPage: 5,
      starQueryResults: {
        out_of: 2231142,
      },
    }
  },
  methods: {
    transformSearchHits: (items) => {
      return items.map((item) => {
        let fixedLink = item.link
        if (!item.link.startsWith('http')) {
          fixedLink = `http://${item.link}`
        }

        return {
          ...item,
          link: fixedLink,
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.try-it-out-arrow {
  @media (min-width: map-get($grid-breakpoints, 'sm')) {
    position: absolute;
    top: -35px;
    left: -53px;
  }
}
</style>

<style lang="scss">
.search-demo-search-input.ais-SearchBox-input[type='search']::-webkit-search-cancel-button {
  display: none;
  -webkit-appearance: none;
}
</style>
