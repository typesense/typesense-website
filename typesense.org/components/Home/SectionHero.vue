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
              <img
                src="~assets/images/high-voltage.svg"
                height="22"
                width="22"
                alt="lightning-icon"
              />
              <img
                src="~assets/images/search.svg"
                height="22"
                width="22"
                alt="search-icon"
              />
            </div>
            <h1 class="display-3 text-shadow-primary-1">
              Lightning-fast<br />
              Open Source <br />
              Search<br />
            </h1>
            <h3 class="font-weight-lighter">No PhD required.</h3>
            <div class="mt-5">
              <HomeCTAs use-outline-style-for-secondary-c-t-a="true" />
              <GitHubStars class="mt-4 d-inline-block d-sm-none" />
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

<style scoped>
.jumbotron {
  background-color: unset;
}
</style>
