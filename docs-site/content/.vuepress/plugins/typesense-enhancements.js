const resolve = require('path').resolve

module.exports = (options, context) => ({
  name: 'typesense-enhancements',
  enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),
  extendPageData($page) {
    const typesenseLatestVersion = context.siteConfig.themeConfig.typesenseLatestVersion

    let  additionalMetaTags = []

    // Set typesenseVersion by reading the version from the path
    $page.typesenseVersion = $page.path.split('/')[1]
    // Only set this as a version, if it's in the list of versions defined
    // To account for top level paths
    if (
      $page.typesenseVersion === '' ||
      !context.siteConfig.themeConfig.typesenseVersions.includes($page.typesenseVersion)
    ) {
      $page.typesenseVersion = null
      additionalMetaTags.push(
        { name: 'docsearch:version', content: 'unversioned' },
      )
    }

    // Set dynamic nav links
    const pageNavLinkTypesenseVersion = $page.typesenseVersion || typesenseLatestVersion
    $page.nav = [
      {
        text: 'Docs Home',
        link: '/',
      },
      {
        text: 'Overview',
        link: '/overview/',
      },
      {
        text: 'Guide',
        link: `/guide/`,
      },
      {
        text: 'API Reference',
        link: `/${pageNavLinkTypesenseVersion}/api/`,
      },
    ]

    if ($page.title) {
      // Fix for variables not showing up in page titles
      $page.title = $page.title.replace(/\{\{ ?\$page\.typesenseVersion ?\}\}/, $page.typesenseVersion)
      $page.title = `${$page.title} | Typesense`

      // Dynamic OG/Twitter Tags
      additionalMetaTags.concat([
        { name: 'title', content: $page.title },
        { name: 'og:title', content: $page.title },
        { name: 'twitter:title', content: $page.title },
      ])

      $page.frontmatter.meta = [...additionalMetaTags, ...($page.frontmatter.meta || [])]
    }
  },
})
