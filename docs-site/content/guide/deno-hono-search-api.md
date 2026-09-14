---
description: "Build a Deno search API with Hono, PostgreSQL, and Typesense while keeping the search index synced with source data."
---

# Building a Search API with Deno, Hono, PostgreSQL, and Typesense

This guide walks you through building a RESTful search API using Deno, Hono, PostgreSQL (via postgres.js), and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

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
│   Frontend  │ ────────────▶ │  Hono API   │
│             │ ◀──────────── │   (Deno)    │
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

- [Deno](https://deno.com/) (v2+)
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

## Step 2: Initialize your Deno project

Create the project and add dependencies:

```bash
mkdir typesense-deno-hono-search-app
cd typesense-deno-hono-search-app

deno add jsr:@hono/hono npm:postgres npm:typesense
```

What each dependency does:

- **@hono/hono** - Small, fast web framework that runs on `Deno.serve`
- **postgres** - PostgreSQL client for JavaScript, used here with hand-written SQL
- **typesense** - Official Typesense client

Deno has no bundler or build step, so there is no `tsconfig.json` to generate. Instead, define the tasks you'll use in `deno.json`:

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-env --allow-read --allow-sys --env-file=.env --watch src/server.ts",
    "start": "deno run --allow-net --allow-env --allow-read --allow-sys --env-file=.env src/server.ts",
    "db:migrate": "deno run --allow-net --allow-env --allow-read --allow-sys --env-file=.env src/migrate.ts"
  },
  "imports": {
    "hono": "jsr:@hono/hono@^4.13.4",
    "hono/cors": "jsr:@hono/hono@^4.13.4/cors",
    "postgres": "npm:postgres@^3.4.9",
    "typesense": "npm:typesense@^3.0.6"
  },
  "compilerOptions": {
    "strict": true
  },
  "nodeModulesDir": "auto"
}
```

The `--env-file` flag is built into Deno, so no dotenv package is needed.

## Step 3: Create the project structure

```plaintext
typesense-deno-hono-search-app/
├── db/
│   └── schema.sql           # Table, indexes, and updated_at trigger
├── src/
│   ├── config/
│   │   ├── database.ts      # postgres.js connection pool
│   │   └── env.ts           # Environment variable validation
│   ├── db/
│   │   └── books.ts         # SQL queries for the books table
│   ├── routes/
│   │   ├── books.ts         # CRUD API handlers
│   │   └── search.ts        # Search API handlers
│   ├── search/
│   │   ├── client.ts        # Typesense client initialization
│   │   ├── collections.ts   # Typesense collection schema
│   │   ├── sync.ts          # DB → Typesense sync logic
│   │   └── worker.ts        # Background sync interval
│   ├── migrate.ts           # Applies db/schema.sql
│   └── server.ts            # Application entry point
├── deno.json
└── .env
```

## Step 4: Set up environment configuration

Create your `.env` file:

```bash
PORT=3000
DATABASE_URL=postgres://postgres:password@localhost:5432/testdb

TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
TYPESENSE_COLLECTION=books

SYNC_INTERVAL_SECONDS=60
SYNC_BATCH_SIZE=1000
```

Create `src/config/env.ts` to safely parse and export these environment variables:

```typescript
const REQUIRED = [
  'DATABASE_URL',
  'TYPESENSE_HOST',
  'TYPESENSE_PORT',
  'TYPESENSE_PROTOCOL',
  'TYPESENSE_API_KEY',
  'TYPESENSE_COLLECTION',
] as const;

for (const key of REQUIRED) {
  if (!Deno.env.get(key)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const number = (key: string, fallback: number): number => {
  const raw = Deno.env.get(key);
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) throw new Error(`Environment variable ${key} must be a number`);
  return parsed;
};

export const env = {
  PORT: number('PORT', 3000),
  DATABASE_URL: Deno.env.get('DATABASE_URL')!,
  TYPESENSE_HOST: Deno.env.get('TYPESENSE_HOST')!,
  TYPESENSE_PORT: number('TYPESENSE_PORT', 8108),
  TYPESENSE_PROTOCOL: Deno.env.get('TYPESENSE_PROTOCOL')!,
  TYPESENSE_API_KEY: Deno.env.get('TYPESENSE_API_KEY')!,
  TYPESENSE_COLLECTION: Deno.env.get('TYPESENSE_COLLECTION')!,
  SYNC_INTERVAL_SECONDS: number('SYNC_INTERVAL_SECONDS', 60),
  SYNC_BATCH_SIZE: number('SYNC_BATCH_SIZE', 1000),
};
```

Create `src/config/database.ts` to initialize the connection pool:

```typescript
import postgres from 'postgres';
import { env } from './env.ts';

export const sql = postgres(env.DATABASE_URL, {
  max: 10,
  onnotice: (notice) => console.log(`postgres notice: ${notice.message}`),
});
```

## Step 5: Define the Database Schema and Queries

Define your `books` table in `db/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS books (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  authors          TEXT[]       NOT NULL DEFAULT '{}',
  publication_year INTEGER,
  average_rating   NUMERIC(3, 2),
  image_url        VARCHAR(512),
  ratings_count    INTEGER      NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS books_updated_at_idx ON books (updated_at);
CREATE INDEX IF NOT EXISTS books_deleted_at_idx ON books (deleted_at);
CREATE INDEX IF NOT EXISTS books_active_id_idx  ON books (id) WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION books_touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS books_touch_updated_at ON books;
CREATE TRIGGER books_touch_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION books_touch_updated_at();
```

The trigger maintains `updated_at` in the database rather than in application code, so rows changed outside this API are still picked up by the incremental sync in Step 8.

Create `src/migrate.ts` to apply the schema:

```typescript
import { sql } from './config/database.ts';

const schemaPath = new URL('../db/schema.sql', import.meta.url);
const ddl = await Deno.readTextFile(schemaPath);

console.log('Applying db/schema.sql...');

try {
  await sql.unsafe(ddl).simple();
  console.log('Schema applied successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  Deno.exit(1);
} finally {
  await sql.end();
}
```

`.simple()` selects the simple query protocol, which allows several statements in one round trip, including the `$$ ... $$` function body.

Push the schema to the database:

```bash
deno task db:migrate
```

Now add the queries in `src/db/books.ts`. The last three are used by the sync, and all paginate by `id` rather than `OFFSET`:

```typescript
import { sql } from '../config/database.ts';

export interface Book {
  id: number;
  title: string;
  authors: string[];
  publication_year: number | null;
  average_rating: string | null;
  image_url: string | null;
  ratings_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface BookInput {
  title?: string;
  authors?: string[];
  publication_year?: number | null;
  average_rating?: number | null;
  image_url?: string | null;
  ratings_count?: number;
}

export async function dbNow(): Promise<Date> {
  const [row] = await sql<{ now: Date }[]>`SELECT now() AS now`;
  return row.now;
}

export async function countActiveBooks(): Promise<number> {
  const [row] = await sql<{ total: string }[]>`
    SELECT count(*)::text AS total FROM books WHERE deleted_at IS NULL`;
  return Number(row.total);
}

export async function listActiveBooks(limit: number, offset: number): Promise<Book[]> {
  return await sql<Book[]>`
    SELECT * FROM books
    WHERE deleted_at IS NULL
    ORDER BY id
    LIMIT ${limit} OFFSET ${offset}`;
}

export async function findActiveBookById(id: number): Promise<Book | undefined> {
  const [row] = await sql<Book[]>`
    SELECT * FROM books WHERE id = ${id} AND deleted_at IS NULL`;
  return row;
}

export async function insertBook(input: BookInput): Promise<Book> {
  const [row] = await sql<Book[]>`
    INSERT INTO books (title, authors, publication_year, average_rating, image_url, ratings_count)
    VALUES (
      ${input.title ?? ''},
      ${input.authors ?? []},
      ${input.publication_year ?? null},
      ${input.average_rating ?? null},
      ${input.image_url ?? null},
      ${input.ratings_count ?? 0}
    )
    RETURNING *`;
  return row;
}

export async function updateBook(id: number, input: BookInput): Promise<Book | undefined> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.authors !== undefined) patch.authors = input.authors;
  if (input.publication_year !== undefined) patch.publication_year = input.publication_year;
  if (input.average_rating !== undefined) patch.average_rating = input.average_rating;
  if (input.image_url !== undefined) patch.image_url = input.image_url;
  if (input.ratings_count !== undefined) patch.ratings_count = input.ratings_count;

  if (Object.keys(patch).length === 0) return await findActiveBookById(id);

  const [row] = await sql<Book[]>`
    UPDATE books SET ${sql(patch)}
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING *`;
  return row;
}

export async function softDeleteBook(id: number): Promise<Book | undefined> {
  const [row] = await sql<Book[]>`
    UPDATE books SET deleted_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING *`;
  return row;
}

export async function fetchActiveBooksAfterId(lastId: number, limit: number): Promise<Book[]> {
  return await sql<Book[]>`
    SELECT * FROM books
    WHERE id > ${lastId} AND deleted_at IS NULL
    ORDER BY id
    LIMIT ${limit}`;
}

export async function fetchBooksUpdatedSince(
  since: Date,
  lastId: number,
  limit: number,
): Promise<Book[]> {
  return await sql<Book[]>`
    SELECT * FROM books
    WHERE updated_at > ${since} AND deleted_at IS NULL AND id > ${lastId}
    ORDER BY id
    LIMIT ${limit}`;
}

export async function fetchBooksDeletedSince(
  since: Date,
  lastId: number,
  limit: number,
): Promise<{ id: number }[]> {
  return await sql<{ id: number }[]>`
    SELECT id FROM books
    WHERE deleted_at > ${since} AND id > ${lastId}
    ORDER BY id
    LIMIT ${limit}`;
}
```

## Step 6: Initialize the Typesense Client

Add this to `src/search/client.ts`:

```typescript
import { Client } from 'typesense';
import { env } from '../config/env.ts';

export const typesenseClient = new Client({
  nodes: [{
    host: env.TYPESENSE_HOST,
    port: env.TYPESENSE_PORT,
    protocol: env.TYPESENSE_PROTOCOL,
  }],
  apiKey: env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 5,
  retryIntervalSeconds: 1,
  numRetries: 3,
});
```

## Step 7: Set up Automatic Collection Creation

Add this to `src/search/collections.ts`:

```typescript
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { typesenseClient } from './client.ts';
import { env } from '../config/env.ts';

export const BOOKS_COLLECTION_NAME = env.TYPESENSE_COLLECTION;

const booksSchema: CollectionCreateSchema = {
  name: BOOKS_COLLECTION_NAME,
  fields: [
    { name: 'title', type: 'string', facet: false },
    { name: 'authors', type: 'string[]', facet: true },
    { name: 'publication_year', type: 'int32', facet: true },
    { name: 'average_rating', type: 'float', facet: true },
    { name: 'image_url', type: 'string', facet: false, index: false, optional: true },
    { name: 'ratings_count', type: 'int32', facet: true },
  ],
  default_sorting_field: 'ratings_count',
};

export async function initializeTypesense(): Promise<void> {
  try {
    await typesenseClient.collections(BOOKS_COLLECTION_NAME).retrieve();
    console.log(`Collection '${BOOKS_COLLECTION_NAME}' already exists.`);
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus !== 404) throw error;
    console.log(`Collection '${BOOKS_COLLECTION_NAME}' not found. Creating...`);
    await typesenseClient.collections().create(booksSchema);
    console.log(`Collection '${BOOKS_COLLECTION_NAME}' created.`);
  }
}

export async function getCollectionDocumentCount(): Promise<number> {
  const collection = await typesenseClient.collections(BOOKS_COLLECTION_NAME).retrieve();
  return collection.num_documents ?? 0;
}
```

## Step 8: Paginated and Incremental Sync Logic

Handling sync efficiently is critical when dealing with millions of rows. We tackle this by implementing **paginated syncs**: instead of dumping an entire table into memory, we query PostgreSQL and import to Typesense in batches. We also use **incremental sync** based on `updated_at` to avoid re-syncing rows that haven't changed.

Three details matter for `lastSyncTime`. Each run reads the time **before** it fetches anything, so a row edited while the run is in progress is not skipped by the next run. The new time is only saved if the whole run succeeded, so a partial failure is retried instead of dropped. And the time comes from `SELECT now()` in PostgreSQL, so a clock difference between your app host and the database cannot skip rows.

Add this to `src/search/sync.ts`:

```typescript
import { env } from '../config/env.ts';
import {
  type Book,
  dbNow,
  fetchActiveBooksAfterId,
  fetchBooksDeletedSince,
  fetchBooksUpdatedSince,
} from '../db/books.ts';
import { typesenseClient } from './client.ts';
import { BOOKS_COLLECTION_NAME, getCollectionDocumentCount } from './collections.ts';

export interface BookDocument {
  id: string;
  title: string;
  authors: string[];
  publication_year: number;
  average_rating: number;
  image_url: string;
  ratings_count: number;
}

export interface SyncResult {
  startedAt: Date;
  upserted: number;
  deleted: number;
  failed: boolean;
}

const BATCH_SIZE = env.SYNC_BATCH_SIZE;
const EPOCH = new Date(0);

let lastSyncTime: Date = EPOCH;

export function getLastSyncTime(): Date {
  return lastSyncTime;
}

export function mapBookToDocument(book: Book): BookDocument {
  return {
    id: String(book.id),
    title: book.title,
    authors: book.authors ?? [],
    publication_year: book.publication_year ?? 0,
    average_rating: book.average_rating === null ? 0 : Number(book.average_rating),
    image_url: book.image_url ?? '',
    ratings_count: book.ratings_count ?? 0,
  };
}

export async function upsertBookDocument(book: Book): Promise<void> {
  await typesenseClient
    .collections<BookDocument>(BOOKS_COLLECTION_NAME)
    .documents()
    .upsert(mapBookToDocument(book));
}

export async function deleteBookDocument(id: number): Promise<void> {
  try {
    await typesenseClient.collections(BOOKS_COLLECTION_NAME).documents(String(id)).delete();
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus === 404) return;
    throw error;
  }
}

async function importBatch(documents: BookDocument[]): Promise<number> {
  const results = await typesenseClient
    .collections<BookDocument>(BOOKS_COLLECTION_NAME)
    .documents()
    .import(documents, { action: 'upsert' });

  const failures = (Array.isArray(results) ? results : []).filter((result) => !result.success);
  if (failures.length > 0) {
    for (const failure of failures.slice(0, 5)) {
      console.error(`Import rejected a document: ${failure.error}`);
    }
    throw new Error(`${failures.length} of ${documents.length} documents failed to import`);
  }
  return documents.length;
}

export async function runFullSync(): Promise<SyncResult> {
  const startedAt = await dbNow();
  console.log(`Full sync started, stamped ${startedAt.toISOString()}`);

  let lastId = 0;
  let upserted = 0;
  let failed = false;

  while (true) {
    let batch: Book[];
    try {
      batch = await fetchActiveBooksAfterId(lastId, BATCH_SIZE);
    } catch (error) {
      console.error('Full sync: database read failed:', error);
      failed = true;
      break;
    }

    if (batch.length === 0) break;
    lastId = batch[batch.length - 1].id;

    try {
      upserted += await importBatch(batch.map(mapBookToDocument));
      console.log(`Full sync: ${upserted} books indexed so far.`);
    } catch (error) {
      console.error('Full sync: Typesense import failed:', error);
      failed = true;
      break;
    }
  }

  if (failed) {
    console.warn(
      `Full sync incomplete after ${upserted} books; last sync time stays at ${lastSyncTime.toISOString()}`,
    );
  } else {
    lastSyncTime = startedAt;
    console.log(`Full sync completed: ${upserted} books indexed.`);
  }

  return { startedAt, upserted, deleted: 0, failed };
}

export async function runIncrementalSync(): Promise<SyncResult> {
  const startedAt = await dbNow();
  const since = lastSyncTime;
  console.log(`Incremental sync started for changes after ${since.toISOString()}`);

  let upserted = 0;
  let deleted = 0;
  let failed = false;

  let lastUpsertId = 0;
  while (!failed) {
    let batch: Book[];
    try {
      batch = await fetchBooksUpdatedSince(since, lastUpsertId, BATCH_SIZE);
    } catch (error) {
      console.error('Incremental sync: database read failed during upsert phase:', error);
      failed = true;
      break;
    }

    if (batch.length === 0) break;
    lastUpsertId = batch[batch.length - 1].id;

    try {
      upserted += await importBatch(batch.map(mapBookToDocument));
    } catch (error) {
      console.error('Incremental sync: Typesense import failed:', error);
      failed = true;
      break;
    }
  }

  let lastDeleteId = 0;
  while (!failed) {
    let batch: { id: number }[];
    try {
      batch = await fetchBooksDeletedSince(since, lastDeleteId, BATCH_SIZE);
    } catch (error) {
      console.error('Incremental sync: database read failed during delete phase:', error);
      failed = true;
      break;
    }

    if (batch.length === 0) break;
    lastDeleteId = batch[batch.length - 1].id;

    for (const row of batch) {
      try {
        await deleteBookDocument(row.id);
        deleted++;
      } catch (error) {
        console.error(`Incremental sync: failed to delete document ${row.id}:`, error);
        failed = true;
        break;
      }
    }
  }

  if (failed) {
    console.warn(
      `Incremental sync incomplete; last sync time stays at ${lastSyncTime.toISOString()} so the next run retries it`,
    );
  } else {
    lastSyncTime = startedAt;
    if (upserted || deleted) {
      console.log(`Incremental sync completed: ${upserted} upserted, ${deleted} deleted.`);
    } else {
      console.log('Incremental sync completed: no changes.');
    }
  }

  return { startedAt, upserted, deleted, failed };
}

export async function determineAndRunStartupSync(): Promise<void> {
  const documentCount = await getCollectionDocumentCount();

  if (documentCount === 0) {
    console.log('Typesense collection is empty — running a full sync.');
    await runFullSync();
    return;
  }

  console.log(`Typesense collection holds ${documentCount} documents — catching up from epoch.`);
  lastSyncTime = EPOCH;
  await runIncrementalSync();
}
```

On startup, an empty collection triggers a full sync. A collection that already holds documents triggers an incremental sync from epoch, which backfills anything that changed while the process was down.

## Step 9: Add the Background Sync Worker

Deno ships `setInterval`, so the incremental sync can run every 60 seconds without a scheduler package. Add this to `src/search/worker.ts`:

```typescript
import { env } from '../config/env.ts';
import { runIncrementalSync } from './sync.ts';

let timer: ReturnType<typeof setInterval> | undefined;
let workerRunning = false;
let syncInProgress = false;

export function isWorkerRunning(): boolean {
  return workerRunning;
}

export function startBackgroundSyncWorker(): void {
  if (workerRunning) return;

  const intervalMs = env.SYNC_INTERVAL_SECONDS * 1000;
  console.log(`Starting background sync worker (every ${env.SYNC_INTERVAL_SECONDS}s)...`);

  timer = setInterval(async () => {
    if (syncInProgress) {
      console.log('Sync already in progress — skipping this tick.');
      return;
    }

    syncInProgress = true;
    try {
      await runIncrementalSync();
    } catch (error) {
      console.error('Background sync threw:', error);
    } finally {
      syncInProgress = false;
    }
  }, intervalMs);

  workerRunning = true;
}

export function stopBackgroundSyncWorker(): void {
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
  workerRunning = false;
}
```

The `syncInProgress` guard stops a slow run from overlapping the next tick.

## Step 10: Build the CRUD API with real-time sync

Add this to `src/routes/books.ts`. Each write syncs to Typesense **asynchronously** so the HTTP response returns immediately:

```typescript
import { Hono } from 'hono';
import {
  type BookInput,
  countActiveBooks,
  findActiveBookById,
  insertBook,
  listActiveBooks,
  softDeleteBook,
  updateBook,
} from '../db/books.ts';
import { deleteBookDocument, upsertBookDocument } from '../search/sync.ts';

const router = new Hono();

const BOOK_FIELDS = [
  'title',
  'authors',
  'publication_year',
  'average_rating',
  'image_url',
  'ratings_count',
] as const;

function pickBookInput(body: Record<string, unknown>): BookInput {
  const input: Record<string, unknown> = {};
  for (const field of BOOK_FIELDS) {
    if (body[field] !== undefined) input[field] = body[field];
  }
  return input as BookInput;
}

router.get('/', async (c) => {
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const limit = parseInt(c.req.query('limit') ?? '10', 10);
  const offset = (page - 1) * limit;

  try {
    const [total, data] = await Promise.all([
      countActiveBooks(),
      listActiveBooks(limit, offset),
    ]);

    return c.json({ total, page, limit, data });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch books' }, 500);
  }
});

router.get('/:id', async (c) => {
  try {
    const book = await findActiveBookById(Number(c.req.param('id')));
    if (!book) return c.json({ error: 'Book not found' }, 404);
    return c.json(book);
  } catch (_error) {
    return c.json({ error: 'Failed to fetch book' }, 500);
  }
});

router.post('/', async (c) => {
  try {
    const book = await insertBook(pickBookInput(await c.req.json()));
    await upsertBookDocument(book).catch((error) =>
      console.error(`Failed to sync book ${book.id} to Typesense:`, error)
    );

    return c.json(book, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

router.put('/:id', async (c) => {
  try {
    const book = await updateBook(Number(c.req.param('id')), pickBookInput(await c.req.json()));
    if (!book) return c.json({ error: 'Book not found' }, 404);

    await upsertBookDocument(book).catch((error) =>
      console.error(`Failed to sync book ${book.id} to Typesense:`, error)
    );

    return c.json(book);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

router.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  try {
    const book = await softDeleteBook(id);
    if (!book) return c.json({ error: 'Book not found' }, 404);

    await deleteBookDocument(id).catch((error) =>
      console.error(`Failed to delete book ${id} from Typesense:`, error)
    );

    return c.body(null, 204);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default router;
```

`BOOK_FIELDS` limits a request to the columns it is allowed to write. With hand-written SQL there is no ORM to do that for you.

## Step 11: Build the search and sync routes

Add this to `src/routes/search.ts`:

```typescript
import { Hono } from 'hono';
import { typesenseClient } from '../search/client.ts';
import { BOOKS_COLLECTION_NAME } from '../search/collections.ts';
import { getLastSyncTime, runFullSync } from '../search/sync.ts';
import { isWorkerRunning } from '../search/worker.ts';

const router = new Hono();

router.get('/search', async (c) => {
  const query = c.req.query('q') ?? '';

  try {
    const searchResults = await typesenseClient
      .collections(BOOKS_COLLECTION_NAME)
      .documents()
      .search({ q: query, query_by: 'title,authors' });

    return c.json({
      query,
      found: searchResults.found,
      results: searchResults.hits,
      facet_counts: searchResults.facet_counts ?? [],
    });
  } catch (error) {
    console.error('Search failed:', error);
    return c.json({ error: 'Failed to fetch books' }, 500);
  }
});

router.post('/sync', async (c) => {
  try {
    const result = await runFullSync();
    if (result.failed) return c.json({ error: 'Failed to sync books' }, 500);

    return c.json({
      message: 'Sync completed',
      syncedAt: getLastSyncTime().toISOString(),
    });
  } catch (error) {
    console.error('Manual sync failed:', error);
    return c.json({ error: 'Failed to sync books' }, 500);
  }
});

router.get('/sync/status', (c) =>
  c.json({
    lastSyncTime: getLastSyncTime().toISOString(),
    syncWorkerRunning: isWorkerRunning(),
  }));

export default router;
```

## Step 12: Wire it all together in the Server

Assemble the dependencies in `src/server.ts`:

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from './config/env.ts';
import { initializeTypesense } from './search/collections.ts';
import { determineAndRunStartupSync } from './search/sync.ts';
import { startBackgroundSyncWorker } from './search/worker.ts';
import booksRouter from './routes/books.ts';
import searchRouter from './routes/search.ts';

const app = new Hono();

app.use('*', cors());
app.route('/books', booksRouter);
app.route('/', searchRouter);

console.log('Initializing Typesense collection...');
await initializeTypesense();

console.log('Running startup sync...');
try {
  await determineAndRunStartupSync();
} catch (error) {
  console.error('Startup sync failed, continuing anyway:', error);
}

startBackgroundSyncWorker();

Deno.serve({ port: env.PORT }, app.fetch);
console.log(`Server is running on http://localhost:${env.PORT}`);
```

Deno supports top-level `await`, so the collection setup and startup sync run before the server binds without wrapping them in a function.

Your API backend now acts as a high-performance bridge: PostgreSQL ensures data integrity, while Typesense enables blazing fast search!

## Step 13: Run your server

Start your backend application:

```bash
deno task dev
```

Expected startup output:

```plaintext
Initializing Typesense collection...
Collection 'books' not found. Creating...
Collection 'books' created.
Running startup sync...
Typesense collection is empty — running a full sync.
Full sync completed: 0 books indexed.
Starting background sync worker (every 60s)...
Server is running on http://localhost:3000
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

Response:

```json
{
  "query": "typescript",
  "found": 1,
  "results": [...],
  "facet_counts": []
}
```

**Trigger a manual sync** (useful after bulk database changes):

```bash
curl -X POST http://localhost:3000/sync
```

Response:

```json
{
  "message": "Sync completed",
  "syncedAt": "2026-02-25T11:30:39.000Z"
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
Full sync started, stamped 2026-02-25T11:30:39.000Z
Full sync: 1000 books indexed so far.
Full sync: 2000 books indexed so far.
...
Full sync: 10000 books indexed so far.
Full sync completed: 10000 books indexed.
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
app.use('*', cors({ origin: 'https://yourdomain.com' }));
```

### Add an authentication middleware

```typescript
app.use('*', authMiddleware());
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

[https://github.com/typesense/code-samples/tree/master/typesense-deno-hono-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-deno-hono-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
