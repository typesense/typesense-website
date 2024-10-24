# Podcasts Voice Search

This demo lets you search across 96K podcasts by recording and sending a short audio clip of your voice to Typesense.

This implementation uses **React** for the front end and [typesense-js](https://github.com/typesense/typesense-js) client SDK for sending queries to Typesense.

[Live Demo](https://podcasts-voice-search.typesense.org/) | [Source Code](https://github.com/typesense/showcase-podcasts-voice-search)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-podcasts-voice-search/blob/0bf3b594962bdba9f6cf2d735cbf53d6711d3a6e/scripts/indexTypesense.ts#L35-L54) how to configure the collection schema to enable voice query.
- [Here's](https://github.com/typesense/showcase-podcasts-voice-search/blob/2771bca8853adcd4c7937fb253582dbdda99c94b/src/hooks/useSearch.tsx#L29-L40) how to configure the query parameters to search using base64 encoded audio data.
- [Here's](https://github.com/typesense/showcase-podcasts-voice-search/blob/2771bca8853adcd4c7937fb253582dbdda99c94b/src/hooks/useSearch.tsx#L41-L43) how to get the transcribed query from the search result and use it to [fetch the next page](https://github.com/typesense/showcase-podcasts-voice-search/blob/2771bca8853adcd4c7937fb253582dbdda99c94b/src/hooks/useSearch.tsx#L62-L82).
