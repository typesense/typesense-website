<template>
  <div class="container">
    <ul class="nav-container flex">
      <li class="nav" :class="{'active': tab === activeTab}" v-for="tab in tabs" :key="tab" @click="setActiveTab(tab)">
        <span class="nav-title">{{ tab }}</span>
      </li>
    </ul>
    <div class="content-container">
      <div class="tab-content"
            :key="tab"
            v-for="(tab, index) in tabs"
            v-show="tab === activeTab"
        >
            <slot :name="tab"></slot>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      cmpActiveTab: this.tabs[0]
    }
  },
  computed: {
    activeTab() {
      const activeTab = this.tabs.find((tab) => tab === this.$store.state.defaultTab)
      return activeTab || this.cmpActiveTab
    }
  },
  methods: {
    setActiveTab(tab) {
      this.cmpActiveTab = tab
      this.$store.commit('UPDATE_DEFAULT_TAB', tab)
    }
  },
}
</script>

<style lang="stylus" scoped>

.nav-container
  display flex
  list-style none
  padding-left: 0
  border: 1px solid #eee
  border-bottom none
  border-top-left-radius 6px
  border-top-right-radius 6px
  padding: 1rem
  margin-bottom 0

  .nav
    margin-right 1rem
    border-radius: 8px;
    cursor pointer

    .nav-title
      display inline-block
      border: 1px solid transparent
      padding: .3rem .6rem

    &.active
      color: #fff
      background: $accentColor

    &:not(.active):hover
      background: #eee

.tab-content
  > div[class^=language-]
    border-top-left-radius 0
    border-top-right-radius 0

    &:not(:last-child)
      border-radius: 0
  pre[class^=language-]
    margin 0
</style>
