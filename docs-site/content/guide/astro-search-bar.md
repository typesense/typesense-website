# Building a Search Bar in Astro

This guide walks you through building a full-text search interface in Astro using Typesense. You'll create a simple book search application that demonstrates how to integrate the Typesense ecosystem with your Astro projects.

## What is Typesense?

Typesense is a lightning-fast, typo-tolerant search engine that makes it easy to add powerful search to your applications. Think of it as your personal search assistant that understands what users are looking for, even when they make mistakes.

Here's a real-world scenario: you're building an online recipe site with thousands of recipes. Without search, users would need to browse through categories and pages hoping to find what they need. With Typesense, they can type "choclate cake" (notice the typo?) and instantly get results for "chocolate cake" - no frustration, no lost users!

Why developers choose Typesense:

- **Blazing fast** - Search results appear in milliseconds, even across millions of documents.
- **Typo-tolerant** - Automatically corrects spelling mistakes so users find what they need.
- **Simple setup** - Get started in minutes with Docker, no complex configuration needed like Elasticsearch.
- **Cost-effective** - Self-host for free, unlike expensive alternatives like Algolia.
- **Open source** - Full control over your search infrastructure, or use [Typesense Cloud](https://cloud.typesense.org) for hassle-free hosting.

## Prerequisites

This guide will use [Astro](https://astro.build/), a modern web framework for building fast, content-focused websites with any UI framework or none at all.

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

## Step 3: Set up your Astro project

Create a new Astro project using this command:

```shell
npm create astro@latest typesense-astro-search
```

Make sure to choose the minimal (empty) template from the options. We will be creating our own folder structure and files. For the rest of the options, you can use the default values.

Once your project scaffolding is ready, you need to install these three dependencies that will help you with implementing the search functionality. Use this command to install them:

```shell
npm i typesense typesense-instantsearch-adapter instantsearch.js
```

Let's go over these dependencies one by one:

- **typesense**
  - Official JavaScript client for Typesense.
  - It isn't required for the UI, but it is needed if you want to interact with the Typesense server from Astro API routes.
- [**instantsearch.js**](https://www.npmjs.com/package/instantsearch.js)
  - A vanilla JavaScript library from Algolia that provides ready-to-use UI widgets for building search interfaces.
  - Offers widgets like `searchBox`, `hits`, `stats` and others that make displaying search results easy.
  - It also abstracts state management, URL synchronization and other complex stuff.
  - By itself, it's designed to work with Algolia's hosted search service and not Typesense.
- [**typesense-instantsearch-adapter**](https://github.com/typesense/typesense-instantsearch-adapter)
  - This is the key library that acts as a bridge between `instantsearch.js` and our self-hosted Typesense server.
  - This implements the adapter that `instantsearch.js` expects.
  - Translates the `instantsearch.js` queries to Typesense API calls.

## Project Structure

Let's create the project structure step by step. After each step, we'll show you how the directory structure evolves.

1. After creating the basic Astro app and installing the required dependencies, your project structure should look like this:

   ```plaintext
   typesense-astro-search/
   ├── node_modules/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── pages/
   │   │   └── index.astro
   │   └── env.d.ts
   ├── .gitignore
   ├── astro.config.mjs
   ├── package-lock.json
   ├── package.json
   └── tsconfig.json
   ```

2. Create the `utils` directory and `typesense.ts` file:

   ```bash
   mkdir -p src/utils
   touch src/utils/typesense.ts
   ```

   Your project structure should now look like this:

   ```plaintext
   typesense-astro-search/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── pages/
   │   │   └── index.astro
   │   ├── utils/
   │   │   └── typesense.ts
   │   └── env.d.ts
   ├── astro.config.mjs
   ├── package-lock.json
   ├── package.json
   └── tsconfig.json
   ```

3. Copy this code into `src/utils/typesense.ts`:

   ```typescript
   import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

   export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
     server: {
       apiKey: import.meta.env.PUBLIC_TYPESENSE_API_KEY || 'xyz',
       nodes: [
         {
           host: import.meta.env.PUBLIC_TYPESENSE_HOST || 'localhost',
           port: Number(import.meta.env.PUBLIC_TYPESENSE_PORT) || 8108,
           protocol: import.meta.env.PUBLIC_TYPESENSE_PROTOCOL || 'http',
         },
       ],
     },
     additionalSearchParameters: {
       query_by: 'title,authors',
     },
   })
   ```

   This config file creates a reusable adapter that connects your Astro application to your Typesense backend. It also accepts additional search parameters like sort by, number of typos, etc.

    :::tip Note
    Astro uses `import.meta.env` for environment variables, and public variables must be prefixed with `PUBLIC_`.
    :::

4. Create the components directory and files:

   ```bash
   mkdir -p src/components
   touch src/components/BookSearch.astro
   touch src/components/BookCard.astro
   touch src/components/Heading.astro
   ```

   Your project structure should now look like this:

   ```plaintext
   typesense-astro-search/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── components/
   │   │   ├── BookCard.astro
   │   │   ├── BookSearch.astro
   │   │   └── Heading.astro
   │   ├── pages/
   │   │   └── index.astro
   │   ├── utils/
   │   │   └── typesense.ts
   │   └── env.d.ts
   ├── astro.config.mjs
   ├── package-lock.json
   ├── package.json
   └── tsconfig.json
   ```

5. Let's create the `BookSearch` component. Copy this code into `src/components/BookSearch.astro`:

   :::tip Note
   This walkthrough will not include CSS for the Astro components since it's not the intent of this guide. You can grab the complete source code from the [source code](https://github.com/typesense/code-samples).
   :::

   ```typescript
   ---
   ---

   <div class="search-container">
     <div class="search-box-container">
       <div id="searchbox"></div>
     </div>

     <div id="stats" class="results-count"></div>

     <div id="hits" class="book-grid"></div>
   </div>

   <script>
     import { typesenseInstantsearchAdapter } from '../utils/typesense';
     import instantsearch from 'instantsearch.js';
     import { searchBox, hits, stats, configure } from 'instantsearch.js/es/widgets';

     const search = instantsearch({
       indexName: 'books',
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
         container: '#searchbox',
         placeholder: 'Search by title or author...',
         showReset: true,
         showSubmit: true,
         cssClasses: {
           form: 'search-form',
           input: 'search-input',
           submit: 'search-submit',
           reset: 'search-reset',
         },
       }),
       stats({
         container: '#stats',
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
         container: '#hits',
         templates: {
           item(hit, { html, components }) {
             const stars = '★'.repeat(Math.round(hit.average_rating || 0));
             return html`
               <div class="book-card">
                 ${hit.image_url ? html`
                   <div class="book-image-container">
                     <img
                       src="${hit.image_url}"
                       alt="Cover of ${hit.title}"
                       class="book-image"
                     />
                   </div>
                 ` : ''}
                 <div class="book-info">
                   <h3 class="book-title">${components.Highlight({ attribute: 'title', hit })}</h3>
                   <p class="book-author">${hit.authors?.join(', ') || 'Unknown Author'}</p>
                   <div class="rating-container">
                     <span class="star-rating">${stars}</span>
                     <span class="rating-text">
                       ${hit.average_rating?.toFixed(1) || '0'} (${hit.ratings_count?.toLocaleString() || 0} ratings)
                     </span>
                   </div>
                   ${hit.publication_year ? html`<p class="book-year">Published: ${hit.publication_year}</p>` : ''}
                 </div>
               </div>
             `;
           },
           empty(results, { html }) {
             return html`
               <div class="no-results">
                 <h3>No books found</h3>
                 <p>Try adjusting your search or try different keywords.</p>
               </div>
             `;
           },
         },
       }),
     ]);

     search.start();
   </script>
   ```

   Unlike React-based frameworks that ship JavaScript for the entire component tree, Astro components render to static HTML by default and only include client-side JavaScript when explicitly needed via `<script>` tags. The `instantsearch.js` library provides vanilla JavaScript widgets that mount to DOM elements by their container selectors (e.g., `#searchbox`, `#hits`). This approach is perfect for Astro's [islands architecture](https://docs.astro.build/en/concepts/islands/) where you only ship JavaScript where needed. If you need to build more complex interactive frontends, Astro also supports UI frameworks like React, Vue, Svelte, and Solid.js through its [integrations](https://docs.astro.build/en/guides/integrations-guide/). 

6. Create the `BookCard` component in `src/components/BookCard.astro`:

   ```typescript
   ---
   import type { Book } from "../types/Book";

   interface Props {
     book: Book;
   }

   const { book } = Astro.props;
   const stars = "★".repeat(Math.round(book.average_rating || 0));
   ---

   <div class="book-card">
     {book.image_url && (
       <div class="book-image-container">
         <img
           src={book.image_url}
           alt={`Cover of ${book.title}`}
           class="book-image"
         />
       </div>
     )}
     <div class="book-info">
       <h3 class="book-title">{book.title}</h3>
       <p class="book-author">{book.authors?.join(", ") || "Unknown Author"}</p>
       <div class="rating-container">
         <span class="star-rating">{stars}</span>
         <span class="rating-text">
           {book.average_rating?.toFixed(1)} ({book.ratings_count?.toLocaleString() || 0} ratings)
         </span>
       </div>
       {book.publication_year && <p class="book-year">Published: {book.publication_year}</p>}
     </div>
   </div>
   ```

   This component is used for server-side rendering of book cards. Note that for the search results, we use the `hits` widget template directly in `BookSearch.astro` since those are rendered client-side by InstantSearch. Also, any code inside the fenced code block `---` ([frontmatter](https://docs.astro.build/en/basics/astro-components/#the-component-script)) is executed only on the server side.

7. Create the types directory and Book type:

   ```bash
   mkdir -p src/types
   touch src/types/Book.ts
   ```

   Add this to `src/types/Book.ts`:

   ```typescript
   export interface Book {
     objectID: string
     title: string
     authors: string[]
     publication_year: number
     average_rating: number
     image_url: string
     ratings_count: number
   }
   ```

   Your final project structure should now look like this:

   ```plaintext
   typesense-astro-search/
   ├── public/
   │   └── favicon.svg
   ├── src/
   │   ├── components/
   │   │   ├── BookCard.astro
   │   │   ├── BookSearch.astro
   │   ├── pages/
   │   │   └── index.astro
   │   ├── types/
   │   │   └── Book.ts
   │   ├── utils/
   │   │   └── typesense.ts
   │   └── env.d.ts
   ├── astro.config.mjs
   ├── package-lock.json
   ├── package.json
   └── tsconfig.json
   ```

8. Finally, update your `src/pages/index.astro` to use these components:

   ```typescript
   ---
   import BookSearch from "../components/BookSearch.astro";
   ---

   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
       <meta name="viewport" content="width=device-width" />
       <meta name="generator" content={Astro.generator} />
       <title>Book Search | Typesense + Astro</title>
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@8/themes/satellite-min.css" />
     </head>
     <body>
       <BookSearch />
     </body>
   </html>

   <style is:global>
     * {
       box-sizing: border-box;
     }

     body {
       font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
       margin: 0;
       padding: 0;
       background: #f5f7fa;
       min-height: 100vh;
     }
   </style>
   ```

   This is the main page that brings together all the required components. The `BookSearch` component is imported and rendered directly in the page.

9. Run the application:

   ```bash
   npm run dev
   ```

   This will start the development server and open your default browser to [http://localhost:4321](http://localhost:4321). You should see the search interface with the book search results.

You've successfully built a search interface with Astro and Typesense!

## Final Output

Here's how the final output should look like:

![Astro Search Bar Final Output](~@images/astro-search-bar/final-output.png)

## Source Code

Here's the complete source code for this project on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-astro-search](https://github.com/typesense/code-samples/tree/master/typesense-astro-search)

## Related Examples

Here's another related example that shows you how to build a search bar in an Astro application:

[Guitar Chords Search with Astro](https://github.com/typesense/showcase-guitar-chords-search-astro)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
