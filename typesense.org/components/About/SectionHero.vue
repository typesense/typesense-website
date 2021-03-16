<template>
  <div class="jumbotron">
    <div class="container">
      <div class="row">
        <div class="col-sm-9">
          <div class="h4 mb-0 mb-2">⚡ 🔍</div>
          <h1 class="display-4">About Us <br /></h1>
          <p class="mt-4">
            Typesense is an open source, typo tolerant search engine that is
            optimized for <strong>instant sub-50ms searches</strong>, while
            providing an <strong>intuitive developer experience</strong>.
          </p>
          <p>
            We are a lean bootstrapped team of engineers passionate about making
            great search technology accessible to everyone. We believe that
            search technology choices widely available to developers today,
            either have a steep learning curve and a heavy operational burden,
            or are proprietary and expensive.
          </p>
          <p>
            <strong>Our goal is to democratize search</strong>. We want to
            reduce the time-to-market for developers to build a blazing fast
            search experience that provides relevant results out-of-the-box, all
            without breaking the bank and without operational overhead.
          </p>
          <p>
            We are a small team trying to do big things and we believe that open
            sourcing our work helps combine forces with our community and
            force-multiply our collective efforts. If our work resonates with
            you, we’d love to have you
            <a
              href="https://github.com/typesense/typesense/blob/master/CONTRIBUTING.md"
              target="_blank"
              >join us</a
            >.
          </p>
          <div class="mt-5">
            <HomeCTAs />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.jumbotron {
  background-color: unset;
  font-size: 1rem;

  u {
    text-decoration-color: $primary;
  }
}
</style>
