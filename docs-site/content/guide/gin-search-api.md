# Building a Search API with Go Gin and Typesense

This guide walks you through building a RESTful search API using Go's Gin framework and Typesense. You'll create a simple backend server that acts as a secure proxy between your frontend applications and Typesense, giving you full control over authentication, rate limiting, and search logic.

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

## Prerequisites

This guide uses [Go](https://go.dev/) and the [Gin](https://gin-gonic.com/) web framework to build a fast, production-ready API server.

Please ensure you have the following installed:

- [Go 1.19+](https://go.dev/doc/install)
- [Docker](https://docs.docker.com/get-docker/) (for running Typesense locally)
- Basic knowledge of Go and REST APIs

This guide uses a Linux environment, but you can adapt the commands to other operating systems as needed.

## Step 1: Setup your Typesense server

Once Docker is installed, you can run a Typesense container in the background using the following commands:

- Create a folder that will store all searchable data stored for Typesense:

  ```shell
  mkdir "$(pwd)"/typesense-data
  ```

- Run the Docker container:

  <Tabs :tabs="['Shell']">
    <template v-slot:Shell>
      <div class="manual-highlight">
        <pre class="language-bash"><code>export TYPESENSE_API_KEY=xyz
  docker run -p 8108:8108 \
    -v"$(pwd)"/typesense-data:/data typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }} \
    --data-dir /data \
    --api-key=$TYPESENSE_API_KEY \
    --enable-cors \
    -d</code></pre>
      </div>
    </template>
  </Tabs>

- Verify if your Docker container was created properly:

  ```shell
  docker ps
  ```

- You should see the Typesense container running without any issues:

  ```shell
  CONTAINER ID   IMAGE                      COMMAND                  CREATED       STATUS       PORTS                                         NAMES
  82dd6bdfaf66   typesense/typesense:latest   "/opt/typesense-serv…"   1 min ago   Up 1 minutes   0.0.0.0:8108->8108/tcp, [::]:8108->8108/tcp   nostalgic_babbage
  ```

:::tip
You can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with a management UI, high availability, globally distributed search nodes and more.
:::

## Step 2: Download sample dataset

For this guide, we'll use a sample books dataset. Both the collection creation and data import will be handled automatically by our Go application when it starts up (we'll implement this in later steps).

Download the sample dataset to your project directory:

```shell
curl -O https://dl.typesense.org/datasets/books.jsonl.gz
gunzip books.jsonl.gz
```

This will create a `books.jsonl` file that our Go application will automatically import on first startup.

## Step 3: Initialize your Go project

Create a new directory for your project:

```bash
mkdir typesense-gin-search-api
cd typesense-gin-search-api
```

Initialize a Go module:

```bash
go mod init github.com/<yourusername>/typesense-gin-search-api
```

Install the required dependencies:

```bash
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
go get github.com/typesense/typesense-go/v4
go get github.com/joho/godotenv
```

Let's understand what each dependency does:

- [**gin-gonic/gin**](https://github.com/gin-gonic/gin) - A fast HTTP web framework for Go, perfect for building APIs
- [**gin-contrib/cors**](https://github.com/gin-contrib/cors) - CORS middleware to allow requests from your frontend
- [**typesense-go**](https://github.com/typesense/typesense-go) - Official Go client for Typesense
- [**godotenv**](https://github.com/joho/godotenv) - Loads environment variables from a `.env` file

## Step 4: Set up environment configuration

Create a `.env` file in your project root:

```bash
touch .env
```

Add your configuration:

```env
# Server Configuration
PORT=3000

# Typesense Configuration
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
TYPESENSE_COLLECTION=books
```

This keeps your sensitive configuration separate from your code. In production, you'd use actual environment variables instead of a `.env` file.

## Step 5: Create the project structure

Let's organize our code properly. Create the following directory structure:

```bash
mkdir -p utils routes
touch utils/env.go utils/typesense.go utils/collections.go utils/data_import.go routes/search.go server.go
```

Your project should now look like this:

```plaintext
typesense-gin-search-api/
├── routes/
│   └── search.go
├── utils/
│   ├── env.go
│   ├── typesense.go
│   ├── collections.go
│   └── data_import.go
├── .env
├── go.mod
├── go.sum
├── books.jsonl // sample dataset file
└── server.go
```

## Step 6: Build the environment utilities

First, let's create a utility to read environment variables. Add this to `utils/env.go`:

```go
package utils

import (
    "log"
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

// init() runs automatically when the package is imported
func init() {
    // Load .env file
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }
}

// GetEnv reads an environment variable with a default fallback
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

var BookCollection = GetEnv("TYPESENSE_COLLECTION", "books")
```

This utility provides a clean way to access configuration throughout your application. The `init()` function automatically loads the `.env` file when the package is imported.

## Step 7: Initialize the Typesense client

Now let's set up the Typesense client. Add this to `utils/typesense.go`:

```go
package utils

import (
    "log"

    "github.com/typesense/typesense-go/v4/typesense"
)

var Client *typesense.Client

func init() {
    apiKey := GetEnv("TYPESENSE_API_KEY", "xyz")
    serverURL := GetServerURL()

    log.Printf("Creating Typesense Client - Server URL: %s", serverURL)

    // Create client with configuration from environment
    Client = typesense.NewClient(
        typesense.WithServer(serverURL),
        typesense.WithAPIKey(apiKey),
    )

    log.Printf("Typesense Client created successfully")
}
```

This creates a singleton Typesense client that's initialized once and reused throughout your application. The client handles connection pooling and request management automatically. This client can be configured with additional options as per the [official documentation](https://github.com/typesense/typesense-go?tab=readme-ov-file#usage).

## Step 8: Set up automatic collection creation

Now let's implement the code for managing collections. Instead of manually creating collections with curl commands, we'll have our application automatically create them on startup if they don't exist.

Add this code to `utils/collections.go`:

```go
package utils

import (
    "context"
    "log"

    "github.com/typesense/typesense-go/v4/typesense/api"
    "github.com/typesense/typesense-go/v4/typesense/api/pointer"
)

// InitializeCollections ensures all required collections exist
// This is idempotent - safe to call multiple times
func InitializeCollections(ctx context.Context) error {
    log.Println("Initializing Typesense collections...")

    // Define the books collection schema
    booksSchema := &api.CollectionSchema{
        Name: BookCollection,
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

    // Try to retrieve the collection to check if it exists
    _, err := Client.Collection(BookCollection).Retrieve(ctx)
    if err != nil {
        // Collection doesn't exist, create it
        log.Printf("Collection '%s' not found, creating...", BookCollection)
        _, err = Client.Collections().Create(ctx, booksSchema)
        if err != nil {
            log.Printf("Failed to create collection '%s': %v", BookCollection, err)
            return err
        }
        log.Printf("Collection '%s' created successfully", BookCollection)
    } else {
        log.Printf("Collection '%s' already exists, skipping creation", BookCollection)
    }

    return nil
}
```

This function:

- **Checks if the collection exists** by trying to retrieve it
- **Creates it if missing** with the defined schema
- **Skips creation if it already exists** (idempotent behavior)
- **Returns errors** for proper error handling

## Step 9: Set up automatic data import

Now let's implement automatic data loading. This ensures your collection is populated with data on first startup, making your application truly ready to use out of the box.

Add this code to `utils/data_import.go`:

```go
package utils

import (
    "bufio"
    "context"
    "encoding/json"
    "fmt"
    "log"
    "os"

    "github.com/typesense/typesense-go/v4/typesense/api"
    "github.com/typesense/typesense-go/v4/typesense/api/pointer"
)

// ImportDocumentsFromJSONL imports documents from a JSONL file in bulk
func ImportDocumentsFromJSONL(ctx context.Context, collectionName, filePath string) error {
    log.Printf("Starting bulk import from %s to collection '%s'...", filePath, collectionName)

    // Read the JSONL file
    file, err := os.Open(filePath)
    if err != nil {
        return fmt.Errorf("failed to open file: %w", err)
    }
    defer file.Close()

    // Parse each line as a JSON document
    scanner := bufio.NewScanner(file)
    var documents []interface{}
    lineCount := 0

    for scanner.Scan() {
        var doc map[string]interface{}
        if err := json.Unmarshal(scanner.Bytes(), &doc); err != nil {
            log.Printf("Warning: skipping invalid JSON line: %v", err)
            continue
        }
        documents = append(documents, doc)
        lineCount++
    }

    if err := scanner.Err(); err != nil {
        return fmt.Errorf("error reading file: %w", err)
    }

    log.Printf("Read %d documents from file", lineCount)

    // Import documents in bulk using the import API
    // BatchSize controls how many documents are processed at once
    importParams := &api.ImportDocumentsParams{
        BatchSize: pointer.Int(100), // Process in batches of 100
    }

    // The Import method accepts []interface{} containing document maps
    results, err := Client.Collection(collectionName).Documents().Import(
        ctx,
        documents,
        importParams,
    )

    if err != nil {
        return fmt.Errorf("bulk import failed: %w", err)
    }

    // Count successes and failures
    successCount := 0
    failureCount := 0

    for _, result := range results {
        if result.Success {
            successCount++
        } else {
            failureCount++
            // Log first few errors for debugging
            if failureCount <= 5 {
                log.Printf("Import error: %s", result.Error)
            }
        }
    }

    log.Printf("Bulk import completed: %d succeeded, %d failed", successCount, failureCount)

    if failureCount > 0 && failureCount > lineCount/2 {
        // Only error if more than half failed
        return fmt.Errorf("bulk import had too many failures: %d out of %d", failureCount, lineCount)
    }

    return nil
}

// CheckCollectionDocumentCount returns the number of documents in a collection
func CheckCollectionDocumentCount(ctx context.Context, collectionName string) (int, error) {
    collection, err := Client.Collection(collectionName).Retrieve(ctx)
    if err != nil {
        return 0, fmt.Errorf("failed to retrieve collection: %w", err)
    }

    return int(*collection.NumDocuments), nil
}

// InitializeDataIfEmpty checks if collection is empty and imports data if needed
// This is idempotent - safe to run on every startup
func InitializeDataIfEmpty(ctx context.Context, collectionName, dataFilePath string) error {
    log.Printf("Checking if collection '%s' needs data initialization...", collectionName)

    // Check current document count
    count, err := CheckCollectionDocumentCount(ctx, collectionName)
    if err != nil {
        return fmt.Errorf("failed to check document count: %w", err)
    }

    if count > 0 {
        log.Printf("Collection '%s' already has %d documents, skipping import", collectionName, count)
        return nil
    }

    log.Printf("Collection '%s' is empty, importing data from %s", collectionName, dataFilePath)

    // Import data
    if err := ImportDocumentsFromJSONL(ctx, collectionName, dataFilePath); err != nil {
        return fmt.Errorf("failed to import data: %w", err)
    }

    // Verify import
    newCount, err := CheckCollectionDocumentCount(ctx, collectionName)
    if err != nil {
        return fmt.Errorf("failed to verify import: %w", err)
    }

    log.Printf("Data import successful: collection '%s' now has %d documents", collectionName, newCount)
    return nil
}
```

This module provides three key functions:

- **`ImportDocumentsFromJSONL()`** - Reads a JSONL file and bulk imports documents into Typesense. This is 10-100x faster than inserting documents one by one.
- **`CheckCollectionDocumentCount()`** - Returns the current number of documents in a collection.
- **`InitializeDataIfEmpty()`** - Checks if a collection is empty and imports data if needed. This is idempotent and safe to run on every startup.

## Step 10: Create the search route

Now for the heart of our API - the search endpoint. Add this to `routes/search.go`:

```go
package routes

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/<yourusername>/typesense-gin-search-api/utils"
    "github.com/typesense/typesense-go/v4/typesense/api"
    "github.com/typesense/typesense-go/v4/typesense/api/pointer"
)

// SetupSearchRoutes configures all search-related routes
func SetupSearchRoutes(router *gin.Engine) {
    router.GET("/search", searchBooks)
}

// searchBooks handles the search request
func searchBooks(c *gin.Context) {
    query := c.Query("q")
    if query == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Search query parameter 'q' is required",
        })
        return
    }

    // Create search parameters
    searchParams := &api.SearchCollectionParams{
      Q:       pointer.String(query),
      QueryBy: pointer.String("title,authors"),
      QueryByWeights: pointer.String("2,1"),
      FacetBy:        pointer.String("authors,publication_year,average_rating")
    }

    // Perform search using the Typesense client
    result, err := utils.Client.Collection(utils.BookCollection).Documents().Search(c.Request.Context(), searchParams)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Search failed: " + err.Error(),
        })
        return
    }

    // Return search results
    c.JSON(http.StatusOK, gin.H{
        "query":   query,
        "results": *result.Hits,
        "found":   *result.Found,
        "took":    result.SearchTimeMs,
    })
}
```

This route handler:

1. Validates that a search query was provided.
2. Configures the search to look in both `title` and `authors` fields, with `query_by_weights` to rank title matches 2x higher than author matches, and `facet_by` to return aggregated counts for filtering. See the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">full list of search parameters</RouterLink> for more options.
3. Executes the search against Typesense.
4. Returns the results in a clean JSON format.

Notice how the Typesense API key never appears in the response - it stays safely on the server.

## Step 11: Create the main server

Finally, let's tie everything together. Add this to `server.go`:

```go
package main

import (
  "context"
  "log"
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
  "github.com/<yourusername>/typesense-gin-search-api/routes"
  "github.com/<yourusername>/typesense-gin-search-api/utils"
)

func main() {
  // Initialize collections before starting the server
  ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
  defer cancel()

  if err := utils.InitializeCollections(ctx); err != nil {
    log.Fatalf("Failed to initialize collections: %v", err)
  }

  // Initialize data if collection is empty
  // This is idempotent - only imports if collection has no documents
  dataFile := "books.jsonl"
  if err := utils.InitializeDataIfEmpty(ctx, utils.BookCollection, dataFile); err != nil {
    log.Printf("Warning: Failed to initialize data: %v", err)
    log.Println("Server will continue, but collection may be empty")
  }

  router := gin.Default()

 // CORS middleware
 router.Use(cors.New(cors.Config{
   AllowOrigins:     []string{"*"},
   AllowMethods:     []string{"GET", "OPTIONS"},
   AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
   ExposeHeaders:    []string{"Content-Length"},
   AllowCredentials: true,
  }))

  // Health check endpoint
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  // Setup search routes
  routes.SetupSearchRoutes(router)

  port := utils.GetEnv("PORT", "3000")
  router.Run(":" + port)
}
```

This sets up:

- CORS to allow frontend requests (configure `AllowOrigins` for production)
- A health check endpoint at `/ping`
- Your search routes
- The server to run on the configured port

## Step 12: Run your API server

Before starting the server, make sure you have the `books.jsonl` data file in your project root directory (the same directory as `server.go`).

Now you're ready to start your server! Run:

```bash
go run server.go
```

You should see output like:

```bash
Typesense Client created successfully
Initializing Typesense collections...
Collection 'books' not found, creating...
Collection 'books' created successfully
Checking if collection 'books' needs data initialization...
Collection 'books' is empty, importing data from books.jsonl
Starting bulk import from books.jsonl to collection 'books'...
Read 9979 documents from file
Bulk import completed: 9979 succeeded, 0 failed
[GIN-debug] GET    /ping      --> main.main.func1 (4 handlers)
[GIN-debug] GET    /search    --> routes.searchBooks (4 handlers)
[GIN-debug] Listening and serving HTTP on :3000
```

Notice the collection initialization and data import happens automatically before the server starts. If the collection doesn't exist, you'll see it being created instead.

You can also configure hot reload for development using [CompileDaemon](https://github.com/githubnemo/CompileDaemon) and use this command to watch for changes and automatically restart the server:

```bash
CompileDaemon --build="go build -o server ." --command="./server"
```

Your API is now running! Test it with:

```bash
curl "http://localhost:3000/search?q=harry"
```

You should get back search results for books matching "harry" (like Harry Potter):

```json
{
  "found": 32,
  "query": "harry",
  "results": [
    {
      "document": {
        "authors": ["J.K. Rowling", " Mary GrandPré"],
        "average_rating": 4.44,
        "id": "2",
        "image_url": "https://images.gr-assets.com/books/1474154022m/3.jpg",
        "publication_year": 1997,
        "ratings_count": 4602479,
        "title": "Harry Potter and the Philosopher's Stone"
      },
      "highlight": {
        "title": {
          "matched_tokens": ["Harry"],
          "snippet": "<mark>Harry</mark> Potter and the Philosopher's Stone"
        }
      },
      "highlights": [
        {
          "field": "title",
          "matched_tokens": ["Harry"],
          "snippet": "<mark>Harry</mark> Potter and the Philosopher's Stone"
        }
      ],
      "text_match": 578730123365189753,
      "text_match_info": {
        "best_field_score": "1108091338753",
        "best_field_weight": 15,
        "fields_matched": 1,
        "num_tokens_dropped": 0,
        "score": "578730123365189753",
        "tokens_matched": 1,
        "typo_prefix_score": 0
      }
    }
  ],
  "took": 4
}
```

The response includes:

- **query** - What the user searched for
- **results** - Array of matching documents with highlights
- **found** - Total number of matches
- **took** - Search time in milliseconds

## Production Considerations

Before deploying to production, consider these improvements:

### 1. Restrict CORS origins

Update your CORS configuration to only allow your frontend domain:

```go
AllowOrigins: []string{"https://yourdomain.com"},
```

### 2. Add authentication

Protect your API with authentication middleware:

```go
router.Use(authMiddleware())
```

### 3. Implement rate limiting

Prevent abuse by limiting requests per user. Consider using a middleware like [gin-limiter](https://github.com/ulule/limiter):

```go
router.Use(rateLimitMiddleware())
```

### 4. Add request logging

Track what users are searching for:

```go
router.Use(gin.Logger())
```

### 5. Use production Typesense

Update your `.env` to point to Typesense Cloud or your production server:

```env
TYPESENSE_HOST=xxx.typesense.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your-production-key
```

### 6. Run in release mode

Set Gin to release mode for better performance:

```bash
export GIN_MODE=release
```

## Testing Your API

Here are some example searches to try:

```bash
# Search for Harry Potter books
curl "http://localhost:3000/search?q=harry+potter"

# Search for books by Tolkien
curl "http://localhost:3000/search?q=tolkien"

# Search with a typo (Typesense will still find results!)
curl "http://localhost:3000/search?q=shakespear"
```

## Next Steps

Now that you have a working search API, you can:

- Add more search endpoints (faceted search, filtering, sorting)
- Implement user authentication and authorization
- Add caching with Redis for frequently searched terms
- Set up monitoring and analytics
- Deploy to production (AWS, GCP, Heroku, etc.)
- Build a frontend that consumes this API

## Source Code

The complete source code for this project is available on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-gin-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-gin-full-text-search)

## Related Examples

Check out these related examples:

- [Typesense Go Demo](https://github.com/ekkinox/typesense-go-demo)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
