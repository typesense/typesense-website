const { description } = require('../../package')

module.exports = {
  // The base URL the site will be deployed at
  base: '/docs/',

  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Typesense',

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
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    nav: [
      { text: 'Docs Home', link: '/' },
      {
        text: 'Guide',
        ariaLabel: 'Guide Menu',
        items: [
          { text: '0.19.0 (Latest)', link: '/0.19.0/guide/' },
          { text: '0.13.0', link: '/0.13.0/guide/' },
          { text: '0.10.0', link: '/0.10.0/guide/' },
        ],
      },
      {
        text: 'API',
        ariaLabel: 'API Menu',
        items: [
          { text: '0.19.0 (Latest)', link: '/0.19.0/api/' },
          { text: '0.13.0 ', link: '/0.13.0/api/' },
          { text: '0.10.0', link: '/0.10.0/api/' },
        ],
      },
      { text: 'Download', link: '/download/' },
      { text: 'Contact', link: '/contact/' },
    ],
    repo: 'typesense/typesense',
    smoothScroll: true,
    markdown: {
      lineNumbers: true,
    },
    sidebar:{
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
      '/0.19.0/api/': [
        {
          title:'API 0.19.0',
          collapsable:false,
          children:[
            ['/0.19.0/api/','Introduction'],
            ['/0.19.0/api/apiclient','API Clients'],
            ['/0.19.0/api/authentication','Authentication'],
            ['/0.19.0/api/usage/create','Create a Collection'],
            ['/0.19.0/api/usage/search','Search a Collection'],
            ['/0.19.0/api/usage/federatedSearch','Federated/Multi Search'],
            ['/0.19.0/api/usage/retrieve','Retrieve a document'],
            ['/0.19.0/api/usage/update','Updating a document'],
            ['/0.19.0/api/usage/delete','Deleting documents'],
            ['/0.19.0/api/usage/retrieveColl','Retrieving a Collection'],
            ['/0.19.0/api/usage/export','Export Documents'],
            ['/0.19.0/api/usage/import','Import Documents'],
            ['/0.19.0/api/usage/list','List all Collections'],
            ['/0.19.0/api/usage/drop','Drop a Collection'],
            ['/0.19.0/api/manageapi','Manage API Keys'],
            ['/0.19.0/api/curation','Curation'],
          ]
        }
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
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