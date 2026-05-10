# Building a Search API with Node.js, Express, Sequelize, and Typesense

This guide walks you through building a RESTful search API using Node.js, Express, PostgreSQL (via the Sequelize ORM), and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

By the end of this guide, you'll have:

- A full CRUD API for a sample books dataset, backed by PostgreSQL
- Automatic database-to-Typesense sync (both real-time and periodic)
- Paginated sync that safely handles millions of records without memory issues
- Resilient Typesense client setup
- A search endpoint that proxies queries through your backend to Typesense

## What is Typesense?

Typesense is a lightning-fast, typo-tolerant search engine that makes it easy to add powerful search to your applications. It's designed to be simple to set up and blazing fast to use.

Why developers choose Typesense:

- **Blazing fast** - Search results appear in milliseconds, even across millions of documents.
- **Typo-tolerant** - Automatically corrects spelling mistakes so users find what they need.
- **Feature-Rich** - Full-text search, Synonyms, Curation Rules, Semantic Search, Hybrid search, Conversational Search (like ChatGPT for your data), RAG, Natural Language Search, Geo Search, Vector Search and much more wrapped in a single binary for a batteries-included developer experience.
- **Simple setup** - Get started in minutes with Docker, no complex configuration needed like Elasticsearch.
- **Cost-effective** - Self-host for free, unlike expensive alternatives like Algolia.
- **Open source** - Full control over your search infrastructure, or use [Typesense Cloud](https://cloud.typesense.org) for hassle-free hosting.

## Why Build a Backend Search API?

While Typesense can be accessed directly from frontend applications, some teams prefer to proxy requests through their backend APIs to:

- Retain full control over the exact API response structure.
- Add additional business logic on top of search results.
- Pre-process search queries before sending them to Typesense.
- Add custom conditional authentication logic that gets evaluated on every request, in addition to what <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">scoped search API keys</RouterLink> provide.
- Add custom rate limiting.

The tradeoff is that this introduces an additional network hop through the backend, compared to sending the requests going from users' devices directly to Typesense which adds more network latency.
Also, features like the [Search Delivery Network](/guide/typesense-cloud/search-delivery-network.md) in Typesense Cloud work based on the geo origin of search request, which if you intend to use, will see all requests as originating from your backend instead of end users' actual location.

## Architecture Overview

Before writing code, let's understand how the pieces fit together:

```text
┌─────────────┐     CRUD      ┌─────────────┐
│   Frontend  │ ────────────▶ │ Express API │
│             │ ◀──────────── │  (Node.js)  │
└─────────────┘    Search     └──────┬──────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                    ┌─────▼─────┐        ┌──────▼──────┐
                    │ PostgreSQL│        │  Typesense  │
                    │ (source   │        │  (search    │
                    │  of truth)│        │   index)    │
                    └─────┬─────┘        └──────▲──────┘
                          │                     │
                          └─────────────────────┘
                              Background Sync
                              (every 60 seconds)
```

**PostgreSQL** is the source of truth. All writes go there first. **Typesense** is the search index, kept in sync automatically via a background worker (using `node-cron`) that runs every 60 seconds. This pattern provides durable relational storage alongside sub-millisecond full-text search.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18+)
- [Docker](https://docs.docker.com/get-docker/) (for running Typesense and PostgreSQL)
- Basic knowledge of REST APIs, Express, and SQL

## Step 1: Start Typesense and PostgreSQL

Run both services using Docker:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code>mkdir typesense-data
<br>
&#35; Start Typesense
docker run -d -p 8108:8108 \
  -v "$(pwd)"/typesense-data:/data \
  typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }} \
  --data-dir /data \
  --api-key=xyz \
  --enable-cors
<br>
&#35; Start PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=typesense_books \
  postgres:15</code></pre>
    </div>
  </template>
</Tabs>

:::tip
You can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with a management UI, high availability, globally distributed search nodes and more.
:::

## Step 2: Initialize your Node.js project

Create the project and install dependencies:

```bash
mkdir typesense-node-sequelize-search-app
cd typesense-node-sequelize-search-app
npm init -y

# Install production dependencies
npm install express sequelize pg pg-hstore typesense dotenv cors node-cron

# Install development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/node-cron tsx
```

Initialize TypeScript:

```bash
npx tsc --init
```

What each dependency does:

- **express** - Fast web framework for Node.js
- **sequelize** - Modern TypeScript and Node.js ORM for Postgres
- **pg** & **pg-hstore** - PostgreSQL client for Node.js
- **typesense** - Official Typesense client
- **node-cron** - Task scheduler for background sync jobs

## Step 3: Create the project structure

Your project should follow a modular layout:

```plaintext
typesense-node-sequelize-search-app/
├── src/
│   ├── config/
│   │   ├── database.ts      # Sequelize configuration
│   │   └── env.ts           # Environment variable validation
│   ├── models/
│   │   └── Book.ts          # Sequelize Book model
│   ├── routes/
│   │   ├── books.ts         # CRUD API handlers
│   │   └── search.ts        # Search & sync API handlers
│   ├── search/
│   │   ├── client.ts        # Typesense client initialization
│   │   ├── collections.ts   # Typesense collection schema
│   │   ├── sync.ts          # DB → Typesense sync logic
│   │   └── worker.ts        # Background sync cron job
│   └── server.ts            # Application entry point
├── .env
├── package.json
└── tsconfig.json
```

## Step 4: Set up environment configuration

Add this to `.env`:

```bash
# Server
PORT=3000

# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
TYPESENSE_COLLECTION=books

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=typesense_books
```

Create `src/config/env.ts` to safely parse and export these environment variables:

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'typesense_books',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),

  TYPESENSE_HOST: process.env.TYPESENSE_HOST || 'localhost',
  TYPESENSE_PORT: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
  TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL || 'http',
  TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY || 'xyz',
};
```

Create `src/config/database.ts` to initialize the Sequelize connection:

```typescript
import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
```

## Step 5: Define the Book Model (Sequelize)

Add this to `src/models/Book.ts`:

```typescript
import { Model, DataTypes, type Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface BookAttributes {
  id: number;
  title: string;
  authors: string[];
  publication_year: number;
  average_rating: number;
  image_url: string;
  ratings_count: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface BookCreationAttributes extends Optional<BookAttributes, 'id'> {}

export class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  declare id: number;
  declare title: string;
  declare authors: string[];
  declare publication_year: number;
  declare average_rating: number;
  declare image_url: string;
  declare ratings_count: number;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    authors: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    publication_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      get() {
        const value = this.getDataValue('average_rating');
        return value === null ? null : parseFloat(value as unknown as string);
      }
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ratings_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true,
    paranoid: true, // Enables soft deletes (deletedAt)
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);
```

:::warning IMPORTANT: The `declare` keyword
Notice the use of the `declare` keyword for model fields in TypeScript. Do **not** use the `public` accessor without `declare`. If you define fields as `public id: number;`, the emitted JavaScript will unconditionally initialize these fields to `undefined` upon object creation, which shadows and completely overrides Sequelize's magic prototype-based getters and setters! Using `declare` tells TypeScript about the shape of your model without emitting initialization code.
:::

## Step 6: Initialize the Typesense Client

Add this to `src/search/client.ts`:

```typescript
import { Client } from 'typesense';
import { env } from '../config/env';

export const typesenseClient = new Client({
  nodes: [
    {
      host: env.TYPESENSE_HOST,
      port: env.TYPESENSE_PORT,
      protocol: env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 5,
});
```

## Step 7: Set up Automatic Collection Creation

Add this to `src/search/collections.ts`:

```typescript
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { typesenseClient } from './client';

export const BOOKS_COLLECTION_NAME = 'books';

export const booksCollectionSchema: CollectionCreateSchema = {
  name: BOOKS_COLLECTION_NAME,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'authors', type: 'string[]', facet: true },
    { name: 'publication_year', type: 'int32', facet: true, optional: true },
    { name: 'average_rating', type: 'float', facet: true, optional: true },
    { name: 'image_url', type: 'string', optional: true },
    { name: 'ratings_count', type: 'int32', optional: true },
  ],
};

export async function initializeTypesense(): Promise<void> {
  try {
    const collections = await typesenseClient.collections().retrieve();
    const collectionExists = collections.some((c) => c.name === BOOKS_COLLECTION_NAME);

    if (!collectionExists) {
      console.log(`Creating collection ${BOOKS_COLLECTION_NAME}...`);
      await typesenseClient.collections().create(booksCollectionSchema);
      console.log(`Collection ${BOOKS_COLLECTION_NAME} created successfully.`);
    } else {
      console.log(`Collection ${BOOKS_COLLECTION_NAME} already exists.`);
    }
  } catch (error) {
    console.error('Error initializing Typesense collection:', error);
    throw error;
  }
}
```

This ensures your Typesense collection and schema correctly align with your Sequelize model every time the application starts.

## Step 8: Paginated and Incremental Sync Logic

Handling sync efficiently is critical when dealing with millions of rows. We tackle this by implementing **paginated syncs**: instead of dumping an entire table into memory, we query PostgreSQL and import to Typesense in batches. We also use **incremental sync** based on `updated_at` to avoid re-syncing rows that haven't changed.

Add this to `src/search/sync.ts`:

```typescript
import { Op } from 'sequelize';
import { Book } from '../models/Book';
import { typesenseClient } from './client';
import { BOOKS_COLLECTION_NAME } from './collections';

export let lastSyncTime: Date = new Date(0);

const BATCH_SIZE = 1000;

export async function runFullSync() {
  console.log('Running full sync...');
  let lastId = 0;
  let hasMore = true;
  let totalProcessed = 0;

  while (hasMore) {
    let books: Book[];
    try {
      books = await Book.findAll({
        where: { id: { [Op.gt]: lastId } },
        limit: BATCH_SIZE,
        order: [['id', 'ASC']],
        paranoid: true, // Only fetch active records
      });
    } catch (err) {
      console.error('Database error during full sync fetching:', err);
      break; // Abort this sync run gracefully on DB failure
    }

    if (books.length === 0) {
      hasMore = false;
      break;
    }

    lastId = books[books.length - 1].id;

    const documents = books.map((b) => ({
      id: b.id.toString(),
      title: b.title,
      authors: b.authors,
      publication_year: b.publication_year || 0,
      average_rating: b.average_rating || 0.0,
      image_url: b.image_url || '',
      ratings_count: b.ratings_count || 0,
    }));

    try {
      await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
      totalProcessed += documents.length;
      console.log(`Full sync: Processed ${totalProcessed} books.`);
    } catch (err) {
      console.error('Error importing documents during full sync', err);
      // We can choose to break or continue here; breaking is safer on Typesense errors
      break; 
    }
  }

  // Update lastSyncTime to now
  lastSyncTime = new Date();
  console.log('Full sync completed.');
}

export async function runIncrementalSync() {
  console.log(`Running incremental sync since ${lastSyncTime.toISOString()}...`);
  
  // 1. Find newly created or updated books
  const updatedBooks = await Book.findAll({
    where: {
      updated_at: {
        [Op.gt]: lastSyncTime,
      },
    },
    paranoid: true, // Only active
  });

  if (updatedBooks.length > 0) {
    const documents = updatedBooks.map((b) => ({
      id: b.id.toString(),
      title: b.title,
      authors: b.authors,
      publication_year: b.publication_year || 0,
      average_rating: b.average_rating || 0.0,
      image_url: b.image_url || '',
      ratings_count: b.ratings_count || 0,
    }));

    try {
      await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
      console.log(`Incremental sync: Upserted ${documents.length} books.`);
    } catch (err) {
      console.error('Error upserting documents in incremental sync', err);
    }
  }

  // 2. Find soft-deleted books
  const deletedBooks = await Book.findAll({
    where: {
      deleted_at: {
        [Op.gt]: lastSyncTime,
      },
    },
    paranoid: false, // Include soft-deleted
  });

  if (deletedBooks.length > 0) {
    for (const book of deletedBooks) {
      try {
        await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents(book.id.toString()).delete();
        console.log(`Incremental sync: Deleted book ${book.id} from Typesense.`);
      } catch (err) {
        // Typesense might return 404 if document doesn't exist, which is fine
        const error = err as { httpStatus?: number };
        if (error.httpStatus !== 404) {
          console.error(`Error deleting book ${book.id} from Typesense`, err);
        }
      }
    }
  }

  lastSyncTime = new Date();
  console.log('Incremental sync completed.');
}

export async function determineAndRunStartupSync() {
  try {
    const searchStats = await typesenseClient.collections(BOOKS_COLLECTION_NAME).retrieve();
    const docCount = searchStats.num_documents;

    if (docCount === 0) {
      // Empty Typesense collection, full sync
      await runFullSync();
    } else {
      // Typesense has data, get latest updated_at from DB
      const latestBook = await Book.findOne({
        order: [['updated_at', 'DESC']],
        paranoid: false, // Check across all records
      });

      if (latestBook?.updated_at) {
        lastSyncTime = latestBook.updated_at;
      }
      
      await runIncrementalSync();
    }
  } catch (error) {
    console.error('Error during startup sync:', error);
  }
}
```

:::warning Sequelize Paranoid Tables
When searching for soft-deleted records to remove from Typesense, you MUST pass `{ paranoid: false }` into `Book.findAll(...)`. Otherwise, Sequelize's default behavior will automatically exclude rows where `deleted_at` is not null, and the records will forever linger in your Typesense index as ghosts.
:::

## Step 9: Add the Background Sync Worker

Using `node-cron`, we can trigger the incremental sync every 60 seconds automatically. Add this to `src/search/worker.ts`:

```typescript
import cron from 'node-cron';
import { runIncrementalSync } from './sync';

let isSyncRunning = false;

export function startBackgroundSyncWorker() {
  console.log('Starting background periodic sync worker (every 60s)...');
  
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    if (isSyncRunning) {
      console.log('Sync already running, skipping this iteration.');
      return;
    }

    isSyncRunning = true;
    try {
      await runIncrementalSync();
    } catch (error) {
      console.error('Error in background sync worker:', error);
    } finally {
      isSyncRunning = false;
    }
  });
}

export function getSyncStatus() {
  return {
    syncWorkerRunning: isSyncRunning,
  };
}
```

## Step 10: Build the CRUD API with real-time sync

Add this to `src/routes/books.ts`. Each write syncs to Typesense **asynchronously** so the HTTP response returns immediately:

```typescript
import { Router, type Request, type Response } from 'express';
import { Book } from '../models/Book';
import { typesenseClient } from '../search/client';
import { BOOKS_COLLECTION_NAME } from '../search/collections';

const router = Router();

// Helper for real-time async sync
const syncBookToTypesense = async (book: Book) => {
  try {
    const document = {
      id: book.id.toString(),
      title: book.title,
      authors: Array.isArray(book.authors) ? book.authors : [book.authors],
      publication_year: book.publication_year || 0,
      average_rating: typeof book.average_rating === 'number' ? book.average_rating : parseFloat(book.average_rating || '0'),
      image_url: book.image_url || '',
      ratings_count: book.ratings_count || 0,
    };
    
    console.log(`Syncing book ${book.id} to Typesense:`, document.title);
    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().upsert(document);
    console.log(`Successfully synced book ${book.id} to Typesense.`);
  } catch (err) {
    console.error(`Failed to sync book ${book.id} to Typesense:`, err);
    throw err;
  }
};

const deleteBookFromTypesense = async (id: number) => {
  try {
    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents(id.toString()).delete();
  } catch (err) {
    console.error(`Failed to delete book ${id} from Typesense`, err);
  }
};

// GET /books - Get all books with pagination
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Book.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']]
    });
    
    res.json({
      total: count,
      page,
      limit,
      data: rows
    });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /books/:id - Get a book
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /books - Create a book
router.post('/', async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);
    
    // Real-time async sync (now awaited to ensure consistency in tests)
    await syncBookToTypesense(book);

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT /books/:id - Update a book
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await book.update(req.body);

    // Real-time async sync (now awaited to ensure consistency in tests)
    await syncBookToTypesense(book);

    res.json(book);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE /books/:id - Delete a book
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await book.destroy();

    // Real-time async sync
    deleteBookFromTypesense(book.id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
```

## Step 11: Build the search and sync routes

Add this to `src/routes/search.ts`:

```typescript
import { Router, type Request, type Response } from 'express';
import { typesenseClient } from '../search/client';
import { BOOKS_COLLECTION_NAME } from '../search/collections';
import { runFullSync, lastSyncTime } from '../search/sync';
import { getSyncStatus } from '../search/worker';

const router = Router();

// GET /search?q=<query>
router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string || '';
  
  try {
    const searchResults = await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().search({
      q: query,
      query_by: 'title,authors',
    });
    
    res.json({
      query,
      found: searchResults.found,
      results: searchResults.hits,
      facet_counts: searchResults.facet_counts || [],
    });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST /sync - Trigger manual sync
router.post('/sync', async (_req: Request, res: Response) => {
  try {
    // We run full sync here for manual trigger, but you could also run incremental
    await runFullSync();
    
    res.json({
      message: 'Sync completed',
      syncedAt: lastSyncTime.toISOString()
    });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to sync books' });
  }
});

// GET /sync/status - Check sync status
router.get('/sync/status', (_req: Request, res: Response) => {
  res.json({
    lastSyncTime: lastSyncTime.toISOString(),
    syncWorkerRunning: getSyncStatus().syncWorkerRunning
  });
});

export default router;
```

## Step 12: Wire it all together in the Server

Assemble the dependencies in `src/server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { sequelize } from './config/database';
import { initializeTypesense } from './search/collections';
import { determineAndRunStartupSync } from './search/sync';
import { startBackgroundSyncWorker } from './search/worker';

import booksRouter from './routes/books';
import searchRouter from './routes/search';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/books', booksRouter);
app.use('/', searchRouter);

async function startServer() {
  try {
    // 1. Connect to PostgreSQL
    console.log('Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    // In production, use migrations instead of sync()
    await sequelize.sync(); 
    console.log('Database connected and models synced.');

    // 2. Initialize Typesense
    console.log('Initializing Typesense...');
    await initializeTypesense();

    // 3. Run Startup Sync
    console.log('Running startup sync...');
    await determineAndRunStartupSync();

    // 4. Start Background Worker
    startBackgroundSyncWorker();

    // 5. Start Express API
    app.listen(env.PORT, () => {
      console.log(`Server is running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

Your API backend acts as a smart bridge: PostgreSQL guarantees your data integrity, Typesense enables blazing fast search, and the `node-cron` background worker gracefully keeps everything perfectly synchronized!

## Step 13: Run your server

Start your backend application:

```bash
npm run dev
```

Expected startup output:

```plaintext
PostgreSQL connected and synced.
Collection 'books' not found. Creating...
Collection 'books' created successfully.
Running initial full sync...
Starting sync since 1970-01-01T00:00:00.000Z
Imported batch 1 (0 books)
Background sync worker scheduled (every 60 seconds)
Server listening on port 3000
```

## Testing the API

**Create a book** - syncs to Typesense in the background:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The TypeScript Handbook",
    "authors": ["Microsoft"],
    "publication_year": 2020,
    "average_rating": 4.8,
    "image_url": "https://example.com/tsbook.jpg",
    "ratings_count": 5000
  }'
```

**Search** - Typesense handles typos automatically:

```bash
curl "http://localhost:3000/search?q=typescript"
curl "http://localhost:3000/search?q=handbuk"   # typo - still finds Handbook
```

**Trigger a manual sync** (useful after bulk database changes):

```bash
curl -X POST http://localhost:3000/sync
```

Response:

```json
{
  "message": "Sync completed",
  "newSyncTime": "2026-02-25T11:30:39.000Z",
  "syncedAt": "2026-02-25T11:30:39.000Z",
  "deletedBooks": 0
}
```

**Check sync worker status:**

```bash
curl http://localhost:3000/sync/status
```

Response:

```json
{
  "lastSyncTime": "2026-02-25T11:30:39.000Z",
  "syncWorkerRunning": true
}
```

**Example paginated sync log** (10,000 records, 10 pages of 1,000):

```plaintext
Starting sync since 2026-02-25T11:30:39.000Z
Imported batch 1 (1000 books)
Imported batch 2 (1000 books)
...
Imported batch 10 (1000 books)
```

## How the sync strategies work together

The three sync strategies complement each other:

| Strategy | When | Latency | Use case |
| --- | --- | --- | --- |
| Real-time (async) | On each CRUD write | < 100ms | Individual creates, updates, deletes |
| Periodic (worker) | Every 60 seconds | Up to 60s | Catch-up for any missed real-time syncs |
| Manual (`POST /sync`) | On demand | Depends on volume | After bulk DB imports, after outages |

The periodic sync is the safety net. Even if the real-time async sync fails (e.g. Typesense was briefly down), the periodic sync picks up all changed records by comparing `updated_at` against `lastSyncTime`.

## Production Considerations

### Restrict CORS origins

```typescript
app.use(cors({ origin: 'https://yourdomain.com' }));
```

### Add an authentication middleware

```typescript
app.use(authMiddleware());
```

### Use production Typesense

```bash
TYPESENSE_HOST=xxx.typesense.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your-production-key
```

## Source Code

The complete source code for this project is available on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-node-sequelize-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-node-sequelize-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
