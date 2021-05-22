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
            link="https://github.com/typesense/typesense/blob/master/SHOWCASE.md"
          >
            <template #title>
              <small>See More ></small>
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
