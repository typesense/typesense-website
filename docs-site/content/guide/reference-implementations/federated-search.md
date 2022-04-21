# Federated Search

This site indexes usernames and company names, and let you search through both collections in parallel.
This mechanism of searching through multiple collections using a single search query is called Federated Search. 

[Live Demo](https://federated-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-federated-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-federated-search/blob/6bc1a151728cff8cdec24028ceae88da1744269f/src/app.js#L110) how to use Instantsearch.js' `index` widget to build a Federated Search UI.
- [Here's](https://github.com/typesense/showcase-federated-search/blob/6bc1a151728cff8cdec24028ceae88da1744269f/src/app.js#L74-L81) how to configure `typesense-instantsearch-adapter` for Federated Search