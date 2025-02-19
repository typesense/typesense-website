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
    class="absolute left-36 right-36 top-4 flex h-14 items-center justify-between rounded-[64px] bg-dark-background pl-8 pr-[10px] text-text-inverted"
  >
    <div>
      <router-link to="/" class="text-xl font-bold text-white"
        ><div class="flex items-center">
          <img
            src="/typesense-icon.svg"
            alt="Typesense"
            class="mr-2 inline-block h-8 w-8"
          />
          <img src="/typesense-logo.svg" alt="" /></div
      ></router-link>
    </div>

    <ul class="flex items-center space-x-8 text-sm">
      <li v-for="item in navLinks" :key="item.link">
        <router-link :to="item.link">{{ item.name }}</router-link>
      </li>
    </ul>

    <button
      class="s rounded-full bg-primary px-4 py-[10px] text-sm font-normal shadow-[-4px_2px_0px_0px_#FFF]"
    >
      Try For Free
    </button>
  </nav>
</template>
