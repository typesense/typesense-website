# Add a fast, typo tolerant search interface to your Firebase App with Typesense

Firebase is a popular app development platform backed by Google and used by developers all across the globe. It provides you a variety of tools to build, release and monitor your application. However, there is no native indexing or search solution with Firebase. 

The Firebase [documentation](https://firebase.google.com/docs/firestore/solutions/search) talks about using third-party services like Algolia for full-text search. Algolia, although being a good solution, is proprietary and can be expensive for large use cases. 

Typesense is an open-source search engine that is simple to use, run and scale, with clean APIs and documentation. Think of it as an open source alternative to Algolia and an easier-to-use, batteries-included alternative to ElasticSearch.Typesense is blazing fast and highly configurable, so you can tailor results according to your needs. You can learn more about Typesense features [here](https://github.com/typesense/typesense#features).


In this tutorial, we are going to learn about how you can integrate Typesense with Firebase. To follow this tutorial, you should be aware of Firebase, Firestore and how these tools work. To get started, let's take a sample app that stores books titles and their publication year.

```javascript=
// books/${bookID}
{
    id: string
    title: string,
    publication_year: int32
}
```
`id` is an interesting field here as Typesense uses it as an identifier for the document. If there is no `id` field, Typesense would assign an identifier of its choice to the document.Note that the id should not include spaces or any other characters that require [encoding in urls](https://www.w3schools.com/tags/ref_urlencode.asp). 

For the course of this tutorial, we will take the firestore id of the document as the `id` value. Here are the steps to add Typesense to this app.

## Step 1: Install and run a Typesense server

You can [install Typsense](https://typesense.org/docs/0.19.0/guide/#install-typesense) in multiple ways including binary, deb/rpm package or docker image. The easiest way to setup Typesense server is using docker image:

```shell=
docker run -i -p 8108:8108 -v/tmp/typesense-server-data/:/data typesense/typesense:0.15.0 --data-dir /data --api-key=xyz --listen-port 8108 --enable-cors
```

You can also use [Typesense cloud](cloud.typesense.org) if you are looking for a hosted version. 


## Step 2. Create a Typesense client and collections

To use typesense, first we need to create a client. Typesense supports multiple API client including Javascript, Python, Ruby, PHP etc. To create the client, you need the API key of typesense server:

```javascript
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

You can connect to the Typesense server using the above client. Next, we create a collection. A collection is a group of related documents, you can think of it as a table in relational databases. A collection needs a schema, that represents how a document would look like. 

```javascript=
import typesense

mycollection = {
  'name': 'books',
  'fields': [
    {'name': 'id', 'type': 'string'},
    {'name': 'title', 'type': 'string' },
    {'name': 'publication_year', 'type': 'int32' },
  ],
  'default_sorting_field': 'publication_year'
}

client.collections.create(mycollection)
```

Here, we created a collection called books and the documents stored in the books collection will have three fields, namely - id, title and publication_year.

## Step 3. Write data to typesense server

Next, create a function to add the index to the typesense server, whenever a new document is created. 

```javascript
exports.makeUppercase = functions.firestore.document('/books/{bookID}')
    .onCreate((snapshot, context) => {
      // Grab the document id as id value.
      id = context.params.bookID
      const { title, publication_year } = snapshot.data();
      document = {id, title, publication_year}

      // Index the document in books collection  
      return client.collections('books').documents().create(document)
    });

  });
```

This will automatically index the books data whenever a new entry is created in the books folder. Similarly, you can update and delete documents as well.

For update, take the updated value of the docuemnt and index it in Typesense server:

```javascript=
exports.onBookUpdate = functions.firestore.document('books/{bookID}')
  .onUpdate( (change, context) => {
    // Grab the changed value
    const { id, title, publication_year } = change.after.data();
    document = {id, title, publication_year}

    return client.collections('books').documents(id).update(document)

  });
```

For delete operations, you just need the id of the document:

```javascript=
exports.onBookDelete = functions.firestore.document('books/{bookID}')
    .onDelete((snap, context) => {
    // Get the document id
    id = context.params.bookID

    return client.collections('books').documents(id).delete()

});

```

You can also delete a bunch of document based on a condition as described [here](https://typesense.org/docs/0.19.0/api/#delete-document).

## Step 4 Let the search begin!

Once the data is indexed, you can query it using simple search parameteres:

```javascript=
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

Typesense is a typo-tolerant search engine. So, even if you make any typographical error in the search query, you would still get the most relevant result.

You can also add the UI search bar using [instantsearch.js](https://github.com/algolia/instantsearch.js), an open-sourced collection of UI components, built originally by Algolia.

Typesense has an [instantsearch adapter](https://github.com/typesense/typesense-instantsearch-adapter) that you can use to create UI-based search interfaces. 

You can install the instant-search-adapter using:

```shell=
npm install typesense-instantsearch-adapter react-instantsearch-dom @babel/runtime
```

Next, you can create a seach insterface using react-instantsearch:

```javascript=
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


As we learned from this tutorial, Typesense is easy to set up and simple to use. You can now use it with your apps to create fast, typo-tolerant search interfaces. If you are facing any difficulties with Typesense or would like to see any new features added, head over to the [Github repo](https://github.com/typesense/typesense).
