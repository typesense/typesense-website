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
          hid: "description",
          name: "description",
          content:
            "Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.",
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "typesense, search engine, fuzzy search, typo tolerance, faceting, filtering, app search, site search, search bar, algolia, elasticsearch",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },
  css: ["~/assets/css/fonts.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600],
      "Fira Code": [400],
    },
    display: "swap",
    preconnect: true,
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
    plugins: [require("vite-svg-loader")()],
    optimizeDeps: {
      include: ["typesense-instantsearch-adapter"],
    },
  },
});
