# API Clients

We have client libraries for:

- [JavaScript](https://github.com/typesense/typesense-js)
- [PHP](https://github.com/typesense/typesense-php)
- [Python](https://github.com/typesense/typesense-python)
- [Ruby](https://github.com/typesense/typesense-ruby)

We also have the following community-contributed client libraries:

- [Go](https://github.com/typesense/typesense-go)
- [C#](https://github.com/DAXGRID/typesense-dotnet)

We recommend that you use our API client if it's available for your language. It's also easy to interact with Typesense through its simple, RESTful HTTP API.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```js
// Node.js
npm install typesense @babel/runtime

// Browser
<script src="dist/typesense.min.js"></script>
```

  </template>

  <template v-slot:PHP>

```php
composer require php-http/curl-client typesense/typesense-php
```

  </template>
  <template v-slot:Python>

```py
pip install typesense
```

  </template>
  <template v-slot:Ruby>

```rb
gem install typesense
```

  </template>
</Tabs>

If you're using our JavaScript client to access Typesense directly from the browser, be sure to start the Typesense server with the `--enable-cors` flag.
