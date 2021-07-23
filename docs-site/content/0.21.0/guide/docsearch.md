---
sitemap:
  priority: 0.7
---

# Search for Documentation Sites

The good folks over at Algolia have built and open-sourced [DocSearch](https://github.com/algolia/docsearch) which is a suite of tools specifically built to index data from a documentation site and then add a search bar to the site quickly.

This article will show you how to use a customized version of DocSearch that works with Typesense.
In fact, the search bar you see on Typesense's own documentation site is built with this customized version of DocSearch.

Typesense's customized version of DocSearch is made up of two components:

1. [typesense-docsearch-scraper](https://github.com/typesense/typesense-docsearch-scraper) - Scraper that scans your documentation site and indexes the content in Typesense.
1. [typesense-docsearch.js](https://github.com/typesense/typesense-docsearch.js) - Javascript library that adds a search bar to your documentation site, that uses the index built by the DocSearch scraper.

## Setting up DocSearch

Let's first set up the scraper and point it at your documentation site.

### Step 1: Create a DocSearch Config File

Follow the official [DocSearch documentation](https://docsearch.algolia.com/docs/required-configuration/) to create a `config.json` file.

[This repo](https://github.com/algolia/docsearch-configs/tree/master/configs) contains several Docsearch configuration files used by different documentation sites and [here's](https://github.com/typesense/typesense-website/blob/master/docs-site/docsearch.config.js) Typesense Documentation Site's docsearch config.

You can use one of those as templates to create your own `config.js`, pointing to your documentation site.

### Step 2: Run the Scraper

The easiest way to run the scraper is using Docker.

1. [Install Docker](https://docs.docker.com/get-docker/)
2. [Install jq](https://stedolan.github.io/jq/download/)
3. [Run Typesense](./install-typesense.md)
4. Create a `.env` file with the following contents:
    ```shell
    TYPESENSE_API_KEY=xyz      # Replace with your Typesense admin key
    TYPESENSE_HOST=localhost   # Replace with your Typesense host
    TYPESENSE_PORT=8108        # Replace with the port you are running Typesense on (443 for Typesense Cloud)
    TYPESENSE_PROTOCOL=http    # Use https for production deployments (https for Typesense Cloud)
    ```
5. Run the scraper:
    ```shellsession
    $ docker run -it --env-file=/path/to/your/.env -e "CONFIG=$(cat /path/to/your/config.json | jq -r tostring)" typesense/docsearch-scraper
    ```

This will scrape your documentation site and index it into Typesense.

::: tip
The Docker command above will run the scraper in interactive mode, outputting logs to stdout. You can also run it as a daemon, by substiting the `-it` flags with `-d` ([Detached Mode](https://docs.docker.com/engine/reference/run/#detached--d))
:::

### Step 3: Add the Following DocSearch.JS Snippet to all your Documentation Pages

```html
<!-- Somwhere in your doc site's navigation -->
<input type="search" id="searchbar">

<!-- Before the closing head -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/typesense-docsearch.js@latest/dist/cdn/docsearch.min.css"
/>

<!-- Before the closing body -->
<script src="https://cdn.jsdelivr.net/npm/typesense-docsearch.js@latest/dist/cdn/docsearch.min.js"></script>

<script>
  docsearch({
    inputSelector: '#searchbar',
    typesenseCollectionName: 'docs', // Should match the collection name you mention in the docsearch scraper config.js
    typesenseServerConfig: { 
      nodes: [{
        host: 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
        port: '8108',      // For Typesense Cloud use 443
        protocol: 'http'   // For Typesense Cloud use https
      }],
      apiKey: '<SEARCH_API_KEY>', // Use API Key with only Search permissions
    },
    typesenseSearchParams: { // Optional.
      filter_by: 'version:=0.21.0' // Useful when you have versioned docs
    },
  });
</script>
```

Read the [Authentication Section](../api/authentication.md) for all possible options under the `typesenseServerConfig` key.

Read the [Search Parameters Section](../api/documents.md#arguments) for all possible options under the `typesenseSearchParams` key.

Read the official [DocSearch documentation](https://docsearch.algolia.com/docs/behavior#handleselected) for information about additional options.

### Step 4: Style your DocSearch Dropdown

You can override the following styles as needed:

```css

.algolia-autocomplete .ds-dropdown-menu {
  width: 500px;
}

.algolia-autocomplete .typesense-docsearch-suggestion--category-header {
  color: darkgray;
  border: 1px solid gray;
}

.algolia-autocomplete .typesense-docsearch-suggestion--subcategory-column {
  color: gray;
}

.algolia-autocomplete .typesense-docsearch-suggestion--title {
  font-weight: bold;
  color: black;
}

.algolia-autocomplete .typesense-docsearch-suggestion--text {
  font-size: 0.8rem;
  color: gray;
}

.algolia-autocomplete .typesense-docsearch-suggestion--highlight {
  color: blue;
}
```

Notice that you still need to use `.algolia-autocomplete` class names since we use [autocomplete.js](https://github.com/algolia/autocomplete) unmodified, but for docsearch classnames the class names are `.typesense-docsearch-*` since this is a modified version of DocSearch.js.


## Bonus

### Vuepress DocSearch Component

If you use Vuepress for a documentation framework, here's a [Vue Component](https://github.com/typesense/typesense-website/blob/master/docs-site/content/.vuepress/components/TypesenseSearchBox.vue) that uses this version of DocSearch.
