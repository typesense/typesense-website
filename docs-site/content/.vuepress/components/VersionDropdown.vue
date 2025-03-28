<template>
  <div
    class="version-switcher"
    :class="[showOnMobileOnly ? 'show-on-mobile-only' : '', showOnDesktopOnly ? 'show-on-desktop-only' : '']"
  >
    <select @change="switchVersion">
      <option
        v-for="version in $site.themeConfig.typesenseVersions"
        :key="version"
        :value="version"
        :selected="version === currentVersion"
      >
        v{{ version }}
      </option>
    </select>
    <div class="old-version-warning" v-show="showOldVersionWarning">
      You are viewing docs for an old version. Switch to latest
      <RouterLink :to="getVersionedPath(latestVersion)"> v{{ latestVersion }}</RouterLink
      >.
    </div>
  </div>
</template>

<script>
export default {
  name: 'VersionDropdown',
  props: {
    showOnMobileOnly: {
      type: Boolean,
      default: false,
    },
    showOnDesktopOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentVersion() {
      return this.$page.typesenseVersion
    },
    latestVersion() {
      return this.$site.themeConfig.typesenseLatestVersion
    },
    showOldVersionWarning() {
      return this.currentVersion && this.currentVersion !== '' && this.currentVersion !== this.latestVersion
    },
    currentPath() {
      const fullPath = this.$route.path
      const versionMatch = fullPath.match(new RegExp(`^\\/${this.currentVersion}(\\/.*)?$`))
      return versionMatch && versionMatch[1] ? versionMatch[1] : '/'
    },
    currentHash() {
      return this.$route.hash || ''
    },
  },
  methods: {
    getVersionedPath(version) {
      const versionParts = version.split('.')
      const majorVersion = parseInt(versionParts[0], 10)
      const minorVersion = parseInt(versionParts[1], 10)

      // Determine if version needs API prefix:
      // - Versions >= 0.20.0 need API prefix
      // - Also newer format versions (without leading 0) need API prefix
      const needsApiPrefix = (majorVersion === 0 && minorVersion >= 20) || majorVersion > 0

      const normalizedPath = this.currentPath.replace('/api', '')
      const prefix = needsApiPrefix ? '/api' : ''

      const targetPath = `/${version}${prefix}${normalizedPath}`

      const pageExists = this.$site.pages.some(page => page.path === targetPath ?? page.path === `${targetPath}/`)

      if (!pageExists && normalizedPath !== '/') {
        return `/${version}${needsApiPrefix ? '/api/' : '/'}`
      }

      return `${targetPath}${this.currentHash}`
    },
    switchVersion(event) {
      const newVersion = event.target.value
      if (this.currentVersion !== newVersion) {
        this.$router.push(this.getVersionedPath(newVersion))
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.version-switcher
  @media (min-width: $MQMobile)
    display: inline-block;

    select:-ms-expand
      display: none;

    select
      display: inline-block;
      box-sizing: border-box;
      padding: 0 1.6rem 0 1rem;
      border: 1px solid $white;
      background-color $lightGrayColor;
      font: inherit;
      line-height: inherit;
      -webkit-appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      appearance: none;
      background-repeat: no-repeat;
      background-image: linear-gradient(45deg, transparent 50%, $accentColor 50%), linear-gradient(135deg, $accentColor 50%, transparent 50%);
      background-position: right 15px top 1.2em, right 10px top 1.2em;
      background-size: 5px 5px, 5px 5px;

  &.show-on-mobile-only
    display none
    @media (max-width: $MQMobile)
      display inline-block

  &.show-on-desktop-only
    display none
    @media (min-width: $MQMobile)
      display inline-block

  .old-version-warning
    display inline-block
    font-size 0.75em
    background-color lighten($badgeWarningColor, 70%)
    padding 0.5em
    line-height 1.6

    @media (max-width: $MQMobile)
      margin-top 1em
      margin-right 2em

    a:hover
      text-decoration underline
      cursor pointer
</style>
