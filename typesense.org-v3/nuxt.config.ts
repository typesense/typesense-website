import svgLoader from "vite-svg-loader";

// Keep this browser bootstrap in sync across typesense.org-v3, docs-site, landing-pages, howtosearch, and blog.
const clickIdCaptureScript = `(function () {
  try {
    var names = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid', 'li_fat_id']
    var params = new URLSearchParams(location.search)
    var hostname = location.hostname
    var domain =
      hostname === 'typesense.org' || hostname.endsWith('.typesense.org') ? '; Domain=.typesense.org' : ''
    var secure = location.protocol === 'https:' ? '; Secure' : ''

    names.forEach(function (name) {
      if (!params.has(name)) return
      var value = params.get(name)
      if (!value) return
      value = value.slice(0, 255)
      document.cookie =
        name +
        '=' +
        encodeURIComponent(value) +
        '; Max-Age=7776000; Path=/' +
        domain +
        secure +
        '; SameSite=Lax'
      document.cookie =
        name +
        '_ts=' +
        Math.floor(Date.now() / 1000) +
        '; Max-Age=7776000; Path=/' +
        domain +
        secure +
        '; SameSite=Lax'
    })
  } catch (error) {}
})()`;

const googleTagManagerScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'/mtcs/?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','');`;

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
      script: [{ innerHTML: clickIdCaptureScript }, { innerHTML: googleTagManagerScript }],
    },
  },
  css: ["~/assets/css/fonts.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "@nuxtjs/sitemap", "@nuxtjs/robots"],
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600],
      "Fira Code": [400],
    },
    display: "swap",
    preconnect: true,
  },
  // For sitemap generation
  site: { url: 'https://typesense.org', trailingSlash: true },
  sitemap: {
    discoverImages: false,
    exclude: ['/api/', '/guide/'],
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
