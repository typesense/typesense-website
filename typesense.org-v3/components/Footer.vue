<script setup>
import Slack from "@/assets/icons/slack.svg";
import Github from "@/assets/icons/github.svg";
import Linkedin from "@/assets/icons/linkedin.svg";
import X from "@/assets/icons/x.svg";

const GITHUB_LINK = "https://github.com/typesense";
const SLACK_LINK = "https://typesense.link/slack-community";
const LINKEDIN_LINK = "https://www.linkedin.com/company/typesense/";
const X_LINK = "https://x.com/typesense";

const pages = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Documentation", link: "/docs" },
  { name: "Pricing", link: "/pricing" },
  { name: "Typesense Cloud", link: "/pricing" },
  { name: "Blog", link: "/blog" },
];
const libraries = [
  { name: "Javascript Client", link: "/javascript-client" },
  { name: "PHP Client", link: "/php-client" },
  { name: "Ruby Client", link: "/ruby-client" },
  { name: "Go Client", link: "/go-client" },
  { name: "Python Client", link: "/python-client" },
  { name: "Dart Client", link: "/dart-client" },
  { name: ".Net Client", link: "/dotnet-client" },
  { name: "Java Client", link: "/java-client" },
  { name: "Swift Client", link: "/swift-client" },
  { name: "Clojure Client", link: "/clojure-client" },
  { name: "Laravel Scout Driver", link: "/laravel-scout-driver" },
  { name: "Wordpress Plugin", link: "/wordpress-plugin" },
  { name: "Tooljet Extension", link: "/tooljet-extension" },
  { name: "Gatsby Plugin", link: "/gatsby-plugin" },
  { name: "Instantsearch.js adapter", link: "/instantsearch-js-adapter" },
  { name: "Documentation Search", link: "/documentation-search" },
  { name: "Docusaurus Search Theme", link: "/docusaurus-search-theme" },
  { name: "Firebase Extension", link: "/firebase-extension" },
];

const supportLinks = [
  { name: "Contact Us", link: "/javascript-client" },
  { name: "Prioritized Support", link: "/php-client" },
  { name: "Algolia vs Elasticsearch vs Typesense", link: "/ruby-client" },
  { name: "Slack Community", link: "/go-client" },
  { name: "Community Threads ", link: "/python-client" },
];
</script>

<template>
  <footer class="bg-light w-full px-16 py-[67px] text-sm text-text-muted">
    <div class="mb-14 flex gap-24">
      <div class="flex flex-col justify-between">
        <div>
          <div class="mb-6 flex items-center text-xl text-text-primary">
            <img
              src="/typesense-icon-black.svg"
              alt="Typesense"
              class="mr-2 inline-block h-8 w-8"
            />
            <img src="/typesense-logo-black.svg" alt="" />
          </div>
          <div>
            Fast, open source, typo-tolerant <br />
            search engine
          </div>
        </div>
        <div>
          <h2>Typesense, Inc.</h2>
          <div class="text-nowrap">
            Houston, TX <br />@typesense | contact@typesense.org
          </div>
        </div>
      </div>
      <div class="flex w-full justify-evenly gap-20">
        <div>
          <h2>Page</h2>
          <ul>
            <li v-for="page in pages" :key="page.name">
              <NuxtLink :to="page.link">{{ page.name }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="col-span-2">
          <h2>Libraries</h2>
          <div class="flex gap-6 text-nowrap">
            <ul>
              <li
                v-for="item in libraries.slice(undefined, 9)"
                :key="item.name"
              >
                <NuxtLink :to="item.link">{{ item.name }}</NuxtLink>
              </li>
            </ul>
            <ul>
              <li v-for="item in libraries.slice(9)" :key="item.name">
                <NuxtLink :to="item.link">{{ item.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h2>Support</h2>
          <ul>
            <li v-for="item in supportLinks" :key="item.name">
              <NuxtLink :to="item.link">{{ item.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between border-t-2 border-t-muted py-[20px]"
    >
      <div class="flex gap-12 text-sm">
        <div>Terms & Conditions</div>
        <div>Typesense® is a registered trademark of Typesense, Inc.</div>
      </div>

      <div class="mr-2.5 flex gap-2.5">
        <SocialLink :link-to="GITHUB_LINK">
          <Github />
        </SocialLink>
        <SocialLink accent="true" :link-to="SLACK_LINK">
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
h2 {
  @apply mb-4 text-base font-medium text-text-primary;
}
li {
  @apply mb-3;
}
</style>
