<template>
  <a
    class="support-option d-flex flex-column justify-content-end align-content-center"
  >
    <img
      :src="image"
      :alt="name"
      :height="imageHeight"
      :width="imageWidth"
      :style="{ 'margin-bottom': imageMargin }"
    />
    <div class="mt-2">{{ name }}</div>
  </a>
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
    imageWidth: {
      type: Number,
      default: 100,
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
  display: block;
  color: $white;
  width: 100px;
  height: 100px;
  border-bottom: none;
}
</style>
