---
description: "Get a Typesense Cloud account's spend by month, the upcoming invoice, the billing cycle and any prepaid credit balance through the Cluster Management API, and switch between weekly and monthly billing."
---

# Billing Summary API

The billing summary shows what your account has spent in each of the last 12 months, the invoice accruing in the current billing cycle and the billing cycle itself.

By default, charges accrue over each billing cycle and your card on file is charged at the end of it.
If you've bought [prepaid credit](https://cloud-help.typesense.org/article/billing-process), it's used first, and the summary also returns your credit balance with an estimate of how long it'll last.

All amounts are in US cents, and timestamps are Unix timestamps in seconds.

## Get billing summary

Here's how to fetch the billing summary:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/account/billing-summary" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "captured_at": 1791568800,
  "billing_cycle": {
    "cycle": "weekly",
    "days": 7,
    "monthly_eligible": true,
    "monthly_ineligibility_reason": null,
    "monthly_available_at": null
  },
  "credit_balance_cents": 412500,
  "credit_balance_zero_reached_at": null,
  "runway": {
    "state": "estimated",
    "sentence": "Your prepaid credit balance is estimated to last about 3–4 months at your recent spend.",
    "explanation": "Based on your spend over the last 13 weeks. Future charges may change this estimate.",
    "window_weeks": 13
  },
  "monthly_spend": [
    { "starts_at": 1761955200, "amount_cents": 98000, "card_cents": 98000, "credit_cents": 0, "current_month": false },
    { "starts_at": 1764547200, "amount_cents": 101200, "card_cents": 101200, "credit_cents": 0, "current_month": false },
    { "starts_at": 1767225600, "amount_cents": 101200, "card_cents": 101200, "credit_cents": 0, "current_month": false },
    { "starts_at": 1769904000, "amount_cents": 99400, "card_cents": 99400, "credit_cents": 0, "current_month": false },
    { "starts_at": 1772323200, "amount_cents": 104800, "card_cents": 0, "credit_cents": 104800, "current_month": false },
    { "starts_at": 1775001600, "amount_cents": 106300, "card_cents": 0, "credit_cents": 106300, "current_month": false },
    { "starts_at": 1777593600, "amount_cents": 109900, "card_cents": 0, "credit_cents": 109900, "current_month": false },
    { "starts_at": 1780272000, "amount_cents": 108100, "card_cents": 0, "credit_cents": 108100, "current_month": false },
    { "starts_at": 1782864000, "amount_cents": 110400, "card_cents": 0, "credit_cents": 110400, "current_month": false },
    { "starts_at": 1785542400, "amount_cents": 112600, "card_cents": 0, "credit_cents": 112600, "current_month": false },
    { "starts_at": 1788220800, "amount_cents": 111000, "card_cents": 0, "credit_cents": 111000, "current_month": false },
    { "starts_at": 1790812800, "amount_cents": 0, "card_cents": 0, "credit_cents": 0, "current_month": true }
  ],
  "upcoming_invoice": {
    "id": "inv_def456ghi789",
    "number": 12346,
    "status": "draft",
    "amount_cents": 31200,
    "invoice_date": 1793491199,
    "period_starts_at": 1790812800,
    "period_ends_at": 1793491199,
    "line_items_path": "/api/v1/invoices/inv_def456ghi789",
    "invoice_html_url": "https://cloud.typesense.org/invoices/inv_def456ghi789",
    "account": {
      "owner_name": "Acme Corp",
      "owner_type": "Team",
      "billing_email": "billing@acme.com",
      "additional_billing_information": "123 Main St\nSan Francisco, CA 94102"
    },
    "payment": {
      "paid_via_card_cents": 0,
      "paid_via_credits_cents": 0,
      "credit_balance_snapshot_cents": 0
    }
  }
}
```

### Response Parameters

#### Billing cycle

- `cycle` is `weekly` (every 7 days) or `monthly` (every 28 days). It's `null` when the Typesense Cloud team has set a different length for the account.
- `days` is the length of a billing cycle. We issue an invoice at the end of each cycle, or sooner once the invoice's amount reaches the account's limit.
- `monthly_eligible` is `true` when the account can switch to monthly billing now. Monthly billing is available to active accounts that had a successful payment at least 2 months ago, no failed payment in the last 2 months and no unpaid invoices with failed payments.
- `monthly_ineligibility_reason` names why monthly billing isn't available: `payment_history_too_short`, `failed_payment_in_window`, `unpaid_invoices`, `account_not_active` or `custom_cycle`. `custom_cycle` means the Typesense Cloud team set the cycle by hand, so you want to ask them to change it.
- `monthly_available_at` is when monthly billing becomes available if no further payment fails, as a Unix timestamp in seconds. It's set for `payment_history_too_short` and `failed_payment_in_window`, and `null` otherwise, including before the account's first successful payment.

#### Monthly spend

`monthly_spend` always holds 12 months, oldest first.
Each month counts the money charged in it:

- `card_cents`: successful card charges, less refunds. Purchases of prepaid credit aren't included here. They count in the month the credit is spent.
- `credit_cents`: prepaid credit used.
- `amount_cents`: `card_cents` + `credit_cents`.

The last month has `current_month` set to `true` and covers the current month so far.

#### Upcoming invoice

`upcoming_invoice` is the draft invoice accruing now, in the same shape as an invoice from [List all invoices](./invoices.md#list-all-invoices), or `null` when nothing is accruing.
To get its line items, [fetch the invoice](./invoices.md#get-a-single-invoice) by its `id`.

#### Credit balance

- `credit_balance_cents` is the current prepaid credit balance, or `0` when the account has no prepaid credit.
- `credit_balance_zero_reached_at` is when the balance last reached zero, if it is zero now.

#### Runway

`runway` estimates how long the prepaid credit balance will last at your recent spend. It's `null` when the balance is zero.

| `state`                | Meaning                                                                                              |
|------------------------|------------------------------------------------------------------------------------------------------|
| `estimated`            | `sentence` holds the estimate. `explanation` and `window_weeks` name the spend window it is based on. |
| `no_recent_spend`      | Nothing was charged in the last 8 weeks.                     |
| `insufficient_history` | The account needs a few weeks of billing history before an estimate is possible.                     |

## Switch billing cycle

You can always switch to `weekly`, and you can switch to `monthly` once the account is eligible (see [`monthly_eligible`](#billing-cycle)).
The change applies to the current invoice, counted from the day it opened, and to every invoice after it.

### Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `cycle`   | Required | `weekly` or `monthly`. |

Here's how to switch to monthly billing:

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/account/billing-cycle" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{"cycle": "monthly"}'
```

**Response:**

```json
{
  "billing_cycle": {
    "cycle": "monthly",
    "days": 28,
    "monthly_eligible": true,
    "monthly_ineligibility_reason": null,
    "monthly_available_at": null
  }
}
```

When the switch is refused, the response has `success` set to `false` and a `message` saying why:

```json
{
  "success": false,
  "message": "Monthly billing is available after 2 months of successful payments."
}
```

## Permissions

To [get the billing summary](#get-billing-summary), you need a key with the `billing:read` capability.
To [switch the billing cycle](#switch-billing-cycle), you need `billing:manage`.
See [capabilities](./authentication.md#capabilities).
