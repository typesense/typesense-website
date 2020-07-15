module.exports = {
  // The base URL the site will be deployed at
  base: '/',

  // Title for the site. This will be the prefix for all page titles
  title: 'TypeSense',

  // This will render as a <meta> tag in the page HTML
  description: 'Craft delightful search experiences',

  // Extra tags to inject into the page HTML <head>
  // head: [
  //     ['link', { rel: 'icon', href: '/logo.png' }]
  // ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        ariaLabel: 'Guide Menu',
        items: [
          { text: '0.13.0 (Latest)', link: '/docs/0.13.0/guide/' },
          { text: '0.10.0', link: '/docs/0.10.0/guide/' },
        ],
      },
      {
        text: 'API',
        ariaLabel: 'API Menu',
        items: [
          { text: '0.13.0 (Latest)', link: '/docs/0.13.0/api/' },
          { text: '0.10.0', link: '/docs/0.10.0/api/' },
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
    sidebar: {
      // Add per route sidebar links
      // Structure of object: https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar
      '/docs/0.13.0/guide/': [
        ['/', 'Home Page'],
        {
          title: 'Group 1', // required
          collapsable: false, // optional, defaults to true
          sidebarDepth: 0, // optional, defaults to 1
          children: [
            ['/docs/0.13.0/guide/', 'Getting Started'],
            ['/docs/0.13.0/guide/another-page', 'Another Page'],
          ],
        },
      ],
      '/docs/0.13.0/api/': [['/', 'Home Page']],
    },
  },
}
