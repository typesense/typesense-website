// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [require("vite-svg-loader")()],
  },
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
});
