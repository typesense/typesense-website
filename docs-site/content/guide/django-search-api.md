---
description: "Build a Django REST API backed by PostgreSQL as source of truth, kept in sync with Typesense for fast typo-tolerant search served via a proxy endpoint."
---

# Building a Search API with Django and Typesense

This guide walks you through building a RESTful search API using Django, PostgreSQL, and Typesense. You'll build a backend server that stores data in PostgreSQL as the source of truth, keeps Typesense in sync for fast search, and exposes a clean search API to your frontend clients.

By the end of this guide, you'll have:

- A full CRUD API for a sample books dataset, backed by PostgreSQL
- Automatic database-to-Typesense sync (both real-time and periodic)
- Paginated sync that safely handles millions of records without memory issues
- A background worker thread running alongside your Django application
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
┌─────────────┐     CRUD      ┌─────────────┐
│   Frontend  │ ────────────▶ │ Django API  │
│             │ ◀──────────── │ (Python)    │
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

**PostgreSQL** is the source of truth. All writes go there first. **Typesense** is the search index, kept in sync automatically via a background thread that runs every 60 seconds. This pattern gives you durable relational storage alongside sub-millisecond full-text search.

## Prerequisites

Please ensure you have the following installed:

- Python 3.10+
- [Docker](https://docs.docker.com/get-docker/) (for running Typesense and PostgreSQL)
- Basic knowledge of Python and Django

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

## Step 2: Initialize your Django project

Create the project and install dependencies:

```bash
mkdir typesense-django-full-text-search
cd typesense-django-full-text-search
python -m venv .venv
source .venv/bin/activate
pip install django typesense psycopg2-binary python-dotenv apscheduler

django-admin startproject typesensedjango .
python manage.py startapp books
```

What each dependency does:

- **django** - The web framework for building the REST APIs
- **typesense** - Official Python client for Typesense
- **psycopg2-binary** - PostgreSQL database adapter for Python
- **python-dotenv** - Loads environment variables from a `.env` file
- **apscheduler** - In-process task scheduler to run the background sync thread

## Step 3: Create the project structure

```bash
mkdir -p books/search
touch books/search/__init__.py books/search/client.py books/search/collections.py 
touch books/search/sync.py books/search/worker.py
touch .env
```

Your project should look like this:

```plaintext
typesense-django-full-text-search/
├── books/
│   ├── search/
│   │   ├── __init__.py      # Exports search utilities
│   │   ├── client.py        # Typesense client initialization
│   │   ├── collections.py   # Typesense collection management
│   │   ├── sync.py          # DB → Typesense sync logic and state
│   │   └── worker.py        # Background periodic sync thread
│   ├── apps.py              # Starts the background sync on load
│   ├── models.py            # Django models with soft-delete support
│   ├── urls.py              # App URLs
│   └── views.py             # CRUD & Search API handlers
├── typesensedjango/
│   ├── settings.py          # Django configuration
│   └── urls.py              # Root URLs
├── .env
└── manage.py
```

## Step 4: Set up environment configuration

Add this to `.env`:

```bash
# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=typesense_books
```

In `typesensedjango/settings.py`, register the `books` app and configure the database:

```python
import os
from dotenv import load_dotenv

load_dotenv()

# Add 'books' to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'books', # Register the books app
]

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'typesense_books'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'password'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

## Step 5: Initialize the Typesense client

Add this to `books/search/client.py`:

```python
import os
import typesense
from dotenv import load_dotenv

load_dotenv()

typesense_client = typesense.Client({
    'nodes': [{
        'host': os.environ.get('TYPESENSE_HOST', 'localhost'),
        'port': os.environ.get('TYPESENSE_PORT', '8108'),
        'protocol': os.environ.get('TYPESENSE_PROTOCOL', 'http')
    }],
    'api_key': os.environ.get('TYPESENSE_API_KEY', 'xyz'),
    'connection_timeout_seconds': 5
})
```

## Step 6: Define the Book model

Add this to `books/models.py`:

```python
from django.db import models
from django.utils import timezone

class ActiveBookManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class TolerantJSONField(models.JSONField):
    def from_db_value(self, value, expression, connection):
        if isinstance(value, (list, dict)):
            return value
        return super().from_db_value(value, expression, connection)

class Book(models.Model):
    title = models.CharField(max_length=255)
    authors = TolerantJSONField(default=list)
    publication_year = models.IntegerField(null=True, blank=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    image_url = models.CharField(max_length=255, null=True, blank=True)
    ratings_count = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Use ActiveBookManager by default to hide soft-deleted records
    objects = ActiveBookManager()
    # Provide access to all objects, including soft-deleted ones
    all_objects = models.Manager()

    class Meta:
        db_table = 'books'
        ordering = ['id']

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return self.title
```

Key design choices:

- **`TolerantJSONField`** parses JSON arrays for the `authors` list safely, mapping nicely to Typesense's `string[]` field.
- **`deleted_at` & `ActiveBookManager`** provides a soft delete pattern. Fetching `Book.objects.all()` hides deleted rows, while the incremental sync can still query `Book.all_objects.filter(...)` to remove deleted documents from Typesense.
- **`updated_at`** is automatically stamped by Django. The incremental sync relies on this field to detect changes.

## Step 7: Set up automatic collection creation

Add this to `books/search/collections.py`:

```python
from .client import typesense_client

BOOKS_COLLECTION_NAME = 'books'

books_collection_schema = {
    'name': BOOKS_COLLECTION_NAME,
    'fields': [
        {'name': 'id', 'type': 'string'},
        {'name': 'title', 'type': 'string'},
        {'name': 'authors', 'type': 'string[]', 'facet': True},
        {'name': 'publication_year', 'type': 'int32', 'facet': True, 'optional': True},
        {'name': 'average_rating', 'type': 'float', 'facet': True, 'optional': True},
        {'name': 'image_url', 'type': 'string', 'optional': True},
        {'name': 'ratings_count', 'type': 'int32', 'optional': True},
    ]
}

def initialize_typesense():
    try:
        collections = typesense_client.collections.retrieve()
        collection_exists = any(c['name'] == BOOKS_COLLECTION_NAME for c in collections)

        if not collection_exists:
            print(f"Creating collection {BOOKS_COLLECTION_NAME}...")
            typesense_client.collections.create(books_collection_schema)
            print(f"Collection {BOOKS_COLLECTION_NAME} created successfully.")
        else:
            print(f"Collection {BOOKS_COLLECTION_NAME} already exists.")
    except Exception as e:
        print(f"Error initializing Typesense collection: {e}")
```

Fields marked `facet: True` can be used for filtering and aggregation in search results.

## Step 8: Implement paginated sync from PostgreSQL to Typesense

Add this to `books/search/sync.py`.

This file implements two sync patterns:
**Paginated full sync** (`run_full_sync`) runs on a fresh database by fetching 1,000 rows at a time, to avoid memory issues with huge tables.
**Incremental sync** (`run_incremental_sync`) only queries records where `updated_at > last_sync_time` so it only indexes recent changes. 

```python
import datetime
from django.utils import timezone
from .client import typesense_client
from .collections import BOOKS_COLLECTION_NAME

# Global state to keep track of last sync time
last_sync_time = datetime.datetime(1970, 1, 1, tzinfo=datetime.timezone.utc)

BATCH_SIZE = 1000

def _map_book_to_document(book):
    return {
        'id': str(book.id),
        'title': book.title,
        'authors': book.authors if isinstance(book.authors, list) else [book.authors],
        'publication_year': book.publication_year or 0,
        'average_rating': float(book.average_rating) if book.average_rating else 0.0,
        'image_url': book.image_url or '',
        'ratings_count': book.ratings_count or 0,
    }

def run_full_sync():
    global last_sync_time
    print('Running full sync...')
    from books.models import Book
    
    last_id = 0
    has_more = True
    total_processed = 0

    while has_more:
        try:
            # Only fetch active records (ActiveBookManager)
            books = list(Book.objects.filter(id__gt=last_id).order_by('id')[:BATCH_SIZE])
        except Exception as err:
            print(f'Database error during full sync fetching: {err}')
            break

        if not books:
            has_more = False
            break

        last_id = books[-1].id
        documents = [_map_book_to_document(b) for b in books]

        try:
            typesense_client.collections[BOOKS_COLLECTION_NAME].documents.import_(documents, {'action': 'upsert'})
            total_processed += len(documents)
            print(f'Full sync: Processed {total_processed} books.')
        except Exception as err:
            print(f'Error importing documents during full sync: {err}')
            break

    last_sync_time = timezone.now()
    print('Full sync completed.')

def run_incremental_sync():
    global last_sync_time
    
    # Capture the start time before we begin fetching records to prevent missing
    # any concurrent writes that happen while the sync is running.
    sync_started_at = timezone.now()
    
    print(f'Running incremental sync since {last_sync_time.isoformat()}...')
    from books.models import Book
    
    # 1. Find newly created or updated books (only active ones)
    updated_books = Book.objects.filter(updated_at__gt=last_sync_time)

    if updated_books.exists():
        documents = [_map_book_to_document(b) for b in updated_books]
        try:
            typesense_client.collections[BOOKS_COLLECTION_NAME].documents.import_(documents, {'action': 'upsert'})
            print(f'Incremental sync: Upserted {len(documents)} books.')
        except Exception as err:
            print(f'Error upserting documents in incremental sync: {err}')

    # 2. Find soft-deleted books
    deleted_books = Book.all_objects.filter(deleted_at__gt=last_sync_time)

    if deleted_books.exists():
        for book in deleted_books:
            try:
                typesense_client.collections[BOOKS_COLLECTION_NAME].documents[str(book.id)].delete()
                print(f'Incremental sync: Deleted book {book.id} from Typesense.')
            except Exception as err:
                if not (hasattr(err, 'status_code') and err.status_code == 404):
                    print(f'Error deleting book {book.id} from Typesense: {err}')

    last_sync_time = sync_started_at
    print('Incremental sync completed.')

def determine_and_run_startup_sync():
    global last_sync_time
    from books.models import Book
    
    try:
        search_stats = typesense_client.collections[BOOKS_COLLECTION_NAME].retrieve()
        doc_count = search_stats.get('num_documents', 0)

        if doc_count == 0:
            # Empty Typesense collection, full sync
            run_full_sync()
        else:
            # Typesense has data, get latest updated_at from DB
            latest_book = Book.all_objects.order_by('-updated_at').first()

            if latest_book and latest_book.updated_at:
                last_sync_time = latest_book.updated_at
            
            run_incremental_sync()
    except Exception as error:
        print(f'Error during startup sync: {error}')
```

## Step 9: Add the background sync worker

Add this to `books/search/worker.py`. This uses `apscheduler` to run a thread alongside your Django app:

```python
from apscheduler.schedulers.background import BackgroundScheduler
from .sync import run_incremental_sync

_is_sync_running = False
_scheduler = None

def _sync_job():
    global _is_sync_running
    if _is_sync_running:
        print('Sync already running, skipping this iteration.')
        return
        
    _is_sync_running = True
    try:
        run_incremental_sync()
    except Exception as error:
        print(f'Error in background sync worker: {error}')
    finally:
        _is_sync_running = False

def start_background_sync_worker():
    global _scheduler
    if _scheduler is not None:
        return
        
    print('Starting background periodic sync worker (every 60s)...')
    _scheduler = BackgroundScheduler()
    _scheduler.add_job(_sync_job, 'interval', seconds=60)
    _scheduler.start()

def get_sync_status():
    return {
        'syncWorkerRunning': _scheduler is not None and _scheduler.running,
        'syncJobActive': _is_sync_running
    }
```

To wire this up cleanly when Django boots, define the `books/search/__init__.py`:

```python
from .client import typesense_client
from .collections import BOOKS_COLLECTION_NAME, initialize_typesense
from .sync import run_full_sync, run_incremental_sync, determine_and_run_startup_sync
from .worker import start_background_sync_worker, get_sync_status
```

Then tie it all together in `books/apps.py`. This runs the initial sync in a thread when Django starts up so you don't block the `manage.py runserver` process:

```python
import sys
from django.apps import AppConfig

class BooksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'books'

    def ready(self):
        # Avoid running during management commands (like migrate, makemigrations)
        if 'manage.py' in sys.argv and 'runserver' not in sys.argv:
            return
        
        from .search import (
            initialize_typesense,
            determine_and_run_startup_sync,
            start_background_sync_worker
        )
        import threading

        def _startup_sequence():
            try:
                print('Initializing Typesense...')
                initialize_typesense()
                print('Running startup sync...')
                # We wrap the startup sync in a try/except specifically so that if you run 
                # `manage.py runserver` before `manage.py migrate` on a fresh database, 
                # the missing table error won't prevent the background worker from starting.
                try:
                    determine_and_run_startup_sync()
                except Exception as sync_err:
                    print(f"Startup sync skipped (database might not be migrated yet): {sync_err}")
                
                start_background_sync_worker()
            except Exception as e:
                print(f"Failed to start background sync worker: {e}")

        # Ensure it runs only once per worker
        import os
        if os.environ.get('RUN_MAIN') == 'true' or not sys.argv[0].endswith('manage.py'):
            thread = threading.Thread(target=_startup_sequence, daemon=True)
            thread.start()
```

## Step 10: Build the API Views

Add the HTTP handlers to `books/views.py`. These views manage CRUD operations on Postgres and provide a real-time sync function to immediately insert single records to Typesense right after they hit the database, meaning results are immediately searchable without waiting for the background thread's 60-second cycle.

```python
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Book
from .search import typesense_client, BOOKS_COLLECTION_NAME, run_full_sync, get_sync_status

def sync_book_to_typesense(book):
    try:
        document = {
            'id': str(book.id),
            'title': book.title,
            'authors': book.authors if isinstance(book.authors, list) else [book.authors],
            'publication_year': book.publication_year or 0,
            'average_rating': float(book.average_rating) if book.average_rating else 0.0,
            'image_url': book.image_url or '',
            'ratings_count': book.ratings_count or 0,
        }
        typesense_client.collections[BOOKS_COLLECTION_NAME].documents.upsert(document)
    except Exception as err:
        pass

def delete_book_from_typesense(book_id):
    try:
        typesense_client.collections[BOOKS_COLLECTION_NAME].documents[str(book_id)].delete()
    except Exception as err:
        pass

@csrf_exempt
@require_http_methods(["GET", "POST"])
def books_list_create(request):
    if request.method == 'GET':
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        offset = (page - 1) * limit
        
        queryset = Book.objects.all().order_by('id')
        total = queryset.count()
        books = list(queryset[offset:offset+limit].values())
        
        return JsonResponse({
            'total': total,
            'page': page,
            'limit': limit,
            'data': books
        })
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            book = Book.objects.create(**data)
            sync_book_to_typesense(book)
            return JsonResponse({'id': book.id, 'title': book.title}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def books_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return JsonResponse({'error': 'Book not found'}, status=404)
        
    if request.method == 'GET':
        return JsonResponse({'id': book.id, 'title': book.title})
        
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            for key, value in data.items():
                if hasattr(book, key):
                    setattr(book, key, value)
            book.save()
            sync_book_to_typesense(book)
            return JsonResponse({'id': book.id, 'title': book.title})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    elif request.method == 'DELETE':
        try:
            book_id = book.id
            book.delete() 
            delete_book_from_typesense(book_id)
            return JsonResponse({}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def search(request):
    query = request.GET.get('q', '')
    try:
        search_results = typesense_client.collections[BOOKS_COLLECTION_NAME].documents.search({
            'q': query,
            'query_by': 'title,authors',
        })
        return JsonResponse({
            'query': query,
            'found': search_results.get('found', 0),
            'results': search_results.get('hits', []),
            'facet_counts': search_results.get('facet_counts', []),
        })
    except Exception as error:
        return JsonResponse({'error': str(error)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def manual_sync(request):
    try:
        run_full_sync()
        import books.search.sync as sync_module
        return JsonResponse({
            'message': 'Sync completed',
            'syncedAt': sync_module.last_sync_time.isoformat()
        })
    except Exception as error:
        return JsonResponse({'error': str(error)}, status=500)

@require_http_methods(["GET"])
def sync_status(request):
    import books.search.sync as sync_module
    status = get_sync_status()
    return JsonResponse({
        'lastSyncTime': sync_module.last_sync_time.isoformat(),
        'syncWorkerRunning': status['syncWorkerRunning'],
        'syncJobActive': status['syncJobActive']
    })
```

Map these views in `books/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('books', views.books_list_create),
    path('books/<int:pk>', views.books_detail),
    path('search', views.search),
    path('sync', views.manual_sync),
    path('sync/status', views.sync_status),
]
```

And in `typesensedjango/urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    path('', include('books.urls')),
]
```

## Step 11: Run your server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```

Expected startup output:

```plaintext
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
Initializing Typesense...
Collection books already exists.
Running startup sync...
Running incremental sync since 2026-07-20T00:00:00+00:00...
Incremental sync completed.
Starting background periodic sync worker (every 60s)...
```

## Testing the API

**Search** - Typesense handles typos automatically:

```bash
curl "http://localhost:8000/search?q=harry+potter"
curl "http://localhost:8000/search?q=tolkein"   # typo - still finds Tolkien
```

**Create a book** - syncs to Typesense in the background:

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Django Book",
    "authors": ["Adrian Holovaty", "Jacob Kaplan-Moss"],
    "publication_year": 2007,
    "average_rating": 4.5,
    "image_url": "https://example.com/djangobook.jpg",
    "ratings_count": 5500
  }'
```

**Trigger a manual sync** (useful after bulk database changes):

```bash
curl -X POST http://localhost:8000/sync
```

Response:

```json
{
  "message": "Sync completed",
  "syncedAt": "2026-07-20T11:30:39+05:30"
}
```

**Check sync worker status:**

```bash
curl http://localhost:8000/sync/status
```

Response:

```json
{
  "lastSyncTime": "2026-07-20T11:30:39+05:30",
  "syncWorkerRunning": true,
  "syncJobActive": false
}
```

## How the sync strategies work together

The three sync strategies complement each other:

| Strategy | When | Latency | Use case |
| --- | --- | --- | --- |
| Real-time (view handler) | On each CRUD write | < 100ms | Individual creates, updates, deletes |
| Periodic (worker) | Every 60 seconds | Up to 60s | Catch-up for any missed real-time syncs |
| Manual (`POST /sync`) | On demand | Depends on volume | After bulk DB imports, after outages |

The periodic sync is the safety net. Even if the real-time sync fails (e.g. Typesense was briefly down), the periodic sync picks up all changed records by comparing `updated_at` against `last_sync_time`.

## Production Considerations

### Restrict CORS origins

Use `django-cors-headers` to restrict allowed origins instead of allowing `*`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
]
```

### Add authentication

Protect your CRUD endpoints using Django REST Framework permissions or basic Django auth:

```python
from django.contrib.auth.decorators import login_required
```

### Use production Typesense

Update your `.env` for production:

```bash
TYPESENSE_HOST=xxx.typesense.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your-production-key
```

### Run Django in production mode

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
```

### Background Task Queue (Celery / Huey)

The in-process `apscheduler` shown in this guide is great for a single-server deployment. However, if you deploy Django in a multi-process WSGI environment (like `gunicorn -w 4`), every worker process will spawn its own background thread! To prevent race conditions and redundant syncs in large-scale production environments, replace `apscheduler` with a dedicated task queue like **Celery**, **Django-Q**, or **Huey** to ensure the periodic sync job runs exactly once on a dedicated worker machine.

## Source Code

The complete source code for this project is available on GitHub:

[https://github.com/typesense/code-samples/tree/master/typesense-django-full-text-search](https://github.com/typesense/code-samples/tree/master/typesense-django-full-text-search)

## Need Help?

Read our [Help](/help.md) section for information on how to get additional help, or join our [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to chat with other developers.
