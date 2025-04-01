import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-20",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Typesense | Open Source Alternative to Algolia + Pinecone",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
        },
        {
          name: "keywords",
          content:
            "typesense, search engine, fuzzy search, typo tolerance, faceting, filtering, app search, site search, search bar, algolia, elasticsearch",
        },

        // Open Graph
        {
          property: "og:title",
          content: "Typesense | Open Source Alternative to Algolia + Pinecone",
        },
        {
          property: "og:description",
          content:
            "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://typesense.org" },

        {
          property: "og:image",
          content: "https://typesense.org/opengraph.png",
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content:
            "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
        },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:image",
          content: "https://typesense.org/opengraph.png",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },
  css: ["~/assets/css/fonts.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "@nuxtjs/sitemap", "@nuxtjs/robots", "@zadigetvoltaire/nuxt-gtm"],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600],
      "Fira Code": [400],
    },
    display: "swap",
    preconnect: true,
  },
  gtm: {
    id: 'GTM-NDZ9CJJ',
  },
  // For sitemap generation
  site: { url: 'https://typesense.org' },
  sitemap: {
    discoverImages: false,
    defaults: {
      lastmod: new Date().toISOString(),
    },
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  runtimeConfig: {
    public: {
      typesenseHosts: "",
      typesenseHostNearest: "localhost",
      typesensePort: "8108",
      typesenseProtocol: "http",
      typesenseSearchOnlyApiKey: "xyz",
      typesenseCollectionName: "r",
      baseUrl: "https://typesense.org",
    },
  },

  build: {
    transpile: [({ isDev }) => !isDev && "typesense-instantsearch-adapter"],
  },

  vite: {
    plugins: [svgLoader()],
    optimizeDeps: {
      include: ["typesense-instantsearch-adapter"],
    },
  },
});