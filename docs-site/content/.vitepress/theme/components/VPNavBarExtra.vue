<template>
  <VPFlyout class="VPNavBarExtra -mr-3 hidden min-[768px]:block wide:hidden" label="extra navigation">
    <div class="group">
      <VPMenuLink v-for="item in external" :key="item.link" :item="item" />
    </div>
    <div class="group">
      <div class="flex min-w-[176px] items-center whitespace-nowrap px-3">
        <p class="grow text-xs font-medium leading-7 text-[var(--vp-c-text-2)]">
          {{ theme.darkModeSwitchLabel || 'Appearance' }}
        </p>
        <VPSwitchAppearance class="-mr-0.5" />
      </div>
    </div>
    <div v-if="theme.socialLinks" class="group">
      <div class="flex items-center px-3">
        <VPSocialLinks class="-mx-2 -my-1" :links="theme.socialLinks" />
      </div>
    </div>
  </VPFlyout>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
// @ts-expect-error vitepress ships no types for its internals
import { EXTERNAL_URL_RE } from 'vitepress/dist/client/shared.js'
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import VPMenuLink from 'vitepress/dist/client/theme-default/components/VPMenuLink.vue'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import VPSwitchAppearance from 'vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue'
import { computed } from 'vue'

const { theme } = useData<DefaultTheme.Config>()

const external = computed(
  () =>
    (theme.value.nav ?? []).filter(
      item => 'link' in item && EXTERNAL_URL_RE.test(item.link),
    ) as DefaultTheme.NavItemWithLink[],
)
</script>
