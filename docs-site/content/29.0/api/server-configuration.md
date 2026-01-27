---
sidebarDepth: 2
sitemap:
  priority: 0.3
---

# Server Configuration

These parameters control and fine-tune various default server-settings in Typesense.

[[toc]]

:::tip Typesense Cloud
We manage the following server parameters for you in Typesense Cloud automatically. But if you need to customize any of them, please email us at support at typesense dot org with a brief description of your use-case that requires the change, and we can do the change for you from our side. 
:::

## Using Command Line Arguments

Command line arguments can be passed to the server as `--parameter=value`.

### Common Parameters

| Parameter    | Required | Description                                                                                                                                                                                                                                                                                                                            |
|--------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `--config`   | false    | Path to the [configuration file](#using-a-configuration-file). If you use this argument, you can define all of the other command line arguments in a configuration file.                                                                                                                                                               |
| `--api-key`  | true     | A bootstrap admin API key that allows all operations. Be sure to create additional keys with specific ACLs using the [key management API](../api/api-keys.md). <br><br>**NOTE**: Don't expose this admin API key to your browser JS client: use the [key management API](../api/api-keys.md) to create search-only or scoped API keys. |
| `--data-dir` | true     | Path to the directory where data will be stored on disk.                                                                                                                                                                                                                                                                               |

### CORS

| Parameter        | Required | Description                                                                                                                        |
|------------------|----------|------------------------------------------------------------------------------------------------------------------------------------|
| `--enable-cors`  | false    | Allow JavaScript client to access Typesense directly from the browser.                                                             |
| `--cors-domains` | false    | Comma separated list of domains which are allowed for CORS. E.g. `https://example.com,https://example2.com` (no trailing slashes!) |

### Analytics

| Parameter                       | Required | Description                                                                                                                          |
|---------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| `--enable-search-analytics`     | false    | Allow search queries to be aggregated for query analytics. Default: `false`                                                          |
| `--analytics-dir`               | false    | Directory for Typesense to store analytics data.                                                                                     |
| `--analytics-flush-interval`    | false    | Interval (in seconds) that determines how often the search query aggregations are persisted to storage. Default: `3600` (every hour) |
| `--analytics-minute-rate-limit` | false    | Maximum number of analytics events that can be sent per minute. Default: `5`                                                         |

### Logging

| Parameter                     | Required | Description                                                                                                                                                                                                                                                               |
|-------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `--log-dir`                   | false    | By default, Typesense logs to stdout and stderr. To enable logging to a file, provide a path to a logging directory. Logs are written to a file called `typesense.log` inside this directory.                                                                             |
| `--enable-access-logging`     | false    | Logs the API requests and corresponding IP addresses to a file called `typesense-access.log` inside `log-dir`. Default: `false`                                                                                                                                           |
| `--enable-search-logging`     | false    | Logs the search API request + payload right at the start of search request lifecycle to a file called `typesense.log` inside `log-dir`. Default: `false`                                                                                                                  |
| `--log-slow-requests-time-ms` | false    | Requests that take over this amount of time (in milliseconds) are logged. Default: `-1` which disables slow request logging. <br><br>You can also [dynamically enable](../api/cluster-operations.md#toggle-slow-request-log) slow requests logging via the `/config` API. |


### Networking

| Parameter           | Required | Description                                                                                                                                                      |
|---------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--api-address`     | false    | Address to which Typesense API service binds. Default: `0.0.0.0`                                                                                                 |
| `--api-port`        | false    | Port on which Typesense API service listens. Default: `8108`                                                                                                     |
| `--peering-address` | false    | Internal IP address to which Typesense peering service binds. If this parameter is not specified, Typesense will attempt to use the first available internal IP. |
| `--peering-port`    | false    | Port on which Typesense peering service listens. Default: `8107`                                                                                                 |
| `--peering-subnet`  | false    | Internal subnet that Typesense should use for peering, e.g. `192.160.1.0/24`.                                                                                    |

### SSL / HTTPS

| Parameter                        | Required | Description                                                                                   |
|----------------------------------|----------|-----------------------------------------------------------------------------------------------|
| `--ssl-certificate`              | false    | Path to the SSL certificate file. You must also define `ssl-certificate-key` to enable HTTPS. |
| `--ssl-certificate-key`          | false    | Path to the SSL certificate key file. You must also define `ssl-certificate` to enable HTTPS. |
| `--ssl-refresh-interval-seconds` | false    | Frequency of automatic reloading of SSL certs from disk. Default: `8 * 60 * 60`.              |


### Clustering

| Parameter                | Required | Description                                                                                                                                         |
|--------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `--nodes`                | false    | Path to file containing comma separated string of all nodes in the cluster.                                                                         |
| `--reset-peers-on-error` | false    | Forcefully reset node's peers on an irrecoverable clustering error. This could cause intermittent data loss and is only attempted as a last-resort. |

### Resource Usage

| Parameter                         | Required | Description                                                                                                                                                                                                                                                                          |
|-----------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--thread-pool-size`              | false    | Number of threads used for handling concurrent requests. Default: `NUM_CORES * 8`.                                                                                                                                                                                                   |
| `--num-collections-parallel-load` | false    | Number of collections that are loaded in parallel during start up. Default: `NUM_CORES * 4`.                                                                                                                                                                                         |
| `--num-documents-parallel-load`   | false    | Number of documents per collection that are indexed in parallel during start up. Default: `1000`.                                                                                                                                                                                    |
| `--cache-num-entries`             | false    | Number of entries to be stored in the LRU cache used for storing search query responses. Default: `1000`.                                                                                                                                                                            |
| `--embedding-cache-num-entries`   | false    | Number of entries to be stored in the LRU cache used for storing text embeddings returned by remote embedders. Default: `100`.                                                                                                                                                      |
| `--disk-used-max-percentage`      | false    | Reject writes when used disk space exceeds this percentage. Default: `100` (never reject).                                                                                                                                                                                           |
| `--memory-used-max-percentage`    | false    | Reject writes when used memory usage exceeds this percentage. Default: `100` (never reject).                                                                                                                                                                                         |
| `--healthy-read-lag`              | false    | Reads are rejected if the updates lag behind this threshold. Default: `1000`.                                                                                                                                                                                                        |
| `--healthy-write-lag`             | false    | Writes are rejected if the updates lag behind this threshold. Default: `500`.                                                                                                                                                                                                        |
| `--snapshot-interval-seconds`     | false    | Frequency of replication log snapshots. Default: `3600` follower recovery.<br><br>**NOTE**: Frequent snapshotting helps in faster recovery from a cold start. However, if this value is too low for a large dataset, repeated snapshotting can actually slow down follower recovery. |
| `--db-compaction-interval`        | false    | Frequency of automatic on-disk [database compaction](./cluster-operations.md#compacting-the-on-disk-database). Default: `604,800` (7 days)<br><br> If you do frequent collection drops and recreates, you want to considering setting this to say 24 hours.                          |
| `--skip-writes`                   | false    | Starts Typesense in a mode that does not read writes from the Raft log. This is useful when the server has crashed due to some recent bad writes that you want to skip over temporarily.                                                                                             |

### Search Limits

| Parameter             | Required | Description                                                                 |
|-----------------------|----------|-----------------------------------------------------------------------------|
| `--filter-by-max-ops` | false    | Maximum number of operators permitted in `filter_by` clause. Default: `100` |
| `--max-per-page`      | false    | Max number of hits permitted per page. Default: `250`                       |
| `--max-group-limit`   | false    | Max value of `group_limit` permitted when using `group_by`. Default: `99`   |

### On-Disk DB Fine Tuning

Typesense uses RocksDB to store your documents on disk. The following parameters help fine-tune some of these parameters for improved write performance in [some circumstances](https://github.com/typesense/typesense/issues/2312). 

| Parameter                      | Required | Description                                                                                       |
|--------------------------------|----------|----------------------------------------------------------------------------------------           |
| `--db-write-buffer-size`       | false    | Maximum size of the write buffer for a column family (Bytes). **Default**: `4 * 1048576` (4MB)          |
| `--db-max-write-buffer-number` | false    | Maximum number of memtables that can be held in memory before they are flushed to disk. **Default**: `2`|
| `--db-max-log-file-size`       | false    | Maximum size of a single RocksDB log file (Bytes). **Default**: `4 * 1048576` (4MB)                     |
| `--db-keep-log-file-num`       | false    | Number of RocksDB log files that should be retained in the log directory. **Default**: `5`              |
| `--max-indexing-concurrency`   | false    | Concurrency level for indexing docs into RocksDB. **Default**: `4`                                      |

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
data-dir = /var/lib/typesense
log-dir = /var/log/typesense
api-port = 9090
```
  </template>
</Tabs>

You can use any of the parameters from the table above without the preceding `--` in the `typesense-server.ini` file.

## Using Environment Variables

If you wish to use environment variables, you can do that too. The environment variables map to the command line arguments documented above: just use CAPS and underscores instead of hyphens, and prefix the variable names with `TYPESENSE_`.

For example, use `TYPESENSE_DATA_DIR` for the `--data-dir` argument.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
TYPESENSE_DATA_DIR=/var/lib/typesense TYPESENSE_API_KEY=AS3das2awQ2 ./typesense-server
```
  </template>
</Tabs>
