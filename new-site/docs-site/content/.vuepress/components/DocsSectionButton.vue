<template>
  <RouterLink :to="sectionLink" class="docs-section-button">
    <h3>
      {{ sectionName }}
    </h3>
  </RouterLink>
</template>

<script>
export default {
  props: {
    sectionName: {
      type: String,
      default: "Section Name"
    },
    sectionLink: {
      type: String,
      default: "#"
    }
  }
};
</script>

<style scoped lang="stylus">
.docs-section-button
  display flex
  align-items center
  justify-content center
  height 120px
  background-color $lightGrayColor

  &:hover
    background-color darken($lightGrayColor, 5%)
</style>
