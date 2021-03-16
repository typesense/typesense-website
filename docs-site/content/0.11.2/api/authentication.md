# Authentication

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
/*
 *  Our Javascript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */
let client = new Typesense.Client({
  'masterNode': {
    'host': 'localhost',
    'port': '8108',
    'protocol': 'http',
    'apiKey': '<API_KEY>'
  },
  'readReplicaNodes': [{
    'host': 'read_replica_1',
    'port': '8108',
    'protocol': 'http',
    'apiKey': '<API_KEY>'
  }],
  'timeoutSeconds': 2
})
```

  </template>

  <template v-slot:Python>

```py
import typesense

client = typesense.Client({
  'master_node': {
    'host': 'localhost',
    'port': '8108',
    'protocol': 'http',
    'api_key': '<API_KEY>'
  },
  'read_replica_nodes': [{
    'host': 'read_replica_1',
    'port': '8108',
    'protocol': 'http',
    'api_key': '<API_KEY>'
  }],
  'timeout_seconds': 2
})
```

  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  master_node: {
    host:     'localhost',
    port:     8108,
    protocol: 'http',
    api_key:  '<API_KEY>'
  },

  read_replica_nodes: [
    {
      host:     'read_replica_1',
      port:     8108,
      protocol: 'http',
      api_key:  '<API_KEY>'
    }
  ],

  timeout_seconds: 2
)
```

  </template>
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY='<API_KEY>'
export TYPESENSE_MASTER='http://localhost:8108'
```

  </template>
</Tabs>
