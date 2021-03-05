module.exports = (options, context) => ({
  name: 'typesense-enhancements',
  extendPageData ($page) {
    const latestTypesenseVersion = context.siteConfig.themeConfig.latestTypesenseVersion

    // Set typesenseVersion by reading the version from the path
    const versionFromPath = $page.path.split('/')[1]
    $page.typesenseVersion = versionFromPath
    // Only set this as a version, if it's in the list of versions defined
    // To account for top level paths
    if($page.typesenseVersion == null || !context.siteConfig.themeConfig.typesenseVersions.includes($page.typesenseVersion)) {
      $page.typesenseVersion = null
    }

    // Set dynamic nav links
    const pageNavLinkTypesenseVersion = $page.typesenseVersion || latestTypesenseVersion
    $page.nav = [
      {
        text: "Home",
        ariaLabel: "Home Menu",
        items: [
          {text: 'Docs Home', link: "/"},
          {text: `v${pageNavLinkTypesenseVersion} Home`, link: `/${pageNavLinkTypesenseVersion}/`},
          {text: 'Typesense Home', link: "https://typesense.org/"}
        ]
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
