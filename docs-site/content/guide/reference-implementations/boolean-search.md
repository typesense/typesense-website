# Boolean Search 

This demo shows you one way to implement Boolean search logic in Typesense while retaining query_by search functionality, by using tag-based UX features. 

[Live Demo](https://boolean-search-games.typesense.org/) | [Source Code](https://github.com/typesense/showcase-boolean-search-games/)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/9542c12f9d574e5258c293b1a2c1eb63c9987b06/ui-handlers.js#L270C1-L359) how to parse a search response for differnt field matches and construct a list of possible tag matchings.
- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/9542c12f9d574e5258c293b1a2c1eb63c9987b06/ui-handlers.js#L216-L225) how to use Union search to combine multi-search responses client side, and remove duplicates.
- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/9542c12f9d574e5258c293b1a2c1eb63c9987b06/typesense-queries.js#L163-L189) how to construct a filer_by query that uses custom Boolean Search logic.
