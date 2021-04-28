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
  },
  methods: {
    switchVersion(event) {
      const newVersion = event.target.value
      if (this.$page.typesenseVersion !== newVersion) {
        let newPath = `/${newVersion}/`
        const [ majorVersion, minorVersion, patchVersion] = newVersion.split('.')
        if(majorVersion >= 0 && minorVersion >= 20) {
          newPath += 'guide/'
        }
        this.$router.push(newPath)
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
      padding: 0 1.6em 0 0.5em;
      border: 1px solid $white;
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
</style>
