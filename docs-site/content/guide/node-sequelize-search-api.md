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

## Step 5: Define the Book Model (Sequelize)

Add this to `src/models/Book.ts`:

```typescript
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Book extends Model {
  // Using 'declare' prevents TypeScript from emitting initialization code
  // that would overwrite Sequelize's custom getters/setters!
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    publication_year: {
      type: DataTypes.INTEGER,
    },
    average_rating: {
      type: DataTypes.FLOAT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    ratings_count: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true, // Automatically manages created_at and updated_at
    paranoid: true,   // Enables soft deletes (deleted_at)
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

export async function initializeCollections() {
  const collectionName = env.TYPESENSE_COLLECTION;

  const schema: CollectionCreateSchema = {
    name: collectionName,
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
    await typesenseClient.collections(collectionName).retrieve();
    console.log(`Collection '${collectionName}' already exists.`);
  } catch (error: any) {
    if (error.httpStatus === 404) {
      console.log(`Collection '${collectionName}' not found. Creating...`);
      await typesenseClient.collections().create(schema);
      console.log(`Collection '${collectionName}' created successfully.`);
    } else {
      throw error;
    }
  }
}
```

This ensures your Typesense collection and schema correctly align with your Sequelize model every time the application starts.

## Step 8: Paginated and Incremental Sync Logic

Add this to `src/search/sync.ts`.

Handling sync efficiently is critical when dealing with millions of rows. We tackle this by implementing **paginated syncs**: instead of dumping an entire table into memory, we query PostgreSQL and import to Typesense in batches. We also use **incremental sync** based on `updated_at` to avoid re-syncing rows that haven't changed.

```typescript
import { Op } from 'sequelize';
import { typesenseClient } from './client';
import { Book } from '../models/Book';
import { env } from '../config/env';

export interface SyncState {
  lastSyncTime: Date;
  isRunning: boolean;
}

export const syncState: SyncState = {
  lastSyncTime: new Date(0), // Epoch
  isRunning: false,
};

export async function syncBooksToTypesense(since: Date = new Date(0)): Promise<Date> {
  const pageSize = 1000;
  let page = 1;
  const newSyncTime = new Date();

  console.log(`Starting sync since ${since.toISOString()}`);

  while (true) {
    const books = await Book.findAll({
      where: {
        updated_at: { [Op.gt]: since },
      },
      order: [['id', 'ASC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    if (books.length === 0) break;

    const documents = books.map((book) => ({
      id: `book_${book.id}`,
      title: book.title,
      authors: book.authors,
      publication_year: book.publication_year,
      average_rating: book.average_rating,
      image_url: book.image_url,
      ratings_count: book.ratings_count,
    }));

    await typesenseClient
      .collections(env.TYPESENSE_COLLECTION)
      .documents()
      .import(documents, { action: 'upsert' });

    console.log(`Imported batch ${page} (${books.length} books)`);
    page++;
  }

  return newSyncTime;
}

// Ensure soft-deleted rows in PostgreSQL are purged from Typesense
export async function syncSoftDeletesToTypesense(since: Date = new Date(0)) {
  const pageSize = 1000;
  let page = 1;

  while (true) {
    const deletedBooks = await Book.findAll({
      where: {
        deleted_at: { [Op.not]: null },
        updated_at: { [Op.gt]: since },
      },
      paranoid: false, // Required in Sequelize to fetch soft-deleted rows!
      order: [['id', 'ASC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    if (deletedBooks.length === 0) break;

    const documentIds = deletedBooks.map((book) => `book_${book.id}`);
    const filterBy = `id:=[${documentIds.join(',')}]`;

    await typesenseClient
      .collections(env.TYPESENSE_COLLECTION)
      .documents()
      .delete({ filter_by: filterBy });

    console.log(`Deleted batch ${page} (${deletedBooks.length} books)`);
    page++;
  }
}
```

:::warning Sequelize Paranoid Tables
When searching for soft-deleted records to remove from Typesense, you MUST pass `{ paranoid: false }` into `Book.findAll(...)`. Otherwise, Sequelize's default behavior will automatically exclude rows where `deleted_at` is not null, and the records will forever linger in your Typesense index as ghosts.
:::

## Step 9: Add the Background Sync Worker

Add this to `src/search/worker.ts`. Using `node-cron`, we can trigger the incremental sync every 60 seconds automatically.

```typescript
import cron from 'node-cron';
import { syncBooksToTypesense, syncSoftDeletesToTypesense, syncState } from './sync';

export function startBackgroundSync() {
  console.log('Background sync worker scheduled (every 60 seconds)');

  cron.schedule('*/60 * * * * *', async () => {
    if (syncState.isRunning) {
      console.log('Sync is already running, skipping this interval.');
      return;
    }

    try {
      syncState.isRunning = true;
      console.log('Running periodic sync...');
      
      const newSyncTime = await syncBooksToTypesense(syncState.lastSyncTime);
      await syncSoftDeletesToTypesense(syncState.lastSyncTime);
      
      syncState.lastSyncTime = newSyncTime;
      console.log(`Periodic sync completed. Last sync time updated to ${syncState.lastSyncTime.toISOString()}`);
    } catch (error) {
      console.error('Periodic sync failed:', error);
    } finally {
      syncState.isRunning = false;
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
import sequelize from './config/database';
import { initializeCollections } from './search/collections';
import { startBackgroundSync } from './search/worker';
import { syncBooksToTypesense, syncState } from './search/sync';

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
    // 1. Connect to PostgreSQL
    await sequelize.authenticate();
    await sequelize.sync(); 
    console.log('PostgreSQL connected and synced.');

    // 2. Setup Typesense Schema
    await initializeCollections();

    // 3. Initial Catch-Up Sync
    console.log('Running initial full sync...');
    syncState.isRunning = true;
    syncState.lastSyncTime = await syncBooksToTypesense(new Date(0));
    syncState.isRunning = false;

    // 4. Start the Node-Cron Worker
    startBackgroundSync();

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

Your API backend acts as a smart bridge: PostgreSQL guarantees your data integrity, Typesense enables blazing fast search, and the `node-cron` background worker gracefully keeps everything perfectly synchronized!

## Step 11: Run your server

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
