# Airports Geo Search

This demo indexes 78K Airports around the world and lets you browse them on a map, search by airport details, and filter by a variety of parameters like airport type, elevation, number of runways, etc.

This implementation uses Next.js with React for the frontend and uses [react-instantsearch](https://www.npmjs.com/package/react-instantsearch) with [typesense-instantsearch-adapter](https://www.npmjs.com/package/typesense-instantsearch-adapter) for making search queries to Typesense.

[Live Demo](https://airports-geosearch.typesense.org/) | [Source Code](https://github.com/typesense/showcase-airports-geosearch)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/lib/typesense.ts#L19) how to configure the typesense-instantsearch-adapter for geo search.
- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/components/Map.tsx#L21) how to render the results returned from Typesense as custom markers on Google Maps.
- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/components/Map.tsx#L91-L107) how to perform the search when the user pans the map.
- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/components/Map.tsx#L31-L42) how to automatically pan the map to first match from search results.
- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/components/Map.tsx#L150-L162) how to read map bounds from the URL on first page load when `routing` is enabled on `react-instantsearch` to store search parameters in the URL.
- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/components/Controls.tsx#L44-L47) how to use refinement lists for filtering.
- [Here's](https://github.com/typesense/showcase-airports-geosearch/blob/b7205bb119df2c7b42c8805fa159d1e644906749/src/components/Controls.tsx#L120-L122) how to use range sliders for filtering.
