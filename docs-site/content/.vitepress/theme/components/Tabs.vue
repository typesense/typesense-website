<template>
  <div class="my-4">
    <ClientOnly>
      <div
        class="relative overflow-hidden rounded-t-md max-mobile:-mx-6 max-mobile:rounded-none before:pointer-events-none before:absolute before:left-0 before:top-0 before:bottom-px before:w-6 before:bg-[linear-gradient(to_right,var(--vp-code-block-bg),transparent)] after:pointer-events-none after:absolute after:right-0 after:top-0 after:bottom-px after:w-6 after:bg-[linear-gradient(to_left,var(--vp-code-block-bg),transparent)]"
      >
        <ul
          ref="list"
          :data-copy-tabs="JSON.stringify(tabs)"
          :data-copy-active-tab="activeTab"
          class="relative flex justify-start items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden !list-none !m-0 !px-6 !py-2.5 border-b border-[var(--vp-c-divider)] bg-[var(--vp-code-block-bg)] text-[var(--vp-c-text-2)] text-[0.7rem]"
        >
          <li
            v-if="pill"
            aria-hidden="true"
            class="pointer-events-none absolute left-0 top-0 !mt-0 rounded-lg border border-border bg-muted shadow-sm transition-[transform,width] duration-500 ease-out-expo motion-reduce:transition-none"
            :style="{
              transform: `translate(${pill.left}px, ${pill.top}px)`,
              width: `${pill.width}px`,
              height: `${pill.height}px`,
            }"
          />
          <li
            v-for="tab in augmentedTabs"
            :key="tab"
            :data-active="tab === activeTab || undefined"
            class="relative shrink-0 !mt-0 px-2.5 py-1.5 leading-none whitespace-nowrap cursor-pointer transition-colors after:absolute after:inset-x-0 after:-inset-y-2.5"
            :class="tab === activeTab ? 'text-[var(--vp-c-text-1)]' : 'hover:text-[var(--vp-c-text-1)]'"
            @click="setActiveTab(tab, $event)"
          >
            {{ tab }}
          </li>
        </ul>
      </div>
      <div class="content-container">
        <div v-for="tab in augmentedTabs" v-show="tab === activeTab" :key="tab" class="tab-content">
          <template v-if="tab === 'Other Languages'">
            <div class="language-bash">
              <pre class="language-bash"><code
              >Typesense has a RESTful HTTP API.
So you can use any HTTP library in your language of choice to make API calls to it.
The official client libraries are just thin wrappers around the API, with a retry mechanism.
Have a look at the "Shell" tab for guidance on HTTP headers, method and parameters to use to make HTTP calls.</code
              ></pre>
            </div>
          </template>
          <slot v-else :name="tab" />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { docsStore } from '../store'

const props = defineProps<{ tabs: string[] }>()

const cmpActiveTab = ref(props.tabs[0])

const augmentedTabs = computed(() =>
  // "other languages" has no business on e.g. sample response tabs
  props.tabs.includes('Ruby') && props.tabs.includes('Python')
    ? [...props.tabs, 'Other Languages']
    : props.tabs,
)

const activeTab = computed(() => {
  const preferred = augmentedTabs.value.find((tab) => tab === docsStore.state.defaultTab)
  if (preferred) return preferred
  const singleLanguage = docsStore.singlePreferredCopyLanguage.value
  if (singleLanguage && augmentedTabs.value.includes(singleLanguage)) {
    return singleLanguage
  }
  return cmpActiveTab.value
})

// without this the tabs snap back to the first when the language override drops
watch(activeTab, (newTab) => {
  if (newTab && newTab !== cmpActiveTab.value) cmpActiveTab.value = newTab
})

async function setActiveTab(tab: string, event: MouseEvent) {
  const item = event.currentTarget as HTMLElement
  const strip = item.parentElement!
  const top = strip.getBoundingClientRect().top
  cmpActiveTab.value = tab
  docsStore.setDefaultTab(tab)
  // every group on the page switches, so the ones above can change height. scroll
  // anchoring misses that when its anchor is a code block that gets hidden, and
  // safari has none, so keep the clicked strip where it was on screen
  await nextTick()
  window.scrollBy(0, strip.getBoundingClientRect().top - top)
}

const list = ref<HTMLElement | null>(null)
const activeItem = ref<HTMLElement | null>(null)
const pill = ref<{ left: number; top: number; width: number; height: number } | null>(null)

// the list only exists once ClientOnly mounts
watch(
  [list, activeTab],
  () => (activeItem.value = list.value?.querySelector<HTMLElement>('[data-active]') ?? null),
  { flush: 'post' },
)

// every strip on the page follows the chosen tab, not just the clicked one
watch(activeItem, (item, previous) => {
  const strip = item?.parentElement
  if (!strip) return
  const left = item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2
  strip.scrollTo({ left, behavior: previous ? 'smooth' : 'instant' })
})

// also catches the font swapping in and tabs that mount hidden
useResizeObserver(activeItem, () => {
  const item = activeItem.value
  pill.value = item?.offsetParent
    ? { left: item.offsetLeft, top: item.offsetTop, width: item.offsetWidth, height: item.offsetHeight }
    : null
})
</script>

<!-- css only because shiki generates this markup, no room for tailwind classes -->
<style scoped>
.tab-content > :deep(div[class^='language-']) {
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.tab-content > :deep(div[class^='language-']:not(:last-child)) {
  border-radius: 0;
}

.tab-content :deep(pre[class^='language-']) {
  margin: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* duplicate language label */
.tab-content :deep(div[class*='language-']::before) {
  display: none;
}

@media (max-width: 719px) {
  .tab-content :deep(div[class*='language-']) {
    margin: 0 -1.5rem;
    border-radius: 0;
  }
}
</style>
