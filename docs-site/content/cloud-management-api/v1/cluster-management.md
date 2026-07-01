# Cluster Management API

This section talks about how to use the [Typesense Cloud **Cluster Management API**](README.md).

If you're looking for the Typesense Server API docs, see [here](/api).

## Workflow

Here's a typical sequence of API Calls you'd perform when using this API:

1. [Create a new cluster](#create-new-cluster) (which is an asynchronous process that will take 4 - 5 minutes).
2. Poll the [single cluster info endpoint](#get-single-cluster) to get the status of the cluster.
3. Once the cluster has `status: in_service`, save the `hostnames` field returned by the cluster info endpoint.
4. [Generate Typesense API keys](#generate-api-key) for the cluster and store these keys in a secrets store on your side.
5. Now, you can make [Typesense API calls](/api) directly to your new cluster using the hostnames in Step 3 and API Keys in Step 4.
6. Once you're done with the cluster, you can terminate it using the [lifecycle](#terminate-cluster) endpoint.

The rest of this document will talk about the individual endpoints.

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
    "gpu": "no",
    "high_performance_disk": "no",
    "typesense_server_version": "0.23.1",
    "high_availability": "no",
    "high_availability_node_count": null,
    "search_delivery_network": "off",
    "load_balancing": "no",
    "regions": [
      "oregon"
    ],
    "region_node_counts": {
      "oregon": 1
    },
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
- [region_node_counts](#region-node-counts)
- [high_availability_node_count](#high-availability-node-count)
- [gpu](#gpu)
- [high_availability](#high-availability)
- [search_delivery_network](#search-delivery-network)
- [high_performance_disk](#high-performance-disk)
- [typesense_server_version](#typesense-server-version)
- [name](#name)
- [auto_upgrade_capacity](#auto-upgrade-capacity)

### `memory`

How much [RAM](../../guide/system-requirements.md) this cluster should have. <Badge type="warning" text="Required" vertical="top"/>

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

How many [CPU](../../guide/system-requirements.md) cores this cluster should have. <Badge type="warning" text="Required" vertical="top"/>

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

This field is required unless you provide [`region_node_counts`](#region-node-counts) instead.

- For a non-Search-Delivery-Network cluster, the array should have only one region.
- For a Search Delivery Network (SDN) cluster with the `3_regions` or `5_regions` option, the array should have 3 or 5 regions respectively, with one node placed in each region.

If you want to place more than one node in a region (for example, a highly available cluster with more than 3 nodes, or a [Multi-Nodes Per Region](#search-delivery-network) SDN cluster), use [`region_node_counts`](#region-node-counts) instead of `regions`. You can only specify one of `regions` or `region_node_counts`.

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
| zurich       |
| frankfurt    |
| stockholm    |
| milan        |
| spain        |
| cape_town    |
| bahrain      |
| uae          |
| mumbai       |
| hyderabad    |
| singapore    |
| jakarta      |
| seoul        |
| osaka        |
| tokyo        |
| melbourne    |
| sydney       |

### `region_node_counts`

An object that maps region names to the number of nodes you want placed in each region. Use this instead of [`regions`](#regions) when you want to control how many nodes go into each region.

For example, to provision a Multi-Nodes Per Region SDN cluster with 2 nodes in Oregon and 1 node in Frankfurt:

```json
{
  "high_availability": "yes",
  "search_delivery_network": "multi_nodes_per_region",
  "region_node_counts": {
    "oregon": 2,
    "frankfurt": 1
  }
}
```

The region names are the same values listed in the [`regions`](#regions) table above, and each node count must be a positive integer.

The number of regions and nodes you can specify depends on the cluster's [`high_availability`](#high-availability) and [`search_delivery_network`](#search-delivery-network) options:

| Configuration                                          | Regions          | Nodes                              |
|--------------------------------------------------------|------------------|------------------------------------|
| Single region, High Availability off                   | Exactly 1 region | Exactly 1 node                     |
| Single region, High Availability on                    | Exactly 1 region | Between 3 and 7 nodes              |
| `search_delivery_network`: `3_regions`                 | Exactly 3 regions | 1 node per region                 |
| `search_delivery_network`: `5_regions`                 | Exactly 5 regions | 1 node per region                 |
| `search_delivery_network`: `multi_nodes_per_region`    | Between 2 and 7 regions | Between 3 and 7 nodes in total |

You can only specify one of `regions` or `region_node_counts`. To set the number of nodes for a single-region highly available cluster, use [`high_availability_node_count`](#high-availability-node-count) together with a single [`regions`](#regions) value instead.

### `high_availability_node_count`

The number of nodes to provision for a single-region highly available cluster. This is a shorthand for specifying [`region_node_counts`](#region-node-counts) with a single region.

This option:

- Can only be used when [`high_availability`](#high-availability) is `yes`.
- Can only be used when [`search_delivery_network`](#search-delivery-network) is `off`.
- Requires exactly one region (specified via [`regions`](#regions)).
- Must be between 3 and 7.

For example, to provision a 5-node highly available cluster in Oregon:

```json
{
  "high_availability": "yes",
  "regions": ["oregon"],
  "high_availability_node_count": 5
}
```

You can only specify one of `high_availability_node_count` or [`region_node_counts`](#region-node-counts).

### `gpu`

When set to `yes`, it enables the use of a GPU to accelerate embedding generation when using built-in ML models both during indexing and searching.

This option is only available with the following RAM / CPU configurations:

| `ram`  | `vcpu`   |
|--------|----------|
| 8_gb   | 4_vcpus  |
| 16_gb  | 4_vcpus  |
| 16_gb  | 8_vcpus  |
| 32_gb  | 8_vcpus  |
| 32_gb  | 16_vcpus |
| 64_gb  | 16_vcpus |
| 64_gb  | 32_vcpus |
| 128_gb | 32_vcpus |
| 128_gb | 64_vcpus |
| 192_gb | 48_vcpus |
| 256_gb | 64_vcpus |
| 384_gb | 96_vcpus |

Default: `no`

### `high_availability`

When set to `yes`, at least 3 nodes are provisioned in 3 different data centers to form a highly available (HA) cluster and your data is automatically replicated between all nodes.

By default, an HA cluster has 3 nodes. To provision more than 3 nodes (up to 7) in a single region, use [`high_availability_node_count`](#high-availability-node-count).

Default: `no`

### `search_delivery_network`

When not `off`, nodes are provisioned in different regions and the node that's closest to it's originating location serves the traffic.

Default: `off`

The table below lists all available options:

| `search_delivery_network` | Description                                                                                                                  |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------|
| off                       | Search Delivery Network is disabled.                                                                                          |
| 3_regions                 | One node is placed in each of 3 regions.                                                                                      |
| 5_regions                 | One node is placed in each of 5 regions.                                                                                      |
| multi_nodes_per_region    | Place multiple nodes across 2 to 7 regions, with a custom number of nodes in each region (3 to 7 nodes in total).            |

When using `multi_nodes_per_region`, specify the number of nodes for each region using [`region_node_counts`](#region-node-counts).

**IMPORTANT:** Make sure you set `high_availability` to `yes` when you turn on Search Delivery Network.

### `high_performance_disk`

When set to `yes`, the provisioned hard disk will be co-located on the same physical server that runs the node.

Default: `no`

**IMPORTANT:** This option is only available when:

- The cluster has High Availability turned on
- The cluster does not have a burst CPU type.

### `typesense_server_version`

The Typesense Server version to use for this cluster.

Default: Latest GA release version.

### `name`

A string to identify the cluster for your reference in the Typesense Cloud Web console.

Default: `null`

### `auto_upgrade_capacity`

When set to `true`, your cluster will be automatically upgraded when best-practice RAM/CPU thresholds are exceeded in a 12-hour rolling window.

Default: `false`

### Response Parameters

Most response parameters are similar to the request parameters above. 

We've documented response-specific parameters below:

### `regions` (response)

In the response, `regions` is a flat list with one entry per node. For example, a 3-node cluster in Oregon returns `["oregon", "oregon", "oregon"]`.

During a topology change, this list reflects the nodes that are currently live, which can differ from the target topology reported in [`region_node_counts`](#region-node-counts-response).

### `region_node_counts` (response)

An object that maps each region to the number of nodes configured for that region, for example `{ "oregon": 2, "frankfurt": 1 }`. This reflects the cluster's target topology.

### `high_availability_node_count` (response)

The number of nodes for a single-region highly available cluster. This is `null` when High Availability is off, or when Search Delivery Network is enabled. In those cases, refer to [`region_node_counts`](#region-node-counts-response) for the number of nodes per region.

### `status`

The state of the cluster. 

It can have the following values:

| `status`         | Description                                 |
|------------------|---------------------------------------------|
| `provisioning`   | The cluster's nodes are being provisioned   |
| `initializing`   | Typesense cluster is being setup            |
| `in_service`     | Cluster is ready for use                    |
| `deprovisioning` | Cluster is being deprovisioned              |
| `suspended`      | Cluster was suspended due to billing issues |
| `terminated`     | Cluster was terminated                      |

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
  "id": "nuj9s7k6vplrg15yp",
  "name": null,
  "memory": "0.5_gb",
  "vcpu": "2_vcpus_1_hr_burst_per_day",
  "gpu": "no",
  "high_performance_disk": "no",
  "typesense_server_version": "0.23.1",
  "high_availability": "yes",
  "high_availability_node_count": 3,
  "search_delivery_network": "off",
  "load_balancing": "yes",
  "regions": [
    "mumbai",
    "mumbai",
    "mumbai"
  ],
  "region_node_counts": {
    "mumbai": 3
  },
  "auto_upgrade_capacity": null,
  "hostnames": {
    "load_balanced": "nuj9s7k6vplrg15yp.a1.typesense.net",
    "nodes": [
      "nuj9s7k6vplrg15yp-1.a1.typesense.net",
      "nuj9s7k6vplrg15yp-2.a1.typesense.net",
      "nuj9s7k6vplrg15yp-3.a1.typesense.net"
    ]
  },
  "usage": {
    "runtime_hours": 1,
    "used_bandwidth_kb": {
      "last_7_days": {}
    }
  },
  "provisioned_by": {
    "user_name": "API Key: sc4DyvAzf*****",
    "user_type": "API Key"
  },
  "provisioned_at": 1663616196,
  "status": "in_service"
}
```

## List all clusters

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
      "gpu": "no",
      "high_performance_disk": "no",
      "typesense_server_version": "0.23.1",
      "high_availability": "no",
      "high_availability_node_count": null,
      "search_delivery_network": "off",
      "load_balancing": "no",
      "regions": [
        "oregon"
      ],
      "region_node_counts": {
        "oregon": 1
      },
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
      "status": "initializing"
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
  "success": true,
  "cluster": {
    "id": "az9p28gwxfdsye40d",
    "name": "New Name",
    "memory": "0.5_gb",
    "vcpu": "2_vcpus_1_hr_burst_per_day",
    "gpu": "no",
    "high_performance_disk": "no",
    "typesense_server_version": "0.23.1",
    "high_availability": "no",
    "high_availability_node_count": null,
    "search_delivery_network": "off",
    "load_balancing": "no",
    "regions": ["oregon"],
    "region_node_counts": {
      "oregon": 1
    },
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
