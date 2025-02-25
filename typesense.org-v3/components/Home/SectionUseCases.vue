<script lang="ts" setup>
import ArrowRight from "@/assets/icons/arrow-right.svg";
const usecases = [
  {
    title: "Search As You Type",
    image: "/images/use-cases/search-as-you-type.svg",
  },
  {
    title: "Autocomplete",
    image: "/images/use-cases/autocomplete.svg",
  },
  {
    title: "Faceted Navigation",
    image: "/images/use-cases/faceted-navigation.svg",
  },
  {
    title: "Geo Search",
    image: "/images/use-cases/geo-search.svg",
  },
  {
    title: "Fuzzy Search",
    image: "/images/use-cases/fuzzy-search.svg",
  },
  {
    title: "Vector Search",
    image: "/images/use-cases/vector-search.svg",
  },
  {
    title: "Semantic Search",
    image: "/images/use-cases/semantic-search.svg",
  },
  {
    title: "Recommendations",
    image: "/images/use-cases/recommendations.svg",
  },
  {
    title: "Built-in RAG",
    image: "/images/use-cases/built-in-rag.svg",
  },
  {
    title: "Geo-Distributed Cache",
    image: "/images/use-cases/geo-distributed-cache.svg",
  },
];
</script>

<template>
  <section class="mt-[186px] flex flex-col items-center text-center">
    <Badge>Search meets 2025</Badge>
    <h2>
      Meticulously Engineered For <br />
      <strong>Performance</strong> & <strong>Ease-Of-Use</strong>.
    </h2>
    <div class="usecases mt-8">
      <div
        class="card flex flex-col"
        v-for="usecase in usecases"
        :key="usecase.title"
      >
        <div class="relative flex-1 overflow-hidden">
          <img
            class="absolute top-0 w-full"
            :src="usecase.image"
            alt="usecase.title"
          />
        </div>
        <h3
          class="mt-[17px] font-heading text-lg font-medium leading-[1.2] tracking-[-0.54px]"
        >
          {{ usecase.title }}
        </h3>
      </div>
      <div class="card col-span-2 text-left">
        <p class="mb-3 text-sm leading-[1.8] tracking-tight text-text-muted">
          <span class="text-text-primary"
            ><b class="font-semibold">Typesense</b> is a modern</span
          >, absurdly fast, developer-friendly, open source search engine. Under
          the hood, cutting-edge algorithms squeeze every drop of performance
          from today&rsquo;s modern hardware and machine learning advances.
        </p>
        <div class="flex gap-4">
          <Button>Typesense&rsquo;s use cases <ArrowRight /></Button>
          <Button type="white">Our Mission <ArrowRight /></Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply rounded-2xl p-4;
  box-shadow: -4px 4px 16px 0px rgba(0, 0, 0, 0.07);
}
.usecases {
  @apply grid grid-cols-4 grid-rows-4 gap-4;
}
.card:last-child {
  grid-column: 2 / span 2; /* Start at column 2 and span 2 columns */
}
.card:nth-child(10) {
  grid-row: 3;
  grid-column: 4;
}
</style>
