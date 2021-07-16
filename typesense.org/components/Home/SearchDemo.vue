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
            height="60"
            width="76"
          />
        </div>
        <div class="col-sm-11">
          <Transition name="fade">
            <AisSearchBox
              placeholder="Search for a recipe..."
              :class-names="{
                'ais-SearchBox-input': 'form-control',
                'ais-SearchBox-submit': 'd-none',
                'ais-SearchBox-reset': 'd-none',
              }"
            />
          </Transition>
        </div>
      </div>
      <Transition name="fade">
        <AisStats class="text-right mt-1">
          <span
            slot-scope="{ nbHits, processingTimeMS }"
            class="small text-white"
          >
            ✨ Found {{ nbHits.toLocaleString() }} recipes out of
            {{ starQueryResults['out_of'].toLocaleString() }} in
            {{ processingTimeMS }} ms
          </span>
        </AisStats>
      </Transition>
      <Transition name="fade">
        <div class="row justify-content-end mt-3">
          <div class="col-sm-1">
            <img
              src="~assets/images/magic_wand.svg"
              height="24"
              width="24"
              class="mt-2 d-none d-sm-inline-block"
            />
          </div>
          <div class="col-sm-10">
            <AisHits
              :transform-items="transformSearchHits"
              :class-names="{
                'ais-Hits-list': 'p-0',
                'ais-Hits-item':
                  'small p-2 border-bottom border-primary border-primary-dark d-block',
              }"
            >
              <div slot="item" slot-scope="{ item }">
                <a :href="item.link" target="_blank">
                  <div class="d-flex justify-content-between">
                    <div
                      class="text-truncate d-inline-block text-white"
                      style="max-width: 250px"
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
          </div>
        </div>
      </Transition>
      <div class="row justify-content-end">
        <div class="col-sm-10">
          <div class="search-demo-page-numbers d-flex justify-content-end">
            <Transition name="fade">
              <AisPagination
                :show-first="true"
                :show-previous="false"
                :show-next="false"
                :show-last="false"
                :class-names="{
                  'ais-Pagination-list': 'd-flex flex-row',
                  'ais-Pagination-item': 'px-2 d-block',
                }"
              />
            </Transition>
          </div>
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
    AisPagination,
    AisConfigure,
    AisHighlight,
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
    top: -30px;
    left: -42px;
  }
}
</style>

<style lang="scss">
.search-demo-page-numbers {
  max-width: 300px;
  display: inline-block;
  width: 300px;

  .ais-Pagination-link {
    color: unset;
    border-bottom: unset;

    &:hover {
      text-decoration: unset;
    }
  }

  .ais-Pagination-item {
    color: #af931a;

    &:hover {
      text-decoration: unset;
      padding-bottom: 1px;
      border-bottom: #4d3e00 1px solid;
    }
  }

  .ais-Pagination-item--selected {
    color: #ffd000;
    padding-bottom: 1px;
  }

  .ais-Pagination-item--disabled {
    color: #40391c;
  }
}
</style>
