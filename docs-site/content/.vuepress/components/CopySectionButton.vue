<template>
  <button
    class="copy-section-button"
    @click.prevent.stop="copySection"
    :title="buttonTitle"
    :class="{ copied: isCopied }"
  >
    <span class="icon-container">
      <svg
        class="copy-icon"
        :class="{ hidden: isCopied }"
        xmlns="http://www.w3.org/2000/svg"
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
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  </button>
</template>

<script>
export default {
  name: 'CopySectionButton',
  props: {
    headingText: {
      type: String,
      required: true,
    },
    headingLevel: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isCopied: false,
      copyTimeout: null,
    }
  },
  computed: {
    buttonTitle() {
      return this.isCopied ? 'Section copied!' : 'Copy section as markdown'
    },
    headingMarker() {
      return '#'.repeat(this.headingLevel) + ' '
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
    async copySection() {
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
      }

      try {
        const markdown = this.$page && this.$page.markdown
        if (!markdown) {
          throw new Error('Markdown content not available')
        }

        const sectionMarkdown = this.extractSection(markdown)
        if (!sectionMarkdown) {
          throw new Error('Could not find section')
        }

        await navigator.clipboard.writeText(sectionMarkdown)
        this.isCopied = true

        this.copyTimeout = setTimeout(() => {
          this.isCopied = false
          this.copyTimeout = null
        }, 2000)
      } catch (error) {
        console.error('Failed to copy section:', error)
        alert('Failed to copy section. Please try again.')
      }
    },

    extractSection(markdown) {
      const lines = markdown.split('\n')
      const targetLine = this.headingMarker + this.headingText

      let sectionStart = -1
      let sectionEnd = lines.length

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (sectionStart === -1) {
          if (line === targetLine) {
            sectionStart = i
          }
        } else {
          // start, look for end (next heading of equal or higher level)
          const level = this.getHeadingLevel(line)
          if (level > 0 && level <= this.headingLevel) {
            sectionEnd = i
            break
          }
        }
      }

      if (sectionStart === -1) {
        return null
      }

      return lines.slice(sectionStart, sectionEnd).join('\n')
    },

    getHeadingLevel(line) {
      // count leading # characters followed by space (up to h6)
      let count = 0
      for (let i = 0; i < line.length && i < 7; i++) {
        if (line[i] === '#') {
          count++
        } else if (line[i] === ' ' && count > 0) {
          return count
        } else {
          return 0
        }
      }
      return 0
    },
  },
}
</script>

<style lang="stylus">
.copy-section-button
  display inline-block
  font-size inherit
  margin-left 0.5rem
  padding 0.15em 0.25em
  background none
  border none
  border-radius 0
  cursor pointer
  opacity 0
  vertical-align middle
  color $accentColor
  line-height 1
  outline none
  transition border-radius 0.5s ease

  &:hover
    color hsl(332, 97%, 55%)
    border-radius 0.2rem

  .icon-container
    position relative
    display flex
    align-items center
    justify-content center
    width 0.75em
    height 0.75em

  svg
    position absolute
    display block
    width 100%
    height 100%
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

    &.visible
      transform scale(1) rotate(0deg)
      opacity 1

h2, h3, h4, h5, h6
  &:hover
    > .header-anchor,
    > .copy-section-button
      opacity 1
</style>
