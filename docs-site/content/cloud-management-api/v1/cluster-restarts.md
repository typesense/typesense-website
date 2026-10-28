---
description: "Typesense Cloud rolling restart endpoints restart Typesense on every node of a cluster, one node at a time, and let you schedule, retrieve, list or cancel restarts."
---

# Cluster Restarts API

A rolling restart restarts Typesense on each node of your cluster in turn, waiting for each node to reload its data before moving to the next one.
You can use it to apply [Typesense server parameters](./typesense-server-configuration-parameters.md) you've saved, or to restart a cluster on a schedule.

:::warning IMPORTANT
A single-node cluster can't serve searches or writes until its node has restarted and reloaded its data.
For zero-downtime restarts, you want to enable [High Availability](https://cloud-help.typesense.org/article/high-availability).
On a highly available cluster, the other nodes keep serving while each node restarts, as long as your client is [configured with all of the cluster's nodes](../../guide/high-availability.md#when-using-typesense-cloud-or-a-load-balancer).
:::

## Workflow

Here's a typical sequence of API calls you'd perform when using this API:

1. [Start a rolling restart](#start-a-rolling-restart), now or at a scheduled time.
2. Poll the [rolling restart info endpoint](#get-single-rolling-restart) to follow its progress.
3. If you need to, [cancel the restart](#cancel-a-pending-rolling-restart) before it starts.

## Start a rolling restart

Here's how you schedule a rolling restart:

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/restarts" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "perform_restart_at": 1792429200,
          "notification_email_addresses": ["email@example.com"]
        }'
```

**Response:**

```json
{
  "success": true,
  "restart": {
    "id": "862c8506-2653-4b95-baca-dcaf61f62531",
    "status": "pending",
    "perform_restart_at": 1792429200,
    "nodes_total": 3,
    "nodes_restarted": 0,
    "created_at": 1792422000,
    "updated_at": 1792422000,
    "completed_at": null,
    "notification_email_addresses": [
      "email@example.com"
    ]
  }
}
```

:::tip Note
A [configuration change](./cluster-configuration-changes.md#schedule-a-configuration-change) already restarts every node and applies your server parameters, so you don't need a rolling restart after one.
:::

### Request Parameters

| Parameter                      | Required | Description |
|--------------------------------|----------|-------------|
| `perform_restart_at`           | Optional | When to start the restart, as a Unix timestamp in seconds, up to one year ahead. If you leave it out or send a time that's already passed, the restart starts right away. |
| `notification_email_addresses` | Optional | An array of email addresses to notify when the rolling restart completes. |

### Error Responses

The API returns HTTP `400` and doesn't start the rolling restart when:

- the cluster is not In Service, or is not ready to use yet
- a configuration change or another rolling restart on the cluster is scheduled or in progress
- the cluster is the source or the target of a cloning operation that's pending or in progress
- a parameter isn't valid

## Get single rolling restart

This endpoint returns a single rolling restart:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/restarts/<RestartId>" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "862c8506-2653-4b95-baca-dcaf61f62531",
  "status": "in_progress",
  "perform_restart_at": 1792429200,
  "nodes_total": 3,
  "nodes_restarted": 1,
  "created_at": 1792422000,
  "updated_at": 1792429980,
  "completed_at": null,
  "notification_email_addresses": [
    "email@example.com"
  ]
}
```

### Response Parameters

#### `status`

| `status`      | Description                                                                                                       |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| `pending`     | The rolling restart is scheduled and hasn't started yet.                                |
| `in_progress` | Nodes are being restarted.                                                         |
| `canceled`    | The rolling restart was canceled before it started.                                                               |
| `succeeded`   | Every node was restarted.                                                                                         |
| `failed`      | The rolling restart failed due to an internal error.                                                              |

## List all rolling restarts

Rolling restarts are listed newest first.
`per_page` can be up to 10.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/restarts?per_page=1" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "page": 1,
  "per_page": 1,
  "total": 4,
  "restarts": [
    {
      "id": "862c8506-2653-4b95-baca-dcaf61f62531",
      "status": "succeeded",
      "perform_restart_at": 1792429200,
      "nodes_total": 3,
      "nodes_restarted": 3,
      "created_at": 1792422000,
      "updated_at": 1792431120,
      "completed_at": 1792431120,
      "notification_email_addresses": [
        "email@example.com"
      ]
    }
  ]
}
```

## Cancel a pending rolling restart

You can only cancel a rolling restart that's still `pending`:

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/restarts/<RestartId>" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "status": "canceled"
        }'
```

**Response:**

```json
{
  "success": true,
  "restart": {
    "id": "862c8506-2653-4b95-baca-dcaf61f62531",
    "status": "canceled",
    "perform_restart_at": 1792429200,
    "nodes_total": 3,
    "nodes_restarted": 0,
    "created_at": 1792422000,
    "updated_at": 1792422600,
    "completed_at": null,
    "notification_email_addresses": [
      "email@example.com"
    ]
  }
}
```

### Error Responses

The API returns HTTP `400` when `status` isn't `canceled`, or when the rolling restart isn't `pending` any more.
It returns HTTP `404` when the cluster has no rolling restart with this ID.

```json
{
  "success": false,
  "message": "Only rolling restarts in a `pending` status can be canceled."
}
```

## Permissions

To [start](#start-a-rolling-restart) or [cancel](#cancel-a-pending-rolling-restart) a rolling restart, you need a key with the `clusters:restart` capability.
To [get](#get-single-rolling-restart) or [list](#list-all-rolling-restarts) rolling restarts, you need `clusters:read`.
See [capabilities](./authentication.md#capabilities).
