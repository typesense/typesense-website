<template>
  <div class="container">
    <h2 id="showcase" class="text-gradient-1">Showcase</h2>
    <div>
      Built with Typesense, InstantSearch UI components & hosted on Typesense
      Cloud.
    </div>
    <div class="row mt-4">
      <div class="col-sm">
        <div class="grid">
          <HomeShowcaseBlock
            emoji="⚡ 🔍 🎵"
            link="https://songs-search.typesense.org"
          >
            <template #title>
              <small>Instantly Search</small><br />32 Million Songs
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ 🔍 📚"
            link="https://books-search.typesense.org"
          >
            <template #title>
              <small>Instantly Search</small><br />28 Million Books
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ 🔍 🥘"
            link="https://recipe-search.typesense.org"
          >
            <template #title>
              <small>Instantly Search</small><br />2 Million Recipes
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ 🔍 ⌨️"
            link="https://linux-commits-search.typesense.org/"
          >
            <template #title>
              <small>Instantly Search</small><br />1 Million Linux Commits
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ ⌨️"
            link="https://spellcheck.typesense.org/"
          >
            <template #title>
              <small>Spell Checker with</small> <br />AutoComplete & AutoCorrect
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ 🔍️ ⚡"
            link="https://federated-search.typesense.org/"
          >
            <template #title> Federated Search Experiences </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            link="https://github.com/typesense/typesense/blob/master/SHOWCASE.md"
          >
            <template #title>
              <small>See More ></small>
            </template>
          </HomeShowcaseBlock>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-sm">
        <h4 class="mt-4 mb-2">
          Build lightning-fast <em>browsing experiences</em> with Typesense,
          besides just text-based search.
        </h4>
        <div class="mb-3">
          Let users filter, drill down and explore data in, for example, an
          ecommerce store, a tourism site like AirBnB, and more.
        </div>
        <div class="grid">
          <HomeShowcaseBlock
            emoji="⚡ 🔍 📦️"
            link="https://ecommerce-store.typesense.org/"
          >
            <template #title>
              E-Commerce Storefront<br />
              Browsing Experience
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock emoji="⚡ ⌨️" link="https://findxkcd.com/">
            <template #title
              ><small>findxckd</small><br />
              Browse & Find xckd Comics by Topic
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ 🔍 📦️"
            link="https://showcase-nextjs-typesense-ecommerce-store.vercel.app/"
          >
            <template #title>
              E-Commerce Storefront<br />
              with Next.js + Typesense
            </template>
          </HomeShowcaseBlock>
          <HomeShowcaseBlock
            emoji="⚡ 🔍 🌎️"
            link="https://airbnb-geosearch.typesense.org/"
          >
            <template #title>
              AirBnB Browsing Experience<br />
              with 1M listings.
            </template>
          </HomeShowcaseBlock>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-column-gap: 40px;
  grid-row-gap: 28px;
  justify-content: space-evenly;
  align-content: space-evenly;
}
</style>
