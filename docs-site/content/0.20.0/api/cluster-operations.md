---
sitemap:
  priority: 0.3
---

# Cluster Operations

## Create Snapshot (for backups)
Creates a point-in-time snapshot of a Typesense node's state and data in the specified directory.

You can then backup the snapshot directory that gets created and later restore it as a data directory, as needed.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>

  <template v-slot:Java>

```java
HashMap<String, String> query = new HashMap<>();
query.put("snapshot_path","/tmp/typesense-data-snapshot");

HashMap<String,String> response = client.operations.perform("snapshot",query);
```

  </template>

  <template v-slot:PHP>

```php
$client->operations->perform("snapshot", ["snapshot_path" => "/tmp/typesense-data-snapshot"]);
```

  </template>
  <template v-slot:Python>

```py
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>
  <template v-slot:Ruby>

```rb
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>
  <template v-slot:Dart>

```dart
await client.operations.createSnapshot('/tmp/typesense-data-snapshot');
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/operations/snapshot?snapshot_path=/tmp/typesense-data-snapshot" -X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "success": true
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/operations/snapshot`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------|
|snapshot_path	|yes	|The directory on the server where the snapshot should be saved.|

## Re-elect Leader
Triggers a follower node to initiate the raft voting process, which triggers leader re-election.

The follower node that you run this operation against will become the new leader, once this command succeeds.

<Tabs :tabs="['JavaScript','Java','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.operations.perform('vote')
```

  </template>

  <template v-slot:Java>

```java
HashMap<String,String> response = client.operations.perform("vote");
```

  </template>

  <template v-slot:PHP>

```php
$client->operations->perform("vote");
```

  </template>
  <template v-slot:Python>

```py
client.operations.perform('vote')
```

  </template>
  <template v-slot:Ruby>

```rb
client.operations.perform('vote')
```

  </template>
  <template v-slot:Dart>

```dart
await client.operations.initLeaderElection();
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/operations/vote" -X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "success": true
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/operations/vote`

## Toggle Slow Request Log
Enable logging of requests that take over a defined threshold of time.

Default: `-1` which disables slow request logging.

Slow requests are logged to the primary log file, with the prefix `SLOW REQUEST`.

<Tabs :tabs="['Shell']">
  <template v-slot:Dart>

```dart
await client.operations.toggleSlowRequestLog(Duration(seconds: 2));
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/config" \
        -X POST \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{"log-slow-requests-time-ms": 2000}'
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "success": true
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/config`


## Cluster Metrics

Get current RAM, CPU, Disk & Network usage metrics.

<Tabs :tabs="['Shell']">
  <template v-slot:Dart>

```dart
await client.metrics.retrieve();
```
  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/metrics.json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```
  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "system_cpu1_active_percentage": "0.00",
  "system_cpu2_active_percentage": "0.00",
  "system_cpu3_active_percentage": "0.00",
  "system_cpu4_active_percentage": "0.00",
  "system_cpu_active_percentage": "0.00",
  "system_disk_total_bytes": "1043447808",
  "system_disk_used_bytes": "561152",
  "system_memory_total_bytes": "2086899712",
  "system_memory_used_bytes": "1004507136",
  "system_network_received_bytes": "1466",
  "system_network_sent_bytes": "182",
  "typesense_memory_active_bytes": "29630464",
  "typesense_memory_allocated_bytes": "27886840",
  "typesense_memory_fragmentation_ratio": "0.06",
  "typesense_memory_mapped_bytes": "69701632",
  "typesense_memory_metadata_bytes": "4588768",
  "typesense_memory_resident_bytes": "29630464",
  "typesense_memory_retained_bytes": "25718784"
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/metrics.json`


## API Stats

Get stats about API endpoints.

This endpoint returns average requests per second and latencies for all requests in the last 10 seconds.

<Tabs :tabs="['Shell']">
  <template v-slot:Dart>

```dart
await client.stats.retrieve();
```
  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/stats.json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```
  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "latency_ms": {
    "GET /collections/products": 0.0,
    "POST /collections": 4.0,
    "POST /collections/products/documents/import": 1166.0
  },
  "requests_per_second": {
    "GET /collections/products": 0.1,
    "POST /collections": 0.1,
    "POST /collections/products/documents/import": 0.1
  }
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/stats.json`


## Health

Get health information about a Typesense node.

<Tabs :tabs="['Shell']">
  <template v-slot:Dart>

```dart
await client.health.retrieve();
```
  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/health"
```
  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "status": "ok"
}
```

  </template>
</Tabs>

#### Definition
`GET ${TYPESENSE_HOST}/health`


