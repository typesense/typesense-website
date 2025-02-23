//@ts-ignore
import InstantSearch from "vue-instantsearch/vue3/es";

export default defineNuxtPlugin({
  name: "vue-instantsearch",
  enforce: "pre", // or 'post'
  async setup(nuxtApp) {
    nuxtApp.vueApp.use(InstantSearch);
  },

  env: {
    // Set this value to `false` if you don't want the plugin to run when rendering server-only or island components.
    islands: true,
  },
});
