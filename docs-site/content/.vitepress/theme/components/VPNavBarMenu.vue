<template>
  <nav aria-labelledby="main-nav-aria-label" class="VPNavBarMenu hidden min-[768px]:flex">
    <span id="main-nav-aria-label" class="sr-only">Main Navigation</span>
    <VPNavBarMenuLink v-for="item in links" :key="item.text" :item="item" />
  </nav>
</template>

<script setup lang="ts">
import VPNavBarMenuLink from 'vitepress/dist/client/theme-default/components/VPNavBarMenuLink.vue'
import { useNavLinks } from '../composables/useNavLinks'

const links = useNavLinks()
</script>
