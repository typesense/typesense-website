# Building a Search API with Spring Boot and Typesense

This guide walks you through building a RESTful search API using Spring Boot, PostgreSQL, and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

By the end of this guide, you'll have:

- A full CRUD API for a sample books dataset, backed by PostgreSQL
- Automatic database-to-Typesense sync (both real-time and periodic)
- Paginated sync that safely handles millions of records without memory issues
- A scheduled background sync using Spring's `@Scheduled` annotation
- A search endpoint that proxies queries through your backend, to Typesense

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
┌─────────────┐     CRUD      ┌─────────────────┐
│   Frontend  │ ────────────▶ │  Spring Boot    │
│             │ ◀──────────── │  API (Java)     │
└─────────────┘    Search     └──────┬──────────┘
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
                              @Scheduled Sync
                              (every 60 seconds)
```

**PostgreSQL** is the source of truth. All writes go there first. **Typesense** is the search index, kept in sync automatically via a `@Scheduled` task that runs every 60 seconds. This pattern gives you durable relational storage alongside sub-millisecond full-text search.

## Prerequisites

Please ensure you have the following installed:

- [Java 17+](https://adoptium.net/)
- [Maven 3.8+](https://maven.apache.org/install.html) (or use the included Maven wrapper)
- [Docker](https://docs.docker.com/get-docker/) (for running Typesense and PostgreSQL)
- Basic knowledge of Java, Spring Boot, and REST APIs

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

## Step 2: Initialize your Spring Boot project

You can bootstrap a new project using [Spring Initializr](https://start.spring.io/) with these dependencies: **Spring Web**, **Spring Data JPA**, **PostgreSQL Driver**, and **Lombok**. Or create the `pom.xml` manually:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
    https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.5</version>
  </parent>
  <groupId>org.typesense</groupId>
  <artifactId>full-text-search</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <properties>
    <java.version>17</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>
    <dependency>
      <groupId>org.typesense</groupId>
      <artifactId>typesense-java</artifactId>
      <version>1.3.0</version>
    </dependency>
    <dependency>
      <groupId>io.github.cdimascio</groupId>
      <artifactId>dotenv-java</artifactId>
      <version>3.0.0</version>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

What each dependency does:

- [**spring-boot-starter-data-jpa**](https://spring.io/projects/spring-data-jpa) - JPA/Hibernate ORM with automatic repository generation
- [**spring-boot-starter-webmvc**](https://spring.io/projects/spring-framework) - Spring MVC for building REST APIs
- [**typesense-java**](https://github.com/typesense/typesense-java) - Official Java client for Typesense
- [**dotenv-java**](https://github.com/cdimascio/dotenv-java) - Loads environment variables from a `.env` file during local development
- [**postgresql**](https://jdbc.postgresql.org/) - PostgreSQL JDBC driver
- [**lombok**](https://projectlombok.org/) - Reduces boilerplate with annotations like `@Getter`, `@Setter`

## Step 3: Create the project structure

```plaintext
typesense-springboot-full-text-search/
├── src/main/java/org/typesense/full_text_search/
│   ├── config/
│   │   ├── AsyncConfig.java          # Thread pool for async Typesense operations
│   │   ├── DatabaseInitializer.java   # Auto-creates PostgreSQL database
│   │   ├── TypesenseConfig.java       # Typesense client bean
│   │   └── WebConfig.java            # CORS configuration
│   ├── controller/
│   │   ├── BookController.java        # CRUD API handlers
│   │   ├── HealthController.java      # /ping endpoint
│   │   ├── SearchController.java      # Search API handler
│   │   └── SyncController.java        # Manual sync + status handlers
│   ├── model/
│   │   └── Book.java                  # JPA entity with soft delete
│   ├── repository/
│   │   └── BookRepository.java        # Spring Data JPA queries
│   ├── scheduler/
│   │   └── TypesenseSyncScheduler.java  # @Scheduled periodic sync
│   ├── service/
│   │   ├── BookService.java           # Business logic for Book entities
│   │   └── TypesenseService.java      # Search, sync, collection management
│   └── FullTextSearchApplication.java # Application entry point
├── src/main/resources/
│   └── application.properties         # All configuration
└── pom.xml
```

## Step 4: Set up application configuration

Add this to `src/main/resources/application.properties`:

```properties
spring.application.name=full-text-search
server.port=4000

# Database Configuration
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.jdbc.time_zone=UTC

# Typesense Configuration
typesense.host=${TYPESENSE_HOST}
typesense.port=${TYPESENSE_PORT}
typesense.protocol=${TYPESENSE_PROTOCOL}
typesense.api-key=${TYPESENSE_API_KEY}
typesense.collection-name=${TYPESENSE_COLLECTION}
typesense.connection-timeout-seconds=2

# Sync Configuration
typesense.sync.interval-ms=60000
typesense.sync.batch-size=1000
typesense.sync.page-size=1000
typesense.sync.enable-soft-delete=true
```

Spring Boot's `${VAR}` syntax reads from environment variables and falls back to the default value. This keeps sensitive credentials out of your code. By using `dotenv-java`, these can be loaded seamlessly from a `.env` file during local development.

`spring.jpa.hibernate.ddl-auto=update` automatically creates and updates the database table schema on startup, no manual migration scripts needed during development.

## Step 5: Initialize the Typesense client

Add this to `config/TypesenseConfig.java`:

```java

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.typesense.api.Client;
import org.typesense.resources.Node;

@Configuration
public class TypesenseConfig {

    @Value("${typesense.protocol}")
    private String protocol;

    @Value("${typesense.host}")
    private String host;

    @Value("${typesense.port}")
    private String port;

    @Value("${typesense.api-key}")
    private String apiKey;

    @Value("${typesense.connection-timeout-seconds}")
    private int connectionTimeoutSeconds;

    @Bean
    public Client typesenseClient() {
        Node node = new Node(protocol, host, port);
        org.typesense.api.Configuration configuration = new org.typesense.api.Configuration(
                List.of(node),
                Duration.ofSeconds(connectionTimeoutSeconds),
                apiKey
        );
        return new Client(configuration);
    }
}
```

The `@Bean` annotation registers the Typesense `Client` in Spring's dependency injection container. Any class that needs the client simply declares it as a constructor parameter, and Spring injects the singleton automatically.

Note the fully qualified `org.typesense.api.Configuration` - this avoids a name clash with Spring's own `@Configuration` annotation.

## Step 6: Define the Book model

Add this to `model/Book.java`:

```java

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "books")
@SQLDelete(sql = "UPDATE books SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "jsonb")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private List<String> authors;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "ratings_count")
    private Integer ratingsCount;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @jakarta.persistence.PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getTypesenseId() {
        return "book_" + id;
    }
}
```

Key design choices:

- **`authors` as `List<String>`** with `@JdbcTypeCode(SqlTypes.JSON)` stores the list as a JSONB array in PostgreSQL and maps cleanly to Typesense's `string[]` field type.
- **`@SQLDelete`** overrides Hibernate's default `DELETE` to instead set `deleted_at` and `updated_at` - this is a soft delete. The row stays in the table so we can detect deletions and propagate them to Typesense.
- **`@SQLRestriction("deleted_at IS NULL")`** automatically filters out soft-deleted rows from all normal queries.
- **`getTypesenseId()`** prefixes the database integer ID with `book_` since Typesense requires string document IDs.
- **`@PrePersist` / `@PreUpdate`** lifecycle callbacks ensure `updated_at` is always stamped on writes. The incremental sync relies on this field to detect what changed since the last run.

## Step 7: Set up the repository layer with pagination

Add this to `repository/BookRepository.java`. Spring Data JPA generates the implementation automatically from the method names:

```java

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.typesense.full_text_search.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

    Page<Book> findByUpdatedAtAfterOrderByUpdatedAtAsc(Instant since, Pageable pageable);

    long countByUpdatedAtAfter(Instant since);

    @Query("SELECT MAX(b.updatedAt) FROM Book b")
    Optional<Instant> findLatestUpdatedAt();

    @Query(value = "SELECT * FROM books WHERE deleted_at IS NOT NULL AND updated_at > :since",
            nativeQuery = true)
    List<Book> findDeletedBooksSince(@Param("since") Instant since);
}
```

`findByUpdatedAtAfterOrderByUpdatedAtAsc` is a Spring Data JPA derived query. Spring parses the method name and generates the SQL automatically. The `Pageable` parameter adds `LIMIT` and `OFFSET` for memory-efficient pagination.

`findDeletedBooksSince` uses a native query because it needs to bypass the `@SQLRestriction("deleted_at IS NULL")` filter to see soft-deleted rows.

## Step 8: Build the service layer

Add this to `service/BookService.java`:

```java

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.typesense.full_text_search.model.Book;
import org.typesense.full_text_search.repository.BookRepository;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Transactional(readOnly = true)
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Page<Book> findAll(int page, int pageSize) {
        return bookRepository.findAll(
                PageRequest.of(page - 1, pageSize, Sort.by("id").ascending()));
    }

    @Transactional(readOnly = true)
    public long count() {
        return bookRepository.count();
    }

    @Transactional
    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Book> findUpdatedSince(Instant since, int page, int pageSize) {
        return bookRepository.findByUpdatedAtAfterOrderByUpdatedAtAsc(
                since, PageRequest.of(page - 1, pageSize));
    }

    @Transactional(readOnly = true)
    public long countUpdatedSince(Instant since) {
        return bookRepository.countByUpdatedAtAfter(since);
    }

    @Transactional(readOnly = true)
    public Optional<Instant> findLatestUpdatedAt() {
        return bookRepository.findLatestUpdatedAt();
    }

    @Transactional(readOnly = true)
    public List<Book> findDeletedSince(Instant since) {
        return bookRepository.findDeletedBooksSince(since);
    }
}
```

The `Sort.by("id").ascending()` in `findAll` is essential for consistent pagination. Without a stable sort order, the database can return rows in a different order between queries, causing records to be silently skipped or duplicated across pages.

`@Transactional(readOnly = true)` on read methods lets Hibernate skip dirty-checking and flushing, improving performance on read-heavy workloads.

## Step 9: Set up automatic collection creation and Typesense sync

Add this to `service/TypesenseService.java`.

This file implements three key responsibilities: Typesense collection management, search, and the sync logic that keeps Typesense in sync with PostgreSQL.

**Paginated incremental sync** - On every run, `syncBooksToTypesense` only fetches records whose `updated_at` timestamp is newer than `lastSyncTime`. For a table with 1 million books where only 50 changed in the last 60 seconds, only those 50 are fetched and sent to Typesense. Records are processed in pages to keep memory usage flat.

**Thread-safe state** - `AtomicReference<Instant>` and `AtomicBoolean` provide lock-free thread safety for sync state shared between the scheduled task and HTTP request threads.

```java
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.typesense.api.Client;
import org.typesense.api.FieldTypes;
import org.typesense.model.CollectionResponse;
import org.typesense.model.CollectionSchema;
import org.typesense.model.DeleteDocumentsParameters;
import org.typesense.model.Field;
import org.typesense.model.ImportDocumentsParameters;
import org.typesense.model.IndexAction;
import org.typesense.model.SearchParameters;
import org.typesense.model.SearchResult;
import org.typesense.full_text_search.model.Book;


@Service
public class TypesenseService {

    private static final Logger log = LoggerFactory.getLogger(TypesenseService.class);

    private final Client client;
    private final BookService bookService;

    @Value("${typesense.collection-name}")
    private String collectionName;

    @Value("${typesense.sync.batch-size}")
    private int batchSize;

    @Value("${typesense.sync.page-size}")
    private int pageSize;

    @Value("${typesense.sync.enable-soft-delete}")
    private boolean enableSoftDelete;

    private final AtomicReference<Instant> lastSyncTime = new AtomicReference<>(Instant.EPOCH);
    private final AtomicBoolean syncWorkerRunning = new AtomicBoolean(false);

    public TypesenseService(Client client, BookService bookService) {
        this.client = client;
        this.bookService = bookService;
    }

    // --- Sync state accessors (thread-safe) ---

    public Instant getLastSyncTime() {
        return lastSyncTime.get();
    }

    public void setLastSyncTime(Instant time) {
        lastSyncTime.set(time);
    }

    public boolean isSyncWorkerRunning() {
        return syncWorkerRunning.get();
    }

    public void setSyncWorkerRunning(boolean running) {
        syncWorkerRunning.set(running);
    }

    // --- Collection management ---

    public void initializeCollection() throws Exception {
        log.info("Initializing Typesense collection '{}'...", collectionName);
        try {
            client.collections(collectionName).retrieve();
            log.info("Collection '{}' already exists, skipping creation", collectionName);
        } catch (Exception e) {
            log.info("Collection '{}' not found, creating...", collectionName);
            CollectionSchema schema = new CollectionSchema();
            schema.name(collectionName)
                    .fields(List.of(
                            new Field().name("title").type(FieldTypes.STRING).facet(false),
                            new Field().name("authors").type(FieldTypes.STRING_ARRAY).facet(true),
                            new Field().name("publication_year").type(FieldTypes.INT32).facet(true),
                            new Field().name("average_rating").type(FieldTypes.FLOAT).facet(true),
                            new Field().name("image_url").type(FieldTypes.STRING).facet(false),
                            new Field().name("ratings_count").type(FieldTypes.INT32).facet(true).sort(true)
                    ))
                    .defaultSortingField("ratings_count");
            client.collections().create(schema);
            log.info("Collection '{}' created successfully", collectionName);
        }
    }

    public long collectionDocumentCount() {
        try {
            CollectionResponse response = client.collections(collectionName).retrieve();
            return response.getNumDocuments() != null ? response.getNumDocuments() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    // --- Search ---

    public SearchResult search(String query) throws Exception {
        SearchParameters params = new SearchParameters()
                .q(query)
                .queryBy("title,authors")
                .queryByWeights("2,1")
                .facetBy("authors,publication_year,average_rating");
        return client.collections(collectionName).documents().search(params);
    }

    // --- Incremental sync ---

    public Instant syncBooksToTypesense(Instant since) throws Exception {
        log.info("Starting incremental sync since {}", since);

        long updatedCount = bookService.countUpdatedSince(since);
        if (updatedCount == 0) {
            log.info("No changes to sync");
            return Instant.now();
        }

        int totalPages = (int) Math.ceil((double) updatedCount / pageSize);
        log.info("Found {} books to sync ({} pages)", updatedCount, totalPages);

        int totalSuccess = 0;
        int totalFailure = 0;

        for (int page = 1; page <= totalPages; page++) {
            Page<Book> books = bookService.findUpdatedSince(since, page, pageSize);
            if (!books.hasContent()) break;

            log.info("Processing page {}/{} ({} books)", page, totalPages, books.getNumberOfElements());

            String jsonl = booksToJsonl(books.getContent());
            ImportDocumentsParameters importParams = new ImportDocumentsParameters();
            importParams.action(IndexAction.UPSERT);

            String response = client.collections(collectionName).documents().import_(jsonl, importParams);
            int[] counts = countImportResults(response);
            totalSuccess += counts[0];
            totalFailure += counts[1];

            log.info("Page {}/{}: {} succeeded, {} failed", page, totalPages, counts[0], counts[1]);
        }

        Instant newSyncTime = Instant.now();
        log.info("Incremental sync completed: {} upserted, {} failed out of {} total",
                totalSuccess, totalFailure, updatedCount);
        return newSyncTime;
    }

    // --- Soft delete sync ---

    public int syncSoftDeletesToTypesense(Instant since) throws Exception {
        List<Book> deletedBooks = bookService.findDeletedSince(since);
        if (deletedBooks.isEmpty()) return 0;

        String idFilter = deletedBooks.stream()
                .map(Book::getTypesenseId)
                .collect(Collectors.joining(","));
        String filterBy = "id:[" + idFilter + "]";

        log.info("Deleting {} documents from Typesense", deletedBooks.size());

        DeleteDocumentsParameters params = new DeleteDocumentsParameters();
        params.filterBy(filterBy);
        client.collections(collectionName).documents().delete(params);

        log.info("Successfully deleted {} documents from Typesense", deletedBooks.size());
        return deletedBooks.size();
    }

    // --- Single document sync (for real-time CRUD operations) ---

    @Async("typesenseAsyncExecutor")
    public void syncBookAsync(Book book) {
        try {
            client.collections(collectionName).documents().upsert(bookToDocument(book));
            setLastSyncTime(Instant.now());
            log.info("Synced book to Typesense: id={}, title={}", book.getId(), book.getTitle());
        } catch (Exception e) {
            log.error("Async Typesense sync failed for book {}: {}", book.getId(), e.getMessage());
        }
    }

    @Async("typesenseAsyncExecutor")
    public void deleteBookAsync(Long bookId) {
        try {
            String documentId = "book_" + bookId;
            client.collections(collectionName).documents(documentId).delete();
            setLastSyncTime(Instant.now());
            log.info("Deleted book from Typesense: id={}", bookId);
        } catch (Exception e) {
            log.error("Async Typesense deletion failed for book {}: {}", bookId, e.getMessage());
        }
    }

    // --- Helpers ---

    private Map<String, Object> bookToDocument(Book book) {
        Map<String, Object> doc = new HashMap<>();
        doc.put("id", book.getTypesenseId());
        doc.put("title", book.getTitle());
        doc.put("authors", book.getAuthors() != null ? book.getAuthors() : List.of());
        doc.put("publication_year", book.getPublicationYear() != null ? book.getPublicationYear() : 0);
        doc.put("average_rating", book.getAverageRating() != null ? book.getAverageRating() : 0.0);
        doc.put("image_url", book.getImageUrl() != null ? book.getImageUrl() : "");
        doc.put("ratings_count", book.getRatingsCount() != null ? book.getRatingsCount() : 0);
        return doc;
    }

    private String booksToJsonl(List<Book> books) {
        return books.stream()
                .map(this::bookToJsonLine)
                .collect(Collectors.joining("\n"));
    }

    private String bookToJsonLine(Book book) {
        String authors = "[]";
        if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
            authors = "[" + book.getAuthors().stream()
                    .map(a -> "\"" + escapeJson(a) + "\"")
                    .collect(Collectors.joining(",")) + "]";
        }
        return "{" +
                "\"id\":\"" + escapeJson(book.getTypesenseId()) + "\"," +
                "\"title\":\"" + escapeJson(book.getTitle() != null ? book.getTitle() : "") + "\"," +
                "\"authors\":" + authors + "," +
                "\"publication_year\":" + (book.getPublicationYear() != null ? book.getPublicationYear() : 0) + "," +
                "\"average_rating\":" + (book.getAverageRating() != null ? book.getAverageRating() : 0.0) + "," +
                "\"image_url\":\"" + escapeJson(book.getImageUrl() != null ? book.getImageUrl() : "") + "\"," +
                "\"ratings_count\":" + (book.getRatingsCount() != null ? book.getRatingsCount() : 0) +
                "}";
    }

    private static String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private int[] countImportResults(String response) {
        int success = 0, failure = 0;
        if (response == null || response.isBlank()) return new int[]{success, failure};
        for (String line : response.split("\n")) {
            if (line.contains("\"success\":true")) {
                success++;
            } else {
                failure++;
                if (failure <= 5) {
                    log.warn("Import error: {}", line);
                }
            }
        }
        return new int[]{success, failure};
    }
}

```

- The `UPSERT` action makes sync idempotent - running it twice on the same data produces the same result with no duplicates.
- `@Async("typesenseAsyncExecutor")` runs the real-time sync methods on a separate thread pool so the HTTP response returns immediately without waiting for the Typesense call.
- `queryByWeights("2,1")` tells Typesense to weight `title` matches twice as heavily as `author` matches. `facetBy` returns aggregated counts per author, year, and rating that your frontend can use to render filter sidebars. See the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">full list of search parameters</RouterLink> for more options.

## Step 10: Configure the async thread pool

Add this to `config/AsyncConfig.java`:

```java

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

    @Bean(name = "typesenseAsyncExecutor")
    public Executor typesenseAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("typesense-async-");
        executor.initialize();
        return executor;
    }
}
```

This creates a dedicated thread pool for Typesense async operations. `corePoolSize=2` means two threads are always ready, `maxPoolSize=4` allows burst capacity, and `queueCapacity=100` buffers requests when all threads are busy.

## Step 11: Add the scheduled sync worker

Add this to `scheduler/TypesenseSyncScheduler.java`.

Think of `TypesenseSyncScheduler` as a background job that wakes up every 60 seconds, syncs any changed books to Typesense, then goes back to sleep. Spring's `@Scheduled` annotation handles the timing, no manual thread management needed.

On startup, the scheduler checks whether Typesense already has data before deciding how to sync:

- **Typesense is empty** (first run or fresh instance): runs a full sync from epoch, all records from PostgreSQL are pushed to Typesense.
- **Typesense already has data** (server restart): seeds `lastSyncTime` from `MAX(updated_at)` of the PostgreSQL table, then runs an incremental sync for only records changed since that timestamp. This avoids re-syncing thousands of already-indexed records on every restart.

```java

import java.time.Instant;
import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.typesense.full_text_search.service.BookService;
import org.typesense.full_text_search.service.TypesenseService;

@Component
public class TypesenseSyncScheduler {

    private static final Logger log = LoggerFactory.getLogger(TypesenseSyncScheduler.class);

    private final TypesenseService typesenseService;
    private final BookService bookService;
    private final AtomicBoolean initialSyncDone = new AtomicBoolean(false);

    public TypesenseSyncScheduler(TypesenseService typesenseService, BookService bookService) {
        this.typesenseService = typesenseService;
        this.bookService = bookService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            typesenseService.initializeCollection();
        } catch (Exception e) {
            log.error("Failed to initialize Typesense collection: {}", e.getMessage());
            return;
        }

        typesenseService.setSyncWorkerRunning(true);

        try {
            long docCount = typesenseService.collectionDocumentCount();
            if (docCount > 0) {
                bookService.findLatestUpdatedAt().ifPresent(latest -> {
                    typesenseService.setLastSyncTime(latest);
                    log.info("Typesense already populated, seeding sync time from DB: {}", latest);
                });
            } else {
                log.info("Typesense collection is empty, will run full sync");
            }

            Instant lastSyncTime = typesenseService.getLastSyncTime();
            Instant newSyncTime = typesenseService.syncBooksToTypesense(lastSyncTime);
            typesenseService.setLastSyncTime(newSyncTime);
            log.info("Initial sync completed at {}", newSyncTime);
        } catch (Exception e) {
            log.error("Initial sync failed: {}", e.getMessage());
        }

        initialSyncDone.set(true);
    }

    @Scheduled(fixedDelayString = "${typesense.sync.interval-ms}")
    public void periodicSync() {
        if (!initialSyncDone.get()) return;

        log.info("Running periodic sync...");
        Instant lastSyncTime = typesenseService.getLastSyncTime();

        try {
            Instant newSyncTime = typesenseService.syncBooksToTypesense(lastSyncTime);
            typesenseService.setLastSyncTime(newSyncTime);
        } catch (Exception e) {
            log.error("Periodic sync failed: {}", e.getMessage());
        }

        try {
            typesenseService.syncSoftDeletesToTypesense(lastSyncTime);
        } catch (Exception e) {
            log.error("Soft delete sync failed: {}", e.getMessage());
        }
    }
}
```

The error handling on the periodic sync is intentional: **only update `lastSyncTime` on success**. If a sync run fails partway through (e.g. Typesense is temporarily down), keeping the old timestamp means the next run retries all records from the same checkpoint. Updating it on failure would silently skip those records.

`@EventListener(ApplicationReadyEvent.class)` runs the initial sync after the entire Spring context is initialized. This guarantees the database connection, JPA repositories, and Typesense client are all ready.

The `initialSyncDone` guard prevents `@Scheduled` from firing before the initial sync completes. Without it, the periodic sync could start during startup and race with the initial sync.

## Step 12: Build the CRUD API with real-time sync

Add this to `controller/BookController.java`. Each write syncs to Typesense **asynchronously** via `@Async` so the HTTP response returns immediately:

```java

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.typesense.full_text_search.model.Book;
import org.typesense.full_text_search.service.BookService;
import org.typesense.full_text_search.service.TypesenseService;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final TypesenseService typesenseService;

    public BookController(BookService bookService, TypesenseService typesenseService) {
        this.bookService = bookService;
        this.typesenseService = typesenseService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBook(@RequestBody Book book) {
        Book saved = bookService.save(book);
        typesenseService.syncBookAsync(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Book created successfully",
                "book", saved
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBook(@PathVariable Long id) {
        return bookService.findById(id)
                .map(book -> ResponseEntity.ok(Map.<String, Object>of("book", book)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Book not found")));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBooks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(name = "page_size", defaultValue = "100") int pageSize) {

        Page<Book> books = bookService.findAll(page, pageSize);
        return ResponseEntity.ok(Map.of(
                "count", books.getNumberOfElements(),
                "total", books.getTotalElements(),
                "page", page,
                "page_size", pageSize,
                "books", books.getContent()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBook(@PathVariable Long id, @RequestBody Book updates) {
        return bookService.findById(id)
                .map(existing -> {
                    if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
                    if (updates.getAuthors() != null) existing.setAuthors(updates.getAuthors());
                    if (updates.getPublicationYear() != null) existing.setPublicationYear(updates.getPublicationYear());
                    if (updates.getAverageRating() != null) existing.setAverageRating(updates.getAverageRating());
                    if (updates.getImageUrl() != null) existing.setImageUrl(updates.getImageUrl());
                    if (updates.getRatingsCount() != null) existing.setRatingsCount(updates.getRatingsCount());

                    Book saved = bookService.save(existing);
                    typesenseService.syncBookAsync(saved);
                    return ResponseEntity.ok(Map.<String, Object>of(
                            "message", "Book updated successfully",
                            "book", saved
                    ));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Book not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable Long id) {
        return bookService.findById(id)
                .map(book -> {
                    bookService.deleteById(id);
                    typesenseService.deleteBookAsync(id);
                    return ResponseEntity.ok(Map.<String, Object>of("message", "Book deleted successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Book not found")));
    }
}
```

The update handler uses partial updates, i.e., only non-null fields from the request body are applied to the existing entity. This lets clients send `{"title": "New Title"}` without overwriting all other fields with null.

## Step 13: Build the search and sync routes

Add this to `controller/SearchController.java`:

```java

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.typesense.full_text_search.service.TypesenseService;
import org.typesense.model.SearchResult;

@RestController
public class SearchController {

    private final TypesenseService typesenseService;

    public SearchController(TypesenseService typesenseService) {
        this.typesenseService = typesenseService;
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam("q") String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Search query parameter 'q' is required"));
        }

        try {
            SearchResult result = typesenseService.search(query);
            return ResponseEntity.ok(Map.of(
                    "query", query,
                    "results", result.getHits() != null ? result.getHits() : java.util.List.of(),
                    "found", result.getFound() != null ? result.getFound() : 0,
                    "took", result.getSearchTimeMs() != null ? result.getSearchTimeMs() : 0,
                    "facet_counts", result.getFacetCounts() != null ? result.getFacetCounts() : java.util.List.of()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Search failed: " + e.getMessage()
            ));
        }
    }
}
```

And `controller/SyncController.java`:

```java

import java.time.Instant;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.typesense.full_text_search.service.TypesenseService;

@RestController
@RequestMapping("/sync")
public class SyncController {

    private final TypesenseService typesenseService;

    public SyncController(TypesenseService typesenseService) {
        this.typesenseService = typesenseService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> triggerSync() {
        Instant lastSyncTime = typesenseService.getLastSyncTime();

        try {
            Instant newSyncTime = typesenseService.syncBooksToTypesense(lastSyncTime);
            int deletedCount = typesenseService.syncSoftDeletesToTypesense(lastSyncTime);
            typesenseService.setLastSyncTime(newSyncTime);

            return ResponseEntity.ok(Map.of(
                    "message", "Sync completed",
                    "newSyncTime", newSyncTime.toString(),
                    "syncedAt", Instant.now().toString(),
                    "deletedBooks", deletedCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Sync failed",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSyncStatus() {
        return ResponseEntity.ok(Map.of(
                "lastSyncTime", typesenseService.getLastSyncTime().toString(),
                "syncWorkerRunning", typesenseService.isSyncWorkerRunning()
        ));
    }
}
```

The Typesense API key never appears in the response, it stays safely on the server.

## Step 14: Wire everything together

Add this to `FullTextSearchApplication.java`:

```java

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.typesense.full_text_search.config.DatabaseInitializer;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class FullTextSearchApplication {

    public static void main(String[] args) {
        // Load .env variables into System properties
        Dotenv.configure()
                .ignoreIfMissing()
                .systemProperties()
                .load();

        DatabaseInitializer.ensureDatabaseExists();
        SpringApplication.run(FullTextSearchApplication.class, args);
    }
}
```

- `@EnableScheduling` activates Spring's task scheduling infrastructure so that `@Scheduled` methods are executed.
- `@EnableAsync` enables Spring's async method execution so that `@Async` methods run on the configured thread pool.
- `DatabaseInitializer.ensureDatabaseExists()` runs **before** Spring starts. It connects to the default `postgres` database and creates `typesense_books` if it doesn't exist. This is necessary because HikariCP will fail immediately if the target database is missing.

## Step 15: Run your server

```bash
./mvnw spring-boot:run
```

Expected startup output:

```plaintext
Database 'typesense_books' created successfully

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.0.5)

Initializing Typesense collection 'books'...
Collection 'books' not found, creating...
Collection 'books' created successfully
Typesense collection is empty, will run full sync
Starting incremental sync since 1970-01-01T00:00:00Z
No changes to sync
Initial sync completed at 2026-04-22T04:00:00Z
Started FullTextSearchApplication in 2.5 seconds
```

## Testing the API

**Search** - Typesense handles typos automatically:

```bash
curl "http://localhost:4000/search?q=harry+potter"
curl "http://localhost:4000/search?q=tolkein"   # typo - still finds Tolkien
```

**Create a book** - syncs to Typesense in the background:

```bash
curl -X POST http://localhost:4000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language",
    "authors": ["Alan Donovan", "Brian Kernighan"],
    "publicationYear": 2015,
    "averageRating": 4.7,
    "imageUrl": "https://example.com/gobook.jpg",
    "ratingsCount": 8500
  }'
```

**Trigger a manual sync** (useful after bulk database changes):

```bash
curl -X POST http://localhost:4000/sync
```

Response:

```json
{
  "message": "Sync completed",
  "newSyncTime": "2026-04-22T06:00:00Z",
  "deletedBooks": 0
}
```

**Check sync worker status:**

```bash
curl http://localhost:4000/sync/status
```

Response:

```json
{
  "lastSyncTime": "2026-04-22T06:00:00Z",
  "syncWorkerRunning": true
}
```

**Example paginated sync log** (10,000 records, 10 pages of 1,000):

```plaintext
Found 10000 books to sync (10 pages)
Processing page 1/10 (1000 books)
Page 1/10: 1000 succeeded, 0 failed
...
Processing page 10/10 (1000 books)
Page 10/10: 1000 succeeded, 0 failed
Incremental sync completed: 10000 upserted, 0 failed out of 10000 total
```

## How the sync strategies work together

The three sync strategies complement each other:

| Strategy | When | Latency | Use case |
| --- | --- | --- | --- |
| Real-time (`@Async`) | On each CRUD write | < 100ms | Individual creates, updates, deletes |
| Periodic (`@Scheduled`) | Every 60 seconds | Up to 60s | Catch-up for any missed real-time syncs |
| Manual (`POST /sync`) | On demand | Depends on volume | After bulk DB imports, after outages |

The periodic sync is the safety net. Even if the real-time async call fails (e.g. Network Issues), the periodic sync picks up all changed records by comparing `updated_at` against `lastSyncTime`.

## Production Considerations

### Restrict CORS origins

```java
registry.addMapping("/**")
        .allowedOrigins("https://yourdomain.com");
```

### Add Spring Security

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### Use production Typesense

```properties
typesense.host=xxx.typesense.net
typesense.port=443
typesense.protocol=https
typesense.api-key=your-production-key
```

### Run with a production profile

```bash
java -jar target/full-text-search-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Source Code

The complete source code for this project is available on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-springboot-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-springboot-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
