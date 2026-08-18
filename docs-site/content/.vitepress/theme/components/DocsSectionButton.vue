<template>
  <RouterLink
    :to="sectionLink"
    class="flex items-center justify-center h-[120px] bg-surface-gray hover:bg-surface-gray-hover"
  >
    <h3>{{ sectionName }}</h3>
  </RouterLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ sectionName?: string; sectionLink?: string }>(), {
  sectionName: 'Section Name',
  sectionLink: '#',
})
</script>
