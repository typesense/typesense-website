---
description: "Typesense Cloud Cluster Usage and Costs API endpoints list the node-hours and bandwidth behind each invoice, row by row, and what each cluster cost per month."
---

# Cluster Usage & Costs API

This API lists the node-hours and outbound bandwidth your account was invoiced for, and what each cluster cost per month.
For what a new cluster would cost, see the [Prices API](prices.md).

All amounts are in US cents, and timestamps are Unix timestamps in seconds.

## List usage

This endpoint lists every node-hour and every amount of outbound bandwidth your account was billed for, one row per billed usage period.

Here's how to list one cluster's usage from a given time onward:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/account/usage" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "start_time=1761004800" \
    --data-urlencode "cluster_ids=0197kdlrfsubahw4p"
```

**Query Parameters:**

| Parameter   | Required | Type    | Default                  | Description |
|-------------|----------|---------|--------------------------|-------------|
| start_time  | Optional | integer | 7 days before `end_time` | Unix timestamp (seconds), inclusive. Only rows billed at or after this time. Not applied when `invoice_id` is set. |
| end_time    | Optional | integer | 10 minutes ago           | Unix timestamp (seconds), exclusive. Only rows billed before this time. A later value is capped at 10 minutes ago. The window can span at most 31 days. Not applied when `invoice_id` is set. |
| cluster_ids | Optional | string  |                          | Comma-separated cluster IDs, at most 100. Only rows for these clusters. Rows of a cluster you have since transferred to another account stay listed: read them without this filter, or by `invoice_id`. |
| invoice_id  | Optional | string  |                          | Only rows on this invoice, no matter when they were billed. Use the `id` returned by [List all invoices](invoices.md#list-all-invoices) or a row's `invoice_id`. |
| page        | Optional | integer | 1                        | Page number for pagination |
| per_page    | Optional | integer | 100                      | Number of rows per page (maximum 500) |

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
| invoice_status   | string  | The invoice's status now: `draft`, `due`, `paid`, `uncollectible` or `voided`. Rows are listed in every status, since a status can change later, for example from `uncollectible` to `paid`. |
| price_tier_id    | string  | The price tier the invoice groups this row under. You want to treat it as an opaque ID. [Invoice line items](invoices.md#line-item-fields) carry the same `price_tier_id`. |
| cluster_id       | string  | The cluster this usage belongs to.                                                                                |
| region           | string  | The region this usage was in, for example `oregon`.                                                              |
| period_starts_at | integer | Start of the period this row covers, as a Unix timestamp.                                                         |
| period_ends_at   | integer | End of the period this row covers, as a Unix timestamp.                                                           |

### Row Types

| Type        | Fields                                                                                                                                                                                                                                                                                                                                                                          |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `node`      | `node_hostname`: the node's hostname, or `null` when it is not known.<br><br>`node_hours`: whole node-hours. Each period is rounded up from the node's own start time, instead of from the clock hour.<br><br>`price_per_node_hour_cents`: the price charged per node-hour for this row, in cents, after any free allowance.<br><br>`configuration`: the node's configuration as it was priced, using the same names and values as the [cluster resource](cluster-management.md#request-parameters). |
| `bandwidth` | `bandwidth_kb`: outbound bandwidth from the cluster's nodes in this region during the period, in KB, including replication traffic between the cluster's nodes.<br><br>`price_per_gb_cents`: the price per GB for this row's price tier, in cents.                                                                                                                                 |

### How rows add up to invoice line items

Each node and bandwidth line item on an invoice covers the rows on that invoice with the same `type`, `cluster_id` and `price_tier_id`, and carries that `price_tier_id` itself:

- For node line items, `quantity` is the sum of `node_hours` over those rows, and `price_cents` is that sum multiplied by `price_per_node_hour_cents`.
- For bandwidth line items, the invoice sums `bandwidth_kb` over those rows, then rounds the total up to whole GB once: `quantity` is `ceil(sum_of_bandwidth_kb / 1000000)`, and `price_cents` is `quantity * price_per_gb_cents`.

For example, three bandwidth rows of 183,402 KB, 2,450,100 KB and 96,000 KB with the same `cluster_id` and `price_tier_id` add up to 2,729,502 KB, which the invoice bills as 3 GB.
If you round each row up on its own, you'd get 5 GB instead.

Two price tiers can have the same price, and the invoice keeps them on separate lines.
So grouping by price would merge rows the invoice doesn't.
Node and bandwidth tiers are numbered separately, so the same `price_tier_id` can show up on both a node row and a bandwidth row.

A usage period that crosses a price tier boundary, such as the end of a free allowance, shows up as one row per tier.
Both rows carry the same period, and their `node_hours` or `bandwidth_kb` add up to the usage for that period.

Bandwidth uses decimal units: 1 KB is 1,000 bytes and 1 GB is 1,000,000 KB.

### Reading new usage as it is billed

A row shows up once its usage is billed, 1 to 3 hours after the usage happens.

Here's how to read every row exactly once:

1. Call the endpoint with a `start_time`. The response's `end_time` is the end of the window that was applied.
2. Fetch the remaining pages with the same `start_time` and that `end_time`, so every page reads the same window.
3. On your next poll, pass that `end_time` as the new `start_time`.

If `start_time` is less than 10 minutes in the past, the response is empty and its `end_time` equals `start_time`, so you can keep polling with the same value.

### Reconciling an invoice

Summing the rows of one `invoice_id` as described [above](#how-rows-add-up-to-invoice-line-items) reproduces the invoice's node and bandwidth line items.
A draft invoice keeps gaining rows while it's still a draft.

### What this endpoint does not include

Support plans, prepaid credit purchases, credits and refunds are on your invoices, so you want to use the [Invoices API](invoices.md) for those.

## List costs by cluster

This endpoint lists what each cluster cost you per calendar month, for the current month so far and the months before it.

Here's how to list the last 2 months:

```shell
curl --get --location "https://cloud.typesense.org/api/v1/account/cluster-costs" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    --data-urlencode "months=2"
```

**Query Parameters:**

| Parameter | Required | Type    | Default | Description |
|-----------|----------|---------|---------|-------------|
| months    | Optional | integer | 4       | How many months to list, ending with the current month. From 1 to 12. |

**Response:**

```json
{
  "currency": "usd",
  "months": [
    {
      "month": "2026-09",
      "starts_at": 1788220800,
      "ends_at": 1790812800,
      "complete": true,
      "total_cents": 48210,
      "other_charges_cents": 4900,
      "clusters": [
        {
          "cluster_id": "0197kdlrfsubahw4p",
          "name": "products-prod",
          "compute_cents": 36000,
          "bandwidth_cents": 1250,
          "backup_storage_cents": 860,
          "total_cents": 38110
        },
        {
          "cluster_id": "x8n2kq0wd1mfz7b3c",
          "name": null,
          "compute_cents": 5200,
          "bandwidth_cents": 0,
          "backup_storage_cents": 0,
          "total_cents": 5200
        }
      ]
    },
    {
      "month": "2026-10",
      "starts_at": 1790812800,
      "ends_at": 1793491200,
      "complete": false,
      "total_cents": 21400,
      "other_charges_cents": 0,
      "clusters": [
        {
          "cluster_id": "0197kdlrfsubahw4p",
          "name": "products-prod",
          "compute_cents": 20500,
          "bandwidth_cents": 900,
          "backup_storage_cents": 0,
          "total_cents": 21400
        }
      ]
    }
  ]
}
```

Months are listed oldest first, and the clusters in each month are listed highest `total_cents` first.

### How charges are split across clusters

A month holds what was actually charged in it: card payments and prepaid credit spent, by charge date in UTC.
Each charge is split across the clusters on the invoice it paid, in proportion to that invoice's line items.
So the clusters' `total_cents` plus `other_charges_cents` add up to the month's `total_cents`, to the cent.

### Month Fields

| Field                 | Description                                                                                              |
|-----------------------|----------------------------------------------------------------------------------------------------------|
| `month`               | The calendar month, as `YYYY-MM` in UTC.                                                                 |
| `starts_at`           | Unix timestamp in seconds when the month starts.                                                         |
| `ends_at`             | Unix timestamp in seconds when the next month starts.                                                    |
| `complete`            | `false` for the current month, which can still take charges.                                             |
| `total_cents`         | Everything charged in the month.                                                                         |
| `other_charges_cents` | Charges that aren't for a cluster, like support plans.                                                   |
| `clusters`            | One entry per cluster that was charged in the month.                                                     |

### Cluster Fields

| Field                  | Description                                                                                             |
|------------------------|---------------------------------------------------------------------------------------------------------|
| `cluster_id`           | The cluster ID.                                                                                         |
| `name`                 | The cluster's current name. `null` when it has no name, or has since been transferred to another account. |
| `compute_cents`        | The cluster's share of the month's charges for node-hours.                                              |
| `bandwidth_cents`      | The cluster's share for outbound bandwidth.                                                             |
| `backup_storage_cents` | The cluster's share for [backup](cluster-backups.md#billing) storage.                                    |
| `total_cents`          | `compute_cents` + `bandwidth_cents` + `backup_storage_cents`.                                           |

### When costs are being prepared

For an account with a long billing history, the first read can take a minute or two to prepare.
While that runs, this endpoint returns `HTTP 503` with a `Retry-After` header in seconds:

```json
{
  "success": false,
  "message": "Cluster costs for this account are being prepared. Retry in a minute."
}
```

## Permissions

To [list usage](#list-usage) or [list costs by cluster](#list-costs-by-cluster), you need a key with the `billing:read` capability.
See [capabilities](./authentication.md#capabilities). 
