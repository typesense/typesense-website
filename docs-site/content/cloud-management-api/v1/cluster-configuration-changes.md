# Cluster Configuration Changes API

Once you've provisioned a cluster via the Typesense Cloud web console or using the [Cluster Management API](./cluster-management.md), 
you can change its configuration using the API below.

## Workflow

Here's a typical sequence of API Calls you'd perform when using this API:

1. [Schedule a new configuration change](#schedule-a-configuration-change) (which is an asynchronous process).
2. Poll the [single config change info endpoint](#get-single-configuration-change) to get the status of the configuration change.
3. If you need to cancel a pending config change, use the [update config change](#cancel-a-pending-configuration-change) endpoint. 

The rest of this document will talk about the individual endpoints.

## Schedule a Configuration Change

This endpoint lets you change the RAM, CPU, High Availability and Typesense Server versions of a cluster that is in service.

You can skip any fields you don't want to change in the payload below.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/configuration-changes" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "new_memory": "1_gb",
          "new_vcpu": "2_vcpus_2_hr_burst_per_day",
          "new_typesense_server_version: "0.24.1",
          "new_high_availability: "yes",
          "perform_change_at": 1787923647,
          "notification_email_addresses": ["email@example.com"]
        }'
```

**Response:**

```json
{
  "success": true,
  "configuration_change": {
    "id": "ecf1d570-7f49-47ef-b648-41ccf7eaf5d2",
    "status": "pending",
    "created_at": 1687996347,
    "updated_at": 1687996347,
    "perform_change_at": 1787923647,
    "completed_at": null,
    "old_memory": "0.5_gb",
    "old_vcpu": "2_vcpus_1_hr_burst_per_day",
    "old_gpu": null,
    "old_high_performance_disk": null,
    "old_typesense_server_version": "0.23.1",
    "old_high_availability": "no",
    "old_load_balancing": "no",
    "new_memory": "1_gb",
    "new_vcpu": "2_vcpus_2_hr_burst_per_day",
    "new_gpu": null,
    "new_high_performance_disk": null,
    "new_typesense_server_version": "0.24.1",
    "new_high_availability": "yes",
    "new_load_balancing": "yes",
    "notification_email_addresses": [
      "email@example.com"
    ]
  }
}
```

:::tip Note
You can only have one configuration change active / pending at a given time. 
:::

### Parameters

You can use any of the following parameters inside the payload of the above API call:

- [perform_change_at](#perform-change-at) <Badge type="warning" text="Required" vertical="top"/>
- [new_memory](#new-memory)
- [new_vcpu](#new-vcpu)
- [new_gpu](#new-gpu)
- [new_high_availability](#new-high-availability)
- [new_high_performance_disk](#new-high-performance-disk)
- [new_typesense_server_version](#new-typesense-server-version)

### `perform_change_at`

The Unix timestamp at which this configuration change should be performed at.

Should be a timestamp in the future.

### `new_memory`

How much [RAM](../../guide/system-requirements.md) this cluster should have.

You can use any of the following values mentioned [here](./cluster-management.md#memory).

### `new_vcpu`

How many [CPU](../../guide/system-requirements.md) cores this cluster should have.

Only certain CPU configuration are available with particular RAM configurations. The table [here](./cluster-management.md#vcpu) lists all available configurations.

### `new_gpu`

When set to `yes`, it enables the use of a GPU to accelerate embedding generation when using built-in ML models both during indexing and searching.

Only certain RAM / CPU configurations are available with GPU acceleration. The table [here](./cluster-management.md#gpu) lists all available configurations.

### `new_high_availability`

When set to `yes`, at least 3 nodes are provisioned in 3 different data centers to form a highly available (HA) cluster and your data is automatically replicated between all nodes.

:::tip Note
Once High Availability is enabled, it cannot be turned off. 

If you want to turn off HA, you'd need to provision a new cluster without HA, reindex your data in it and then terminate the HA cluster.
:::

### `new_high_performance_disk`

When set to `yes`, the provisioned hard disk will be co-located on the same physical server that runs the node.

**IMPORTANT:** This option is only available when:

- The cluster has High Availability turned on
- The cluster does not have a burst CPU type.

### `new_typesense_server_version`

The Typesense Server version to change this cluster to.

## Get single configuration change

This endpoint can be used to get information about a single configuration change.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/configuration-changes/<ConfigurationChangeId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "ecf1d570-7f49-47ef-b648-41ccf7eaf5d2",
  "status": "pending",
  "created_at": 1687996347,
  "updated_at": 1687996347,
  "perform_change_at": 1787923647,
  "completed_at": null,
  "old_memory": "0.5_gb",
  "old_vcpu": "2_vcpus_1_hr_burst_per_day",
  "old_gpu": null,
  "old_high_performance_disk": null,
  "old_typesense_server_version": "0.23.1",
  "old_high_availability": "no",
  "old_load_balancing": "no",
  "new_memory": "1_gb",
  "new_vcpu": "2_vcpus_2_hr_burst_per_day",
  "new_gpu": null,
  "new_high_performance_disk": null,
  "new_typesense_server_version": "0.24.1",
  "new_high_availability": "yes",
  "new_load_balancing": "yes",
  "notification_email_addresses": [
    "email@example.com"
  ]
}
```

### `status`

The `status` field can be any of the following values:

| `status`      | Description                                                                                                                      |
|---------------|----------------------------------------------------------------------------------------------------------------------------------|
| `pending`     | Config change is pending execution at the specified `perform_change_at` timestamp.                                               |
| `in_progress` | Config change is in progress and cannot be canceled any more.                                                                    |
| `canceled`    | Config change was canceled.                                                                                                      |
| `succeeded`   | Config change was successfully completed. The `completed_at` field will give you the time when this config change was completed. |
| `failed`      | Config change failed due to an internal error.                                                                                   |

## List all configuration changes

This endpoint can be used to list all configuration changes for a cluster.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/configuration-changes?per_page=1" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "page": 1,
  "per_page": 1,
  "total": 10,
  "configuration_changes": [
    "id": "ecf1d570-7f49-47ef-b648-41ccf7eaf5d2",
    "status": "pending",
    "created_at": 1687996347,
    "updated_at": 1687996347,
    "perform_change_at": 1787923647,
    "completed_at": null,
    "old_memory": "0.5_gb",
    "old_vcpu": "2_vcpus_1_hr_burst_per_day",
    "old_gpu": null,
    "old_high_performance_disk": null,
    "old_typesense_server_version": "0.23.1",
    "old_high_availability": "no",
    "old_load_balancing": "no",
    "new_memory": "1_gb",
    "new_vcpu": "2_vcpus_2_hr_burst_per_day",
    "new_gpu": null,
    "new_high_performance_disk": null,
    "new_typesense_server_version": "0.24.1",
    "new_high_availability": "yes",
    "new_load_balancing": "yes",
    "notification_email_addresses": [
      "email@example.com"
    ]
  ]
}
```

### Parameters

You can use the following query parameters with this endpoint:

### `per_page`

The number of results per page.

Default: `10`

### `page`

Page number to fetch

Default: `1`

## Cancel a pending configuration change

You can use this endpoint to cancel a pending configuration change.

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/configuration-changes/<ConfigurationChangeId>" \
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
  "configuration_change": {
    "id": "ecf1d570-7f49-47ef-b648-41ccf7eaf5d2",
    "status": "canceled",
    "created_at": 1687996347,
    "updated_at": 1687996347,
    "perform_change_at": 1787923647,
    "completed_at": null,
    "old_memory": "0.5_gb",
    "old_vcpu": "2_vcpus_1_hr_burst_per_day",
    "old_high_performance_disk": null,
    "old_typesense_server_version": "0.23.1",
    "old_high_availability": "no",
    "old_load_balancing": "no",
    "new_memory": "1_gb",
    "new_vcpu": "2_vcpus_2_hr_burst_per_day",
    "new_high_performance_disk": null,
    "new_typesense_server_version": "0.24.1",
    "new_high_availability": "yes",
    "new_load_balancing": "yes",
    "notification_email_addresses": [
      "email@example.com"
    ]
  }
}
```
