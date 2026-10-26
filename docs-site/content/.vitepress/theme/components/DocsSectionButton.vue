<template>
  <RouterLink
    :to="sectionLink"
    class="flex items-center justify-center h-[120px] bg-surface-gray !no-underline hover:bg-surface-gray-hover"
  >
    <span class="text-xl font-semibold tracking-[-0.01em]">{{ sectionName }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ sectionName?: string; sectionLink?: string }>(), {
  sectionName: 'Section Name',
  sectionLink: '#',
})
</script>
