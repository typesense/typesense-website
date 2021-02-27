<template>
  <div class="d-inline-block">
    <img :src="image" :alt="name" height="30" /><br />
    {{ name }}
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: 'Name',
    },
  },
}
</script>
