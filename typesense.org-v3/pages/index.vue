<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const description =
  "Typesense is an open-source search engine for fast, typo-tolerant site and app search, with simple APIs, vector search, and self-hosting.";

useSeoMeta({
  description,
  ogDescription: description,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://typesense.org/#organization",
            name: "Typesense, Inc.",
            url: "https://typesense.org/",
            logo: "https://typesense.org/typesense-logo.svg",
            sameAs: [
              "https://github.com/typesense",
              "https://x.com/typesense",
              "https://www.linkedin.com/company/typesense/",
            ],
          },
          {
            "@type": "WebSite",
            "@id": "https://typesense.org/#website",
            name: "Typesense",
            url: "https://typesense.org/",
            publisher: {
              "@id": "https://typesense.org/#organization",
            },
          },
          {
            "@type": "SoftwareApplication",
            name: "Typesense",
            url: "https://typesense.org/",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Linux, macOS, Docker",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            publisher: {
              "@id": "https://typesense.org/#organization",
            },
          },
        ],
      }),
    },
  ],
});
</script>

<template>
  <div class="site-padding">
    <HomeSectionHero />
    <HomeSectionAchievements />
    <HomeSectionUsers />
    <HomeSectionUseCases />
    <HomeSectionComparison />
    <HomeSectionAPILibraries />
    <HomeSectionFeatures />
  </div>
  <HomeSectionDeveloperExperience />
  <div class="site-padding">
    <HomeSectionIntegrations />
    <HomeSectionShowcase />
    <HomeSectionSearchUIIntegration />
    <HomeSectionSupport />
    <HomeSectionTestimonials />
  </div>
</template>
