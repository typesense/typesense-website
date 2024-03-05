# Guitar Chords Search in different JS frameworks

Sites that showcase how to use Typesense in different Javascript frameworks, using a dataset of 2141 chord shapes of 552 guitar chords.

### NuxtJS

[Live Demo](https://guitar-chords-search-nuxt-js.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-nuxt-js)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-nuxt-js/blob/858eed3e492053a5a4d7490317e138af8d1610d2/plugins/vue-instantsearch.ts#L1-L15) how to set up `vue-instantsearch` in NuxtJS.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-nuxt-js/blob/858eed3e492053a5a4d7490317e138af8d1610d2/components/InfiniteHits.vue#L12C2-L35C23) how to use custom hits template.

### Next.js app router

[Live Demo](https://guitar-chords-search-next-js.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-next-js)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-next-js/blob/efc070bc12c94c3c756ccec001ee28be0127fd80/src/app/page.tsx#L1-L29) how to set up `react-instantsearch` in Next.js app router. If you want to use Server Component for your `page.tsx`, move the search component into its own file and make sure to include the `'use client'` directive at the top.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-next-js/blob/efc070bc12c94c3c756ccec001ee28be0127fd80/src/app/page.tsx#L23) how to use custom hits template.

### Angular v15

[Live Demo](https://guitar-chords-search-angular.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-angular)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-angular/blob/1c7eff40bbf31d2a691a00248bc8479016897165/src/app/app.module.ts#L18) how to set up `angular-instantsearch`.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-angular/blob/1c7eff40bbf31d2a691a00248bc8479016897165/src/app/infinite-hits/infinite-hits.component.html#L1-L31) how to use custom hits template.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-angular/blob/1c7eff40bbf31d2a691a00248bc8479016897165/src/app/infinite-hits/infinite-hits.component.html#L23-L29) how to create a load more hits button and disable it when reaching the last page.

### Vanilla Javascript

[Live Demo](https://guitar-chords-search-vanilla-js.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-vanilla-js)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-vanilla-js/blob/991b8eda250560b32bd0940c3fa43a19d0b3297b/main.js#L7-L38) how to set up `instantsearch.js` in Vite.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-vanilla-js/blob/991b8eda250560b32bd0940c3fa43a19d0b3297b/main.js#L47-L63) how to use custom hits template.

### Astro

[Live Demo](https://guitar-chords-search-astro.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-astro)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-astro/blob/a2a3011717090c989e252f7128953a4294e61682/src/pages/index.astro#L8-L78) how to use `instantsearch.js` in Astro. Make sure to wrap it in a `<script>` tag.

### SolidJS

[Live Demo](https://guitar-chords-search-solid-js.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-solid-js)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-solid-js/blob/9e901d9b3cd4f7edfcfa69320e196e71c43a0c41/src/hooks/createInstantsearch.tsx#L20-L72) how to use `instantsearch.js` in SolidJS. Make sure to wrap it in an `onMount` or `createEffect` function.

### Remix

[Live Demo](https://guitar-chords-search-remix.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-remix)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-remix/blob/b90acf92838be55bd07564580cac1c099fd00a36/app/utils/typesense.ts#L5-L20) how to configure [Typesense Instantsearch Adapter](https://github.com/typesense/typesense-instantsearch-adapter) with [Browser Environment Variables](https://github.com/typesense/showcase-guitar-chords-search-remix/blob/b90acf92838be55bd07564580cac1c099fd00a36/app/root.tsx#L29-L58).
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-remix/blob/b90acf92838be55bd07564580cac1c099fd00a36/app/components/GuitarChordsSearch/GuitarChordsSearch.tsx#L17-L38) how to use `react-instantsearch` in Remix (no SSR).

### SvelteKit

[Live Demo](https://guitar-chords-search-svelte-kit.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-svelte-kit)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-svelte-kit/blob/94aa8ef61849cdc77e2baac9ee5d840093b2859b/src/routes/%2Bpage.svelte#L8-L69) how to use `instantsearch.js` in SvelteKit. Make sure to wrap it in an `onMount` function.

### Qwik

[Live Demo](https://guitar-chords-search-qwik.typesense.org/) | [Source Code](https://github.com/typesense/showcase-guitar-chords-search-qwik)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-qwik/blob/6df8bff3e19a113a621dbfeb6c5ca56988438ac7/src/hooks/useInstantSearch.ts#L12-L73) how to use `instantsearch.js` in Qwik. Make sure to wrap it in `useVisibleTask$`.

### React Native

[Source Code](https://github.com/typesense/showcase-guitar-chords-search-react-native)

- [Here's](https://github.com/typesense/showcase-guitar-chords-search-react-native/blob/2900e804e406253597e101b7d9e92ecafc3f414d/src/components/InfiniteHits.tsx#L6-L33) how to display infinite hits.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-react-native/blob/2eb394c5df440d63c92d0030e31778687dbf104b/src/components/Filters/RefinementList.tsx#L20-L78) how to create a `RefinementList` component with `showmore` and `searchable` attributes.
- [Here's](https://github.com/typesense/showcase-guitar-chords-search-react-native/blob/2eb394c5df440d63c92d0030e31778687dbf104b/src/components/Filters/Filters.tsx#L20-L61) how to create a filter with refinement lists in a modal.
