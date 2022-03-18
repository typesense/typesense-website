# WordPress Integration

If you are looking to implement Typesense on a WordPress site, you can use the WordPress plugin [Search With Typesense](https://wordpress.org/plugins/search-with-typesense/). The plugin allows you to index your posts, pages and provides ways to showcase them via Instant Search and Autocomplete features.

This article will walk through the initial installation and configuration of the plugin.

## Minimum Requirements
- PHP Version 7.4
- WordPress Version 5.8

There are two methods for installing the plugin.
1. [Automatic Installation](#automatic-installation)
2. [Manual Installation](#manual-installation)

## Automatic Installation
This is the preferred and most simple method to install the plugin.
- On your WordPress website go to plugins > Add New > Search for "Search with Typesense"
- Click install and then activate the plugin

## Manual Installation
If for some reason automatic installation is not possible, go to [https://wordpress.org/plugins/search-with-typesense/](https://wordpress.org/plugins/search-with-typesense/) , and you will see the download button. Clicking download button will provide you with a zip file of the plugin then.
- Go to WordPress Admin area > Plugins > Add New and click upload plugin.
- Click upload plugin and then add the zip file
- The plugin will then be installed, then activate the plugin.

Once the plugin has been installed and activated - we need to do someone initial setup.

## Setup and Configuration

### Setup
If you are hosting Typesense locally / on your own server. Then please see the steps here to generate API Keys https://typesense.org/docs/0.22.1/api/api-keys.html

Otherwise, if you have gone with Typesense cloud option - then once the cluster is set up. There will be an option to generate your API keys. "Generate API Keys" - will generate and download API Keys to be used. Keep this file safe and secure for future use.

The text file will have the following information.
- Admin API Key
- Search Only API Key
- Nodes (along with port number):

After retrieving the required info go to WordPress > Admin Area > Typesense > Settings
Here you will need to fill in the details retrieved from the text file.
The fields are
- Protocol
- Node URI
- Port
- Admin API Key
- Search API Key

Your WordPress install will now be able to connect to your typensese instance.

### Configuration
The next step is to enable and start indexing your posts/pages.
Go to WordPress Admin Area > Typesense > Search Configuration
From here you can
- Enable Post Types
- Bulk Index
- Autocomplete Placeholder
- Autocomplete Input Delay
- Replace WordPress Search

#### Enable Post Types
This option allows you to select which post types to index. By default the plugin allows you to index posts and pages. There are WordPress action hooks and filters that allow adding custom post types.

#### Bulk Index
Bulk Index, option allows you to index all posts(post types) at once. Indexing means they will add the document into Typesense instant to be easily retrieved. There is option to 
- Index
- Delete and Re-index
Delete and Re-index is only required if you have modified the schema (advanced usage)

#### Replace WordPress Search
Enabling this will replace all WordPress default search widgets and forms with an autocomplete search form.
You can see an example of this [here](https://typesense.codemanas.com/autocomplete/)

#### Autocomplete Placeholder
This allows you to change the placeholder text for the autocomplete search (if replace WordPress search is enabled)

#### Autocomplete Input Delay
Allows you to define delay time after input from user before retrieving results. Minimum delay time is 300 milliseconds.

And that's it - you are ready to go. There are many options to use the plugin with shortcodes and advanced customization options. You can check out the full documentation on [https://codemanas.github.io/cm-typesense-docs/](https://codemanas.github.io/cm-typesense-docs/)