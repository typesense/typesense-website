---
description: "Manage advanced Typesense Server configuration parameters for Cloud clusters, including CORS, performance, and analytics settings."
---

# Typesense Server Configuration Parameters API

Once you've provisioned a cluster via the Typesense Cloud web console or using the [Cluster Management API](./cluster-management.md), 
you can configure advanced <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">Typesense Server Configuration Parameters</RouterLink> that control various aspects of Typesense's behavior, 
such as CORS settings, performance tuning, and analytics configuration.

:::warning IMPORTANT
Parameter changes take effect when the Typesense server is restarted. So you want to start a [rolling restart](./cluster-restarts.md#start-a-rolling-restart) after changing them. A [configuration change](./cluster-configuration-changes.md#schedule-a-configuration-change) also restarts every node, so it applies them too.
:::

## List all configuration parameters

This endpoint returns all user-editable server configuration parameters for a cluster.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "parameter_name": "cors-domains",
    "parameter_value": "https://example.com,https://app.example.com",
    "created_at": 1749902400,
    "updated_at": 1749902400
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "parameter_name": "max-per-page",
    "parameter_value": "500",
    "created_at": 1749902400,
    "updated_at": 1749902400
  }
]
```

`created_at` and `updated_at` are Unix timestamps in seconds.

## Get a single parameter

This endpoint retrieves information about a specific server configuration parameter.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters/<ParameterId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "parameter_name": "cors-domains",
  "parameter_value": "https://example.com,https://app.example.com",
  "created_at": 1749902400,
  "updated_at": 1749902400
}
```

## Create a parameter

This endpoint creates a new server configuration parameter for a cluster.
Each parameter can only be set once per cluster, so to change a value, you want to [update it](#update-a-parameter).

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "parameter_name": "cors-domains",
          "parameter_value": "https://example.com,https://app.example.com"
        }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "parameter_name": "cors-domains",
  "parameter_value": "https://example.com,https://app.example.com",
  "created_at": 1749902400,
  "updated_at": 1749902400
}
```

### Request Parameters

| Parameter         | Required | Description |
|-------------------|----------|-------------|
| `parameter_name`  | Required | One of the [available parameters](#available-parameters). |
| `parameter_value` | Required | The value to set. See Valid Values under [available parameters](#available-parameters). |

### Available Parameters

The following parameters can be configured via this API:

| Parameter Name                | Description                                  | Valid Values                  | Typesense Version |
|-------------------------------|----------------------------------------------|-------------------------------|-------------------|
| `cors-domains`                | Comma-separated list of allowed CORS domains | HTTPS URLs only, no wildcards | All               |
| `analytics-flush-interval`    | How often to flush analytics data in seconds | 60 to 94,608,000              | v26+              |
| `analytics-minute-rate-limit` | Rate limit for analytics events per minute   | 5 to 9,999,999                | v28+              |
| `cache-num-entries`           | Number of entries in the search cache        | 1,000 to 9,999,999            | v26+              |
| `embedding-cache-num-entries` | Number of entries in the embedding cache     | 1,000 to 9,999,999            | v29+              |
| `db-compaction-interval`      | Database compaction interval in seconds      | 3,600 to 604,800 (7 days)     | v26+              |
| `filter-by-max-ops`           | Maximum filter operations per search         | 1 to 65,535                   | v27+              |
| `max-per-page`                | Maximum results per page                     | 1 to 10,000                   | v27+              |
| `max-group-limit`             | Maximum group limit for grouped searches     | 1 to 9,999,999                | v29+              |
| `max-query-len`               | Longer search queries are cut to this length | 1 to 10,000 characters        | v31.0.rc20+       |
| `log-slow-requests-time-ms`   | Requests that take at least this many milliseconds are logged as [slow requests](./cluster-logs.md#get-slow-requests) | `-1` (off), or 1,000 to 2,147,483,647 | All |

:::tip Note
Some parameters are only available in specific Typesense server versions. Make sure your cluster is running the required version before configuring these parameters.
:::

## Update a parameter

This endpoint updates the value of an existing server configuration parameter.

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters/<ParameterId>" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "parameter_value": "https://updated.example.com"
        }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "parameter_name": "cors-domains",
  "parameter_value": "https://updated.example.com",
  "created_at": 1749902400,
  "updated_at": 1749906000
}
```

## Delete a parameter

This endpoint removes a server configuration parameter from a cluster.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters/<ParameterId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "success": true
}
```

## Error Responses

- HTTP `400` or `422` when a parameter isn't valid.
- HTTP `404` when the cluster or the parameter doesn't exist.

## Permissions

To [list](#list-all-configuration-parameters) or [get](#get-a-single-parameter) parameters, you need a key with the `clusters:read` capability.
To [create](#create-a-parameter), [update](#update-a-parameter) or [delete](#delete-a-parameter) one, you need `cluster_parameters:manage`.
See [capabilities](./authentication.md#capabilities).
