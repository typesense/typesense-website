# API Clients
At the moment, we have clients for Javascript, PHP, Python, Ruby.

We recommend that you use our API client if it's available for your language.

<Tabs :tabs="['JavaScript','Php','Python','Ruby']">
  <template v-slot:JavaScript>

```js
// Node.js
npm install typesense

// Browser
<script src="dist/typesense.min.js"></script>
```

  </template>

  <template v-slot:Php>

```php
composer require typesense/typesense-php
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

If you're using our Javascript client to access Typesense directly from the browser, be sure to start the Typesense server with the `--enable-cors` flag.