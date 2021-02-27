<template>
  <div :class="['feature']">
    <div class="mb-2">
      <img :src="icon" height="25" />
    </div>
    <h5 class="mb-1">{{ name }}</h5>
    <p :class="['description']">{{ description }}</p>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Feature Name',
    },
    description: {
      type: String,
      default: 'Feature Description',
    },
    icon: {
      type: String,
      default: 'Feature Icon',
    },
  },
}
</script>

<style scoped lang="scss">
.feature {
  .description {
    max-width: 250px;
    font-size: 0.8rem;
    line-height: 1.4;
  }
}
</style>
