<template>
  <div>
    <header>
      <Navbar color-scheme="dark" />
    </header>
    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-sm-7">
            <div class="h4 mb-0">⚡ 🔍</div>
            <h1 class="display-4">
              Lightning-fast,<br />
              Open Source Search.<br />
              No PhD required.
            </h1>
            <p class="mb-0">
              Craft delightful <strong>search-as-you-type</strong> experiences
              with Typesense.
            </p>
            <p>Meticulously engineered for performance & ease of use.</p>
            <p class="lead">
              <HomeCTAs />
            </p>
          </div>
          <div class="col-sm-5">
            <HomeSearchDemo />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CTAs from '@/components/Home/CTAs'
export default {
  components: { CTAs },
}
</script>
