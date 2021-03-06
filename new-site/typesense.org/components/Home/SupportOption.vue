<template>
  <div
    class="support-option d-flex flex-column justify-content-end align-content-center"
  >
    <img
      :src="image"
      :alt="name"
      :height="imageHeight"
      :style="{ 'margin-bottom': imageMargin }"
    />
    <div class="mt-2">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: null,
    },
    imageHeight: {
      type: Number,
      default: 50,
    },
    imageMargin: {
      type: String,
      default: '0',
    },
    name: {
      type: String,
      default: 'Name',
    },
  },
}
</script>

<style scoped lang="scss">
.support-option {
  width: 100px;
  height: 100px;
}
</style>
