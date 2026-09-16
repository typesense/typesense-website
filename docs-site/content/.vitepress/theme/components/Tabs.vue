<template>
  <div class="mb-4">
    <ClientOnly>
      <ul
        class="flex justify-start items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden !list-none !m-0 !px-6 !pt-4 !pb-4 rounded-t-md border-b border-[var(--vp-c-divider)] bg-[var(--vp-code-block-bg)] text-[var(--vp-c-text-2)] text-[0.7rem] max-mobile:!-mx-6 max-mobile:rounded-none"
      >
        <li
          v-for="tab in augmentedTabs"
          :key="tab"
          class="group shrink-0 mr-4 !mt-0 cursor-pointer"
          @click="setActiveTab(tab)"
        >
          <span
            class="inline-block mr-[0.3rem] !text-[0.7rem] leading-none whitespace-nowrap border-b border-transparent group-hover:border-[var(--vp-c-brand-1)]"
            :class="{ '!border-[var(--vp-c-brand-1)]': tab === activeTab }"
            >{{ tab }}</span
          >
        </li>
      </ul>
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
import { computed, ref, watch } from 'vue'
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
  const singleLanguage = docsStore.singlePreferredCopyLanguage.value
  if (singleLanguage && augmentedTabs.value.includes(singleLanguage)) {
    return singleLanguage
  }
  const preferred = augmentedTabs.value.find((tab) => tab === docsStore.state.defaultTab)
  return preferred || cmpActiveTab.value
})

// without this the tabs snap back to the first when the language override drops
watch(activeTab, (newTab) => {
  if (newTab && newTab !== cmpActiveTab.value) cmpActiveTab.value = newTab
})

function setActiveTab(tab: string) {
  cmpActiveTab.value = tab
  docsStore.setDefaultTab(tab)
}
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
