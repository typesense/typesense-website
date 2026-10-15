<template>
  <a :href="href"><slot /></a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

// vitepress ships no RouterLink, but hijacks clicks on internal <a> elements
// for spa navigation, which a base-aware anchor is enough to reach
const props = defineProps<{ to: string }>()

const href = computed(() => {
  const to = props.to || ''
  if (/^(https?:)?\/\//.test(to) || to.startsWith('#') || to.startsWith('mailto:')) return to
  return withBase(to)
})
</script>
