# Search for WordPress Sites

If you are looking to implement a search-as-you-type instant search experience on a WordPress site, you can use the Typesense WordPress plugin [Search With Typesense](https://wordpress.org/plugins/search-with-typesense/) built by the [CodeManas](https://www.codemanas.com/) team. 
The plugin allows you to index your posts, pages and provides ways to showcase them via InstantSearch and Autocomplete.

This article will walk you through the installation and configuration of the plugin.

## Minimum Requirements

You need the following minimum requirements to install this plugin:

- PHP Version 7.4
- WordPress Version 5.8

## Installation

There are two methods for installing the Typesense plugin for WordPress:

1. [Automatic Installation](#automatic-installation)
2. [Manual Installation](#manual-installation)

### Automatic Installation
This is the preferred and most simple method to install the plugin.

1. On your WordPress website go to Plugins > Add New > Search for "Search with Typesense"
2. Click install and then activate the plugin

### Manual Installation

1. Go to [https://wordpress.org/plugins/search-with-typesense/](https://wordpress.org/plugins/search-with-typesense/).
2. Click on the Download button, which will provide you with a zip file of the plugin.
3. Go to WordPress Admin area > Plugins > Add New and click upload plugin.
4. Click upload plugin and then choose the zip file you downloaded.
5. The plugin will then be installed, then activate the plugin.

## Setup and Configuration

Once the plugin has been installed and activated - we need to do someone initial setup.

### Setup

If you are hosting Typesense locally or on your own server, generate your API Keys following the instructions here: <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html`">Generate API Keys</RouterLink>.

If you are using Typesense Cloud, once the cluster is set up, click on "Generate API Keys" from your cluster's dashboard. 
This will generate and download API Keys to be used. 
Keep this file safe and secure for future use.

![Typesense API Keys Generate](~@images/wordpress/api-keys-overview.png)

The text file will have the following information:

![Typesense DynamoDB Integration Chart](~@images/wordpress/configuration-txt.png)

- Admin API Key
- Search Only API Key
- Nodes (along with port number):

After retrieving the required info go to WordPress > Admin Area > Typesense > Settings.

Here you will need to fill in the details retrieved from the credentials file:

![Typesense DynamoDB Integration Chart](~@images/wordpress/typesense-wp-api-configuration.png)

Your WordPress install will now be able to connect to your Typesense instance.

### Configuration

The next step is to enable and start indexing your posts/pages.

Go to WordPress Admin Area > Typesense > Search Configuration and from here you can:

- Enable Post Types
- Bulk Index
- Autocomplete Placeholder
- Autocomplete Input Delay
- Replace WordPress Search

![Typesense DynamoDB Integration Chart](~@images/wordpress/typesense-search-configuration.png)

#### Enable Post Types
This option allows you to select which post types to index. By default, the plugin allows you to index posts and pages. 
There are WordPress action hooks and filters that allow adding custom post types.

#### Bulk Index
The bulk index option allows you to index all posts (post types) at once. 
You'll find options to

- Index
- Delete and Re-index (Only required if you have modified the schema (advanced usage).

#### Replace WordPress Search
Enabling this option will replace all WordPress default search widgets and forms with an autocomplete search form, powered by Typesense.

You can see an example of this [here](https://typesense.codemanas.com/autocomplete/).

#### Autocomplete Placeholder
This allows you to change the placeholder text for the autocomplete search (if replace WordPress search is enabled).

#### Autocomplete Input Delay
Allows you to define delay time after input from user before retrieving results. Minimum delay time is 300 milliseconds.

And that's it - you are ready to go. 

## Read More

There are many additional options to use the plugin with shortcodes and advanced customization options. 
Read more about them in the full documentation on [https://codemanas.github.io/cm-typesense-docs/](https://codemanas.github.io/cm-typesense-docs/).