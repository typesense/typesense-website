# Demos

Here are some live demos, along with their source code, that showcase how 
to use Typesense's different features. 

These can be used as reference implementations when building your own search applications.

## Recipe Search

[Live Demo](https://recipe-search.typesense.org) | [Source Code](https://github.com/typesense/showcase-recipe-search)

This site showcases Typesense in action on a **2 Million** recipe database, with the ability to filter by ingredients.

#### Key Highlights

- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L289) how to use the `refinementList` widget from InstantSearch.js with the `and` operator, to filter results that have ALL the selected values.
- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L264-L278) how to transform results before displaying them.
- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L180-L197) how to customize the search statistics shown to users.
- [Here's](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L161-L167) how to [not show](https://github.com/typesense/showcase-recipe-search/blob/7a9396a76fbfc4b749531fc34546fa92ba654b10/src/app.js#L141-L148) any results if the user hasn't typed a search query.

## Linux Commits Search

[Live Demo](https://linux-commits-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-linux-commits-search)

This site indexes **1 Million** Linux commit messages in Typesense and lets you browse, search and filter through them.

#### Key Highlights

- [Here's](https://github.com/typesense/showcase-linux-commits-search/blob/40e440e4c9323340ab5584b501a407d001a5354b/src/app.js#L150-L159) how to add Google Analytics to capture client-side search analytics.
- [Here's](https://github.com/typesense/showcase-linux-commits-search/blob/40e440e4c9323340ab5584b501a407d001a5354b/src/app.js#L182) how to use the `infiniteHits` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-linux-commits-search/blob/40e440e4c9323340ab5584b501a407d001a5354b/src/app.js#L248-L275) how to use the `currentRefinements` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-linux-commits-search/blob/40e440e4c9323340ab5584b501a407d001a5354b/src/app.js#L276-L287) how to use the `menu` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-linux-commits-search/blob/40e440e4c9323340ab5584b501a407d001a5354b/src/app.js#L288-L299) how to use the `toggleRefinement` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-linux-commits-search/blob/40e440e4c9323340ab5584b501a407d001a5354b/src/app.js#L376-L408) how to use the `rangeInput` widget in InstantSearch.js.


## Books Search

[Live Demo](https://books-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-books-search)

This site showcases Typesense in action on a **28 Million** books database from [OpenLibrary](https://openlibrary.org/), with the ability to filter by authors and subject.

#### Key Highlights

- [Here's](https://github.com/typesense/showcase-books-search/blob/9fef28b894c79240aebbd4ff5c4b8e0b06441dc9/src/app.js#L133-L146) how to remove stop words from queries.
- [Here's](https://github.com/typesense/showcase-books-search/blob/9fef28b894c79240aebbd4ff5c4b8e0b06441dc9/src/app.js#L185-L194) how to add debounce to search queries to improve performance.
- [Here's](https://github.com/typesense/showcase-books-search/blob/9fef28b894c79240aebbd4ff5c4b8e0b06441dc9/src/app.js#L296-L305) how to configure the `sortBy` widget.
- [Here's](https://github.com/typesense/showcase-books-search/blob/9fef28b894c79240aebbd4ff5c4b8e0b06441dc9/src/app.js#L331-L346) how to initiate a search on click.

## Songs Search

[Live Demo](https://songs-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-songs-search)

A site that showcases Typesense in action on a **32 Million** Songs database from [MusicBrainz](https://musicbrainz.org/).

#### Key Highlights

- [Here's](https://github.com/typesense/showcase-songs-search/blob/e6aeb0bc744e2623bc28ec2a45760da0774f3065/src/app.js#L148-L151) how to boost certain fields over others in Typesense.
- [Here's](https://github.com/typesense/showcase-songs-search/blob/e6aeb0bc744e2623bc28ec2a45760da0774f3065/src/app.js#L268-L284) how to use a `refinementList` widget.
- [Here's](https://github.com/typesense/showcase-songs-search/blob/e6aeb0bc744e2623bc28ec2a45760da0774f3065/src/app.js#L76-L92) how to get the total number of records to display to users.

## Typeahead Spellchecker

[Live Demo](https://spellcheck.typesense.org/) | [Source Code](https://github.com/typesense/showcase-spellcheck)

Typesense's typo correction feature can be used to build interesting experiences like this widget that mimics the type-ahead autocorrect interfaces commonly found in iOS/Android keyboards.

#### Key Highlights

- [Here's](https://github.com/typesense/showcase-spellcheck/blob/a0e4d7ad78421c306dd2c914ced5b8505aa5ca7c/src/index.js#L61-L71) how to do a search query using the [typesense-js](https://github.com/typesense/typesense-js) client directly.
- [Here's](https://github.com/typesense/showcase-spellcheck/blob/master/scripts/index_words.js) how to add records in bulk to Typesense.

## E-Commerce Storefront

[Live Demo](https://ecommerce-store.typesense.org/) | [Source Code](https://github.com/typesense/showcase-ecommerce-store)

In addition to search experiences, Typesense can also be used to build browsing experiences like product listing pages in an ecommerce store.

#### Key Highlights

- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L91) how to update the URL to reflect the state of the page as users click on different widgets.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L107-L116) how to use the `pagination` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L138-L157) how to use the `hierarchicalMenu` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L169-L172) how to use the `rangeSlider` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L173-L184) how to use the `ratingMenu` widget in InstantSearch.js.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L185-L195) how to use Typesense's Dynamic Sorting feature with InstantSearch.js' `sortBy` widget.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L234-L243) how to let users pick the number of results they want to see on the page.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L258-L263) how to let users clear all their filter / refinement selections.
- [Here's](https://github.com/typesense/showcase-ecommerce-store/blob/901f3b2f08aea4950ddd34a394c6b161eaf74658/src/app.js#L266-L279) how to capture analytics on how users are interacting with the widgets and send it to a web analytics tool.

