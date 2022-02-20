# Search for Documentation Sites

The good folks over at Algolia have built and open-sourced [DocSearch](https://github.com/algolia/docsearch) which is a suite of tools specifically built to index data from a documentation site and then add a search bar to the site quickly.

This article will show you how to use a customized version of DocSearch that works with Typesense.
In fact, the search bar you see on Typesense's own documentation site is built with this customized version of DocSearch.

Typesense's customized version of DocSearch is made up of two components:

1. [typesense-docsearch-scraper](https://github.com/typesense/typesense-docsearch-scraper) - Scraper that scans your documentation site and indexes the content in Typesense.
2. [typesense-docsearch.js](https://github.com/typesense/typesense-docsearch.js) - Javascript library that adds a search bar to your documentation site, that uses the index built by the DocSearch scraper.

## Step 1: Set up DocSearch Scraper

Let's first set up the scraper and point it at your documentation site.

### Create a DocSearch Config File

Follow the official [DocSearch documentation](https://docsearch.algolia.com/docs/required-configuration/) to create a `config.json` file.

[This repo](https://github.com/algolia/docsearch-configs/tree/master/configs) contains several Docsearch configuration files used by different documentation sites and [here's](https://github.com/typesense/typesense-website/blob/master/docs-site/docsearch.config.js) Typesense Documentation Site's docsearch config.

You can use one of those as templates to create your own `config.js`, pointing to your documentation site.

#### Key Concepts

- Docsearch organizes the scraped information using records called `text`, `lvl0`, `lvl1`, `lvl2`...`lvl6`, which usually map to the main content and and header elements within most web articles.
- `text` and `lvlX` records can be queried using CSS selectors or xpath queries.

### Run the Scraper

The easiest way to run the scraper is using Docker.

1. [Install Docker](https://docs.docker.com/get-docker/)
2. [Install jq](https://stedolan.github.io/jq/download/)
3. [Run Typesense](./install-typesense.md)
4. Create a `.env` file with the following contents:
    ```shell
    TYPESENSE_API_KEY=xyz
    TYPESENSE_HOST=xxx.a1.typesense.net
    TYPESENSE_PORT=443
    TYPESENSE_PROTOCOL=https
    ```
5. Run the scraper:
    ```shellsession
    $ docker run -it --env-file=/path/to/your/.env -e "CONFIG=$(cat /path/to/your/config.json | jq -r tostring)" typesense/docsearch-scraper
    ```

This will scrape your documentation site and index it into Typesense.

::: tip
The Docker command above will run the scraper in interactive mode, outputting logs to stdout. You can also run it as a daemon, by substiting the `-it` flags with `-d` ([Detached Mode](https://docs.docker.com/engine/reference/run/#detached--d)).

You can also run it on every deployment using AWS Fargate, Google Cloud Run, etc. 
:::

## Step 2: Add a Search Bar to your Documentation Site 

### Option A: Docusaurus-powered sites

If you use [Docusaurus](https://docusaurus.io/) as your documentation framework, 
use the [docusaurus-theme-search-typesense](https://github.com/typesense/docusaurus-theme-search-typesense) plugin to add a search bar to your Docusaurus site.

```shellsession
$ npm install docusaurus-theme-search-typesense --save

# or 

$ yarn add docusaurus-theme-search-typesense
```

Add the following to your `docusaurus.config.js` file:

```javascript
{
  themes: ['docusaurus-theme-search-typesense'],
  themeConfig: {
    typesense: {
      typesenseCollectionName: 'docusaurus-2', // Replace with your own doc site's name. Should match the collection name in the scraper settings.
      
      typesenseServerConfig: {
        nodes: [
          {
            host: 'xxx-1.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
          {
            host: 'xxx-2.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
          {
            host: 'xxx-3.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
        ],
        apiKey: 'xyz',
      },

      // Optional: Typesense search parameters: https://typesense.org/docs/0.21.0/api/documents.html#arguments
      typesenseSearchParameters: {},

      // Optional
      contextualSearch: true,
    },
  }
}
```

Style your search component following the instructions [here](https://docusaurus.io/docs/search#styling-your-algolia-search).

### Option B: Vuepress-powered sites

If you use [Vuepress](https://vuepress.vuejs.org/) for a documentation framework (like Typesense's own documentation site), 
here's a [Vue Component](https://github.com/typesense/typesense-website/blob/master/docs-site/content/.vuepress/components/TypesenseSearchBox.vue) you can use.

Copy that component into `.vuepress/components/TypesenseSearchBox.vue` and edit it as needed.

Then add a key called `typesenseDocsearch` to your `.vuepress/config.js` file with these contents:

```javascript
{
  themeConfig: {
    typesenseDocsearch: {
      typesenseServerConfig: {
        nearestNode: {
          host: 'xxx.a1.typesense.net',
          port: 443,
          protocol: 'https',
        },
        nodes: [
          {
            host: 'xxx-1.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
          {
            host: 'xxx-2.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
          {
            host: 'xxx-3.a1.typesense.net',
            port: 443,
            protocol: 'https',
          },
        ],
        apiKey: '<your-search-only-api-key>',
      },
      typesenseCollectionName: 'docs', // Should match the collection name you use in the scraper configuration
      typesenseSearchParams: {
        num_typos: 1,
        drop_tokens_threshold: 3,
        typo_tokens_threshold: 1,
        per_page: 6,
      },
    },
  }
}
```

:::tip Reference
Here's the [docsearch-scraper configuration](https://github.com/typesense/typesense-website/blob/eb0a1915de76d0b0d4c0b4b0d06ce10f6989388c/docs-site/docsearch.config.js) we use for Typesense's own Vuepress-powered documentation site.
:::

### Option C: Custom Docs Framework

Add the Following DocSearch.JS Snippet to all your Documentation Pages:

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

#### Reference:
- Read the [Authentication Section](../api/authentication.md) for all possible options under the `typesenseServerConfig` key.
- Read the [Search Parameters Section](../api/documents.md#arguments) for all possible options under the `typesenseSearchParams` key.
- Read the official [DocSearch documentation](https://docsearch.algolia.com/docs/behavior#handleselected) for information about additional options.

#### Styling 

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

:::tip Debugging CSS
In order to inspect and debug your CSS without having the searchbar close when you click on the devtool panels, you can initialize the docsearch library with the ``debug: true`` option!
:::

Notice that you still need to use `.algolia-autocomplete` class names since we use [autocomplete.js](https://github.com/algolia/autocomplete) unmodified, but for docsearch classnames the class names are `.typesense-docsearch-*` since this is a modified version of DocSearch.js.
