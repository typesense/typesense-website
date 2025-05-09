<script setup lang="ts">
const features = [
  {
    name: "Typo Tolerance",
    image: "/images/features/typo-tolerance.svg",
    description:
      "Spellng Mistakes? Not a problem. Typesense automatically tries to correct typos.",
    icon: "/images/features/typography.svg",
    link: "https://typesense.org/docs/latest/api/search.html#typo-tolerance-parameters",
  },
  {
    name: "Tunable Ranking",
    image: "/images/features/tunable-ranking.svg",
    description:
      "Tailor your results to perfection via flexible and fast query-time ranking.",
    icon: "/images/features/leaderboard.svg",
    link: "https://typesense.org/docs/guide/ranking-and-relevance.html",
  },
  {
    name: "Synonyms",
    image: "/images/features/synonyms.svg",
    description:
      "Banish “pants vs. trousers” confusion. Map related terms so users always find what they’re after.",
    icon: "/images/features/circles.svg",
    link: "https://typesense.org/docs/latest/api/synonyms.html",
  },
  {
    name: "Multi-Tenant API Keys",
    image: "/images/features/multi-tenant-api-keys.svg",
    description:
      "Manage data for multiple users in a single collection, and manage aCLs for them within Typesense.",
    icon: "/images/features/door-key.svg",
    link: "https://typesense.org/docs/latest/api/api-keys.html",
  },
  {
    name: "Dynamic Sorting",
    image: "/images/features/dynamic-sorting.svg",
    description:
      "Let users reorder results on the fly at Runtime, without having to duplicate data.",
    icon: "/images/features/sort-arrow.svg",
    link: "https://typesense.org/docs/latest/api/search.html#sort-results",
  },
  {
    name: "Merchandising",
    image: "/images/features/merchandising.svg",
    description:
      "Pin specific records in a particular position to feature or merchandize them.",
    icon: "/images/features/paper-pin.svg",
    link: "https://typesense.org/docs/guide/ranking-and-relevance.html#promoting-or-hiding-results-merchandising",
  },
  {
    name: "Grouping & Distinct",
    image: "/images/features/grouping-and-distinct.svg",
    description:
      "Prevent duplicate overload. Group Similar Variants and keep your Results neat and tidy.",
    icon: "/images/features/list.svg",
    link: "https://typesense.org/docs/latest/api/search.html#group-results",
  },
  {
    name: "Filtering & Faceting",
    image: "/images/features/filtering-and-faceting.svg",
    description:
      "Empower users to slice and dice results by Attributes. Quick and precise.",
    icon: "/images/features/sort.svg",
    link: "https://typesense.org/docs/latest/api/search.html#filter-results",
  },
  {
    name: "Geo Search",
    image: "/images/features/geo-search.svg",
    description:
      "Serve up location-based results. Perfect for local listings, store finders, or city-specific content.",
    icon: "/images/features/geotargeting.svg",
    link: "https://typesense.org/docs/latest/api/geosearch.html",
  },
  {
    name: "Federated Search",
    image: "/images/features/federated-search.svg",
    description:
      "Aggregate data from multiple sources into one search box. One query, many streams of information.",
    icon: "/images/features/emblem.svg",
    link: "https://typesense.org/docs/latest/api/federated-multi-search.html",
  },
  {
    name: "Vector & Semantic Search",
    image: "/images/features/vector-semantic-search.svg",
    description:
      "Go beyond keywords. Match the meaning behind each query and deliver eerily accurate results.",
    icon: "/images/features/semantic.svg",
    link: "https://typesense.org/docs/latest/api/vector-search.html",
  },
  {
    name: "Easy High Availability",
    image: "/images/features/easy-high-availability.svg",
    description:
      "Stay online, even when hardware hiccups happen. replication keeps your search up and running.",
    icon: "/images/features/ok.svg",
    link: "https://typesense.org/docs/guide/high-availability.html",
  },
];
</script>

<template>
  <section class="card-list">
    <div
      class="col-span-2 mb-3.5 flex flex-col max-md:items-center max-sm:mb-5 max-sm:text-center"
    >
      <Badge
        ><span class="max-sm:hidden">Neatly WRAPPED in a RESTful API</span>
        <span class="show-sm">Typesense</span></Badge
      >
      <h2>
        Features <strong>you&rsquo;ll <br />Love</strong>, minus the<br />
        complexity
      </h2>
    </div>

    <CustomLink
      class="h-full"
      v-for="item in features"
      :key="item.name"
      :to="item.link"
    >
      <Card
        class="!h-full p-4 max-sm:bg-bg max-sm:p-0.5 max-sm:pb-2.5 max-sm:shadow-[-4px_4px_16px_0px_rgba(0,_0,_0,_0.07)]"
      >
        <div class="flex h-full w-full flex-col">
          <div
            class="relative aspect-[40/17] overflow-hidden max-sm:aspect-auto max-sm:h-[108px]"
          >
            <img
              class="absolute w-full rounded-2xl max-sm:min-w-[145%] max-sm:rounded-md"
              :src="item.image"
              :alt="item.name"
            />
            <div
              class="absolute right-0 top-0 grid size-12 place-items-center rounded-xl bg-secondary"
            >
              <img :src="item.icon" alt="" />
            </div>
          </div>
          <div class="mt-4 max-sm:mx-1.5 max-sm:mt-2.5">
            <h3>{{ item.name }}</h3>
            <p class="subtext !text-[14px] max-sm:mt-1 max-sm:!text-[12px]">
              {{ item.description }}
            </p>
          </div>
        </div>
      </Card>
    </CustomLink>
    <div id="empty" class="max-sm:hidden"></div>

    <CustomLink
      to="https://typesense.org/docs/overview/features.html"
      class="relative rounded-2xl bg-secondary p-4 max-lg:hidden"
    >
      <h3 class="!text-2xl !tracking-[-0.72px]">Typesense <br />Features</h3>
      <img
        class="absolute bottom-0 right-0"
        src="/images/features/tasks-checked.svg"
        alt="Typesense Features"
      />
    </CustomLink>
  </section>
</template>

<style scoped>
#empty {
  grid-row: 2;
  grid-column: 1;
}

h3 {
  @apply text-[18px] tracking-[-0.54px] max-sm:!text-[14px];
}
</style>
