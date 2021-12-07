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
 
 ## Deploy a Typesense cluster to Docker Swarm  

To Deploy a Typesense cluster to Docker Swarm, follow these steps:

- Initialize Docker Swarm. For example, in a 4 node setup, target docker engine on one of the nodes to act as a manager

```shell  
docker swarm init --advertise-addr $(hostname -i)
Swarm initialized: current node (6082x127zz98f0pwgjexbv5xp) is now a manager.
   
To add a worker to this swarm, run the following command:

docker swarm join --token SWMTKN-1-30txqn35hmpwjpk2qq2zmled1rf94pcft2nbhsb0ckleco9pb2-bjh6oh9yz3vk58uimd6v3jjky 192.168.0.25:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

- Add docker instance on rest of the nodes to existing Swarm as node. Repeat the below command on all nodes

```shell
docker swarm join --token SWMTKN-1-30txqn35hmpwjpk2qq2zmled1rf94pcft2nbhsb0ckleco9pb2-bjh6oh9yz3vk58uimd6v3jjky 192.168.0.25:2377
This node joined a swarm as a worker.

```

- Create a new nodes file on each node that's part of the Swarm 

```shell
mkdir typesense && cd typesense && echo 'typesense-1:8107:8108,typesense-2:7107:7108,typesense-3:9107:9108' | sudo tee nodes
```

- Create data folder on all the nodes

 ```shell
 mkdir /tmp/typesense-data-1/ &&  mkdir /tmp/typesense-data-2/ && mkdir /tmp/typesense-data-3/
 ```

- Show Swarm members

 ```shell   
docker node ls
ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
z1n71a3h0bw7clclw22i5f0ys     node1      Ready     Active                          20.10.0
xm1h48xsgzzqftvqaod0nx673     node2      Ready     Active                          20.10.0
mde8zbj3bsqrvwk02529cm3le     node3      Ready     Active                          20.10.0
6082x127zz98f0pwgjexbv5xp *   node4      Ready     Active         Leader           20.10.0
```

- Create a file on the master Swarm node for the docker compose file:

```shell    
cd typesense && touch docker-stack.yml
```

- Content for docker-stack.yml

```yaml

version: "3.8"
services:
  typesense-1:
    image: typesense/typesense:0.21.0
    hostname: typesense-1
    volumes:
      - /tmp/typesense-data-1/:/data
      - ./nodes:/nodes
    ports:
      - 8108:8108
      - 8107:8107
    command: ["--data-dir", "/data","--api-key", "xyz","--nodes","/nodes","--peering-port","8107","--api-port","8108","--enable-cors"]
    deploy:
      replicas: 1
      labels:
        feature.description: “typesense-1”
      restart_policy:
        condition: any
      placement:
        constraints: [node.role == worker]

  typesense-2:
    image: typesense/typesense:0.21.0
    hostname: typesense-2
    volumes:
      - /tmp/typesense-data-2/:/data
      - ./nodes:/nodes
    ports:
      - 7108:7108
      - 7107:7107
    command: ["--data-dir", "/data","--api-key", "xyz","--nodes","/nodes","--peering-port","7107","--api-port","7108","--enable-cors"]
    deploy:
      replicas: 1
      labels:
        feature.description: “typesense-2”
      restart_policy:
        condition: any
      placement:
        constraints: [node.role == worker]

  typesense-3:
    image: typesense/typesense:0.21.0
    hostname: typesense-3
    volumes:
      - /tmp/typesense-data-3/:/data
      - ./nodes:/nodes
    ports:
      - 9108:9108
      - 9107:9107
    command: ["--data-dir", "/data","--api-key", "xyz","--nodes","/nodes","--peering-port","9107","--api-port","9108","--enable-cors"]
    deploy:
      replicas: 1
      labels:
        feature.description: “typesense-3”
      restart_policy:
        condition: any
      placement:
        constraints: [node.role == worker]
 ```

- Deploy the stack from Swarm master node

```shell
docker stack deploy --compose-file docker-stack.yml ts
```

- List the tasks that are part of the deployed stack

```shell 
docker stack ps ts
ID             NAME               IMAGE                        NODE      DESIRED STATE   CURRENT STATE           ERROR     PORTS
x4w38438c7bn   ts_typesense-1.1   typesense/typesense:0.21.0   node2     Running         Running 5 minutes ago
0iacq1bhw1ia   ts_typesense-2.1   typesense/typesense:0.21.0   node1     Running         Running 5 minutes ago
wqyec57a3d4o   ts_typesense-3.1   typesense/typesense:0.21.0   node3     Running         Running 5 minutes ago
```
