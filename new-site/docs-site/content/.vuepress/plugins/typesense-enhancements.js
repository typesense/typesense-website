module.exports = (options, context) => ({
  name: 'typesense-enhancements',
  extendPageData ($page) {
    const latestTypesenseVersion = context.siteConfig.themeConfig.latestTypesenseVersion

    // Set typesenseVersion by reading the version from the path
    $page.typesenseVersion = $page.path.split('/')[1]
    // Only set this as a version, if it's in the list of versions defined
    // To account for top level paths
    if($page.typesenseVersion === '' || !context.siteConfig.themeConfig.typesenseVersions.includes($page.typesenseVersion)) {
      $page.typesenseVersion = null
    }

    // Set dynamic nav links
    const pageNavLinkTypesenseVersion = $page.typesenseVersion || latestTypesenseVersion
    $page.nav = [
      {
        text: "Docs Home",
        link: "/"
      },
      {
        text: `What's new`,
        link: `/${pageNavLinkTypesenseVersion}/`,
      },
      {
        text: "Guide",
        link: `/${pageNavLinkTypesenseVersion}/guide/`
      },
      {
        text: "API Reference",
        link: `/${pageNavLinkTypesenseVersion}/api/`
      }
    ]
  }
})
