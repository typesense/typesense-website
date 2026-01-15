# Building a Search Bar in NextJS

Adding full-text search capabilities to your React/Next.js projects has never been easier. This walkthrough will take you through all the steps required to build a simple book search application using Next.js and the Typesense ecosystem.

## Prerequisites

This guide will use [NextJS](https://nextjs.org/), a [React](https://react.dev/) framework for building full-stack web applications.

Please ensure you have [Node.js](https://nodejs.org/en) and [Docker](https://docs.docker.com/get-docker/) installed on your machine before proceeding. You will need it to run a typesense server locally and load it with some data. This will be used as a backend for this project.

This guide will use a Linux environment, but you can adapt the commands to your operating system.

### Step 1: Setup your Typesense server

Once Docker is installed, you can run a Typesense container in the background using the following commands:

- Create a folder that will store all searchable data stored for Typesense:

```shell
mkdir "$(pwd)"/typesense-data
```

- Run the Docker container:

```shell
# Run Typesense docker container on specified port
# Previously created folder as volume
# Cors mode enabled (for local)
docker run -p 8108:8108 \
-v"$(pwd)"/typesense-data:/data typesense/typesense:latest \
--data-dir /data \
--api-key=$TYPESENSE_API_KEY \
--enable-cors \
-d
```

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
- Alternatively, you can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with automatic backups, high availability, and more.

### Step 2 - Create a new books collection and load sample dataset into Typesense node

- Typesense needs you to create a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">collection</RouterLink> in order to search through documents. A collection is a named container that defines a schema and stores indexed documents for search. Collection bundles three things together

  1.  Schema
  2.  Document
  3.  Index

- You can create the books collection for this project using this `curl` command:

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

- Now that the collection is set up, we can load the sample dataset.

1. Download the sample dataset:

```shell
# Download the sample dataset
curl -O https://dl.typesense.org/datasets/books.jsonl.gz
```

2. Unzip the dataset:

```shell
# Unzip the gz dataset file to obtain the jsonl file
# gunzip command is standard in macos but feel free to use alternatives if necessary
gunzip books.jsonl.gz
```

3. Load the dataset on to typesense node:

```shell
curl "http://localhost:8108/collections/books/documents/import" \
      -X POST \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      --data-binary @books.jsonl
```

- You should see a bunch of success messages if the data load is successful. Now you're ready to actually build the application.

### Step 3: Setup your NextJs project

- Create a new NextJS project using this command:

```shell
npx create-next-app@latest typesense-next-search-bar
```

- This will ask you a bunch of questions, just go with the default choices. It's good enough for most people.

- Once your project scaffolding is ready, you need to install these three dependencies that will help you with implementing the search functionality. Use this command to install them:

```shell
npm i typesense typesense-instantsearch-adapter react-instantsearch
```

Let's go over these dependencies one by one

- **typesense**
  - Official javascript client for typesense.
  - It isn’t required for the UI, but it is needed if you want to interact with the Typesense server from Next.js API routes.
- **react-instantsearch**
  - A react library from Algolia that provides ready-to-use UI components for building search interfaces.
  - Offers components like SearchBox, Hits and others that make displaying search results easy.
  - It also abstracts state management, URL synchronization and other complex stuff.
  - By itself, it's designed to work with Algolia's hosted search service and not typesense
- **typesense-instantsearch-adapter**
  - This is the key library that acts as a bridge between the `react-instantsearch` and our self-hosted typesense server
  - This implements the `InstantSearch.js` adapter that `react-instantsearch` expects.
  - Translates the `InstantSearch.js` queries to Typesense API calls.

### Project Structure

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

3. Create the `lib` directory and `instantSearchAdapter.ts` file:

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

4. Copy this code into `lib/instantSearchAdapter.ts`:

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

- This config file creates a reusable adapter that connects your React application to your Typesense Backend. It can take in a bunch of additional search parameters like sort by, number of typos, etc.

5. Create the components directory and files:

```bash
mkdir -p components
touch components/SearchBar.tsx
touch components/BookList.tsx
touch components/BookCard.tsx
```

Your project structure should now look like this:

```
typesense-next-search-bar/
├── components/
│   ├── BookCard.tsx
│   ├── BookList.tsx
│   └── SearchBar.tsx
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

6. Let's create the `SearchBar` component. Add this to `components/SearchBar.tsx`:

```typescript
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

- The `SearchBox` component from `react-instantsearch` handles the search query internally through the InstantSearch [context](https://react.dev/learn/passing-data-deeply-with-context). This component will be a child of the `InstantSearch` component and automatically passes the user's search query to the `InstantSearch` context. This approach automatically handles input management, debouncing, and state synchronization.

7. Create the `BookList` component in `components/BookList.tsx`:

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

- This is a fairly simple component that will list all the search results obtained by the `useHits` hook. The `useHits` hook automatically connects to the nearest parent `InstantSearch` context and is subscribed to the state changes. It provides access to the current search results and additional metadata about the current search state

8. Create the `BookCard` component in `components/BookCard.tsx`:

```typescript
import type { Book } from '../types/Book'

export const BookCard = ({ book }: { book: Book }) => {
  return (
    <div className='book-card'>
      <img src={book.image_url} alt={book.title} />
      <h3>{book.title}</h3>
      <p>By: {book.authors?.join(', ')}</p>
      <p>Published: {book.publication_year}</p>
      <p>
        Rating: {book.average_rating} ({book.ratings_count} ratings)
      </p>
    </div>
  )
}
```

9. Create the types directory and Book type:

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
│   ├── BookList.tsx
│   └── SearchBar.tsx
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

10. Finally, update your `pages/index.tsx` to use these components:

```typescript
'use client'

import { InstantSearch } from 'react-instantsearch'
import { typesenseInstantSearchAdapter } from '../lib/instantSearchAdapter'
import { SearchBar } from '../components/SearchBar'
import { BookList } from '../components/BookList'
import { SearchBar } from './components/SearchBar'
import { BookList } from './components/BookList'

export default function Home() {
  return (
    <div>
      <InstantSearch
        searchClient={typesenseInstantSearchAdapter.searchClient}
        indexName={process.env.NEXT_PUBLIC_TYPESENSE_INDEX || 'books'}
      >
        <SearchBar />
        <BookList />
      </InstantSearch>
    </div>
  )
}
```

- This is the main page that brings together all the required components. Notice that our `SearchBar` and `BookList` component are direct descendants of the `InstantSearch` component so that they have access to the `InstantSearch` context and vice-versa. Also notice that we pass the `typesenseInstantsearchAdapter` that we created in the lib directory as the `searchClient` to the `InstantSearch` component.

You've successfully built a search interface with Next.js and Typesense!

### Source Code

- [Complete Project on GitHub](https://github.com/typesense/typesense-nextjs-search)
- [Typesense InstantSearch Adapter Documentation](https://github.com/typesense/typesense-instantsearch-adapter)

### Related Examples

- [Guitar Chords Search](https://github.com/typesense/showcase-guitar-chords-search-next-js/tree/master)

### Need Help?

- Check out the [Typesense documentation](https://typesense.org/docs/)
- Open an issue on [GitHub](https://github.com/typesense/typesense/issues) if you encounter any problems
