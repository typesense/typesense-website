<template>
  <transition
    enter-active-class="transition-opacity duration-300 [&>div]:transition-transform [&>div]:duration-300"
    leave-active-class="transition-opacity duration-300 [&>div]:transition-transform [&>div]:duration-300"
    enter-from-class="opacity-0 [&>div]:-translate-y-2"
    leave-to-class="opacity-0 [&>div]:-translate-y-2"
    @enter="isLocked = true"
    @after-leave="isLocked = false"
  >
    <div
      v-if="open"
      id="VPNavScreen"
      class="VPNavScreen pointer-events-auto fixed inset-x-0 bottom-0 top-[calc(var(--vp-nav-height)+var(--vp-layout-top-height,0px))] overflow-y-auto bg-[var(--vp-nav-screen-bg-color)] min-[768px]:hidden"
    >
      <div class="flex min-h-full flex-col px-6">
        <nav class="pt-4">
          <div
            v-for="item in internal"
            :key="item.link"
            class="flex items-center gap-4 border-b border-[var(--vp-c-divider)]"
          >
            <VPLink
              :href="item.link"
              class="flex-1 py-3 text-sm font-medium leading-6 transition-colors hover:text-[var(--vp-c-brand-1)]"
              :class="isCurrent(item) ? 'text-[var(--vp-c-brand-1)]' : 'text-[var(--vp-c-text-1)]'"
              @click="closeScreen"
            >
              {{ item.text }}
            </VPLink>
            <VersionDropdown v-if="item.activeMatch === '/api/'" />
          </div>
        </nav>

        <div class="mt-4 flex flex-wrap items-center gap-x-6">
          <VPLink
            v-for="item in external"
            :key="item.link"
            :href="item.link"
            class="py-2 text-sm font-medium leading-6 text-[var(--vp-c-text-2)] transition-colors hover:text-[var(--vp-c-text-1)]"
            @click="closeScreen"
          >
            {{ item.text }}
          </VPLink>
        </div>

        <div class="mt-auto flex items-center justify-between pb-4 pt-12">
          <p class="text-xs font-medium leading-6 text-[var(--vp-c-text-2)]">
            {{ theme.darkModeSwitchLabel || 'Appearance' }}
          </p>
          <VPSwitchAppearance />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { inBrowser, useData } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
// @ts-expect-error vitepress ships no types for its internals
import { EXTERNAL_URL_RE, isActive } from 'vitepress/dist/client/shared.js'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import VPSwitchAppearance from 'vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue'
import { computed, inject } from 'vue'
import VersionDropdown from './VersionDropdown.vue'
import { useNavLinks } from '../composables/useNavLinks'

defineProps<{ open: boolean }>()

const { page, theme } = useData<DefaultTheme.Config>()
const closeScreen = inject('close-screen') as () => void
const isLocked = useScrollLock(inBrowser ? document.body : null)

const links = useNavLinks()
const internal = computed(() => links.value.filter((item) => !EXTERNAL_URL_RE.test(item.link)))
const external = computed(() => [
  ...links.value.filter((item) => EXTERNAL_URL_RE.test(item.link)),
  ...(theme.value.socialLinks ?? []).map(({ link, ariaLabel }) => ({ text: ariaLabel, link })),
])

const isCurrent = (item: DefaultTheme.NavItemWithLink) =>
  isActive(page.value.relativePath, item.activeMatch || item.link, !!item.activeMatch)
</script>
