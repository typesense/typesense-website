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
  <section class="grid grid-cols-4 gap-4 max-md:gap-2 max-sm:grid-cols-1">
    <div class="flex-col items-center max-md:flex max-md:text-center">
      <Badge>Live</Badge>
      <h2>Showcase</h2>
      <p class="subtext">
        Live Demos, with Full Source.<br />
        Fork Away.
      </p>
      <Button
        link="https://github.com/typesense/typesense/blob/master/SHOWCASE.md"
        class="mt-8 max-md:my-6"
        >See More<ArrowRight
      /></Button>
    </div>
    <CustomLink to="https://songs-search.typesense.org/">
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
    </CustomLink>
    <CustomLink to="https://books-search.typesense.org/">
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
    </CustomLink>
    <CustomLink to="https://recipe-search.typesense.org/">
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
    </CustomLink>
    <CustomLink to="https://linux-commits-search.typesense.org/">
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
    </CustomLink>
    <CustomLink to="https://spellcheck.typesense.org/">
      <div class="card">
        <div class="top-container">
          <div class="top">
            <span>Spell Checker With</span>
            <div class="icon-list"><Flash /> <Search /><Keyboard /></div>
          </div>
          <h5>Auto complete & auto correct</h5>
        </div>
        <HomeSearchPaneIllustration
          searchPlaceHolder="Try typing something..."
        />
      </div>
    </CustomLink>
    <CustomLink to="https://federated-search.typesense.org/">
      <div class="card">
        <div class="top-container">
          <div class="top !items-start">
            <h5>Federated Search Experiences</h5>
            <div class="icon-list"><Flash /> <Search /><Flash /></div>
          </div>
        </div>
        <HomeSearchPaneIllustration :autocompleteItems="['Moen', 'John']" />
      </div>
    </CustomLink>
    <CustomLink to="https://hn-comments-search.typesense.org/">
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
    </CustomLink>
  </section>
  <section class="beyond-search">
    <div class="flex flex-col items-center text-center">
      <Badge>Beyond Search</Badge>
      <h2>
        Build Snappy <br class="show-sm" />
        <strong>browsing experiences</strong>, <br />
        besides just text-based search.
      </h2>
      <p class="subtext !mt-16 mb-7 max-md:!mt-2 max-md:mb-5">
        Compose Powerful Search & Discovery User Interfaces, quickly.
      </p>
    </div>

    <div class="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-md:gap-2">
      <CustomLink to="https://ecommerce-store.typesense.org/">
        <div class="card">
          <div class="title">
            <div class="icon-list">
              <span class="icon-wrapper">
                <img src="/images/showcase/flash-bold.svg" alt="Flash" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/search-bold.svg" alt="Search" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/box-bold.svg" alt="Box" />
              </span>
            </div>
            <h5>E-Commerce Storefront Browsing Experiences</h5>
          </div>
          <ul
            class="illustration-panel grid grid-cols-2 grid-rows-4 gap-1.5 p-3"
          >
            <li
              v-for="item in [
                'Samsung',
                'Go phone',
                'Mobile Phone',
                'Charger',
                'Case',
                'Mobile Phone',
              ]"
              class="flex items-center gap-3 text-nowrap rounded-xl bg-bg-gray-2 px-7 py-4 text-sm tracking-tight text-text-muted"
              :key="item"
            >
              <span class="rounded-full bg-bg p-[5px]"
                ><img src="/images/showcase/phone.svg" alt="Phone icon"
              /></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </CustomLink>
      <CustomLink to="https://findxkcd.com/">
        <div class="card !bg-secondary-bg">
          <div class="title">
            <div class="icon-list">
              <span class="icon-wrapper">
                <img src="/images/showcase/flash-bold.svg" alt="Flash" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/keyboard-bold.svg" alt="Keyboard" />
              </span>
            </div>
            <h5>
              Browse & Find xkcd Comics by
              Topic&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
            </h5>
          </div>
          <div class="illustration-panel flex gap-6 p-3.5">
            <img src="/images/showcase/xkcd-1.png" alt="Xkcd comic 1" />
            <img src="/images/showcase/xkcd-2.png" alt="Xkcd comic 2" />
          </div>
        </div>
      </CustomLink>
      <CustomLink
        to="https://showcase-nextjs-typesense-ecommerce-store.vercel.app/"
      >
        <div class="card">
          <div class="title">
            <div class="icon-list">
              <span class="icon-wrapper">
                <img src="/images/showcase/flash-bold.svg" alt="Flash" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/search-bold.svg" alt="Search" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/box-bold.svg" alt="Box" />
              </span>
            </div>
            <h5>E-Commerce Storefront with Next.js + Typesense</h5>
          </div>
          <ul
            class="illustration-panel grid grid-cols-2 grid-rows-4 gap-1.5 p-3"
          >
            <li
              v-for="item in [
                'Samsung',
                'Go phone',
                'Mobile Phone',
                'Charger',
                'Case',
                'Mobile Phone',
              ]"
              class="flex items-center gap-3 text-nowrap rounded-xl bg-bg-gray-2 px-7 py-4 text-sm tracking-tight text-text-muted"
              :key="item"
            >
              <span class="rounded-full bg-bg p-[5px]"
                ><img src="/images/showcase/phone.svg" alt="Phone icon"
              /></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </CustomLink>
      <CustomLink to="https://airbnb-geosearch.typesense.org/">
        <div class="card">
          <div class="title">
            <div class="icon-list">
              <span class="icon-wrapper">
                <img src="/images/showcase/flash-bold.svg" alt="Flash" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/search-bold.svg" alt="Search" />
              </span>
              <span class="icon-wrapper">
                <img src="/images/showcase/global-bold.svg" alt="Global" />
              </span>
            </div>
            <h5>AirBnB Browsing Experience with 1M listings</h5>
          </div>
          <div class="illustration-panel p-2">
            <img
              class="h-full w-full rounded-2xl object-cover"
              src="/images/showcase/map.png"
              alt="AirBnB search"
            />
          </div>
        </div>
      </CustomLink>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply flex h-[300px] flex-col gap-4 overflow-hidden rounded-2xl bg-bg-gray-2 px-6 pt-6 max-md:h-[230px];
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

.icon-wrapper {
  @apply h-min rounded-full bg-bg p-3 max-md:p-2;
}

.beyond-search .card {
  @apply h-[400px] max-md:max-h-[250px];
}

.beyond-search .icon-list {
  @apply mb-[30px] gap-1.5;
}
.beyond-search h5 {
  @apply mb-6;
}

.illustration-panel {
  @apply min-h-64 w-[486px] rounded-3xl bg-bg shadow-[-5px_4px_34px_0px_rgba(0,0,0,0.10)];
}
.beyond-search .title {
  @apply flex-row-reverse gap-6 max-md:flex;
}
.beyond-search .title h5 {
  @apply flex-1;
}
.beyond-search .title img {
  @apply max-md:size-4;
}
</style>
