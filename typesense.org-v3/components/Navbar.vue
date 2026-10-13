<script setup>
import Hamburger from "@/assets/icons/hamburger.svg";
import CloseSquare from "@/assets/icons/close-square.svg";
import Illustration from "@/assets/images/mobile-nav-background.svg";
import Slack from "@/assets/icons/slack.svg";
import Github from "@/assets/icons/github.svg";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const SLACK_LINK = "https://typesense.link/slack-community";
const GITHUB_LINK = "https://github.com/typesense/typesense";

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
  { name: "GitHub", link: GITHUB_LINK, mobileOnly: true },
  { name: "Slack Community", link: SLACK_LINK, mobileOnly: true },
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
    class="fixed top-0 z-50 w-screen overflow-hidden rounded-b-3xl pt-4 max-md:!left-0 max-md:!right-0 max-md:overflow-visible max-md:rounded-none max-md:p-0 md:pb-8"
  >
    <nav
      class="group mx-auto flex h-14 items-center justify-between rounded-[64px] bg-dark-bg pl-8 pr-[10px] font-light text-text-inverted max-md:rounded-none max-md:bg-bg max-md:px-[--site-padding] md:w-[95%] md:shadow-lg md:shadow-black/20 lg:max-w-6xl"
    >
      <Logo class="max-md:hidden md:mr-4 md:w-[15%]" dark />
      <Logo class="show-md" />
      <div
        :class="{ active: isActive }"
        class="slide inset-0 text-sm text-text-inverted max-md:fixed max-md:h-screen max-md:bg-primary max-md:px-[--site-padding] max-md:text-base max-md:[clip-path:inset(0%_0%_0%_100%)]"
      >
        <div class="mb-8 hidden h-14 items-center justify-between max-md:flex">
          <Logo dark />
          <button @click="toggle">
            <CloseSquare />
          </button>
        </div>
        <ul
          class="flex items-center gap-4 max-[886px]:gap-3.5 max-md:flex-col max-md:items-start xl:gap-8"
        >
          <li
            :class="[
              'transition-colors hover:text-secondary',
              {
                'text-secondary': isActivePage(item.link),
                'md:hidden': item.mobileOnly,
              },
            ]"
            @click="hideNav"
            v-for="item in navLinks"
            :key="item.link"
          >
            <CustomLink
              :to="item.link"
              class="whitespace-nowrap text-sm max-[886px]:text-xs"
            >
              {{ item.name }}
            </CustomLink>
          </li>
        </ul>
        <Illustration class="show-md absolute bottom-0 right-0" />
      </div>
      <div
        class="flex h-full shrink-0 items-center justify-end gap-1"
      >
        <CustomLink
          :to="GITHUB_LINK"
          aria-label="Typesense on GitHub"
          title="GitHub"
          class="flex p-2 transition-colors hover:text-secondary max-md:hidden"
        >
          <Github />
        </CustomLink>
        <CustomLink
          :to="SLACK_LINK"
          aria-label="Join the Typesense Slack community"
          title="Slack Community"
          class="mr-3 flex p-2 transition-colors hover:text-secondary max-md:hidden"
        >
          <Slack />
        </CustomLink>
        <CustomLink :to="STATIC.link_get_started" class="flex h-full items-center">
          <button
            class="flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-2 py-2 text-sm font-normal tracking-[-0.32px] text-white shadow-[-4px_2px_0px_0px] shadow-bg transition-colors hover:bg-primary/80 max-[886px]:!text-xs max-md:hidden lg:px-4 lg:text-sm"
          >
            Quick Start
          </button>
        </CustomLink>
      </div>
      <button class="show-md" @click="toggle">
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
</style>
