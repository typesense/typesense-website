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

We also have the following community-contributed client libraries:

- [Go](https://github.com/typesense/typesense-go)
- [.Net](https://github.com/DAXGRID/typesense-dotnet)
- [Java](https://github.com/typesense/typesense-java)
- [Rust](https://github.com/typesense/typesense-rust)
- [Dart](https://github.com/typesense/typesense-dart)
- [Perl](https://github.com/Ovid/Search-Typesense)

We also have the following community-contributed framework integrations:

- [Symfony](https://github.com/acseo/TypesenseBundle)
- [Laravel](https://github.com/typesense/laravel-scout-typesense-engine)
- [Wordpress](https://github.com/typesense/typesense-wordpress-plugin)

<br>

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart']">
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
//   typesense: ^0.1.1

// Now in your Dart code, you can use:

import 'package:typesense/typesense.dart';
```

  </template>
</Tabs>

## Postman Collection

We have a community-maintained Postman Collection here: [https://github.com/typesense/postman](https://github.com/typesense/postman).

[Postman](https://www.postman.com/downloads/) is an app that let's you perform HTTP requests by pointing and clicking, instead of having to type them out in the terminal. 
The Postman Collection above gives you template requests that you can import into Postman, to quickly make API calls to Typesense.
