# Building a Search Bar in Vanilla JavaScript

You don't need a fancy framework to work with Typesense. This walkthrough will take you through all the steps required to build a simple book search application using Vanilla JavaScript and the Typesense ecosystem.

## Prerequisites

This guide will use [Vite](https://vitejs.dev/), a modern build tool that provides a fast development experience for vanilla JavaScript projects.

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

## Step 3: Set up your Vite project

Create a new Vite project using this command:

```shell
npm create vite@latest typesense-vanilla-js-search -- --template vanilla
```

This will scaffold a new vanilla JavaScript project with Vite.

Once your project scaffolding is ready, navigate to the project directory and install these three dependencies that will help you with implementing the search functionality:

```shell
cd typesense-vanilla-js-search
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

1. After creating the basic Vite app and installing the required dependencies, your project structure should look like this:

    ```plaintext
    typesense-vanilla-js-search/
    ├── node_modules/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── main.js
    │   └── style.css
    ├── .gitignore
    ├── index.html
    ├── package-lock.json
    └── package.json
    ```

2. Create the `typesense.js` file in the `src` directory:

    ```bash
    touch src/typesense.js
    ```

    Your project structure should now look like this:

    ```plaintext
    typesense-vanilla-js-search/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── main.js
    │   ├── style.css
    │   └── typesense.js
    ├── .gitignore
    ├── index.html
    ├── package-lock.json
    └── package.json
    ```

3. Copy this code into `src/typesense.js`:

    ```javascript
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

    This config file creates a reusable adapter that connects your application to your Typesense Backend. It can take in a bunch of additional search parameters like sort by, number of typos, etc.

    :::tip
    Note that Vite uses `import.meta.env` for environment variables, and public variables must be prefixed with `VITE_`.
    :::

4. Update the `index.html` file with the search UI structure:

    ```html
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Book Search | Typesense + Vanilla JS</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@8/themes/satellite-min.css" />
      </head>
      <body>
        <div id="app">
          <header class="header">
            <h1>Vanilla JS Search Bar</h1>
            <p class="subtitle">
              powered by
              <a href="https://typesense.org/" target="_blank" rel="noopener noreferrer">
                type<strong>sense</strong>|
              </a>
            </p>
          </header>

          <main class="search-container">
            <div class="search-box-container">
              <div id="searchbox"></div>
            </div>

            <div id="stats" class="results-count"></div>
            
            <div id="hits" class="book-grid"></div>
          </main>
        </div>
        <script type="module" src="/src/main.js"></script>
      </body>
    </html>
    ```

    The HTML structure provides container elements (`#searchbox`, `#stats`, `#hits`) that the InstantSearch widgets will mount to.

5. Now let's implement the main search functionality. Replace the contents of `src/main.js` with:

    :::tip Note
    Since styling is not the main focus of this guide, we've excluded the CSS. You can find the complete stylesheet in the [source code](https://github.com/typesense/code-samples/tree/master/typesense-vanilla-js-search).
    :::

    ```javascript
    import './style.css';
    import { typesenseInstantsearchAdapter } from './typesense.js';
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
    ```

    Unlike React-based frameworks, vanilla JavaScript with InstantSearch uses a widget-based architecture where each widget mounts to a DOM element by its container selector. Let's break down the key parts:

    - **`instantsearch()`** - Creates the main search instance, connecting to our Typesense backend via the adapter.
    - **`configure()`** - Sets global search parameters like `hitsPerPage`.
    - **`searchBox()`** - Renders the search input field. The widget automatically handles complex parts like debouncing and state management.
    - **`stats()`** - Displays the number of results found using a custom template.
    - **`hits()`** - Renders the search results using custom HTML templates with the `html` tagged template literal.

    The `components.Highlight()` function is provided by InstantSearch to highlight matching text in the search results.

6. Your final project structure should now look like this:

    ```plaintext
    typesense-vanilla-js-search/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── main.js
    │   ├── style.css
    │   └── typesense.js
    ├── .gitignore
    ├── index.html
    ├── package-lock.json
    └── package.json
    ```

You've successfully built a search interface with vanilla JavaScript and Typesense!

## Final Output

Here's how the final output should look like:

![Vanilla JS Search Bar Final Output](~@images/vanilla-js-search-bar/final-output.png)

## Source Code

Here's the complete source code for this project on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-vanilla-js-search](https://github.com/typesense/code-samples/tree/master/typesense-vanilla-js-search)

## Related Examples

Here's another related example that shows you how to build a search bar with vanilla JavaScript:

[E-commerce Store with InstantSearch.js](https://github.com/typesense/typesense-instantsearch-demo)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
