const { description } = require('../../package')
const { typesenseVersions, typesenseLatestVersion } = require('../../../typsenseVersions')

module.exports = {
  // The base URL the site will be deployed at
  base: '/docs/',

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
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: '/images/typesense_logo.svg',
    typesenseVersions: typesenseVersions,
    typesenseLatestVersion: typesenseLatestVersion,
    typesenseDocsearch: {
      typesenseServerConfig: {
        nodes: [
          {
            host: 'x3s805zrawjuod9fp.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
        ],
        apiKey: 'c1DmVFTQGnnP5XtW8FV7btCDeTYhBLz6',
      },
      typesenseCollectionName: 'typesense_docs',
    },
    // Versioned nav links are dynamically populated by .vuepress/plugins/typesense-enhancements.js
    // Add any non-versioned pages below
    nav: [{ text: 'Help', link: '/help/' }],
    repo: 'typesense/typesense',
    smoothScroll: true,
    markdown: {
      lineNumbers: true,
    },
    // https://vuepress.vuejs.org/theme/default-theme-config.html#git-repository-and-edit-links
    // if your docs are in a different repo from your main project:
    docsRepo: 'typesense/typesense-website',
    // if your docs are not at the root of the repo:
    docsDir: 'new-site/docs-site/content',
    // if your docs are in a specific branch (defaults to 'master'):
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Edit page',
    sidebar: {
      '/0.19.0/guide/': [
        ['/0.19.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.19.0/guide/install-typesense', 'Install Typesense'],
            ['/0.19.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.19.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.19.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.19.0/guide/search-ui-components', 'Search UI Components'],
            ['/0.19.0/guide/typesense-firebase', 'Integrating with Firebase'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.19.0/guide/high-availability', 'High Availability'],
            ['/0.19.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
            ['/0.19.0/guide/updating-typesense', 'Updating Typesense'],
          ],
        },
      ],
      '/0.19.0/api/': [
        ['/0.19.0/api/', 'Introduction'],
        ['/0.19.0/api/api-clients', 'API Clients'],
        ['/0.19.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.19.0/api/collections', 'Collections'],
            ['/0.19.0/api/documents', 'Documents'],
            ['/0.19.0/api/api-keys', 'API Keys'],
            ['/0.19.0/api/curation', 'Curation'],
            ['/0.19.0/api/collection-alias', 'Collection Alias'],
            ['/0.19.0/api/synonyms', 'Synonyms'],
            ['/0.19.0/api/cluster-operations', 'Cluster Operations'],
          ],
        },
        ['/0.19.0/api/api-errors', 'API Errors'],
      ],
      '/overview': [
        ['/', 'Docs Home'],
        {
          title: 'Overview', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/overview/what-is-typesense', 'What is Typesense?'],
            ['/overview/why-typesense', 'Why Typesense?'],
            ['/overview/features', 'Key Features'],
            ['/overview/comparison-with-alternatives', 'Comparison with alternatives'],
          ],
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    ['@dovyp/vuepress-plugin-clipboard-copy', true],
    require('./plugins/typesense-enhancements'),
  ],
}

/*
{
  // Add per route sidebar links
  // Structure of object: https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar
  '/0.13.0/guide/': [
    ['/', 'Home Page'],
    {
      title: 'Group 1', // required
      collapsable: false, // optional, defaults to true
      sidebarDepth: 0, // optional, defaults to 1
      children: [
        ['/0.13.0/guide/', 'Getting Started'],
        ['/0.13.0/guide/another-page', 'Another Page'],
      ],
    },
  ],
  '/0.13.0/api/': [['/', 'Home Page']],
  '/0.19.0/guide/': [
    {
      title: 'Guide', // required
      collapsable: false, // optional, defaults to true
      sidebarDepth: 0, // optional, defaults to 1
      children: [
        ['/0.19.0/guide/', 'Installation'],
        ['/0.19.0/guide/configure', 'Configure'],
        ['/0.19.0/guide/update', 'Update'],
        ['/0.19.0/guide/installClient', 'Installing a Client'],
        ['/0.19.0/guide/example', 'Example Application'],
        ['/0.19.0/guide/searchui', 'Building Search UIs'],
        ['/0.19.0/guide/rankRelevance', 'Ranking and Relevance'],
      ],
    },
  ],
},
*/
