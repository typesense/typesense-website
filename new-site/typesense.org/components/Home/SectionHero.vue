<template>
  <div class="bg-gradient-1 pb-4">
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
            <p class="mb-0">
              Craft delightful <strong>search-as-you-type</strong> experiences
              with Typesense.
            </p>
            <p class="mt-1">
              Meticulously engineered for
              <span class="text-underline-primary"
                >performance & ease of use</span
              >.
            </p>
            <div class="lead mt-5">
              <HomeCTAs />
            </div>
          </div>
          <div class="col-sm-5">
            <div class="mt-1">&nbsp;</div>
            <HomeSearchDemo class="mt-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jumbotron {
  background-color: unset;
}
</style>
