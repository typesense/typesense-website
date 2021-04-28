const { description } = require('../../package')
const { typesenseVersions, typesenseLatestVersion } = require('../../../typsenseVersions')
const path = require('path')

let config = {
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
    ['meta', { name: 'theme-color', content: '#D52783' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Typesense Docs' }],
    ['meta', { name: 'og:description', content: 'Lightning-fast, open source search engine for everyone' }],
    ['meta', { name: 'og:image', content: 'https://typesense.org/docs/images/opengraph_banner.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Typesense Docs' }],
    ['meta', { name: 'twitter:description', content: 'Lightning-fast, open source search engine for everyone' }],
    ['meta', { name: 'twitter:image', content: 'https://typesense.org/docs/images/opengraph_banner.png' }],
    ['link', { rel: 'icon', href: '/favicon.png' }],
    [
      'script',
      {},
      `
        !function (e, t, n) {
        function a() {
          var e = t.getElementsByTagName("script")[0], n = t.createElement("script");
          n.type = "text/javascript", n.async = !0, n.src = "https://beacon-v2.helpscout.net", e.parentNode.insertBefore(n, e)
        }

        if (e.Beacon = n = function (t, n, a) {
          e.Beacon.readyQueue.push({method: t, options: n, data: a})
        }, n.readyQueue = [], "complete" === t.readyState) return a();
        e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1)
      }(window, document, window.Beacon || function () {
      });
      window.Beacon('config', { display: { style: 'icon' } })
      window.Beacon('init', '11291d62-d72c-4354-9f74-dfd71bb37718')
    `,
    ],
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
    nav: [{ text: 'Help', link: '/help' }],
    repo: 'typesense/typesense',
    smoothScroll: true,
    markdown: {
      lineNumbers: true,
    },
    // https://vuepress.vuejs.org/theme/default-theme-config.html#git-repository-and-edit-links
    // if your docs are in a different repo from your main project:
    docsRepo: 'typesense/typesense-website',
    // if your docs are not at the root of the repo:
    docsDir: 'docs-site/content',
    // if your docs are in a specific branch (defaults to 'master'):
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Edit page',
    sidebarDepth: 2,
    sidebar: {
      '/overview': [
        ['/', 'Docs Home'],
        {
          title: 'Overview', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/overview/what-is-typesense', 'What is Typesense?'],
            ['/overview/why-typesense', 'Why Typesense?'],
            ['/overview/comparison-with-alternatives', 'Comparison with alternatives'],
            ['/overview/features', 'Key Features'],
          ],
        },
      ],

      //For 0.19.0
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
            ['/0.19.0/guide/firebase-full-text-search', 'Firebase Full Text Search'],
            ['/0.19.0/guide/dynamodb-full-text-search', 'AWS DyanamoDB Full Text Search'],
            ['/0.19.0/guide/mongodb-full-text-search', 'MongoDB Full Text Search'],
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
        {
          title: 'Features', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.19.0/guide/features/typo-tolerance', 'Typo Tolerance'],
            ['/0.19.0/guide/features/faceting', 'Faceting'],
            ['/0.19.0/guide/features/filtering', 'Filtering'],
            ['/0.19.0/guide/features/federated-search', 'Federated Search'],
            ['/0.19.0/guide/features/multi-tenant-indices', 'Multi-tenant Indices'],
            ['/0.19.0/guide/features/synonyms', 'Synonyms'],
            ['/0.19.0/guide/features/clustering', 'Raft Based Clustering'],
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

      //For 0.18.0
      '/0.18.0/guide/': [
        ['/0.18.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.18.0/guide/install-typesense', 'Install Typesense'],
            ['/0.18.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.18.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.18.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.18.0/guide/search-ui-components', 'Search UI Components'],
            ['/0.18.0/guide/firebase-full-text-search', 'Integrating with Firebase'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.18.0/guide/high-availability', 'High Availability'],
            ['/0.18.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.18.0/api/': [
        ['/0.18.0/api/', 'Introduction'],
        ['/0.18.0/api/api-clients', 'API Clients'],
        ['/0.18.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.18.0/api/collections', 'Collections'],
            ['/0.18.0/api/documents', 'Documents'],
            ['/0.18.0/api/api-keys', 'API Keys'],
            ['/0.18.0/api/curation', 'Curation'],
            ['/0.18.0/api/collection-alias', 'Collection Alias'],
            ['/0.18.0/api/synonyms', 'Synonyms'],
            ['/0.18.0/api/cluster-operations', 'Cluster Operations'],
          ],
        },
        ['/0.18.0/api/api-errors', 'API Errors'],
      ],

      //For 0.17.0
      '/0.17.0/guide/': [
        ['/0.17.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.17.0/guide/install-typesense', 'Install Typesense'],
            ['/0.17.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.17.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.17.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.17.0/guide/search-ui-components', 'Search UI Components'],
            ['/0.17.0/guide/firebase-full-text-search', 'Integrating with Firebase'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.17.0/guide/high-availability', 'High Availability'],
            ['/0.17.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.17.0/api/': [
        ['/0.17.0/api/', 'Introduction'],
        ['/0.17.0/api/api-clients', 'API Clients'],
        ['/0.17.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.17.0/api/collections', 'Collections'],
            ['/0.17.0/api/documents', 'Documents'],
            ['/0.17.0/api/api-keys', 'API Keys'],
            ['/0.17.0/api/curation', 'Curation'],
            ['/0.17.0/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.17.0/api/api-errors', 'API Errors'],
      ],

      //For 0.16.1
      '/0.16.1/guide/': [
        ['/0.16.1/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.16.1/guide/install-typesense', 'Install Typesense'],
            ['/0.16.1/guide/configure-typesense', 'Configure Typesense'],
            ['/0.16.1/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.16.1/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.16.1/guide/search-ui-components', 'Search UI Components'],
            ['/0.16.1/guide/firebase-full-text-search', 'Integrating with Firebase'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.16.1/guide/high-availability', 'High Availability'],
            ['/0.16.1/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.16.1/api/': [
        ['/0.16.1/api/', 'Introduction'],
        ['/0.16.1/api/api-clients', 'API Clients'],
        ['/0.16.1/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.16.1/api/collections', 'Collections'],
            ['/0.16.1/api/documents', 'Documents'],
            ['/0.16.1/api/api-keys', 'API Keys'],
            ['/0.16.1/api/curation', 'Curation'],
            ['/0.16.1/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.16.1/api/api-errors', 'API Errors'],
      ],

      //For 0.16.0
      '/0.16.0/guide/': [
        ['/0.16.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.16.0/guide/install-typesense', 'Install Typesense'],
            ['/0.16.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.16.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.16.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.16.0/guide/search-ui-components', 'Search UI Components'],
            ['/0.16.0/guide/firebase-full-text-search', 'Integrating with Firebase'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.16.0/guide/high-availability', 'High Availability'],
            ['/0.16.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.16.0/api/': [
        ['/0.16.0/api/', 'Introduction'],
        ['/0.16.0/api/api-clients', 'API Clients'],
        ['/0.16.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.16.0/api/collections', 'Collections'],
            ['/0.16.0/api/documents', 'Documents'],
            ['/0.16.0/api/api-keys', 'API Keys'],
            ['/0.16.0/api/curation', 'Curation'],
            ['/0.16.0/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.16.0/api/api-errors', 'API Errors'],
      ],

      //For 0.15.0
      '/0.15.0/guide/': [
        ['/0.15.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.15.0/guide/install-typesense', 'Install Typesense'],
            ['/0.15.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.15.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.15.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.15.0/guide/search-ui-components', 'Search UI Components'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.15.0/guide/high-availability', 'High Availability'],
            ['/0.15.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.15.0/api/': [
        ['/0.15.0/api/', 'Introduction'],
        ['/0.15.0/api/api-clients', 'API Clients'],
        ['/0.15.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.15.0/api/collections', 'Collections'],
            ['/0.15.0/api/documents', 'Documents'],
            ['/0.15.0/api/api-keys', 'API Keys'],
            ['/0.15.0/api/curation', 'Curation'],
            ['/0.15.0/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.15.0/api/api-errors', 'API Errors'],
      ],

      // For 0.14.0
      '/0.14.0/guide/': [
        ['/0.14.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.14.0/guide/install-typesense', 'Install Typesense'],
            ['/0.14.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.14.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.14.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.14.0/guide/search-ui-components', 'Search UI Components'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.14.0/guide/high-availability', 'High Availability'],
            ['/0.14.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.14.0/api/': [
        ['/0.14.0/api/', 'Introduction'],
        ['/0.14.0/api/api-clients', 'API Clients'],
        ['/0.14.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.14.0/api/collections', 'Collections'],
            ['/0.14.0/api/documents', 'Documents'],
            ['/0.14.0/api/api-keys', 'API Keys'],
            ['/0.14.0/api/curation', 'Curation'],
            ['/0.14.0/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.14.0/api/api-errors', 'API Errors'],
      ],

      // For 0.13.0
      '/0.13.0/guide/': [
        ['/0.13.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.13.0/guide/install-typesense', 'Install Typesense'],
            ['/0.13.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.13.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.13.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.13.0/guide/search-ui-components', 'Search UI Components'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.13.0/guide/high-availability', 'High Availability'],
            ['/0.13.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.13.0/api/': [
        ['/0.13.0/api/', 'Introduction'],
        ['/0.13.0/api/api-clients', 'API Clients'],
        ['/0.13.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.13.0/api/collections', 'Collections'],
            ['/0.13.0/api/documents', 'Documents'],
            ['/0.13.0/api/api-keys', 'API Keys'],
            ['/0.13.0/api/curation', 'Curation'],
            ['/0.13.0/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.13.0/api/api-errors', 'API Errors'],
      ],

      // For 0.12.0
      '/0.12.0/guide/': [
        ['/0.12.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.12.0/guide/install-typesense', 'Install Typesense'],
            ['/0.12.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.12.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.12.0/guide/building-a-search-application', 'Building a Search Application'],
            ['/0.12.0/guide/search-ui-components', 'Search UI Components'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.12.0/guide/high-availability', 'High Availability'],
            ['/0.12.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.12.0/api/': [
        ['/0.12.0/api/', 'Introduction'],
        ['/0.12.0/api/api-clients', 'API Clients'],
        ['/0.12.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.12.0/api/collections', 'Collections'],
            ['/0.12.0/api/documents', 'Documents'],
            ['/0.12.0/api/curation', 'Curation'],
            ['/0.12.0/api/collection-alias', 'Collection Alias'],
          ],
        },
        ['/0.12.0/api/api-errors', 'API Errors'],
      ],

      // For 0.11.2
      '/0.11.2/guide/': [
        ['/0.11.2/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.2/guide/install-typesense', 'Install Typesense'],
            ['/0.11.2/guide/configure-typesense', 'Configure Typesense'],
            ['/0.11.2/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.2/guide/building-a-search-application', 'Building a Search Application'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.2/guide/high-availability', 'High Availability'],
            ['/0.11.2/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.11.2/api/': [
        ['/0.11.2/api/', 'Introduction'],
        ['/0.11.2/api/api-clients', 'API Clients'],
        ['/0.11.2/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.11.2/api/collections', 'Collections'],
            ['/0.11.2/api/documents', 'Documents'],
          ],
        },
        ['/0.11.2/api/api-errors', 'API Errors'],
      ],

      // For 0.11.1
      '/0.11.1/guide/': [
        ['/0.11.1/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.1/guide/install-typesense', 'Install Typesense'],
            ['/0.11.1/guide/configure-typesense', 'Configure Typesense'],
            ['/0.11.1/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.1/guide/building-a-search-application', 'Building a Search Application'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.1/guide/high-availability', 'High Availability'],
            ['/0.11.1/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.11.1/api/': [
        ['/0.11.1/api/', 'Introduction'],
        ['/0.11.1/api/api-clients', 'API Clients'],
        ['/0.11.1/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.11.1/api/collections', 'Collections'],
            ['/0.11.1/api/documents', 'Documents'],
          ],
        },
        ['/0.11.1/api/api-errors', 'API Errors'],
      ],

      // For 0.11.0
      '/0.11.0/guide/': [
        ['/0.11.0/guide/', 'Introduction'],
        {
          title: 'Getting Started', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.0/guide/install-typesense', 'Install Typesense'],
            ['/0.11.0/guide/configure-typesense', 'Configure Typesense'],
            ['/0.11.0/guide/installing-a-client', 'Installing a Client'],
          ],
        },
        {
          title: 'Walk-throughs',
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.0/guide/building-a-search-application', 'Building a Search Application'],
          ],
        },
        {
          title: 'Operations', // required
          collapsable: false, // optional, defaults to true
          children: [
            ['/0.11.0/guide/high-availability', 'High Availability'],
            ['/0.11.0/guide/ranking-and-relevance', 'Ranking and Relevance'],
          ],
        },
      ],
      '/0.11.0/api/': [
        ['/0.11.0/api/', 'Introduction'],
        ['/0.11.0/api/api-clients', 'API Clients'],
        ['/0.11.0/api/authentication', 'Authentication'],
        {
          title: 'API Resources',
          collapsable: false,
          children: [
            ['/0.11.0/api/collections', 'Collections'],
            ['/0.11.0/api/documents', 'Documents'],
          ],
        },
        ['/0.11.0/api/api-errors', 'API Errors'],
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
  configureWebpack: {
    resolve: {
      alias: {
        '@images': path.resolve(__dirname, 'public/images/')
      }
    }
  }
}

module.exports = config
