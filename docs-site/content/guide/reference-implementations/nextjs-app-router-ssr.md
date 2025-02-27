# Next.js App Router SSR on Steam Games

This site showcases how to use Typesense with Next.js' App Router along with React InstantSearch for server-side rendering on a Steam games dataset.

[Source Code](https://github.com/typesense/showcase-nextjs-instantsearch-next-app-router-ssr-steam-games-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-nextjs-instantsearch-next-app-router-ssr-steam-games-search/blob/78531b79e82ed630a6e6d819618c3d98af817bd1/src/components/search.tsx#L56-L59) how to use the `InstantSearchNext` component from `react-instantsearch-nextjs` to render the search UI on the server.
- [Here's](https://github.com/typesense/showcase-nextjs-instantsearch-next-app-router-ssr-steam-games-search/blob/78531b79e82ed630a6e6d819618c3d98af817bd1/src/components/instantsearch/facet.tsx#L5) how to create the corresponding facet menus for your facettable fields.
- [Here's](https://github.com/typesense/showcase-nextjs-instantsearch-next-app-router-ssr-steam-games-search/blob/master/src/components/instantsearch/range-menu.tsx) how to use a custom double-sided range slider for applying range-based filters.
- [Here's](https://github.com/typesense/showcase-nextjs-instantsearch-next-app-router-ssr-steam-games-search/blob/78531b79e82ed630a6e6d819618c3d98af817bd1/src/components/search.tsx#L70) how to use the `DynamicWidgets` component in React InstantSearch.
- [Here's](https://github.com/typesense/showcase-nextjs-instantsearch-next-app-router-ssr-steam-games-search/blob/master/src/components/instantsearch/current-refinements.tsx) how to build a custom `CurrentRefinements` component in React InstantSearch.
