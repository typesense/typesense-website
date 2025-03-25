<template>
  <section class="flex w-full flex-col items-center text-center">
    <h2 class="mb-2 mt-4">
      The <strong>Open Source Alternative</strong> to Algolia
    </h2>
    <p class="subtext">
      It&rsquo;s like Algolia and Pinecone had a baby… that&rsquo;s way easier
      to handle than Elasticsearch and is actually open source.
    </p>
    <div
      class="mt-40 grid w-full grid-cols-3 gap-4 max-sm:mt-8 max-sm:grid-cols-1"
    >
      <div class="card">
        <strong>{{ STATIC.dockerPulls }}</strong>
        <h3>Docker<br />Pulls</h3>
      </div>
      <div class="card !bg-secondary-bg">
        <strong>{{ STATIC.cloudSearchesPerMonth }}</strong>
        <h3>Typesense Cloud <br />Searches per Month</h3>
      </div>
      <div class="card">
        <strong>{{ STATIC.githubStars }}</strong>
        <h3>Github<br />Stars</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply flex flex-col justify-between rounded-3xl bg-bg-gray-1 p-4 text-left font-medium max-sm:!aspect-auto max-sm:flex-row-reverse max-sm:items-center max-sm:rounded-xl max-sm:py-2.5;
  aspect-ratio: 184/133;
}
.card strong {
  @apply text-right font-medium max-sm:!text-[64px] max-sm:!tracking-[-2.56px];
  font-size: 100px;
  letter-spacing: -4px;
}
.card h3 {
  @apply mt-10 font-heading text-2xl max-sm:mt-0 max-sm:!text-[20px];
  line-height: 1.2;
}
</style>
