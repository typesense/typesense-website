# What is Typesense?

Typesense is an open-source, typo-tolerant search engine optimized for instant (typically sub-50ms) search-as-you-type experiences and developer productivity.

If you've heard about ElasticSearch or Algolia, a good way to think about Typesense is that it is:

- An open source alternative to Algolia, with some key quirks solved and
- An easier-to-use batteries-included alternative to ElasticSearch

🗣️ 🎥  If you prefer watching videos, here's one where we introduce Typesense and show a walk-through: [https://youtu.be/F4mB0x_B1AE?t=144](https://youtu.be/F4mB0x_B1AE?t=144)

:::tip 
We've occasionally seen a few users confuse Typesense with a public search engine like say Google, Bing, DuckDuckGo, etc. 
These internet search engines go out and crawl data from sites and then let anyone search through them. 

Typesense on the other hand, does not crawl data. 
Instead, you'd push data that you already have - in your primary database (or CSV/JSON file) or you've crawled using a scraper - into Typesense and then allow your own users to search through this data via a search UI in your site or app.
:::
