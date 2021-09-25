---
sitemap:
  priority: 0.7
---

# High Availability

You can run a cluster of Typesense nodes for high availability. Typesense uses the Raft consensus algorithm to manage the cluster and recover from node failures.

:::tip
Since Raft requires a quorum of nodes for consensus, you need to run a ***minimum of 3 nodes*** to tolerate a 1-node failure. Running a 5-node cluster will tolerate failures of up to 2 nodes, but at the expense of higher write latencies. Therefore, we recommend running a 3-node Typesense cluster.
:::

:::tip
In Typesense Cloud, we manage High Availability for you, when you flip the setting ON when launching the cluster. So the rest of this section only applies if you're self-hosting Typesense.
:::

## Configuring a Typesense cluster

To start a Typesense node as part of a cluster, use the `--nodes` argument to point to a file that contains a comma separated string of all nodes in the cluster.

Each node definition should be in the following format:

`<ip_address>:<peering_port>:<api_port>`

Example content of a `--nodes` file for a 3-node cluster:

<Tabs :tabs="['Config']">
  <template v-slot:Config>

```
192.168.12.1:8107:8108,192.168.12.2:8107:8108,192.168.12.3:8107:8108
```

  </template>
</Tabs>

In the example above, the peering port (i.e. the port used for cluster operations) is `8107` and the API port (the actual port to which clients connect to) is `8108`.

## Client configuration

Typesense clients allow you to specify one or more nodes during client initialization.

Client libraries will load balance reads and writes across all nodes and will automatically strive to recover from transient failures through built-in retries.

Here's a sample 3-node client configuration:

<Tabs :tabs="['Ruby','Python','JavaScript']">
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  nodes: [
    {
      host:     '192.168.0.50',
      port:     443,
      protocol: 'https'
    },
    {
      host:     '192.168.0.51',
      port:     443,
      protocol: 'https'
    },
    {
      host:     '192.168.0.52',
      port:     443,
      protocol: 'https'
    }
  ],
  api_key:  '<API_KEY>',
  connection_timeout_seconds: 2
)
```

  </template>
  <template v-slot:Python>

```py
import typesense

client = typesense.Client({
  'nodes': [
    {
      host:     '192.168.0.50',
      port:     443,
      protocol: 'https'
    },
    {
      host:     '192.168.0.51',
      port:     443,
      protocol: 'https'
    },
    {
      host:     '192.168.0.52',
      port:     443,
      protocol: 'https'
    }
  ],
  'api_key': '<API_KEY>',
  'connection_timeout_seconds': 2
})
```

  </template>
  <template v-slot:JavaScript>

```js
let client = new Typesense.Client({
  'nodes': [
    {
      host:     '192.168.0.50',
      port:     443,
      protocol: 'https'
    },
    {
      host:     '192.168.0.51',
      port:     443,
      protocol: 'https'
    },
    {
      host:     '192.168.0.52',
      port:     443,
      protocol: 'https'
    }
  ],
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

  </template>
</Tabs>
