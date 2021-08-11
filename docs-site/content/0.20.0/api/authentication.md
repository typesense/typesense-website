---
sitemap:
  priority: 0.3
---

# Authentication

You'd need one or more hostnames and [API keys](./api-keys.md) to integrate with Typesense.

If you're self-hosting Typesense, the hostnames are the IP addresses or DNS names of each of your Typesense nodes. 
If you're using Typesense Cloud, we generate unique hostnames for each of your nodes and show them on the dashboard for you to use. 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

const Typesense = require('typesense')

let client = new Typesense.Client({
  'nodes': [{
    'host': 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
    'port': '8108',      // For Typesense Cloud use 443
    'protocol': 'http'   // For Typesense Cloud use https
  }],
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
    'api_key'         => 'abcd',
    'nodes'           => [
      [
        'host'     => 'localhost',  // For Typesense Cloud use xxx.a1.typesense.net
        'port'     => '8108',       // For Typesense Cloud use 443
        'protocol' => 'http',       // For Typesense Cloud use https
      ],
    ],
    'connection_timeout_seconds' => 2,
  ]
);
```

  </template>
  <template v-slot:Python>

```py
import typesense

client = typesense.Client({
  'nodes': [{
    'host': 'localhost',  # For Typesense Cloud use xxx.a1.typesense.net
    'port': '8108',       # For Typesense Cloud use 443
    'protocol': 'http'    # For Typesense Cloud use https
  }],
  'api_key': '<API_KEY>',
  'connection_timeout_seconds': 2
})
```

  </template>
  <template v-slot:Ruby>

```rb
require 'typesense'

client = Typesense::Client.new(
  nodes: [{
    host:     'localhost',   # For Typesense Cloud use xxx.a1.typesense.net
    port:     8108,          # For Typesense Cloud use 443
    protocol: 'http'         # For Typesense Cloud use https
  }],
  api_key:  '<API_KEY>',
  connection_timeout_seconds: 2
)
```

  </template>
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY='<API_KEY>'
export TYPESENSE_HOST='http://localhost:8108'

# For Typesense Cloud use:
# export TYPESENSE_HOST='https://xxx.a1.typesense.net'
```

  </template>
</Tabs>

## Search Delivery Network

On Typesense Cloud, you can turn ON a setting called `Search Delivery Network` and choose a set of geographic regions that you'd like each of your Typesense nodes to be deployed to. The advantage of this setup is that you can then have the node that's closest to your users serve the search query, which reduces latency and keeps your search experience consistently fast for your users spread across geographic regions.

You'll be a given a special hostname called the Nearest Node hostname when you turn this setting on for your cluster. You'd then need to configure your clients to use this hostname:


<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than the master API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */

const Typesense = require('typesense')

let client = new Typesense.Client({
  'nearestNode': { 'host': 'xxx.a1.typesense.net', 'port': '443', 'protocol': 'https' }, // This is the special Nearest Node hostname that you'll see in the Typesense Cloud dashboard if you turn on Search Delivery Network
  'nodes': [
    { 'host': 'xxx-1.a1.typesense.net', 'port': '443', 'protocol': 'https' },
    { 'host': 'xxx-2.a1.typesense.net', 'port': '443', 'protocol': 'https' },
    { 'host': 'xxx-3.a1.typesense.net', 'port': '443', 'protocol': 'https' },
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
    'nearest_node' =>  ['host' => 'xxx.a1.typesense.net', 'port' => '443', 'protocol' => 'https'], // This is the special Nearest Node hostname that you'll see in the Typesense Cloud dashboard if you turn on Search Delivery Network
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
  'nearest_node': {'host': 'xxx.a1.typesense.net', 'port': '443', 'protocol': 'https'}, # This is the special Nearest Node hostname that you'll see in the Typesense Cloud dashboard if you turn on Search Delivery Network
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
  nearest_node: { host: 'xxx.a1.typesense.net', port: 443, protocol: 'https' }, # This is the special Nearest Node hostname that you'll see in the Typesense Cloud dashboard if you turn on Search Delivery Network
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
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY='<API_KEY>'
export TYPESENSE_HOST='https://xxx.a1.typesense.net'
```

  </template>
</Tabs>
