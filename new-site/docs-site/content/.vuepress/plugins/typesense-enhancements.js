module.exports = (options, context) => ({
  name: 'typesense-enhancements',
  extendPageData ($page) {
    const typesenseLatestVersion = context.siteConfig.themeConfig.typesenseLatestVersion

    // Set typesenseVersion by reading the version from the path
    $page.typesenseVersion = $page.path.split('/')[1]
    // Only set this as a version, if it's in the list of versions defined
    // To account for top level paths
    if($page.typesenseVersion === '' || !context.siteConfig.themeConfig.typesenseVersions.includes($page.typesenseVersion)) {
      $page.typesenseVersion = null
    }

    // Set dynamic nav links
    const pageNavLinkTypesenseVersion = $page.typesenseVersion || typesenseLatestVersion
    $page.nav = [
      {
        text: "Docs Home",
        link: "/"
      },
      {
        text: `What's new`,
        link: `/${pageNavLinkTypesenseVersion}/`,
        // Custom flag that gets passed to https://router.vuejs.org/api/#exact-path
        // Prevents duplicate highlights in Nav
        exactPath: true
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
