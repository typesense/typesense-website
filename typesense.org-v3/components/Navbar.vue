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
  <div
    class="header fixed top-0 z-10 overflow-hidden rounded-3xl pt-4 backdrop-blur-md"
  >
    <nav
      class="flex h-14 w-full items-center justify-between rounded-[64px] bg-dark-bg pl-8 pr-[10px] font-light text-text-inverted"
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
      <button
        class="flex items-center gap-2 rounded-full bg-primary px-4 py-[10px] text-sm font-normal tracking-[-0.32px] text-white shadow-[-4px_2px_0px_0px] shadow-bg"
      >
        Try For Free
      </button>
    </nav>
  </div>
</template>

<style scoped>
.header {
  --margin: calc(var(--site-margin) + 24px);
  left: var(--margin);
  right: var(--margin);
}
</style>
