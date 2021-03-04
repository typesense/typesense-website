<template>
  <div class='mb-3'>
    <ul class='nav-container flex'>
      <li v-for='tab in tabs' :key='tab' class='nav' :class='{ active: tab === activeTab }'
          @click='setActiveTab(tab)'>
        <span class='nav-title'>{{ tab }}</span>
      </li>
    </ul>
    <div class='content-container'>
      <div v-for='tab in tabs' v-show='tab === activeTab' :key='tab' class='tab-content'>
        <slot :name='tab' />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      store: null,
      cmpActiveTab: this.tabs[0],
    }
  },
  computed: {
    activeTab() {
      if (this.store) {
        const activeTab = this.tabs.find((tab) => tab === this.store.state.defaultTab)
        return activeTab || this.cmpActiveTab
      } else {
        return this.cmpActiveTab
      }
    },
  },
  methods: {
    setActiveTab(tab) {
      this.cmpActiveTab = tab
      this.store.commit('UPDATE_DEFAULT_TAB', tab)
    },
  },
  mounted() {
    import('../store').then(module => {
      this.store = module.default
    })
  },
}
</script>

<style lang='stylus' scoped>

.nav-container
  display flex
  justify-content flex-start
  list-style none
  padding-left: 1.25rem
  padding-top: 1.25rem
  padding-bottom: 0.5rem
  border-bottom none
  border-top-left-radius 6px
  border-top-right-radius 6px
  margin-bottom 0
  background $codeBgColor
  color $white
  font-size 0.70rem

  .nav
    margin-right 1rem
    cursor pointer

    .nav-title
      display inline-block
      margin-right: .3rem

    &.active,&:not(.active):hover
      .nav-title
        border-bottom: $accentColor2 1px solid

.tab-content
  > div[class^=language-]
    border-top-left-radius 0
    border-top-right-radius 0

    &:not(:last-child)
      border-radius: 0

  pre[class^=language-]
    margin 0
</style>
