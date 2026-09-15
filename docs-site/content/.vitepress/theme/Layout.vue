<template>
  <Layout>
    <template #nav-bar-content-after>
      <div class="flex items-center gap-2 ml-4">
        <TypesenseSearchBox />
      </div>
    </template>
    <template #nav-screen-content-after>
      <VersionDropdown class="mt-4" />
    </template>
    <!-- measured height feeds the outline title's sticky offset -->
    <template #aside-top>
      <div ref="asideTop" class="aside-pinned-version">
        <VersionDropdown show-on-desktop-only class="mb-4" />
      </div>
    </template>
    <template #aside-outline-before>
      <OutlineScrollProgress />
    </template>
    <template #aside-bottom>
      <VersionWarning />
    </template>
    <!-- no aside below 1280px, the prompt rides the doc column instead -->
    <template #doc-bottom>
      <VersionWarning banner />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import VersionDropdown from './components/VersionDropdown.vue'
import VersionWarning from './components/VersionWarning.vue'
import TypesenseSearchBox from './components/TypesenseSearchBox.vue'
import OutlineScrollProgress from './components/OutlineScrollProgress.vue'

const { Layout } = DefaultTheme

// typesense-docsearch keys its dark palette off html[data-theme], vitepress
// off a .dark class
const { isDark } = useData()
watch(isDark, (dark) => {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
})

// vitepress marks the active outline item but never scrolls it into view, and
// doesn't expose it as state either
let observer: MutationObserver | undefined

function scrollActiveIntoView() {
  const active = document.querySelector<HTMLElement>('.VPDocAsideOutline .outline-link.active')
  if (active) active.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

// style.css stacks the pinned outline title beneath this, and the height varies
const asideTop = ref<HTMLElement | null>(null)
let resize: ResizeObserver | undefined

onMounted(() => {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'

  const outline = document.querySelector('.VPDocAsideOutline')
  if (outline) {
    observer = new MutationObserver(scrollActiveIntoView)
    observer.observe(outline, { attributes: true, attributeFilter: ['class'], subtree: true })
    scrollActiveIntoView()
  }

  if (asideTop.value) {
    const aside = asideTop.value.closest<HTMLElement>('.VPDocAside')
    const sync = () =>
      aside?.style.setProperty('--aside-pinned-top', `${asideTop.value?.offsetHeight ?? 0}px`)
    resize = new ResizeObserver(sync)
    resize.observe(asideTop.value)
    sync()
  }
})

onUnmounted(() => {
  observer?.disconnect()
  resize?.disconnect()
})
</script>
