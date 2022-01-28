# High Availability

You can run a cluster of Typesense nodes for high availability. Typesense uses the Raft consensus algorithm to manage the cluster and recover from node failures.

Since Raft requires a quorum for consensus, you need to run a ***minimum of 3 nodes*** to tolerate a 1-node failure. Running a 5-node cluster will tolerate failures of up to 2 nodes, but at the expense of slightly higher write latencies. Therefore, we recommend running a 3-node Typesense cluster.

:::tip
In [Typesense Cloud](https://cloud.typesense.org), we manage High Availability for you, when you flip the setting ON when launching the cluster. So the rest of this section only applies if you are self-hosting Typesense.
:::

## Configuring a Typesense cluster

To start a Typesense node as part of a cluster, create a new file on each node that's part of the cluster with the following format, and use the `--nodes` server configuration to point to the file.

Each node definition in the file should be in the following format, separated by commas:

`<peering_address>:<peering_port>:<api_port>`

These values should match the corresponding <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">Server Configuration Parameters</RouterLink> used when starting the Typesense process on each node.

### Example

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

## Client configuration

Typesense clients allow you to specify one or more nodes during client initialization.

Client libraries will load balance reads and writes across all nodes and will automatically strive to recover from transient failures through built-in retries.

Here's a sample 3-node client configuration:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Dart']">

  <template v-slot:PHP>

```php
use Typesense\Client;

$client = new Client(
  [
    'nodes' => [ 
      [
        'host'     => '93.184.216.34',  // Can be an IP or more commonly a hostname mapped to the IP
        'port'     => 443, 
        'protocol' => 'https'
      ],
      [
        'host'     => '93.184.216.35',  // Can be an IP or more commonly a hostname mapped to the IP
        'port'     => 443, 
        'protocol' => 'https'
      ],
      [
        'host'     => '93.184.216.36',  // Can be an IP or more commonly a hostname mapped to the IP
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
      host:     '93.184.216.34', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     '93.184.216.35', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     '93.184.216.36', # Can be an IP or more commonly a hostname mapped to the IP
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
      host:     '93.184.216.34', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     '93.184.216.35', # Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     '93.184.216.36', # Can be an IP or more commonly a hostname mapped to the IP
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
      host:     '93.184.216.34', // Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     '93.184.216.35', // Can be an IP or more commonly a hostname mapped to the IP
      port:     443,
      protocol: 'https'
    },
    {
      host:     '93.184.216.36', // Can be an IP or more commonly a hostname mapped to the IP
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
        host: '93.184.216.34', // Can be an IP or more commonly a hostname mapped to the IP
        port: 443,
        protocol: 'https',
      ),
      Node(
        host: '93.184.216.35', // Can be an IP or more commonly a hostname mapped to the IP
        port: 443,
        protocol: 'https',
      ),
      Node(
        host: '93.184.216.36', // Can be an IP or more commonly a hostname mapped to the IP
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
 
 
