# Natural Language Search restaurants

This demo restaurant search showcases the **Natural Language Search** feature of Typesense. This allows users to type a free-form sentence into the search bar. Typesense then leverages **Large Language Models** (LLMs) to understand users' intent, automatically translating the natural language query into structured search parameters like filters, sort orders, and relevant keywords.

This implementation uses **Next.js 14 App Router** for the front end, [typesense-js](https://github.com/typesense/typesense-js) client SDK for sending queries to Typesense, [TanStack query](https://tanstack.com/query/latest) for infinite scroll pagination, and [gemini-2.5-flash-lite](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-lite) as the natural language search model.

[Live Demo](https://natural-language-search-restaurants.typesense.org/) | [Source Code](https://github.com/typesense/showcase-natural-language-search-restaurants)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-natural-language-search-restaurants/blob/b376cbe5f0fa222dd5a8e42cb4cf80362f7f33e1/scripts/upsertModel.ts#L33-L67) how to configure Typesense to create or update the natural language search model.
- [Here's](https://github.com/typesense/showcase-natural-language-search-restaurants/blob/b376cbe5f0fa222dd5a8e42cb4cf80362f7f33e1/scripts/upsertModel.ts#L10-L30) an example of using a **custom system prompt** to fine-tune the model's behaviorfor this specific restaurant collection.
- [Here's](https://github.com/typesense/showcase-natural-language-search-restaurants/blob/b376cbe5f0fa222dd5a8e42cb4cf80362f7f33e1/src/app/page.tsx#L74-L86) how to perform a natural language search query using the [typesense-js](https://github.com/typesense/typesense-js) client SDK.
- [Here's](https://github.com/typesense/showcase-natural-language-search-restaurants/blob/b376cbe5f0fa222dd5a8e42cb4cf80362f7f33e1/src/lib/actions.ts#L8-L28) how to implement pagination using the generated params of the initial search request.
- [Here's](https://github.com/typesense/showcase-natural-language-search-restaurants/blob/b376cbe5f0fa222dd5a8e42cb4cf80362f7f33e1/src/app/page.tsx#L71-L79) an example use case where the user's location is embedded in the query to enable geosearch for nearby restaurants.
