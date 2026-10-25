<template>
  <div class="mx-auto flex max-w-xl flex-col items-center px-6 pb-32 pt-24 text-center min-[768px]:pt-36">
    <p class="font-mono text-sm font-semibold tracking-wider text-accent">404</p>
    <h1 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--vp-c-text-1)]">Page not found</h1>
    <p class="mt-4 text-balance text-base leading-7 text-[var(--vp-c-text-2)]">
      This page doesn't exist or has moved. Pick a section below, or search the docs.
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <VPLink
        v-for="(link, i) in links"
        :key="link.href"
        :href="link.href"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
        :class="
          i === 0
            ? 'bg-[var(--vp-button-brand-bg)] text-[var(--vp-button-brand-text)] hover:bg-[var(--vp-button-brand-hover-bg)]'
            : 'text-[var(--vp-c-text-1)] ring-1 ring-inset ring-[var(--vp-c-divider)] hover:bg-[var(--vp-c-bg-soft)]'
        "
      >
        {{ link.text }}
      </VPLink>
    </div>

    <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200 ease-out">
      <section v-if="suggestions.length" class="mt-14 w-full text-left">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-[var(--vp-c-text-3)]">
          Were you looking for?
        </h2>
        <ul class="mt-3 divide-y divide-[var(--vp-c-divider)] overflow-hidden rounded-lg ring-1 ring-inset ring-[var(--vp-c-divider)]">
          <li v-for="suggestion in suggestions" :key="suggestion.href">
            <VPLink
              :href="suggestion.href"
              class="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-[var(--vp-c-bg-soft)]"
            >
              <span class="text-sm font-medium text-[var(--vp-c-text-1)]">{{ suggestion.title }}</span>
              <span class="truncate font-mono text-xs text-[var(--vp-c-text-3)]">{{ withBase(suggestion.href) }}</span>
            </VPLink>
          </li>
        </ul>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import type { TypesenseThemeConfig } from '../types'

const VERSION = /^\d+\.\d+(?:\.\d+)?$/

const { theme } = useData<TypesenseThemeConfig>()
const route = useRoute()

const links = computed(() => [
  { text: 'Docs home', href: '/' },
  { text: 'Guide', href: '/guide/' },
  { text: 'API Reference', href: `/${theme.value.typesenseLatestVersion}/api/` },
])

const suggestions = ref<{ title: string; href: string }[]>([])

type Hit = { document: { url_without_anchor: string; 'hierarchy.lvl0': string } }

// the broken url's last segment is usually a near miss of a real page title
async function suggest() {
  suggestions.value = []
  const segments = route.path.replace(/^\/docs\//, '').split('/').filter(Boolean)
  const query = (segments.filter((segment) => !VERSION.test(segment)).pop() ?? '')
    .replace(/\.(html|md)$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
  const config = theme.value.typesenseDocsearch
  if (!query || !config) return

  const versioned = segments.find((segment) => VERSION.test(segment))
  const version = versioned && theme.value.typesenseVersions.includes(versioned)
    ? versioned
    : theme.value.typesenseLatestVersion
  const { nearestNode, nodes, apiKey } = config.typesenseServerConfig
  const { protocol, host, port } = nearestNode ?? nodes[0]
  const params = new URLSearchParams({
    q: query,
    query_by: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,embedding',
    query_by_weights: '4,2,1,1',
    // the search box's 1.0 also matches gibberish slugs
    vector_query: 'embedding:([], k: 5, distance_threshold: 0.7, alpha: 0.2)',
    prioritize_token_position: 'true',
    filter_by: `version:=[${version},unversioned]`,
    group_by: 'url_without_anchor',
    group_limit: '1',
    per_page: '4',
    include_fields: 'url_without_anchor,hierarchy.lvl0',
  })

  try {
    const response = await fetch(
      `${protocol}://${host}:${port}/collections/${config.typesenseCollectionName}/documents/search?${params}`,
      { headers: { 'X-TYPESENSE-API-KEY': apiKey } },
    )
    const { grouped_hits = [] }: { grouped_hits?: { hits: Hit[] }[] } = await response.json()
    suggestions.value = grouped_hits.map(({ hits: [{ document }] }) => ({
      title: document['hierarchy.lvl0'],
      href: new URL(document.url_without_anchor).pathname.replace(/^\/docs/, ''),
    }))
  } catch {
    suggestions.value = []
  }
}

onMounted(suggest)
watch(() => route.path, suggest)
</script>
