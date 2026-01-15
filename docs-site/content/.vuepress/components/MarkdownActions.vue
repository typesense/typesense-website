<template>
  <div class="markdown-actions">
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
    <a v-if="markdownUrl" :href="markdownUrl" class="view-markdown-button" title="View raw markdown" target="_blank">
      <svg
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
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  name: 'MarkdownActions',
  data() {
    return {
      isCopied: false,
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
    markdownUrl() {
      return this.$page && this.$page.markdownUrl
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
        if (!page || !page.markdown) {
          throw new Error('Markdown content not available')
        }

        await navigator.clipboard.writeText(page.markdown)

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
.h1-with-actions
  display flex
  align-items center
  justify-content space-between
  gap 1rem
  width 100%

  h1
    flex 1
    margin 0

.h1-actions-mount
  flex-shrink 0

.h1-with-actions > .markdown-actions
  flex-shrink 0

.markdown-actions
  display flex
  align-items stretch
  border 1px solid #e1e1e1
  border-radius 3px
  overflow hidden
  background-color #f8f8f8

.copy-markdown-button
  display inline-flex
  align-items center
  gap 0.35rem
  padding 0.2rem 0.45rem
  background-color transparent
  border none
  border-right 1px solid #e1e1e1
  color #2c3e50
  font-size 0.75rem
  font-weight 500
  cursor pointer
  transition all 0.2s ease
  white-space nowrap

  &:hover
    background-color rgba(0, 0, 0, 0.04)

  &:active
    background-color rgba(0, 0, 0, 0.08)

  &.copied
    background-color #d4edda
    color #155724

  .icon-container
    position relative
    width 12px
    height 12px
    display flex
    align-items center
    justify-content center

  svg
    flex-shrink 0
    position absolute
    transition all 0.3s ease-out
    width 12px
    height 12px

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

.view-markdown-button
  display inline-flex
  align-items center
  justify-content center
  padding 0 0.45rem
  color #2c3e50
  line-height 1

  svg
    width 12px
    height 12px
  display inline-flex
  align-items center
  justify-content center
  padding 0.5rem
  background-color transparent
  border none
  color #2c3e50
  cursor pointer
  transition all 0.2s ease
  text-decoration none

  &:hover
    background-color rgba(0, 0, 0, 0.04)

  &:active
    background-color rgba(0, 0, 0, 0.08)

  svg
    flex-shrink 0

@media (max-width: 719px)
  .copy-markdown-button
    font-size 0.8125rem
    padding 0.5rem 0.75rem

  .h1-with-actions
    flex-direction column
    align-items flex-start

    h1
      width 100%

    .h1-actions-mount
      width 100%
</style>
