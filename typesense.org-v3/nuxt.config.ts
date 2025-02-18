// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/fonts.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400],
    },
    display: 'swap',
    preconnect: true,
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
});
