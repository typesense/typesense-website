<script lang="ts" setup>
import Slack from "@/assets/icons/slack.svg";
import Github from "@/assets/icons/github.svg";
import Linkedin from "@/assets/icons/linkedin.svg";
import X from "@/assets/icons/x.svg";

const runtimeConfig = useRuntimeConfig();
const GITHUB_LINK = "https://github.com/typesense";
const SLACK_LINK = "https://typesense.link/slack-community";
const LINKEDIN_LINK = "https://www.linkedin.com/company/typesense/";
const X_LINK = "https://x.com/typesense";

const pages = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Documentation", link: `${runtimeConfig.public.baseUrl}/docs` },
  { name: "Pricing", link: "https://cloud.typesense.org/pricing" },
  { name: "Typesense Cloud", link: "https://cloud.typesense.org/" },
  { name: "Blog", link: `${runtimeConfig.public.baseUrl}/blog` },
];
const libraries = [
  {
    name: "Javascript Client",
    link: "https://github.com/typesense/typesense-js",
  },
  { name: "PHP Client", link: "https://github.com/typesense/typesense-php" },
  { name: "Ruby Client", link: "https://github.com/typesense/typesense-ruby" },
  { name: "Go Client", link: "https://github.com/typesense/typesense-go" },
  {
    name: "Python Client",
    link: "https://github.com/typesense/typesense-python",
  },
  { name: "Dart Client", link: "https://github.com/typesense/typesense-dart" },
  {
    name: ".Net Client",
    link: "https://github.com/DAXGRID/typesense-dotnet",
  },
  { name: "Java Client", link: "https://github.com/typesense/typesense-java" },
  {
    name: "Swift Client",
    link: "https://github.com/typesense/typesense-swift",
  },
  {
    name: "Clojure Client",
    link: "https://github.com/runeanielsen/typesense-clj",
  },
  {
    name: "Laravel Scout Driver",
    link: "https://laravel.com/docs/11.x/scout#typesense",
  },
  {
    name: "Wordpress Plugin",
    link: "https://wordpress.org/plugins/search-with-typesense/?ref=typesense",
  },
  {
    name: "Tooljet Extension",
    link: "https://tooljet.com/?ref=typesense",
  },
  {
    name: "Gatsby Plugin",
    link: "https://github.com/typesense/gatsby-plugin-typesense",
  },
  {
    name: "Instantsearch.js adapter",
    link: "https://github.com/typesense/typesense-instantsearch-adapter",
  },
  {
    name: "Documentation Search",
    link: "https://github.com/typesense/typesense-docsearch.js",
  },
  {
    name: "Docusaurus Search Theme",
    link: "https://github.com/typesense/docusaurus-theme-search-typesense",
  },
  {
    name: "Firebase Extension",
    link: "https://firebase.google.com/products/extensions/typesense-firestore-typesense-search",
  },
];

const supportLinks = [
  { name: "Contact Us", link: "/support" },
  { name: "Prioritized Support", link: "/support" },
  {
    name: "Algolia vs Elasticsearch vs Typesense",
    link: "/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/",
  },
  { name: "Slack Community", link: "https://typesense.link/slack-community" },
  { name: "Community Threads ", link: "https://threads.typesense.org/" },
];
</script>

<template>
  <FooterSectionCTA />
  <footer
    class="w-full bg-bg px-16 pt-[67px] text-sm text-text-muted max-md:px-10 max-md:pt-8"
  >
    <div class="mb-14 flex gap-24 max-md:mb-8 max-md:flex-col max-md:gap-10">
      <div class="flex flex-col justify-between gap-10">
        <div>
          <div class="mb-3 max-md:mb-4">
            <Logo />
          </div>
          <div>
            Fast, open source, typo-tolerant <br />
            search engine
          </div>
        </div>
        <div>
          <h5>Typesense, Inc.</h5>
          <div class="text-nowrap leading-[1.6]">
            Houston, TX <br /><a
              href="https://twitter.com/typesense"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors duration-200 hover:text-text-primary"
              >@typesense</a
            >
            |
            <a
              href="mailto:contact@typesense.org"
              target="_blank"
              class="transition-colors duration-200 hover:text-text-primary"
              >contact@typesense.org</a
            >
          </div>
        </div>
      </div>
      <div
        class="flex w-full justify-evenly gap-20 max-md:flex-col max-md:gap-10"
      >
        <div>
          <h5>Page</h5>
          <div class="gap-6 max-md:flex">
            <ul>
              <li v-for="page in pages.slice(0, 3)" :key="page.name">
                <CustomLink
                  :to="page.link"
                  class="transition-all duration-200 hover:text-text-primary hover:underline"
                  >{{ page.name }}</CustomLink
                >
              </li>
            </ul>
            <ul class="md:mt-3">
              <li v-for="page in pages.slice(3, undefined)" :key="page.name">
                <CustomLink
                  :to="page.link"
                  class="transition-all duration-200 hover:text-text-primary hover:underline"
                  >{{ page.name }}</CustomLink
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="col-span-2">
          <h5>Libraries</h5>
          <div class="flex gap-6 text-nowrap">
            <ul>
              <li
                v-for="item in libraries.slice(undefined, 9)"
                :key="item.name"
              >
                <a
                  :href="item.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="transition-all duration-200 hover:text-text-primary hover:underline"
                  >{{ item.name }}</a
                >
              </li>
            </ul>
            <ul>
              <li v-for="item in libraries.slice(9)" :key="item.name">
                <a
                  :href="item.link"
                  target="_blank"
                  class="transition-all duration-200 hover:text-text-primary hover:underline"
                  rel="noopener noreferrer"
                  >{{ item.name }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h5>Support</h5>
          <ul>
            <li v-for="item in supportLinks" :key="item.name">
              <CustomLink
                :to="item.link"
                class="transition-all duration-200 hover:text-text-primary hover:underline"
                >{{ item.name }}</CustomLink
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between gap-8 border-t-2 border-t-muted py-5 max-md:flex-col-reverse"
    >
      <div class="text-sm max-md:text-center">
        Typesense® is a registered trademark of Typesense, Inc.
      </div>

      <div class="mr-2.5 flex gap-2.5">
        <SocialLink :link-to="GITHUB_LINK">
          <Github />
        </SocialLink>
        <SocialLink :accent="true" :link-to="SLACK_LINK">
          <Slack />
        </SocialLink>
        <SocialLink :link-to="LINKEDIN_LINK">
          <Linkedin />
        </SocialLink>
        <SocialLink :link-to="X_LINK">
          <X />
        </SocialLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
h5 {
  @apply mb-3 text-base font-medium text-text-primary max-md:mb-3;
}
ul {
  @apply flex flex-col gap-3;
}
li {
  min-width: 14ch;
}
</style>
