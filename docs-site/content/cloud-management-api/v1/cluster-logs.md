---
description: "Read a Typesense Cloud cluster's request logs through the Cluster Management API: the access log, slow requests and which client IPs and API keys send the most requests."
---

# Cluster Logs API

You can read every request a cluster received and the requests that were slower than the cluster's slow-request thresholds.
You can also see which client IPs and API keys sent the most requests.

## Time windows

Every endpoint except [API key last use](#get-when-each-api-key-was-last-used) takes a required `window` parameter: one of `15m`, `1h`, `6h`, `24h`, `3d` or `7d`.
The window ends now, or at `window_end_ms` when you send it.
To read an exact range instead, set `window=custom` and send `window_start_ms` and `window_end_ms` in epoch milliseconds.
A start time more than 7 days ago reads from 7 days ago.

Each response has a `window_end_ms`.
When you page through the access log or slow requests, you want to send that value back as `window_end_ms` along with `before_ms`, so every page reads the same interval while new requests keep coming in.

Timestamps in this API are Unix timestamps in **milliseconds**.

## API key prefixes

Logs record the first 4 characters of each request's API key, which we call the key prefix.
A scoped search key is logged under its parent key's prefix.
If a `multi_search` request uses several keys, you'll see their prefixes separated by commas.

Typesense Server versions before `v31` don't log key prefixes.
So when no request in the window has one, `api_key_prefixes_recorded` is `false` and an empty `api_key_prefix` only means the prefix wasn't recorded.

Requests Typesense Cloud itself sends to your cluster (health checks, metrics and the dashboard) have a `client_ip` of `null` and a `client_label` of `"Typesense Cloud"`.

## Get access log

This endpoint returns the requests a cluster received, newest first, 200 per page.
Each row has the request's path without its query string, and no request body.
To see the parameters a search was sent with, use [slow requests](#get-slow-requests), which records them for requests that took longer than the cluster's thresholds.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/access?window=1h&http_method=POST&path=/multi_search" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

### Request Parameters

| Parameter      | Required | Description                                                                                         |
|----------------|----------|-----------------------------------------------------------------------------------------------------|
| window         | Required | `15m`, `1h`, `6h`, `24h`, `3d`, `7d` or `custom`.                                                   |
| window_start_ms | Conditional | Start of a `custom` window, in epoch milliseconds. Required when `window` is `custom`.               |
| window_end_ms  | Optional | Fixes the end of the window. Send back the `window_end_ms` of the first page when paging.           |
| before_ms      | Optional | Page cursor: the `next_before_ms` of the previous page.                                             |
| client_ip      | Optional | Only requests from this IPv4 address.                                                               |
| http_method    | Optional | Only requests with this method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` or `OPTIONS`.               |
| path           | Optional | Only requests whose path contains this text (case-sensitive).                 |
| api_key_prefix | Optional | Only requests made with this key prefix.                                                            |

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

This endpoint returns the requests that took longer than the cluster's [`log-slow-requests-time-ms`](./typesense-server-configuration-parameters.md#available-parameters) threshold, and searches that took longer than `log-slow-searches-time-ms`.
For a `multi_search` request, you also get its body.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/slow-requests?window=24h&sort=slowest" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

### Request Parameters

| Parameter     | Required | Default  | Description                                                                                    |
|---------------|----------|----------|------------------------------------------------------------------------------------------------|
| window        | Required |          | `15m`, `1h`, `6h`, `24h`, `3d`, `7d` or `custom`.                                              |
| window_start_ms | Conditional |          | Start of a `custom` window, in epoch milliseconds. Required when `window` is `custom`.          |
| window_end_ms | Optional |          | Fixes the end of the window. Send back the `window_end_ms` of the first page when paging.      |
| sort          | Optional | `newest` | `newest` pages through the window with `before_ms`. `slowest` returns one page of the slowest. |
| before_ms     | Optional |          | Page cursor for `sort=newest`: the `next_before_ms` of the previous page.                      |
| limit         | Optional | `20`     | Rows per page, from 1 to 100.                                                                  |

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
- `capped` is `true` when you use `sort=slowest` and the window has more slow requests than fit on one page.
- API keys in a query string or body show up as `[redacted]`.

## Get top client IPs

This endpoint returns the 50 IP addresses that sent the most requests in the window, each with up to 10 of the API key prefixes it used and its 10 busiest paths.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/top-ips?window=24h" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

This endpoint takes the same `window`, `window_start_ms` and `window_end_ms` parameters as the [access log](#get-access-log).

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

## Get top API keys

This endpoint returns the 50 API key prefixes with the most requests in the window, each with its 10 busiest paths and the 10 IP addresses that used it most.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/top-api-keys?window=24h" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

This endpoint takes the same `window`, `window_start_ms` and `window_end_ms` parameters as the [access log](#get-access-log).

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

## Get when each API key was last used

This endpoint returns when each API key prefix last made a request in the past 7 days, most recent first.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/logs/api-keys-last-used" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "cluster_id": "abc123xyz",
  "timestamp_unit": "epoch_milliseconds",
  "retention_days": 7,
  "api_key_prefixes_recorded": true,
  "capped": false,
  "recorded_since_ms": 1786060800000,
  "rows": [
    { "api_key_prefix": "xyz1", "last_used_ms": 1786665571000 },
    { "api_key_prefix": "Ab9Q", "last_used_ms": 1786579200000 }
  ]
}
```

`api_key_prefix` matches the `value_prefix` of a key in the [cluster's API key list](./cluster-api-keys.md#list-all-api-keys).
Two keys can share a prefix.

`recorded_since_ms` is the time of the earliest request in the past 7 days that carried a key prefix, or `null` if none did.
If a key isn't listed, it hasn't made a request since then, unless one of these is true:

- `api_key_prefixes_recorded` is `false`: no request in the past 7 days carried a key prefix.
- `capped` is `true`: more than 1,000 key prefixes were used. The rows are the 1,000 most recently used.

## Error responses

- HTTP `400` when a parameter isn't valid.
- HTTP `404` when the cluster doesn't exist on your account.
- HTTP `503` when logs are temporarily unavailable.

## Permissions

To [get the access log](#get-access-log), [slow requests](#get-slow-requests), [top client IPs](#get-top-client-ips), [top API keys](#get-top-api-keys) or [when each API key was last used](#get-when-each-api-key-was-last-used), you need a key with the `metrics:read` capability.
See [capabilities](./authentication.md#capabilities).
