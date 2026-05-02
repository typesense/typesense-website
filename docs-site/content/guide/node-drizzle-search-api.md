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
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
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
DATABASE_URL="postgresql://admin:admin123@localhost:5432/testdb?schema=public"

TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
TYPESENSE_COLLECTION=books
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

## Step 6: Initialize Database and Typesense Clients

Set up the database connection in `src/config/database.ts`:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';
import * as schema from '../db/schema';

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

Set up the Typesense client in `src/search/client.ts`:

```typescript
import { Client } from 'typesense';
import { env } from '../config/env';

export const typesenseClient = new Client({
  nodes: [{ host: env.TYPESENSE_HOST, port: env.TYPESENSE_PORT, protocol: env.TYPESENSE_PROTOCOL }],
  apiKey: env.TYPESENSE_API_KEY,
});
```

## Step 7: Paginated and Incremental Sync Logic

Add this to `src/search/sync.ts`. Handling sync efficiently is critical when dealing with millions of rows. We use **cursor-based pagination** with Drizzle's `gt` operator:

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
    const fetchedBooks = await db.select()
      .from(books)
      .where(and(gt(books.id, lastId), isNull(books.deletedAt)))
      .limit(BATCH_SIZE)
      .orderBy(books.id);

    if (fetchedBooks.length === 0) {
      hasMore = false;
      break;
    }

    lastId = fetchedBooks[fetchedBooks.length - 1].id;
    const documents = fetchedBooks.map(mapBookToTypesense);

    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
    totalProcessed += documents.length;
    console.log(`Full sync: Processed ${totalProcessed} books.`);
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
    const updatedBooks = await db.select()
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

    if (updatedBooks.length === 0) {
      hasMoreUpserts = false;
      break;
    }

    lastUpsertId = updatedBooks[updatedBooks.length - 1].id;
    const documents = updatedBooks.map(mapBookToTypesense);

    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().import(documents, { action: 'upsert' });
    totalUpserted += documents.length;
  }

  // 2. Process soft-deleted books in batches
  let lastDeleteId = 0;
  let hasMoreDeletes = true;
  let totalDeleted = 0;

  while (hasMoreDeletes) {
    const deletedBooks = await db.select()
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

    if (deletedBooks.length === 0) {
      hasMoreDeletes = false;
      break;
    }

    lastDeleteId = deletedBooks[deletedBooks.length - 1].id;
    const ids = deletedBooks.map(b => b.id.toString());

    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().delete({
      filter_by: `id:=[${ids.join(',')}]`
    });
    totalDeleted += deletedBooks.length;
  }

  lastSyncTime = new Date();
}

export async function determineAndRunStartupSync() {
  const searchStats = await typesenseClient.collections(BOOKS_COLLECTION_NAME).retrieve();
  const docCount = searchStats.num_documents;

  if (docCount === 0) {
    await runFullSync();
  } else {
    const latestBook = await db.select()
      .from(books)
      .orderBy(desc(books.updatedAt))
      .limit(1);

    if (latestBook[0]?.updatedAt) {
      lastSyncTime = latestBook[0].updatedAt;
    }
    
    await runIncrementalSync();
  }
}
```

## Step 8: Add the Background Sync Worker

Using `node-cron`, we trigger the incremental sync every 60 seconds automatically. Add this to `src/search/worker.ts`:

```typescript
import cron from 'node-cron';
import { runIncrementalSync } from './sync';

let isSyncRunning = false;

export function startBackgroundSyncWorker() {
  cron.schedule('*/60 * * * * *', async () => {
    if (isSyncRunning) return;
    isSyncRunning = true;
    try {
      await runIncrementalSync();
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      isSyncRunning = false;
    }
  });
}
```

## Step 9: Create Express Routes

### Book CRUD Routes (`src/routes/books.ts`)

```typescript
import { Router } from 'express';
import { db } from '../config/database';
import { books } from '../db/schema';
import { eq, isNull } from 'drizzle-orm';
import { typesenseClient } from '../search/client';
import { BOOKS_COLLECTION_NAME } from '../search/collections';

const router = Router();

router.post('/', async (req, res) => {
  const result = await db.insert(books).values(req.body).returning();
  const book = result[0];
  
  // Real-time sync to Typesense
  await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents().upsert({
    id: book.id.toString(),
    title: book.title,
    authors: book.authors as string[],
    // ... other fields
  });

  res.status(201).json(book);
});

// ... Implement GET, PUT, DELETE
export default router;
```

## Step 10: Wire it all together

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

app.use('/books', booksRouter);
app.use('/', searchRouter);

async function startServer() {
  await initializeTypesense();
  await determineAndRunStartupSync();
  startBackgroundSyncWorker();

  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
}

startServer();
```

Your API backend now acts as a high-performance bridge: PostgreSQL ensures data integrity via Drizzle ORM, while Typesense enables blazing fast search!
