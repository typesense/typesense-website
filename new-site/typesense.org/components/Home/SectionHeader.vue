<template>
  <div>
    <h2 class="text-center">{{ heading }}</h2>
    <div class="text-center">{{ subHeading }}</div>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      default: 'Heading',
    },
    subHeading: {
      type: String,
      default: 'Sub Heading',
    },
  },
}
</script>
