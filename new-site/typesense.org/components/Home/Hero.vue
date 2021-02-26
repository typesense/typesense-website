<template>
  <div>
    <header>
      <Navbar color-scheme="dark" />
    </header>
    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <div class="col-md-7">
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
              <a
                class="btn btn-primary btn-lg text-left"
                href="#"
                role="button"
              >
                <small>Start Building with</small><br />
                <strong>Typesense Open Source</strong>
              </a>
              <a
                class="btn btn-primary btn-lg text-left ml-2"
                href="#"
                role="button"
              >
                <small>Deploy on</small><br />
                <strong>Typesense Cloud</strong>
              </a>
            </p>
          </div>
          <div class="col-md-5">
            <HomeSearchDemo />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
