# Installing a client
At the moment, we have clients for JavaScript, PHP, Python, Ruby.

We recommend that you use our API client if it's available for your language. It's also easy to interact with Typesense through its simple, RESTful HTTP API.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```js
// npm install typesense

// Browser
<script src="dist/typesense.min.js"></script>
```

  </template>

  <template v-slot:PHP>

```shell
composer require typesense/typesense-php
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
</Tabs>
