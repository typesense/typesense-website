<template>
  <a :href="link" target="_blank" class="text-dark">
    <div
      class="showcase-block border border-light px-5 py-4 d-flex align-items-center"
    >
      <h5 class="mb-0">
        {{ emoji }}<br />

        <slot name="title"></slot>
      </h5>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Showcase Title',
    },
    link: {
      type: String,
      default: '/#',
    },
    emoji: {
      type: String,
      default: '',
    },
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

  a {
    border-bottom: unset;
  }
}
</style>
