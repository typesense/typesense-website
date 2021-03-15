# Installing a client

We have client libraries for:

- [JavaScript](https://github.com/typesense/typesense-js)
- [Python](https://github.com/typesense/typesense-python)
- [Ruby](https://github.com/typesense/typesense-ruby)

We also have the following community-contributed client libraries:

- [Go](https://github.com/typesense/typesense-go)
- [C#](https://github.com/DAXGRID/typesense-dotnet)

We recommend that you use our API client if it's available for your language. It's also easy to interact with Typesense through its simple, RESTful HTTP API.

<Tabs :tabs="['JavaScript','Python','Ruby']">
  <template v-slot:JavaScript>

```js
// npm install typesense

// Browser
<script src="dist/typesense.min.js"></script>
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
