---
sitemap:
  priority: 0.7
---

# API Clients

## Libraries

The following client libraries are thin wrappers around Typesense's RESTful APIs and provide an idiomatic way to make Typesense API calls from your preferred language.

:::tip
Typesense has a RESTful API so it can be used with any HTTP library in any programming language, even the ones not listed below. The client libraries are just thin wrappers around Typesense's HTTP API.
:::

We have client libraries for:

- [JavaScript](https://github.com/typesense/typesense-js)
- [PHP](https://github.com/typesense/typesense-php)
- [Python](https://github.com/typesense/typesense-python)
- [Ruby](https://github.com/typesense/typesense-ruby)

We also have the following community-maintained client libraries:

- [Go](https://github.com/typesense/typesense-go)
- [.Net](https://github.com/DAXGRID/typesense-dotnet)
- [Java](https://github.com/typesense/typesense-java)
- [Rust](https://github.com/typesense/typesense-rust)
- [Dart](https://github.com/typesense/typesense-dart)
- [Perl](https://github.com/Ovid/Search-Typesense)
- [Swift](https://github.com/typesense/typesense-swift)
- [Clojure](https://github.com/runeanielsen/typesense-clj)
- [python orm client](https://github.com/RedSnail/typesense_orm)
- [PHP SEAL Adapter](https://github.com/schranz-search/seal-typesense-adapter)

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart', 'Java', 'Swift']">
  <template v-slot:JavaScript>

```js
// npm install typesense @babel/runtime

// Browser
<script src="dist/typesense.min.js"></script>
```

  </template>

  <template v-slot:PHP>

```shell
composer require php-http/curl-client typesense/typesense-php
```

  </template>
  <template v-slot:Python>

```shell
pip install typesense
```

  </template>
  <template v-slot:Ruby>

```shell
gem install typesense
```

  </template>
  <template v-slot:Dart>

```dart
// With Dart:
//  $ dart pub add typesense

// With Flutter:
//  $ flutter pub add typesense

// This will add a line like this to your package's pubspec.yaml:
// dependencies:
//   typesense: ^0.3.0

// Now in your Dart code, you can use:

import 'package:typesense/typesense.dart';
```

  </template>
  <template v-slot:Java>

```java
// Download the JAR file from the releases section in the typesense-java repository. 
// (https://github.com/typesense/typesense-java/releases)
// And the import it them to your project

import org.typesense.api.*;
import org.typesense.models.*;
import org.typesense.resources.*;
```

  </template>
  <template v-slot:Swift>

```swift
// For an iOS app, add typesense-swift as a framework dependency:
// Target -> General -> Frameworks, Libraries, and Embedded Content -> "+" -> Add Package Dependency -> typesense-swift

//For swift packages, add typesense-swift to the dependencies array in Package.swift:
...
dependencies: [
           .package(url: "https://github.com/typesense/typesense-swift", .upToNextMajor(from: "0.1.0"),
],
...
```

  </template>
</Tabs>

## Postman Collection

We have a community-maintained Postman Collection here: [https://github.com/typesense/postman](https://github.com/typesense/postman).

[Postman](https://www.postman.com/downloads/) is an app that let's you perform HTTP requests by pointing and clicking, instead of having to type them out in the terminal. 
The Postman Collection above gives you template requests that you can import into Postman, to quickly make API calls to Typesense.

## Framework Integrations

We also have the following framework integrations:

- [Laravel](https://github.com/typesense/laravel-scout-typesense-engine)
- [Firebase](https://github.com/typesense/firestore-typesense-search)
- [Gatsby](https://www.gatsbyjs.com/plugins/gatsby-plugin-typesense/)
- [WordPress](https://wordpress.org/plugins/search-with-typesense/?ref=typesense)
- [WooCommerce](https://www.codemanas.com/downloads/typesense-search-for-woocommerce/?ref=typesense)
- [Symfony](https://github.com/acseo/TypesenseBundle)
- [InstantSearch](https://github.com/typesense/typesense-instantsearch-adapter)
- [DocSearch](https://typesense.org/docs/guide/docsearch.html)
- [Docusaurus](https://github.com/typesense/docusaurus-theme-search-typesense)
- [ToolJet](https://tooljet.com/?ref=typesense)
- [Plone CMS](https://pypi.org/project/zopyx.typesense/)
- [Craft CMS](https://plugins.craftcms.com/typesense)
- [SEAL](https://github.com/schranz-search/schranz-search) provides integrations of Typesense in Laravel, Symfony, Spiral, Yii and Laminas Mezzio PHP Framework

## Utilities

We also have the following utilities:

- [Generate Sitemaps from Typesense data](https://github.com/adviise/typesense-sitemap)
- [typesense-cli](https://github.com/AlexBV117/typesense-cli)
