<template>
  <div
    v-if="pageVersion"
    class="inline-block"
    :class="[showOnMobileOnly ? 'mobile:!hidden' : '', showOnDesktopOnly ? 'max-mobile:!hidden' : '']"
  >
    <Select :model-value="currentVersion ?? undefined" @update:model-value="version => goToVersion(String(version))">
      <SelectTrigger
        class="h-8 w-auto gap-2 border-line bg-surface-gray px-3 py-0 text-sm font-medium leading-none text-ink hover:bg-surface-gray-hover data-[placeholder]:text-ink focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-offset-2 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-60 [&>svg]:transition-transform [&[data-state=open]>svg]:rotate-180"
      >
        <!-- an unlisted version has no item to take its label from -->
        <SelectValue>v{{ currentVersion ?? pageVersion }}</SelectValue>
      </SelectTrigger>
      <SelectContent :align="align" :collision-padding="16" :body-lock="false" class="w-44">
        <SelectItem
          v-for="version in versions"
          :key="version"
          :value="version"
          :disabled="!versionHasPage(version)"
          class="cursor-pointer text-ink focus:bg-surface-gray focus:text-ink data-[disabled]:text-ink-lighter data-[disabled]:opacity-100 data-[state=checked]:bg-accent-selected data-[state=checked]:font-semibold data-[state=checked]:text-accent"
        >
          v{{ version }}
        </SelectItem>
        <template v-if="versions.some(version => !versionHasPage(version))" #footer>
          <p class="border-t border-line px-3 py-2 text-xs leading-snug text-ink-muted">
            Greyed out versions don't have this page.
          </p>
        </template>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useVersionSwitch } from '../composables/useVersionSwitch'

withDefaults(defineProps<{ showOnMobileOnly?: boolean; showOnDesktopOnly?: boolean; align?: 'start' | 'end' }>(), {
  showOnMobileOnly: false,
  showOnDesktopOnly: false,
  align: 'start',
})

const { versions, currentVersion, pageVersion, versionHasPage, goToVersion } = useVersionSwitch()
</script>
