---
sitemap:
  priority: 0.7
---

# API Clients

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

We also have the following community-contributed framework integrations:

- [Symfony](https://github.com/acseo/TypesenseBundle)
- [Laravel](https://github.com/typesense/laravel-scout-typesense-engine)

:::tip
If you don't see an official client in your language, you can still use any HTTP library / package in your language to make API calls to Typesense's REStful API.
:::

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
