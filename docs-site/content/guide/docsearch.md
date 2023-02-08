# Search for Documentation Sites

The good folks over at Algolia have built and open-sourced [DocSearch](https://github.com/algolia/docsearch) which is a suite of tools specifically built to index data from a documentation site and then add a search bar to the site quickly.

This article will show you how to use a customized version of DocSearch that works with Typesense.
In fact, the search bar you see on Typesense's own documentation site is built with this customized version of DocSearch.

Typesense's customized version of DocSearch is made up of two components:

1. [typesense-docsearch-scraper](https://github.com/typesense/typesense-docsearch-scraper) - Scraper that scans your documentation site and indexes the content in Typesense.
1. [typesense-docsearch.js](https://github.com/typesense/typesense-docsearch.js) - Javascript library that adds a search bar to your documentation site, that uses the index built by the DocSearch scraper.

:::tip Tip: Usage on Non-Documentation Sites
Even though DocSearch was originally built for Documentation sites, 
it can actually be used for any site that has structured, hierarchical and consistent HTML markup across pages.  
:::

## Step 1: Set up DocSearch Scraper

Let's first set up the scraper and point it at your documentation site.

### Create a DocSearch Config File

Follow one of the templates below to create your own `config.json` file, pointing to your documentation site:

- [Here's](https://github.com/algolia/docsearch-configs/blob/master/configs/docusaurus-2.json) Docusaurus' documentation docsearch config.
- [Here's](https://github.com/typesense/typesense-website/blob/master/docs-site/docsearch.config.js) Typesense (Vuepress-based) Documentation Site's docsearch config.
- [This repo](https://github.com/algolia/docsearch-configs/tree/master/configs) contains several Docsearch configuration files used by different documentation sites.

After starting with the template, you will want to change some other fields:
- `index_name` - This corresponds to "typesenseCollectionName" in other places. (The reason for the mismatch is because Algolia calls a collection of documents an "index", whereas Typesense calls a collection of documents a collection, and the crawler was originally forked from Algolia.)
- `start_urls` - This corresponds to the URL for your website.
- `sitemap_urls` - (Docusaurus-only) You'll need to change this URL to match, just like you changed the `start_urls`.

Here's the official [DocSearch Scraper documentation](https://docsearch.algolia.com/docs/legacy/config-file) that describes all the available config options.

:::tip
You might notice that the links to Algolia's DocSearch scraper documentation and scraper config files repo above say they're legacy or deprecated. 
This is because Algolia has recently started asking their users to migrate to their proprietary closed-source crawler, and have marked their open source DocSearch Scraper as deprecated.

Given this, we intend to maintain and develop [Typesense's DocSearch Scraper fork](https://github.com/typesense/typesense-docsearch-scraper) long after Algolia's deprecation.
So you can safely ignore the deprecation warnings in their documentation.
:::

:::tip
If you look at the logs of your Typesense instance, you might see that it reports that the internal index name / collection name is something like `foo_1675838072` instead of `foo`. This is because every time that the crawler runs:

- It creates a new collection called: `foo_<current_unix_timestamp>`
- It creates/updates an alias called `foo` that points to: `foo_<current_unix_timestamp>`
- It deletes the previously scrapped version of the docs, stored in: `foo_<previous_timestamp>`

For this reason, when configuring your website search engine, you should specify the index name / collection name as `foo` instead of `foo_<unix_timestamp>`.
:::

### Add DocSearch meta tags (optional)

The scraper automatically extracts information from the DocSearch meta tags and attaches the `content` value to all records extracted on the page. This is a great way to filter searches on custom attributes.

```html
<meta name="docsearch:{$NAME}_tag" content="{$CONTENT}" />
```
Example: all extracted records on the page will have a `language` attribute of `en` and a `version` attribute of `1.24`

```html 
<meta name="docsearch:language_tag" content="en" />
<meta name="docsearch:version_tag" content="1.2.4" />
```

::: tip
`_tag` must be appended to the end of the `$NAME` variable for the attribute to be saved in the schema.
:::

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
   ::: tip
   If you're running Typesense on `localhost` and you're using Docker to run the scraper, 
   using `TYPESENSE_HOST=localhost` will not work because localhost in this context refers to localhost within the container. 
   Instead you want the scraper running inside the Docker container to be able to connect to Typesense running outside the docker container on your host.
   Follow the instructions [here](https://stackoverflow.com/a/43541732/123545) to use the appropriate hostname to refer to your Docker host. 
   For eg, on macOS you want to use `TYPESENSE_HOST=host.docker.internal` 
   :::
6. Run the scraper:
    ```shellsession
    $ docker run -it --env-file=/path/to/your/.env -e "CONFIG=$(cat /path/to/your/config.json | jq -r tostring)" typesense/docsearch-scraper
    ```

This will scrape your documentation site and index it into Typesense.

::: tip
The Docker command above will run the scraper in interactive mode, outputting logs to stdout. You can also run it as a daemon, by substituting the `-it` flags with `-d` ([Detached Mode](https://docs.docker.com/engine/reference/run/#detached--d)).
:::

::: tip Running the Scraper in Production

The docsearch-scraper Docker container is stateless and so can be run on any platform that allows you to run stateless Docker containers like:

- GitHub Actions
- CircleCI
- AWS Fargate
- Google Cloud Run
- Heroku
- Render

and many more.

You can run the container on-demand any time you need to re-crawl your site and refresh your search index.
:::

## Step 2: Add a Search Bar to your Documentation Site 

### Option A: Docusaurus-powered sites

If you use [Docusaurus](https://docusaurus.io/) as your documentation framework, 
use the [docusaurus-theme-search-typesense](https://github.com/typesense/docusaurus-theme-search-typesense) plugin to add a search bar to your Docusaurus site.

```shellsession
$ npm install docusaurus-theme-search-typesense@next --save

# or 

$ yarn add docusaurus-theme-search-typesense@next
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

      // Optional: Typesense search parameters: https://typesense.org/docs/0.21.0/api/search.md#search-parameters
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

### Option C: Custom Docs Framework with DocSearch.js v3 (modal layout)

Add the Following DocSearch.JS Snippet to all your Documentation Pages:

```html
<!-- Somwhere in your doc site's navigation -->
<div id="searchbar">

<!-- Before the closing head -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/typesense-docsearch-css@0.3.0"
/>

<!-- Before the closing body -->
<script src="https://cdn.jsdelivr.net/npm/typesense-docsearch.js@3.0.1"></script>

<script>
  docsearch({
    container: '#searchbar',
    typesenseCollectionName: 'docs', // Should match the collection name you mention in the docsearch scraper config.js
    typesenseServerConfig: { 
      nodes: [{
        host: 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
        port: '8108',      // For Typesense Cloud use 443
        protocol: 'http'   // For Typesense Cloud use https
      }],
      apiKey: '<SEARCH_API_KEY>', // Use API Key with only Search permissions
    },
    typesenseSearchParameters: { // Optional.
      filter_by: 'version:=0.21.0' // Useful when you have versioned docs
    },
  });
</script>
```

#### Reference:
- Read the [Authentication Section](../latest/api/authentication.md) for all possible options under the `typesenseServerConfig` key.
- Read the [Search Parameters Section](../latest/api/search.md#search-parameters) for all possible options under the `typesenseSearchParameters` key.
- Read the official [DocSearch documentation](https://docsearch.algolia.com/docs/api) for information about additional options.

### Option D: Custom Docs Framework with DocSearch.js v2 (Dropdown layout)

Add the Following DocSearch.JS Snippet to all your Documentation Pages:

```html
<!-- Somwhere in your doc site's navigation -->
<input type="search" id="searchbar">

<!-- Before the closing head -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/typesense-docsearch.js@1/dist/cdn/docsearch.min.css"
/>

<!-- Before the closing body -->
<script src="https://cdn.jsdelivr.net/npm/typesense-docsearch.js@1/dist/cdn/docsearch.min.js"></script>

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
- Read the [Authentication Section](../latest/api/authentication.md) for all possible options under the `typesenseServerConfig` key.
- Read the [Search Parameters Section](../latest/api/search.md#search-parameters) for all possible options under the `typesenseSearchParams` key.
- Read the official [DocSearch documentation](https://docsearch.algolia.com/docs/legacy/dropdown) for information about additional options.

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

Notice that you still need to use `.algolia-autocomplete` class names since we use [autocomplete.js](https://github.com/algolia/autocomplete) unmodified, but for docsearch classnames the class names are `.typesense-docsearch-*` since this is a modified version of DocSearch.js.

:::tip Debugging CSS
In order to inspect and debug your CSS without having the searchbar close when you click on the devtool panels, you can initialize the docsearch library with the ``debug: true`` option!
:::
