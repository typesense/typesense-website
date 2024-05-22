# Search for Magento2 Sites

Are you wondering how to have a fast and instant search for your Magento site? You can use Typesense Magento Extension [Typesense search for Magento](https://ceymox.com/typesense-search-for-magento/) built by [Ceymox](https://ceymox.com/) team.

## Minimum Requirements

Supporting Magento Versions: 

Magento 2.3
Magento 2.4 

This extension is also planning to support the versions of Adobe Commerce and Hyva. Please [check the documentation](https://ceymox.com/doc/typesense-search-for-magento-implementation-guide.html) for latest updates.

If you are new to Typesense, start by creating your Typesense account.
- [Create Typesense Cloud Account](https://cloud.typesense.org/signup)  
- If you have any queries or want more information [Contact Us](https://ceymox.com/contact/) 

## Installation Methods

1. Manual Installation 
2. Magento Marketplace Installation - Coming Soon 
3. Composer Installation - Coming Soon 

### Manual Installation

For performing the manual installation, you need Magento admin access and SSH access.

[Download Typesense Magento Module](https://ceymox.com/typesense-search-for-magento/) from here .. 

Follow the steps:

1. Unpack the zip file you have downloaded 

2. Copy the folder "Ceymox" into the path app/code/

![Typesense installation](~@images/magento2/installation.png)

3. Connect to your server with SSH, go to Magento root directory


4. Install typesense PHP package using composer


composer require php-http/curl-client typesense/typesense-php

5. Run the following commands from Magento root folder:

php bin/magento module:enable Ceymox_TypesenseSearch - to enable extension.

php bin/magento setup:upgrade - to install the extension.

php bin/magento setup:di:compile - to compile the code.

php bin/magento setup:static-content:deploy - to deploy static view files.

php bin/magento cache:clean - to clean the cache.

## Configuration 

### General Setup 

In order to connect Magento with Typesense Cloud, we will need to configure the following settings:

From the Magento Admin panel, click on:

Store > Configuration > Typesense Search > General > General Configuration

![Typesense Configuration](~@images/magento2/configuration.png)

You can get the typesense credentials from [Typesense Cloud Dashboard](https://cloud.typesense.org/login)

![Typesense API Keys Generate](~@images/magento2/api_key_generate.png)

#### Cloud Key

Cloud key generated from [Typesense Account](https://cloud.typesense.org/signup)

#### Search-only (public) API key

Search-only (public) API key from [Typesense Account](https://cloud.typesense.org/signup) 

#### Admin API key

Admin API key from [Typesense Account](https://cloud.typesense.org/signup)

#### Index Name Prefix

Prefix for typesense collection

#### Nearest Node

[Nearest Node](https://typesense.org/docs/guide/typesense-cloud/search-delivery-network.html#how-it-help) for your typesense cloud.

#### Node

Here you can specify your server node if it is your multinode you can specify it as comma separated.

#### Protocol

Protocol for the account default value HTTPS.

#### Port

Port for Typesense cloud server.

### Autocomplete Menu

Here you can manage the search popup section.

### Instant Search Result Page

You can manage the category listing and search result page from here.

### Products

In this section, you manage the products related search configurations.

### Categories

This option manages the categories related to search configurations.

### Semantic Search

Inclusive of all these configurations typesense supports the ability to implement semantic search. Semantic search helps retrieve results that are conceptually related to a user's query. We can turn normal search into Semantic search by embedding the fields with appropriate AI models. In this Typesense Magento module, we have implemented S-BERT and GTE models.

Want to know more information regarding how to implement semantic search in a few steps follow [Semantic Search](https://typesense.org/docs/guide/semantic-search.html#use-case) in the Typesense doc.

To configure semantic search from the Magento Admin panel click on,

Store > Configuration > Typesense Search > Semantic Search > Semantic Search

![Typesense Semantic Search](~@images/magento2/semantic_search.png)

#### Enable

It enables the Semantic search.

#### Enable Hybrid Search 

Here we can enable Hybrid search (so we can perform a search with embedding along with searchable attributes).

#### Integration Types

Here you can choose which tool to use to create embeddings.

#### Integration Model 

Model for the embeddings.

#### Field to be Embedded 

Here we can choose which fields to be embedded in the AI models.

Know more about [Semantic Search](https://typesense.org/docs/guide/semantic-search.html#use-case) from the Typesense doc.

### ndexing Queue/Cron

In this section, we can index data to typesense.

### Synonyms

Here we can manage the Synonyms.

### Typo Tolerance

In this section, we can manage the Typo Tolerance in the search


So yes, all set to go !!

To implement the Typesense search for Magento there are many more configurations needed. Read completely about the Typesense Magento Module configurations from the [Implementation Guide](https://ceymox.com/doc/typesense-search-for-magento-implementation-guide.html) and implement the same.