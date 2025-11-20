<template>
  <div class="theme-default-content copy-markdown-button-wrapper">
    <button class="copy-markdown-button" @click="copyMarkdown" :class="{ copied: isCopied }" :title="buttonTitle">
      <div class="icon-container">
        <svg
          class="copy-icon"
          :class="{ hidden: isCopied }"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg
          class="check-icon"
          :class="{ visible: isCopied }"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span>{{ buttonText }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CopyMarkdownButton',
  data() {
    return {
      isCopied: false,
      markdownContent: '',
      copyTimeout: null,
    }
  },
  computed: {
    buttonText() {
      return 'Copy Markdown'
    },
    buttonTitle() {
      return this.isCopied ? 'Markdown copied to clipboard' : 'Copy markdown source to clipboard'
    },
  },
  watch: {
    $route() {
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
        this.copyTimeout = null
      }
      this.isCopied = false
    },
  },
  beforeDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout)
    }
  },
  methods: {
    async copyMarkdown() {
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
      }

      this.isCopied = true

      try {
        const page = this.$page
        if (!page || !page.relativePath) {
          throw new Error('Page path not found')
        }

        const docsRepo = this.$site.themeConfig.docsRepo || 'typesense/typesense-website'
        const docsDir = this.$site.themeConfig.docsDir || 'docs-site/content'
        const docsBranch = this.$site.themeConfig.docsBranch || 'master'

        const githubRawUrl = `https://raw.githubusercontent.com/${docsRepo}/${docsBranch}/${docsDir}/${page.relativePath}`

        const response = await fetch(githubRawUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch markdown from GitHub')
        }

        let markdown = await response.text()

        markdown = markdown.replace(/^---\n[\s\S]*?\n---\n*/m, '')

        await navigator.clipboard.writeText(markdown)

        this.copyTimeout = setTimeout(() => {
          this.isCopied = false
          this.copyTimeout = null
        }, 2000)
      } catch (error) {
        console.error('Failed to copy markdown:', error)
        this.isCopied = false
        alert('Failed to copy markdown. Please try again.')
      }
    },
  },
}
</script>

<style lang="stylus">
.copy-markdown-button-wrapper
  margin-bottom -6.5rem !important

.copy-markdown-button
  display inline-flex
  align-items center
  gap 0.5rem
  padding 0.5rem 1rem
  background-color #f8f8f8
  border 1px solid #ddd
  border-radius 4px
  color #2c3e50
  font-size 0.875rem
  font-weight 500
  cursor pointer
  transition all 0.2s ease

  &:hover
    background-color #eee
    border-color #ccc

  &:active
    transform scale(0.98)

  &.copied
    background-color #d4edda
    border-color #c3e6cb
    color #155724

  .icon-container
    position relative
    width 16px
    height 16px
    display flex
    align-items center
    justify-content center

  svg
    flex-shrink 0
    position absolute
    transition all 0.3s ease-out

  .copy-icon
    transform scale(1) rotate(0deg)
    opacity 1

    &.hidden
      transform scale(0) rotate(90deg)
      opacity 0

  .check-icon
    transform scale(0) rotate(-90deg)
    opacity 0
    stroke #155724

    &.visible
      transform scale(1) rotate(0deg)
      opacity 1

@media (max-width: 719px)
  .copy-markdown-button
    font-size 0.8125rem
</style>
