---
description: "Read a Typesense Cloud cluster's request logs through the Cluster Management API: the access log, slow requests and which client IPs and API keys send the most requests."
---

# Cluster Logs API

These endpoints give you the same data you see on the Logs page of the Typesense Cloud dashboard.
You can read every request a cluster received and the requests that were slower than the cluster's slow-request thresholds.
You can also see which client IPs and API keys sent the most requests.

Logs are kept for 7 days.
You need the `metrics:read` capability to read them.

## Time windows

The window ends now, or at `window_end_ms` when you send it.
To read an exact range instead, set `window=custom` and send `window_start_ms` and `window_end_ms` in epoch milliseconds.
`window_end_ms` defaults to now.
Since logs are only kept for 7 days, a start time older than that reads from the oldest log we still have.

Each response has a `window_end_ms`.
When you page through the access log or slow requests, you want to send that value back as `window_end_ms` along with `before_ms`, so every page reads the same interval while new requests keep coming in.

Timestamps in this API are Unix timestamps in **milliseconds**.

## API key prefixes

Logs record the first 4 characters of each request's API key, which we call the key prefix.
A scoped search key is logged under its parent key's prefix.
If a `multi_search` request uses several keys, you'll see their prefixes separated by commas.

Typesense Server versions before `v31` don't log key prefixes.
So when no request in the window has one, `api_key_prefixes_recorded` is `false` and an empty `api_key_prefix` only means the prefix wasn't recorded.
The request might still have used a key.

Requests Typesense Cloud itself sends to your cluster (health checks, metrics and the dashboard) have a `client_ip` of `null` and a `client_label` of `"Typesense Cloud"`.

## Get the access log

This endpoint returns the requests a cluster received, newest first, 200 per page.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/access?window=1h&http_method=POST&path=/multi_search" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Query Parameters:**

| Parameter      | Required | Description                                                                                         |
|----------------|----------|-----------------------------------------------------------------------------------------------------|
| window         | yes      | `15m`, `1h`, `6h`, `24h`, `3d`, `7d` or `custom`.                                                   |
| window_start_ms | no      | Start of a `custom` window, in epoch milliseconds. Required when `window` is `custom`.               |
| window_end_ms  | no       | Fixes the end of the window. Send back the `window_end_ms` of the first page when paging.           |
| before_ms      | no       | Page cursor: the `next_before_ms` of the previous page.                                             |
| client_ip      | no       | Only requests from this IPv4 address.                                                               |
| http_method    | no       | Only requests with this method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` or `OPTIONS`.               |
| path           | no       | Only requests whose path contains this text (case-sensitive, up to 512 characters).                 |
| api_key_prefix | no       | Only requests made with this key prefix.                                                            |

You can combine these filters.

**Response:**

```json
{
  "cluster_id": "abc123xyz",
  "timestamp_unit": "epoch_milliseconds",
  "window": "1h",
  "retention_days": 7,
  "api_key_prefixes_recorded": true,
  "rows": [
    {
      "timestamp_ms": 1760040122517,
      "client_ip": "203.0.113.7",
      "client_label": null,
      "http_method": "POST",
      "path": "/multi_search",
      "api_key_prefix": "xyz1"
    },
    {
      "timestamp_ms": 1760040121904,
      "client_ip": "203.0.113.7",
      "client_label": null,
      "http_method": "POST",
      "path": "/multi_search",
      "api_key_prefix": "xyz1"
    }
  ],
  "next_before_ms": 1760039950211,
  "window_end_ms": 1760040180000
}
```

`next_before_ms` is `null` on the last page.

## Get slow requests

This endpoint returns the requests that took longer than the cluster's [`log-slow-requests-time-ms`](./typesense-server-configuration-parameters.md) threshold, and searches that took longer than `log-slow-searches-time-ms`.
For a `multi_search` request, you also get its body, up to 20 KB.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/slow-requests?window=24h&sort=slowest" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Query Parameters:**

| Parameter     | Required | Default  | Description                                                                                    |
|---------------|----------|----------|------------------------------------------------------------------------------------------------|
| window        | yes      |          | `15m`, `1h`, `6h`, `24h`, `3d`, `7d` or `custom`.                                              |
| window_start_ms | no     |          | Start of a `custom` window, in epoch milliseconds. Required when `window` is `custom`.          |
| window_end_ms | no       |          | Fixes the end of the window. Send back the `window_end_ms` of the first page when paging.      |
| sort          | no       | `newest` | `newest` pages through the window with `before_ms`. `slowest` returns one page of the slowest. |
| before_ms     | no       |          | Page cursor for `sort=newest`: the `next_before_ms` of the previous page.                      |
| limit         | no       | `20`     | Rows per page, from 1 to 100.                                                                  |

**Response:**

```json
{
  "cluster_id": "abc123xyz",
  "timestamp_unit": "epoch_milliseconds",
  "window": "24h",
  "retention_days": 7,
  "api_key_prefixes_recorded": true,
  "threshold_ms": 2000,
  "search_threshold_ms": 30000,
  "rows": [
    {
      "timestamp_ms": 1760031544802,
      "duration_ms": 8059,
      "client_ip": "203.0.113.7",
      "client_label": null,
      "http_method": "POST",
      "path": "/multi_search",
      "query_string": "x-typesense-api-key=[redacted]",
      "body": "{\"searches\":[{\"collection\":\"products\",\"q\":\"*\",\"facet_by\":\"brand,category\"}]}",
      "body_truncated": false
    }
  ],
  "capped": true,
  "next_before_ms": null,
  "window_end_ms": 1760040180000
}
```

- `threshold_ms` is the cluster's `log-slow-requests-time-ms`, or `null` when slow requests aren't logged.
- `search_threshold_ms` is the cluster's `log-slow-searches-time-ms`. Searches slower than this are logged even when `threshold_ms` is `null`.
- `capped` is `true` when you use `sort=slowest` and the window has more slow requests than fit on one page. The page then lists the slowest of them.
- API keys in a query string or body show up as `[redacted]`.

## Get the top client IPs

This endpoint returns the 50 IP addresses that sent the most requests in the window, each with up to 10 of the API key prefixes it used and its 10 busiest paths.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/top-ips?window=24h" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Query Parameters:** `window` (required), `window_start_ms` and `window_end_ms`, as above.

**Response:**

```json
{
  "cluster_id": "abc123xyz",
  "timestamp_unit": "epoch_milliseconds",
  "window": "24h",
  "retention_days": 7,
  "api_key_prefixes_recorded": true,
  "total_requests": 184210,
  "rows": [
    {
      "client_ip": "203.0.113.7",
      "client_label": null,
      "requests": 152004,
      "api_key_prefixes": ["xyz1"],
      "api_key_prefix_count": 1,
      "top_paths": [
        { "http_method": "POST", "path": "/multi_search", "requests": 150311 },
        { "http_method": "GET", "path": "/collections/products/documents/search", "requests": 1693 }
      ]
    },
    {
      "client_ip": null,
      "client_label": "Typesense Cloud",
      "requests": 4320,
      "api_key_prefixes": [],
      "api_key_prefix_count": 0,
      "top_paths": [
        { "http_method": "GET", "path": "/health", "requests": 2880 },
        { "http_method": "GET", "path": "/metrics.json", "requests": 1440 }
      ]
    }
  ]
}
```

A row's share of the traffic is `requests / total_requests`.

## Get the top API keys

This endpoint returns the 50 API key prefixes with the most requests in the window, each with its 10 busiest paths and the 10 IP addresses that used it most.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/top-api-keys?window=24h" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Query Parameters:** `window` (required), `window_start_ms` and `window_end_ms`, as above.

**Response:**

```json
{
  "cluster_id": "abc123xyz",
  "timestamp_unit": "epoch_milliseconds",
  "window": "24h",
  "retention_days": 7,
  "api_key_prefixes_recorded": true,
  "total_requests": 184210,
  "rows": [
    {
      "api_key_prefix": "xyz1",
      "requests": 152004,
      "distinct_ips": 3,
      "top_paths": [
        { "http_method": "POST", "path": "/multi_search", "requests": 150311 }
      ],
      "top_ips": [
        { "client_ip": "203.0.113.7", "client_label": null, "requests": 151980 }
      ]
    }
  ]
}
```

Requests with no recorded key are grouped under an empty `api_key_prefix`.

## Error responses

- HTTP `400` when a parameter is invalid, such as a `window` that isn't in the list or a `client_ip` that isn't a full IPv4 address.
- HTTP `404` when the cluster doesn't exist on your account.
- HTTP `503` when logs are temporarily unavailable. Retry the request.

### Validation error example

```json
{
  "success": false,
  "message": "client_ip: Enter a full IPv4 address, like 203.0.113.7."
}
```
