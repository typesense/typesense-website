# Add a fast, typo tolerant search interface to your Firebase App with Typesense

[Firebase](https://firebase.google.com/) is a popular app development platform backed by Google and used by developers across the globe. It gives you a variety of tools to build, release and monitor your applications. However, there is no native indexing or search solution with Firebase. 

The Firebase [documentation](https://firebase.google.com/docs/firestore/solutions/search) talks about using third-party services like Algolia for full-text search. Algolia is a good solution, but is proprietary and can be expensive for even moderate scale. 

**Enter Typesense** - Typesense is an [open-source](https://github.com/typesense/typesense) search engine that is easy to use, run and scale, with clean APIs and documentation. Think of it as an open source alternative to Algolia and an easier-to-use, batteries-included alternative to ElasticSearch. Typesense is blazing fast and highly configurable, so you can tailor results according to your needs. You can learn more about Typesense features [here](https://github.com/typesense/typesense#features).

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

The easiest way to run Typesense is using [Typesense cloud](https://cloud.typesense.org), which is the hosted version of Typesense.

You can also [install Typesense](./install-typesense.md) locally or on a server in [multiple ways](./install-typesense.md#local-machine-self-hosting). 

For this tutorial, let's use the Docker version:

```shell
docker run -i -p 8108:8108 -v/tmp/typesense-server-data/:/data typesense/typesense:{{$page.typesenseVersion}} --data-dir /data --api-key=xyz --listen-port 8108 --enable-cors
```

## Step 2: Create a Typesense Collection

To use Typesense, we first need to create a client. Typesense supports [multiple API clients](../api/api-clients.md) including Javascript, Python, Ruby, PHP etc. 

To create the Javascript client, you need the API key of the Typesense server:

```javascript
import Typesense from 'typesense'

let client = new Typesense.Client({
  'nodes': [{
    'host': '<TYPESENSE_SERVER>',
    'port': '8108',
    'protocol': 'http'
  }],
  // In default installations, you can find the API key at: /etc/typesense/typesense-server.ini
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

Next, we'll create a collection. A collection is a group of related documents, you can think of it as a table in relational databases. A collection needs a schema, that represents how a document would look like. 

```javascript
myCollection = {
  'name': 'books',
  'fields': [
    {'name': 'id', 'type': 'string'},
    {'name': 'title', 'type': 'string' },
    {'name': 'publication_year', 'type': 'int32' },
  ],
  'default_sorting_field': 'publication_year'
}

client.collections.create(myCollection)
```

We created a collection called `books` and the documents stored in the `books` collection will have three fields - `id`, `title` and `publication_year`.`id` is an interesting field here as Typesense uses it as an identifier for the document. If there is no `id` field, Typesense automatically assigns an identifier to the document. Note that the `id` should not include spaces or any other characters that require [encoding in urls](https://www.w3schools.com/tags/ref_urlencode.asp). For this tutorial, we will take the firestore id of the document as the `id` value.

## Step 3: Write data to Typesense

Next, we'll write functions to listen to change events from Firestore and write the changes to Typesense.  

### New Documents

We'll create a function to add to the search index (aka collection) in Typesense, whenever a new document is created. 

```javascript
exports.makeUppercase = functions.firestore.document('/books/{bookID}')
  .onCreate((snapshot, context) => {
    // Grab the document id as id value.
    id = context.params.bookID
    const { title, publication_year } = snapshot.data();
    document = {id, title, publication_year}

    // Index the document in books collection  
    return client.collections('books').documents().create(document)
  })
```

### Document Updates

Similarly, you can update and delete documents as well.

```javascript
exports.onBookUpdate = functions.firestore.document('books/{bookID}')
  .onUpdate( (change, context) => {
    // Grab the changed value
    const { id, title, publication_year } = change.after.data();
    document = {id, title, publication_year}
    return client.collections('books').documents(id).update(document)
  });
```

### Document Deletions

For delete operations, you just need the id of the document:

```javascript
exports.onBookDelete = functions.firestore.document('books/{bookID}')
  .onDelete((snap, context) => {
    // Get the document id
    id = context.params.bookID
  
    return client.collections('books').documents(id).delete()
  });

```

You can also delete a bunch of document based on a condition as described [here](../api/documents.md#deleting-documents).

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
    apiKey: "xyz", // Be sure to use the search-only-api-key
    nodes: [
      {
        host: "<TYPESENSE_SERVER>",
        port: "8108",
        protocol: "http",
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: "title,description,tags",
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

And that's it! As we saw above, Typesense is easy to set up and simple to use. You can use it with your apps to create fast, typo-tolerant search interfaces. If you face any difficulties with Typesense or would like to see any new features added, head over to our [Github repo](https://github.com/typesense/typesense) and create an issue.
