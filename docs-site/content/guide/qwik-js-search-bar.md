# Building a Search Bar in Qwik

Adding full-text search capabilities to your Qwik projects has never been easier. This walkthrough will take you through all the steps required to build a simple book search application using Qwik and the Typesense ecosystem.

## What is Typesense?

Typesense is a modern, open-source search engine designed to deliver fast and relevant search results. It's like having a smart search bar that knows what your users want, even when they don't type it perfectly.

Picture this: you're running an e-commerce store selling electronic gadgets. A customer searches for "ipone 13 pro" (with a typo). Instead of showing "no results found" and losing a potential sale, Typesense understands they meant "iPhone 13 Pro" and shows them exactly what they're looking for. That's the power of intelligent search!

What sets Typesense apart:

- **Speed** - Delivers search results in under 50ms, keeping your users engaged.
- **Typo tolerance** - Handles misspellings gracefully, so users always find what they need.
- **Feature-Rich** - Full-text search, Synonyms, Curation Rules, Semantic Search, Hybrid search, Conversational Search (like ChatGPT for your data), RAG, Natural Language Search, Geo Search, Vector Search and much more wrapped in a single binary for a batteries-included developer experience.
- **Simple setup** - Get started in minutes with Docker, no complex configuration needed like Elasticsearch.
- **Cost-effective** - Self-host for free, unlike expensive alternatives like Algolia.
- **Open source** - Full control over your search infrastructure, or use [Typesense Cloud](https://cloud.typesense.org) for hassle-free hosting.

## Prerequisites

This guide will use [Qwik](https://qwik.dev/), a resumable framework for building instant-loading web applications.

Please ensure you have [Node.js](https://nodejs.org/en) and [Docker](https://docs.docker.com/get-docker/) installed on your machine before proceeding. You will need it to run a typesense server locally and load it with some data. This will be used as a backend for this project.

This guide will use a Linux environment, but you can adapt the commands to your operating system.

## Step 1: Setup your Typesense server

Once Docker is installed, you can run a Typesense container in the background using the following commands:

- Create a folder that will store all searchable data stored for Typesense:

  ```shell
  mkdir "$(pwd)"/typesense-data
  ```

- Run the Docker container:

  <Tabs :tabs="['Shell']">
    <template v-slot:Shell>
      <div class="manual-highlight">
        <pre class="language-bash"><code>export TYPESENSE_API_KEY=xyz
  docker run -p 8108:8108 \
    -v"$(pwd)"/typesense-data:/data typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }} \
    --data-dir /data \
    --api-key=$TYPESENSE_API_KEY \
    --enable-cors \
    -d</code></pre>
      </div>
    </template>
  </Tabs>

- Verify if your Docker container was created properly:

  ```shell
  docker ps
  ```

- You should see the Typesense container running without any issues:

  ```shell
  CONTAINER ID   IMAGE                      COMMAND                  CREATED       STATUS       PORTS                                         NAMES
  82dd6bdfaf66   typesense/typesense:latest   "/opt/typesense-serv…"   1 min ago   Up 1 minutes   0.0.0.0:8108->8108/tcp, [::]:8108->8108/tcp   nostalgic_babbage
  ```

- That's it! You are now ready to create collections and load data into your Typesense server.

:::tip
You can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with a management UI, high availability, globally distributed search nodes and more.
:::
 
## Step 2: Create a new books collection and load sample dataset into Typesense

Typesense needs you to create a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">collection</RouterLink> in order to search through documents. A collection is a named container that defines a schema and stores indexed documents for search. Collection bundles three things together:

  1. Schema
  2. Document
  3. Index

You can create the books collection for this project using this `curl` command:

```shell
curl "http://localhost:8108/collections" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      -d '{
        "name": "books",
        "fields": [
          {"name": "title", "type": "string", "facet": false},
          {"name": "authors", "type": "string[]", "facet": true},
          {"name": "publication_year", "type": "int32", "facet": true},
          {"name": "average_rating", "type": "float", "facet": true},
          {"name": "image_url", "type": "string", "facet": false},
          {"name": "ratings_count", "type": "int32", "facet": true}
        ],
        "default_sorting_field": "ratings_count"
      }'
```

Now that the collection is set up, we can load the sample dataset.

1. Download the sample dataset:

    ```shell
    curl -O https://dl.typesense.org/datasets/books.jsonl.gz
    ```

2. Unzip the dataset:

    ```shell
    gunzip books.jsonl.gz
    ```

3. Load the dataset in to Typesense:

    ```shell
    curl "http://localhost:8108/collections/books/documents/import" \
          -X POST \
          -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
          --data-binary @books.jsonl
    ```

You should see a bunch of success messages if the data load is successful.

Now you're ready to actually build the application.

## Step 3: Set up your Qwik project

Create a new Qwik project using this command:

```shell
npm create qwik@latest
```

When prompted, choose the following options:

- Project name: `typesense-qwik-search`
- Starter: `Empty App`
- Install dependencies: `Yes`

Once your project scaffolding is ready, navigate to the project directory and install the required dependencies:

```shell
cd typesense-qwik-search
npm i typesense typesense-instantsearch-adapter instantsearch.js instantsearch.css
```

Let's go over these dependencies one by one:

- **typesense**
  - Official JavaScript client for Typesense.
  - It isn't required for the UI, but it is needed if you want to interact with the Typesense server from server-side code.
- **instantsearch.js**
  - A vanilla JavaScript library from Algolia that provides widgets for building search interfaces.
  - Offers components like searchBox, hits and others that make displaying search results easy.
  - It also abstracts state management and other complex stuff.
  - By itself, it's designed to work with Algolia's hosted search service and not Typesense.
- [**typesense-instantsearch-adapter**](https://github.com/typesense/typesense-instantsearch-adapter)
  - This is the key library that acts as a bridge between `instantsearch.js` and our self-hosted Typesense server.
  - This implements the `InstantSearch.js` adapter that the library expects.
  - Translates the `InstantSearch.js` queries to Typesense API calls.
- **instantsearch.css**
  - Pre-built CSS themes for InstantSearch widgets.
  - We'll use the Satellite theme for a clean, modern look.

## Project Structure

Let's create the project structure step by step. After each step, we'll show you how the directory structure evolves.

1. After creating the basic Qwik app and installing the required dependencies, your project structure should look like this:

    ```plaintext
    typesense-qwik-search/
    ├── node_modules/
    ├── public/
    │   ├── favicon.svg
    │   ├── manifest.json
    │   └── robots.txt
    ├── src/
    │   ├── components/
    │   │   └── router-head/
    │   ├── routes/
    │   │   └── index.tsx
    │   ├── entry.dev.tsx
    │   ├── entry.preview.tsx
    │   ├── entry.ssr.tsx
    │   ├── global.css
    │   └── root.tsx
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
    ```

2. Create the environment variables file:

    ```bash
    touch .env
    ```

    Add this to `.env`:

    ```env
    PUBLIC_TYPESENSE_API_KEY=xyz
    PUBLIC_TYPESENSE_HOST=localhost
    PUBLIC_TYPESENSE_PORT=8108
    PUBLIC_TYPESENSE_PROTOCOL=http
    PUBLIC_TYPESENSE_INDEX=books
    ```

3. Create the `utils` directory and `typesense.ts` file:

    ```bash
    mkdir -p src/utils
    touch src/utils/typesense.ts
    ```

    Your project structure should now look like this:

    ```plaintext
    typesense-qwik-search/
    ├── src/
    │   ├── components/
    │   │   └── router-head/
    │   ├── routes/
    │   │   └── index.tsx
    │   ├── utils/
    │   │   └── typesense.ts
    │   ├── entry.dev.tsx
    │   ├── entry.preview.tsx
    │   ├── entry.ssr.tsx
    │   ├── global.css
    │   └── root.tsx
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
    ```

4. Copy this code into `src/utils/typesense.ts`:

    ```typescript
    import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

    const getPort = (envPort: string | undefined): number => {
      if (!envPort) return 8108;
      const parsed = Number(envPort);
      return isNaN(parsed) ? 8108 : parsed;
    };

    export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
      server: {
        apiKey: import.meta.env.PUBLIC_TYPESENSE_API_KEY || "xyz",
        nodes: [
          {
            host: import.meta.env.PUBLIC_TYPESENSE_HOST || "localhost",
            port: getPort(import.meta.env.PUBLIC_TYPESENSE_PORT),
            protocol: import.meta.env.PUBLIC_TYPESENSE_PROTOCOL || "http",
          },
        ],
      },
      additionalSearchParameters: {
        query_by: "title,authors",
        query_by_weights: "4,2",
        num_typos: 1,
        sort_by: "ratings_count:desc",
      },
    });

    export const searchClient = typesenseInstantsearchAdapter.searchClient;
    export const INDEX_NAME = import.meta.env.PUBLIC_TYPESENSE_INDEX || "books";
    ```

    This config file creates a reusable adapter that connects your Qwik application to your Typesense backend. The `additionalSearchParameters` configure how search works:
    - `query_by`: Search across title and authors fields
    - `query_by_weights`: Title is weighted 2x more than authors (4:2 ratio)
    - `num_typos`: Allow 1 typo for fuzzy matching
    - `sort_by`: Sort results by popularity (ratings count)

5. Create the types directory and Book type:

    ```bash
    mkdir -p src/types
    touch src/types/Book.ts
    ```

    Add this to `src/types/Book.ts`:

    ```typescript
    export interface Book {
      id: string;
      title: string;
      authors: string[];
      publication_year: number;
      average_rating: number;
      image_url: string;
      ratings_count: number;
    }
    ```

6. Create the component files:

    ```bash
    touch src/components/BookCard.tsx
    touch src/components/BookList.tsx
    touch src/components/Heading.tsx
    ```

    Your project structure should now look like this:

    ```plaintext
    typesense-qwik-search/
    ├── src/
    │   ├── components/
    │   │   ├── router-head/
    │   │   ├── BookCard.tsx
    │   │   ├── BookList.tsx
    │   │   └── Heading.tsx
    │   ├── routes/
    │   │   └── index.tsx
    │   ├── types/
    │   │   └── Book.ts
    │   ├── utils/
    │   │   └── typesense.ts
    │   ├── entry.dev.tsx
    │   ├── entry.preview.tsx
    │   ├── entry.ssr.tsx
    │   ├── global.css
    │   └── root.tsx
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
    ```

7. Let's create the `BookCard` component. Add this to `src/components/BookCard.tsx`:

    ```typescript
    import { component$, useSignal } from "@builder.io/qwik";
    import type { Book } from "../types/Book";

    interface BookCardProps {
      book: Book;
    }

    export const BookCard = component$<BookCardProps>(({ book }) => {
      const {
        title,
        authors,
        publication_year,
        image_url,
        average_rating,
        ratings_count,
      } = book;

      const imageError = useSignal(false);
      const hasRating = typeof average_rating === 'number' && average_rating > 0;
      const starCount = hasRating ? Math.round(average_rating) : 0;

      return (
        <div class="flex gap-6 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="shrink-0 w-32 h-48 bg-gray-100 rounded-md overflow-hidden">
            {image_url && !imageError.value ? (
              <img
                src={image_url}
                alt={title}
                width="128"
                height="192"
                class="w-full h-full object-cover"
                onError$={() => {
                  imageError.value = true;
                }}
              />
            ) : (
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div class="flex-1 flex flex-col">
            <h3 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {title}
            </h3>
            <p class="text-gray-600 mb-1 text-sm">
              By: {authors && authors.length > 0 ? authors.join(", ") : "Unknown"}
            </p>
            {publication_year && (
              <p class="text-gray-500 text-xs mb-2">
                Published: {publication_year}
              </p>
            )}
            <div class="mt-auto pt-2 flex items-center">
              {hasRating ? (
                <>
                  <div class="text-amber-500 text-lg leading-none">
                    {"★".repeat(starCount)}
                    {"☆".repeat(5 - starCount)}
                  </div>
                  <span class="ml-2 text-xs text-gray-600">
                    {typeof average_rating === 'number' ? average_rating.toFixed(1) : '0.0'}{" "}
                    {typeof ratings_count === 'number' &&
                      `(${ratings_count.toLocaleString()} ratings)`}
                  </span>
                </>
              ) : (
                <span class="text-xs text-gray-400">No ratings yet</span>
              )}
            </div>
          </div>
        </div>
      );
    });
    ```

    This component displays individual book cards with:
    - Book cover image with error handling
    - Title, authors, and publication year
    - Star rating visualization
    - Ratings count

8. Create the `BookList` component in `src/components/BookList.tsx`:

    ```typescript
    import { component$ } from "@builder.io/qwik";
    import type { Book } from "../types/Book";
    import { BookCard } from "./BookCard";

    interface BookListProps {
      books: Book[];
      isSearching: boolean;
    }

    export const BookList = component$<BookListProps>(({ books, isSearching }) => {
      if (!books || books.length === 0) {
        return (
          <div class="text-center py-12 text-gray-500">
            {isSearching
              ? "No books found. Try a different search term."
              : "Start typing to search for books."}
          </div>
        );
      }

      return (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      );
    });
    ```

    This component renders a grid of book cards and handles empty states based on whether a search has been performed.

9. Create the `Heading` component in `src/components/Heading.tsx`:

    ```typescript
    import { component$ } from "@builder.io/qwik";

    export const Heading = component$(() => {
      return (
        <>
          <div class="heading-wrapper">
            <h1>Qwik Search Bar</h1>
            <div>
              powered by{" "}
              <a
                href="https://typesense.org/"
                target="_blank"
                rel="noopener noreferrer"
                id="typesense"
              >
                type<b>sense</b>|
              </a>{" "}
              & Qwik
            </div>
          </div>
          <a
            href="https://github.com/typesense/code-samples/tree/master/typesense-qwik-js-search"
            target="_blank"
            rel="noopener noreferrer"
            class="fixed top-8 right-8 text-gray-700 hover:text-black transition-colors duration-200"
            title="Github repo"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 496 512"
              height="1.75em"
              width="1.75em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
            </svg>
          </a>
        </>
      );
    });
    ```

    :::tip Note
    This walkthrough focuses on the search functionality. For styling, you can grab the complete CSS from the [source code](https://github.com/typesense/code-samples/tree/master/typesense-qwik-js-search).
    :::

10. Finally, update your `src/routes/index.tsx` to integrate InstantSearch:

    ```typescript
    import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
    import type { DocumentHead } from "@builder.io/qwik-city";
    import { Heading } from "~/components/Heading";
    import { BookList } from "~/components/BookList";
    import type { Book } from "~/types/Book";
    import instantsearch from "instantsearch.js";
    import { searchBox, hits, configure } from "instantsearch.js/es/widgets";
    import { searchClient, INDEX_NAME } from "~/utils/typesense";

    export default component$(() => {
      const books = useSignal<Book[]>([]);
      const isSearching = useSignal(false);
      const containerRef = useSignal<HTMLElement>();
      const searchInitialized = useSignal(false);

      // eslint-disable-next-line qwik/no-use-visible-task
      useVisibleTask$(({ cleanup, track }) => {
        track(() => containerRef.value);
        
        if (!containerRef.value || searchInitialized.value) return;

        try {
          const search = instantsearch({
            indexName: INDEX_NAME,
            searchClient,
            routing: false,
          });

          let isMounted = true;

          search.addWidgets([
            configure({
              hitsPerPage: 50,
            }),
            searchBox({
              container: "#searchbox",
              placeholder: "Search for books by title or author...",
              showSubmit: false,
              showReset: true,
              showLoadingIndicator: true,
            }),
            hits({
              container: "#hits",
              templates: {
                empty: "No books found. Try a different search term.",
                item() {
                  return "";
                },
              },
              transformItems(items) {
                if (!isMounted) return items;
                
                const typedItems = items.map((item: any) => {
                  const book: Book = {
                    id: String(item.id || item.objectID || Math.random()),
                    title: String(item.title || 'Untitled'),
                    authors: Array.isArray(item.authors) ? item.authors : [],
                    publication_year: Number(item.publication_year) || 0,
                    average_rating: Number(item.average_rating) || 0,
                    image_url: String(item.image_url || ''),
                    ratings_count: Number(item.ratings_count) || 0,
                  };
                  return book;
                });
                
                books.value = typedItems;
                isSearching.value = true;
                return items;
              },
            }),
          ]);

          search.start();
          searchInitialized.value = true;

          cleanup(() => {
            isMounted = false;
            search.dispose();
            searchInitialized.value = false;
          });
        } catch (error) {
          console.error('Failed to initialize InstantSearch:', error);
        }
      });

      return (
        <div class="min-h-screen bg-gray-50 py-8 px-4" ref={containerRef}>
          <div class="max-w-7xl mx-auto">
            <Heading />
            <div class="max-w-3xl mx-auto mb-8">
              <div id="searchbox"></div>
            </div>
            <div id="hits" style="display: none;"></div>
            <BookList books={books.value} isSearching={isSearching.value} />
          </div>
        </div>
      );
    });

    export const head: DocumentHead = {
      title: "Qwik Search Bar - Typesense",
      meta: [
        {
          name: "description",
          content: "Search through our collection of books",
        },
      ],
    };
    ```

    This is the main page that brings together all the required components. Here's what makes this Qwik implementation unique:

    - **useVisibleTask$**: This is Qwik's equivalent to React's `useEffect`. It runs after the component becomes visible in the browser, making it perfect for initializing client-side libraries like InstantSearch.
    - **Resumability**: Unlike React, Qwik doesn't need to re-execute component code on the client. The `useVisibleTask$` only runs when needed.
    - **InstantSearch Integration**: We initialize InstantSearch widgets (searchBox, hits) and mount them to DOM containers. The `transformItems` callback updates Qwik signals with search results.
    - **Memory Management**: The `isMounted` flag prevents state updates after component unmount, and the cleanup function properly disposes of the InstantSearch instance.

11. Run the application:

     ```bash
     npm run dev
     ```

   This will start the development server and open your default browser to [http://localhost:5173](http://localhost:5173). You should see the search interface with the book search results.

You've successfully built a search interface with Qwik and Typesense!

## How Qwik's Resumability Works

Unlike traditional frameworks like React or Vue that need to hydrate the entire application on the client, Qwik uses a resumable architecture:

1. **No Hydration**: Qwik doesn't re-execute component code on the client. The server sends HTML with minimal JavaScript.
2. **Lazy Loading**: JavaScript is only downloaded when user interactions require it.
3. **InstantSearch Integration**: We use `useVisibleTask$` to initialize InstantSearch only when the component becomes visible, keeping the initial bundle small.
4. **Signals**: Qwik's reactive primitives (`useSignal`) enable fine-grained reactivity without virtual DOM diffing.

This makes Qwik applications incredibly fast, especially on mobile devices and slower networks.

## Final Output

Here's how the final output should look like:

![Qwik Search Bar Final Output](~@images/qwik-search-bar/final-output.png)

## Source Code

Here's the complete source code for this project on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-qwik-js-search](https://github.com/typesense/code-samples/tree/master/typesense-qwik-js-search)

## Related Examples

Here's another related example that shows you how to build a search application in a Qwik application:

[Guitar Chords Search with Qwik](https://github.com/typesense/showcase-guitar-chords-search-qwik)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
