<template>
  <div
    v-if="frontmatter.layout !== 'home' && (!emptyAndNoSidebar || y >= navHeight)"
    :class="
      cn(
        'VPLocalNav sticky left-0 z-[var(--vp-z-index-local-nav)] w-full border-b border-[var(--vp-c-gutter)] bg-[var(--vp-local-nav-bg-color)] pt-[var(--vp-layout-top-height,0px)] transition-[top] duration-300 motion-reduce:transition-none narrow:top-[var(--vp-nav-height)] min-[1280px]:hidden',
        navHidden ? 'top-0' : 'top-[var(--vp-nav-height)]',
        hasSidebar && 'narrow:pl-[var(--vp-sidebar-width)]',
        empty && 'narrow:hidden',
        emptyAndNoSidebar && 'fixed',
      )
    "
  >
    <div class="flex items-center justify-between">
      <div
        v-if="hasSidebar"
        class="relative flex min-w-0 items-center gap-2 self-stretch px-6 min-[768px]:px-8 narrow:hidden"
      >
        <button
          class="flex text-muted-foreground transition-colors after:absolute after:inset-0 hover:text-foreground"
          :aria-expanded="open"
          aria-controls="VPSidebarNav"
          @click="$emit('open-menu')"
        >
          <span class="vpi-align-left text-sm" />
          <span class="sr-only">{{ theme.sidebarMenuLabel || 'Menu' }}</span>
        </button>

        <Breadcrumb class="min-w-0">
          <BreadcrumbList class="flex-nowrap text-xs font-medium leading-6">
            <template v-if="section">
              <BreadcrumbItem class="shrink-0">{{ section }}</BreadcrumbItem>
              <BreadcrumbSeparator />
            </template>
            <BreadcrumbItem class="min-w-0">
              <BreadcrumbPage class="truncate">{{ current }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <!-- the dropdown sizes itself as if the nav had scrolled away -->
      <VPLocalNavOutlineDropdown
        class="shrink-0"
        :headers="headers"
        :nav-height="navHidden && !wide ? navHeight : y + navHeight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery, useWindowScroll } from '@vueuse/core'
import { useData } from 'vitepress'
import { useLocalNav, useSidebar, type DefaultTheme } from 'vitepress/theme'
// TODO: upgrade to vitepress 2 and vite 8 once v2 is out of alpha. it types these internals, so both
// ts-expect-errors can go (its isActive also takes the current hash as a new second argument)
// @ts-expect-error vitepress ships no types for its internals
import { isActive } from 'vitepress/dist/client/shared.js'
// @ts-expect-error vitepress ships no types for its internals
import { getFlatSideBarLinks } from 'vitepress/dist/client/theme-default/support/sidebar.js'
import VPLocalNavOutlineDropdown from 'vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue'
import { computed, onMounted, ref } from 'vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useNavHidden } from '../composables/useNavHidden'
import { cn } from '@/lib/utils'

defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'open-menu'): void
}>()

const { theme, frontmatter, page } = useData<DefaultTheme.Config>()
const { hasSidebar, sidebar } = useSidebar()
const { headers } = useLocalNav()
const { y } = useWindowScroll()
const navHidden = useNavHidden()
const wide = useMediaQuery('(min-width: 960px)')

const navHeight = ref(0)

onMounted(() => {
  navHeight.value = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height'))
})

const empty = computed(() => headers.value.length === 0)
const emptyAndNoSidebar = computed(() => empty.value && !hasSidebar.value)

const section = computed(
  () =>
    theme.value.nav?.find(
      item => 'link' in item && isActive(page.value.relativePath, item.activeMatch || item.link, !!item.activeMatch),
    )?.text,
)

const current = computed(
  () =>
    getFlatSideBarLinks(sidebar.value).find((link: DefaultTheme.SidebarItem) =>
      isActive(page.value.relativePath, link.link),
    )?.text ?? page.value.title,
)
</script>
