# Building a Search Bar with Astro and Typesense

This walkthrough demonstrates how to implement a full-text search interface in an Astro site using Typesense. [**Astro**](https://astro.build/) is the web framework for building **content-driven websites** like blogs, marketing, and e-commerce.

## Prerequisites

- Please ensure you have [Node.js](https://nodejs.org/en) and [Docker](https://docs.docker.com/get-docker/) installed on your machine before proceeding. You will need it to run a typesense server locally and load it with some data. This will be used as a backend for this project.
- Basic knowledge of Astro & any modern frontend framework. This project uses [React](https://react.dev/).
- This guide will use a Linux environment, but you can adapt the commands to your operating system.

## Quick Start

### 1. Create a new Astro app using the CLI

```bash
npm create astro@latest typesense-astro-search
```

- This will take you through a bunch of questions. Choose the `Use minimal (empty) template` option to setup your project. We will create the necessary folder structure ourselves.

### 2. Install the required dependencies

```bash
npm install typesense typesense-instantsearch-adapter react-instantsearch
```

### 3. Add React Support

- Astro uses an [**islands architecture**](https://docs.astro.build/en/concepts/islands/) where interactive components (islands) are hydrated with JavaScript, while the rest of the page remains static HTML for better performance.
- Astro supports other frontend [integrations](https://docs.astro.build/en/guides/integrations-guide/#official-integrations) as well. Feel free to use any frontend framework of your choice.

To add React support:

```bash
npx astro add react
```

This will set up React in your Astro project, including any necessary configurations.

### 4. Set up Typesense server

#### Start Typesense with Docker

```bash
# Create a directory for Typesense data
mkdir -p typesense-data

# Run Typesense container
docker run -p 8108:8108 \
  -v "$(pwd)/typesense-data:/data" typesense/typesense:latest \
  --data-dir /data \
  --api-key=xyz \
  --enable-cors \
  -d
```

- Alternatively, you can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with automatic backups, high availability, and more.

#### Create a books collection

```bash
curl "http://localhost:8108/collections"  \
-X POST \
-H "Content-Type: application/json"  \
-H "X-TYPESENSE-API-KEY: xyz" \
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

#### Load sample data

```bash
# Download sample dataset
curl -O https://dl.typesense.org/datasets/books.jsonl.gz

# Unzip the dataset
gunzip books.jsonl.gz

# Import data into Typesense
curl "http://localhost:8108/collections/books/documents/import"  \
-X POST \
-H "X-TYPESENSE-API-KEY: xyz"  \
--data-binary @books.jsonl
```

### 4. Configure environment variables

Create a `.env` file in the project root with the following content:

```env
PUBLIC_TYPESENSE_API_KEY=xyz
PUBLIC_TYPESENSE_HOST=localhost
PUBLIC_TYPESENSE_PORT=8108
PUBLIC_TYPESENSE_PROTOCOL=http
```

- Note that the environment variables need to have a prefix of `PUBLIC_` for client-side Astro code to access them.
- Environment variables not having a `PUBLIC_` prefix are only accessible on the server-side.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser and make sure there are no errors.

### 6. Project structure

Let's create the project structure step by step. After each step, we'll show you how the directory structure evolves.

1. Your initial Astro app structure should look like this:

```bash
├── README.md
├── astro.config.mjs
├── package-lock.json
├── package.json
├── public
│   └── favicon.svg
├── src
│   └── pages
│       └── index.astro
└── tsconfig.json
```

2. Create a new folder called `components` in the `src` directory with the following files:

```bash
mkdir src/components

touch src/components/BookCard.tsx
touch src/components/BookSearch.tsx
touch src/components/BookResults.tsx
```

3. Copy the following code into the `src/components/BookSearch.tsx` file:

```ts
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch'
import BookResults from './BookResults'
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'

const typesenseInstantSearchAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: import.meta.env.PUBLIC_TYPESENSE_API_KEY || '1234',
    nodes: [
      {
        host: import.meta.env.PUBLIC_TYPESENSE_HOST || 'localhost',
        port: Number(import.meta.env.PUBLIC_TYPESENSE_PORT || 8108),
        protocol: import.meta.env.PUBLIC_TYPESENSE_PROTOCOL || 'http',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,authors',
  },
})

const BookSearch = () => {
  return (
    <div>
      <InstantSearch searchClient={typesenseInstantSearchAdapter.searchClient} indexName='books'>
        <Configure hitsPerPage={12} />
        <div>
          <h1>Book Search</h1>
          <p>Discover your next favorite book</p>
        </div>
        <div>
          <SearchBox placeholder='Search by title or author...' />
        </div>
        <BookResults />
      </InstantSearch>
    </div>
  )
}

export default BookSearch
```

- This component uses the `InstantSearch` component from `react-instantsearch` to connect to the Typesense server and perform search operations.
- The `SearchBox` component is used to display a search box that allows users to enter search queries.
- The `BookResults` component is used to display the search results.

4. Copy the following code into the `src/components/BookResults.tsx` file:

```ts
import { useState, useEffect } from 'react'
import { useHits } from 'react-instantsearch'
import type { Book } from '../types/Book'
import BookCard from './BookCard'

const BookResults = () => {
  const { items, results } = useHits<Book>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add a small delay to prevent flash of loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [items])

  if (isLoading) {
    return (
      <div>
        <p>Searching for books...</p>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div>
        <h3>No books found</h3>
        <p>Try adjusting your search or try different keywords.</p>
      </div>
    )
  }

  return (
    <div>
      {results?.nbHits && <p>{results.nbHits.toLocaleString()} results found</p>}
      <div>
        {items.map(book => (
          <BookCard key={book.objectID} book={book} />
        ))}
      </div>
    </div>
  )
}

export default BookResults
```

- This component uses the `useHits` hook from `react-instantsearch` to retrieve the search results from the Typesense server.
- The `useHits` hook automatically connects to the nearest parent `InstantSearch` context and is subscribed to the state changes. It also provides access to additional metadata about the current search state
- The `BookCard` component is used to display each book in the search results.

5. Copy the following code into the `src/components/BookCard.tsx` file:

```ts
import type { Book } from '../types/Book'

const BookCard = ({ book }: { book: Book }) => {
  return (
    <div>
      {book.image_url && (
        <div>
          <img
            src={book.image_url}
            alt={`Cover of ${book.title}`}
            onError={e => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}
      <div>
        <h3>{book.title}</h3>
        <p>{book.authors?.join(', ') || 'Unknown Author'}</p>
        <div>
          <span>{'★'.repeat(Math.round(book.average_rating || 0))}</span>
          <span>
            {book.average_rating?.toFixed(1)} ({book.ratings_count?.toLocaleString() || 0} ratings)
          </span>
        </div>
        {book.publication_year && <p>Published: {book.publication_year}</p>}
      </div>
    </div>
  )
}

export default BookCard
```

Now your project's folder structure should look like this:

```bash
├── README.md
├── astro.config.mjs
├── package-lock.json
├── package.json
├── public
│   └── favicon.svg
├── src
│   └── components
│       ├── BookCard.tsx
│       ├── BookResults.tsx
│       └── BookSearch.tsx
│   └── pages
│       └── index.astro
└── tsconfig.json
```

7. Create a new folder called `types` in the `src` directory with the following file:

```bash
mkdir src/types
touch src/types/Book.ts
```

Copy the following code into the `src/types/Book.ts` file:

```ts
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

This is how your final project structure should look like:

```bash
├── README.md
├── astro.config.mjs
├── package-lock.json
├── package.json
├── public
│   └── favicon.svg
├── src
│   └── components
│       ├── BookCard.tsx
│       ├── BookResults.tsx
│       └── BookSearch.tsx
│   └── pages
│       └── index.astro
│   └── types
│       └── Book.ts
└── tsconfig.json
```

8. We are almost done. Now, let's populate the index page. Copy the following code into the `src/pages/index.astro` file:

```ts
---
import BookSearch from "../components/BookSearch"
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<BookSearch client:only="react" />
	</body>
</html>

```

- Notice the `client:only="react"` attribute on the `BookSearch` component. This is necessary because we are using React components in our Astro app.
- Astro supports other [client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives) that lets us control how UI framework components are hydrated on the page.
- Astro uses a code fence (`---`) to identify the component script in your Astro component. This is called [frontmatter](https://docs.astro.build/en/basics/astro-components/#the-component-script). This code is executed on the server-side and is not sent to the client-side.

That's it! You now have a working Astro app with React components and a search functionality using Typesense.

### Source Code

- [Complete Project on GitHub](https://github.com/typesense/typesense-astro-search)
- [Typesense InstantSearch Adapter Documentation](https://github.com/typesense/typesense-instantsearch-adapter)

### Need Help?

- Check out the [Typesense documentation](https://typesense.org/docs/)
- Open an issue on [GitHub](https://github.com/typesense/typesense/issues) if you encounter any problems
