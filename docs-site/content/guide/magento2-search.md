# Search for Magento2 Sites

The default search in Magento is based on the basic search features in your primary database, which while it might give you decent mileage, might not be as fast as your dataset grows.

You can use Typesense to replace the default DB-based search in your Magento 2 application, to make your search experience blazing fast and scaleable. 

In this article, we'll explore the [Magento Extension for Typesense](https://ceymox.com/typesense-search-for-magento/) built by the [Ceymox](https://ceymox.com/) team.

:::tip Third-Party Integration
The Magento extension described in this article is built and maintained by a member of the extended Typesense community - [Ceymox](https://ceymox.com/)

Please reach out to them directly for additional support.
:::

## Minimum Requirements

The following Magento versions are supported by this extension: 

- Magento 2.3
- Magento 2.4 

The Ceymox team is also planning to add supports for the Adobe Commerce and Hyva versions. [Read their documentation](https://ceymox.com/doc/typesense-search-for-magento-implementation-guide.html) for latest updates.

If you are new to Typesense, start by [signing up](https://cloud.typesense.org/signup) for a Typesense Cloud Account.

We'll now explore how to install the Magento2 extension next.

## Installation Methods

1. Manual Installation 
2. Magento Marketplace Installation - Coming Soon 
3. Composer Installation - Coming Soon 

### Manual Installation

To install the extension manually, you need to have access to your Magento admin panel and Magento application source code.

Follow the steps:

1. [Download the Typesense Magento Module](https://ceymox.com/typesense-search-for-magento/) from here.
2. Unpack the zip file you downloaded
3. Copy the folder "Ceymox" into the path app/code/ in your Magento application
4. Now, go to your source code root directory and install the Typesense PHP package using composer
    ```shell
    composer require php-http/curl-client typesense/typesense-php
    ```
5. Run the following commands from Magento root directory:
    ```shell
    php bin/magento module:enable Ceymox_TypesenseSearch - to enable extension.
    
    php bin/magento setup:upgrade - to install the extension.
    
    php bin/magento setup:di:compile - to compile the code.
    
    php bin/magento setup:static-content:deploy - to deploy static view files.
    
    php bin/magento cache:clean - to clean the cache.
    ```

## Configuration 

### General Setup 

In order to connect Magento with Typesense Cloud, we will need to configure the following settings:

From the Magento Admin panel, click on:

Store > Configuration > Typesense Search > General > General Configuration

![Typesense Configuration](~@images/magento2/configuration.png)

You can get the typesense credentials from [Typesense Cloud Dashboard](https://cloud.typesense.org/login)

![Typesense API Keys Generate](~@images/magento2/api_key_generate.png)

#### Admin API key & Search-only (public) API key, 

These are API keys you can generate from your Typesense Cloud dashboard.

#### Index Name Prefix

Prefix to use for your Typesense collection names.

#### Nearest Node

If you've provisioned a Highly Available cluster or [Search Delivery Network](/guide/typesense-cloud/search-delivery-network.md) in Typesense Cloud, enter the Nearest Node hostname you see from your Typesense Cloud Dashboard under Nearest Node.

#### Node

Specify the individual hostname(s) of your Typesense Cloud cluster, that you see on your cluster dashboard. 

Separate multiple hostnames by comma.

#### Protocol

Use `https` for Typesense Cloud.

#### Port

Use `443` for Typesense Cloud.

### Semantic Search

Typesense supports the ability to implement [Semantic Search](./semantic-search.md). Semantic search helps retrieve results that are conceptually related to a user's query. We can turn normal search into Semantic search by embedding the fields with appropriate AI models. 
In this Typesense Magento module, we have implemented S-BERT and GTE models.

To configure semantic search from the Magento Admin panel click on,

Store > Configuration > Typesense Search > Semantic Search > Semantic Search

![Typesense Semantic Search](~@images/magento2/semantic_search.png)

## Support

The extension supports several more options. Read more about them here in the [Official Documentation](https://ceymox.com/doc/typesense-search-for-magento-implementation-guide.html) written by Ceymox.

If you have any questions or need additional help, please contact the Ceymox team directly: [https://ceymox.com/contact/](https://ceymox.com/contact/) 