<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <NuxtLayout name="default">
    <div class="site-padding flex h-[80vh] flex-col justify-center">
      <div>
        <h2>We couldn't find that page</h2>
        <NuxtLink class="underline underline-offset-2" to="/">Go home</NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
