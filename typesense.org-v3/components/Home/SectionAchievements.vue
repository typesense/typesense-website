<template>
  <section class="flex w-full flex-col items-center text-center">
    <h2 class="mt-4">
      The <strong>Open Source Alternative</strong> to Algolia
    </h2>
    <h2 class="mb-2 mt-2">
      The <strong>Easier-to-Use Alternative</strong> to Elasticsearch
    </h2>
    <p class="subtext">
      It&rsquo;s like Algolia and Pinecone had a baby… that&rsquo;s way easier
      to handle than Elasticsearch and is actually open source.
    </p>
    <div
      class="mt-40 grid w-full grid-cols-3 gap-4 max-md:mt-8 max-md:grid-cols-1"
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
  @apply flex flex-col justify-between rounded-3xl bg-bg-gray-1 p-4 text-left font-medium max-md:flex-row-reverse max-md:items-center max-md:rounded-xl max-md:py-2.5;
}
.card strong {
  @apply text-right font-medium max-lg:!text-[80px] max-md:!text-[64px] max-md:!tracking-[-2.56px];
  font-size: 100px;
  letter-spacing: -4px;
}
.card h3 {
  @apply mt-10 font-heading text-2xl max-lg:mt-6 max-lg:!text-[20px] max-md:mt-0;
  line-height: 1.2;
}
</style>
