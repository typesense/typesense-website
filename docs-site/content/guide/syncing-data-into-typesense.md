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

:::tip

In order to update records you push into Typesense at a later point in time, you want to set the `id` field in each document you send to Typesense.
This is a special field that Typesense uses internally to reference documents.

If an explicit `id` field is not set, Typesense will auto-generate one for the document and can return it if you set `return_ids=true` as a parameter to the import endpoint.
You will then have to save this `id` field in your database and use that to update the same record in the future. 

:::

### Using change listeners

If your primary database has the concept of change triggers or change data capture:

1. You can write a listener to hook into these change streams and push the changes to a temporary queue 
2. Every say 5s, have a scheduled job that reads all the changes from this queue and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">bulk imports</RouterLink> them into Typesense. 

For eg, here are a couple of ways to sync data from [MongoDB](./mongodb-full-text-search.md), [DynamoDB](./dynamodb-full-text-search.md) and [Firestore](./firebase-full-text-search.md). 
To sync data from MySQL using binlogs, there's [Maxwell](https://github.com/zendesk/maxwell) which will convert the binlogs into JSON and place it in a Kafka topic for you to consume.

### ORM Hooks

If you use an ORM, you can hook into callbacks provided by your ORM framework:

1. In your ORM's `on_save` callback (might be called something else in your particular ORM), write the changes that need to be synced into Typesense into a temporary queue
2. Every say 5s, have a scheduled job that reads all the changes from this queue and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-multiple-documents`">bulk imports</RouterLink> them into Typesense.

### Using Airbyte

[Airbyte](https://airbyte.com/why-airbyte) is an open source platform that lets you sync data between different sources and destinations, with just a few clicks.

They support [several sources](https://airbyte.com/connectors?connector-type=Sources) like MySQL, Postgres, MSSQL, Redshift, Kafka and even Google Sheets and also [support Typesense](https://docs.airbyte.com/integrations/destinations/typesense/) as a destination.

Read more about how to deploy Airbyte, and set it up [here](https://airbytehq.github.io/category/airbyte-open-source-quickstart).

## Sync real-time changes

In addition to the above, if you have a use case where you want to update some records in realtime, may be because you want a user's edit to a record to be immediately reflected in the search results (and not after say 10s or whatever your sync interval is in the above process),
you can also use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#index-a-single-document`">Single Document Indexing API</RouterLink>.

Note however that the bulk import endpoint is much more performant and uses less CPU capacity, than the single document indexing endpoint for the same number of documents.
So you want to try and use the bulk import endpoint as much as possible, even if that means reducing your sync interval for the process above to as less as say 2s.

## Full re-indexing

In addition to the above strategies, you could also do a re-index of your entire dataset on say a nightly basis, just to make sure any gaps in the synced data due to schema validation errors, network issues, failed retries etc are addressed and filled.

You want to use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collection-alias.html`">Collection Alias</RouterLink> feature to do a reindex without any downtime into a new collection and then switch the alias over to the new collection.

