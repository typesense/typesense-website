# Invoices API

The Invoices API allows you to programmatically retrieve billing invoices for your Typesense Cloud account. 
You can list all invoices and fetch detailed information including line items for individual invoices.

## List all invoices

This endpoint returns a paginated list of invoices for your account, excluding each invoice's line items.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/invoices?page=1&per_page=10" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Query Parameters:**

| Parameter | Type    | Default | Description                                      |
|-----------|---------|---------|--------------------------------------------------|
| page      | integer | 1       | Page number for pagination                       |
| per_page  | integer | 10      | Number of invoices per page (maximum 50)         |

**Response:**

```json
{
  "page": 1,
  "per_page": 10,
  "total": 25,
  "invoices": [
    {
      "id": "inv_abc123def456",
      "number": 12345,
      "status": "paid",
      "amount_cents": 125000,
      "invoice_date": 1702857600,
      "period_starts_at": 1700179200,
      "period_ends_at": 1702857599,
      "line_items_path": "/api/v1/invoices/inv_abc123def456",
      "invoice_html_url": "https://cloud.typesense.org/invoices/inv_abc123def456",
      "account": {
        "owner_name": "Acme Corp",
        "owner_type": "Team",
        "billing_email": "billing@acme.com",
        "additional_billing_information": "123 Main St\nSan Francisco, CA 94102"
      },
      "payment": {
        "paid_via_card_cents": 100000,
        "paid_via_credits_cents": 25000,
        "credit_balance_snapshot_cents": 475000
      }
    },
    {
      "id": "inv_xyz789ghi012",
      "number": 12344,
      "status": "due",
      "amount_cents": 87500,
      "invoice_date": 1700179200,
      "period_starts_at": 1697500800,
      "period_ends_at": 1700179199,
      "line_items_path": "/api/v1/invoices/inv_xyz789ghi012",
      "invoice_html_url": "https://cloud.typesense.org/invoices/inv_xyz789ghi012",
      "account": {
        "owner_name": "Acme Corp",
        "owner_type": "Team",
        "billing_email": "billing@acme.com",
        "additional_billing_information": "123 Main St\nSan Francisco, CA 94102"
      },
      "payment": {
        "paid_via_card_cents": 0,
        "paid_via_credits_cents": 0,
        "credit_balance_snapshot_cents": 500000
      }
    }
  ]
}
```

## Get a single invoice

This endpoint retrieves detailed information about a specific invoice, including all line items.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/invoices/inv_abc123def456" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "inv_abc123def456",
  "number": 12345,
  "status": "paid",
  "amount_cents": 125000,
  "invoice_date": 1702857600,
  "period_starts_at": 1700179200,
  "period_ends_at": 1702857599,
  "line_items_path": "/api/v1/invoices/inv_abc123def456",
  "invoice_html_url": "https://cloud.typesense.org/invoices/inv_abc123def456",
  "account": {
    "owner_name": "Acme Corp",
    "owner_type": "Team",
    "billing_email": "billing@acme.com",
    "additional_billing_information": "123 Main St\nSan Francisco, CA 94102"
  },
  "payment": {
    "paid_via_card_cents": 100000,
    "paid_via_credits_cents": 25000,
    "credit_balance_snapshot_cents": 475000
  },
  "line_items": [
    {
      "description": "Node -- 0197kdlrfsubahw4p -- 4 GB RAM, 2 vCPUs, GPU:No, HiPerfDisk:No, HA:Yes, SDN:3 Regions, LoadBalanced:No, Oregon (per node hour)",
      "unit_price_cents": 2500,
      "quantity": 720,
      "price_cents": 1800000,
      "line_item_type": "node",
      "parameters": {
        "cluster_id": "0197kdlrfsubahw4p",
        "memory_option": "4gb",
        "vcpu_option": "2_vcpus",
        "gpu_option": "no",
        "high_performance_disk_option": "no",
        "high_availability_option": "yes",
        "search_delivery_network_option": "3_regions",
        "load_balancing_option": "no",
        "region": "oregon"
      }
    },
    {
      "description": "Bandwidth -- 0197kdlrfsubahw4p -- 4 GB RAM, 2 vCPUs, GPU:No, HiPerfDisk:No, HA:Yes, SDN:3 Regions, LoadBalanced:No, Oregon (per GB)",
      "unit_price_cents": 120,
      "quantity": 50000000,
      "price_cents": 6000000,
      "line_item_type": "bandwidth",
      "parameters": {
        "cluster_id": "0197kdlrfsubahw4p",
        "memory_option": "4gb",
        "vcpu_option": "2_vcpus",
        "gpu_option": "no",
        "high_performance_disk_option": "no",
        "high_availability_option": "yes",
        "search_delivery_network_option": "3_regions",
        "load_balancing_option": "no",
        "region": "oregon"
      }
    },
    {
      "description": "Typesense Cloud Support - Business Plan - 2025-01-01 00:00:00 UTC to 2025-01-31 23:59:59 UTC",
      "unit_price_cents": 50000,
      "quantity": 1,
      "price_cents": 50000,
      "line_item_type": "support",
      "parameters": {
        "plan_name": "Business",
        "starts_at": 1735689600,
        "ends_at": 1738367999
      }
    },
    {
      "description": "Prepaid Credit Purchase",
      "unit_price_cents": 10000,
      "quantity": 100,
      "price_cents": 1000000,
      "line_item_type": "prepaid_credit_purchase",
      "parameters": {}
    }
  ]
}
```

### Line Item Fields

| Field            | Type    | Description                                                                                                                                                                                                |
|------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| description      | string  | Human-readable description of the line item                                                                                                                                                                |
| unit_price_cents | integer | Unit price in cents                                                                                                                                                                                        |
| quantity         | number  | Quantity (can be fractional for some line items)<br><br>For bandwidth line items, the `quantity` GB transferred with rounding applied. For node line items, the `quantity` represents node-hours of usage. |
| price_cents      | integer | Total price for this line item in cents (`quantity * unit_price_cents`).                                                                                                                                   |
| line_item_type   | string  | Type of line item (see table [below](#line-item-types)).                                                                                                                                                   |
| parameters       | object  | Structured metadata specific to the line item type (see table [below](#line-item-types)).                                                                                                                  |


### Line Item Types

Each line item in an invoice has a `line_item_type` field that indicates what the charge is for. The following table describes each type:

| Line Item Type            | Description                       | Parameters Included                                                                                                                                                                         |
|---------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `node`                    | Cluster node usage charges        | `cluster_id`, `memory_option`, `vcpu_option`, `gpu_option`, `high_performance_disk_option`, `high_availability_option`, `search_delivery_network_option`, `load_balancing_option`, `region` |
| `bandwidth`               | Bandwidth usage charges           | `cluster_id`, `memory_option`, `vcpu_option`, `gpu_option`, `high_performance_disk_option`, `high_availability_option`, `search_delivery_network_option`, `load_balancing_option`, `region` |
| `support`                 | Support plan subscription charges | `plan_name`, `starts_at` (Unix timestamp), `ends_at` (Unix timestamp)                                                                                                                       |
| `prepaid_credit_purchase` | Prepaid credit purchases          | None                                                                                                                                                                                        |


## Important Notes

- The list endpoint returns invoice summaries without line items. Use the individual invoice endpoint to retrieve detailed line items.
- All monetary amounts are in cents (USD).
- All timestamps are Unix timestamps (seconds since epoch).
- Pagination is supported for the list endpoint with a maximum of 50 invoices per page.
