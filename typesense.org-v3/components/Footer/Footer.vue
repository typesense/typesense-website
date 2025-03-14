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
  <FooterSectionCTA />
  <footer
    class="w-full bg-bg px-16 pt-[67px] text-sm text-text-muted max-md:px-10 max-md:pt-8"
  >
    <div class="mb-14 flex gap-24 max-md:mb-8 max-md:flex-col max-md:gap-10">
      <div class="flex flex-col justify-between gap-10">
        <div>
          <div class="mb-6 max-md:mb-4">
            <Logo />
          </div>
          <div>
            Fast, open source, typo-tolerant <br />
            search engine
          </div>
        </div>
        <div>
          <h5>Typesense, Inc.</h5>
          <div class="text-nowrap">
            Houston, TX <br />@typesense | contact@typesense.org
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
                <NuxtLink :to="page.link">{{ page.name }}</NuxtLink>
              </li>
            </ul>
            <ul class="md:mt-3">
              <li v-for="page in pages.slice(3, undefined)" :key="page.name">
                <NuxtLink :to="page.link">{{ page.name }}</NuxtLink>
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
                  >{{ item.name }}</a
                >
              </li>
            </ul>
            <ul>
              <li v-for="item in libraries.slice(9)" :key="item.name">
                <a
                  :href="item.link"
                  target="_blank"
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
              <NuxtLink :to="item.link">{{ item.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between gap-8 border-t-2 border-t-muted py-5 max-md:flex-col-reverse"
    >
      <div
        class="flex items-center gap-12 text-sm max-md:flex-col max-md:gap-2 max-md:text-center"
      >
        <div>Terms & Conditions</div>
        <div>Typesense® is a registered trademark of Typesense, Inc.</div>
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
  @apply mb-4 text-base font-medium text-text-primary max-md:mb-3;
}
ul {
  @apply flex flex-col gap-3;
}
li {
  min-width: 14ch;
}
</style>
