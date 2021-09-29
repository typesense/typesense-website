<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')" />
    <a href="/" class="home-link">
      <img v-if="$site.themeConfig.logo" class="logo" :src="$withBase($site.themeConfig.logo)" :alt="$siteTitle" :width="$site.themeConfig.logoWidth" :height="$site.themeConfig.logoHeight" />
      <span v-if="$siteTitle" ref="siteName" class="site-name" :class="{ 'can-hide': $site.themeConfig.logo }">{{
        $siteTitle
      }}</span>
    </a>

    <VersionDropdown show-on-desktop-only v-if="showVersionDropdown"/>

    <div
      class="links"
      :style="
        linksWrapMaxWidth
          ? {
              'max-width': linksWrapMaxWidth + 'px',
            }
          : {}
      "
    >
      <TypesenseSearchBox v-if="isTypesenseSearch" :options="typesense" />
      <SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false" />
      <NavLinks class="can-hide" />
    </div>
  </header>
</template>

<script>
import SearchBox from '@SearchBox'
import SidebarButton from '@theme/components/SidebarButton.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import VersionDropdown from '../../components/VersionDropdown'
import TypesenseSearchBox from '../../components/TypesenseSearchBox'
import isSemVer from "../../utils/isSemVer";

export default {
  name: 'Navbar',

  components: {
    VersionDropdown,
    SidebarButton,
    NavLinks,
    SearchBox,
    TypesenseSearchBox,
  },

  data() {
    return {
      linksWrapMaxWidth: null,
    }
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
      return isSemVer(this.$page.path.split('/')[1])
    }
  },

  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
    const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'))
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0)
      }
    }
    handleLinksWrapWidth()
    window.addEventListener('resize', handleLinksWrapWidth, false)
  },
}

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property]
}
</script>

<style lang="stylus">
$navbar-vertical-padding = 0.7rem
$navbar-horizontal-padding = 1.5rem

.navbar
  padding $navbar-vertical-padding $navbar-horizontal-padding
  line-height $navbarHeight - 1.4rem
  a, span, img
    display inline-block
  .logo
    height $navbarHeight - 1.4rem
    min-width $navbarHeight - 1.4rem
    margin-right 0.8rem
    vertical-align top
  .site-name
    font-size 1.3rem
    font-weight 600
    color $textColor
    position relative
  .links
    padding-left 1rem
    box-sizing border-box
    background-color white
    white-space nowrap
    font-size 0.9rem
    position absolute
    right $navbar-horizontal-padding
    top $navbar-vertical-padding
    display flex
    .search-box
      flex: 0 0 auto
      vertical-align top

@media (max-width: $MQMobile)
  .navbar
    padding-left 4rem
    .can-hide
      display none
    .links
      padding-left 1.5rem
    .site-name
      width calc(100vw - 9.4rem)
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
</style>
