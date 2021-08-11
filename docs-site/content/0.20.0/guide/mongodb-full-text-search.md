---
sitemap:
  priority: 0.3
---

# Full-text Fuzzy Search with MongoDB and Typesense

This walk-through will show you how to ingest data from MongoDB into Typesense, and then use Typesense to search through the data with typo-tolerance, filtering, faceting, etc.

At a high-level we'll be setting up a trigger using MongoDB's Change Streams and pushing the data into Typesense on each change event.

![Typesense MongoDB Integration Chart](@images/typesense-mongodb/mongodb.svg)

## Step 1: Install and Run Typesense

To install and start Typesense using docker run the following Docker command:

<pre><code class="language-bash">docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:{{ $page.typesenseVersion }} \
  --data-dir /data --api-key=$TYPESENSE_API_KEY</code></pre>

Now, we can check if our Typesense server is ready to accept requests.

```bash
curl http://localhost:8108/health
{"ok":true}
```

You can also run Typesense in other ways. Check out [Typesense Installation](./install-typesense.md) and [Typesense Cloud](https://cloud.typesense.org/) for more details.

## Step 2: Start a MongoDB Replica Set

MongoDB Replica Sets provide redundancy and high availability, and are the basis for all production deployments.

If you have a standalone MongoDB instance, you can convert it to a replica set by following steps:

* Shutdown already running MongoDB server.
* Start the MongoDB server by specifying -- replSet option

```bash
mongod --port "PORT" --dbpath "YOUR_DB_DATA_PATH" --replSet "REPLICA_SET_INSTANCE_NAME"
```

Check the status of replica set issuing the command `rs.status()` in mongo shell.

## Step 3: Open a Change Stream

Now let's open a change stream to listen for any changes to data in our MongoDB cluster. We'll later push these changes to Typesense.

We can open a change stream for MongoDB Replica Set from any of the data-bearing members. For detailed explanation check out [MongoDB Change Streams](https://docs.mongodb.com/manual/changeStreams/)

Here's an example:
```js
const uri = '<MongoDB-URI>';
const mongodbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
const client = new MongoClient(uri, mongodbOptions);
await client.connect();
const collection = client.db("sample").collection("books");
const changeStream = collection.watch();
changeStream.on('change', (next) => {
  // process next document
});
```

## Step 4: Create a Typesense Collection

To use Typesense, we first need to create a client. Typesense supports multiple API clients including Javascript, Python, Ruby, PHP etc.

To initalize the Javascript client, you need the API key of the Typesense server:

```js
import Typesense from 'typesense'

let typesense = new Typesense.Client({
  'nodes': [{
    'host': 'localhost',
    'port': '8108',
    'protocol': 'http'
  }],
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```
Next, we will create a collection. A collection needs a schema, that represents how a document would look like.

```js
let schema = {
  'name': 'books',
  'fields': [
    { 'name': 'id', 'type': 'string', 'facet': false },
    { 'name': 'name', 'type': 'string','facet': false },
    { 'name': 'author', 'type': 'string', 'facet': false },
    { 'name': 'year', 'type': 'int32', 'facet': true },
  ],
  'default_sorting_field': 'year',
}
await typesense.collections().create(schema);
```

## Step 5: Index documents to Typesense

Next, we'll create a function to listen to change streams from MongoDB and write the changes to Typesense.

Here's an example MongoDB change streams response:

```js
{
  _id: {
    _data: '826062978E000000012B022C0100296E5'
  },
  operationType: 'insert',
    clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1617074062 },
  fullDocument: {
    _id: 6062978e06e4444ef0c7f16a,
      name: 'Davinci Code',
      author: 'Dan Brown',
      year: 2003
  },
  ns: { db: 'sample', coll: 'books' },
  documentKey: { _id: 6062978e06e4444ef0c7f16a }
}
{
  _id: {
    _data: '826062978E000000032B022C0100296E5'
  },
  operationType: 'update',
    clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 3, high_: 1617074062 },
  ns: { db: 'sample', coll: 'books' },
  documentKey: { _id: 6062978e06e4444ef0c7f16a },
  updateDescription: { updatedFields: { year: 2000 }, removedFields: [] }
}
{
  _id: {
    _data: '826062978E000000072B022C0100296E5'
  },
  operationType: 'delete',
    clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 7, high_: 1617074062 },
  ns: { db: 'sample', coll: 'books' },
  documentKey: { _id: 6062978e06e4444ef0c7f16c }
}
```

```js
async function index(next, typesense){
  if(next.operationType == 'delete') {
    await typesense.collections('books').documents(next.documentKey._id).delete();
  } else if(next.operationType == 'update') {
    let data = JSON.stringify(next.updateDescription.updatedFields);
    await typesense.collections('books').documents(next.documentKey._id).update(data);
  } else {
    next.fullDocument.id = next.fullDocument["_id"];
    delete next.fullDocument._id;
    let data = JSON.stringify(next.fullDocument);
    await typesense.collections('books').documents().upsert(data);
  }
}
```

## Full Example

Here is the full code example:

```js
const { MongoClient } = require('mongodb');
const Typesense = require('typesense');

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};

async function index(next, typesense){
    console.log(next);
    if(next.operationType == 'delete') {
        await typesense.collections('books').documents(next.documentKey._id).delete();
        console.log(next.documentKey._id);
    } else if(next.operationType == 'update') {
        let data = JSON.stringify(next.updateDescription.updatedFields);
        await typesense.collections('books').documents(next.documentKey._id).update(data);
        console.log(data);
    } else {
        next.fullDocument.id = next.fullDocument["_id"];
        delete next.fullDocument._id;
        let data = JSON.stringify(next.fullDocument);
        await typesense.collections('books').documents().upsert(data);
        console.log(data);
    }
}

async function monitorListingsUsingEventEmitter(client, typesense, timeInMs = 60000){
    const collection = client.db("sample").collection("books");
    const changeStream = collection.watch(pipeline);
    changeStream.on('change', (next) => {
        index(next, typesense);
   });
   await closeChangeStream(timeInMs, changeStream);
}

async function createSchema(schema, typesense) {
    const collectionsList = await typesense.collections().retrieve();
    var toCreate = collectionsList.find((value, index, array) => {
        return value["name"] == schema["name"];
    });

    if(!toCreate){
        await typesense.collections().create(schema);
    }
}

async function main() {
    const typesense = new Typesense.Client({
        'nodes': [{
            'host': 'localhost',
            'port': '8108',
            'protocol': 'http'
        }],
        'apiKey': 'hari',
        'connectionTimeoutSeconds': 2
    });
    let schema = {
        'name': 'books',
        'fields': [
            {
                'name': 'id',
                'type': 'string',
                'facet': false
            },
            {
                'name': 'name',
                'type': 'string',
                'facet': false
            },
            {
                'name': 'author',
                'type': 'string',
                'facet': false
            },
            {
                'name': 'year',
                'type': 'int32',
                'facet': true
            },
        ],
        'default_sorting_field': 'year',
    }
    createSchema(schema, typesense);
    const mongodbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    const uri = '<Mongo-URI>';
    const client = new MongoClient(uri, mongodbOptions);
    try {
        await client.connect();
        await listDatabases(client);
        await monitorListingsUsingEventEmitter(client, typesense);
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
```


That's it 😊! Now you can easily search through your MongoDB documents using Typsense. You can even use [Typesense Cloud](https://cloud.typesense.org/) and [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for hosted versions of Typesense and MongoDB.

## References
- [Sample Code](https://github.com/HarisaranG/typesense-mongodb)
- [MongoDB Change Streams](https://docs.mongodb.com/manual/changeStreams/)
- [Change Streams NodeJS](https://developer.mongodb.com/quickstart/nodejs-change-streams-triggers/)
- [Typesense API](../api/README.md)
- [Typesense Guide](./README.md)
