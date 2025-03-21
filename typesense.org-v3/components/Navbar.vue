<script setup>
import Hamburger from "@/assets/icons/hamburger.svg";
import CloseSquare from "@/assets/icons/close-square.svg";
import Illustration from "@/assets/images/mobile-nav-background.svg";
import { ref } from "vue";

const navLinks = ref([
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Docs", link: "/docs" },
  { name: "Downloads", link: "/downloads" },
  { name: "Roadmap", link: "https://github.com/orgs/typesense/projects/1" },
  {
    name: "Typesense Cloud",
    link: "https://cloud.typesense.org/",
  },
  { name: "Blog", link: "/blog" },
  { name: "Support", link: "/support" },
]);

let isActive = ref(false);
const toggle = () => {
  isActive.value = !isActive.value;
};
const hideNav = () => {
  isActive.value = false;
};
</script>
<template>
  <div
    class="header fixed top-0 z-50 overflow-hidden rounded-3xl pt-4 backdrop-blur-md max-md:!left-0 max-md:!right-0 max-md:overflow-visible max-md:rounded-none max-md:p-0"
  >
    <nav
      class="flex h-14 w-full items-center justify-between rounded-[64px] bg-dark-bg pl-8 pr-[10px] font-light text-text-inverted max-md:rounded-none max-md:bg-bg max-md:px-4"
    >
      <Logo class="md:text-white" />
      <div
        :class="{ active: isActive }"
        class="dropdown inset-0 text-sm text-text-inverted max-md:fixed max-md:h-screen max-md:bg-primary max-md:px-4 max-md:text-base max-md:[clip-path:inset(0%_0%_0%_100%)]"
      >
        <div class="mb-8 hidden h-14 items-center justify-between max-md:flex">
          <Logo class="text-white" />
          <button @click="toggle">
            <CloseSquare />
          </button>
        </div>
        <ul
          class="flex items-center gap-8 max-md:flex-col max-md:items-start max-md:gap-4"
        >
          <li @click="hideNav" v-for="item in navLinks" :key="item.link">
            <CustomLink :to="item.link">{{ item.name }}</CustomLink>
          </li>
        </ul>
        <Illustration class="show-md absolute bottom-0 right-0" />
      </div>
      <button
        class="flex items-center gap-2 rounded-full bg-primary px-4 py-[10px] text-sm font-normal tracking-[-0.32px] text-white shadow-[-4px_2px_0px_0px] shadow-bg max-md:hidden"
      >
        Try For Free
      </button>
      <button class="show-md" @click="toggle">
        <Hamburger />
      </button>
    </nav>
  </div>
</template>

<style scoped>
.dropdown {
  transition: clip-path 0.5s cubic-bezier(0.65, 0.72, 0, 1);
}
.dropdown.active {
  clip-path: inset(0% 0% 0% 0%);
}
.header {
  left: var(--site-padding);
  right: var(--site-padding);
}
</style>
