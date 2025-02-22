<script setup>
const navLinks = ref([
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Docs", link: "/docs" },
  { name: "Downloads", link: "/downloads" },
  { name: "Roadmap", link: "/roadmap" },
  { name: "Typesense Cloud", link: "/cloud" },
  { name: "Blog", link: "/blog" },
  { name: "Support", link: "/support" },
]);
</script>
<template>
  <nav
    class="bg-dark-bg absolute left-36 right-36 top-4 flex h-14 items-center justify-between rounded-[64px] pl-8 pr-[10px] font-light text-text-inverted"
  >
    <div>
      <NuxtLink to="/" class="text-xl font-bold text-white"
        ><div class="flex items-center">
          <img
            src="/typesense-icon.svg"
            alt="Typesense"
            class="mr-2 inline-block h-8 w-8"
          />
          <img src="/typesense-logo.svg" alt="" /></div
      ></NuxtLink>
    </div>

    <ul class="flex items-center space-x-8 text-sm">
      <li v-for="item in navLinks" :key="item.link">
        <NuxtLink :to="item.link">{{ item.name }}</NuxtLink>
      </li>
    </ul>

    <Button> Try For Free </Button>
  </nav>
</template>
