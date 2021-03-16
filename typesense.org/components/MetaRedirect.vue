<template>
  <p class="container mt-5">
    Redirecting to <a :href="to">{{ to }}</a>
  </p>
</template>
<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  head() {
    return {
      title: 'API | Typesense',
      meta: [
        {
          hid: 'http-equiv',
          'http-equiv': 'refresh',
          content: `0; url=${this.to}`,
        },
      ],
    }
  },
}
</script>
