<template>
  <div class="markdown-actions">
    <button class="copy-markdown-button" :class="{ copied: isCopied }" :title="buttonTitle" @click="copyMarkdown">
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
      <span class="copy-markdown-label">{{ buttonText }}</span>
    </button>
    <div v-if="hasLanguageFilters" class="copy-options">
      <button
        class="copy-options-button"
        type="button"
        aria-haspopup="dialog"
        :aria-expanded="showOptions ? 'true' : 'false'"
        title="Choose copied languages"
        @click.prevent.stop="toggleOptions"
      >
        <svg
          class="copy-options-braces"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M10 3C7.6 3 6.5 4.3 6.5 6.8v1.8c0 1.2-.6 2.1-2 2.7 1.4.5 2 1.5 2 2.7v1.8c0 2.5 1.1 3.8 3.5 3.8" />
          <path d="M14 3c2.4 0 3.5 1.3 3.5 3.8v1.8c0 1.2.6 2.1 2 2.7-1.4.5-2 1.5-2 2.7v1.8c0 2.5-1.1 3.8-3.5 3.8" />
        </svg>
        <svg
          class="copy-options-chevron"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <transition name="copy-options-popover">
        <div v-if="showOptions" ref="optionsPopover" class="copy-options-popover" role="dialog" @click.stop>
          <div class="copy-options-heading">
            <div class="copy-options-heading-text">
              <span>Copy languages</span>
              <div class="copy-options-description">Choose which tabbed code examples are included when copying markdown.</div>
            </div>
          </div>
          <div class="copy-options-meta">
            <div class="copy-options-title">{{ availableLanguageCount }} available on this page</div>
            <button type="button" class="copy-options-clear" @click.prevent.stop="toggleAllAvailableLanguages">
              {{ allAvailableLanguagesSelected ? 'Deselect all' : 'Select all' }}
            </button>
          </div>
          <button
            v-for="language in languageOptions"
            :key="language"
            type="button"
            class="copy-language-option"
            :class="{ unavailable: !isLanguagePresent(language), active: isLanguageSelected(language) }"
            :disabled="!isLanguagePresent(language)"
            :aria-checked="isLanguageSelected(language) ? 'true' : 'false'"
            :aria-disabled="!isLanguagePresent(language) ? 'true' : 'false'"
            role="checkbox"
            @click.prevent.stop="handleLanguageClick(language)"
          >
            <span class="copy-language-option-main">
              <span class="copy-language-checkbox" :data-state="isLanguageSelected(language) ? 'checked' : 'unchecked'">
                <svg
                  v-if="isLanguageSelected(language)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span>{{ language }}</span>
            </span>
            <span v-if="!isLanguagePresent(language)" class="copy-language-status">Unavailable</span>
          </button>
        </div>
      </transition>
    </div>
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
const {
  COPY_LANGUAGE_OPTIONS,
  filterMarkdownByCopyLanguages,
  getPreferredCopyLanguages,
  setPreferredCopyLanguages,
} = require('../util/markdownCopyFilter')

export default {
  name: 'MarkdownActions',
  data() {
    return {
      isCopied: false,
      copyTimeout: null,
      selectedLanguages: [],
      showOptions: false,
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
      const url = this.$page && this.$page.markdownUrl
      if (!url) return null
      return this.$withBase(url)
    },
    presentLanguages() {
      const languages = this.$page && this.$page.markdownCopyLanguages
      return Array.isArray(languages) ? languages : []
    },
    languageOptions() {
      return COPY_LANGUAGE_OPTIONS
    },
    hasLanguageFilters() {
      return this.presentLanguages.length > 0
    },
    availableLanguageCount() {
      return this.presentLanguages.length
    },
    allAvailableLanguagesSelected() {
      if (this.presentLanguages.length === 0) {
        return false
      }

      return this.presentLanguages.every(language => this.selectedLanguages.includes(language))
    },
  },
  watch: {
    $route() {
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
        this.copyTimeout = null
      }
      this.isCopied = false
      this.showOptions = false
      this.selectedLanguages = this.normalizeStoredLanguages(getPreferredCopyLanguages())
    },
  },
  mounted() {
    this.selectedLanguages = this.normalizeStoredLanguages(getPreferredCopyLanguages())
    document.addEventListener('click', this.closeOptionsOnOutsideClick)
    document.addEventListener('keydown', this.closeOptionsOnEscape)
  },
  beforeDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout)
    }
    document.removeEventListener('click', this.closeOptionsOnOutsideClick)
    document.removeEventListener('keydown', this.closeOptionsOnEscape)
  },
  methods: {
    normalizeStoredLanguages(languages) {
      return this.languageOptions.filter(language => languages.includes(language))
    },
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

        const markdown = filterMarkdownByCopyLanguages(
          page.markdown,
          page.markdownCopyTabGroups,
          this.selectedLanguages,
        )

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
    toggleOptions() {
      this.showOptions = !this.showOptions
    },
    isLanguageSelected(language) {
      return this.isLanguagePresent(language) && this.selectedLanguages.includes(language)
    },
    isLanguagePresent(language) {
      return this.presentLanguages.includes(language)
    },
    handleLanguageClick(language) {
      if (!this.isLanguagePresent(language)) {
        return
      }

      this.toggleLanguage(language)
    },
    toggleLanguage(language) {
      if (this.isLanguageSelected(language)) {
        this.selectedLanguages = this.selectedLanguages.filter(selectedLanguage => selectedLanguage !== language)
      } else {
        if (!this.selectedLanguages.includes(language)) {
          this.selectedLanguages = this.selectedLanguages.concat(language)
        }
      }

      setPreferredCopyLanguages(this.selectedLanguages)
    },
    toggleAllAvailableLanguages() {
      if (this.allAvailableLanguagesSelected) {
        this.selectedLanguages = this.selectedLanguages.filter(language => !this.isLanguagePresent(language))
      } else {
        this.selectedLanguages = this.presentLanguages.slice()
      }

      setPreferredCopyLanguages(this.selectedLanguages)
    },
    closeOptionsOnOutsideClick(event) {
      if (!this.showOptions) {
        return
      }

      const popover = this.$refs.optionsPopover
      if (this.$el.contains(event.target) || (popover && popover.contains(event.target))) {
        return
      }

      this.showOptions = false
    },
    closeOptionsOnEscape(event) {
      if (event.key === 'Escape') {
        this.showOptions = false
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
  position relative
  border 1px solid #e1e1e1
  border-radius 3px
  overflow visible
  background-color #f8f8f8

.copy-markdown-button
  display inline-flex
  align-items center
  justify-content center
  gap 0.35rem
  padding 0.2rem 0.45rem
  background-color transparent
  border none
  border-right 1px solid #e1e1e1
  color #2c3e50
  font-size 0.75rem
  font-weight 500
  line-height 1
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

  > span
    display inline-flex
    align-items center
    line-height 1

  .copy-markdown-label
    display inline-flex
    align-items center

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

.copy-options
  position relative
  display flex

.copy-options-button
  display inline-flex
  align-items center
  justify-content center
  gap 0.2rem
  padding 0 0.45rem
  background-color transparent
  border none
  border-right 1px solid #e1e1e1
  color #2c3e50
  font-size 0.75rem
  font-weight 500
  line-height 1
  cursor pointer
  transition all 0.2s ease

  &:hover
    background-color rgba(0, 0, 0, 0.04)

  &[aria-expanded='true']
    background-color rgba(217, 3, 104, 0.04)

  .copy-options-braces
    display block
    flex-shrink 0
    width 1rem
    height 1rem
    transition color 0.18s ease

  .copy-options-chevron
    flex-shrink 0
    width 0.55rem
    height 0.55rem
    opacity 0.6
    transition transform 0.2s ease

  &[aria-expanded='true'] .copy-options-chevron
    transform rotate(180deg)

.copy-options-popover
  position absolute
  top calc(100% + 0.35rem)
  right 0
  z-index 20
  width 15rem
  margin-top 0.25rem
  padding 0.5rem
  background $white
  border 1px solid $borderColor
  border-radius 8px
  box-shadow 0 12px 28px rgba(49, 49, 50, 0.12)
  font-family inherit
  transform-origin top right

.copy-options-popover-enter-active,
.copy-options-popover-leave-active
  transition opacity 0.18s ease, transform 0.18s ease

.copy-options-popover-enter,
.copy-options-popover-leave-to
  opacity 0
  transform translateY(-4px) scale(0.98)

.copy-options-heading
  display flex
  align-items flex-start
  padding 0.1rem 0.5625rem 0.55rem
  margin-bottom 0.4rem
  border-bottom 1px solid $borderColor
  color $textColor
  font-size 0.95rem
  font-weight 600
  white-space nowrap

.copy-options-heading-text
  display flex
  flex-direction column
  align-items flex-start
  min-width 0

.copy-options-meta
  display flex
  align-items center
  justify-content space-between
  gap 0.75rem
  padding 0 0.5625rem 0.45rem

.copy-options-title
  color lighten($textColor, 35%)
  font-size 0.68rem
  font-weight 500
  white-space nowrap

.copy-options-description
  padding-top 0.2rem
  color lighten($textColor, 18%)
  font-size 0.72rem
  font-weight 400
  line-height 1.4
  white-space normal

.copy-language-option
  display flex
  align-items center
  justify-content space-between
  width 100%
  gap 0.65rem
  padding 0.45rem 0.5rem
  margin 0
  color $textColor
  line-height 1.3
  text-align left
  background transparent
  border 1px solid transparent
  border-radius 4px
  cursor pointer
  transition background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease

  &:hover
    background $lightGrayColor

  &:active
    background darken($lightGrayColor, 4%)

  &:disabled
    cursor not-allowed

  &.active
    border-color transparent

  &.unavailable
    color lighten($textColor, 38%)

    .copy-language-option-main
      color lighten($textColor, 38%)

    .copy-language-checkbox
      background lighten($borderColor, 45%)
      border-color lighten($borderColor, 12%)
      color transparent

    > span:first-of-type + span
      color lighten($textColor, 45%)
      font-weight 500

  &.unavailable:hover
    background transparent
    border-color transparent

.copy-language-option-main
  display inline-flex
  align-items center
  gap 0.65rem
  min-width 0

.copy-language-checkbox
  display inline-flex
  align-items center
  justify-content center
  flex-shrink 0
  width 1rem
  height 1rem
  padding 0
  background $white
  border 1.5px solid darken($borderColor, 14%)
  border-radius 3px
  color #fff
  transition background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease

  &[data-state='checked']
    background $accentColor
    border-color $accentColor
    box-shadow 0 0 0 1px rgba(213, 39, 131, 0.08)

  svg
    width 0.7rem
    height 0.7rem

.copy-language-status
  margin-left auto
  color lighten($textColor, 45%)
  font-size 0.65rem
  font-weight 600
  letter-spacing 0

.copy-options-clear
  display inline-flex
  align-items center
  justify-content center
  flex-shrink 0
  padding 0
  background transparent
  border none
  color $accentColor
  font-size 0.68rem
  font-weight 600
  cursor pointer
  transition color 0.15s ease

  &:hover
    text-decoration underline

@media (max-width: 719px)
  .markdown-actions
    max-width 100%
    flex-wrap wrap

  .copy-markdown-button
    font-size 0.8125rem
    padding 0.5rem 0.75rem
    min-width 0

  .copy-options-button
    font-size 0.8125rem
    padding 0 0.45rem

  .copy-options
    position static

  .copy-options-popover
    left 0
    right auto
    width 15rem
    max-width 92vw

  .copy-options-meta
    gap 0.5rem

  .copy-options-title
    white-space normal

  .copy-options-clear
    flex-shrink 0

  .copy-language-option
    gap 0.5rem

  .copy-language-status
    font-size 0.62rem

  .h1-with-actions
    flex-direction column
    align-items flex-start

    h1
      width 100%

    .h1-actions-mount
      width 100%
</style>
