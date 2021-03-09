const config = {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Typesense - Fast, Typo Tolerant Search Engine for Everyone',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/google-gtag',
  ],

  styleResources: {
    scss: ['./assets/scss/_vars.scss'],
  },

  // Disabling Bootstrap Compiled CSS
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vue-github-button',
      'vue-instantsearch',
      'instantsearch.js/es',
    ],
  },

  eslint: {
    fix: true,
  },

  publicRuntimeConfig: {
    typesenseHosts: (process.env.TYPESENSE_HOSTS || '').split(','),
    typesenseHostNearest: process.env.TYPESENSE_HOST_NEAREST,
    typesensePort: process.env.TYPESENSE_PORT,
    typesenseProtocol: process.env.TYPESENSE_PROTOCOL,
    typesenseSearchOnlyAPIKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY,
    typesenseCollectionName: process.env.TYPESENSE_COLLECTION_NAME,
  },

  'google-gtag': {
    id: 'UA-116415641-1',
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
      linker: {
        domains: [
          'new-site.typesense.org',
          'typesense.org',
          'cloud.typesense.org',
        ],
      },
    },
    debug: false, // enable to track in dev mode
  },

  server: {
    host: '0', // default: localhost
  },
}

export default config
