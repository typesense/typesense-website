<template>
  <div class="bg-gradient-1 pb-sm-4">
    <header>
      <Navbar color-scheme="light" />
    </header>
    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-sm-7 text-white">
            <div class="h4 mb-2">⚡ 🔍</div>
            <h1 class="display-4">
              Lightning-fast,<br />
              Open Source Search.<br />
              No PhD required.
            </h1>
            <p class="mt-4 mt-sm-0 mb-0">
              Craft delightful <strong>search-as-you-type</strong> experiences
              with Typesense.
            </p>
            <p class="mt-3 mt-sm-1">
              Meticulously engineered <br class="d-inline d-sm-none" />
              for
              <span class="text-underline-primary"
                >performance & ease of use</span
              >.
            </p>
            <div class="mt-5">
              <HomeCTAs />
              <GithubButton
                class="mt-4 d-block d-sm-none"
                href="https://github.com/typesense/typesense"
                data-icon="octicon-star"
                data-size="small"
                data-show-count="true"
                aria-label="Star typesense/typesense on GitHub"
                >Star
              </GithubButton>
            </div>
          </div>
          <div class="col-sm-5">
            <div class="mt-4 mt-sm-1">&nbsp;</div>
            <HomeSearchDemo class="mt-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GithubButton from 'vue-github-button'

export default {
  components: {
    GithubButton,
  },
}
</script>

<style scoped>
.jumbotron {
  background-color: unset;
}
</style>
