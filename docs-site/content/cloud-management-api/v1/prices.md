---
description: "The Typesense Cloud Prices API lists the node-hour and bandwidth prices for every region and cluster configuration."
---

# Prices API

The Prices API lists what a node-hour and a GB of outbound bandwidth cost for each region and cluster configuration, priced the way a new cluster created today would be.
For what your existing clusters cost, see [Cluster Usage & Costs](cluster-usage-and-costs.md).

All amounts are in US cents.

## List prices

Here's how to list the prices in one region:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/prices" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "region=oregon"
```

**Query Parameters:**

The filters use the same names and values as the [Create new cluster](cluster-management.md#request-parameters) parameters and the [Get cluster options](cluster-management.md#get-cluster-options) endpoint.

| Parameter               | Required | Type    | Default | Description |
|-------------------------|----------|---------|---------|-------------|
| region | Optional | string |  | Only this region, for example `oregon` |
| memory | Optional | string |  | Only this memory option, for example `4_gb` |
| vcpu | Optional | string |  | Only this vCPU option, for example `2_vcpus` |
| gpu | Optional | string |  | `yes` or `no` |
| high_performance_disk | Optional | string |  | `yes` or `no` |
| high_availability | Optional | string |  | Only this high availability option |
| search_delivery_network | Optional | string |  | Only this Search Delivery Network option |
| load_balancing | Optional | string |  | `yes` or `no` |
| page | Optional | integer | 1 | Page number for pagination |
| per_page | Optional | integer | 100 | Number of configurations per page (maximum 500) |

**Response:**

```json
{
  "page": 1,
  "per_page": 100,
  "total": 812,
  "typesense_server_version": "30.2",
  "currency": "usd",
  "prices": [
    {
      "region": "oregon",
      "memory": "0.5_gb",
      "vcpu": "2_vcpus_1_hr_burst_per_day",
      "gpu": "no",
      "high_performance_disk": "no",
      "high_availability": "no",
      "search_delivery_network": "off",
      "load_balancing": "no",
      "node_hour_price_tiers": [
        {"from_node_hours": 0, "upto_node_hours": 720, "price_per_node_hour_cents": 0},
        {"from_node_hours": 720, "upto_node_hours": null, "price_per_node_hour_cents": 2}
      ],
      "bandwidth_price_tiers": [
        {"from_gb": 0, "upto_gb": 10, "price_per_gb_cents": 0},
        {"from_gb": 10, "upto_gb": null, "price_per_gb_cents": 9}
      ]
    },
    {
      "region": "oregon",
      "memory": "4_gb",
      "vcpu": "2_vcpus",
      "gpu": "no",
      "high_performance_disk": "no",
      "high_availability": "no",
      "search_delivery_network": "off",
      "load_balancing": "no",
      "node_hour_price_tiers": [
        {"from_node_hours": 0, "upto_node_hours": null, "price_per_node_hour_cents": 12}
      ],
      "bandwidth_price_tiers": [
        {"from_gb": 0, "upto_gb": null, "price_per_gb_cents": 9}
      ]
    }
  ]
}
```

The response above is shortened, and the prices in it are only for illustration.
Entries are ordered by region, then by configuration.

### Price Tiers

A tier with `upto_node_hours` or `upto_gb` set to `null` has no upper bound.

Tier bounds count your account's lifetime usage of that configuration.
So a free allowance, like the first 720 node-hours in the example above, is used up once per account.

### How a cluster's cost follows from these prices

- Node-hour prices are per node, so you want to multiply the node-hour price by the cluster's node count. A highly available cluster runs 3 to 7 nodes in its region (see [`high_availability_node_count`](cluster-management.md#high-availability-node-count)), and a cluster with Search Delivery Network turned on has a node count per region (see [`region_node_counts`](cluster-management.md#region-node-counts)). Each node is priced at its own region's price.
- Bandwidth is billed per cluster, per region, at that region's bandwidth price.
- Prices are for the latest Typesense Server release, which the response names as `typesense_server_version`.
- Existing clusters keep the price they were created with, even when the price list changes later. So for what an existing cluster costs, you want to use the rows from [List usage](cluster-usage-and-costs.md#list-usage), which carry the price that was actually charged.

## Permissions

To [list prices](#list-prices), you need a key with the `billing:read` capability.
See [capabilities](./authentication.md#capabilities).
