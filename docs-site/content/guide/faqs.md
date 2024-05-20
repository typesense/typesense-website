---
sidebarDepth: 1
---

# Frequently Asked Questions

Here are some common questions that users have asked us in the past, and responses to them.

## Table of Contents

[[toc]]

## Keyword Search

### What is prefix search?

If you have a word like `example` in your dataset, and you search for `exa` (the first 3 characters), that will still return the word `example` in prefix search mode (`prefix=true` search parameter).

The following are all other search terms that will return the word `example` as a match during a prefix search:

- `e`
- `ex`
- `exa`
- `exam`
- `examp`
- `exampl`
- `example`

This is helpful when building search-as-you-type experiences where the user types in one character at a time, and you want to show results immediately, even with partial terms.

You can think of prefix search as a "startsWith" search - the search term should occur at the beginning of a string, to be considered a match.

Prefix search is enabled by default in Typesense.
But if you disable prefix search (by setting `prefix=false` as a search parameter), then only typing out `example` fully as a search keyword will return it as the result, and all the other substrings of `example` above will not return the result.

### What is infix search?

If you have a word like `example` in your dataset, and you search for `xa` (which appears in the middle of the string), by default Typesense will not return it, since only [prefix search](#what-is-prefix-search) is enabled by default.

If you want to search in the middle of strings, that's called `infix` search and has to be explicitly enabled for each field.

In the field definition, in the collection schema, add the `infix: true` parameter documented <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#field-parameters`">here</RouterLink>, and then use the `infix` search parameter documented <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#query-parameters`">here </RouterLink> at search time.

:::warning
Infix search is CPU intensive, and requires additional memory. For high-traffic use-cases, make sure to benchmark your cluster to ensure that you have sufficient CPU capacity before enabling this feature.
:::

If you have [special characters](#how-do-i-handle-special-characters) in words, a more efficient alternative would be to use `token_separators` in the collection schema, to have Typesense index the words as separate tokens, so you can search on each token without having to do infix search. 

### How do I handle special characters?

By default, Typesense removes all special characters before indexing.
You can use the `token_separators` and `symbols_to_index` parameters to control this behavior. 

[Here](./tips-for-searching-common-types-of-data.md) is a detailed article with examples on how to use these two parameters, when searching through different types of data.

### When I search for a short string, I don't get all results. How do I address this?

By default, Typesense only considers the top 4 prefix matches, for performance reasons.

Here's an example:

Searching for "ap", will match records with "apple", "apply", "apart", "apron", or any of hundreds of similar words that start with "ap" in your dataset. Also, searching for "jofn", will match records with "john", "joan" and all similar variations that are 1-typo away in your dataset. 

But for performance reasons, Typesense will only consider the top `4` prefixes and typo variations by default. The `4` is configurable using the `max_candidates` search parameter, documented <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#ranking-and-sorting-parameters`">here</RouterLink>.

In short, if you search for a short term like say "a", and not all the records you expect are returned, you want to increase `max_candidates` to a higher value and/or change the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#schema-parameters`">`default_sorting_field`</RouterLink> in the collection schema to define "top" using some popularity score in your records, without which Typesense will just use the count of each records for each prefix to define top.

### Why does the order of keywords change the number of results?

There are usually a few reasons for this:

1. By default, Typesense only does a [prefix search](#what-is-prefix-search) on the last word in the search query.

   For example:
   
   Let's say you search for `hello worl`, only `worl` will be used for prefix search and `hello` will be expected to match fully.
   
   So all the following records will be returned for a (prefix) search query of `hello worl`:
   
   - ✅ `hello world`
   - ✅ `hello worlds`
   - ✅ `hello worldwide`
   - ✅ `hello worldwide`
   - ✅ `hello worldy`
   - ✅ `hello worldly`
   
   But the following records will NOT be returned for a search query of `hello world`:
   
   - ❌ `hellow world`
   - ❌ `hellowy world`
   - ❌ `hellos world`
   - ❌ `hellowing world`
   
   This is because `hello` is not prefix searched, since it's not the last term in the search query.
   
   But if the order of the search terms is now flipped and the search query is now `world hello`, then the four records above will now be returned, since `hello` is now prefix searched.
   
   If you want to disable prefix searching, you can set `prefix=false`. 

2. By default, when no results are found for a multi-keyword search query, then Typesense will start dropping words in the query one at a time, and repeat the search until enough results are found.

   The definition of "enough" above can be configured using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`drop_tokens_threshold`</RouterLink> search parameter and the direction of the dropping (left to right vs right to left) can be configured using the  <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#search-parameters`">`drop_tokens_mode`</RouterLink> parameter.
   
   So if the search query is `hello world`, and none of the records have all keywords, then Typesense will drop `world` and repeat the search for `hello`.
   Now, if the search query is `wordl hello`, and none of the records have all keywords, then Typesense will drop `hello` this time and repeat the search, which will produce different results compared to the previous time.

### How do I do search multiple collections and combine the results in a single ranked list?

When doing federated / multi search, the `text_match` score returned by Typesense with every hit can be used to compare documents' relevance from different collections, and aggregate the results client-side.
However, pagination might become tricky with this client-side aggregation approach.

An alternate approach would be to store your different document types in a _single_ collection (you want to set all collection fields as `optional: true` in the schema), along with say a `document_type` field that tells you the record type, so you can access the appropriate fields for that document type in your application.

For eg, let's say you have two types of data called `products` and `articles` and want to show the results in a single list.
You can create a single collection with both products and articles, set all fields as optional, add a field called `document_type: product | article` to identify if a document is a product or an article. 
When you send a search query, now both types of records are returned in the same ranked list, and you can use the `document_type` field to visually differentiate each type of record in your search interface.

## Semantic Search

### How do I fine-tune semantic search results?

The quality of semantic search results is completely dependent on the ML model you use to generate the embeddings, and what training dataset was used to originally train the model, among other things like number of dimensions.

Typesense essentially takes your search query, generates embeddings for it using the ML model you've specified, then does a nearest-neighbor vector search and sorts the results based on the cosine similarity between the query embedding and each document's embedding.
With this mode of search, there is no binary concept of "does it match" or not for each document, unlike in standard keyword search. Instead, every document has a vector distance score that defines how close it is to the query embeddings.

So if you find that you're getting too many irrelevant results with semantic search, you can use the `distance_threshold` parameter in `vector_query` to pick an appropriate threshold that works for your use case. Read more about this <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#distance-threshold`">here</RouterLink>.

If you're using Hybrid Search, you can control the weightage of keyword vs semantic matches using the `alpha` parameter of `vector_query`. Read more about this <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#weightage-for-semantic-vs-keyword-matches`">here</RouterLink>.

You can also try using a different ML model that was trained using a dataset that's closer to your domain, to generate better emebeddings.

## Faceting

### How do I get facet counts for values that users have not filtered on?

Let's say you have a Songs Search UI, where you want to show a filter widget that users can use to filter on Artists:

<img src="~@images/faqs/artists-filter-widget.png" alt="Filter by Artists" height="400">

Initially when you do `facet_by: artist`, you'll get facet counts for all artist names in the search results.

However, once you apply `filter_by: artist:=The Beatles`, and then facet by `artist`, now the result set will only contain documents where `artist` is `The Beatles`, so the facet counts will only contain this value.

But you'd still want to show counts for the unfiltered / unselected items to the user. For eg, in the image above, you'd still want to fetch counts for `Various Artists`, `Hello`, `Hello Searhorse!`, etc.

To fetch these counts, you'd need to do a second search query where you remove the `filter_by` selected by the user and only send the `facet_by: artist` parameter.
This will now give you facet counts for all the other unfiltered items, and you would use these counts in the filter widget.

You'd want to do this 2nd query inside a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/federated-multi-search.html`">`multi_search`</RouterLink> request, so it's still a single http request.

If you have multiple filter widgets, you would have to issue one additional query for each filter widget, that removes the particular filter for that widget, but keeps all other filters.

:::tip Live Example
To see a live example of the types of queries you'd need to generate, go to [songs-search.typesense.org](https://songs-search.typesense.org), open the browser's dev console, and then the network tab.

Type in "Hello" in the search bar, and then click on "The Beatles".

Now look for a request to `multi_search` in the browser's dev console network tab, and look at the structure of the queries generated.
:::

### What is the difference between filtering and faceting?

Let's say you have a [dataset of songs](https://songs-search.typesense.org/) like in the screenshot below.

The **_count_** next to each of the "Release Dates" and "Artists" on the left is obtained by faceting on the `release_date` and `artist` fields.

If you click on say "John Denver" and want to only fetch songs where the artist is "John Denver", that is called filtering.

![Faceting Usecase Example](~@images/faceting_usecase_example.png)


## Operations

### How do I get the memory usage for a single collection or field?

Typesense does not track memory usage by individual collections or fields. It only tracks memory metrics at an aggregate process-level. 
You can access these metrics using the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#cluster-metrics`">`GET /metrics.json`</RouterLink> endpoint.

### How do I set up HTTPS with Typesense?

By default, Typesense runs on port `8108` and serves HTTP traffic.

To enable HTTPS, you want to change the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html#networking`">`api-port`</RouterLink> to `443` and then use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html#ssl-https`">`ssl-certificate` and `ssl-certificate-key`</RouterLink> parameters to point to your SSL certificate and SSL private key respectively.

Providers like [LetsEncrypt](https://letsencrypt.org) offer free SSL certificates.

## RC Builds

### Can I run RC builds in production?

Usually yes. We tend to fix issues in RC builds pretty quickly. 

So if a build has been published for at least 1-2 weeks, and there are no newer builds, you should be safe to run that RC build in production.

You can find the published timestamps of the latest RC builds in our [Docker repo tags](https://hub.docker.com/r/typesense/typesense/tags?ordering=last_updated).

### How do I access RC builds?

If you're on Typesense Cloud, you'll find the latest RC build by going to Cluster Configuration > Modify > Typesense Server Version. 
RC builds are all the way at the bottom of this version selector dropdown.

If you're self-hosting Typesense, you can replace the version strings in the URLs in the [installation guide](./install-typesense.md) to the RC version for the Docker image, Linux binary, DEB and RPM packages.
We do not publish RC builds for other platforms.

## Firebase Extension

Here's a dedicated FAQ for the Firebase Extension: [https://github.com/typesense/firestore-typesense-search?tab=readme-ov-file#faqs](https://github.com/typesense/firestore-typesense-search?tab=readme-ov-file#faqs)

## Help

### I don't see my question answered here or in the docs. What do I do?

Read our [Help](/help.md) section for information on how to get additional help.