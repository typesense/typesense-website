# Building a Search API with Node.js, Express, Drizzle ORM, and Typesense

This guide walks you through building a RESTful search API using Node.js, Express, PostgreSQL (via the Drizzle ORM), and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

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
- **Feature-Rich** - Full-text search, Synonyms, Curation Rules, Semantic Search, Hybrid search, Conversational Search, RAG, Natural Language Search, Geo Search, Vector Search and much more.
- **Simple setup** - Get started in minutes with Docker.
- **Cost-effective** - Self-host for free, or use [Typesense Cloud](https://cloud.typesense.org) for managed hosting.

## Why Build a Backend Search API?

While Typesense can be accessed directly from frontend applications, some teams prefer to proxy requests through their backend APIs to:

- Retain full control over the exact API response structure.
- Add additional business logic on top of search results.
- Add custom conditional authentication and rate limiting.

## Architecture Overview

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

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+)
- [Docker](https://docs.docker.com/get-docker/)
- Basic knowledge of REST APIs and TypeScript

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
  -e POSTGRES_DB=testdb \
  postgres:16</code></pre>
    </div>
  </template>
</Tabs>

## Step 2: Initialize your Node.js project

Create the project and install dependencies:

```bash
mkdir typesense-node-drizzle-search-app
cd typesense-node-drizzle-search-app
npm init -y

# Install production dependencies
npm install express drizzle-orm pg typesense dotenv cors node-cron

# Install development dependencies
npm install -D typescript drizzle-kit @types/node @types/express @types/cors @types/node-cron @types/pg ts-node-dev
```

Initialize TypeScript:

```bash
npx tsc --init
```

What each dependency does:

- **express** - Fast web framework for Node.js
- **drizzle-orm** & **drizzle-kit** - Lightweight, performance-first TypeScript ORM
- **pg** - PostgreSQL client for Node.js
- **typesense** - Official Typesense client
- **node-cron** - Task scheduler for background sync jobs

## Step 3: Create the project structure

```plaintext
typesense-node-drizzle-search-app/
├── src/
│   ├── config/
│   │   ├── database.ts      # Drizzle instance configuration
│   │   └── env.ts           # Environment variable validation
│   ├── db/
│   │   └── schema.ts        # Database schema definitions
│   ├── routes/
│   │   ├── books.ts         # CRUD API handlers
│   │   └── search.ts        # Search API handlers
│   ├── search/
│   │   ├── client.ts        # Typesense client initialization
│   │   ├── collections.ts   # Typesense collection schema
│   │   ├── sync.ts          # DB → Typesense sync logic
│   │   └── worker.ts        # Background sync cron job
│   └── server.ts            # Application entry point
├── drizzle.config.ts        # Drizzle Kit configuration
├── .env
├── package.json
└── tsconfig.json
```

## Step 4: Set up environment configuration

Update your `.env` file:

```bash
PORT=3002
DATABASE_URL="postgresql://postgres:password@localhost:5432/testdb?schema=public"

TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
TYPESENSE_COLLECTION=books
```

Create `src/config/env.ts` to safely parse and export these environment variables:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();

const requiredEnvs = [
  'DATABASE_URL',
  'TYPESENSE_HOST',
  'TYPESENSE_PORT',
  'TYPESENSE_PROTOCOL',
  'TYPESENSE_API_KEY',
  'TYPESENSE_COLLECTION',
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL!,
  TYPESENSE_HOST: process.env.TYPESENSE_HOST!,
  TYPESENSE_PORT: parseInt(process.env.TYPESENSE_PORT!, 10),
  TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL!,
  TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY!,
  TYPESENSE_COLLECTION: process.env.TYPESENSE_COLLECTION!,
};
```

Create `src/config/database.ts` to initialize the Drizzle connection:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';
import * as schema from '../db/schema';

// Create a pg pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Create the Drizzle instance
export const db = drizzle(pool, { schema });
```

## Step 5: Define the Database Schema (Drizzle)

Define your `books` table in `src/db/schema.ts`:

```typescript
import { pgTable, serial, varchar, json, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  authors: json('authors').default('[]').notNull(),
  publicationYear: integer('publication_year'),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
  imageUrl: varchar('image_url', { length: 255 }),
  ratingsCount: integer('ratings_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: timestamp('deleted_at'),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
```

Set up Drizzle Kit configuration in `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Push the schema to the database:

```bash
npx drizzle-kit push
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
  retryIntervalSeconds: 1,
  numRetries: 3,
});
```

## Step 7: Set up Automatic Collection Creation

Add this to `src/search/collections.ts`:

```typescript
import { typesenseClient } from './client';
import { env } from '../config/env';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export const BOOKS_COLLECTION_NAME = env.TYPESENSE_COLLECTION;

export async function initializeTypesense() {
  const schema: CollectionCreateSchema = {
    name: BOOKS_COLLECTION_NAME,
    fields: [
      { name: 'title', type: 'string', facet: false },
      { name: 'authors', type: 'string[]', facet: true },
      { name: 'publication_year', type: 'int32', facet: true },
      { name: 'average_rating', type: 'float', facet: true },
      { name: 'image_url', type: 'string', facet: false },
      { name: 'ratings_count', type: 'int32', facet: true },
    ],
    default_sorting_field: 'ratings_count',
  };

  try {
    await typesenseClient.collections(BOOKS_COLLECTION_NAME).retrieve();
    console.log(`Collection '${BOOKS_COLLECTION_NAME}' already exists.`);
  } catch (error: any) {
    if (error.httpStatus === 404) {
      console.log(`Collection '${BOOKS_COLLECTION_NAME}' not found. Creating...`);
      await typesenseClient.collections().create(schema);
      console.log(`Collection '${BOOKS_COLLECTION_NAME}' created successfully.`);
    } else {
      throw error;
    }
  }
}
```

## Step 8: Paginated and Incremental Sync Logic

Handling sync efficiently is critical when dealing with millions of rows. We tackle this by implementing **paginated syncs**: instead of dumping an entire table into memory, we query PostgreSQL and import to Typesense in batches. We also use **incremental sync** based on `updated_at` to avoid re-syncing rows that haven't changed.

Add this to `src/search/sync.ts`:

```typescript
import { db } from '../config/database';
import { books, type Book } from '../db/schema';
import { typesenseClient } from './client';
import { BOOKS_COLLECTION_NAME } from './collections';
import { eq, gt, isNull, and, isNotNull, desc } from 'drizzle-orm';

export let lastSyncTime: Date = new Date(0);

const BATCH_SIZE = 1000;

const mapBookToTypesense = (b: Book) => ({
  id: b.id.toString(),
  title: b.title,
  authors: (Array.isArray(b.authors) ? b.authors : [b.authors]) as string[],
  publication_year: b.publicationYear || 0,
  average_rating: b.averageRating ? Number(b.averageRating) : 0,
  image_url: b.imageUrl || '',
  ratings_count: b.ratingsCount || 0,
});

export async function runFullSync() {
  console.log('Running full sync...');
  let lastId = 0;
  let hasMore = true;
  let totalProcessed = 0;

  while (hasMore) {
    let fetchedBooks: Book[];
    try {
      fetchedBooks = await db.select()
        .from(books)
        .where(
          and(
            gt(books.id, lastId),
            isNull(books.deletedAt)
          )
        )
        .limit(BATCH_SIZE)
        .orderBy(books.id);
    } catch (err) {
      console.error('Database error during full sync fetching:', err);
      break;
    }

    if (fetchedBooks.length === 0) {
      hasMore = false;
      break;
    }

    lastId = fetchedBooks[fetchedBooks.length - 1].id;
    const documents = fetchedBooks.map(mapBookToTypesense);

    try {
      await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
      totalProcessed += documents.length;
      console.log(`Full sync: Processed ${totalProcessed} books.`);
    } catch (err) {
      console.error('Error importing documents during full sync', err);
      break; 
    }
  }

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
      updatedBooks = await db.select()
        .from(books)
        .where(
          and(
            gt(books.updatedAt, lastSyncTime),
            isNull(books.deletedAt),
            gt(books.id, lastUpsertId)
          )
        )
        .limit(BATCH_SIZE)
        .orderBy(books.id);
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
      deletedBooks = await db.select()
        .from(books)
        .where(
          and(
            gt(books.updatedAt, lastSyncTime),
            isNotNull(books.deletedAt),
            gt(books.id, lastDeleteId)
          )
        )
        .limit(BATCH_SIZE)
        .orderBy(books.id);
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
      await runFullSync();
    } else {
      const latestBook = await db.select()
        .from(books)
        .orderBy(desc(books.updatedAt))
        .limit(1);

      if (latestBook.length > 0 && latestBook[0].updatedAt) {
        lastSyncTime = latestBook[0].updatedAt;
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
  console.log('Starting background sync worker (every 60 seconds)...');

  cron.schedule('*/60 * * * * *', async () => {
    if (isSyncRunning) {
      console.log('Sync already running, skipping this interval.');
      return;
    }

    isSyncRunning = true;
    try {
      await runIncrementalSync();
    } catch (err) {
      console.error('Error during background incremental sync:', err);
    } finally {
      isSyncRunning = false;
    }
  });
}
```

## Step 10: Build the CRUD API with real-time sync

Add this to `src/routes/books.ts`. Each write syncs to Typesense **asynchronously** so the HTTP response returns immediately:

```typescript
import { Router, type Request, type Response } from 'express';
import { db } from '../config/database';
import { books, type Book } from '../db/schema';
import { eq, isNull, count } from 'drizzle-orm';
import { typesenseClient } from '../search/client';
import { BOOKS_COLLECTION_NAME } from '../search/collections';

const router = Router();

const syncBookToTypesense = async (book: Book) => {
  try {
    const authorsArray = Array.isArray(book.authors) ? book.authors : [book.authors];
    
    const document = {
      id: book.id.toString(),
      title: book.title,
      authors: authorsArray as string[],
      publication_year: book.publicationYear || 0,
      average_rating: book.averageRating ? Number(book.averageRating) : 0,
      image_url: book.imageUrl || '',
      ratings_count: book.ratingsCount || 0,
    };
    
    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().upsert(document);
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

router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);
  const offset = (page - 1) * limit;

  try {
    const totalCountRes = await db.select({ value: count() }).from(books).where(isNull(books.deletedAt));
    const totalCount = totalCountRes[0].value;

    const rows = await db.select()
      .from(books)
      .where(isNull(books.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(books.id);
    
    res.json({
      total: totalCount,
      page,
      limit,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id as string);
    const result = await db.select().from(books).where(eq(books.id, bookId));
    const book = result.find(b => b.deletedAt === null);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await db.insert(books).values(req.body).returning();
    const book = result[0];
    
    await syncBookToTypesense(book);

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id as string);
    const existing = await db.select().from(books).where(eq(books.id, bookId));
    
    if (existing.length === 0 || existing[0].deletedAt !== null) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updated = await db.update(books)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(books.id, bookId))
      .returning();

    const updatedBook = updated[0];
    await syncBookToTypesense(updatedBook);

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id as string);
    const existing = await db.select().from(books).where(eq(books.id, bookId));
    
    if (existing.length === 0 || existing[0].deletedAt !== null) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await db.update(books).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(books.id, bookId));

    await deleteBookFromTypesense(bookId);

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
import { runFullSync } from '../search/sync';

const router = Router();

// Perform search
router.get('/search', async (req: Request, res: Response) => {
  const { q, query_by, ...otherParams } = req.query;

  if (!q || !query_by) {
    return res.status(400).json({ error: 'Missing required query parameters: q and query_by' });
  }

  try {
    const searchResults = await typesenseClient
      .collections(BOOKS_COLLECTION_NAME)
      .documents()
      .search({
        q: q as string,
        query_by: query_by as string,
        ...otherParams,
      });

    res.json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Manual Sync endpoint
router.post('/sync', async (req: Request, res: Response) => {
  try {
    await runFullSync();
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default router;
```

## Step 12: Wire it all together in the Server

Assemble the dependencies in `src/server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
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
    console.log('PostgreSQL database config loaded via Drizzle.');

    console.log('Initializing Typesense...');
    await initializeTypesense();

    console.log('Running startup sync...');
    await determineAndRunStartupSync();

    startBackgroundSyncWorker();

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

Your API backend now acts as a high-performance bridge: PostgreSQL ensures data integrity via Drizzle ORM, while Typesense enables blazing fast search!

## Step 13: Run your server

Start your backend application:

```bash
npm run dev
```

Expected startup output:

```plaintext
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

[https://github.com/typesense/code-samples/tree/master/typesense-node-drizzle-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-node-drizzle-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
