# Building a Search Bar in Solid.js

This guide walks you through building a full-text search interface in Solid.js using Typesense. You'll create a simple book search application that demonstrates how to integrate the Typesense ecosystem with your Solid.js projects. Solid.js has been gaining popularity among developers for its React-like syntax and impressive performance, offering a familiar component-based approach while delivering blazing-fast updates through its reactivity system.

## What is Typesense?

Typesense is a lightning-fast, typo-tolerant search engine that makes it easy to add powerful search to your applications. Think of it as your personal search assistant that understands what users are looking for, even when they make mistakes.

Here's a real-world scenario: you're building a music streaming platform with millions of songs. A user searches for "bohemian rhapsody by qeen" (with typos). Instead of showing no results and frustrating the user, Typesense understands they meant "Bohemian Rhapsody by Queen" and instantly plays the song they love. That's the magic of intelligent search!

Why developers choose Typesense:

- **Blazing fast** - Search results appear in milliseconds, even across millions of documents.
- **Typo-tolerant** - Automatically corrects spelling mistakes so users find what they need.
- **Feature-Rich** - Full-text search, Synonyms, Curation Rules, Semantic Search, Hybrid search, Conversational Search (like ChatGPT for your data), RAG, Natural Language Search, Geo Search, Vector Search and much more wrapped in a single binary for a batteries-included developer experience.
- **Simple setup** - Get started in minutes with Docker, no complex configuration needed like Elasticsearch.
- **Cost-effective** - Self-host for free, unlike expensive alternatives like Algolia.
- **Open source** - Full control over your search infrastructure, or use [Typesense Cloud](https://cloud.typesense.org) for hassle-free hosting.

## Prerequisites

This guide will use [Solid.js](https://www.solidjs.com/), a modern JavaScript framework for building reactive user interfaces with fine-grained reactivity.

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

## Step 3: Set up your Solid.js project

Create a new Solid.js project using this command:

```shell
npm create vite@latest typesense-solid-js-search -- --template solid-ts
```

This will scaffold a new Solid.js project with TypeScript support.

Once your project scaffolding is ready, navigate to the project directory and install these three dependencies that will help you with implementing the search functionality:

```shell
cd typesense-solid-js-search
npm install
npm i typesense typesense-instantsearch-adapter instantsearch.js
```

Let's go over these dependencies one by one:

- **typesense**
  - Official JavaScript client for Typesense.
  - It isn't required for the UI, but it is needed if you want to interact with the Typesense server programmatically.
- [**instantsearch.js**](https://www.npmjs.com/package/instantsearch.js)
  - A vanilla JavaScript library from Algolia that provides ready-to-use UI widgets for building search interfaces.
  - Offers widgets like `searchBox`, `hits`, `stats` and others that make displaying search results easy.
  - It also abstracts state management, URL synchronization and other complex stuff.
  - By itself, it's designed to work with Algolia's hosted search service and not Typesense.
- [**typesense-instantsearch-adapter**](https://github.com/typesense/typesense-instantsearch-adapter)
  - This is the key library that acts as a bridge between `instantsearch.js` and our self-hosted Typesense server.
  - This implements the `InstantSearch.js` adapter that `instantsearch.js` expects.
  - Translates the `InstantSearch.js` queries to Typesense API calls.

## Project Structure

Let's create the project structure step by step. After each step, we'll show you how the directory structure evolves.

1. After creating the basic Solid.js app and installing the required dependencies, your project structure should look like this:

   ```plaintext
   typesense-solid-js-search/
   ├── node_modules/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── App.tsx
   │   ├── index.css
   │   └── index.tsx
   ├── .gitignore
   ├── index.html
   ├── package-lock.json
   ├── package.json
   ├── tsconfig.app.json
   ├── tsconfig.json
   └── vite.config.ts
   ```

2. Create the `utils` directory and `typesense.ts` file:

   ```bash
   mkdir -p src/utils
   touch src/utils/typesense.ts
   ```

   Your project structure should now look like this:

   ```plaintext
   typesense-solid-js-search/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── utils/
   │   │   └── typesense.ts
   │   ├── App.tsx
   │   ├── index.css
   │   └── index.tsx
   ├── .gitignore
   ├── index.html
   ├── package-lock.json
   ├── package.json
   ├── tsconfig.app.json
   ├── tsconfig.json
   └── vite.config.ts
   ```

3. Copy this code into `src/utils/typesense.ts`:

   ```typescript
   import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

   export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
     server: {
       apiKey: import.meta.env.VITE_TYPESENSE_API_KEY || "xyz",
       nodes: [
         {
           host: import.meta.env.VITE_TYPESENSE_HOST || "localhost",
           port: Number(import.meta.env.VITE_TYPESENSE_PORT) || 8108,
           protocol: import.meta.env.VITE_TYPESENSE_PROTOCOL || "http",
         },
       ],
     },
     additionalSearchParameters: {
       query_by: "title,authors",
     },
   });
   ```

   This config file creates a reusable adapter that connects your Solid.js application to your Typesense backend. It can take in a bunch of additional search parameters like sort by, number of typos, etc.

   :::tip Note
   Solid.js with Vite uses `import.meta.env` for environment variables, and public variables must be prefixed with `VITE_`.
   :::

4. Create the components directory and files:

   ```bash
   mkdir -p src/components
   touch src/components/BookSearch.tsx src/components/BookSearch.module.css
   touch src/components/BookList.tsx src/components/BookList.module.css
   touch src/components/BookCard.tsx src/components/BookCard.module.css
   ```

   Your project structure should now look like this:

   ```plaintext
   typesense-solid-js-search/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── components/
   │   │   ├── BookCard.tsx
   │   │   ├── BookCard.module.css
   │   │   ├── BookList.tsx
   │   │   ├── BookList.module.css
   │   │   ├── BookSearch.tsx
   │   │   ├── BookSearch.module.css
   │   ├── utils/
   │   │   └── typesense.ts
   │   ├── App.tsx
   │   ├── index.css
   │   └── index.tsx
   ├── .gitignore
   ├── index.html
   ├── package-lock.json
   ├── package.json
   ├── tsconfig.app.json
   ├── tsconfig.json
   └── vite.config.ts
   ```

5. Let's create the `BookSearch` component. Copy this code into `src/components/BookSearch.tsx`:

   :::tip Note
   This walkthrough uses CSS Modules for styling. Since CSS is not the focus of this article, you can grab the complete stylesheets from the [source code](https://github.com/typesense/code-samples/tree/master/typesense-solid-js-search).
   :::

   ```typescript
   import { onMount, onCleanup, createSignal } from "solid-js";
   import { typesenseInstantsearchAdapter } from "../utils/typesense";
   import instantsearch from "instantsearch.js";
   import { searchBox, hits, stats, configure } from "instantsearch.js/es/widgets";
   import { BookList } from "./BookList";
   import styles from "./BookSearch.module.css";
   import type { Book } from "../types/Book";

   export function BookSearch() {
     const [books, setBooks] = createSignal<Book[]>([]);
     const [loading, setLoading] = createSignal(false);

     let search: any;

     onMount(() => {
       search = instantsearch({
         indexName: "books",
         searchClient: typesenseInstantsearchAdapter.searchClient,
         future: {
           preserveSharedStateOnUnmount: true,
         },
       });

       search.addWidgets([
         configure({
           hitsPerPage: 12,
         }),
         searchBox({
           container: "#searchbox",
           placeholder: "Search by title or author...",
           showReset: false,
           showSubmit: false,
           cssClasses: {
             form: styles.searchForm,
             input: styles.searchInput,
             submit: styles.searchSubmit,
           },
         }),
         stats({
           container: "#stats",
           templates: {
             text(data, { html }) {
               if (data.hasManyResults) {
                 return html`${data.nbHits.toLocaleString()} results found`;
               } else if (data.hasOneResult) {
                 return html`1 result found`;
               } else {
                 return html`No results found`;
               }
             },
           },
         }),
         hits({
           container: "#hits",
           templates: {
             item: () => {
               return "";
             },
             empty: () => {
               return "";
             },
           },
           transformItems: (items: any[]) => {
             const booksData = items.map((item) => item as Book);
             setBooks(booksData);
             return items;
           },
         }),
       ]);

       // Listen for search state changes
       search.on("render", () => {
         const helper = search.helper;
         setLoading(helper.state.loading);
       });

       search.start();
     });

     onCleanup(() => {
       if (search) {
         search.dispose();
       }
     });

     return (
       <div class={styles.searchContainer}>
         <div class={styles.searchBoxContainer}>
           <div id="searchbox"></div>
         </div>

         <div id="stats" class={styles.resultsCount}></div>

         <div id="hits" style="display: none;"></div>

         <BookList books={books()} loading={loading()} />
       </div>
     );
   }
   ```

   Solid.js's reactivity system allows us to create signals that automatically update when the search state changes. The `onMount` and `onCleanup` lifecycles ensure proper initialization and cleanup of the InstantSearch instance. The `transformItems` function allows us to intercept search results and update Solid.js signals, bridging the imperative InstantSearch.js library with Solid.js's declarative reactivity model.

6. Create the `BookList` component in `src/components/BookList.tsx`:

   ```typescript
   import { For, Show } from "solid-js";
   import { BookCard } from "./BookCard";
   import styles from "./BookList.module.css";
   import type { Book } from "../types/Book";

   interface BookListProps {
     books: Book[];
     loading: boolean;
   }

   export function BookList(props: BookListProps) {
     return (
       <div class={styles.bookList}>
         <Show when={props.loading}>
           <div class={styles.loadingContainer}>
             <div class={styles.spinner}></div>
             <p>Searching...</p>
           </div>
         </Show>

         <Show when={!props.loading && props.books.length === 0}>
           <div class={styles.noResults}>
             <h3>No books found</h3>
             <p>Try adjusting your search or try different keywords.</p>
           </div>
         </Show>

         <Show when={!props.loading && props.books.length > 0}>
           <div class={styles.bookGrid}>
             <For each={props.books}>{(book) => <BookCard book={book} />}</For>
           </div>
         </Show>
       </div>
     );
   }
   ```

   This component uses Solid.js's control flow components (`Show` and `For`) to conditionally render content based on the search state. The `Show` component handles loading and empty states, while the `For` component efficiently renders the list of search results.

7. Create the `BookCard` component in `src/components/BookCard.tsx`:

   ```typescript
   import styles from "./BookCard.module.css";
   import type { Book } from "../types/Book";

   interface BookCardProps {
     book: Book;
   }

   export function BookCard(props: BookCardProps) {
     const stars = "★".repeat(Math.round(props.book.average_rating || 0));

     return (
       <div class={styles.bookCard}>
         {props.book.image_url && (
           <div class={styles.bookImageContainer}>
             <img
               src={props.book.image_url}
               alt={`Cover of ${props.book.title}`}
               class={styles.bookImage}
             />
           </div>
         )}
         <div class={styles.bookInfo}>
           <h3 class={styles.bookTitle}>{props.book.title}</h3>
           <p class={styles.bookAuthor}>
             {props.book.authors?.join(", ") || "Unknown Author"}
           </p>
           <div class={styles.ratingContainer}>
             <span class={styles.starRating}>{stars}</span>
             <span class={styles.ratingText}>
               {props.book.average_rating?.toFixed(1) || "0"} (
               {props.book.ratings_count?.toLocaleString() || 0} ratings)
             </span>
           </div>
           {props.book.publication_year && (
             <p class={styles.bookYear}>
               Published: {props.book.publication_year}
             </p>
           )}
         </div>
       </div>
     );
   }
   ```

8. Create the types directory and Book type:

   ```bash
   mkdir -p src/types
   touch src/types/Book.ts
   ```

   Add this to `src/types/Book.ts`:

   ```typescript
   export type Book = {
     id: string;
     title: string;
     authors: string[];
     publication_year: number;
     average_rating: number;
     image_url: string;
     ratings_count: number;
   };
   ```

   Your final project structure should now look like this:

   ```plaintext
   typesense-solid-js-search/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── components/
   │   │   ├── BookCard.tsx
   │   │   ├── BookCard.module.css
   │   │   ├── BookList.tsx
   │   │   ├── BookList.module.css
   │   │   ├── BookSearch.tsx
   │   │   ├── BookSearch.module.css
   │   ├── types/
   │   │   └── Book.ts
   │   ├── utils/
   │   │   └── typesense.ts
   │   ├── App.tsx
   │   ├── index.css
   │   └── index.tsx
   ├── .gitignore
   ├── index.html
   ├── package-lock.json
   ├── package.json
   ├── tsconfig.app.json
   ├── tsconfig.json
   └── vite.config.ts
   ```

9. Finally, update your `src/App.tsx` to use these components:

   ```typescript
   import "./App.css";
   import { BookSearch } from "./components/BookSearch";

   function App() {
     return (
       <>
         <BookSearch />
       </>
     );
   }

   export default App;
   ```

   This is the main app component that brings together all the required components. The `BookSearch` component contains the entire search interface.

10. Run the application:

    ```bash
    npm run dev
    ```

    This will start the development server and open your default browser to [http://localhost:5173](http://localhost:5173). You should see the search interface with the book search results.

You've successfully built a search interface with Solid.js and Typesense!

## Final Output

Here's how the final output should look like:

![Solid.js Search Bar Final Output](~@images/solidjs-search-bar/final-output.png)

## Source Code

Here's the complete source code for this project on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-solid-js-search](https://github.com/typesense/code-samples/tree/master/typesense-solid-js-search)

## Related Examples

Here's another related example that shows you how to build a search bar in a Solid.js application:

[Guitar Chords Search with Solid.js](https://github.com/typesense/showcase-guitar-chords-search-solid-js)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
