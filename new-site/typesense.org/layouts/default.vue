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
    }
  },
}
</script>
