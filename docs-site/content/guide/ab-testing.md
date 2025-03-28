# A/B Testing

In the context of optimizing search experiences, 
A/B Testing refers to the process of testing the effect of various search and ranking parameters to empirically determine which set of options produce the most relevant results (and conversion lift) for users.

There are several A/B Testing platforms out there like:

- [Flagsmith](https://docs.flagsmith.com/advanced-use/ab-testing)
- [Growthbook](https://www.growthbook.io/)
- [Google Optimize](https://optimize.withgoogle.com/)
- [Split.io](https://www.split.io/)
- [Visual Web Optimizer](https://vwo.com/)
- [Optimizely](https://www.optimizely.com/)

These platforms are very good at what they do and so Typesense does not attempt to provide a built-in A/B Testing feature.
Instead, in this article we'll explore how you could use any of these existing A/B Testing platforms to run search-parameter-tuning tests to fine tune Typesense.

## Types of A/B Tests

You can run A/B tests on:

1. Any of the available <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/documents.html#search-parameters`">search parameters</RouterLink> like `sort_by`, `filter_by`, etc.
2. <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/curation.html`">Override/Curation Rules</RouterLink>.
3. <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/synonyms.html`">Synonyms</RouterLink>.

## Methodology

1. Create an Experiment or Test on your A/B Testing platform, along with `N` number of buckets or variations.
2. When a user lands on a page / screen, they'll get assigned to a bucket or variation by your A/B Testing platform. 
3. In your frontend application, you'd have a conditional code block that fetches the bucket/variation the user was assigned to and then configure the Typesense Search API Call to use a specific set of search parameters or use a specific collection name (if you're testing overrides or synonyms) for that particular bucket.
4. Conversion events you've defined are tracked as usual in your A/B Testing platform, and you'll be able to see the effect of parameter changes in the Test Results.

### Example

Let's say we have a Books search experience and we want to determine the best `query_by` fields (specifically the priority order of fields) to use.

We'd first create an experiment called "Query By Priority" in our A/B Testing Platform, with the following variations:

- title_priority
- author_priority
- control

Now when a user lands on the page, the A/B Testing platform would assign them to one of those buckets.

We'd write a conditional that looks something like this in our frontend:

```js
const currentVariation = ABTestingLibrary.getCurrentVariation(); // Consult your A/B Testing platforms documentation for the appropriate method to use here

let queryBy = 'categories,title,author'

if(currentVariation === 'title_priority') {
  queryBy = 'title,author'
} else if(currentVariation === 'author_priority') {
  queryBy = 'author,title'
}

const typesenseClient = new TypesenseClient({...});

client.collections('books').documents().search({
  'q': query,
  'query_by': queryBy,
  //...
})
```

Effectively, depending on the bucket the user was assigned to, we'd use a different value for `query_by`.

We can use a similar mechanism to switch out the collection name to test overrides and synonyms, or other search parameters.

To track results, we'd instrument our search results page to send click-events to our A/B Testing platform, along with other standard conversion events like purchases.

The A/B Testing platform should then aggregate results across all variations and show you which variation performed the best based on your objective.

<meta name="docsearch:version" content="1.0.0" />