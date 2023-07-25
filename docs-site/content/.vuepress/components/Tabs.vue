<template>
  <div class="code-tabs-container">
    <ClientOnly>
      <ul class="nav-container flex">
        <li
          v-for="tab in augmentedTabs"
          :key="tab"
          class="nav"
          :class="{ active: tab === activeTab }"
          @click="setActiveTab(tab)"
        >
          <span class="nav-title">{{ tab }}</span>
        </li>
      </ul>
      <div class="content-container">
        <div v-for="tab in augmentedTabs" v-show="tab === activeTab" :key="tab" class="tab-content">
          <template v-if="tab === 'Other Languages'" :name="tab">
            <div class="language-bash">
              <pre class="language-bash"><code
              >Typesense has a RESTful HTTP API.
So you can use any HTTP library in your language of choice to make API calls to it.
The official client libraries are just thin wrappers around the API, with a retry mechanism.
Have a look at the "Shell" tab for guidance on HTTP headers, method and parameters to use to make HTTP calls.</code
              ></pre>
            </div>
          </template>
          <slot v-else :name="tab" />
        </div>
      </div>
    </ClientOnly>
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
    augmentedTabs() {
      // We don't want "Other" to show up for Sample Response for eg
      if (this.tabs.includes('Ruby') && this.tabs.includes('Python')) {
        return [...this.tabs, 'Other Languages']
      } else {
        return this.tabs
      }
    },
    activeTab() {
      if (this.store) {
        const activeTab = this.augmentedTabs.find(tab => tab === this.store.state.defaultTab)
        return activeTab || this.cmpActiveTab
      } else {
        return this.cmpActiveTab
      }
    },
  },
  async mounted() {
    import('../store').then(module => {
      this.store = module.default
    })
    // This block of code is to highlight code with variable interpolation
    //  since Vuepress doesn't support this natively
    window.Prism = window.Prism || {}
    Prism.manual = true
    import('prismjs').then(async module => {
      Prism = module.default

      // Add all required languages here
      await import('prismjs/components/prism-bash')
      await import('prismjs/components/prism-yaml')

      if (document.querySelector('.manual-highlight')) {
        document.querySelectorAll('.manual-highlight').forEach(element => {
          Prism.highlightAllUnder(element)
        })
      }
    })
  },
  methods: {
    setActiveTab(tab) {
      this.cmpActiveTab = tab
      this.store.commit('UPDATE_DEFAULT_TAB', tab)
    },
  },
}
</script>

<style lang="stylus" scoped>

.code-tabs-container
  margin-bottom: 1rem;

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
  margin-left 0

  .nav
    margin-right 1rem
    cursor pointer

    .nav-title
      display inline-block
      margin-right: .3rem

    &.active,&:not(.active):hover
      .nav-title
        border-bottom: $accentColor2 1px solid

  // Fix spacing on mobile view
  @media (max-width: $MQMobile)
    margin-left -1.5rem
    margin-right -1.5rem
    border-radius 0

.tab-content
  > div[class^=language-]
    border-top-left-radius 0
    border-top-right-radius 0

    &:not(:last-child)
      border-radius: 0

  pre[class^=language-]
    margin 0
    border-top-left-radius 0
    border-top-right-radius 0

  // Remove the duplicate language display
  div[class*="language-"]::before
    display none

  // Fix spacing on mobile view
  @media (max-width: $MQMobile)
    div[class*="language-"]
      margin 0rem -1.5rem
      border-radius 0
</style>
