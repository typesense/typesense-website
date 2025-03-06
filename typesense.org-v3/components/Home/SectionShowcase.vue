<script lang="ts" setup>
import ArrowRight from "@/assets/icons/arrow-right.svg";
import Flash from "@/assets/icons/flash.svg";
import Search from "@/assets/icons/search.svg";
import Music from "@/assets/icons/music.svg";
import CopyThin from "@/assets/icons/copy-thin.svg";
import Coffee from "@/assets/icons/coffee.svg";
import Keyboard from "@/assets/icons/keyboard.svg";
import Box from "@/assets/icons/box.svg";
</script>
<template>
  <section class="mt-[200px] grid grid-cols-4 gap-4">
    <div>
      <Badge>Live</Badge>
      <h2>Showcase</h2>
      <p class="subtext">
        Live Demos, with Full Source.<br />
        Fork Away.
      </p>
      <Button class="mt-8">See More<ArrowRight /></Button>
    </div>
    <div class="card">
      <div class="top-container">
        <div class="top">
          <span>Instant Search</span>
          <div class="icon-list"><Flash /> <Search /><Music /></div>
        </div>
        <h5>32 Million Songs</h5>
      </div>
      <HomeSearchPaneIllustration
        searchPlaceHolder="Type in a Song, Artist, Album"
        :autocompleteItems="['Annie’s song Denver', 'Wonderwall Oasis']"
      />
    </div>
    <div class="card !bg-secondary-bg">
      <div class="top-container">
        <div class="top">
          <span>Instant Search</span>
          <div class="icon-list"><Flash /> <Search /><CopyThin /></div>
        </div>
        <h5>28 Million Books</h5>
      </div>
      <HomeSearchPaneIllustration
        searchPlaceHolder="Type in a book title or author"
        :autocompleteItems="['Dale Carnegie', 'Shoe Dog']"
      />
    </div>
    <div class="card">
      <div class="top-container">
        <div class="top">
          <span>Instant Search</span>
          <div class="icon-list"><Flash /> <Search /><Coffee /></div>
        </div>
        <h5>2 Million Recipes</h5>
      </div>
      <HomeSearchPaneIllustration
        searchPlaceHolder="Type in a recipe title"
        :autocompleteItems="['Pineapple', 'Oregano']"
      />
    </div>
    <div class="card">
      <div class="top-container">
        <div class="top">
          <span>Instant Search</span>
          <div class="icon-list"><Flash /> <Search /><Keyboard /></div>
        </div>
        <h5>
          1 Million Linux <br />
          Commits
        </h5>
      </div>
      <HomeSearchPaneIllustration :autocompleteItems="['Noise', 'Cheese']" />
    </div>
    <div class="card">
      <div class="top-container">
        <div class="top">
          <span>Spell Checker With</span>
          <div class="icon-list"><Flash /> <Search /><Keyboard /></div>
        </div>
        <h5>Auto complete & auto correct</h5>
      </div>
      <HomeSearchPaneIllustration searchPlaceHolder="Try typing something..." />
    </div>
    <div class="card">
      <div class="top-container">
        <div class="top !items-start">
          <h5>Federated Search Experiences</h5>
          <div class="icon-list"><Flash /> <Search /><Flash /></div>
        </div>
      </div>
      <HomeSearchPaneIllustration :autocompleteItems="['Moen', 'John']" />
    </div>
    <div class="card">
      <div class="top-container">
        <div class="top !items-start">
          <h5>Semantic Search Experiences</h5>
          <div class="icon-list"><Flash /> <Search /><Box /></div>
        </div>
      </div>
      <HomeSearchPaneIllustration
        searchPlaceHolder="Type in a term, or click on one of the exaples below"
        :autocompleteItems="['Cinema', 'Beethoven']"
      />
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply flex h-[300px] flex-col gap-4 overflow-hidden rounded-2xl bg-bg-gray-2 px-6 pt-6;
}
.top-container {
  @apply flex flex-col gap-2;
}
.top {
  @apply flex items-center justify-between;
}
.top span {
  @apply text-sm capitalize leading-[1.6] tracking-tight;
}
h5 {
  @apply font-heading text-[20px] capitalize leading-none;
}
.icon-list {
  @apply flex gap-2;
}
.icon-list > * {
  @apply text-text-muted;
}
</style>
