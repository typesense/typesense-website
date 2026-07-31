const { existsSync } = require('fs')
const { relative, resolve } = require('path')

module.exports = (options, context) => ({
  name: 'typesense-enhancements',
  enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),
  extendPageData($page) {
    const typesenseLatestVersion = context.siteConfig.themeConfig.typesenseLatestVersion
    const pagePathVersion = $page.path.split('/')[1]
    const isVersionedPage = /^\d+\.\d+(?:\.\d+)?$/.test(pagePathVersion)

    let additionalMetaTags = []

    // Set typesenseVersion by reading the version from the path
    $page.typesenseVersion = pagePathVersion
    // Only set this as a version, if it's in the list of versions defined
    // To account for top level paths
    if (
      $page.typesenseVersion === '' ||
      !context.siteConfig.themeConfig.typesenseVersions.includes($page.typesenseVersion)
    ) {
      $page.typesenseVersion = null
      additionalMetaTags.push({ name: 'docsearch:version', content: 'unversioned' })
    }

    let canonicalPath = $page.path
    if (isVersionedPage && pagePathVersion !== typesenseLatestVersion && $page._filePath) {
      const latestVersionFilePathParts = relative(context.sourceDir, $page._filePath).split(/[\\/]/)
      latestVersionFilePathParts[0] = typesenseLatestVersion

      if (existsSync(resolve(context.sourceDir, ...latestVersionFilePathParts))) {
        canonicalPath = $page.path.replace(`/${pagePathVersion}/`, `/${typesenseLatestVersion}/`)
      }
    }

    const basePath = context.siteConfig.base || '/'
    const canonicalPathWithBase = basePath === '/' ? canonicalPath : basePath + canonicalPath.slice(1)
    $page.frontmatter.canonicalUrl = new URL(canonicalPathWithBase, 'https://typesense.org').toString()

    if (isVersionedPage && pagePathVersion !== typesenseLatestVersion) {
      $page.frontmatter.sitemap = {
        ...($page.frontmatter.sitemap || {}),
        exclude: true,
      }
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
      if (!$page.title.endsWith(' | Typesense')) $page.title = `${$page.title} | Typesense`
      if ($page.frontmatter.title) {
        $page.frontmatter.title = $page.title
      }

      // Dynamic OG/Twitter Tags
      additionalMetaTags = additionalMetaTags.concat([
        { name: 'title', content: $page.title },
        { name: 'og:title', content: $page.title },
        { name: 'twitter:title', content: $page.title },
      ])

      $page.frontmatter.meta = [...additionalMetaTags, ...($page.frontmatter.meta || [])]
    }
  },
})
