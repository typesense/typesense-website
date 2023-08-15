# Semantic + Hybrid Search on HackerNews Comments

This site indexes around 300K comments from [HackerNews](https://new.ycombinator.com) 
and let's you browse and search semantically and based on keywords and filter and facet the results. 

[Live Demo](https://hn-comments-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-hn-comments-semantic-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-hn-comments-semantic-search/blob/c55d1e1fee337dc32e4761a2b5ff079c59a44c8c/scripts/indexDataInTypesense.js#L32-L45) how to enable the built-in embedding generation feature of Typesense.
- [Here's](https://github.com/typesense/showcase-hn-comments-semantic-search/blob/c55d1e1fee337dc32e4761a2b5ff079c59a44c8c/scripts/indexDataInTypesense.js#L46-L68) how to use remote embedding services like OpenAI, PaLM API and Vertex AI API to generate embeddings from within Typesense.
- [Here's](https://github.com/typesense/showcase-hn-comments-semantic-search/blob/c55d1e1fee337dc32e4761a2b5ff079c59a44c8c/src/js/index.js#L81-L98) how to configure Instantsearch.js to do semantic / keyword / hybrid searches i.
