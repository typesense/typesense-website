const { description } = require("../../package");

module.exports = {
  // The base URL the site will be deployed at
  base: "/docs/",

  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */

  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ["link", { rel: "icon", href: "/favicon.png" }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: "/images/typesense_logo.svg",
    typesenseVersions: [
      "0.13.0",
      "0.10.0"
    ],
    latestTypesenseVersion: '0.13.0',
    // Versioned nav links are dynamically populated by .vuepress/plugins/typesense-enhancements.js
    // Add any non-versioned pages below
    nav: [
      { text: "Help", link: "/help/" }
    ],
    repo: "typesense/typesense",
    smoothScroll: true,
    markdown: {
      lineNumbers: true
    },
    sidebar: {
      // Add per route sidebar links
      // Structure of object: https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar
      "/0.13.0/guide/": [
        ["/", "Home Page"],
        {
          title: "Group 1", // required
          collapsable: false, // optional, defaults to true
          sidebarDepth: 0, // optional, defaults to 1
          children: [
            ["/0.13.0/guide/", "Getting Started"],
            ["/0.13.0/guide/another-page", "Another Page"]
          ]
        }
      ],
      "/0.13.0/api/": [["/", "Home Page"]]
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    ["@dovyp/vuepress-plugin-clipboard-copy", true],
    require('./plugins/typesense-enhancements'),
  ],

  port: 3000,
}
