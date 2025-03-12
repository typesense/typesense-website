<script lang="ts" setup>
import Dots from "@/assets/images/dots.svg";
import ArrowRight from "@/assets/icons/arrow-right.svg";
import Check from "@/assets/icons/check.svg";
import Cross from "@/assets/icons/cross.svg";
import BlankTableIllustration from "@/assets/images/blank-table-illustration.svg";
</script>
<template>
  <section
    class="full-bleed flex flex-col items-center bg-secondary-bg pt-14 text-center"
  >
    <h2>
      Compare Algolia vs ElasticSearch <br />
      vs Meilisearch vs
      <strong>Typesense</strong>
    </h2>
    <p class="subtext mb-[55px] mt-2 text-base !text-text-primary max-sm:mb-6">
      <span class="max-sm:hidden">
        We&rsquo;ve compiled a side-by-side chart from each engine&rsquo;s
        official docs - no spin, just the raw data.
      </span>
      <span class="hidden max-sm:block"
        >This table is meant to give you an objective side-by-side comparison of
        key features in each search engine and is based on each search engine's
        documentation.</span
      >
    </p>
    <Button type="white">See More <ArrowRight /></Button>
    <div
      class="card relative mb-[-6px] mt-6 w-[832px] rounded-t-3xl bg-bg-gray-2 px-4 pt-4 max-sm:w-full"
    >
      <Dots />
      <table class="mt-2.5 w-full text-sm leading-[1.1] tracking-tight">
        <thead class="bg-blue-in-green text-text-inverted">
          <tr>
            <th class="rounded-l-xl py-3 pl-4 text-left">Features</th>
            <th>Typesense</th>
            <th>Algolia</th>
            <th class="py-3">ElasticSearch</th>
            <th class="rounded-r-xl">Meilisearch</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>REST API</td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
          </tr>
          <tr>
            <td>Scoped API Keys & Multi-tenant indices</td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
          </tr>
          <tr>
            <td>Query Field Weights & Boosting</td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
          </tr>
          <tr>
            <td>JOINs across multiple indices</td>
            <td>
              <div class="grid place-items-center">
                <Check />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
            <td>
              <div class="grid place-items-center">
                <Cross />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <BlankTableIllustration
        class="absolute bottom-[-4%] left-[-26%] z-[-1] rotate-[-3.185deg] scale-x-[-1]"
      />
      <BlankTableIllustration
        class="absolute bottom-[-3%] right-[-28%] z-[-1] rotate-[7.754deg]"
      />
    </div>
  </section>
</template>

<style scoped>
.full-bleed {
  @apply shadow-[0_0_0_100vmax] shadow-secondary-bg;
  clip-path: inset(0 -100vmax);
}
.card {
  box-shadow: -5.05px 4.04px 34.34px 0px rgba(0, 0, 0, 0.1);
}
table {
  border-collapse: separate;
  border-spacing: 0 6px;
}
td,
th {
  width: 18%;
}
th {
  @apply font-medium;
}
tbody tr {
  @apply bg-bg;
}
tbody tr td:first-child {
  @apply h-[57px] max-w-32 rounded-l-xl px-4 py-3 text-left;
  width: 28%;
}
tbody tr td:last-child {
  @apply rounded-r-xl;
}
@media not all and (min-width: 640px) {
  td:nth-child(1),
  th:nth-child(1),
  td:last-child,
  th:last-child {
    display: none;
  }
  td:nth-child(2),
  th:nth-child(2) {
    @apply rounded-l-xl;
  }
  td:nth-child(4),
  th:nth-child(4) {
    @apply rounded-r-xl;
  }
  td {
    @apply py-5;
  }
}
</style>
