# Boolean Search 

This demo shows you one way to implement Boolean search logic in Typesense while retaining query_by search functionality, by using tag-based UX features. 

[Live Demo](https://boolean-search-games.typesense.org/) | [Source Code](https://github.com/typesense/showcase-boolean-search-games/)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/1a435847c7adba23ce88a4d2649bf4d0850983da/ui-handlers.js#L245-L386) how to parse a search response for differnt field matches and construct a list of possible tag matchings.
- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/1a435847c7adba23ce88a4d2649bf4d0850983da/ui-handlers.js#L209C5-L217C8) how to use Union search to combine multi-search responses client side, and remove duplicates.
- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/1a435847c7adba23ce88a4d2649bf4d0850983da/typesense-queries.js#L166C1-L192) how to construct a filer_by query that uses custom Boolean Search logic.
