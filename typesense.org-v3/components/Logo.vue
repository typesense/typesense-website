<script setup lang="ts">
const { dark = false } = defineProps<{
  dark: boolean;
}>();
</script>
<template>
  <NuxtLink to="/">
    <img
      :src="dark ? '/typesense-logo-dark.svg' : '/typesense-logo.svg'"
      class="w-[138px]"
      alt="Typesense logo"
    />
  </NuxtLink>
</template>
