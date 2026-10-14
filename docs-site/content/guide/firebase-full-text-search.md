---
title: "Firebase Full-Text Search with Typesense"
description: "Add full-text search to a Firebase / Firestore app by syncing documents into Typesense using the official Typesense function kit."
---

# Full-text Search for Firebase with Typesense

[Firebase](https://firebase.google.com/) is a popular app development platform backed by Google and used by developers across the globe. 
It gives you a variety of tools to build, release and monitor your applications. However, there is no native indexing or search solution with Firebase.

The Firebase [documentation](https://firebase.google.com/docs/firestore/solutions/search) talks about using services like Algolia and Elasticsearch and more recently Typesense for full-text search. 
Algolia is a good solution, but it is proprietary and can be expensive for even moderate scale.
Elasticsearch is a versatile search solution, but it has a steep learning curve and running Elasticsearch in production requires a non-trivial amount of devops knowledge, even with Elastic Cloud.

**Enter Typesense** - Typesense is an [open-source](https://github.com/typesense/typesense) typo-tolerant fuzzy search engine that is easy to use, run and scale, with clean APIs and documentation. 
Think of it as an open source alternative to Algolia and an easier-to-use, batteries-included alternative to ElasticSearch. 
Typesense is blazing fast and highly configurable, so you can tailor results according to your needs. You can learn more about Typesense features [here](https://github.com/typesense/typesense#features).

You can either self-host Typesense or use the managed SaaS service [Typesense Cloud](https://cloud.typesense.org).

:::tip UPDATE

Firebase Extensions shut down on March 31, 2027. Because of it, Typesense Firebase Extension is now a function kit. 

If you have the extension installed, see [Migrating from the Firebase Extension](#migrating-from-the-firebase-extension).
:::

In this walk-through, we are going to show you how to integrate Typesense with Firebase, to build a full-text search experience for your Firebase app.

We'll assume that you're already familiar with Firebase, Firestore and how these tools work. To get started, let's take a sample app that stores book titles and their publication year.

```javascript
// books/${bookID}
{
    id: string,
    title: string,
    publication_year: int32
}
```

## Step 1: Run Typesense

The easiest way to run Typesense is using [Typesense cloud](https://cloud.typesense.org), which is the hosted version of Typesense:

1. Visit [https://cloud.typesense.org](https://cloud.typesense.org) and Login with GitHub.
2. Select the configuration you need or leave the defaults as is and click on "Launch"
3. Your cluster should be fully provisioned and running in about 5 minutes. Then click on "Generate API Key".

We'll now use the hostname and API keys you generate for the rest of the tutorial. 

You can also run Typesense locally or on a server on GCP, if you choose to self-host. 
[Here](./install-typesense.md#option-2-local-machine-self-hosting) are instructions on how to 
install Typesense on any cloud server.

## Step 2: Create a Typesense Collection

To use Typesense, we first need to create a client. Typesense supports [multiple API clients](../latest/api/api-clients.md) including Javascript, Python, Ruby, PHP etc. 

To initialize the Javascript client, you need the API key of the Typesense server you generated in Step 1:

```javascript
import Typesense from 'typesense'

let client = new Typesense.Client({
  'nodes': [{
    'host': 'xxx.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
    'port': '443',
    'protocol': 'https'
  }],
  'apiKey': '<ADMIN_API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

Next, we'll create a collection. A collection is a group of related documents, you can think of it as a table in relational databases. A collection needs a schema, that represents how a document would look like. 

```javascript
const myCollection = {
  'name': 'books',
  'fields': [
    {'name': 'id', 'type': 'string'},
    {'name': 'title', 'type': 'string' },
    {'name': 'publication_year', 'type': 'int32' },
  ],
  'default_sorting_field': 'publication_year'
}

client.collections().create(myCollection)
```

We created a collection called `books` and the documents stored in the `books` collection will have three fields - `id`, `title` and `publication_year`.

`id` is an interesting field here as Typesense uses it as an identifier for the document. If there is no `id` field, Typesense automatically assigns an identifier to the document. Note that the `id` should not include spaces or any other characters that require [encoding in urls](https://www.w3schools.com/tags/ref_urlencode.asp). 

For this tutorial, we will use the Firestore ID of the document as the `id` value.

## Step 3: Install the function kit

The [Typesense function kit](https://github.com/typesense/firestore-typesense-search) deploys Cloud Functions into your Firebase project that sync Firestore documents into Typesense on creation, updates and deletes. 
It also provides a function to backfill existing data.

Before installing it, make sure that:

- Your Firebase project is on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing).
- You have firebase-tools 15.32.0 or later (`npm install -g firebase-tools@latest`).
- You've created the Typesense collection from Step 2. The kit doesn't create it for you.
- Typesense is reachable over HTTPS on port 443. Typesense Cloud is already set up for this.

From your Firebase project directory, install the kit. The CLI prompts for each configuration parameter and writes them to the kit's `.env` file:

```shell
firebase functions:kits:install --package typesense-firestore-search --project <project-id>
```

For the `books` collection, the configuration looks like this:

```ini
LOCATION=us-central1
FIRESTORE_DATABASE_REGION=nam5
DATABASE=(default)
FIRESTORE_COLLECTION_PATHS=books
TYPESENSE_COLLECTION_NAMES=books
FIRESTORE_COLLECTION_FIELDS_LIST=title,publication_year
FLATTEN_NESTED_DOCUMENTS_LIST=false
TYPESENSE_HOSTS=xxx.a1.typesense.net
LOG_TYPESENSE_INSERTS=false
```

Then deploy it:

```shell
firebase deploy --only functions:<kit-instance-id> --project <project-id>
```

### Syncing multiple collections

One install can sync several Firestore collections, each into its own Typesense collection. 
List them in the same order in `FIRESTORE_COLLECTION_PATHS` and `TYPESENSE_COLLECTION_NAMES`, and give one value per collection in the other two lists. 
For example, to also sync each user's wishlist subcollection:

```ini
FIRESTORE_COLLECTION_PATHS=books,users/{userId}/wishlist
TYPESENSE_COLLECTION_NAMES=books,wishlists
FIRESTORE_COLLECTION_FIELDS_LIST=title,publication_year|
FLATTEN_NESTED_DOCUMENTS_LIST=false,false
```

The field lists are separated by `|`. Leave a list empty, like the wishlist one here, to index all fields of that collection. 
For subcollection paths, the kit adds the placeholder values to each Typesense document, so every wishlist document gets a `userId` field you can filter on. 
Create each Typesense collection before deploying. See the [kit's README](https://github.com/typesense/firestore-typesense-search#readme) for every parameter.

### Backfill existing data

The kit only syncs documents written after it was deployed. 
To backfill the documents you already have, create a Firestore collection called `typesense_sync` with a document whose ID is `backfill` and whose contents are `{trigger: true}`. 
To backfill only some of your collections, list them in the same document: `{trigger: true, firestore_collections: ["books"]}`.

### Migrating from the Firebase Extension

`firebase ext:migrate` moves an installed extension to the function kit and keeps its configuration:

1. Update the extension to 3.0.0:

   ```shell
   firebase ext:update <instance-id> typesense/firestore-typesense-search@3.0.0 --project <project-id>
   ```

2. If it uses the single-collection parameters (`FIRESTORE_COLLECTION_PATH`, `TYPESENSE_COLLECTION_NAME`, ...), reconfigure it to use the list parameters (`FIRESTORE_COLLECTION_PATHS`, `TYPESENSE_COLLECTION_NAMES`, ...).

3. Migrate, and answer **No** when it asks to uninstall the extension, until you've checked that the kit is syncing:

   ```shell
   firebase ext:migrate --ext-instance <instance-id> --package typesense-firestore-search --project <project-id>
   ```

4. Uninstall the extension:

   ```shell
   firebase ext:uninstall <instance-id> --project <project-id>
   ```

The [upgrade guide](https://github.com/typesense/firestore-typesense-search/blob/master/UPGRADING.md) covers each step in detail.

## Step 4: Let the search begin!

Once the data is indexed, you can query it using simple search parameters:

```javascript
let search = {
	'q' : '<SEARCH_VALUE>',
	'query_by': 'title',
}

client.collections('<COLLECTION_NAME>')
  .documents()
  .search(search)
  .then(function (searchResults) {
    console.log(searchResults)
  })
```

Typesense is a typo-tolerant search engine. So, even if you make a typographical error in the search query, you would still get the most relevant result.

### Build a Search UI

You can now add a search bar using [instantsearch.js](https://github.com/algolia/instantsearch.js), an open-sourced collection of UI components, built by Algolia.

Typesense has an [instantsearch adapter](https://github.com/typesense/typesense-instantsearch-adapter) that you can use to create UI-based search interfaces, but send the queries to Typesense. 

Install the Instantsearch Adapter using:

```shell
npm install typesense-instantsearch-adapter react-instantsearch-dom @babel/runtime
```

Next, create a search interface using react-instantsearch:

```javascript
import { InstantSearch, SearchBox, Hits, Stats } from "react-instantsearch-dom"
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter"
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xyz", // Be sure to use a Search API Key
    nodes: [
      {
        host: 'xxx.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
        port: '443',
        protocol: 'https'
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "title,description,tags",
  },
})
const searchClient = typesenseInstantsearchAdapter.searchClient
export default function SearchInterface() {
  const Hit = ({ hit }) => (
    <p>
      {hit.title} - {hit.description}
    </p>
  )
return (
      <InstantSearch searchClient={searchClient} indexName="pages_v1">
        <SearchBox />
        <Stats />
        <Hits hitComponent={Hit} />
      </InstantSearch>
  )
}
```

Instantsearch.js is very powerful and you can use it to create pretty interesting search widgets. You can read more about it [here](https://www.algolia.com/doc/guides/building-search-ui/widgets/showcase/react/).

And that's it! As we saw above, Typesense is easy to set up and simple to use. You can use it with your apps to create fast, typo-tolerant search interfaces. If you face any difficulties with Typesense or would like to see any new features added, head over to our [GitHub repo](https://github.com/typesense/typesense) and create an issue.

If we can make any improvements to this guide, click on the "Edit page" link below and send us a pull request. 
