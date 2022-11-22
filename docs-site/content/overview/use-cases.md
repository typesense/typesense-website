# Typesense Use Cases

We primarily built Typesense to be a search engine optimized for fast, typo-tolerant full-text search. 

However, we've been pleasantly surprised by interesting use cases our users have started using it for, beyond just search.
We've been able to better support some of these use cases based on feedback from users. 

## Good Use Cases

Here is an evolving set of use-cases where Typesense can be used:

1. Typo-tolerant fuzzy search to power autocomplete search bars and search results pages
2. Faceted navigation and browsing experience, where users don't need to type in a keyword, instead they directly start applying filters to drill down multiple attributes to get to the documents they're looking for. (Eg: [https://ecommerce-store.typesense.org/](https://ecommerce-store.typesense.org/))
3. As a geo-distributed cache, in order to place data close to users. Instead of hitting your primary database for data which is probably hosted in a single geo region, since you already send Typesense a snapshot of your data, you could fetch documents directly from a [geo-distributed Typesense cluster](../guide/typesense-cloud/search-delivery-network.md), which routes requests to the node that's closest to the user, thus reducing latency.
4. For finding documents that are similar to each other, using [vector search](https://github.com/typesense/typesense/issues/207#issuecomment-1284501703). The definition of "similarity" can be defined by any ML models you build, you'd take the output of the model (vectors), index them in Typesense and then do a nearest-neighbor search.
   Using this, you can implement features like personalization, recommendations, visual search, semantic search, similarity search, etc.

If you're using Typesense for any other use-cases let us know in our [Slack Community](https://join.slack.com/t/typesense-community/shared_invite/zt-mx4nbsbn-AuOL89O7iBtvkz136egSJg)!

## Bad Use Cases

Typesense should NOT be used as a primary data store, which stores the only copy of your data.

Typesense is designed to be a _secondary_ data store. 
Meaning, you want to use another primary database to store the primary copy of your data, where your application writes data into.
You'd then [sync](../guide/syncing-data-into-typesense.md) a copy of the data into Typesense in order to support one of the use-cases above.