# Search Analytics

## Server-side vs Client-side

A common need when building search experiences is to get answers to questions like:

- What are the most popular search terms?
- Are there any search terms that do not return any results?
- Are there particular search terms that can be added as synonyms to pull in more results?
- What are the top converting search terms? 
- What search terms lead to higher pages visits per session? 
- What are the items that are most often returned in search results?
- Is there a correlation between user demographics / cohorts and their search behavior?

In order to answer most of these questions, you need not just search data, but also data about how a user engages with different parts of your site or app. 
This is data you are most likely already capturing in your **web/app analytics** tool of choice like [Amplitude](https://amplitude.com/), [Google Analytics](https://marketingplatform.google.com/about/analytics/), [Heap](https://heap.io/), [Mixpanel](https://mixpanel.com/), [Plausible](https://plausible.io/), [Pendo](https://www.pendo.io/) etc.

Given that you need the context of user-behavioral data to get a complete picture of how your search experience is performing, 
**we highly recommend instrumenting your search experience on the client-side**, to send additional search data along with the rest of the data you are already capturing, to your existing analytics platform.

## Server-side analytics 

As of v0.25.0, Typesense supports the ability to capture <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/analytics-query-suggestions.html`">Search Analytics</RouterLink> (the top searched terms) natively.
Once the search terms are collected, you can then sort by the count of each search term to get the top search terms.

## Client-side analytics

#### InstantSearch Analytics Widgets

If you are using the [InstantSearch UI Library](./search-ui-components.md), it comes with out-of-the-box widgets to help you capture search data, and send it to your analytics tool of choice on the client-side:

- [`analytics` widget](https://www.algolia.com/doc/api-reference/widgets/analytics/js/)
- [`insights` middleware](https://www.algolia.com/doc/api-reference/widgets/insights/js/)

See the [Linux Commit Search](./reference-implementations/linux-commits-search.md) reference implementation for an example of how to implement this in code.

#### Instrument Custom Search UIs

You'd typically want to listen to changes to your search field (with a debounce of say 1s), then capture the search term and search results displayed, and make an API call to your analytics platform using their API library, indicating that a search event has occurred.
