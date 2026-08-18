<template>
  <div
    v-if="visible"
    class="version-warning sticky bottom-5 z-10 ml-4 mr-4 mt-4 rounded-lg bg-accent-selected p-3 text-[0.8125rem] leading-relaxed text-ink after:absolute after:inset-x-0 after:top-full after:h-5 after:bg-[var(--vp-c-bg)] [&_a]:font-semibold [&_a]:text-accent [&_a:hover]:cursor-pointer [&_a:hover]:underline"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RouterLink from './RouterLink.vue'
import { useVersionSwitch } from '../composables/useVersionSwitch'

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
