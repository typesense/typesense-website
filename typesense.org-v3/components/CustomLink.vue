<script lang="ts" setup>
const { to } = defineProps<{
  to: string;
}>();
</script>
<template>
  <NuxtLink v-if="to.startsWith('/')" :to="to"><slot></slot></NuxtLink>
  <a v-else :href="to" target="_blank" rel="noopener noreferrer"
    ><slot></slot
  ></a>
</template>
