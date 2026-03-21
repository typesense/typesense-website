<template>
  <footer class="page-edit">
    <div v-if="lastUpdated" class="last-updated">
      <span class="prefix">{{ lastUpdatedText }}:</span>
      <span class="time">{{ lastUpdated }}</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'PageEdit',

  computed: {
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
}
</script>

<style lang="stylus">
@require '~@vuepress/theme-default/styles/wrapper.styl'

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem

  .last-updated
    font-size 0.9em
    text-align left
    .prefix
      font-weight 500
      color lighten($textColor, 25%)
    .time
      font-weight 400
      color #767676

@media (max-width: $MQMobile)
  .page-edit
    .last-updated
      font-size 0.8em
      text-align left
</style>
