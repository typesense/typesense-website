# High Availability

You can run a cluster of Typesense nodes for high availability.
Typesense uses the Raft consensus algorithm to manage the cluster and recover from node failures.

In cluster mode, Typesense will automatically replicate your entire dataset to all nodes in the cluster, automatically and continuously.
Read and write API calls can be sent to any nodes in the cluster -
read API calls will be served by the node that receives it, write API calls are automatically forwarded to the leader of the cluster internally.

Since Raft requires a quorum for consensus, you need to run a **_minimum of 3 nodes_** to tolerate a 1-node failure. Running a 5-node cluster will tolerate failures of up to 2 nodes, but at the expense of slightly higher write latencies.

[[toc]]

## High Availability in Typesense Cloud

In [Typesense Cloud](https://cloud.typesense.org), we manage High Availability for you.

When you flip the setting ON when launching a cluster, you'll see a special Load Balanced endpoint in addition to the individual hostnames\*, in your cluster dashboard:

<img src="~@images/high-availability/ha-hostnames.png" height="350" width="367" alt="Typesense Cloud HA Hostnames">

Requests sent to the Load-Balanced endpoint are distributed between all the 3 nodes in the cluster.
If a particular node has an infrastructure issue, or is inaccessible for any reason, it is automatically quarantined and traffic is re-routed to the other healthy nodes.

::: warning Note

You will only see the Load Balanced endpoint for HA clusters provisioned after **June 16, 2022**.

For HA clusters provisioned **before June 16, 2022**, you will only see the individual hostnames. Health-checking and traffic re-routing are done client-side in our official client libraries.
See [Client Configuration](#client-configuration) below.

To enable server-side load balancing on your existing clusters, open your Cluster Dashboard, go to Cluster Configuration, select Modify, toggle Load Balancing ON, and schedule the change.
After that, configure your client libraries to use the `nearestNode` parameter as described under [Client Configuration](#client-configuration) below.
:::

## High Availability when Self-Hosting Typesense

### Configuring a Typesense cluster

To start a Typesense node as part of a cluster, create a new file on each node that's part of the cluster with the following format, and use the [`--nodes` server configuration](../latest/api/server-configuration.md) to point to the file.

Each node definition in the file should be in the following format, separated by commas:

`<peering_address>:<peering_port>:<api_port>`

`peering_address`, `peering_port` and `api_port` should match the corresponding <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">Server Configuration Parameters</RouterLink> used when starting the Typesense process on each node.

All nodes in the cluster should have the same bootstrap `--api-key` for security purposes.

#### Nodes File Example

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

### Verifying Cluster Formation

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

### Recovering a single failed node

When running a highly available Typesense cluster and one of your nodes goes down, the recovery process is straightforward:

1. Stop the Typesense process if it's still running
2. Clear the data directory on the failed node
3. Start the Typesense service back up on that node

The node will automatically synchronize all necessary data from the other healthy nodes in the cluster. 
Typesense's built-in replication mechanism will ensure that your recovered node catches up with the current state of your data.

:::tip
There's no need to perform any manual snapshot operations or restore backups for this scenario. Letting Typesense handle the synchronization is both faster and more reliable.
:::

### Recovering a cluster that has lost quorum

A Typesense cluster with N nodes can tolerate a failure of at most `(N-1)/2` nodes without affecting reads or writes.

So for example:

- A 3 node cluster can handle a loss of 1 node.
- A 5 node cluster can handle a loss of 2 nodes.

If a Typesense cluster loses more than `(N-1)/2` nodes at the same time, the cluster becomes unstable because it loses quorum and the remaining node(s) cannot safely build consensus on which node is the leader.
To avoid a potential split brain issue, Typesense then stops accepting writes and reads until some manual verification and intervention is done.

To recover a cluster that has lost quorum:

1. Force one of the nodes to become a single-node cluster by editing its nodes file to contain just its own IP address.

   You don't have to restart the Typesense process, since changes to the nodes file are automatically picked up within 30s.

2. Wait for this node to return ok when you call it's `/health` endpoint.
3. Edit the nodes file on this single node to now contain its own IP address and also the IP address of a 2nd node.
4. Edit the nodes file on the 2nd node to now contain the IP address of the 1st node and the 2nd node, and start the Typesense process on the 2nd node.

   This will get the 2nd node to sync data from the 1st node. If the 2nd node had fallen behind the first node by too much, you might have to clear the data dir from the 2nd node before starting the 2nd node back up, which will get the 2nd node to sync a fresh snapshot of the data from the first node.

5. Wait for the 2nd node to return ok when you call it's `/health` endpoint.

   At this stage, both the 1st and 2nd nodes should be healthy.

6. Repeat steps 3-5 for each additional node, by adding each new node's IP address to the nodes files of all the nodes (existing ones and the new one you're about to add), and start the new node up.

### When to use Snapshot Restore

<p>
<RouterLink :to="`/${this.$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#create-snapshot-for-backups`">Snapshot</RouterLink> restoration becomes valuable primarily during major disaster recovery scenarios.
</p>

For example, if for some reason all three nodes in your cluster fail simultaneously due to some freak incident and all data is lost across the entire cluster, you'll need to rely on your backups.

In this disaster recovery scenario, follow these steps:

1. Take your most recent snapshot backup.
2. Start a single Typesense node using this snapshot.
3. Once the first node is up and stable, add a second node with an empty data directory (by adding it's IP to the nodes file of the first node and this new node) and let it fully synchronize from the first node
4. Finally, start a third node (and adds its IP to all 3 nodes' nodes file) and let it synchronize from the existing nodes to re-establish your complete cluster

This phased approach ensures proper data consistency as you rebuild your cluster from backup.

## Client Configuration

### When deployed without a load balancer

Typesense clients allow you to specify one or more nodes during client initialization.
So you can specify the individual hostnames in the cluster when instantiating the client library,
and it will load balance reads & writes across all nodes and will automatically strive to recover from transient failures through built-in retries.

Here's a sample 3-node client configuration:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby', 'Dart', 'Java', 'Go', 'Swift', 'Shell']">
  <template v-slot:JavaScript>

```js
/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the admin API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

const Typesense = require('typesense')

let client = new Typesense.Client({
  'nodes': [
    { 'host': 'typesense-1.example.net', 'port': 443, 'protocol': 'https' },
    { 'host': 'typesense-2.example.net', 'port': 443, 'protocol': 'https' },
    { 'host': 'typesense-3.example.net', 'port': 443, 'protocol': 'https' },
  ],
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

  </template>

  <template v-slot:PHP>

```php
use Typesense\Client;

$client = new Client(
  [
    'nodes' => [
      ['host' => 'typesense-1.example.net', 'port' => '443', 'protocol' => 'https'],
      ['host' => 'typesense-2.example.net', 'port' => '443', 'protocol' => 'https'],
      ['host' => 'typesense-3.example.net', 'port' => '443', 'protocol' => 'https'],
    ],
    'api_key'         => '<API_KEY>',
    'connection_timeout_seconds' => 2,
  ]
);
```

  </template>
  <template v-slot:Python>

```py
import typesense

client = typesense.Client({
  'nodes': [
    {'host': 'typesense-1.example.net', 'port': '443', 'protocol': 'https'},
    {'host': 'typesense-2.example.net', 'port': '443', 'protocol': 'https'},
    {'host': 'typesense-3.example.net', 'port': '443', 'protocol': 'https'}
  ],
  'api_key': '<API_KEY>',
  'connection_timeout_seconds': 2
})
```

  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  nodes: [
    { host: 'typesense-1.example.net', port: 443, protocol: 'https' },
    { host: 'typesense-2.example.net', port: 443, protocol: 'https' },
    { host: 'typesense-3.example.net', port: 443, protocol: 'https' },
  ],
  api_key:  '<API_KEY>',
  connection_timeout_seconds: 2
)
```

  </template>
  <template v-slot:Dart>

```dart
import 'package:typesense/typesense.dart';

final protocol = Protocol.https;
final config = Configuration(
    '<API_KEY>',
    nodes: {
      Node(
        protocol,
        'typesense-1.example.net',
      ),
      Node(
        protocol,
        'typesense-2.example.net',
      ),
      Node(
        protocol,
        'typesense-3.example.net',
      ),
    },
    connectionTimeout: Duration(seconds: 2),
  );
```

  </template>
  <template v-slot:Java>

```java
import org.typesense.api.*;
import org.typesense.models.*;
import org.typesense.resources.*;

ArrayList<Node> nodes = new ArrayList<>();
nodes.add(new Node("https", "typesense-1.example.net", "443"));
nodes.add(new Node("https", "typesense-2.example.net", "443"));
nodes.add(new Node("https", "typesense-3.example.net", "443"));

Configuration configuration = new Configuration(nodes, Duration.ofSeconds(2),"<API_KEY>");

Client client = new Client(configuration);
```

  </template>
  <template v-slot:Go>

```go
import (
  "github.com/typesense/typesense-go/v3/typesense"
  "github.com/typesense/typesense-go/v3/typesense/api"
  "github.com/typesense/typesense-go/v3/typesense/api/pointer"
)

client := typesense.NewClient(
    typesense.WithNodes([]string{
      "https://xxx-1.a1.typesense.net:443",
      "https://xxx-2.a1.typesense.net:443",
      "https://xxx-3.a1.typesense.net:443",
    }),
    typesense.WithAPIKey("<API_KEY>"),
    typesense.WithConnectionTimeout(2*time.Second),
)
```

  </template>
  <template v-slot:Swift>

```swift
import Typesense

var nodes: [Node] = []
nodes.append(Node(host: "typesense-1.example.net", port: "443", nodeProtocol: "https"))
nodes.append(Node(host: "typesense-2.example.net", port: "443", nodeProtocol: "https"))
nodes.append(Node(host: "typesense-3.example.net", port: "443", nodeProtocol: "https"))

let config = Configuration(nodes: nodes, apiKey: "<API_KEY>", connectionTimeoutSeconds: 2)

let client = Client(config: config)
```

  </template>
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY='<API_KEY>'
export TYPESENSE_HOST='https://typesense.example.net'
```

  </template>
</Tabs>

### When using Typesense Cloud or a Load Balancer

If you use Typesense Cloud (with load-balancing enabled on your cluster, which is enabled by default for all clusters provisioned after June 16, 2022), or if you choose to set up a server-side load-balancer for convenience, you want to specify the load-balanced endpoint where all requests are routed to by default, by the client.

In Typesense Cloud, you also want to specify the individual hostnames in addition - these are used as fallback nodes by the client, in case the load-balanced endpoint hits a stale node that is currently in a "connection-draining" status just as a node rotation happens (lasts 30s per node rotation, for eg during a configuration change or infrastructure update).

<Tabs :tabs="['JavaScript','PHP','Python','Ruby', 'Dart', 'Java', 'Go', 'Swift', 'Shell']">
  <template v-slot:JavaScript>

```js
/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the admin API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

const Typesense = require('typesense')

let client = new Typesense.Client({
  'nearestNode': { 'host': 'xxx.a1.typesense.net', 'port': 443, 'protocol': 'https' }, // This is the special Load Balanced hostname that you'll see in the Typesense Cloud dashboard if you turn on High Availability
  'nodes': [
    { 'host': 'xxx-1.a1.typesense.net', 'port': 443, 'protocol': 'https' },
    { 'host': 'xxx-2.a1.typesense.net', 'port': 443, 'protocol': 'https' },
    { 'host': 'xxx-3.a1.typesense.net', 'port': 443, 'protocol': 'https' },
  ],
  'apiKey': '<API_KEY>',
  'connectionTimeoutSeconds': 2
})
```

  </template>

  <template v-slot:PHP>

```php
use Typesense\Client;

$client = new Client(
  [
    'nearest_node' =>  ['host' => 'xxx.a1.typesense.net', 'port' => '443', 'protocol' => 'https'], // This is the special Load Balanced hostname that you'll see in the Typesense Cloud dashboard if you turn on High Availability
    'nodes' => [
      ['host' => 'xxx-1.a1.typesense.net', 'port' => '443', 'protocol' => 'https'],
      ['host' => 'xxx-2.a1.typesense.net', 'port' => '443', 'protocol' => 'https'],
      ['host' => 'xxx-3.a1.typesense.net', 'port' => '443', 'protocol' => 'https'],
    ],
    'api_key'         => '<API_KEY>',
    'connection_timeout_seconds' => 2,
  ]
);
```

  </template>
  <template v-slot:Python>

```py
import typesense

client = typesense.Client({
  'nearest_node': {'host': 'xxx.a1.typesense.net', 'port': '443', 'protocol': 'https'}, # This is the special Load Balanced hostname that you'll see in the Typesense Cloud dashboard if you turn on High Availability
  'nodes': [
    {'host': 'xxx-1.a1.typesense.net', 'port': '443', 'protocol': 'https'},
    {'host': 'xxx-2.a1.typesense.net', 'port': '443', 'protocol': 'https'},
    {'host': 'xxx-3.a1.typesense.net', 'port': '443', 'protocol': 'https'}
  ],
  'api_key': '<API_KEY>',
  'connection_timeout_seconds': 2
})
```

  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  nearest_node: { host: 'xxx.a1.typesense.net', port: 443, protocol: 'https' }, # This is the special Load Balanced hostname that you'll see in the Typesense Cloud dashboard if you turn on High Availability
  nodes: [
    { host: 'xxx-1.a1.typesense.net', port: 443, protocol: 'https' },
    { host: 'xxx-2.a1.typesense.net', port: 443, protocol: 'https' },
    { host: 'xxx-3.a1.typesense.net', port: 443, protocol: 'https' },
  ],
  api_key:  '<API_KEY>',
  connection_timeout_seconds: 2
)
```

  </template>
  <template v-slot:Dart>

```dart
import 'package:typesense/typesense.dart';

final protocol = Protocol.https;
final config = Configuration(
    '<API_KEY>',
    // This is the special Load Balanced hostname that you'll see in the
    // Typesense Cloud dashboard if you turn on High Availability.
    nearestNode: Node(
      protocol,
      'xxx.a1.typesense.net',
      // Dart client initializes port to 443 and 80 for https and http respectively.
      // So if dealing with standard ports, specifying them is optional.
      port: 443,
    ),
    nodes: {
      Node(
        protocol,
        'xxx-1.a1.typesense.net',
      ),
      Node(
        protocol,
        'xxx-2.a1.typesense.net',
      ),
      Node(
        protocol,
        'xxx-3.a1.typesense.net',
      ),
    },
    connectionTimeout: Duration(seconds: 2),
  );
```

  </template>
  <template v-slot:Java>

```java
import org.typesense.api.*;
import org.typesense.models.*;
import org.typesense.resources.*;

ArrayList<Node> nodes = new ArrayList<>();
nodes.add(new Node("https", "xxx-1.a1.typesense.net", "443"));
nodes.add(new Node("https", "xxx-2.a1.typesense.net", "443"));
nodes.add(new Node("https", "xxx-3.a1.typesense.net", "443"));

// This is the special Load Balanced hostname that you'll see in the
// Typesense Cloud dashboard if you turn on High Availability.
Node nearestNode = new Node("https", "xxx.a1.typesense.net", "443");

Configuration configuration = new Configuration(nearestNode, nodes, Duration.ofSeconds(2),"<API_KEY>");

Client client = new Client(configuration);
```

  </template>
  <template v-slot:Go>

```go
import (
  "github.com/typesense/typesense-go/v3/typesense"
  "github.com/typesense/typesense-go/v3/typesense/api"
  "github.com/typesense/typesense-go/v3/typesense/api/pointer"
)

client := typesense.NewClient(
    // This is the special Load Balanced hostname that you'll see in the Typesense Cloud dashboard if you turn on High Availability
    typesense.WithNearestNode("https://xxx.a1.typesense.net:443"),
    typesense.WithNodes([]string{
      "https://xxx-1.a1.typesense.net:443",
      "https://xxx-2.a1.typesense.net:443",
      "https://xxx-3.a1.typesense.net:443",
    }),
    typesense.WithAPIKey("<API_KEY>"),
    typesense.WithConnectionTimeout(2*time.Second),
)
```

  </template>
  <template v-slot:Swift>

```swift
import Typesense

var nodes: [Node] = []
nodes.append(Node(host: "xxx-1.a1.typesense.net", port: "443", nodeProtocol: "https"))
nodes.append(Node(host: "xxx-2.a1.typesense.net", port: "443", nodeProtocol: "https"))
nodes.append(Node(host: "xxx-3.a1.typesense.net", port: "443", nodeProtocol: "https"))

let nearestNode = Node(host: "xxx.a1.typesense.net", port: "443", nodeProtocol: "https")

let config = Configuration(nodes: nodes, apiKey: "<API_KEY>", connectionTimeoutSeconds: 2, nearestNode: nearestNode)

let client = Client(config: config)
```

  </template>
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY='<API_KEY>'
export TYPESENSE_HOST='https://xxx.a1.typesense.net'
```

  </template>
</Tabs>

Here `xxx.a1.typesense.net` is a Load Balanced endpoint.
