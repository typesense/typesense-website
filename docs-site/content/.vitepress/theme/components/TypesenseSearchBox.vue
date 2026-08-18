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

// re-filter results when navigating between versioned sections
watch(() => currentVersion(), () => {
  teardown()
  initialize()
})
</script>
