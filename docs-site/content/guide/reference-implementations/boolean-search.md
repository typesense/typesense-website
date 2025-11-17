# Boolean Search 

This demo shows you one way to implement Boolean search logic in Typesense while retaining query_by search functionality, by using tag-based UX features. 

[Live Demo](https://boolean-search-games.typesense.org/) | [Source Code](https://github.com/typesense/showcase-boolean-search-games/)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/5fa513a79868d40243ccf36843b792cac8f20fba/index.js#L118-L207) how to parse an search response for differnt field matches and construct a list of possible tag matchings.
- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/5fa513a79868d40243ccf36843b792cac8f20fba/index.js#L875-L884) how to use Union search to combine multi-search responses client side, and remove duplicates.
- [Here's](https://github.com/typesense/showcase-boolean-search-games/blob/5fa513a79868d40243ccf36843b792cac8f20fba/index.js#L502-L528) how to use construct a filer_by query that uses custom Boolean search logic.
