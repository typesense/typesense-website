<template>
  <div>
    <Navbar color-scheme="dark" />

    <div class="container">
      <h1 v-if="error.statusCode === 404">We couldn't find that page</h1>
      <h1 v-else>An error occurred</h1>
      <NuxtLink to="/">Go Home</NuxtLink> •
      <a
        href="#"
        onclick="Beacon('navigate', '/ask/message/'); Beacon('open'); return false;"
        >Let us know</a
      >
    </div>
  </div>
</template>

<script>
export default {
  layout: 'no-footer',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped>
h1 {
  margin-top: 10rem;
}
</style>
