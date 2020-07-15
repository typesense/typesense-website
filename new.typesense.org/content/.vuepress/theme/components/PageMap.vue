<template>
  <aside class="sidebar page-map">
    <NavLinks />

    <slot name="top" />

    <SidebarLinks
      :depth="0"
      :items="sidebarItems"
    />
    <slot name="bottom" />
  </aside>
</template>

<script>
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import { resolveSidebarItems } from '../util'

export default {
  name: 'Sidebar',

  components: { SidebarLinks, NavLinks },

  computed: {
    sidebarItems () {
      const page = JSON.parse(JSON.stringify(this.$page))

      page.frontmatter.sidebar = 'auto'
      page.title = 'On this Page'

      return resolveSidebarItems(
        page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },
  },
}
</script>

<style lang="stylus">
.sidebar
  ul
    padding 0
    margin 0
    list-style-type none
  a
    display inline-block
  .nav-links
    display none
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0
    a
      font-weight 600
    .nav-item, .repo-link
      display block
      line-height 1.25rem
      font-size 1.1em
      padding 0.5rem 0 0.5rem 1.5rem
  & > .sidebar-links
    padding 1.5rem 0
    & > li > a.sidebar-link
      font-size 1.1em
      line-height 1.7
      font-weight bold
    & > li:not(:first-child)
      margin-top .75rem

@media (max-width: $MQMobile)
  .sidebar
    .nav-links
      display block
      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after
        top calc(1rem - 2px)
    & > .sidebar-links
      padding 1rem 0


// --------------------------------------
// Overriden
// --------------------------------------

$sidebar-width = 15rem
$map-bp = 1180px


.page
  @media (min-width: $map-bp)
    padding-right $sidebar-width

.sidebar
  &.page-map
    @media (max-width: $map-bp)
      display none

    left: unset
    right: 0
    width: $sidebar-width

    .sidebar-heading
      padding-left: 0

    .sidebar-group
      a.sidebar-link
        padding-left: 0.5rem

    a.sidebar-link
      border-left-width: 0
      &.active
        font-weight: inherit
</style>
