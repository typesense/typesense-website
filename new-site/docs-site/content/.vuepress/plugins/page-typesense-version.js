// This custom plugin tried to read the version from the path and sets it as a value on the $page object
module.exports = (options, ctx) => ({
  name: 'page-typesense-version',
  extendPageData ($page) {
    const versionFromPath = $page.path.split('/')[1]
    $page.typesenseVersion = versionFromPath === '' ? null : versionFromPath
  }
})
