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

## Step 5: Define the Book Model (Prisma)

Update your `prisma/schema.prisma` file with the `Book` model and PostgreSQL provider:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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
  deleted_at       DateTime? // For soft deletes

  @@map("books")
}
```

Run Prisma migrations to create the database table and generate the client:

```bash
npx prisma migrate dev --name init
```

Set up the Prisma Client instance in `src/config/database.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env';

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
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

Setting `numRetries` to 3 helps your application gracefully handle transient networking issues by automatically retrying failed requests.

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

This ensures your Typesense collection and schema correctly align with your Prisma model every time the application starts.

## Step 8: Paginated and Incremental Sync Logic

Add this to `src/search/sync.ts`.

Handling sync efficiently is critical when dealing with millions of rows. We tackle this by implementing **paginated syncs** using cursor-based pagination with `findMany` and `take`: instead of dumping an entire table into memory, we query PostgreSQL and import to Typesense in batches. We also use **incremental sync** based on `updated_at` to avoid re-syncing rows that haven't changed, and we execute bulk deletes for records that were soft-deleted.

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
    const books = await prisma.book.findMany({
      where: { 
        id: { gt: lastId },
        deleted_at: null // Do not sync deleted rows
      },
      take: BATCH_SIZE,
      orderBy: { id: 'asc' }
    });

    if (books.length === 0) {
      hasMore = false;
      break;
    }

    lastId = books[books.length - 1].id;
    const documents = books.map(mapBookToTypesense);

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
    const updatedBooks = await prisma.book.findMany({
      where: {
        updated_at: { gt: lastSyncTime },
        deleted_at: null,
        id: { gt: lastUpsertId }
      },
      take: BATCH_SIZE,
      orderBy: { id: 'asc' }
    });

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
    const deletedBooks = await prisma.book.findMany({
      where: {
        deleted_at: { gt: lastSyncTime },
        id: { gt: lastDeleteId }
      },
      take: BATCH_SIZE,
      orderBy: { id: 'asc' }
    });

    if (deletedBooks.length === 0) {
      hasMoreDeletes = false;
      break;
    }

    lastDeleteId = deletedBooks[deletedBooks.length - 1].id;
    const ids = deletedBooks.map(b => b.id.toString());

    // Bulk delete in Typesense using filter_by
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
}
```

:::warning Soft Deletes
When executing incremental synchronization, we check for rows where `deleted_at` is greater than the last sync time. In Prisma, we explicitly query for records with a `deleted_at` value to identify the subset to purge from Typesense using bulk deletion (`filter_by`).
:::

## Step 9: Add the Background Sync Worker

Add this to `src/search/worker.ts`. Using `node-cron`, we can trigger the incremental sync every 60 seconds automatically.

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

## Step 10: Wire it all together in the Server

Assemble the dependencies in `src/server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { prisma } from './config/database';
import { initializeTypesense } from './search/collections';
import { determineAndRunStartupSync } from './search/sync';
import { startBackgroundSyncWorker } from './search/worker';

// Import routers
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
    // 1. Connect to PostgreSQL via Prisma
    console.log('Connecting to PostgreSQL database...');
    await prisma.$connect();
    console.log('Database connected.');

    // 2. Setup Typesense Schema
    console.log('Initializing Typesense...');
    await initializeTypesense();

    // 3. Initial Catch-Up Sync
    console.log('Running startup sync...');
    await determineAndRunStartupSync();

    // 4. Start the Node-Cron Worker
    startBackgroundSyncWorker();

    // 5. Start Express API
    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

Your API backend acts as a smart bridge: PostgreSQL guarantees your data integrity via Prisma ORM, Typesense enables blazing fast search, and the `node-cron` background worker gracefully keeps everything perfectly synchronized batch by batch!
