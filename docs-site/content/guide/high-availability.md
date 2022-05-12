# High Availability

You can run a cluster of Typesense nodes for high availability. 
Typesense uses the Raft consensus algorithm to manage the cluster and recover from node failures.

In cluster mode, Typesense will automatically replicate copies of the data to all nodes in the cluster. 
Read and write API calls can be sent to any nodes in the cluster - 
read API calls will be served by the node that receives it, write API calls are automatically forwarded to the leader of the cluster internally. 

Since Raft requires a quorum for consensus, you need to run a ***minimum of 3 nodes*** to tolerate a 1-node failure. Running a 5-node cluster will tolerate failures of up to 2 nodes, but at the expense of slightly higher write latencies.

:::tip
In [Typesense Cloud](https://cloud.typesense.org), we manage High Availability for you, when you flip the setting ON when launching the cluster. So the rest of this section only applies if you are self-hosting Typesense.
:::

## Configuring a Typesense cluster

To start a Typesense node as part of a cluster, create a new file on each node that's part of the cluster with the following format, and use the [`--nodes` server configuration](../latest/api/server-configuration.md) to point to the file.

Each node definition in the file should be in the following format, separated by commas:

`<peering_address>:<peering_port>:<api_port>`

`peering_address`, `peering_port` and `api_port` should match the corresponding <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">Server Configuration Parameters</RouterLink> used when starting the Typesense process on each node.

All nodes in the cluster should have the same bootstrap `--api-key` for security purposes.

### Nodes File Example

Here's an example of a `--nodes` file for a 3-node cluster:

<Tabs :tabs="['nodes']">
  <template v-slot:nodes>

```
192.168.12.1:8107:8108,192.168.12.2:8107:8108,192.168.12.3:8107:8108
```

  </template>
</Tabs>

In the example above
- The `peering_address` (the IP address used for cluster operations) is `192.168.12.x`
- The `peering_port` (the port used for cluster operations) is `8107`
- The `api_port` (the actual port to which clients connect to) is `8108`

Here's the corresponding command to start the Typesense process on each node:

<Tabs :tabs="['Node1', 'Node2', 'Node3']">
  <template v-slot:Node1>

```shell
# Create nodes file
#   This file is identical on all nodes
echo '192.168.12.1:8107:8108,192.168.12.2:8107:8108,192.168.12.3:8107:8108' | sudo tee /etc/typesense/nodes

# Start Typesense Process
#   * Notice `peering-address` *
typesense-server \
  --data-dir /var/lib/typesense \
  --api-key=xyz \
  --api-address 0.0.0.0 \
  --api-port 8108 \
  --peering-address 192.168.12.1 \
  --peering-port 8107 \
  --nodes=/etc/typesense/nodes
```

  </template>

  <template v-slot:Node2>

```shell
# Create nodes file
#   This file is identical on all nodes
echo '192.168.12.1:8107:8108,192.168.12.2:8107:8108,192.168.12.3:8107:8108' | sudo tee /etc/typesense/nodes

# Start Typesense Process
#   ** Notice `peering-address` **
typesense-server \
  --data-dir /var/lib/typesense \
  --api-key=xyz \
  --api-address 0.0.0.0 \
  --api-port 8108 \
  --peering-address 192.168.12.2 \
  --peering-port 8107 \
  --nodes=/etc/typesense/nodes
```

  </template>

<template v-slot:Node3>

```shell
# Create nodes file
#   This file is identical on all nodes
echo '192.168.12.1:8107:8108,192.168.12.2:8107:8108,192.168.12.3:8107:8108' | sudo tee /etc/typesense/nodes

# Start Typesense Process
#   *** Notice `peering-address` ***
typesense-server \
  --data-dir /var/lib/typesense \
  --api-key=xyz \
  --api-address 0.0.0.0 \
  --api-port 8108 \
  --peering-address 192.168.12.3 \
  --peering-port 8107 \
  --nodes=/etc/typesense/nodes
```

  </template>
</Tabs>

:::warning IMPORTANT
- `--peering-address` should be a **Private IP address**, since it is only meant for internal cluster operations and contains unencrypted Raft data that is exchanged between nodes.

- `--api-address` can be a public or private IP address. This is the IP address that your end users/clients will connect to interact with the Typesense API.

- We strongly recommend setting `--api-port` to 443 (HTTPS) in a production setting, and configuring SSL certs using the `--ssl-certificate` and `--ssl-certificate-key` server parameters. 
:::

:::tip
If you are using Docker, make sure that you've configured the Docker network in such a way that the Typesense process within the Docker container can communicate with the other Typesense processes using their IP addresses.
Read more about [Docker Networking](https://docs.docker.com/network/).
:::

## Verifying Cluster Formation

Once you've setup all the nodes in a cluster, you can verify that they've successfully formed a cluster by sending a GET request to the `/debug` endpoint of each node:

```shell
curl "http://${TYPESENSE_HOST}/debug/" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

On one of the nodes you should see the following response:

```json
{
  "state": 1,
  "version": "x.x.x"
}
```

where `state: 1` indicates that this is the node that was elected to be the leader.

All the other nodes should return a response of:

```json
{
  "state": 4,
  "version": "x.x.x"
}
```

where `state: 4` indicates that the node was selected to be a follower.

If you see `state: 1` on more than one node, that indicates that the cluster was not formed properly. Check the Typesense logs (usually in `/var/log/typesense/typesense.log`) for more diagnostic information. Ensure that the nodes can talk to each other on the ports you've configured as the HTTP port and the Peering port. 

If you see a value other than `state: 4` or `state: 1` that indicates an error. Check the Typesense logs (usually in `/var/log/typesense/typesense.log`) for more diagnostic information.


## Client configuration

Typesense clients allow you to specify one or more nodes during client initialization.

Client libraries will load balance reads and writes across all nodes and will automatically strive to recover from transient failures through built-in retries.
So there you do not need a server-side load balancer when deploying Typesense.

Here's a sample 3-node client configuration:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart']">

  <template v-slot:PHP>

```php
use Typesense\Client;

$client = new Client(
  [
    'nodes' => [ 
      [
        'host'     => 'x.x.x.x',  // Can be an IP or more commonly a hostname mapped to the IP
        'port'     => 443, 
        'protocol' => 'https'
      ],
      [
        'host'     => 'y.y.y.y',  // Can be an IP or more commonly a hostname mapped to the IP
        'port'     => 443, 
        'protocol' => 'https'
      ],
      [
        'host'     => 'z.z.z.z',  // Can be an IP or more commonly a hostname mapped to the IP
        'port'     => 443, 
        'protocol' => 'https'
      ],
    ],
    'api_key' => '<API_KEY>',
    'connection_timeout_seconds' => 2,
  ]
);
```
  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  nodes: [
    {
      host:     'x.x.x.x', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     'y.y.y.y', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     'z.z.z.z', # Can be an IP or more commonly a hostname mapped to the IP
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
      host:     'x.x.x.x', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     'y.y.y.y', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     'z.z.z.z', # Can be an IP or more commonly a hostname mapped to the IP
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
      host:     'x.x.x.x', // Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     'y.y.y.y', // Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     'z.z.z.z', // Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    }
  ],
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

  </template>
  <template v-slot:Dart>

```dart
import 'package:typesense/typesense.dart';

final config = Configuration(
    nodes: {
      Node(
        host: 'x.x.x.x', // Can be an IP or more commonly a hostname mapped to the IP
        port: 443,
        protocol: 'https',
      ),
      Node(
        host: 'y.y.y.y', // Can be an IP or more commonly a hostname mapped to the IP
        port: 443,
        protocol: 'https',
      ),
      Node(
        host: 'z.z.z.z', // Can be an IP or more commonly a hostname mapped to the IP
        port: 443,
        protocol: 'https',
      ),
    },
    apiKey: '<API_KEY>',
    connectionTimeout: Duration(seconds: 2),
  );
```

  </template>
</Tabs>
