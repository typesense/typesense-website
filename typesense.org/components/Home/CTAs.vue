<template>
  <div>
    <a class="btn btn-primary text-left" href="/docs/guide/" role="button">
      <small>Start Building with</small><br />
      <strong>Typesense Open Source</strong>
    </a>
    <br class="d-block d-sm-none" />
    <a
      :class="
        (useOutlineStyleForSecondaryCTA
          ? 'border border-primary btn-primary-outline text-primary text-decoration-none'
          : 'btn-primary') + ` btn text-left ml-sm-2 mt-3 mt-sm-0`
      "
      href="https://cloud.typesense.org"
      role="button"
    >
      <small>Deploy on</small><br />
      <strong>Typesense Cloud</strong>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    useOutlineStyleForSecondaryCTA: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.btn {
  line-height: 1.3;
  padding-bottom: 0.7em;
}
</style>
