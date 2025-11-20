<template>
  <main class="page">
    <slot name="top" />

    <CopyMarkdownButton />
    <Content class="theme-default-content" />

    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@parent-theme/components/PageEdit.vue'
import PageNav from '@parent-theme/components/PageNav.vue'
import CopyMarkdownButton from '../../components/CopyMarkdownButton.vue'

export default {
  components: { PageEdit, PageNav, CopyMarkdownButton },
  props: ['sidebarItems'],
}
</script>
