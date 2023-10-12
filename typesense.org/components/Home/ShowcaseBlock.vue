<template>
  <a :href="link" target="_blank" class="text-dark">
    <div class="showcase-block px-5 py-4 d-flex align-items-center">
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
  min-width: 300px;
  min-height: 187px;
  box-shadow: 0px 0px 10px 0px #ffdd1720;
  border: 1px solid lighten($gray-100, 1%);
  border-bottom: 3px solid lighten($primary, 1%);

  @media (min-width: map-get($grid-breakpoints, 'sm')) {
    min-width: 200px;
  }

  h5 {
    line-height: 1.3;
  }
}

a {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-decoration-color: $primary;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }
}
</style>
