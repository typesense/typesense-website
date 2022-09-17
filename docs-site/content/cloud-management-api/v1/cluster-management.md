# Cluster Management API

This section talks about how to use the [Typesense Cloud **Cluster Management API**](README.md).

If you're looking for the Typesense Server API docs, see [here](/api).

## Create new cluster

This endpoint lets you provision a new cluster under your Typesense Cloud account.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "memory": "0.5_gb",
          "vcpu": "2_vcpus_1_hr_burst_per_day",
          "regions": ["oregon"],
        }'
```

**Response:**

```json
{
  "success": true,
  "cluster": {
    "id": "az9p28gwxfdsye40d",
    "name": null,
    "memory": "0.5_gb",
    "vcpu": "2_vcpus_1_hr_burst_per_day",
    "high_performance_disk": "no",
    "typesense_server_version": "0.23.1",
    "high_availability": "no",
    "search_delivery_network": "off",
    "load_balancing": "no",
    "regions": [
      "oregon"
    ],
    "auto_upgrade_capacity": null,
    "usage": {
      "runtime_hours": 0,
      "used_bandwidth_kb": {
        "last_7_days": {}
      }
    },
    "provisioned_by": {
      "user_name": "API Key: YOUR-API-KEY*****",
      "user_type": "API Key"
    },
    "provisioned_at": 1663382519,
    "status": "provisioning"
  }
}
```

### Parameters

You can use any of the following parameters inside the payload of the above API call:  

- [memory](#memory) <Badge type="warning" text="Required" vertical="top"/>
- [vcpu](#vcpu) <Badge type="warning" text="Required" vertical="top"/>
- [regions](#regions) <Badge type="warning" text="Required" vertical="top"/>
- [high_availability](#high-availability)
- [search_delivery_network](#search-delivery-network)
- [high_performance_disk](#high-performance-disk)
- [name](#name)
- [auto_upgrade_capacity](#auto-upgrade-capacity)


### `memory`

How much [RAM](/docs/guide/system-requirements) this cluster should have. <Badge type="warning" text="Required" vertical="top"/>

You can use any of the following values:

| `memory` |
|----------|
| 0.5_gb   |
| 1_gb     |
| 2_gb     |
| 4_gb     |
| 8_gb     |
| 16_gb    |
| 32_gb    |
| 64_gb    |
| 96_gb    |
| 128_gb   |
| 192_gb   |
| 256_gb   |
| 384_gb   |
| 512_gb   |
| 768_gb   |
| 1024_gb  |


### `vcpu`

How many [CPU](/docs/guide/system-requirements) cores this cluster should have. <Badge type="warning" text="Required" vertical="top"/>

Only certain CPU configuration are available with particular RAM configurations. The table below lists all available configurations:

| `memory` | `vcpu`                                                             |
|----------|--------------------------------------------------------------------|
| 0.5_gb   | 2_vcpus_1_hr_burst_per_day                                         |
| 1_gb     | 2_vcpus_2_hr_burst_per_day                                         |
| 2_gb     | 2_vcpus_4_hr_burst_per_day                                         |
| 4_gb     | 2_vcpus_4_hr_burst_per_day <br> 2_vcpus                            |
| 8_gb     | 2_vcpus_7_hr_burst_per_day <br> 2_vcpus <br> 4_vcpus               |
| 16_gb    | 2_vcpus <br> 4_vcpus_5_hr_burst_per_day <br> 4_vcpus <br> 8_vcpus  |
| 32_gb    | 4_vcpus <br> 8_vcpus_4_hr_burst_per_day <br> 8_vcpus <br> 16_vcpus |
| 64_gb    | 8_vcpus <br> 16_vcpus <br> 32_vcpus                                |
| 96_gb    | 12_vcpus <br> 24_vcpus <br> 48_vcpus                               |
| 128_gb   | 4_vcpus <br> 16_vcpus <br> 32_vcpus <br> 64_vcpus                  |
| 192_gb   | 24_vcpus <br> 48_vcpus <br> 96_vcpus                               |
| 256_gb   | 8_vcpus <br> 32_vcpus <br> 64_vcpus <br> 128_vcpus                 |
| 384_gb   | 48_vcpus <br> 96_vcpus <br> 128_vcpus                              |
| 512_gb   | 16_vcpus <br> 64_vcpus <br> 128_vcpus                              |
| 768_gb   | 24_vcpus <br> 96_vcpus <br> 192_vcpus                              |
| 1024_gb  | 32_vcpus <br> 64_vcpus <br> 128_vcpus                              |

### `regions`

An array with one or more regions where the nodes should be geographically placed. <Badge type="warning" text="Required" vertical="top"/>

- For a non-Search-Delivery-Network cluster, the array should have only one region.
- For a Search Delivery Network (SDN) cluster, the array should have 3 or 5 regions depending on the number of SDN regions. 

The table below lists all available regions:

| `regions`    |
|--------------|
| n_california |
| oregon       |
| n_virginia   |
| ohio         |
| canada       |
| sao_paulo    |
| ireland      |
| london       |
| paris        |
| frankfurt    |
| stockholm    |
| milan        |
| cape_town    |
| bahrain      |
| mumbai       |
| singapore    |
| seoul        |
| osaka        |
| tokyo        |
| sydney       |


### `high_availability`

When set to `yes`, at least 3 nodes are provisioned in 3 different data centers to form a highly available (HA) cluster and your data is automatically replicated between all nodes.

Default: `no`

### `search_delivery_network`

When not `off`, nodes are provisioned in different regions and the node that's closest to it's originating location serves the traffic.

Default: `off`

The table below lists all available options:

| `search_delivery_network` |
|---------------------------|
| off                       |
| 3_regions                 |
| 5_regions                 |

**IMPORTANT:** Make sure you set `high_availability` to `yes` when you turn on Search Delivery Network.


### `high_performance_disk`

When set to `yes`, the provisioned hard disk will be co-located on the same physical server that runs the node.

Default: `no`

**IMPORTANT:** This option is only available when:

- The cluster has High Availability turned on
- The cluster does not have a burst CPU type.

### `name`

A string to identify the cluster for your reference in the Typesense Cloud Web console.

Default: `null`

### `auto_upgrade_capacity`

When set to `true`, your cluster will be automatically upgraded when best-practice RAM/CPU thresholds are exceeded in a 12-hour rolling window.

Default: `false`


## Generate API key

This endpoint can be used to generate [Typesense Server API](/api) Keys for your cluster.

You can only generate API keys for a cluster, once its status changes to `in_service`. New clusters take at least 4 minutes to go from `provisioning` status to `in_service`.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/api-keys" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "success": true,
  "api_keys": {
    "admin_key": "cBKqFPEcGRAS7RIKi3h3FuJbj4Q9Rprk",
    "search_only_key": "y7CFw2zEgu09FFhoDgLzC99j0RwKi0kL"
  }
}
```

This API endpoint is the equivalent of clicking on the "Generate API Keys" button in the Cluster Dashboard on Typesense Cloud Web console.

## Get single cluster

This endpoint can be used to get information about a single cluster.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "az9p28gwxfdsye40d",
  "name": null,
  "memory": "0.5_gb",
  "vcpu": "2_vcpus_1_hr_burst_per_day",
  "high_performance_disk": "no",
  "typesense_server_version": "0.23.1",
  "high_availability": "no",
  "search_delivery_network": "off",
  "load_balancing": "no",
  "regions": ["oregon"],
  "auto_upgrade_capacity": false,
  "usage": {
    "runtime_hours": 5643,
    "used_bandwidth_kb": {
      "last_7_days": {}
    }
  },
  "provisioned_by": {
    "user_name": "John Doe",
    "user_type": "User"
  },
  "provisioned_at": 1663382520,
  "status": "in_service"
}
```

# List all clusters

This endpoint can be used to list all clusters under this account.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "page": 1,
  "per_page": 1,
  "total": 2,
  "clusters": [
    {
      "id": "az9p28gwxfdsye40d",
      "name": null,
      "memory": "0.5_gb",
      "vcpu": "2_vcpus_1_hr_burst_per_day",
      "high_performance_disk": "no",
      "typesense_server_version": "0.23.1",
      "high_availability": "no",
      "search_delivery_network": "off",
      "load_balancing": "no",
      "regions": [
        "oregon"
      ],
      "auto_upgrade_capacity": false,
      "usage": {
        "runtime_hours": 5643,
        "used_bandwidth_kb": {
          "last_7_days": {}
        }
      },
      "provisioned_by": {
        "user_name": "John Doe",
        "user_type": "User"
      },
      "provisioned_at": 1663382520,
      "status": "in_service"
    }
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

## Update cluster attributes

This endpoint can be used to update select cluster attributes:

- `auto_upgrade_capacity`
- `name`

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "auto_upgrade_capacity": true,
          "name": "New Name"
        }'
```

**Response:**

```json
{
  "id": "az9p28gwxfdsye40d",
  "name": "New Name",
  "memory": "0.5_gb",
  "vcpu": "2_vcpus_1_hr_burst_per_day",
  "high_performance_disk": "no",
  "typesense_server_version": "0.23.1",
  "high_availability": "no",
  "search_delivery_network": "off",
  "load_balancing": "no",
  "regions": ["oregon"],
  "auto_upgrade_capacity": true,
  "usage": {
    "runtime_hours": 5643,
    "used_bandwidth_kb": {
      "last_7_days": {}
    }
  },
  "provisioned_by": {
    "user_name": "John Doe",
    "user_type": "User"
  },
  "provisioned_at": 1663382520,
  "status": "in_service"
}
```

## Terminate cluster

This endpoint terminates a running cluster. 

This action cannot be undone. Once a cluster is terminated, all data in it is destroyed permanently as a security and privacy measure.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterID>/lifecycle" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "lifecycle_action": "terminate"
        }'
```

**Response:**

```json
{
  "success": true,
  "message": "Cluster termination has been initiated"
}
```

### Parameters

This endpoint takes a single parameter `lifecycle_action` and should have the value `terminate`