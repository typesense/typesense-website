<template>
  <div class="page-contrib-wrapper" v-if="editLink || markdownUrl || lastUpdated">
    <div class="page-contrib" v-if="editLink || markdownUrl">
      <p class="contrib-text">
        This documentation site is open source. Found an issue?
        <a v-if="editLink" :href="editLink" target="_blank" rel="noopener noreferrer">Edit this page</a
        ><OutboundLink v-if="editLink" /> and send us a Pull Request.
      </p>
      <p class="contrib-text" v-if="markdownUrl">
        For AI Agents: View an easy-to-parse, token-efficient
        <a :href="markdownUrl" target="_blank">Markdown version</a> of this page. You can also replace
        <code>.html</code> with <code>.md</code> in any docs URL. For paths ending in <code>/</code>, append
        <code>README.md</code> to the path.
      </p>
    </div>

    <div v-if="lastUpdated" class="last-updated">
      <span class="prefix">{{ lastUpdatedText }}:</span>
      <span class="time">{{ lastUpdated }}</span>
    </div>
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import { endingSlashRE, outboundRE } from '@vuepress/theme-default/util'

export default {
  name: 'PageContrib',

  computed: {
    editLink() {
      const showEditLink = isNil(this.$page.frontmatter.editLink)
        ? this.$site.themeConfig.editLinks
        : this.$page.frontmatter.editLink

      const { repo, docsDir = '', docsBranch = 'master', docsRepo = repo } = this.$site.themeConfig

      if (showEditLink && docsRepo && this.$page.relativePath) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, this.$page.relativePath)
      }
      return null
    },

    markdownUrl() {
      const url = this.$page && this.$page.markdownUrl
      if (!url) return null
      return this.$withBase(url)
    },

    lastUpdated() {
      return this.$page.lastUpdated
    },

    lastUpdatedText() {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
  },

  methods: {
    createEditLink(repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(docsRepo)) {
        const base = docsRepo
        return (
          base.replace(endingSlashRE, '') +
          `/src` +
          `/${docsBranch}/` +
          (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
          path +
          `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const gitlab = /gitlab.com/
      if (gitlab.test(docsRepo)) {
        const base = docsRepo
        return (
          base.replace(endingSlashRE, '') +
          `/-/edit` +
          `/${docsBranch}/` +
          (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
          path
        )
      }

      const base = outboundRE.test(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`
      return (
        base.replace(endingSlashRE, '') +
        '/edit' +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
        path
      )
    },
  },
}
</script>

<style lang="stylus">
@require '~@vuepress/theme-default/styles/wrapper.styl'

.page-contrib-wrapper
  @extend $wrapper
  padding-top 12rem
  padding-bottom 1.5rem

.page-contrib
  border 1px solid #e2e8f0
  border-radius 6px
  padding 0.75rem 1rem

  .contrib-text
    margin 0
    font-size 0.9em
    color lighten($textColor, 25%)
    line-height 1.6

    & + .contrib-text
      margin-top 0.25rem

    a
      color $accentColor
      font-weight 500

    code
      font-size 0.85em
      padding 0.15em 0.35em
      background-color #e2e8f0
      border-radius 3px

.page-contrib-wrapper .last-updated
  margin-top 0.75rem
  font-size 0.9em
  text-align left
  .prefix
    font-weight 500
    color lighten($textColor, 25%)
  .time
    font-weight 400
    color #767676

@media (max-width: $MQMobile)
  .page-contrib-wrapper .last-updated
    font-size 0.8em
</style>
