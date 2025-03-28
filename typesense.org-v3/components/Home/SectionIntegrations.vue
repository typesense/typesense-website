<script lang="ts" setup>
const platforms = [
  {
    name: "Laravel",
    image: "/images/platforms/laravel-logolockup-rgb-red.svg",
    link: "https://laravel.com/docs/11.x/scout#typesense",
    width: 155,
  },
  {
    name: "Symfony",
    image: "/images/platforms/symfony.svg",
    link: "https://github.com/acseo/TypesenseBundle",
    width: 125,
  },
  {
    name: "Gatsby",
    image: "/images/platforms/gatsby.svg",
    link: "https://github.com/typesense/gatsby-plugin-typesense",
    width: 125,
  },
  {
    name: "Firebase",
    image: "/images/platforms/firebase.svg",
    link: "https://firebase.google.com/products/extensions/typesense-firestore-typesense-search",
    width: 125,
  },
  {
    name: "Wordpress",
    image: "/images/platforms/wordpress.svg",
    link: "https://wordpress.org/plugins/search-with-typesense/?ref=typesense",
    width: 125,
  },
  {
    name: "Langchain",
    image: "/images/platforms/langchain.svg",
    link: "https://python.langchain.com/en/latest/modules/indexes/vectorstores/examples/typesense.html?ref=typesense",
    width: 125,
  },
  {
    name: "Craft CMS",
    image: "/images/platforms/craft-cms.svg",
    link: "https://plugins.craftcms.com/typesense",
    width: 125,
  },
  {
    name: "Plone",
    image: "/images/platforms/plone.svg",
    link: "https://pypi.org/project/zopyx.typesense/",
    width: 125,
  },
  {
    name: "Prepr",
    image: "/images/platforms/prepr.svg",
    link: "https://docs.prepr.io/integrations/typesense",
    width: 80,
  },
  {
    name: "Woocommerce",
    image: "/images/platforms/woocommerce.svg",
    link: "https://www.codemanas.com/downloads/typesense-search-for-woocommerce/?ref=typesense",
    width: 80,
  },
  {
    name: "Magento",
    image: "/images/platforms/magento.svg",
    link: "https://typesense.org/docs/latest/api/api-clients.html#ecommerce",
    width: 125,
  },
  {
    name: "Tooljet",
    image: "/images/platforms/tooljet.svg",
    link: "https://tooljet.com/?ref=typesense",
    width: 125,
  },
];
</script>
<template>
  <section>
    <div class="mb-7 text-center">
      <h2>
        <strong>Effortless</strong> Platform<br />
        Integrations
      </h2>
      <p class="subtext">
        CMS, E-Commerce, Dev Platforms and more.<span class="max-sm:hidden">
          Plug and Go.</span
        >
      </p>
    </div>
    <div class="card-list mt-4 max-md:mt-8">
      <a
        v-for="item in platforms"
        :key="item.name"
        :href="item.link"
        target="_blank"
        rel="noopener"
      >
        <Card
          ><img :width="item.width" :src="item.image" :alt="item.name"
        /></Card>
      </a>
    </div>
  </section>
</template>
