---
description: "Typesense Cloud cluster cloning endpoints create copies of active clusters and let you retrieve, list, or cancel cloning operations."
---

# Cluster Cloning API

Once you've provisioned a cluster via the Typesense Cloud web console or using the [Cluster Management API](./cluster-management.md), you can create a clone of that cluster using the API below.

## Workflow

Here's a typical sequence of API Calls you'd perform when using this API:

1. [Start a new cloning operation](#start-a-cloning-operation) (which is an asynchronous process).
2. Poll the [cloning operation info endpoint](#get-single-cloning-operation) to get the status of the cloning operation.
3. If you need to, [cancel a pending cloning operation](#cancel-a-pending-cloning-operation).

The rest of this document will talk about the individual endpoints.

## Start a Cloning Operation

This endpoint lets you create a clone of an existing cluster that is in service.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/cloning-operations" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "typesense_server_version": "28.0",
          "target_region": "oregon",
          "name": "products-staging",
          "notification_email_addresses": ["email@example.com"]
        }'
```

**Response:**

```json
{
  "success": true,
  "cloning_operation": {
    "id": "fbff4b22-23d3-46e8-a599-144b622f4dd4",
    "status": "pending",
    "created_at": 1743046821,
    "updated_at": 1743046821,
    "completed_at": null,
    "source_region": "oregon",
    "target_region": "oregon",
    "typesense_server_version": "28.0",
    "target_cluster_name": "products-staging",
    "target_cluster_reference_id": null,
    "notification_email_addresses": [
      "email@example.com"
    ]
  }
}
```

:::tip Note
You can only have one cloning operation active / pending at a given time.
:::

### Request Parameters

| Parameter                      | Required | Description |
|--------------------------------|----------|-------------|
| `typesense_server_version`     | Optional | The Typesense Server version for the cloned cluster. If not specified, the source cluster's version will be used. |
| `target_region`                | Optional | The region where the cloned cluster should be provisioned. This must be one of the valid regions listed [here](./cluster-management.md#regions). |
| `name`                         | Optional | A name for the cloned cluster. |
| `notification_email_addresses` | Optional | An array of email addresses that will be notified when the cloning operation completes or fails. |

### Error Responses

The API returns HTTP `400` and doesn't create the cloning operation when:

- the cluster isn't In Service
- another cloning operation on the cluster is pending or in progress
- a [configuration change](./cluster-configuration-changes.md#schedule-a-configuration-change) or [rolling restart](./cluster-restarts.md#start-a-rolling-restart) on the cluster is scheduled or in progress
- a [backup](./cluster-backups.md) of the cluster is running
- the `typesense_server_version` or `target_region` isn't available
- a parameter isn't valid

It returns HTTP `402` when the account has neither a payment method nor a positive prepaid credit balance.
It returns HTTP `403` when the account has unpaid invoices with failed payments.
It returns HTTP `422` when the account has reached its maximum number of clusters.

## Get single cloning operation

This endpoint can be used to get information about a single cloning operation.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/cloning-operations/<OperationId>" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "fbff4b22-23d3-46e8-a599-144b622f4dd4",
  "status": "succeeded",
  "created_at": 1742607328,
  "updated_at": 1742608267,
  "completed_at": 1742608267,
  "source_region": "oregon",
  "target_region": "oregon",
  "typesense_server_version": "28.0.rc29",
  "target_cluster_name": "products-staging",
  "target_cluster_reference_id": "815p962i73hnjcdud",
  "notification_email_addresses": [
    "email@example.com",
    "email@example.net"
  ]
}
```

### Response Parameters

#### `status`

The `status` field can be any of the following values:

| `status`      | Description                                                                                                                                                                                                                  |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pending`     | Cloning operation is pending execution                                                                                                                                                                                       |
| `in_progress` | Cloning operation is in progress and cannot be canceled any more                                                                                                                                                             |
| `canceled`    | Cloning operation was canceled                                                                                                                                                                                               |
| `succeeded`   | Cloning operation was successfully completed. The `completed_at` field will give you the time when this cloning operation was completed, and `target_cluster_reference_id` will contain the ID of the newly created cluster. |
| `failed`      | Cloning operation failed due to an internal error                                                                                                                                                                            |

## List all cloning operations

This endpoint can be used to list all cloning operations for a cluster.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/cloning-operations?per_page=1" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "page": 1,
  "per_page": 1,
  "total": 3,
  "cloning_operations": [
    {
      "id": "fbff4b22-23d3-46e8-a599-144b622f4dd4",
      "status": "succeeded",
      "created_at": 1742607328,
      "updated_at": 1742608267,
      "completed_at": 1742608267,
      "source_region": "oregon",
      "target_region": "oregon",
      "typesense_server_version": "28.0.rc29",
      "target_cluster_name": "products-staging",
      "target_cluster_reference_id": "815p962i73hnjcdud",
      "notification_email_addresses": [
        "email@example.com",
        "email@example.net"
      ]
    }
  ]
}
```

### Request Parameters

| Parameter  | Required | Description |
|------------|----------|-------------|
| `per_page` | Optional | The number of results per page. Default: `10` |
| `page`     | Optional | Page number to fetch. Default: `1` |

## Cancel a pending cloning operation

You can use this endpoint to cancel a pending cloning operation.

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/cloning-operations/<OperationID>" \
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
  "cloning_operation": {
    "id": "fbff4b22-23d3-46e8-a599-144b622f4dd4",
    "status": "canceled",
    "created_at": 1742607328,
    "updated_at": 1742607328,
    "completed_at": null,
    "source_region": "oregon",
    "target_region": "oregon",
    "typesense_server_version": "28.0.rc29",
    "target_cluster_name": "products-staging",
    "target_cluster_reference_id": null,
    "notification_email_addresses": [
      "email@example.com",
      "email@example.net"
    ]
  }
}
```

:::tip Note
Only cloning operations in a `pending` status can be canceled.

:::

## Permissions

To [start](#start-a-cloning-operation) or [cancel](#cancel-a-pending-cloning-operation) a cloning operation, you need a key with the `clusters:clone` capability.
To [get](#get-single-cloning-operation) or [list](#list-all-cloning-operations) cloning operations, you need `clusters:read`.
See [capabilities](./authentication.md#capabilities).
