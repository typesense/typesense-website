<template>
  <div>
    <BTabs pills card no-fade>
      <div v-for="tab in tabs" :key="tab.language">
        <BTab
          :active="activeTab === tab.language"
          :title="tab.displayLanguage"
          @click="setCodeLanguage(tab.language)"
        >
          <pre><code
            :class="`language-${tab.language}`">{{ tab.content }}</code></pre>
        </BTab>
      </div>
    </BTabs>
  </div>
</template>

<script>
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-bash'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import startCase from 'lodash.startcase'

export default {
  data() {
    return {
      tabs: [],
    }
  },
  computed: {
    activeTab() {
      return this.$store.state.codeLanguage || 'bash'
    },
  },
  created() {
    this.tabs = this.$slots.default
      .filter((el) => el.tag === 'pre')
      .map((el) => {
        return {
          language: el.data.attrs['data-language'],
          displayLanguage:
            el.data.attrs['data-display-language'] ||
            startCase(el.data.attrs['data-language']),
          content: el.children[0].text,
        }
      })
  },
  methods: {
    setCodeLanguage(language) {
      this.$store.commit('setCodeLanguage', language)
    },
  },
}
</script>
