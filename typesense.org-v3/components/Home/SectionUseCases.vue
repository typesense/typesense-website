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
  <section class="flex flex-col items-center text-center">
    <Badge>Search meets 2025</Badge>
    <h2 class="max-sm:hidden">
      Meticulously Engineered For <br />
      <strong>Performance</strong> & <strong>Ease-Of-Use</strong>.
    </h2>
    <h2 class="hidden max-sm:block">
      Meticulously<br />
      <strong
        >Engineered For <br />
        Performance</strong
      >
      &<br />
      Ease-Of-Use.
    </h2>
    <p class="subtext mb-6 hidden !text-[14px] max-sm:block">
      <b class="text-text-primary">Typesense is a modern</b>, blazing-fast,
      developer-friendly, open source search engine. It uses cutting-edge
      algorithms that take advantage of the latest advances in Hardware
      Capabilities & Machine Learning.
    </p>
    <Button link="/about" type="white" class="hidden max-sm:flex"
      >Our Mission <ArrowRight
    /></Button>
    <div class="card-list mt-8 grid-rows-3 text-left max-sm:grid-rows-5">
      <div
        class="card flex flex-col"
        v-for="usecase in usecases"
        :key="usecase.title"
      >
        <div
          class="relative min-h-[104px] flex-1 overflow-hidden max-sm:rounded-t-md"
        >
          <img
            class="absolute top-0 w-full rounded-xl max-sm:min-w-[150%] max-sm:rounded-none"
            :src="usecase.image"
            alt="usecase.title"
          />
        </div>
        <h3
          class="mt-[17px] text-lg leading-[1.2] tracking-[-0.54px] max-md:px-1.5 max-sm:my-2.5 max-sm:!text-[14px]"
        >
          {{ usecase.title }}
        </h3>
      </div>
      <div class="card col-span-2 text-left max-sm:hidden">
        <p class="mb-3 text-sm leading-[1.8] tracking-tight text-text-muted">
          <span class="text-text-primary"
            ><b class="font-semibold">Typesense</b> is a modern</span
          >, absurdly fast, developer-friendly, open source search engine. Under
          the hood, cutting-edge algorithms squeeze every drop of performance
          from today&rsquo;s modern hardware and machine learning advances.
        </p>
        <div class="flex gap-4">
          <Button :link="STATIC.link_use_cases"
            >Typesense&rsquo;s use cases <ArrowRight
          /></Button>
          <Button link="/about" type="white">Our Mission <ArrowRight /></Button>
        </div>
      </div>
    </div>
    <Button :link="STATIC.link_use_cases" class="mt-8 hidden max-sm:flex"
      >Typesense&rsquo;s use cases <ArrowRight
    /></Button>
  </section>
</template>

<style scoped>
.card {
  @apply rounded-2xl p-4 max-sm:rounded-lg max-sm:p-0.5 max-sm:pb-0;
  box-shadow: -4px 4px 16px 0px rgba(0, 0, 0, 0.07);
}
@media (min-width: 640px) {
  .card:last-child {
    grid-column: 2 / span 2; /* Start at column 2 and span 2 columns */
  }
  .card:nth-child(10) {
    grid-row: 3;
    grid-column: 4;
  }
}
</style>
