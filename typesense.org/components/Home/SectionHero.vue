<template>
  <div class="bg-gradient-1 pb-sm-4">
    <header>
      <Navbar color-scheme="light" />
    </header>
    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-sm-7 text-white">
            <div class="h4 mb-2">
              <img src="~assets/images/high-voltage.svg" height="22" />
              <img src="~assets/images/search.svg" height="22" />
            </div>
            <h1 class="display-3 text-shadow-primary-1">
              Lightning-fast<br />
              Open Source <br />
              Search<br />
            </h1>
            <h3 class="font-weight-lighter">No PhD required.</h3>
            <div class="mt-5">
              <HomeCTAs />
              <a href="https://github.com/typesense/typesense">
                <img
                  src="https://img.shields.io/github/stars/typesense/typesense?style=social"
                  alt="GitHub Stars"
                  class="mt-4 d-block d-sm-none"
                  height="20"
                />
              </a>
            </div>
          </div>
          <div class="col-sm-5">
            <div class="mt-4 mt-sm-3">&nbsp;</div>
            <HomeSearchDemo class="mt-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.jumbotron {
  background-color: unset;
}
</style>
