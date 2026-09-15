<template>
  <div
    v-if="visible"
    class="version-warning sticky z-10 bg-[var(--vp-c-bg)] before:absolute before:inset-x-0 before:bottom-full before:h-8 before:bg-[linear-gradient(transparent,var(--vp-c-bg)_70%)]"
    :class="
      banner
        ? '-mx-6 bottom-0 mt-8 px-6 pb-5 min-[768px]:-mx-8 min-[768px]:px-8 min-[1280px]:hidden'
        : 'bottom-5 mt-4 px-4 after:absolute after:inset-x-0 after:top-full after:h-5 after:bg-[var(--vp-c-bg)]'
    "
  >
    <!-- 688px is vitepress's .content-container width -->
    <div
      class="rounded-lg bg-accent-selected p-3 text-[0.8125rem] leading-relaxed text-ink [&_a]:font-semibold [&_a]:text-accent [&_a:hover]:cursor-pointer [&_a:hover]:underline"
      :class="banner ? 'mx-auto max-w-[688px]' : ''"
    >
      <template v-if="isOlderThanLatest">
        You are viewing docs for an old version. Switch to latest
        <RouterLink :to="getVersionedPath(latestVersion)" @click.prevent="goToVersion(latestVersion)">
          v{{ latestVersion }}</RouterLink
        >.
      </template>
      <template v-else-if="isNewerThanLatest">
        You are viewing docs for an RC version, switch to GA version
        <RouterLink :to="getVersionedPath(latestVersion)" @click.prevent="goToVersion(latestVersion)">
          v{{ latestVersion }}</RouterLink
        >.
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RouterLink from './RouterLink.vue'
import { useVersionSwitch } from '../composables/useVersionSwitch'

withDefaults(defineProps<{ banner?: boolean }>(), { banner: false })

const {
  latestVersion,
  isApiPage,
  showVersionWarning,
  isOlderThanLatest,
  isNewerThanLatest,
  getVersionedPath,
  goToVersion,
} = useVersionSwitch()

const visible = computed(() => isApiPage.value && showVersionWarning.value)
</script>
