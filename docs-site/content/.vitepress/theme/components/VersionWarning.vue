<template>
  <div
    v-if="showVersionWarning"
    :class="
      banner
        ? 'sticky bottom-0 z-10 -mx-6 mt-8 bg-[var(--vp-c-bg)] px-6 pb-5 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-8 before:bg-[linear-gradient(transparent,var(--vp-c-bg)_70%)] min-[768px]:-mx-8 min-[768px]:px-8 min-[960px]:px-16 min-[1280px]:hidden'
        : 'mb-4'
    "
  >
    <!-- 688px is vitepress's .content-container width -->
    <div
      class="relative rounded-lg bg-accent-selected p-3 text-[0.8125rem] leading-relaxed text-ink [&_a]:font-semibold [&_a]:after:absolute [&_a]:after:inset-0 [&_a]:text-accent [&_a:hover]:cursor-pointer [&_a:hover]:underline"
      :class="banner && 'mx-auto max-w-[688px]'"
    >
      <p v-if="isOlderThanLatest">
        You are viewing docs for an old version. Switch to latest
        <RouterLink :to="getVersionedPath(latestVersion)" @click.prevent="goToVersion(latestVersion)">
          v{{ latestVersion }}</RouterLink
        >.
      </p>
      <p v-else-if="isNewerThanLatest">
        You are viewing docs for an RC version, switch to GA version
        <RouterLink :to="getVersionedPath(latestVersion)" @click.prevent="goToVersion(latestVersion)">
          v{{ latestVersion }}</RouterLink
        >.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import RouterLink from './RouterLink.vue'
import { useVersionSwitch } from '../composables/useVersionSwitch'

withDefaults(defineProps<{ banner?: boolean }>(), { banner: false })

const { latestVersion, showVersionWarning, isOlderThanLatest, isNewerThanLatest, getVersionedPath, goToVersion } =
  useVersionSwitch()
</script>
