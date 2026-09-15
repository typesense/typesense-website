<template>
  <div ref="container" class="typesense-search-wrapper" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useData, useRouter } from 'vitepress'
import docsearch from 'typesense-docsearch.js'
import type { DocSearchInstance } from 'typesense-docsearch.js'

const { theme, page } = useData()
const router = useRouter()

const container = ref<HTMLElement | null>(null)
let instance: DocSearchInstance | undefined
let searchEventTimer: ReturnType<typeof setTimeout> | undefined

function currentVersion(): string | null {
  return (page.value as any).typesenseVersion
}

function initialize() {
  const userOptions = (theme.value as any).typesenseDocsearch
  if (!userOptions || !container.value) return

  const { typesenseSearchParameters = {} } = userOptions
  const latest = (theme.value as any).typesenseLatestVersion
  const version = currentVersion()

  instance = docsearch({
    ...userOptions,
    container: container.value,
    placeholder: (theme.value as any).searchPlaceholder || '',
    typesenseSearchParameters: {
      ...typesenseSearchParameters,
      filter_by: version
        ? `version:=[${version},unversioned]`
        : `version:=[${latest},unversioned]`,
    },
    transformSearchClient(searchClient) {
      return {
        search(params) {
          const query = params.requests[0]?.q
          if (typeof window !== 'undefined' && typeof query === 'string' && query.length > 0) {
            clearTimeout(searchEventTimer)
            searchEventTimer = setTimeout(() => {
              const w = window as any
              w.dataLayer = w.dataLayer || []
              w.dataLayer.push({ event: 'docs_search', search_term: query.slice(0, 100) })
            }, 500)
          }
          return searchClient.search(params)
        },
      }
    },
    navigator: {
      navigate({ itemUrl }: { itemUrl: string }) {
        // itemUrl is absolute and already carries the /docs/ base router.go wants
        const { pathname, hash } = new URL(itemUrl, window.location.origin)
        router.go(`${pathname}${decodeURIComponent(hash)}`)
      },
    },
  })
}

function teardown() {
  instance?.destroy()
  instance = undefined
}

onMounted(initialize)
onBeforeUnmount(teardown)
function onHitClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const anchor = (event.target as HTMLElement | null)?.closest?.('.DocSearch-Hit a') as HTMLAnchorElement | null
  if (!anchor?.href) return
  const { pathname, hash } = new URL(anchor.href, window.location.origin)
  if (!pathname.startsWith('/docs/')) return
  event.preventDefault()
  router.go(`${pathname}${decodeURIComponent(hash)}`)
}

onMounted(() => document.addEventListener('click', onHitClick))
onBeforeUnmount(() => document.removeEventListener('click', onHitClick))

// re-filter results when navigating between versioned sections
watch(() => currentVersion(), () => {
  teardown()
  initialize()
})
</script>
