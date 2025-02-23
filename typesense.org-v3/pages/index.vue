import { _0 } from '../.nuxt/types/tailwind.config'; import { SearchDemo } from
'../.nuxt/components';
<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>

<template>
  <section class="flex w-full flex-col items-center pt-32 text-center">
    <Badge>NO PHD REQUIRED</Badge>
    <h1 class="mb-2 mt-4 font-heading text-[56px] leading-[1.2]">
      Lightning fast, <br /><strong>Open Source </strong>Search
    </h1>
    <p class="mb-14 text-text-muted">
      Cutting-edge, in-memory search engine for mere mortals. Knowledge of
      rocket science optional.
    </p>

    <SearchDemo />
  </section>
  <section class="flex w-full flex-col items-center pt-32 text-center">
    <h1 class="mb-2 mt-4">
      The <strong>Open Source Alternative</strong> to Algolia
    </h1>
    <p class="text-text-muted">
      It’s like Algolia and Pinecone had a baby… that’s way easier to handle
      than Elasticsearch and is actually open source.
    </p>
    <div class="mt-16 mt-40 grid w-full grid-cols-3 gap-4">
      <div class="card">
        <strong>14M</strong>
        <h2>Docker<br />Pulls</h2>
      </div>
      <div class="card !bg-secondary-bg">
        <strong>5B</strong>
        <h2>Typesense Cloud <br />Searches per Month</h2>
      </div>
      <div class="card">
        <strong>22K</strong>
        <h2>Github<br />Stars</h2>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply bg-bg-gray-1 flex flex-col justify-between rounded-3xl p-4 text-left font-medium;
  aspect-ratio: 184/133;
}
.card strong {
  @apply text-right;
  font-size: 100px;
}
.card h2 {
  @apply mt-16 font-heading text-2xl;
  line-height: 1.2;
}
</style>
