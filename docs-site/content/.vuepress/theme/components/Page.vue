<template>
  <main class="page">
    <slot name="top" />

    <Content class="theme-default-content" />

    <PageNav v-bind="{ sidebarItems }" />

    <PageContrib />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageNav from '@parent-theme/components/PageNav.vue'
import PageContrib from './PageContrib.vue'

export default {
  components: { PageNav, PageContrib },
  props: ['sidebarItems'],
}
</script>

<style lang="stylus">
.page
  display flex
  flex-direction column
  min-height 100vh

  > *
    flex-shrink 0
    width 100%

  .page-contrib-wrapper
    margin-top auto
</style>
