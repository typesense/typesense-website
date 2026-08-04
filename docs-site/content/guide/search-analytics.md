---
title: "Search Analytics: Queries, No Results, and Conversions"
description: "Set up Typesense search analytics with server-side aggregation rules or client-side events to track popular queries, no-result searches, and conversions."
---

# Search Analytics

Search analytics helps you understand how people use search so you can improve result quality and the overall search experience.

## Server-side vs Client-side

A common need when building search experiences is to get answers to questions like:

- What are the most popular search terms?
- Are there any search terms that do not return any results?
- Are there particular search terms that can be added as synonyms to pull in more results?
- What are the top converting search terms? 
- What search terms lead to higher pages visits per session? 
- What are the items that are most often returned in search results?
- Is there a correlation between user demographics / cohorts and their search behavior?

Most of these questions require both search data and client-side behavioral data about how users engage with different parts of your site or app. You may already capture this behavioral context in a **web/app analytics** tool such as [Amplitude](https://amplitude.com/), [Google Analytics](https://marketingplatform.google.com/about/analytics/), [Heap](https://heap.io/), [Mixpanel](https://mixpanel.com/), [Plausible](https://plausible.io/), or [Pendo](https://www.pendo.io/).

To combine these sources and get a complete picture of search performance, **we highly recommend instrumenting your search experience on the client side**. This lets you send search activity to your existing analytics platform alongside the rest of the behavioral data you already capture.

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
