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
    <div class="old-version-warning" v-show="showVersionWarning">
      <template v-if="isOlderThanLatest">
        You are viewing docs for an old version. Switch to latest
        <RouterLink :to="getVersionedPath(latestVersion)"> v{{ latestVersion }}</RouterLink>.
      </template>
      <template v-else-if="isNewerThanLatest">
        You are viewing docs for an RC version, switch to GA version
        <RouterLink :to="getVersionedPath(latestVersion)"> v{{ latestVersion }}</RouterLink>.
      </template>
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
    showVersionWarning() {
      return (
        this.currentVersion &&
        this.currentVersion !== '' &&
        this.currentVersion !== this.latestVersion
      )
    },
    isOlderThanLatest() {
      return this.compareVersions(this.currentVersion, this.latestVersion) < 0
    },
    isNewerThanLatest() {
      return this.compareVersions(this.currentVersion, this.latestVersion) > 0
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
    compareVersions(a, b) {
      if (!a || !b) return 0
      const aParts = String(a).split('.')
      const bParts = String(b).split('.')
      const len = Math.max(aParts.length, bParts.length)
      for (let i = 0; i < len; i++) {
        const aNum = parseInt(aParts[i] || '0', 10)
        const bNum = parseInt(bParts[i] || '0', 10)
        if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
          // Fallback to string compare if non-numeric segments appear
          const aSeg = aParts[i] || ''
          const bSeg = bParts[i] || ''
          if (aSeg === bSeg) continue
          return aSeg > bSeg ? 1 : -1
        }
        if (aNum > bNum) return 1
        if (aNum < bNum) return -1
      }
      return 0
    },
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
