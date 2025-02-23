// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-20",
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },
  css: ["~/assets/css/fonts.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600],
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
