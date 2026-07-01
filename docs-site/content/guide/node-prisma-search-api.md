# Building a Search API with Node.js, Express, Prisma, and Typesense

This guide walks you through building a RESTful search API using Node.js, Express, PostgreSQL (via the Prisma ORM), and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

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
- Basic knowledge of REST APIs, Express, and Prisma

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
  postgres:16</code></pre>
    </div>
  </template>
</Tabs>

:::tip
You can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with a management UI, high availability, globally distributed search nodes and more.
:::

## Step 2: Initialize your Node.js project

Create the project and install dependencies:

```bash
mkdir typesense-node-prisma-search-app
cd typesense-node-prisma-search-app
npm init -y

# Install production dependencies
npm install express @prisma/client @prisma/adapter-pg pg typesense dotenv cors node-cron

# Install development dependencies
npm install -D typescript @types/node @types/express @types/cors @types/node-cron @types/pg prisma ts-node-dev
```

Initialize TypeScript and Prisma:

```bash
npx tsc --init
npx prisma init
```

What each dependency does:

- **express** - Fast web framework for Node.js
- **@prisma/client** & **prisma** - Next-generation TypeScript ORM
- **@prisma/adapter-pg** & **pg** - PostgreSQL client adapter for Prisma
- **typesense** - Official Typesense client
- **node-cron** - Task scheduler for background sync jobs

## Step 3: Create the project structure

Your project should follow a modular layout:

```plaintext
typesense-node-prisma-search-app/
├── prisma/
│   ├── schema.prisma        # Prisma schema definitions
│   └── migrations/          # Database migration files
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma Client configuration
│   │   └── env.ts           # Environment variable validation
│   ├── routes/
│   │   ├── books.ts         # CRUD API handlers
│   │   └── search.ts        # Search API handlers
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

Update your `.env` file generated by Prisma:

```bash
# Server
PORT=3000

# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:password@localhost:5432/typesense_books?schema=public"

# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
TYPESENSE_COLLECTION=books
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

Create `src/config/database.ts` to initialize the Prisma Client:

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});
```

## Step 5: Define the Book Model (Prisma)

Update your `prisma/schema.prisma` file with the `Book` model and PostgreSQL provider:

```plaintext
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Book {
  id               Int       @id @default(autoincrement())
  title            String    @db.VarChar(255)
  authors          Json      @default("[]")
  publication_year Int?
  average_rating   Decimal?  @db.Decimal(3, 2)
  image_url        String?   @db.VarChar(255)
  ratings_count    Int?
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt
  deleted_at       DateTime?

  @@map("books")
}
```

After updating the schema, generate the Prisma client and push the schema to the database:

```bash
npx prisma generate
npx prisma db push
```

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

This ensures your Typesense collection and schema correctly align with your Prisma model every time the application starts.

## Step 8: Paginated and Incremental Sync Logic

Handling sync efficiently is critical when dealing with millions of rows. We tackle this by implementing **paginated syncs**: instead of dumping an entire table into memory, we query PostgreSQL and import to Typesense in batches. We also use **incremental sync** based on `updated_at` to avoid re-syncing rows that haven't changed.

Add this to `src/search/sync.ts`:

```typescript
import { prisma } from '../config/database';
import { typesenseClient } from './client';
import { BOOKS_COLLECTION_NAME } from './collections';
import type { Book } from '@prisma/client';

export let lastSyncTime: Date = new Date(0);

const BATCH_SIZE = 1000;

const mapBookToTypesense = (b: Book) => ({
  id: b.id.toString(),
  title: b.title,
  authors: (Array.isArray(b.authors) ? b.authors : [b.authors]) as string[],
  publication_year: b.publication_year || 0,
  average_rating: b.average_rating ? Number(b.average_rating) : 0,
  image_url: b.image_url || '',
  ratings_count: b.ratings_count || 0,
});

export async function runFullSync() {
  console.log('Running full sync...');
  let lastId = 0;
  let hasMore = true;
  let totalProcessed = 0;

  while (hasMore) {
    let books: Book[];
    try {
      books = await prisma.book.findMany({
        where: { 
          id: { gt: lastId },
          deleted_at: null
        },
        take: BATCH_SIZE,
        orderBy: { id: 'asc' }
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

    const documents = books.map(mapBookToTypesense);

    try {
      await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
      totalProcessed += documents.length;
      console.log(`Full sync: Processed ${totalProcessed} books.`);
    } catch (err) {
      console.error('Error importing documents during full sync', err);
      break; 
    }
  }

  // Update lastSyncTime to now
  lastSyncTime = new Date();
  console.log('Full sync completed.');
}

export async function runIncrementalSync() {
  console.log(`Running incremental sync since ${lastSyncTime.toISOString()}...`);
  
  // 1. Process newly created or updated books in batches
  let lastUpsertId = 0;
  let hasMoreUpserts = true;
  let totalUpserted = 0;

  while (hasMoreUpserts) {
    let updatedBooks: Book[];
    try {
      updatedBooks = await prisma.book.findMany({
        where: {
          updated_at: { gt: lastSyncTime },
          deleted_at: null,
          id: { gt: lastUpsertId }
        },
        take: BATCH_SIZE,
        orderBy: { id: 'asc' }
      });
    } catch (err) {
      console.error('Database error during incremental sync upsert fetching:', err);
      break;
    }

    if (updatedBooks.length === 0) {
      hasMoreUpserts = false;
      break;
    }

    lastUpsertId = updatedBooks[updatedBooks.length - 1].id;
    const documents = updatedBooks.map(mapBookToTypesense);

    try {
      await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
      totalUpserted += documents.length;
    } catch (err) {
      console.error('Error upserting documents in incremental sync', err);
      break;
    }
  }

  if (totalUpserted > 0) {
    console.log(`Incremental sync: Upserted ${totalUpserted} books.`);
  }

  // 2. Process soft-deleted books in batches
  let lastDeleteId = 0;
  let hasMoreDeletes = true;
  let totalDeleted = 0;

  while (hasMoreDeletes) {
    let deletedBooks: Book[];
    try {
      deletedBooks = await prisma.book.findMany({
        where: {
          deleted_at: { gt: lastSyncTime },
          id: { gt: lastDeleteId }
        },
        take: BATCH_SIZE,
        orderBy: { id: 'asc' }
      });
    } catch (err) {
      console.error('Database error during incremental sync delete fetching:', err);
      break;
    }

    if (deletedBooks.length === 0) {
      hasMoreDeletes = false;
      break;
    }

    lastDeleteId = deletedBooks[deletedBooks.length - 1].id;
    const ids = deletedBooks.map(b => b.id.toString());

    try {
      // Bulk delete in Typesense using filter_by
      await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().delete({
        filter_by: `id:=[${ids.join(',')}]`
      });
      totalDeleted += deletedBooks.length;
    } catch (err) {
      console.error('Error deleting documents in incremental sync', err);
      break;
    }
  }

  if (totalDeleted > 0) {
    console.log(`Incremental sync: Deleted ${totalDeleted} books from Typesense.`);
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
      const latestBook = await prisma.book.findFirst({
        orderBy: { updated_at: 'desc' }
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
import { prisma } from '../config/database';
import type { Book } from '@prisma/client';
import { typesenseClient } from '../search/client';
import { BOOKS_COLLECTION_NAME } from '../search/collections';

const router = Router();

// Helper for real-time async sync
const syncBookToTypesense = async (book: Book) => {
  try {
    // Prisma returns JSON as Prisma.JsonValue, we cast to array for typesense
    const authorsArray = Array.isArray(book.authors) ? book.authors : [book.authors];
    
    const document = {
      id: book.id.toString(),
      title: book.title,
      authors: authorsArray as string[],
      publication_year: book.publication_year || 0,
      average_rating: book.average_rating ? Number(book.average_rating) : 0,
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
    const [count, rows] = await Promise.all([
      prisma.book.count({ where: { deleted_at: null } }),
      prisma.book.findMany({
        where: { deleted_at: null },
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' }
      })
    ]);
    
    res.json({
      total: count,
      page,
      limit,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /books/:id - Get a book
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.findUnique({
      where: { 
        id: parseInt(req.params.id),
        deleted_at: null 
      }
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /books - Create a book
router.post('/', async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.create({
      data: req.body
    });
    
    // Real-time async sync
    await syncBookToTypesense(book);

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT /books/:id - Update a book
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const existingBook = await prisma.book.findUnique({ where: { id: bookId, deleted_at: null } });
    
    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: req.body
    });

    // Real-time async sync
    await syncBookToTypesense(updatedBook);

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE /books/:id - Delete a book
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const existingBook = await prisma.book.findUnique({ where: { id: bookId, deleted_at: null } });
    
    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Soft delete
    await prisma.book.update({
      where: { id: bookId },
      data: { deleted_at: new Date() }
    });

    // Real-time async sync
    deleteBookFromTypesense(bookId);

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
import { prisma } from './config/database';
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
    await prisma.$connect();
    console.log('Database connected.');

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

Your API backend acts as a smart bridge: PostgreSQL guarantees your data integrity via Prisma ORM, Typesense enables blazing fast search, and the `node-cron` background worker gracefully keeps everything perfectly synchronized batch by batch!

## Step 13: Run your server

Start your backend application:

```bash
npm run dev
```

Expected startup output:

```plaintext
Connecting to PostgreSQL database...
Database connected.
Initializing Typesense...
Collection 'books' not found. Creating...
Collection 'books' created successfully.
Running startup sync...
Starting full sync...
Imported batch 1 (0 books)
Starting background sync worker (every 60 seconds)...
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
Starting full sync...
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

[https://github.com/typesense/code-samples/tree/master/typesense-node-prisma-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-node-prisma-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
