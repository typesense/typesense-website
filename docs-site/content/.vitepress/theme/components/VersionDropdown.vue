<template>
  <div
    v-if="isApiPage"
    class="inline-block"
    :class="[showOnMobileOnly ? 'mobile:!hidden' : '', showOnDesktopOnly ? 'max-mobile:!hidden' : '']"
  >
    <div class="relative inline-flex items-center">
      <select
        class="box-border h-8 cursor-pointer appearance-none rounded-md border border-line
bg-surface-gray pl-3 pr-8 text-sm font-medium leading-none text-ink hover:bg-surface-gray-hover focus:outline-none"
        @change="switchVersion"
      >
        <option
          v-for="version in versions"
          :key="version"
          :value="version"
          :selected="version === currentVersion"
          :disabled="!versionHasPage(version)"
        >
          v{{ version }}
        </option>
      </select>
      <ChevronDown
        class="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink opacity-60"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { useVersionSwitch } from '../composables/useVersionSwitch'

withDefaults(defineProps<{ showOnMobileOnly?: boolean; showOnDesktopOnly?: boolean }>(), {
  showOnMobileOnly: false,
  showOnDesktopOnly: false,
})

const { versions, currentVersion, isApiPage, versionHasPage, switchVersion } = useVersionSwitch()
</script>
