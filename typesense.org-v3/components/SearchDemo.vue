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
  createServerRootMixin,
  //@ts-ignore
} from "vue-instantsearch/vue3/es";
import { renderToString } from "vue/server-renderer";
import * as TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import SearchIcon from "@/assets/icons/search.svg";
import SearchStatsStars from "@/assets/icons/search-stats-stars.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import BackgroundIllustration from "@/assets/images/background-illustration.svg";
import type { BaseAdapterOptions } from "typesense-instantsearch-adapter";

const INDEX_NAME = "r";
const config = useRuntimeConfig();

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
            h(AisHits),
            h(AisConfigure, { hitsPerPage: 6 }),
          ]);
        },
      },
    },
    renderToString,
  });
});

// export default {
//   components: {
//     AisInstantSearch,
//     AisHits,
//     AisSearchBox,
//     AisStats,
//     AisConfigure,
//     AisHighlight,
//   },
//   data({ config }) {
//     const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
//       server: typesenseServerConfig(config),
//       additionalSearchParameters: {
//         query_by: "title",
//         prioritize_exact_match: false,
//       },
//     });

//     return {
//       searchClient: typesenseInstantsearchAdapter.searchClient,
//       INDEX_NAME,
//       initialUiState: {
//         r: {
//           query: "steamed",
//         },
//       },
//       hitsPerPage: 5,
//       starQueryResults: {
//         out_of: 2231142,
//       },
//     };
//   },
//   methods: {
//     transformSearchHits: (items) => {
//       return items.map((item) => {
//         let fixedLink = item.link;
//         if (!item.link.startsWith("http")) {
//           fixedLink = `http://${item.link}`;
//         }

//         return {
//           ...item,
//           link: fixedLink,
//         };
//       });
//     },
//   },
// };
</script>
<template>
  <div class="relative min-h-[416px]">
    <BackgroundIllustration
      class="pointer-events-none absolute left-1/2 top-1/2 z-[-4] -translate-x-1/2 -translate-y-[42.5%]"
    />
    <AisInstantSearchSsr
      :search-client="searchClient"
      :index-name="INDEX_NAME"
      initial-ui-state="initialUiState"
    >
      <ais-configure :hitsPerPage="6" />
      <div class="relative w-[784px] p-2">
        <div class="background"></div>
        <div class="gradient-secondary"></div>
        <div class="gradient"></div>

        <div
          class="mb-1 flex w-full items-center overflow-hidden rounded-xl bg-bg px-5"
        >
          <SearchIcon class="mr-3" />
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
          <AisStats class="text-sm tracking-[-0.28px] text-text-muted">
            <template v-slot="{ nbHits, processingTimeMS }">
              <span class="flex items-center gap-2">
                <SearchStatsStars /> Found {{ nbHits.toLocaleString() }} recipes
                out of 2,231,142 in
                {{ parseInt(processingTimeMS) === 0 ? 1 : processingTimeMS }}ms
              </span>
            </template>
          </AisStats>
        </div>
        <div
          class="overflow-hidden rounded-xl bg-bg text-left text-sm tracking-[-0.28px] text-[#2D2D45]"
        >
          <AisHits
            :class-names="{
              'ais-Hits-list': 'flex flex-col gap-0.5',
            }"
          >
            <template v-slot:item="{ item }">
              <div
                class="flex h-[54px] items-center justify-between bg-bg-gray-1 p-0 px-5"
              >
                <div class="flex items-center">
                  <div class="mr-3 size-4 rounded-full bg-bg"></div>
                  <AisHighlight
                    attribute="title"
                    :hit="item"
                    :class-names="{
                      'ais-Highlight-highlighted':
                        'bg-transparent text-primary',
                    }"
                  />
                </div>
                <a
                  :href="item.link"
                  target="_blank"
                  class="rounded-lg bg-bg p-2"
                  ><ExternalLinkIcon
                /></a>
              </div>
            </template>
          </AisHits>
        </div>
      </div>
    </AisInstantSearchSsr>
  </div>
</template>

<style scoped>
.background {
  @apply pointer-events-none absolute inset-0 z-[-1];
  border-radius: 12px;
  box-shadow:
    0px 4px 80px 0px rgba(165, 165, 165, 0.15),
    0px 4px 9px 0px rgba(255, 255, 255, 0.25) inset;
}
.gradient-secondary {
  @apply absolute left-1/2 top-1/2 z-[-2] -translate-x-1/2 -translate-y-1/2 bg-secondary;
  width: 683.999px;
  height: 272px;
  opacity: 0.3;
  filter: blur(150px);
}
.gradient {
  @apply absolute inset-0 z-[-3] overflow-hidden rounded-xl;
}
.gradient::after {
  @apply pointer-events-none z-[-3] block size-full;
  content: "";
  background: linear-gradient(
    110deg,
    rgba(255, 255, 101, 0.3) -1.25%,
    rgba(53, 63, 215, 0.3) 99.32%
  );
  filter: blur(92px);
}
</style>

<style>
.ais-SearchBox-input[type="search"]::-webkit-search-cancel-button {
  display: none;
  -webkit-appearance: none;
}
</style>
