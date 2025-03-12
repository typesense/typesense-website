<script async setup lang="ts">
import { ref } from "vue";
import {
  AisInstantSearchSsr,
  AisSearchBox,
  AisRefinementList,
  AisHits,
  AisConfigure,
  AisHighlight,
  AisStats,
  AisStateResults,
  createServerRootMixin,
  //@ts-ignore
} from "vue-instantsearch/vue3/es";
import { renderToString } from "vue/server-renderer";
import * as TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import SearchIcon from "@/assets/icons/search.svg";
import SearchStatsStars from "@/assets/icons/search-stats-stars.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import NoResultsFound from "@/assets/images/no-results-found.svg";
import type { BaseAdapterOptions } from "typesense-instantsearch-adapter";

const props = defineProps<{
  classNames?: {
    searchBarWrapper?: string;
    hitList?: string;
    hitItem?: string;
  };
}>();

const config = useRuntimeConfig();
const hitsPerPage = 6;
const INDEX_NAME = config.public.typesenseCollectionName;

const serverConfig: BaseAdapterOptions["server"] = {
  apiKey: config.public.typesenseSearchOnlyApiKey,
  nodes: config.public.typesenseHosts.split(",").map((h) => {
    return {
      host: h,
      port: Number(config.public.typesensePort),
      protocol: config.public.typesenseProtocol,
    };
  }),
  connectionTimeoutSeconds: 1,
};
if (config.public.typesenseHostNearest) {
  serverConfig.nearestNode = {
    host: config.public.typesenseHostNearest,
    port: Number(config.public.typesensePort),
    protocol: config.public.typesenseProtocol,
  };
}

const searchClient = new TypesenseInstantSearchAdapter.default({
  server: serverConfig,
  additionalSearchParameters: {
    query_by: "title",
    prioritize_exact_match: false,
  },
}).searchClient;

// https://algolia.nuxtjs.org/advanced/vue-instantsearch/
const serverRootMixin = ref(
  createServerRootMixin({
    searchClient,
    indexName: INDEX_NAME,
    future: {
      preserveSharedStateOnUnmount: true,
    },
    initialUiState: {
      r: {
        query: "steamed",
      },
    },
  }),
);
const { instantsearch } = serverRootMixin.value.data();
provide("$_ais_ssrInstantSearchInstance", instantsearch);

onBeforeMount(() => {
  // Use data loaded on the server
  if (algoliaState.value) {
    instantsearch.hydrate(algoliaState.value);
  }
});

const { data: algoliaState } = await useAsyncData("algolia-state", async () => {
  return instantsearch.findResultsState({
    // IMPORTANT: a component with access to `this.instantsearch` to be used by the createServerRootMixin code
    component: {
      $options: {
        components: {
          AisInstantSearchSsr,
          AisConfigure,
          AisRefinementList,
          AisHits,
        },
        data() {
          return {
            instantsearch,
          };
        },
        provide: { $_ais_ssrInstantSearchInstance: instantsearch },
        render() {
          return h(AisInstantSearchSsr, null, () => [
            h(AisSearchBox),
            h(AisStats),
            h(AisStateResults),
            h(AisHits),
            h(AisConfigure, { hitsPerPage }),
          ]);
        },
      },
    },
    renderToString,
  });
});

const transformItems = (items: { link: string }[]) =>
  items.map((item) => {
    let fixedLink = item.link;
    if (!item.link.startsWith("http")) {
      fixedLink = `http://${item.link}`;
    }
    return {
      ...item,
      link: fixedLink,
    };
  });
</script>
<template>
  <AisInstantSearchSsr
    :search-client="searchClient"
    :index-name="INDEX_NAME"
    initial-ui-state="initialUiState"
  >
    <ais-configure :hitsPerPage="hitsPerPage" />

    <div
      :class="`mb-1 flex w-full items-center overflow-hidden rounded-xl bg-bg px-5 ${props.classNames?.searchBarWrapper || ''}`"
    >
      <div class="input-wrapper flex w-full flex-1 items-center">
        <SearchIcon class="mr-3 size-5 text-primary" />
        <AisSearchBox
          placeholder="Search for recipes..."
          class="flex-1 tracking-[-0.32px] text-primary"
          :class-names="{
            'ais-SearchBox-input':
              'w-full h-[60px] focus:outline-none focus:ring-0 bg-bg placeholder:font-thin',
            'ais-SearchBox-submit': 'hidden',
            'ais-SearchBox-reset': 'hidden',
          }"
          :show-loading-indicator="false"
        />
      </div>
      <AisStats class="stats text-sm tracking-[-0.28px] text-text-muted">
        <template v-slot="{ nbHits, processingTimeMS }">
          <span class="flex items-center gap-2">
            <SearchStatsStars /> Found {{ nbHits.toLocaleString() }} recipes out
            of 2,231,142 in
            {{ parseInt(processingTimeMS) === 0 ? 1 : processingTimeMS }}ms
          </span>
        </template>
      </AisStats>
    </div>

    <AisStateResults
      class="flex overflow-hidden rounded-xl bg-bg text-left text-sm tracking-tight text-[#2D2D45]"
    >
      <template v-slot="{ results: { hits } }">
        <AisHits
          v-show="hits.length > 0"
          :class-names="{
            'ais-Hits': 'flex-1',
            'ais-Hits-list': `flex flex-col gap-0.5 ${props.classNames?.hitList || ''}`,
          }"
          :transform-items="transformItems"
        >
          <template v-slot:item="{ item }">
            <div
              :class="`flex h-[54px] items-center justify-between bg-bg-gray-1 p-0 px-5 ${props.classNames?.hitItem || ''}`"
            >
              <div class="flex items-center">
                <div class="circle mr-3 size-4 rounded-full bg-bg"></div>
                <AisHighlight
                  attribute="title"
                  :hit="item"
                  :class-names="{
                    'ais-Highlight-highlighted': 'bg-transparent text-primary',
                  }"
                />
              </div>
              <a :href="item.link" target="_blank" class="rounded-lg bg-bg p-2"
                ><ExternalLinkIcon class="external-link-icon size-3"
              /></a>
            </div>
          </template>
        </AisHits>
        <div
          class="flex min-h-[334px] flex-1 flex-col items-center justify-center self-center"
          v-show="hits.length === 0"
        >
          <NoResultsFound />
          <h3
            class="mb-2 mt-6 font-heading text-lg leading-[1.3] tracking-tighter"
          >
            No Results Found
          </h3>
          <AisStats
            class="no-result-stats text-sm tracking-[-0.28px] text-text-muted"
          >
            <template v-slot="{ nbHits, processingTimeMS }">
              Found
              {{ nbHits.toLocaleString() }} recipes out of 2,231,142 in
              {{ parseInt(processingTimeMS) === 0 ? 1 : processingTimeMS }}ms
            </template>
          </AisStats>
        </div>
      </template>
    </AisStateResults>
  </AisInstantSearchSsr>
</template>

<style>
.ais-SearchBox-input[type="search"]::-webkit-search-cancel-button {
  display: none;
  -webkit-appearance: none;
}
</style>
