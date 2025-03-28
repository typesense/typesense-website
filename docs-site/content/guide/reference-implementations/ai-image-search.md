# AI Image Search

This demo showcases Typesense's ability to perform image similarity search and image search using text descriptions.

This implementation uses **Next.js 14 App Router** for the front end and [typesense-js](https://github.com/typesense/typesense-js) client SDK for sending queries to Typesense.

[Live Demo](https://ai-image-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-ai-image-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-ai-image-search/blob/21657eaddbb6d836ef846a9f58fb46cbfd433b03/scripts/indexTypesense.ts#L37-L57) how to configure the collection schema to enable image search.
- [Here's](https://github.com/typesense/showcase-ai-image-search/blob/21657eaddbb6d836ef846a9f58fb46cbfd433b03/scripts/indexTypesense.ts#L60-L105) how to index **large JSONL data** containing base64 strings of images **in batches**.
- [Here's](https://github.com/typesense/showcase-ai-image-search/blob/21657eaddbb6d836ef846a9f58fb46cbfd433b03/src/components/ImageSimilaritySearch.tsx#L48-L53) how to configure the query parameters to search for similar images. Tip: You should [exclude the `embedding` field](https://github.com/typesense/showcase-ai-image-search/blob/21657eaddbb6d836ef846a9f58fb46cbfd433b03/src/components/ImageSimilaritySearch.tsx#L52) from search result for faster loading speed.
- [Here's](https://github.com/typesense/showcase-ai-image-search/blob/21657eaddbb6d836ef846a9f58fb46cbfd433b03/src/components/ImageSearchUsingTextDescriptions.tsx#L18-L24) how to configure the query parameters to search for images using text descriptions.

