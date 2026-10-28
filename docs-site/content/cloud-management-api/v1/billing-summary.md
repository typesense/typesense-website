---
---

# Billing Summary API

The billing summary tells you how much prepaid credit is left and what you're spending, in one call.
It returns the same numbers as the billing insights on the Account page of the Typesense Cloud dashboard: the prepaid credit balance with an estimate of how long it'll last, spend in each of the last 12 months, the invoice accruing now and the billing cycle.


## Get the billing summary

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

Timestamps in this API are Unix timestamps in seconds.

### Credit balance

- `credit_balance_cents` is the current prepaid credit balance, or `0` when the account has no prepaid credit.
- `credit_balance_zero_reached_at` is when the balance last reached zero, if it is zero now.

### Runway

`runway` estimates how long the prepaid credit balance will last at your recent spend. It's `null` when the balance is zero.

| `state`                | Meaning                                                                                              |
|------------------------|------------------------------------------------------------------------------------------------------|
| `estimated`            | `sentence` holds the estimate. `explanation` and `window_weeks` name the spend window it is based on. |
| `no_recent_spend`      | Nothing was charged in the last 8 weeks, so the balance isn't being drawn down.                     |
| `insufficient_history` | The account needs a few weeks of billing history before an estimate is possible.                     |

`sentence` is the estimate in plain words, as the dashboard shows it.

### Monthly spend

`monthly_spend` always holds 12 months, oldest first.
Each month counts the money charged in it:

- `card_cents`: successful card charges, less refunds. Purchases of prepaid credit aren't included here. They count in the month the credit is spent.
- `credit_cents`: prepaid credit used.
- `amount_cents`: the two added together.

The last month has `current_month` set to `true` and covers the current month so far.

### Upcoming invoice

`upcoming_invoice` is the draft invoice accruing now, in the same shape as the [Invoices API](./invoices.md) list, or `null` when nothing is accruing.
To get its line items, fetch the invoice by its `id`.
