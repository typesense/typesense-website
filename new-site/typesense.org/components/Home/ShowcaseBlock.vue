<template>
  <div
    class="showcase-block border border-light px-5 py-4 d-flex align-items-center"
  >
    <h5 class="mb-0">
      {{ emoji }}<br />
      <a :href="link" target="_blank" class="text-dark">
        <span v-html="title"></span>
      </a>
    </h5>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    link: String,
    emoji: String,
  },
}
</script>

<style scoped lang="scss">
.showcase-block {
  max-width: 300px;
  width: 300px;
  height: 150px;

  h5 {
    line-height: 1.3;
  }
}
</style>
