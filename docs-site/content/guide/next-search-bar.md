# NextJS Full-Text Search

Adding full-text search capabilities to your React/NextJs projects has never been easier. This walkthrough will take you through all the steps required to build a simple book search application using NextJS and a few typesense libraries.

## Prerequisites

This guide will use [NextJS](https://nextjs.org/), a [React](https://react.dev/) framework for building full-stack web applications.

Please ensure that you have Docker installed on your machine before proceeding. You will need it to run a typesense server locally and load it with some data. This will be used as a backend for this project. You can install Docker by following the instructions on the [official Docker website](https://docs.docker.com/get-docker/)

This guide will use a Linux environment, but you can adapt the commands to your operating system.

### Step 1: Setup your Typesense server

Once you have docker installed in your system, you can create a typesense container and run it in the background using this command

- Create a folder that will store all searchable data stored in typesense

```shell
mkdir "$(pwd)"/typesense-data
```

- Run the docker container

```shell
# Run typesense docker container on specified port
# Previously created folder as volume
# Cors mode enabled (for local)
docker run -p 8108:8108 \
-v"$(pwd)"/typesense-data:/data typesense/typesense:29.0 \
--data-dir /data \
--api-key=$TYPESENSE_API_KEY \
--enable-cors \
-d
```

- Verify if your docker container was created properly

```shell
docker ps
```

- You should see the typesense container running without any issues

```shell
CONTAINER ID   IMAGE                      COMMAND                  CREATED       STATUS       PORTS                                         NAMES
82dd6bdfaf66   typesense/typesense:29.0   "/opt/typesense-serv…"   1 min ago   Up 1 minutes   0.0.0.0:8108->8108/tcp, [::]:8108->8108/tcp   nostalgic_babbage
```

- That's it! You are now ready to create collections and load data into your typesense server

### Step 2 - Create a new book collection and load sample dataset into typesense node

- Typesense needs you to create a collection in order to search through documents. A collection is a named container that defines a schema and stores indexed documents for search. Collection bundles three things together

  1.  Schema
  2.  Document
  3.  Index

- You can create the book collection for this project using this curl command

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

- Now that we have our collection ready, we are ready to load the sample dataset. Use these commands to download and load the sample dataset.

1. Download the sample dataset

```shell
# Download the sample dataset
curl -O https://dl.typesense.org/datasets/books.jsonl.gz
```

2. Unzip the dataset

```shell
# Unzip the gz dataset file to obtain the jsonl file
# gunzip command is standard in macos but feel free to use alternatives if necessary
gunzip books.jsonl.gz
```

3. Load the dataset on to typesense node

```shell
curl "http://localhost:8108/collections/books/documents/import" \
      -X POST \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      --data-binary @books.jsonl
```

- You should see a bunch of success messages if the data load is successful. Now you're ready to actually build the application.

### Step 3: Setup your NextJs project

- Create a new NextJS project using this command

```shell
npx create-next-app@latest typesense-next-search-bar
```

- This will ask you a bunch of questions, just go with the default choices. It's good enough for most people.

- Once your project scaffolding is ready, you need to install these three dependencies that will help you with implementing the search functionality. Use this command to install them

```shell
npm i typesense typesense-instantsearch-adapter react-instantsearch
```

Let's go over these dependencies one by one

- **typesense**
  - Official javascript client for typesense.
  - It's not strictly required for the UI aspect but if you need to interact with the Typesense server directly from the NextJS API routes, it's needed.
- **react-instantsearch**
  - A react library from Algolia that provides ready-to-use UI components for building search interfaces.
  - Offers components like SearchBox, Hits, etc that helps with easily obtaining search results, abstracts state management, URL synchronization and other complex stuff.
  - By itself, it's designed to work with Algolia's hosted search service and not typesense
- **typesense-instantsearch-adapter**
  - This is the key library that acts as a bridge between the `react-instantsearch` and our self-hosted typesense server
  - This implements the `InstantSearch.js` adapter that `react-instantsearch` expects.
  - Translates the `InstantSearch.js` queries to Typesense API calls.

### Project structure

```
.
├── README.md
├── components
│   ├── BookCard.tsx
│   ├── BookList.tsx
│   ├── SearchBar.tsx
├── eslint.config.mjs
├── lib
│   └── instantSearchAdapter.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── pages
│   └── index.tsx
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tsconfig.json
└── types
    └── Book.ts

```

```
 💡 Note: We will focus more on the typesense aspects in this walkthrough
```

Let's go over the key parts and components of this project one by one.

### lib/instantSearchAdapter.js

```ts
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

- This config file creates a reusable adapter that connects your React application to your Typesense Backend. It can take in a bunch of additional search parameters like sort by, number of typos etc.

### components/SearchBar.tsx

```ts
import { SearchBox } from 'react-instantsearch'

export const SearchBar = () => {
  return (
    <div>
      <h1>Book Search</h1>
      <SearchBox placeholder='Search for books by title or author...' />
    </div>
  )
}
```

- The `SearchBox` component from `react-instantsearch` handles the search query internally through the InstantSearch [context](https://react.dev/learn/passing-data-deeply-with-context).
- This component will be a child of the InstantSearch component and will automatically pass all the input query from the user to InstantSearch conext.
- The beauty is that it handles all the input management, debouncing and state synchronization automatically. Easy!

### components/BookList.tsx

```ts
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

- This is a fairly simple component that will list all the search results obtained by the `useHits` hook.
- The `useHits` hook automatically connects to the nearest parent InstantSearch context and is subscribed to the state changes.
- It provides access to the current search results.
- Along with the actual search results it also returns a lot of other metadata about the search state.

### components/BookCard.tsx

- This is a simple component that lists each books details.

### pages/index.tsx

```ts
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

- This is the base component with all the required components. Notice that our `SearchBar` and `BookList` component are direct descendants of the `InstantSearch` component so that they have access it's context and vice-versa.
- Also notice that we pass the `typesenseInstantsearchAdapter` that we created in the lib directory as the `searchClient` to the `InstantSearch` component.
