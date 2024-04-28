# Paul Graham essays conversational search

This demo indexes and creates embeddings for 220 essays by Paul Graham in Typesense and uses its conversational search features to enable a
natural language chat-based retrieval of the essays. The entire conversation history with the data sources used to generate the response is
stored on Typesense.

This implementation uses **Next.js 14 App Router** for the front end and [typesense-js](https://github.com/typesense/typesense-js) client SDK for sending queries to Typesense.

[Live Demo](https://conversational-search-pg-essays.typesense.org/) | [Source Code](https://github.com/typesense/showcase-conversational-search-pg-essays)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-conversational-search-pg-essays/blob/cec855af2be6cc344be1ffc80354af29893c137e/dataset/indexInTypesense.ts#L39-L48) how to configure Typesense to create embeddings from documents.
- [Here's](https://github.com/typesense/showcase-conversational-search-pg-essays/blob/cec855af2be6cc344be1ffc80354af29893c137e/dataset/indexInTypesense.ts#L58-L64) how to configure an AI model to enable RAG-based responses in conversational search.
- [Here's](https://github.com/typesense/showcase-conversational-search-pg-essays/blob/cec855af2be6cc344be1ffc80354af29893c137e/src/components/Form.tsx#L101) how to call Typesense server using a server action in Next.js.
- [Here's](https://github.com/typesense/showcase-conversational-search-pg-essays/blob/cec855af2be6cc344be1ffc80354af29893c137e/src/lib/actions.ts#L42-L52) how to send conversational search queries to Typesense.
- [Here's](https://github.com/typesense/showcase-conversational-search-pg-essays/blob/cec855af2be6cc344be1ffc80354af29893c137e/src/lib/actions.ts#L62) how to access data-sources used by Typesense to create the responses.
