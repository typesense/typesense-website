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
