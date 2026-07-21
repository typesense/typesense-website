<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')" />
    <div class="logo-and-links">
      <a href="/" class="home-link">
        <img
          v-if="$site.themeConfig.logo"
          class="logo"
          :src="$withBase($site.themeConfig.logo)"
          :alt="$siteTitle"
          :style="logoStyles"
        />
        <span v-if="$siteTitle" ref="siteName" class="site-name" :class="{ 'can-hide': $site.themeConfig.logo }">{{
          $siteTitle
        }}</span>
      </a>
    </div>
    <div class="navbar-search-container">
      <TypesenseSearchBox v-if="isTypesenseSearch" :options="typesense" />
      <SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false" />
    </div>
  </header>
</template>

<script>
import SearchBox from '@SearchBox'
import SidebarButton from '@theme/components/SidebarButton.vue'
import TypesenseSearchBox from '../../components/TypesenseSearchBox'
import isSemVer from '../../utils/isSemVer'

export default {
  name: 'Navbar',

  components: {
    SidebarButton,
    SearchBox,
    TypesenseSearchBox,
  },

  computed: {
    typesense() {
      return Object.assign(
        {},
        this.$themeLocaleConfig.typesenseDocsearch || this.$site.themeConfig.typesenseDocsearch || {},
        { typesenseVersion: this.$page.typesenseVersion },
      )
    },

    isTypesenseSearch() {
      return this.typesense && this.typesense.typesenseServerConfig && this.typesense.typesenseCollectionName
    },

    showVersionDropdown() {
      return isSemVer(this.normalizedVersionStringForSemVer(this.$page.path.split('/')[1]))
    },

    logoStyles() {
      const toCssSize = value => {
        if (value === undefined || value === null || value === '') return undefined
        return typeof value === 'number' ? `${value}px` : value
      }

      return {
        '--logo-width': toCssSize(this.$site.themeConfig.logoWidth),
        '--logo-height': toCssSize(this.$site.themeConfig.logoHeight),
        '--logo-width-mobile': toCssSize(this.$site.themeConfig.logoWidthMobile),
        '--logo-height-mobile': toCssSize(this.$site.themeConfig.logoHeightMobile),
      }
    },
  },

  methods: {
    normalizedVersionStringForSemVer(version) {
      const parts = version.split('.')
      const rcIndex = parts.findIndex(part => part.startsWith('rc'))

      if (rcIndex > -1) {
        const rcPart = parts.splice(rcIndex, 1)[0]
        while (parts.length < 3) {
          parts.push('0')
        }
        parts.push(rcPart)
      } else {
        while (parts.length < 3) {
          parts.push('0')
        }
      }

      // console.log(`${version} normalized to ${parts.join(".")}`);

      return parts.join('.')
    },
  },

}
</script>

<style lang="stylus">
$navbar-vertical-padding = 0.7rem
$navbar-horizontal-padding = 1.5rem

  .navbar
    display: flex;
    align-items: center;
    padding $navbar-vertical-padding $navbar-horizontal-padding
  line-height $navbarHeight - 1.4rem
  a, span, img
    display inline-block
  .logo-and-links
    display flex
    align-items center
    min-width 0
  .home-link
    display flex
    align-items center
  .logo
    height $navbarHeight - 1.4rem
    min-width $navbarHeight - 1.4rem
    margin-right 0.8rem
    vertical-align top
    width var(--logo-width, auto)
    height var(--logo-height, $navbarHeight - 1.4rem)
  .site-name
    font-size 1.3rem
    font-weight 600
    color $textColor
    position relative

  .navbar-search-container
    display flex
    align-items center
    gap 0.5rem
    margin-left auto
    justify-content flex-end
    flex 0 0 auto

  .search-box
    flex: 0 0 auto
    margin-left 1.7rem

@media (max-width: $MQMobile)
  .navbar
    padding-left $navbar-horizontal-padding
    .sidebar-button
      position static
      top auto
      left auto
      display flex
      align-items center
      justify-content center
      padding-left 0
      padding-right 1rem
    .can-hide
      display none
    .navbar-search-container
      margin-left auto
    .search-box
      margin-left 0
    .logo
      width var(--logo-width-mobile, var(--logo-width, auto))
      height var(--logo-height-mobile, var(--logo-height, $navbarHeight - 1.4rem))
    .site-name
      width calc(100vw - 9.4rem)
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
</style>
