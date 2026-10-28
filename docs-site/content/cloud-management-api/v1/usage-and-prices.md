---
---

# Usage and Prices API

This is useful when you rebill clusters to your own customers, or when you want to track cluster costs in your own systems.


## List usage

This endpoint lists every node-hour and every amount of outbound bandwidth your account was billed for, one row per billed usage period.
Each row carries the period it covers, the cluster, the unit price charged, the price tier and the invoice it's on.

Here's how to list one cluster's usage from a given time onward:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/account/usage" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "start_time=1761004800" \
    --data-urlencode "cluster_ids=0197kdlrfsubahw4p"
```

**Query Parameters:**

| Parameter   | Type    | Default                    | Description                                                                                                                                                                         |
|-------------|---------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| start_time  | integer | 7 days before `end_time`   | Unix timestamp (seconds), inclusive. Only rows billed at or after this time. Not applied when `invoice_id` is set.                                                                      |
| end_time    | integer | 10 minutes ago             | Unix timestamp (seconds), exclusive. Only rows billed before this time. A later value is capped at 10 minutes ago. The window can span at most 31 days. Not applied when `invoice_id` is set. |
| cluster_ids | string  |                            | Comma-separated cluster IDs, at most 100. Only rows for these clusters. An ID that is not one of your account's clusters now returns `HTTP 404`. Rows of a cluster you have since transferred to another account stay listed: read them without this filter, or by `invoice_id`.                                         |
| invoice_id  | string  |                            | Only rows on this invoice, no matter when they were billed. Use the `id` returned by the [Invoices API](invoices.md) or a row's `invoice_id`. An ID that is not one of your account's invoices returns `HTTP 404`. |
| page        | integer | 1                          | Page number for pagination                                                                                                                                                          |
| per_page    | integer | 100                        | Number of rows per page (maximum 500)                                                                                                                                               |

**Response:**

```json
{
  "page": 1,
  "per_page": 100,
  "total": 2,
  "start_time": 1761004800,
  "end_time": 1761090600,
  "usage": [
    {
      "id": "7187ecb97e84ae30b027429c",
      "type": "node",
      "billed_at": 1761011400,
      "invoice_id": "inv_abc123def456",
      "invoice_status": "draft",
      "price_tier_id": "59e21f1e-ccf8-11f1-baf2-d6db8e0b3c14",
      "cluster_id": "0197kdlrfsubahw4p",
      "node_hostname": "0197kdlrfsubahw4p-1.a1.typesense.net",
      "region": "oregon",
      "period_starts_at": 1761001200,
      "period_ends_at": 1761008400,
      "node_hours": 2,
      "price_per_node_hour_cents": 12,
      "configuration": {
        "memory": "4_gb",
        "vcpu": "2_vcpus",
        "gpu": "no",
        "high_performance_disk": "no",
        "high_availability": "no",
        "search_delivery_network": "off",
        "load_balancing": "no"
      }
    },
    {
      "id": "9812a81108d3e00209dd4f17",
      "type": "bandwidth",
      "billed_at": 1761012000,
      "invoice_id": "inv_abc123def456",
      "invoice_status": "draft",
      "price_tier_id": "59e1cd5c-ccf8-11f1-baf2-d6db8e0b3c14",
      "cluster_id": "0197kdlrfsubahw4p",
      "region": "oregon",
      "period_starts_at": 1761001200,
      "period_ends_at": 1761008400,
      "bandwidth_kb": 183402,
      "price_per_gb_cents": 9
    }
  ]
}
```

Rows are ordered by `billed_at`, oldest first.
`start_time` and `end_time` in the response are the window that was actually applied, after the 10-minute cap.
Both are `null` when you pass `invoice_id`.

### Usage Row Fields

Every row has these fields:

| Field            | Type    | Description                                                                                                       |
|------------------|---------|-------------------------------------------------------------------------------------------------------------------|
| id               | string  | Stable row ID. Use it to de-duplicate rows you have already read.                                                 |
| type             | string  | `node` or `bandwidth` (see [below](#row-types)).                                                                  |
| billed_at        | integer | When the row was billed, as a Unix timestamp. `start_time` and `end_time` filter on this field.                  |
| invoice_id       | string  | The invoice this row is on, as returned by the [Invoices API](invoices.md).                                       |
| invoice_status   | string  | The invoice's status now: `draft`, `due`, `paid`, `uncollectible` or `voided`. Rows are listed whatever the status, because a status can change later, for example from `uncollectible` to `paid`. |
| price_tier_id    | string  | The price tier the invoice groups this row under. You want to treat it as an opaque ID. Invoice line items carry the same `price_tier_id`. |
| cluster_id       | string  | The cluster this usage belongs to.                                                                                |
| region           | string  | The region this usage was in, for example `oregon`.                                                              |
| period_starts_at | integer | Start of the period this row covers, as a Unix timestamp.                                                         |
| period_ends_at   | integer | End of the period this row covers, as a Unix timestamp.                                                           |

### Row Types

| Type        | Fields                                                                                                                                                                                                                                                                                                                                                                          |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `node`      | `node_hostname`: the node's hostname, or `null` when it is not known.<br><br>`node_hours`: whole node-hours. Each period is rounded up from the node's own start time, instead of from the clock hour.<br><br>`price_per_node_hour_cents`: the price charged per node-hour for this row, in cents, after any free allowance.<br><br>`configuration`: the node's configuration as it was priced, using the same names and values as the [cluster resource](cluster-management.md#parameters). |
| `bandwidth` | `bandwidth_kb`: outbound bandwidth from the cluster's nodes in this region during the period, in KB, including replication traffic between the cluster's nodes.<br><br>`price_per_gb_cents`: the price per GB for this row's price tier, in cents.                                                                                                                                 |

### How rows add up to invoice line items

The node and bandwidth line items on an invoice are built from these rows.
Each line item covers the rows on that invoice with the same `type`, `cluster_id` and `price_tier_id`, and carries that `price_tier_id` itself:

- For node line items, `quantity` is the sum of `node_hours` over those rows, and `price_cents` is that sum multiplied by `price_per_node_hour_cents`.
- For bandwidth line items, the invoice sums `bandwidth_kb` over those rows, then rounds the total up to whole GB once: `quantity` is `ceil(sum_of_bandwidth_kb / 1000000)`, and `price_cents` is `quantity * price_per_gb_cents`.

For example, three bandwidth rows of 183,402 KB, 2,450,100 KB and 96,000 KB with the same `cluster_id` and `price_tier_id` add up to 2,729,502 KB, which the invoice bills as 3 GB.
If you round each row up on its own, you'd get 5 GB instead.
So you want to always sum first, then round once per price tier, per cluster, per invoice.

You want to group by `invoice_id`, `type`, `cluster_id` and `price_tier_id`.
Two price tiers can have the same price, and the invoice keeps them on separate lines.
So grouping by price would merge rows the invoice doesn't.
Node and bandwidth tiers are numbered separately, so the same `price_tier_id` can show up on both a node row and a bandwidth row.

A usage period that crosses a price tier boundary, such as the end of a free allowance, shows up as one row per tier.
Both rows carry the same period, and their `node_hours` or `bandwidth_kb` add up to the usage for that period.

Bandwidth uses decimal units: 1 KB is 1,000 bytes and 1 GB is 1,000,000 KB.

### Reading new usage as it is billed

A row shows up once its usage is billed, 1 to 3 hours after the usage happens.
The `start_time` and `end_time` window filters on when a row was billed (`billed_at`), which is later than the usage period it covers.

The window only reaches rows billed more than 10 minutes ago, which is why `end_time` is capped.
Here's how to read every row exactly once:

1. Call the endpoint with a `start_time`. The response's `end_time` is the end of the window that was applied.
2. Fetch the remaining pages with the same `start_time` and that `end_time`, so every page reads the same window.
3. On your next poll, pass that `end_time` as the new `start_time`.

If `start_time` is less than 10 minutes in the past, the response is empty and its `end_time` equals `start_time`, so you can keep polling with the same value.

### Reconciling an invoice

Pass `invoice_id` to get every row on that invoice, regardless of when it was billed. You can combine it with `cluster_ids`.
Summing these rows as described [above](#how-rows-add-up-to-invoice-line-items) reproduces the invoice's node and bandwidth line items.
A draft invoice keeps gaining rows while it's still a draft.

### What this endpoint does not include

This endpoint only covers node-hours and bandwidth.
Support plans, prepaid credit purchases, credits and refunds are on your invoices, so you want to use the [Invoices API](invoices.md) for those.
Usage that hasn't been billed yet isn't included either.


Here's how to list the last 2 months:
## List prices

This endpoint lists what a node-hour and a GB of outbound bandwidth cost for each region and cluster configuration, priced the way a new cluster created today would be.
It always shows current prices and never lists past ones.

Here's how to list the prices in one region:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/prices" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "region=oregon"
```

**Query Parameters:**

All the filters are optional, and use the same names and values as the [Create new cluster](cluster-management.md#parameters) parameters and the [Get cluster options](cluster-management.md#get-cluster-options) endpoint.

| Parameter                | Type    | Default            | Description                                                                                       |
|--------------------------|---------|--------------------|---------------------------------------------------------------------------------------------------|
| region                   | string  |                    | Only this region, for example `oregon`                                                            |
| memory                   | string  |                    | Only this memory option, for example `4_gb`                                                       |
| vcpu                     | string  |                    | Only this vCPU option, for example `2_vcpus`                                                      |
| gpu                      | string  |                    | `yes` or `no`                                                                                     |
| high_performance_disk    | string  |                    | `yes` or `no`                                                                                     |
| high_availability        | string  |                    | Only this high availability option                                                                |
| search_delivery_network  | string  |                    | Only this Search Delivery Network option                                                          |
| load_balancing           | string  |                    | `yes` or `no`                                                                                     |
| page                     | integer | 1                  | Page number for pagination                                                                        |
| per_page                 | integer | 100                | Number of configurations per page (maximum 500)                                                   |

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
`total` is the number of configurations that match your filters.

### Price Tiers

Each configuration has a list of node-hour price tiers and a list of bandwidth price tiers.
A tier with `upto_node_hours` or `upto_gb` set to `null` has no upper bound.
All prices are in US cents.

Tier bounds count your account's lifetime usage of that configuration.
So a free allowance, like the first 720 node-hours in the example above, is used up once per account.
Creating another cluster doesn't start it over.

### How a cluster's cost follows from these prices

- Node-hour prices are per node. A cluster is billed for each of its nodes, so you want to multiply the node-hour price by the cluster's node count. A highly available cluster runs 3 to 7 nodes in its region (see [`high_availability_node_count`](cluster-management.md#high-availability-node-count)), and a cluster with Search Delivery Network turned on has a node count per region (see [`region_node_counts`](cluster-management.md#region-node-counts)). Each node is priced at its own region's price.
- Bandwidth is billed per cluster, per region, at that region's bandwidth price.
- Prices are for the latest Typesense Server release, which the response names as `typesense_server_version`.
- Existing clusters keep the price they were created with, even when the price list changes later. The rows from [List usage](#list-usage) carry the price that was actually charged. So for what an existing cluster costs, you want to use those rows instead of this list.

## Important notes

- All monetary amounts are in cents (USD).
- All timestamps are Unix timestamps (seconds since epoch).
- KB and GB are decimal units: 1 KB is 1,000 bytes and 1 GB is 1,000,000,000 bytes.
- A price filter value that matches no configuration returns an empty `prices` list.
