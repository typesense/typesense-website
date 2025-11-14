#Tag Search

This demo shows you how to build a tag-based search engine in Typesense. It also shows how to implement Boolean search logic using filter_by. 

[Live Demo](https://games-search.typesense.org) | [Source Code](https://github.com/typesense/showcase-tag-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-tag-search/blob/5fa513a79868d40243ccf36843b792cac8f20fba/index.js#L118-L207) how to parse an search response for differnt field matches and construct a list of possible tag matchings.
- [Here's](https://github.com/typesense/showcase-tag-search/blob/5fa513a79868d40243ccf36843b792cac8f20fba/index.js#L875-L884) how to use Union search to combine multi-search responses client side, and remove duplicates.
- [Here's](https://github.com/typesense/showcase-tag-search/blob/5fa513a79868d40243ccf36843b792cac8f20fba/index.js#L502-L528) how to use construct a filer_by query that uses custom Boolean search logic.
