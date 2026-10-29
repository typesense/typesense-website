---
description: "Read per-node metric series for a Typesense Cloud cluster through the Cluster Management API: CPU, memory, disk, network, search and write latency and throughput, plus searches per day."
---

# Cluster Metrics API

## Get cluster metrics

This endpoint returns per-node metric series for a cluster.

Here's an example that reads three metrics over the last hour:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/metrics" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "metrics=system_cpu_active_percentage,system_memory_used_bytes,search_latency_ms" \
    --data-urlencode "window=1h" \
    --data-urlencode "aggregation=p95"
```

### Request Parameters

| Parameter     | Required | Description |
|---------------|----------|-------------|
| `metrics`     | Required | Up to five of the metrics listed below, as a comma-separated list. `searches_per_day` is requested on its own (see [Searches per day](#searches-per-day)). |
| `window`      | Required | `1h`, `3h`, `24h`, `7d` or `30d`. The `1h` and `3h` windows use 30-second buckets and `24h` uses 30-minute buckets. `7d` and `30d` use 1-hour buckets. |
| `aggregation` | Optional | How each bucket summarizes the samples in it: `avg` (the default), `max`, `min` or `p95`. You want to use `max` or `p95` to find peaks that an average would hide. `searches_per_day` always uses `sum`. |

You can pick any of these metrics:

- `system_cpu_active_percentage`
- `system_memory_used_bytes`
- `system_memory_total_bytes`
- `system_disk_used_bytes`
- `system_disk_total_bytes`
- `system_swap_used_bytes`
- `system_swap_total_bytes`
- `system_network_received_bytes_rate`
- `system_network_sent_bytes_rate`
- `typesense_memory_active_bytes`
- `search_latency_ms`
- `search_requests_per_second`
- `pending_write_batches`
- `write_requests_per_second`
- `import_requests_per_second`
- `delete_requests_per_second`
- `import_latency_ms`
- `delete_latency_ms`
- `overloaded_requests_per_second`
- `cache_hit_ratio`
- `searches_per_day`

`cache_hit_ratio` is a fraction from 0 to 1, and it reads 0 when search caching is off.
Typesense Server versions before 29.0 don't report it.
So those clusters return no samples for it.

**Response:**

```json
{
  "cluster_id": "nuj9s7k6vplrg15yp",
  "window": "1h",
  "aggregation": "p95",
  "resolution": "30s",
  "timestamp_unit": "epoch_milliseconds",
  "metrics": {
    "system_cpu_active_percentage": {
      "1": {
        "hostname": "nuj9s7k6vplrg15yp-1.a1.typesense.net",
        "timestamps": [1786381200000, 1786381230000],
        "values": [21.4, 24.8]
      },
      "2": {
        "hostname": "nuj9s7k6vplrg15yp-2.a1.typesense.net",
        "timestamps": [1786381200000, 1786381230000],
        "values": [19.7, 20.1]
      }
    }
  }
}
```

Each metric is keyed by node index.
`resolution` is the bucket width used for the window.

### Searches per day

`searches_per_day` is the number of searches each node served on each full UTC day.
You want to use it for daily totals over a week or a month, and `search_requests_per_second` for traffic within a day.

Request it on its own, with `window` set to `7d` or `30d`.
Here's an example for the last 30 days:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/metrics" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "metrics=searches_per_day" \
    --data-urlencode "window=30d"
```

This returns one value per node for each day, timestamped at the start of that day (shortened to 2 days here):

```json
{
  "cluster_id": "nuj9s7k6vplrg15yp",
  "window": "30d",
  "aggregation": "sum",
  "resolution": "1d",
  "timestamp_unit": "epoch_milliseconds",
  "metrics": {
    "searches_per_day": {
      "1": {
        "hostname": "nuj9s7k6vplrg15yp-1.a1.typesense.net",
        "timestamps": [1786320000000, 1786406400000],
        "values": [52823, 58801]
      },
      "2": {
        "hostname": "nuj9s7k6vplrg15yp-2.a1.typesense.net",
        "timestamps": [1786320000000, 1786406400000],
        "values": [65274, 61902]
      }
    }
  }
}
```

So to get a cluster's total for a day, you want to add up the values of all its nodes for that timestamp.
The last value is always yesterday's (UTC).

## Error responses

- HTTP `400` when a parameter isn't valid.
- HTTP `404` when the cluster doesn't exist on your account.
- HTTP `503` when metrics are temporarily unavailable.

## Permissions

To [get cluster metrics](#get-cluster-metrics), you need a key with the `metrics:read` capability.
See [capabilities](./authentication.md#capabilities).
