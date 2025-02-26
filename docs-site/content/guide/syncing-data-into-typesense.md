# Syncing Data into Typesense

Typesense offers a REST-ful API that you can use to keep data from your primary database in sync with Typesense.

There are a couple of ways to do this, depending on your architecture, CPU capacity in your Typesense cluster and the amount of "realtime-ness" you need. 

[[toc]]

## Sync changes in bulk periodically

### Polling your primary database

1. Add an `updated_at` timestamp to every record in your primary database (if you don't already have one) and update it anytime you make changes to any records.
2. For records that are deleted, either "soft delete" the record using an `is_deleted` boolean field that you set to `true` to delete the record, or save the deleted record's ID in a separate table with a `deleted_at` timestamp.
3. On a periodic basis (say every 30s), query your database for all records that have an `updated_at` timestamp between the current time and the last time the sync process ran (you want to maintain this `last_synced_at` timestamp in a persistent store).
4. Make a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">Bulk Import API call</RouterLink> to Typesense with just the records in Step 3, with `action=upsert` 
5. For records that were marked as deleted in Step 2, make a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#delete-by-query`">Delete by Query</RouterLink> API call to Typesense with all the record IDs in a filter like this: `filter_by:=[id1,id2,id3]`.

If you have data that spans multiple tables and your database supports the concept of views, you could create a database view that `JOIN`s all the tables you need and polls that view instead of individual tables.

### Using change listeners

If your primary database has the concept of change triggers or change data capture:

1. You can write a listener to hook into these change streams and push the changes to a temporary queue 
2. Every say 5s, have a scheduled job that reads all the changes from this queue and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">bulk imports</RouterLink> them into Typesense. 

For eg, here are a couple of ways to sync data from [MongoDB](./mongodb-full-text-search.md), [DynamoDB](./dynamodb-full-text-search.md) and [Firestore](./firebase-full-text-search.md). 
To sync data from MySQL using binlogs, there's [Maxwell](https://github.com/zendesk/maxwell) which will convert the binlogs into JSON and place it in a Kafka topic for you to consume.

### Using ORM Hooks

If you use an ORM, you can hook into callbacks provided by your ORM framework:

1. In your ORM's `on_save` callback (might be called something else in your particular ORM), write the changes that need to be synced into Typesense into a temporary queue
2. Every say 5s, have a scheduled job that reads all the changes from this queue and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">bulk imports</RouterLink> them into Typesense.

### Using Airbyte

[Airbyte](https://airbyte.com/why-airbyte) is an open source platform that lets you sync data between different sources and destinations, with just a few clicks.

They support [several sources](https://airbyte.com/connectors?connector-type=Sources) like MySQL, Postgres, MSSQL, Redshift, Kafka and even Google Sheets and also [support Typesense](https://docs.airbyte.com/integrations/destinations/typesense/) as a destination.

Read more about how to deploy Airbyte, and set it up [here](https://docs.airbyte.com/quickstart/deploy-airbyte).

## Sync real-time changes

### Using the API

In addition to [syncing changes periodically](#sync-changes-in-bulk-periodically), if you have a use case where you want to update some records in realtime, may be because you want a user's edit to a record to be immediately reflected in the search results (and not after say 10s or whatever your sync interval is in the above process),
you can also use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-a-single-document`">Single Document Indexing API</RouterLink>.

It's important to note that the bulk import endpoint is much more performant and uses less CPU capacity, than the single document indexing endpoint for the same number of documents.
So you want to try and use the bulk import endpoint as much as possible, even if that means reducing your sync interval for the process above to as low as say 2s.

### High-volume writes

If your application generates more than 10s of writes-per-second, you want to switch to using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">Bulk Import API</RouterLink>, which is much more performant in handling high volume writes than the single document write endpoint.
For eg, sending 10,000 documents over 10,000 different single API calls is going to be an order magnitude more CPU intensive and slower than sending those 10K documents in a single bulk import API call.

Here's an approach to combine real-time needs with the efficiency of bulk imports:

1. Create a "buffer table" in your primary database (or in your caching system) with columns for:

   - `record_id`: The ID of the original record
   - `operation_type`: The type of operation (insert, update, delete)
   - `record_data`: The full record data as JSON (for inserts/updates)
   - `created_at`: Timestamp when the record was added to the buffer
   - `processed`: Boolean flag indicating if this record has been processed

2. As record change in realtime in your application:

   - Insert the change into the buffer table described above.
   - Continue with your application logic without waiting for Typesense indexing

3. Set up a scheduled job(s) that run frequently (even as little as every 5-10 seconds):
   This job queries unprocessed records from the buffer table, groups them by operation type, sends inserts/updates as a bulk import API call with `action=upsert`, marks processed records in the buffer table, and optionally removes old processed records after a retention period.

#### Worker parallelism considerations

When scaling your synchronization process, it's crucial to match the number of concurrent write operations to your Typesense cluster's available CPU processing capacity:

- For optimal performance, the number of concurrent bulk import operations should not exceed `N-2`, where `N` is the number of CPU cores available to Typesense.
- For example, on an 8vCPU server, limit concurrent bulk imports to 6 workers.

This ensures that Typesense retains enough capacity to handle search requests while processing writes.

This buffer-based approach provides several benefits:

- Your application remains responsive as database writes aren't blocked by Typesense indexing
- You take advantage of the much more efficient bulk import API
- The buffer provides an audit trail of changes
- You can tune the processing frequency based on your real-time requirements

### Using Prisma Pulse

[Prisma Pulse](https://www.prisma.io/data-platform/pulse?utm_source=typesense&utm_medium=typesense-docs) extends the [Prisma ORM](https://www.prisma.io/orm?utm_source=typesense&utm_medium=typesense-docs) to simplify event-driven workflows for your database. It allows you to stream database changes to Typesense in real-time, keeping your search collections up-to-date with the latest data.

#### Setup at a glance

1. Prerequisites:
   - Ensure you have Pulse set up and enabled alongside Typesense in your project. Read more on setting up Pulse in their [documentation](https://www.prisma.io/docs/pulse/getting-started).
2. Stream database changes to Typesense:
   Use Pulse's `.stream()` API to listen for database changes and sync them to your Typesense collections.

Here's an example building on the `books` collection from the setup guide:

```typescript
const stream = await prisma.book.stream({ name: "book-events" });

for await (const event of stream) {
  switch (event.action) {
    case "create":
      const newBook = event.created; // Data of the newly created book record
      await typesense.collections("books").documents().create(newBook);
      break;
    case "update":
      const updatedBook = event.after; // Data of a book record after it has been updated
      await typesense.collections("books").documents(updatedBook.id).update(updatedBook);
      break;
    case "delete":
      const deletedBookId = event.deleted.id; // ID of the deleted book record
      await typesense.collections("books").documents(deletedBookId).delete();
      break;
  }
}
```

If you want to see how syncing data into Typesense with Prisma Pulse looks like in practice, check out this [ready-to-run example](https://github.com/prisma/prisma-examples/tree/latest/pulse/product-search-with-typesense).

## Full re-indexing

In addition to the above strategies, you could also do a re-index of your entire dataset on say a nightly basis, just to make sure any gaps in the synced data due to schema validation errors, network issues, failed retries etc are addressed and filled.

You could use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collection-alias.html`">Collection Alias</RouterLink> feature to do a reindex into a new collection and then switch the alias over to the new collection. 
Or you can use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">Bulk Import API</RouterLink> with `action=upsert`, along with the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#delete-by-query`">Delete by Query</RouterLink> endpoint on an existing collection and reimport your existing dataset. 

## Tips when importing data

Here are some tips when importing data in batches into Typesense:

### Document IDs

In order to update records you push into Typesense at a later point in time, you want to set the `id` field in each document you send to Typesense.
This is a special field that Typesense uses internally to reference documents.

If an explicit `id` field is not set, Typesense will auto-generate one for the document and can return it if you set `return_ids=true` as a parameter to the import endpoint.
You will then have to save this `id` field in your database and use that to update the same record in the future.

### Client-side timeouts

When importing large batches of data, make sure that you've increased the default client-side timeout when instantiating the client-libraries, to as high as 60 minutes.

Typesense write API calls are synchronous, so you do not want the client to terminate a connection prematurely due to a timeout, and then retry the same write operation again.

### Handling HTTP 503s

When the volume of writes sent to Typesense is high, Typesense will sometimes return an HTTP 503, Not Ready or Lagging.

This is a backpressure mechanism built into Typesense, to ensure that heavy writes don't saturate CPU and end up affecting reads. 

If you see an HTTP 503, you want to do one or more of the following:

1. Add more CPU cores so writes can be parallelized. We'd recommend a minimum of 4 CPU cores for high volume writes.  
2. Make sure you've increased the client-side timeout (when instantiating the client library) to as high as say 60 minutes, so that the client never aborts writes that are in progress. 
    Many a time a short client-side timeout ends up causing frequent retry writes of the same data, leading to a thundering herd issue.
3. Increase the retry time interval in the client library to a larger number or set it to a random value between 10 and 60 seconds (especially in a serverless environment) to introduce some jitter in how quickly retries are attempted.
    This gives the Typesense process more time to catch up on previous writes.
4. If you have fields that you're only using for display purposes and not for searching / filtering / faceting / sorting / grouping, you want to leave them out of the schema to avoid having to index them. 
    You can still send these fields in the document when sending it to Typesense - they'll just be stored on disk and returned when the document is a hit, instead of being indexed in memory.
    This will help avoid using unnecessary CPU cycles for indexing.
5. Sometimes disk I/O might be a bottleneck, especially if each individual document is large. In these cases, you want to turn on High Performance Disk in Typesense Cloud or use nVME SSD disks to improve performance.
6. You could also change the value of `healthy-read-lag` and `healthy-write-lag` <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">server configuration parameters</RouterLink>.
    This is usually not needed once the above steps are taken. On Typesense Cloud, we can increase these values for you from our side if you email support at typesense dot org.

### Handling Rejecting write: running out of resource type errors

You might see "running out of resource type" errors either when running out of RAM (OUT_OF_MEMORY) or running of disk space (OUT_OF_DISK). 

The [amount of RAM](./system-requirements.md#choosing-ram) used by Typesense is directly proportional to the amount of data indexed in the Typesense node.
So if you see `OUT_OF_MEMORY` errors, you want to add more RAM to fit your dataset in memory. 

When you see `OUT_OF_DISK` you want to add more disk capacity and restart Typesense. 
On Typesense Cloud, we provision 5X disk space (or a minimum of 8GB) if X is the amount of RAM. So to add more disk space, you want to upgrade to the next RAM tier.

### Client-side batch size vs server-side batching

In the import API call, you'll notice a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#configure-batch-size`">parameter called `batch_size`</RouterLink>.
This controls server-side batching (how many documents from the import API call are processed, before the search queue is serviced), and you almost never want to change this value from the default.

Instead, you want to do client-side batching, by controlling the number of documents in a single import API call and potentially do multiple API calls in parallel.
