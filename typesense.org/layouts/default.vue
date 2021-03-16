<template>
  <div>
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
export default {
  head() {
    return {
      bodyAttrs: {
        class: ['footer-lg-margin'],
      },
      meta: [
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.baseURL}${this.$route.fullPath}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Typesense',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Lightning-fast, open source search engine for everyone',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.$config.baseURL}/images/opengraph_banner.png`,
        },
        {
          hid: 'twitter:card',
          property: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'twitter:url',
          property: 'twitter:url',
          content: `${this.$config.baseURL}${this.$route.fullPath}`,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Typesense',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: 'Lightning-fast, open source search engine for everyone',
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: `${this.$config.baseURL}/images/opengraph_banner.png`,
        },
      ],
    }
  },
}
</script>
