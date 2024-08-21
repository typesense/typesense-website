<template>
  <div>
    <BTabs pills card align="right" class="code-block">
      <BTab
        v-for="tab in tabs"
        :key="tab.displayLanguage"
        :active="activeTab === tab.displayLanguage"
        :title="tab.displayLanguage"
        @click="setCodeLanguage(tab.displayLanguage)"
      >
        <pre><code
            :class="[`language-${tab.language}`, underlineLinks ? 'underline-links' : '']">{{ tab.content }}</code></pre>
      </BTab>
    </BTabs>
  </div>
</template>

<script>
import Prism from 'prismjs'
import 'prismjs/components/prism-markup-templating' // https://github.com/PrismJS/prism/issues/1400
import 'prism-themes/themes/prism-darcula.css'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-powershell'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/autolinker/prism-autolinker'
import 'prismjs/plugins/autolinker/prism-autolinker.css'
import startCase from 'lodash.startcase'

export default {
  props: {
    stateId: {
      type: String,
      default: 'code-block',
    },
    underlineLinks: {
      type: Boolean,
      default: false,
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
  mounted() {
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
    this.$nextTick(() => {
      Prism.highlightAll()
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
  border-radius: 15px;
  background-color: darken($secondary-dark-2, 15%);

  .card-body {
    padding: 0 1.25rem;
  }

  pre[class*='language-'] {
    margin: 0;
    padding-top: 0.5rem;
    padding-bottom: 1.5rem;
    background-color: darken($secondary-dark-2, 15%);

    .url-link {
      color: $primary-dark-4;
      text-decoration: none;
    }
  }

  code.underline-links {
    .url-link {
      border-bottom: darken($primary-dark-4, 30%) 1px dotted;
    }
  }

  .nav-link {
    color: $white;
    font-size: 0.7rem;
    padding: 0;
    margin-left: 0.5rem;
    margin-right: 1rem;
    border-radius: 0;
    border-bottom: unset;

    &.active,
    &:hover {
      background-color: unset;
      border-bottom: $primary 1px solid;
    }
  }

  div.code-toolbar > .toolbar {
    bottom: 0.75em;
    top: unset;
  }
}
</style>
