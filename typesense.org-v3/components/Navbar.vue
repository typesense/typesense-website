<script setup>
import Hamburger from "@/assets/icons/hamburger.svg";
import CloseSquare from "@/assets/icons/close-square.svg";
import Illustration from "@/assets/images/mobile-nav-background.svg";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isActivePage = (path) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const navLinks = ref([
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Docs", link: "https://typesense.org/docs" },
  { name: "Downloads", link: "/downloads" },
  { name: "Roadmap", link: "https://github.com/orgs/typesense/projects/1" },
  {
    name: "Typesense Cloud",
    link: "https://cloud.typesense.org/",
  },
  { name: "Blog", link: "https://typesense.org/blog" },
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
    class="fixed top-0 z-50 w-screen overflow-hidden rounded-b-3xl pt-4 max-lg:!left-0 max-lg:!right-0 max-lg:overflow-visible max-lg:rounded-none max-lg:p-0 lg:pb-8"
  >
    <nav
      class="group container mx-auto flex h-14 items-center justify-between rounded-[64px] bg-dark-bg pl-8 pr-[10px] font-light text-text-inverted max-lg:rounded-none max-lg:bg-bg max-lg:px-4 lg:w-[95%] lg:shadow-lg lg:shadow-black/20 xl:max-w-6xl"
    >
      <Logo class="w-[30%] max-lg:hidden" dark />
      <Logo class="show-lg" />
      <div
        :class="{ active: isActive }"
        class="slide inset-0 text-sm text-text-inverted max-lg:fixed max-lg:h-screen max-lg:bg-primary max-lg:px-4 max-lg:text-base max-lg:[clip-path:inset(0%_0%_0%_100%)]"
      >
        <div class="mb-8 hidden h-14 items-center justify-between max-lg:flex">
          <Logo dark />
          <button @click="toggle">
            <CloseSquare />
          </button>
        </div>
        <ul
          class="flex items-center gap-4 max-lg:flex-col max-lg:items-start xl:gap-8 md:mr-8"
        >
          <li
            :class="[
              'transition-colors hover:text-secondary whitespace-nowrap',
              { 'text-secondary': isActivePage(item.link) },
            ]"
            @click="hideNav"
            v-for="item in navLinks"
            :key="item.link"
          >
            <CustomLink :to="item.link" class="text-sm">
              {{ item.name }}
            </CustomLink>
          </li>
        </ul>
        <Illustration class="max-lg:block hidden absolute bottom-0 right-0" />
      </div>
      <CustomLink
        :to="STATIC.link_get_started"
        class="flex h-full items-center justify-end lg:w-[15%]"
      >
        <button
          class="flex items-center gap-2 rounded-full bg-primary px-2 py-2 text-xs font-normal tracking-[-0.32px] text-white transition-colors hover:bg-primary/80 max-lg:hidden lg:px-4 lg:text-sm whitespace-nowrap shadow-[-4px_2px_0px_0px] shadow-bg"
        >
          Quick Start
        </button>
      </CustomLink>
      <button class="show-lg" @click="toggle">
        <Hamburger />
      </button>
    </nav>
  </div>
</template>

<style scoped>
.slide {
  transition: clip-path 0.5s cubic-bezier(0.65, 0.72, 0, 1);
}
.slide.active {
  clip-path: inset(0% 0% 0% 0%);
}
.header {
  --padding: calc((100vw - 1440px) / 2 + var(--site-padding) - 8px);
  left: var(--padding);
  right: var(--padding);
}
</style>
