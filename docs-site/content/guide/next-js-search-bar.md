# Building a Search Bar in Next.JS

Adding full-text search capabilities to your React/Next.js projects has never been easier. This walkthrough will take you through all the steps required to build a simple book search application using Next.js and the Typesense ecosystem.

## What is Typesense?

Typesense is a modern, open-source search engine designed to deliver fast and relevant search results. It's like having a smart search bar that knows what your users want, even when they don't type it perfectly.

Picture this: you're running an e-commerce store selling electronic gadgets. A customer searches for "ipone 13 pro" (with a typo). Instead of showing "no results found" and losing a potential sale, Typesense understands they meant "iPhone 13 Pro" and shows them exactly what they're looking for. That's the power of intelligent search!

What sets Typesense apart:

- **Speed** - Delivers search results in under 50ms, keeping your users engaged.
- **Typo tolerance** - Handles misspellings gracefully, so users always find what they need.
- **Simple setup** - Get started in minutes with Docker, no complex configuration needed like Elasticsearch.
- **Cost-effective** - Self-host for free, unlike expensive alternatives like Algolia.
- **Open source** - Full control over your search infrastructure, or use [Typesense Cloud](https://cloud.typesense.org) for hassle-free hosting.

## Prerequisites

This guide will use [NextJS](https://nextjs.org/), a [React](https://react.dev/) framework for building full-stack web applications.

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

## Step 3: Set up your Next.js project

Create a new Next.js project using this command:

```shell
npx create-next-app@latest typesense-next-search-bar
```

This will ask you a bunch of questions, just go with the default choices. It's good enough for most people.

Once your project scaffolding is ready, you need to install these three dependencies that will help you with implementing the search functionality. Use this command to install them:

```shell
npm i typesense typesense-instantsearch-adapter react-instantsearch
```

Let's go over these dependencies one by one:

- **typesense**
  - Official JavaScript client for Typesense.
  - It isn't required for the UI, but it is needed if you want to interact with the Typesense server from Next.js API routes.
- **react-instantsearch**
  - A react library from Algolia that provides ready-to-use UI components for building search interfaces.
  - Offers components like SearchBox, Hits and others that make displaying search results easy.
  - It also abstracts state management, URL synchronization and other complex stuff.
  - By itself, it's designed to work with Algolia's hosted search service and not Typesense.
- [**typesense-instantsearch-adapter**](https://github.com/typesense/typesense-instantsearch-adapter)
  - This is the key library that acts as a bridge between the `react-instantsearch` and our self-hosted Typesense server.
  - This implements the `InstantSearch.js` adapter that `react-instantsearch` expects.
  - Translates the `InstantSearch.js` queries to Typesense API calls.

## Project Structure

Let's create the project structure step by step. After each step, we'll show you how the directory structure evolves.

1. After creating the basic Next.js app and installing the required dependencies, your project structure should look like this:

    ```
    typesense-next-search-bar/
    ├── node_modules/
    ├── pages/
    │   └── index.tsx
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── .eslintrc.json
    ├── .gitignore
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
    ```

2. Create the `lib` directory and `instantSearchAdapter.ts` file:

    ```bash
    mkdir -p lib
    touch lib/instantSearchAdapter.ts
    ```

    Your project structure should now look like this:

    ```
    typesense-next-search-bar/
    ├── lib/
    │   └── instantSearchAdapter.ts
    ├── pages/
    │   └── index.tsx
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── .eslintrc.json
    ├── .gitignore
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
    ```

3. Copy this code into `lib/instantSearchAdapter.ts`:

    ```typescript
    import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'
    
    export const typesenseInstantSearchAdapter = new TypesenseInstantsearchAdapter({
      server: {
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || '1234',
        nodes: [
          {
            host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
            port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
            protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http',
          },
        ],
      },
      additionalSearchParameters: {
        query_by: 'title,authors',
      },
    })
    ```

    This config file creates a reusable adapter that connects your React application to your Typesense Backend. It can take in a bunch of additional search parameters like sort by, number of typos, etc.

4. Create the components directory and files:

    ```bash
    mkdir -p components
    touch components/SearchBar.tsx components/Searchbar.module.css
    touch components/BookList.tsx components/BookList.module.css
    touch components/BookCard.tsx components/BookCard.module.css
    ```

    Your project structure should now look like this:

    ```
    typesense-next-search-bar/
    ├── components/
    │   ├── BookCard.tsx
    │   ├── BookList.tsx
    │   ├── BookList.module.css
    │   ├── BookCard.module.css
    │   ├── SearchBar.tsx
    │   └── Searchbar.module.css
    ├── lib/
    │   └── instantSearchAdapter.ts
    ├── pages/
    │   └── index.tsx
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── .eslintrc.json
    ├── .gitignore
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
    ```

5. Let's create the `SearchBar` component. Add this to `components/SearchBar.tsx`:

    :::tip Note
    This walkthrough uses CSS Modules for styling. Since CSS is not the focus of this article, you can grab the complete stylesheets from the [source code](https://github.com/typesense/code-samples).
    :::

    ```typescript
    import { SearchBox } from 'react-instantsearch'
    import styles from './Searchbar.module.css'
    
    export const SearchBar = () => {
      return (
        <div className={styles.searchContainer}>
          <h1 className={styles.searchTitle}>Book Search</h1>
          <SearchBox
            placeholder='Search for books by title or author...'
            classNames={{
              form: styles.searchForm,
              input: styles.searchInput,
              submit: styles.searchButton,
              reset: styles.resetButton,
            }}
            submitIconComponent={() => (
              <svg
                className={styles.searchIcon}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            )}
            resetIconComponent={() => (
              <svg
                className={styles.closeIcon}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            )}
            loadingIconComponent={() => <div className={styles.loadingSpinner} />}
          />
        </div>
      )
    }
    ```

    The `SearchBox` component from `react-instantsearch` handles the search query internally through the InstantSearch [context](https://react.dev/learn/passing-data-deeply-with-context). This component will be a child of the `InstantSearch` component and automatically passes the user's search query to the `InstantSearch` context. This approach automatically handles input management, debouncing, and state synchronization.

6. Create the `BookList` component in `components/BookList.tsx`:

    ```typescript
    import { useHits } from 'react-instantsearch'
    import type { Book } from '../types/Book'
    import { BookCard } from './BookCard'
    import styles from './BookList.module.css'
    
    export const BookList = () => {
      const { items } = useHits<Book>()
    
      if (!items || items.length === 0) {
        return (
          <div className={styles.emptyState}>
            {items ? 'No books found. Try a different search term.' : 'Start typing to search for books.'}
          </div>
        )
      }
    
      return (
        <div className={styles.bookList}>
          {items.map(item => (
            <BookCard key={item.objectID} book={item as unknown as Book} />
          ))}
        </div>
      )
    }
    ```

    This is a fairly simple component that will list all the search results obtained by the `useHits` hook. The `useHits` hook automatically connects to the nearest parent `InstantSearch` context and is subscribed to the state changes. It provides access to the current search results and additional metadata about the current search state.

7. Create the `BookCard` component in `components/BookCard.tsx`:

    ```typescript
    import type { Book } from '../types/Book'
    import styles from './BookCard.module.css'
    
    interface BookCardProps {
      book: Book
    }
    
    export const BookCard = ({ book }: BookCardProps) => {
      const { title, authors, publication_year, image_url, average_rating, ratings_count } = book
    
      return (
        <div className={styles.bookCard}>
          <div className={styles.bookImageContainer}>
            {image_url ? (
              <img
                src={image_url}
                alt={title}
                className={styles.bookImage}
                onError={e => {
                  ;(e.target as HTMLImageElement).src = '/book-placeholder.png'
                }}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>
          <div className={styles.bookInfo}>
            <h3 className={styles.bookTitle}>{title}</h3>
            <p className={styles.bookAuthor}>By: {authors?.join(', ')}</p>
            {publication_year && <p className={styles.bookYear}>Published: {publication_year}</p>}
            <div className={styles.ratingContainer}>
              <div className={styles.starRating}>{'★'.repeat(Math.round(average_rating || 0))}</div>
              <span className={styles.ratingText}>
                {average_rating?.toFixed(1)} ({ratings_count?.toLocaleString()} ratings)
              </span>
            </div>
          </div>
        </div>
      )
    }
    ```

8. Create the types directory and Book type:

    ```bash
    mkdir -p types
    touch types/Book.ts
    ```
    
    Add this to `types/Book.ts`:
    
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

    ```
    typesense-next-search-bar/
    ├── components/
    │   ├── BookCard.tsx
    │   ├── BookCard.module.css
    │   ├── BookList.tsx
    │   ├── BookList.module.css
    │   ├── SearchBar.tsx
    │   └── Searchbar.module.css
    ├── lib/
    │   └── instantSearchAdapter.ts
    ├── pages/
    │   └── index.tsx
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── types/
    │   └── Book.ts
    ├── .eslintrc.json
    ├── .gitignore
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
    ```

9. Finally, update your `pages/index.tsx` to use these components:

    ```typescript
    import { InstantSearch } from 'react-instantsearch'
    import { typesenseInstantSearchAdapter } from '../lib/instantSearchAdapter'
    import { SearchBar } from '../components/SearchBar'
    import { BookList } from '../components/BookList'
    import Head from 'next/head'
    
    export default function Home() {
      return (
        <div className='min-h-screen bg-gray-50 py-8 px-4'>
          <Head>
            <title>Book Search with TypeSense</title>
            <meta name='description' content='Search through our collection of books' />
          </Head>
    
          <div className='max-w-7xl mx-auto'>
            <InstantSearch
              searchClient={typesenseInstantSearchAdapter.searchClient}
              indexName={process.env.NEXT_PUBLIC_TYPESENSE_INDEX || 'books'}
            >
              <SearchBar />
              <BookList />
            </InstantSearch>
          </div>
        </div>
      )
    }
    ```

    This is the main page that brings together all the required components. Notice that our `SearchBar` and `BookList` component are direct descendants of the `InstantSearch` component so that they have access to the `InstantSearch` context and vice-versa. Also notice that we pass the `typesenseInstantsearchAdapter` that we created in the lib directory as the `searchClient` to the `InstantSearch` component.

10. Run the application:

   ```bash
   npm run dev
   ```

   This will start the development server and open your default browser to [http://localhost:3000](http://localhost:3000). You should see the search interface with the book search results.

You've successfully built a search interface with Next.js and Typesense!

## Final Output

Here's how the final output should look like:

![NextJS Search Bar Final Output](~@images/next-search-bar/final-output.png)

## Source Code

Here's the complete source code for this project on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-next-search-bar](https://github.com/typesense/code-samples/tree/master/typesense-next-search-bar)

## Related Examples

Here's another related example that shows you how to build a search bar in a Next.JS application:

[Guitar Chords Search with Next.js](https://github.com/typesense/showcase-guitar-chords-search-next-js/tree/master)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help.
