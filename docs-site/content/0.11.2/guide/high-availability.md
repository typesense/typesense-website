---
sitemap:
  priority: 0.3
---

# High Availability

You can run one or more Typesense servers as read-only replicas that asynchronously pull data from a master Typesense server. This way, if your primary Typesense server fails, search requests can be sent to the replicas.

## Server configuration

To start Typesense as a read-only replica, pass the master Typesense server's address via the `--master` argument:

`--master=http(s)://<master_address>:<master_port>`

:::tip
The master Typesense server maintains a replication log for 24 hours. If you are pointing the replica to a master instance that has been running for longer than 24 hours, you need to first stop the master, take a copy of the data directory and then then start the replica server by pointing to this backup data directory.
:::

<Tabs :tabs="['Ruby','Python','JavaScript']">
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
  <template v-slot:JavaScript>

```js
let client = new Typesense.Client({
  'masterNode': {
    'host': 'master',
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
</Tabs>
