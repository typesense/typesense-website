<template>
  <span>
    <a
      href="https://github.com/typesense/typesense"
      class="d-flex align-items-center github-stars"
      target="_blank"
    >
      <img
        src="~/assets/images/github.svg"
        alt="GitHub Stars"
        class="p-0 m-0"
        height="17"
        width="17"
      />
      <span> {{ githubStars }}</span>
    </a>
  </span>
</template>
<script>
export default {
  name: 'GitHubStars',
  data() {
    return {
      githubStars: '19k',
    }
  },
}
</script>

<style lang="scss" scoped>
.github-stars {
  span {
    line-height: 1;
    font-family: sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    margin-left: 6px;
  }
}
a {
  color: $white;
  text-decoration: none;

  &:hover {
    color: $gray-100;
  }
}
</style>
