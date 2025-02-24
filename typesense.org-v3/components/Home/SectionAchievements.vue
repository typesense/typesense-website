<template>
  <section class="flex w-full flex-col items-center pt-32 text-center">
    <h2 class="mb-2 mt-4">
      The <strong>Open Source Alternative</strong> to Algolia
    </h2>
    <p class="subtext">
      It’s like Algolia and Pinecone had a baby… that’s way easier to handle
      than Elasticsearch and is actually open source.
    </p>
    <div class="mt-40 grid w-full grid-cols-3 gap-4">
      <div class="card">
        <strong>14M</strong>
        <h3>Docker<br />Pulls</h3>
      </div>
      <div class="card !bg-secondary-bg">
        <strong>5B</strong>
        <h3>Typesense Cloud <br />Searches per Month</h3>
      </div>
      <div class="card">
        <strong>22K</strong>
        <h3>Github<br />Stars</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply flex flex-col justify-between rounded-3xl bg-bg-gray-1 p-4 text-left font-medium;
  aspect-ratio: 184/133;
}
.card strong {
  @apply text-right;
  font-size: 100px;
}
.card h3 {
  @apply mt-16 font-heading text-2xl;
  line-height: 1.2;
}
</style>
