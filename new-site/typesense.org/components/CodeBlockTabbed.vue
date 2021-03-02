<template>
  <div>
    <BTabs pills card no-fade align="right" class="code-block">
      <div v-for="tab in tabs" :key="tab.displayLanguage">
        <BTab
          :active="activeTab === tab.displayLanguage"
          :title="tab.displayLanguage"
          @click="setCodeLanguage(tab.displayLanguage)"
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
import 'prismjs/components/prism-markup-templating' // https://github.com/PrismJS/prism/issues/1400
import 'prism-themes/themes/prism-darcula.css'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-javascript'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import startCase from 'lodash.startcase'

export default {
  props: {
    stateId: {
      type: String,
      default: 'code-block',
    },
  },
  data() {
    return {
      tabs: [],
    }
  },
  computed: {
    activeTab() {
      return this.$store.state[this.stateId] || 'bash'
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
    setCodeLanguage(displayLanguage) {
      this.$store.commit('setCodeLanguage', {
        codeBlockStateId: this.stateId,
        codeLanguage: displayLanguage,
      })
    },
  },
}
</script>

<style lang="scss">
.code-block {
  filter: drop-shadow(7px 7px 8px rgba(0, 0, 0, 0.33));
  border-radius: $border-radius;
  background-color: $black;

  .card-body {
    padding: 0 1.25rem;
  }

  pre[class*='language-'] {
    margin: 0;
    padding-top: 0;
    padding-bottom: 1.5rem;
    background-color: $black;
  }

  .nav-link {
    color: $white;
    font-size: 0.7rem;
    padding: 0;
    margin-left: 0.5rem;
    margin-right: 1rem;
    border-radius: 0;

    &.active {
      background-color: unset;
      border-bottom: $primary 1px solid;
    }
  }
}
</style>
