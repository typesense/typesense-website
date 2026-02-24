---
sitemap:
  priority: 0.3
---

# Cluster Operations

## Create Snapshot (for backups)
Creates a point-in-time snapshot of a Typesense node's state and data in the specified directory.

You can then backup the snapshot directory that gets created and later restore it as a data directory, as needed.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>

  <template v-slot:PHP>

```php
$client->operations->perform("snapshot", ["snapshot_path" => "/tmp/typesense-data-snapshot"])
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

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.operations.perform('vote')
```

  </template>

  <template v-slot:PHP>

```php
$client->operations->perform("vote")
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

## Cluster Metrics

Get current RAM, CPU, Disk & Network usage metrics.

<Tabs :tabs="['Shell']">
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

#### Metrics Reference

**System Metrics**

| Metric | Description |
|--------|-------------|
| `system_cpu_active_percentage` | Overall CPU usage across all cores. |
| `system_cpuN_active_percentage` | CPU usage for individual core N (e.g. `system_cpu1_active_percentage`). |
| `system_disk_total_bytes` | Total disk space in bytes. |
| `system_disk_used_bytes` | Used disk space in bytes. |
| `system_memory_total_bytes` | Total system RAM in bytes. |
| `system_memory_used_bytes` | Used system RAM in bytes. |
| `system_memory_total_swap_bytes` | Total swap space in bytes. |
| `system_memory_used_swap_bytes` | Used swap space in bytes. |
| `system_network_received_bytes` | Network bytes received. |
| `system_network_sent_bytes` | Network bytes sent. |

**Typesense Memory Metrics**

These metrics are sourced from [jemalloc](https://jemalloc.net/jemalloc.3.html), the memory allocator used by Typesense.

| Metric | Description |
|--------|-------------|
| `typesense_memory_allocated_bytes` | Total bytes currently allocated by the Typesense process. This is the most direct measure of how much memory Typesense is actively using. Corresponds to jemalloc's [`stats.allocated`](https://jemalloc.net/jemalloc.3.html#stats.allocated). |
| `typesense_memory_active_bytes` | Total bytes in active memory pages allocated by the Typesense process. This is a multiple of the page size and is always >= `allocated_bytes`. Corresponds to jemalloc's [`stats.active`](https://jemalloc.net/jemalloc.3.html#stats.active). |
| `typesense_memory_fragmentation_ratio` | Fraction of active memory that is fragmented, calculated as `1 - (allocated_bytes / active_bytes)`. Values close to `0` indicate low fragmentation; higher values indicate more wasted space within active pages. |
| `typesense_memory_mapped_bytes` | Total bytes in virtual address space mapped by the allocator. Larger than `active_bytes` as it includes all mapped extents. Corresponds to jemalloc's [`stats.mapped`](https://jemalloc.net/jemalloc.3.html#stats.mapped). |
| `typesense_memory_metadata_bytes` | Bytes used by the memory allocator for its own internal bookkeeping and metadata structures. Corresponds to jemalloc's [`stats.metadata`](https://jemalloc.net/jemalloc.3.html#stats.metadata). |
| `typesense_memory_resident_bytes` | Total bytes physically resident in RAM. Includes metadata pages, active allocation pages, and unused dirty pages. Corresponds to jemalloc's [`stats.resident`](https://jemalloc.net/jemalloc.3.html#stats.resident). |
| `typesense_memory_retained_bytes` | Total bytes in virtual memory mappings retained by the allocator rather than returned to the OS. This memory is not necessarily backed by physical RAM. Corresponds to jemalloc's [`stats.retained`](https://jemalloc.net/jemalloc.3.html#stats.retained). |

#### Definition
`GET ${TYPESENSE_HOST}/metrics.json`
