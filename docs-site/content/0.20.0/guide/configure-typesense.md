---
sitemap:
  priority: 0.3
---

# Configure Typesense

:::tip
We manage the following parameters for you in Typesense Cloud. So this section only applies if you're self-hosting Typesense.
:::

## Using Command Line Arguments

Command line arguments can be passed to the server as `--parameter=value`.

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|`--config`         | false       |Path to the configuration file. If you use this argument, you can define all of the other command line arguments in a configuration file. See the "Configuring Typesense" section for more details.|
|`--api-key`	|true	|A bootstrap admin API key that allows all operations. Be sure to create additional keys with specific ACLs using the [key management API](../api/api-keys.md). <br><br>**NOTE**: Don't expose this admin API key to your browser JS client: use the [key management API](../api/api-keys.md) to create search-only or scoped API keys.|
|`--data-dir`	|true	|Path to the directory where data will be stored on disk.|
|`--api-address`	|false	|Address to which Typesense API service binds. Default: `0.0.0.0`|
|`--api-port`	|false	|Port on which Typesense API service listens. Default: `8108`|
|`--peering-address`	|false	|Internal IP address to which Typesense peering service binds. If this parameter is not specified, Typesense will attempt to use the first available internal IP.|
|`--peering-port`	|false	|Port on which Typesense peering service listens. Default: `8107`|
|`--nodes`	|false	|Path to file containing comma separated string of all nodes in the cluster.|
|`--log-dir`	|false	|By default, Typesense logs to stdout and stderr. To enable logging to a file, provide a path to a logging directory.|
|`--ssl-certificate`	|false	|Path to the SSL certificate file. You must also define `ssl-certificate-key` to enable HTTPS.|
|`--ssl-certificate-key`	|false	|Path to the SSL certificate key file. You must also define `ssl-certificate` to enable HTTPS.|
|`--ssl-refresh-interval-seconds`	|false	|Frequency of automatic reloading of SSL certs from disk. Default: `8 * 60 * 60`.|
|`--enable-cors`	|false	|Allow JavaScript client to access Typesense directly from the browser.|
|`--thread-pool-size`	|false	|Number of threads used for handling concurrent requests. Default: `NUM_CORES * 8`.|
|`--num-collections-parallel-load`	|false	|Number of collections that are loaded in parallel during start up. Default: `NUM_CORES * 4`.|
|`--num-documents-parallel-load`	|false	|Number of documents per collection that are indexed in parallel during start up. Default: `1000`.|
|`--healthy-read-lag`	|false	|Reads are rejected if the updates lag behind this threshold. Default: `1000`.|
|`--healthy-write-lag`	|false	|Writes are rejected if the updates lag behind this threshold. Default: `500`.|
|`--snapshot-interval-seconds`	|false	|Frequency of replication log snapshots. Default: `3600` follower recovery.<br><br>**NOTE**: Frequent snapshotting helps in faster recovery from a cold start. However, if this value is too low for a large dataset, repeated snapshotting can actually slow down follower recovery.|
|`--log-slow-requests-time-ms`	|false	|Requests that take over this amount of time (in milliseconds) are logged. Default: `-1` which disables slow request logging. <br><br>You can also [dynamically enable](../api/cluster-operations.md#toggle-slow-request-log) slow requests logging via the `/config` API.|

## Using a Configuration File

As an alternative to command line arguments, you can also configure Typesense server through a configuration file or via environment variables.

Command line arguments are given the highest priority, while environment variables are given the least priority.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
./typesense-server --config=/etc/typesense/typesense-server.ini
```

  </template>
</Tabs>

Our Linux DEB/RPM packages install the configuration file at `/etc/typesense/typesense-server.ini`.

The configuration file uses a simple INI format:

<Tabs :tabs="['INI']">
  <template v-slot:INI>

```ini
; /etc/typesense/typesense-server.ini

[server]

api-key = Rhsdhas2asasdasj2
data-dir = /tmp/ts
log-dir = /tmp/logs
api-port = 9090
```
  </template>
</Tabs>

## Using Environment Variables

If you wish to use environment variables, you can do that too. The environment variables map to the command line arguments documented above: just use CAPS and underscores instead of hyphens, and prefix the variable names with `TYPESENSE_`.

For example, use `TYPESENSE_DATA_DIR` for the `--data-dir` argument.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
TYPESENSE_DATA_DIR=/tmp/ts TYPESENSE_API_KEY=AS3das2awQ2 ./typesense-server
```
  </template>
</Tabs>
