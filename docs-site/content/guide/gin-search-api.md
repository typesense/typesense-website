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

While Typesense can be accessed directly from frontend applications, there's a crucial reason why production applications almost always use a backend proxy: **security and control**.

Here's the reality: when you expose your Typesense API key directly to the frontend, you're essentially giving every user full access to your search infrastructure. They could potentially:

- Make unlimited search requests, driving up your costs
- Access collections they shouldn't see
- Reverse-engineer your search logic
- Overwhelm your server with requests

By building a backend API, you get:

- **Authentication** - Only logged-in users can search
- **Rate limiting** - Prevent abuse and control costs
- **Custom business logic** - Filter results based on user permissions
- **API key security** - Your Typesense credentials never leave the server
- **Analytics** - Track what users are searching for
- **Caching** - Speed up repeated searches

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

- That's it! You are now ready to create collections and load data into your Typesense server.

:::tip
You can also set up a managed Typesense cluster on [Typesense Cloud](https://cloud.typesense.org) for a fully managed experience with a management UI, high availability, globally distributed search nodes and more.
:::

## Step 2: Create a new books collection and load sample dataset into Typesense

Typesense needs you to create a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html`">collection</RouterLink> in order to search through documents. A collection is a named container that defines a schema and stores indexed documents for search. Collection bundles three things together:

  1. Schema
  2. Document
  3. Index

You can create the books collection for this project using this `curl` command:

```shell
curl "http://localhost:8108/collections" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
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

Now that the collection is set up, we can load the sample dataset.

1. Download the sample dataset:

   ```shell
   curl -O https://dl.typesense.org/datasets/books.jsonl.gz
   ```

2. Unzip the dataset:

   ```shell
   gunzip books.jsonl.gz
   ```

3. Load the dataset in to Typesense:

   ```shell
   curl "http://localhost:8108/collections/books/documents/import" \
         -X POST \
         -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
         --data-binary @books.jsonl
   ```

You should see a bunch of success messages if the data load is successful.

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
touch utils/env.go utils/typesense.go routes/search.go server.go
```

Your project should now look like this:

```plaintext
typesense-gin-search-api/
├── routes/
│   └── search.go
├── utils/
│   ├── env.go
│   └── typesense.go
├── .env
├── go.mod
├── go.sum
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

## Step 8: Create the search route

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
2. Configures the search to look in both `title` and `authors` fields.
3. Executes the search against Typesense.
4. Returns the results in a clean JSON format.

Notice how the Typesense API key never appears in the response - it stays safely on the server.

## Step 9: Create the main server

Finally, let's tie everything together. Add this to `server.go`:

```go
package main

import (
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "github.com/<yourusername>/typesense-gin-search-api/routes"
    "github.com/<yourusername>/typesense-gin-search-api/utils"
)

func main() {
    router := gin.Default()

    // CORS middleware - allows requests from your frontend
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

    // Get port from environment
    port := utils.GetEnv("PORT", "3000")
    router.Run(":" + port)
}
```

This sets up:

- CORS to allow frontend requests (configure `AllowOrigins` for production)
- A health check endpoint at `/ping`
- Your search routes
- The server to run on the configured port

## Step 10: Run your API server

You're ready to start your server! Run:

```bash
go run server.go
```

You should see output like:

```bash
2026/02/15 08:19:18 Typesense Client created successfully
[GIN-debug] GET    /ping      --> main.main.func1 (4 handlers)
[GIN-debug] GET    /search    --> routes.searchBooks (4 handlers)
[GIN-debug] Listening and serving HTTP on :3000
```

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
