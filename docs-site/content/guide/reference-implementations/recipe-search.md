# Recipe Search

This site showcases Typesense in action on a **2 Million** recipe database, with the ability to filter by ingredients.

[Live Demo](https://recipe-search.typesense.org) | [Source Code](https://github.com/typesense/showcase-recipe-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L289) how to use the `refinementList` widget from InstantSearch.js with the `and` operator, to filter results that have ALL the selected values.
- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L264-L278) how to transform results before displaying them.
- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L180-L197) how to customize the search statistics shown to users.
- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L161-L167) how to [not show](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L141-L148) any results if the user hasn't typed a search query.
