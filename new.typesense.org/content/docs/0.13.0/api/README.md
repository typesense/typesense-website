# API 0.13.0

## Introduction

Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo aliquid eveniet libero, numquam quis quos?

## Using the Meta

Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo dicta maiores tenetur amet ratione id beatae mollitia quos corrupti. Similique nihil commodi reiciendis odio quia!

> This is just random text

I hope you will **like** 💟 it.

## API clients

At the moment, we have API clients for Javascript, Python, and Ruby.

We recommend that you use our API client library if it is available for your language.

<Tabs :tabs="['Ruby', 'Python', 'Javascript']">
  <template v-slot:Ruby>

```bash
gem install typesense
```

  </template>

  <template v-slot:Python>

```bash
pip install typesense
```

  </template>

  <template v-slot:Javascript>

```bash
# Node.js
npm install typesense
```

```html
<!-- Browser -->
<script src="dist/typesense.min.js"></script>
```

  </template>
</Tabs>

If you're using our Javascript client to access Typesense directly from the browser, be sure to start the Typesense server with the `--enable-cors` flag.

## Authentication

<Tabs :tabs="['Ruby', 'Python', 'Javascript', 'Shell']">
  <template v-slot:Ruby>

```ruby
require 'typesense'

client = Typesense::Client.new(
  nodes: [
    {
      host:     'localhost',
      port:     8108,
      protocol: 'http'
    }
  ],

  api_key:  '<API_KEY>',
  connection_timeout_seconds: 2
)
```

  </template>

  <template v-slot:Python>

```python
import typesense

client = typesense.Client({
  'nodes': [{
    'host': 'localhost',
    'port': '8108',
    'protocol': 'http',
  }],

  'api_key': '<API_KEY>',
  'connection_timeout_seconds': 2
})
```

  </template>

  <template v-slot:Javascript>

```js
/*
 *  Our Javascript client library works on both the client and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */
let client = new Typesense.Client({
  'nodes': [{
    'host': 'localhost',
    'port': '8108',
    'protocol': 'http',
  }],

  'apiKey': '<API_KEY>'
  'connectionTimeoutSeconds': 2
})
```

  </template>

  <template v-slot:Shell>

```bash
# API authentication is done via the `X-TYPESENSE-API-KEY` HTTP header.
curl -H "X-TYPESENSE-API-KEY: <API_KEY>" "http://localhost:8108/collections"
```

  </template>
</Tabs>
