<script setup>
const integrations = [
  {
    name: "Instant search",
    img: "/images/ui-integrations/instantsearch-logo.svg",
    width: 150,
    link: "https://github.com/typesense/typesense-instantsearch-adapter",
  },
  {
    name: "Docsearch",
    img: "/images/ui-integrations/docsearch-logo.svg",
    width: 150,
    link: "https://github.com/typesense/typesense-docsearch.js",
  },
  {
    name: "Docusaurus",
    img: "/images/ui-integrations/docusaurus-logo.svg",
    width: 150,
    link: "https://github.com/typesense/docusaurus-theme-search-typesense",
  },
];
</script>

<template>
  <section>
    <div class="mb-7 text-center">
      <h2>
        Build <strong>Powerful</strong><br />
        Search Interfaces
      </h2>
      <p class="subtext">Pre-built Search UI integrations</p>
    </div>
    <div class="flex flex-wrap justify-center gap-4 max-sm:gap-2">
      <a
        class="basis-[calc(25%-10.67px)] max-md:basis-[calc(50%-6px)]"
        v-for="item in integrations"
        :key="item.name"
        :href="item.link"
        target="_blank"
        rel="noopener"
      >
        <Card>
          <img :width="item.width" :src="item.img" :alt="item.name" /> </Card
      ></a>
    </div>
  </section>
</template>
