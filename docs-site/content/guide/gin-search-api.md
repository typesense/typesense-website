# Building a Search API with Go Gin and Typesense

This guide walks you through building a RESTful search API using Go's Gin framework, PostgreSQL, and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

By the end of this guide, you'll have:

- A full CRUD API for books backed by PostgreSQL
- Automatic database-to-Typesense sync (both real-time and periodic)
- Paginated sync that safely handles millions of records without memory issues
- Resilient Typesense client with automatic retries
- A search endpoint that proxies queries through your backend

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

While Typesense can be accessed directly from frontend applications, some teams might prefer to proxy requests to Typesense through their backend APIs for a couple of reasons:

- Full control over the exact API response structure
- Add additional business logic on top of search results
- Pre-process search queries before sending them to Typesense
- Add custom conditional authentication logic that gets evaluated on every request, in addition to what <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">scoped search API keys</RouterLink> provide
- Add custom rate limiting

The tradeoff is that this introduces an additional network hop through the backend, compared to sending the requests going from users' devices directly to Typesense which adds more network latency.
Also, features like the [Search Delivery Network](/guide/typesense-cloud/search-delivery-network.md) in Typesense Cloud work based on the geo origin of search request, which if you intend to use, will see all requests as originating from your backend instead of end users' actual location.

## Architecture Overview

Before writing code, let's understand how the pieces fit together:

```text
┌─────────────┐     CRUD      ┌─────────────┐
│   Frontend  │ ────────────▶ │  Gin API    │
│             │ ◀──────────── │  (Go)       │
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

**PostgreSQL** is the source of truth. All writes go there first. **Typesense** is the search index, kept in sync automatically via a background goroutine that runs every 60 seconds. This pattern gives you durable relational storage alongside sub-millisecond full-text search.

## Prerequisites

Please ensure you have the following installed:

- [Go 1.21+](https://go.dev/doc/install)
- [Docker](https://docs.docker.com/get-docker/) (for running Typesense and PostgreSQL)
- Basic knowledge of Go and REST APIs

## Step 1: Start Typesense and PostgreSQL

Run both services with Docker:

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

## Step 2: Initialize your Go project

Create the project and install dependencies:

```bash
mkdir typesense-gin-full-text-search
cd typesense-gin-full-text-search
go mod init github.com/<yourusername>/typesense-gin-full-text-search

go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
go get github.com/typesense/typesense-go/v4
go get github.com/joho/godotenv
go get gorm.io/gorm
go get gorm.io/driver/postgres
```

What each dependency does:

- [**gin-gonic/gin**](https://github.com/gin-gonic/gin) - Fast HTTP web framework for building APIs
- [**gin-contrib/cors**](https://github.com/gin-contrib/cors) - CORS middleware to allow requests from your frontend
- [**typesense-go/v4**](https://github.com/typesense/typesense-go) - Official Go client for Typesense
- [**godotenv**](https://github.com/joho/godotenv) - Loads environment variables from a `.env` file
- [**gorm**](https://gorm.io/) - ORM for Go with automatic migrations and soft deletes
- [**gorm postgres driver**](https://github.com/go-gorm/postgres) - PostgreSQL driver for GORM

## Step 3: Create the project structure

```bash
mkdir -p config search store routes models
touch config/config.go
touch search/client.go search/collections.go search/sync.go search/worker.go
touch store/store.go
touch models/book.go
touch routes/search.go routes/books.go
touch server.go .env
```

Your project should look like this:

```plaintext
typesense-gin-full-text-search/
├── config/
│   └── config.go         # Environment variable helpers (GetEnv, GetServerURL, BookCollection)
├── models/
│   └── book.go           # GORM model with soft delete support
├── routes/
│   ├── books.go          # CRUD API handlers
│   └── search.go         # Search + sync API handlers
├── search/
│   ├── client.go         # Typesense client initialization
│   ├── collections.go    # Typesense collection management
│   ├── sync.go           # DB → Typesense sync logic and sync state
│   └── worker.go         # Background sync goroutine and real-time sync helpers
├── store/
│   └── store.go          # PostgreSQL queries via GORM (paginated)
├── .env
├── go.mod
├── go.sum
└── server.go
```

## Step 4: Set up environment configuration

Add this to `.env`:

```env
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

This keeps sensitive credentials out of your code.

## Step 5: Build the environment utilities

Add this to `config/config.go`:

```go
package config

import (
    "log"
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

var envLoaded = false

// InitializeEnv loads the .env file and initializes package-level variables.
// Must be called from main() before any environment variables are accessed.
func InitializeEnv() {
    if envLoaded {
        return
    }
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }
    envLoaded = true
    BookCollection = GetEnv("TYPESENSE_COLLECTION", "books")
}

func GetEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}

func GetEnvAsInt(key string, defaultValue int) int {
    if value := os.Getenv(key); value != "" {
        if intValue, err := strconv.Atoi(value); err == nil {
            return intValue
        }
    }
    return defaultValue
}

func GetServerURL() string {
    protocol := GetEnv("TYPESENSE_PROTOCOL", "http")
    host := GetEnv("TYPESENSE_HOST", "localhost")
    port := GetEnvAsInt("TYPESENSE_PORT", 8108)
    return protocol + "://" + host + ":" + strconv.Itoa(port)
}

// BookCollection is set by InitializeEnv() after the .env file is loaded.
var BookCollection string
```

Unlike `init()`, `InitializeEnv()` is an explicit call — this gives you full control over the initialization order. Calling it first in `main()` guarantees env vars are loaded before the Typesense client or database connection is initialized.

## Step 6: Initialize the Typesense client with retry support

Add this to `search/client.go`:

```go
package search

import (
    "log"
    "time"

    "github.com/<yourusername>/typesense-gin-full-text-search/config"
    "github.com/typesense/typesense-go/v4/typesense"
)

var Client *typesense.Client

// InitializeClient creates the Typesense client.
// Must be called after config.InitializeEnv() to ensure environment variables are loaded.
func InitializeClient() {
    apiKey := config.GetEnv("TYPESENSE_API_KEY", "xyz")
    serverURL := config.GetServerURL()

    Client = typesense.NewClient(
        typesense.WithServer(serverURL),
        typesense.WithAPIKey(apiKey),
        typesense.WithNumRetries(3),
        typesense.WithRetryInterval(1*time.Second),
    )

    log.Printf("Typesense Client created successfully")
}
```

`WithNumRetries(3)` automatically retries failed requests up to 3 times, handling transient network issues transparently. `WithRetryInterval(1*time.Second)` waits 1 second between attempts so a briefly overloaded server has time to recover.

## Step 7: Define the Book model

Add this to `models/book.go`:

```go
package models

import (
    "fmt"
    "time"

    "gorm.io/gorm"
)

type Book struct {
    ID              uint           `gorm:"primaryKey" json:"id"`
    Title           string         `json:"title"`
    Authors         []string       `gorm:"serializer:json" json:"authors"`
    PublicationYear int            `json:"publication_year"`
    AverageRating   float64        `json:"average_rating"`
    ImageUrl        string         `json:"image_url"`
    RatingsCount    int            `json:"ratings_count"`
    CreatedAt       time.Time      `json:"created_at"`
    UpdatedAt       time.Time      `json:"updated_at"`
    DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (b *Book) GetTypesenseID() string {
    return fmt.Sprintf("book_%d", b.ID)
}

func (b *Book) BeforeUpdate(tx *gorm.DB) error {
    b.UpdatedAt = time.Now()
    return nil
}

func (b *Book) BeforeDelete(tx *gorm.DB) error {
    b.UpdatedAt = time.Now()
    return nil
}
```

Key design choices:

- **`Authors []string`** with `gorm:"serializer:json"` stores the slice as a JSON array in PostgreSQL and maps cleanly to Typesense's `string[]` field type.
- **`DeletedAt gorm.DeletedAt`** enables GORM's soft delete. Calling `db.Delete(&book)` sets this timestamp instead of removing the row, so we can detect deletions and propagate them to Typesense.
- **`GetTypesenseID()`** prefixes the database integer ID with `book_` since Typesense requires string document IDs.
- **`BeforeUpdate` / `BeforeDelete`** hooks ensure `updated_at` is always stamped on writes. The incremental sync relies on this field to detect what changed since the last run.

## Step 8: Set up the database layer with pagination

Add this to `store/store.go`. The critical design here is **paginated queries** — we never load the entire table into memory:

```go
package store

import (
    "context"
    "fmt"
    "os"
    "time"

    "github.com/<yourusername>/typesense-gin-full-text-search/models"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB(ctx context.Context) *gorm.DB {
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
        os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"), os.Getenv("DB_PORT"),
    )
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic(fmt.Sprintf("Failed to connect to database: %v", err))
    }
    // AutoMigrate creates or updates the table schema automatically on startup
    if err := db.AutoMigrate(&models.Book{}); err != nil {
        panic(fmt.Sprintf("Failed to auto-migrate: %v", err))
    }
    DB = db
    return db
}

// GetAllBooksPaginated fetches books in pages for memory-efficient full sync.
// page is 1-indexed. Order("id ASC") is required for consistent pagination.
func GetAllBooksPaginated(ctx context.Context, page int, pageSize int) ([]models.Book, error) {
    var books []models.Book
    offset := (page - 1) * pageSize
    err := DB.WithContext(ctx).
        Offset(offset).Limit(pageSize).
        Order("id ASC").
        Find(&books).Error
    return books, err
}

func GetTotalBooksCount(ctx context.Context) (int64, error) {
    var count int64
    err := DB.WithContext(ctx).Model(&models.Book{}).Count(&count).Error
    return count, err
}

// GetBooksByUpdatedAtPaginated fetches only books modified since `since`.
// Used by incremental sync to find what changed since the last run.
func GetBooksByUpdatedAtPaginated(ctx context.Context, since time.Time, page int, pageSize int) ([]models.Book, error) {
    var books []models.Book
    offset := (page - 1) * pageSize
    err := DB.WithContext(ctx).
        Where("updated_at > ?", since).
        Offset(offset).Limit(pageSize).
        Order("updated_at ASC").
        Find(&books).Error
    return books, err
}

func GetUpdatedBooksCount(ctx context.Context, since time.Time) (int64, error) {
    var count int64
    err := DB.WithContext(ctx).Model(&models.Book{}).
        Where("updated_at > ?", since).Count(&count).Error
    return count, err
}

// GetDeletedBooks fetches soft-deleted rows using Unscoped() to bypass
// GORM's automatic WHERE deleted_at IS NULL filter.
func GetDeletedBooks(ctx context.Context, since time.Time) ([]models.Book, error) {
    var books []models.Book
    err := DB.WithContext(ctx).Unscoped().
        Where("deleted_at IS NOT NULL").
        Where("updated_at > ?", since).
        Find(&books).Error
    return books, err
}

func GetBookByID(ctx context.Context, id uint) (*models.Book, error) {
    var book models.Book
    if err := DB.WithContext(ctx).First(&book, id).Error; err != nil {
        return nil, err
    }
    return &book, nil
}

func GetAllBooks(ctx context.Context) ([]models.Book, error) {
    var books []models.Book
    err := DB.WithContext(ctx).Find(&books).Error
    return books, err
}

func SaveBook(ctx context.Context, book *models.Book) error {
    return DB.WithContext(ctx).Save(book).Error
}

func DeleteBook(ctx context.Context, id uint) error {
    return DB.WithContext(ctx).Delete(&models.Book{}, id).Error
}
```

The `Order("id ASC")` in `GetAllBooksPaginated` is essential. Without a consistent sort order, the database can return rows in a different order between queries, causing records to be silently skipped or duplicated across pages.

## Step 9: Set up automatic collection creation

Add this to `search/collections.go`:

```go
package search

import (
    "context"
    "fmt"
    "log"

    "github.com/<yourusername>/typesense-gin-full-text-search/config"
    "github.com/typesense/typesense-go/v4/typesense/api"
    "github.com/typesense/typesense-go/v4/typesense/api/pointer"
)

// InitializeCollections ensures the books collection exists. Safe to call on every startup.
func InitializeCollections(ctx context.Context) error {
    log.Println("Initializing Typesense collections...")

    booksSchema := &api.CollectionSchema{
        Name: config.BookCollection,
        Fields: []api.Field{
            {Name: "title", Type: "string", Facet: pointer.False()},
            {Name: "authors", Type: "string[]", Facet: pointer.True()},
            {Name: "publication_year", Type: "int32", Facet: pointer.True()},
            {Name: "average_rating", Type: "float", Facet: pointer.True()},
            {Name: "image_url", Type: "string", Facet: pointer.False()},
            {Name: "ratings_count", Type: "int32", Facet: pointer.True()},
        },
        DefaultSortingField: pointer.String("ratings_count"),
    }

    _, err := Client.Collection(config.BookCollection).Retrieve(ctx)
    if err != nil {
        log.Printf("Collection '%s' not found, creating...", config.BookCollection)
        if _, err = Client.Collections().Create(ctx, booksSchema); err != nil {
            return fmt.Errorf("failed to create collection: %w", err)
        }
        log.Printf("Collection '%s' created successfully", config.BookCollection)
    } else {
        log.Printf("Collection '%s' already exists, skipping creation", config.BookCollection)
    }

    return nil
}

// CollectionDocumentCount returns the number of documents in the books collection.
// Returns 0 on any error (treated as empty).
func CollectionDocumentCount(ctx context.Context) int64 {
    coll, err := Client.Collection(config.BookCollection).Retrieve(ctx)
    if err != nil || coll.NumDocuments == nil {
        return 0
    }
    return *coll.NumDocuments
}
```

This function:

- **Checks if the collection exists** by trying to retrieve it
- **Creates it if missing** with the defined schema
- **Skips creation if it already exists** (idempotent behavior)
- **Returns errors** for proper error handling

Fields marked `Facet: pointer.True()` can be used for filtering and aggregation in search results (e.g. "all books by a given author published after 2000"). `DefaultSortingField` sets the tiebreaker when two results have the same relevance score.

## Step 10: Implement paginated sync from PostgreSQL to Typesense

Add this to `search/sync.go`.

This file implements two sync patterns that work together:

**Paginated full sync** — When syncing for the first time, or after a long outage, there may be thousands or millions of records to index. Loading them all into memory at once would cause out-of-memory crashes on large datasets. Instead, `SyncAllBooksToTypesense` fetches 1,000 rows at a time from PostgreSQL, converts them to Typesense documents, sends that batch to Typesense, then moves to the next page. Memory usage stays flat at roughly one page of data regardless of how large the table grows.

**Incremental sync** — On every subsequent run, `SyncBooksToTypesense` only fetches records whose `updated_at` timestamp is newer than `lastSyncTime` — the timestamp of the last successful sync. This avoids re-indexing the entire dataset on every tick. For a table with 1 million books where only 50 changed in the last 60 seconds, only those 50 are fetched and sent to Typesense. The `lastSyncTime` is updated to `time.Now()` at the end of each successful run, so the next run picks up from exactly where this one left off.

```go
package search

import (
    "context"
    "fmt"
    "log"
    "sync"
    "time"

    "github.com/<yourusername>/typesense-gin-full-text-search/config"
    "github.com/<yourusername>/typesense-gin-full-text-search/models"
    "github.com/<yourusername>/typesense-gin-full-text-search/store"
    "github.com/typesense/typesense-go/v4/typesense/api"
    "github.com/typesense/typesense-go/v4/typesense/api/pointer"
)

type SyncConfig struct {
    BatchSize        int // Documents per Typesense import API call
    PageSize         int // Records fetched per PostgreSQL query
    SyncIntervalSec  int
    EnableSoftDelete bool
}

func DefaultSyncConfig() *SyncConfig {
    return &SyncConfig{
        BatchSize:       1000,
        PageSize:        1000,
        SyncIntervalSec: 60,
    }
}

// SyncBooksToTypesense incrementally syncs books modified since lastSyncTime.
// Returns the new sync timestamp to persist after a successful run.
func SyncBooksToTypesense(ctx context.Context, lastSyncTime time.Time) (time.Time, error) {
    log.Printf("Starting incremental sync since %s", lastSyncTime.Format(time.RFC3339))
    cfg := DefaultSyncConfig()

    updatedCount, err := store.GetUpdatedBooksCount(ctx, lastSyncTime)
    if err != nil {
        return lastSyncTime, fmt.Errorf("failed to count updated books: %w", err)
    }
    if updatedCount == 0 {
        log.Println("No changes to sync")
        return time.Now(), nil
    }

    totalPages := int((updatedCount + int64(cfg.PageSize) - 1) / int64(cfg.PageSize))
    log.Printf("Found %d books to sync (processing in batches of %d)", updatedCount, cfg.PageSize)
    log.Printf("Will process %d pages", totalPages)

    totalSuccess, totalFailure := 0, 0

    for page := 1; page <= totalPages; page++ {
        log.Printf("Processing page %d/%d...", page, totalPages)

        books, err := store.GetBooksByUpdatedAtPaginated(ctx, lastSyncTime, page, cfg.PageSize)
        if err != nil {
            return lastSyncTime, fmt.Errorf("failed to fetch page %d: %w", page, err)
        }
        if len(books) == 0 {
            break
        }
        log.Printf("Fetched %d books from page %d", len(books), page)

        documents := make([]any, 0, len(books))
        for _, book := range books {
            documents = append(documents, map[string]any{
                "id":               book.GetTypesenseID(),
                "title":            book.Title,
                "authors":          book.Authors,
                "publication_year": book.PublicationYear,
                "average_rating":   book.AverageRating,
                "image_url":        book.ImageUrl,
                "ratings_count":    book.RatingsCount,
            })
        }

        // "upsert" inserts new docs and replaces existing ones — idempotent
        upsertAction := api.IndexAction("upsert")
        importParams := &api.ImportDocumentsParams{
            BatchSize: pointer.Int(cfg.BatchSize),
            Action:    &upsertAction,
        }

        results, err := Client.Collection(config.BookCollection).Documents().Import(ctx, documents, importParams)
        if err != nil {
            return lastSyncTime, fmt.Errorf("import failed on page %d: %w", page, err)
        }

        pageSuccess, pageFailure := 0, 0
        for _, result := range results {
            if result.Success {
                pageSuccess++
            } else {
                pageFailure++
                if totalFailure+pageFailure <= 5 {
                    log.Printf("Sync error for document %s: %s", result.Id, result.Error)
                }
            }
        }
        totalSuccess += pageSuccess
        totalFailure += pageFailure
        log.Printf("Page %d/%d completed: %d succeeded, %d failed (Total: %d succeeded, %d failed)",
            page, totalPages, pageSuccess, pageFailure, totalSuccess, totalFailure)
    }

    log.Printf("Incremental sync completed: %d upserted, %d failed out of %d total",
        totalSuccess, totalFailure, updatedCount)

    newSyncTime := time.Now()
    log.Printf("Last sync time updated to: %s", newSyncTime.Format(time.RFC3339))
    return newSyncTime, nil
}

// SyncSingleBookToTypesense upserts one book immediately for real-time sync.
func SyncSingleBookToTypesense(ctx context.Context, book models.Book) error {
    doc := map[string]any{
        "id": book.GetTypesenseID(), "title": book.Title,
        "authors": book.Authors, "publication_year": book.PublicationYear,
        "average_rating": book.AverageRating, "image_url": book.ImageUrl,
        "ratings_count": book.RatingsCount,
    }
    _, err := Client.Collection(config.BookCollection).Documents().Upsert(ctx, doc, &api.DocumentIndexParameters{})
    return err
}

// SyncSingleBookDeletionToTypesense removes one book from Typesense immediately.
func SyncSingleBookDeletionToTypesense(ctx context.Context, bookID uint) error {
    _, err := Client.Collection(config.BookCollection).Document(fmt.Sprintf("book_%d", bookID)).Delete(ctx)
    return err
}

// SyncSoftDeletesToTypesense removes a batch of soft-deleted books from Typesense.
func SyncSoftDeletesToTypesense(ctx context.Context, deletedBookIDs []uint) error {
    if len(deletedBookIDs) == 0 {
        return nil
    }
    ids := make([]string, 0, len(deletedBookIDs))
    for _, id := range deletedBookIDs {
        ids = append(ids, fmt.Sprintf("book_%d", id))
    }
    filterBy := "id:=[" + strings.Join(ids, ",") + "]"
    _, err := Client.Collection(config.BookCollection).Documents().Delete(ctx, &api.DeleteDocumentsParams{
        FilterBy: pointer.String(filterBy),
    })
    return err
}

// SyncState holds shared sync state — protected by a mutex for goroutine safety.
type SyncState struct {
    LastSyncTime      time.Time
    SyncWorkerRunning bool
    mu                sync.RWMutex
}

var globalSyncState = &SyncState{}

func GetLastSyncTime() time.Time {
    globalSyncState.mu.RLock()
    defer globalSyncState.mu.RUnlock()
    return globalSyncState.LastSyncTime
}

func SetLastSyncTime(t time.Time) {
    globalSyncState.mu.Lock()
    defer globalSyncState.mu.Unlock()
    globalSyncState.LastSyncTime = t
}

func SetSyncWorkerRunning(running bool) {
    globalSyncState.mu.Lock()
    defer globalSyncState.mu.Unlock()
    globalSyncState.SyncWorkerRunning = running
}

func IsSyncWorkerRunning() bool {
    globalSyncState.mu.RLock()
    defer globalSyncState.mu.RUnlock()
    return globalSyncState.SyncWorkerRunning
}
```

- The `upsert` action makes sync idempotent — running it twice on the same data produces the same result with no duplicates.
- Batching operates at two levels: `PageSize` is how many rows are fetched per PostgreSQL query, `BatchSize` is how many documents are sent per Typesense API call.
- `SyncState` uses a `sync.RWMutex` because `lastSyncTime` is read and written from both the background worker goroutine and the `/sync` HTTP endpoint — the mutex prevents race conditions between them.

## Step 11: Add the background sync worker

Add this to `search/worker.go`.

Think of `StartSyncWorker` as a background job that wakes up every 60 seconds, syncs any changed books to Typesense, then goes back to sleep. It runs in its own goroutine so the HTTP server handles requests at the same time — the two never block each other.

On startup, the worker checks whether Typesense already has data before deciding how to sync:

- **Typesense is empty** (first run or fresh instance): runs a full sync from zero time — all records from PostgreSQL are pushed to Typesense.
- **Typesense already has data** (server restart): seeds `lastSyncTime` from `MAX(updated_at)` of the PostgreSQL table, then runs an incremental sync — only records changed since that timestamp are synced. This avoids re-syncing thousands of already-indexed records on every restart.

Calling `StopSyncWorker()` cancels the context, which causes the `select` to exit cleanly — no leaked goroutines.

```go
package search

import (
    "context"
    "log"
    "sync"
    "time"

    "github.com/<yourusername>/typesense-gin-full-text-search/models"
    "github.com/<yourusername>/typesense-gin-full-text-search/store"
)

var (
    workerCtx         context.Context
    workerCancel      context.CancelFunc
    workerStartedOnce sync.Once
)

// StartSyncWorker runs in a goroutine and syncs the database to Typesense
// on a fixed interval. Call via: go search.StartSyncWorker(ctx, config)
func StartSyncWorker(ctx context.Context, cfg *SyncConfig) {
    workerCtx, workerCancel = context.WithCancel(ctx)
    SetSyncWorkerRunning(true)
    log.Printf("Starting sync worker with interval: %d seconds", cfg.SyncIntervalSec)

    workerStartedOnce.Do(func() {
        time.Sleep(2 * time.Second)

        if CollectionDocumentCount(workerCtx) > 0 {
            // Typesense already has data — seed from DB's latest updated_at
            // so we only pick up records changed since the last known state.
            if latest, err := store.GetLatestUpdatedAt(workerCtx); err == nil && !latest.IsZero() {
                SetLastSyncTime(latest)
                log.Printf("Typesense already populated, seeding sync time from DB: %s", latest.Format(time.RFC3339))
            }
        } else {
            // Typesense is empty — full sync from zero time
            log.Printf("Typesense collection is empty, running full sync")
        }

        lastSyncTime := GetLastSyncTime()
        if newSyncTime, err := SyncBooksToTypesense(workerCtx, lastSyncTime); err != nil {
            log.Printf("Initial sync failed: %v", err)
        } else {
            SetLastSyncTime(newSyncTime)
            log.Printf("Initial sync completed at %s", newSyncTime.Format(time.RFC3339))
        }
    })

    // Periodic sync loop — starts after the initial sync above completes.
    ticker := time.NewTicker(time.Duration(cfg.SyncIntervalSec) * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            log.Printf("Running periodic sync...")
            lastSyncTime := GetLastSyncTime()
            if newSyncTime, err := SyncBooksToTypesense(workerCtx, lastSyncTime); err != nil {
                log.Printf("Periodic sync failed: %v", err)
                // Do NOT update lastSyncTime on failure — next tick retries from same checkpoint
            } else {
                SetLastSyncTime(newSyncTime)
            }
            if cfg.EnableSoftDelete {
                if err := handleSoftDeletes(workerCtx, lastSyncTime); err != nil {
                    log.Printf("Soft delete sync failed: %v", err)
                }
            }
        case <-workerCtx.Done():
            log.Println("Sync worker stopped")
            SetSyncWorkerRunning(false)
            return
        }
    }
}

func StopSyncWorker() {
    if workerCancel != nil {
        workerCancel()
    }
}

// handleSoftDeletes receives the lastSyncTime captured before the upsert sync ran,
// so that any deletions which occurred in that same window are not missed.
func handleSoftDeletes(ctx context.Context, lastSyncTime time.Time) error {
    deletedBooks, err := store.GetDeletedBooks(ctx, lastSyncTime)
    if err != nil {
        return err
    }
    if len(deletedBooks) == 0 {
        return nil
    }
    deletedIDs := make([]uint, 0, len(deletedBooks))
    for _, book := range deletedBooks {
        deletedIDs = append(deletedIDs, book.ID)
    }
    log.Printf("Found %d soft-deleted books to sync to Typesense", len(deletedIDs))
    if err := SyncSoftDeletesToTypesense(ctx, deletedIDs); err != nil {
        return err
    }
    SetLastSyncTime(time.Now())
    return nil
}

// SyncBookOnUpdate syncs a single book to Typesense immediately after a write.
func SyncBookOnUpdate(ctx context.Context, book *models.Book) error {
    if err := SyncSingleBookToTypesense(ctx, *book); err != nil {
        return err
    }
    SetLastSyncTime(time.Now())
    return nil
}

// SyncBookDeletionOnDelete removes a book from Typesense immediately after delete.
func SyncBookDeletionOnDelete(ctx context.Context, bookID uint) error {
    if err := SyncSingleBookDeletionToTypesense(ctx, bookID); err != nil {
        return err
    }
    SetLastSyncTime(time.Now())
    return nil
}
```

The error handling on the periodic sync is intentional: **only update `lastSyncTime` on success**. If a sync run fails partway through (e.g. Typesense is temporarily down), keeping the old timestamp means the next run retries all records from the same checkpoint. Updating it on failure would silently skip those records.

## Step 12: Build the CRUD API with real-time sync

Add this to `routes/books.go`. Each write syncs to Typesense **asynchronously** in a goroutine so the HTTP response returns immediately without waiting for the Typesense call:

```go
package routes

import (
    "context"
    "log"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/<yourusername>/typesense-gin-full-text-search/models"
    "github.com/<yourusername>/typesense-gin-full-text-search/search"
    "github.com/<yourusername>/typesense-gin-full-text-search/store"
)

func SetupBookRoutes(router *gin.Engine) {
    books := router.Group("/books")
    {
        books.POST("", createBook)
        books.GET("/:id", getBook)
        books.GET("", getAllBooks)
        books.PUT("/:id", updateBook)
        books.DELETE("/:id", deleteBook)
    }
}

func createBook(c *gin.Context) {
    var book models.Book
    if err := c.ShouldBindJSON(&book); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
        return
    }
    // 1. Write to PostgreSQL
    if err := store.SaveBook(c.Request.Context(), &book); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create book: " + err.Error()})
        return
    }
    // 2. Sync to Typesense asynchronously
    go func(bookCopy models.Book) {
        if err := search.SyncBookOnUpdate(context.Background(), &bookCopy); err != nil {
            log.Printf("Async Typesense sync failed for book %d: %v", bookCopy.ID, err)
        }
    }(book)
    c.JSON(http.StatusCreated, gin.H{"message": "Book created successfully", "book": book})
}

func updateBook(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
        return
    }
    book, err := store.GetBookByID(c.Request.Context(), uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        return
    }
    if err := c.ShouldBindJSON(book); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
        return
    }
    book.ID = uint(id)
    if err := store.SaveBook(c.Request.Context(), book); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book: " + err.Error()})
        return
    }
    go func(bookCopy models.Book) {
        if err := search.SyncBookOnUpdate(context.Background(), &bookCopy); err != nil {
            log.Printf("Async Typesense sync failed for book %d: %v", bookCopy.ID, err)
        }
    }(*book)
    c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully", "book": book})
}

func deleteBook(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
        return
    }
    if _, err := store.GetBookByID(c.Request.Context(), uint(id)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        return
    }
    // Soft delete in PostgreSQL (sets deleted_at, does not remove the row)
    if err := store.DeleteBook(c.Request.Context(), uint(id)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book: " + err.Error()})
        return
    }
    // Remove from Typesense asynchronously
    go func(bookID uint) {
        if err := search.SyncBookDeletionOnDelete(context.Background(), bookID); err != nil {
            log.Printf("Async Typesense deletion failed for book %d: %v", bookID, err)
        }
    }(uint(id))
    c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}

func getBook(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
        return
    }
    book, err := store.GetBookByID(c.Request.Context(), uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"book": book})
}

func getAllBooks(c *gin.Context) {
    books, err := store.GetAllBooks(c.Request.Context())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch books: " + err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"count": len(books), "books": books})
}
```

Passing `book` as a function argument to the goroutine captures its value at call time — this prevents a data race where the goroutine reads the variable after the handler has already returned and potentially modified it.

## Step 13: Build the search and sync routes

Add this to `routes/search.go`:

```go
package routes

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/<yourusername>/typesense-gin-full-text-search/config"
    "github.com/<yourusername>/typesense-gin-full-text-search/search"
    "github.com/<yourusername>/typesense-gin-full-text-search/store"
    "github.com/typesense/typesense-go/v4/typesense/api"
    "github.com/typesense/typesense-go/v4/typesense/api/pointer"
)

func SetupSearchRoutes(router *gin.Engine) {
    router.GET("/search", searchBooks)
    router.POST("/sync", syncDatabaseToTypesense)
    router.GET("/sync/status", getSyncStatus)
}

func searchBooks(c *gin.Context) {
    query := c.Query("q")
    if query == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Search query 'q' is required"})
        return
    }

    searchParams := &api.SearchCollectionParams{
        Q:              pointer.String(query),
        QueryBy:        pointer.String("title,authors"),
        QueryByWeights: pointer.String("2,1"),                                     // title matches rank 2x higher
        FacetBy:        pointer.String("authors,publication_year,average_rating"), // aggregation counts for filters
    }

    result, err := search.Client.Collection(config.BookCollection).Documents().Search(c.Request.Context(), searchParams)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed: " + err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "query":        query,
        "results":      *result.Hits,
        "found":        *result.Found,
        "took":         result.SearchTimeMs,
        "facet_counts": result.FacetCounts,
    })
}

// syncDatabaseToTypesense triggers an on-demand incremental sync.
// Useful after bulk database changes without restarting the server.
func syncDatabaseToTypesense(c *gin.Context) {
    ctx := c.Request.Context()
    lastSyncTime := search.GetLastSyncTime()

    newSyncTime, err := search.SyncBooksToTypesense(ctx, lastSyncTime)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Sync failed", "message": err.Error()})
        return
    }

    deletedBooks, err := store.GetDeletedBooks(ctx, lastSyncTime)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch deleted books"})
        return
    }

    if len(deletedBooks) > 0 {
        deletedIDs := make([]uint, 0, len(deletedBooks))
        for _, book := range deletedBooks {
            deletedIDs = append(deletedIDs, book.ID)
        }
        if err := search.SyncSoftDeletesToTypesense(ctx, deletedIDs); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sync deletions"})
            return
        }
    }

    search.SetLastSyncTime(newSyncTime)
    c.JSON(http.StatusOK, gin.H{
        "message":      "Sync completed",
        "newSyncTime":  newSyncTime.Format(time.RFC3339),
        "syncedAt":     time.Now().Format(time.RFC3339),
        "deletedBooks": len(deletedBooks),
    })
}

func getSyncStatus(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "lastSyncTime":      search.GetLastSyncTime().Format(time.RFC3339),
        "syncWorkerRunning": search.IsSyncWorkerRunning(),
    })
}
```

`QueryByWeights: pointer.String("2,1")` tells Typesense to weight `title` matches twice as heavily as `author` matches. `FacetBy` returns aggregated counts per author, year, and rating that your frontend can use to render filter sidebars. See the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">full list of search parameters</RouterLink> for more options.

The Typesense API key never appears in the response — it stays safely on the server.

## Step 14: Wire everything together in server.go

Add this to `server.go`:

```go
package main

import (
    "context"
    "log"
    "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "github.com/<yourusername>/typesense-gin-full-text-search/config"
    "github.com/<yourusername>/typesense-gin-full-text-search/routes"
    "github.com/<yourusername>/typesense-gin-full-text-search/search"
    "github.com/<yourusername>/typesense-gin-full-text-search/store"
)

func main() {
    // 1. Load .env and initialize env-dependent package variables
    config.InitializeEnv()

    // 2. Create the Typesense client (reads env vars set above)
    search.InitializeClient()

    // 3. Connect to PostgreSQL and auto-migrate the schema
    store.ConnectToDB(context.Background())

    // 4. Ensure the Typesense collection exists (idempotent)
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    if err := search.InitializeCollections(ctx); err != nil {
        log.Fatalf("Failed to initialize collections: %v", err)
    }

    router := gin.Default()
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: false,
    }))

    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    routes.SetupSearchRoutes(router)
    routes.SetupBookRoutes(router)

    // Start background sync worker in its own goroutine.
    // Without `go`, StartSyncWorker's infinite loop would block router.Run()
    // from ever being reached.
    syncConfig := search.DefaultSyncConfig()
    syncConfig.EnableSoftDelete = true
    go search.StartSyncWorker(context.Background(), syncConfig)

    port := config.GetEnv("PORT", "3000")
    log.Printf("Server starting on port %s", port)
    log.Printf("Sync worker started with interval: %d seconds", syncConfig.SyncIntervalSec)
    router.Run(":" + port)
}
```

The `go search.StartSyncWorker(...)` is the key concurrency point. With `go`, the sync worker ticks in the background while Gin handles HTTP requests simultaneously.

## Step 15: Run your server

```bash
go run server.go
```

Expected startup output:

```plaintext
Typesense Client created successfully
Initializing Typesense collections...
Collection 'books' not found, creating...
Collection 'books' created successfully
Starting sync worker with interval: 60 seconds
Server starting on port 3000
[GIN-debug] GET    /ping
[GIN-debug] GET    /search
[GIN-debug] POST   /sync
[GIN-debug] GET    /sync/status
[GIN-debug] POST   /books
[GIN-debug] GET    /books/:id
[GIN-debug] GET    /books
[GIN-debug] PUT    /books/:id
[GIN-debug] DELETE /books/:id
[GIN-debug] Listening and serving HTTP on :3000
```

For hot reload during development:

```bash
go install github.com/githubnemo/CompileDaemon@latest
CompileDaemon --build="go build -o server ." --command="./server"
```

## Testing the API

**Search** — Typesense handles typos automatically:

```bash
curl "http://localhost:3000/search?q=harry+potter"
curl "http://localhost:3000/search?q=tolkein"   # typo — still finds Tolkien
```

**Create a book** — syncs to Typesense in the background:

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language",
    "authors": ["Alan Donovan", "Brian Kernighan"],
    "publication_year": 2015,
    "average_rating": 4.7,
    "image_url": "https://example.com/gobook.jpg",
    "ratings_count": 8500
  }'
```

**Trigger a manual sync** (useful after bulk database changes):

```bash
curl -X POST http://localhost:3000/sync
```

Response:

```json
{
  "message": "Sync completed",
  "newSyncTime": "2026-02-25T11:30:39+05:30",
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
  "lastSyncTime": "2026-02-25T11:30:39+05:30",
  "syncWorkerRunning": true
}
```

**Example paginated sync log** (10,000 records, 10 pages of 1,000):

```plaintext
Found 10000 books to sync (processing in batches of 1000)
Will process 10 pages
Processing page 1/10...
Fetched 1000 books from page 1
Page 1/10 completed: 1000 succeeded, 0 failed (Total: 1000 succeeded, 0 failed)
...
Processing page 10/10...
Fetched 1000 books from page 10
Page 10/10 completed: 1000 succeeded, 0 failed (Total: 10000 succeeded, 0 failed)
Incremental sync completed: 10000 upserted, 0 failed out of 10000 total
```

## How the sync strategies work together

The three sync strategies complement each other:

| Strategy | When | Latency | Use case |
| --- | --- | --- | --- |
| Real-time (goroutine) | On each CRUD write | < 100ms | Individual creates, updates, deletes |
| Periodic (worker) | Every 60 seconds | Up to 60s | Catch-up for any missed real-time syncs |
| Manual (`POST /sync`) | On demand | Depends on volume | After bulk DB imports, after outages |

The periodic sync is the safety net. Even if the real-time async goroutine fails (e.g. Typesense was briefly down), the periodic sync picks up all changed records by comparing `updated_at` against `lastSyncTime`.

## Production Considerations

### Restrict CORS origins

```go
AllowOrigins: []string{"https://yourdomain.com"},
```

### Add authentication middleware

```go
router.Use(authMiddleware())
```

### Use production Typesense

```env
TYPESENSE_HOST=xxx.typesense.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your-production-key
```

### Run Gin in release mode

```bash
export GIN_MODE=release
```

## Source Code

The complete source code for this project is available on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-gin-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-gin-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
