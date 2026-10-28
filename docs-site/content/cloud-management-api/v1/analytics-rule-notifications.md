---
description: "Schedule email notifications for a cluster's analytics rules, such as popular queries and no-hits queries, through the Typesense Cloud Cluster Management API."
---

# Analytics Rule Notifications API

Once you've created <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/analytics-query-suggestions.html`">analytics rules</RouterLink> on a cluster, you can have Typesense Cloud email a rule's results, such as popular queries or no-hits queries, to a list of recipients on a schedule.

The notification schedule is a Typesense Cloud setting that's attached to a rule by its name.
You manage the rule itself through your cluster's Typesense Server API.

## List all notification schedules

This endpoint returns every analytics rule on a cluster that has notifications scheduled.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/analytics-rule-notifications" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
[
  {
    "analytics_rule_name": "popular_queries",
    "recipients": ["search-team@example.com"],
    "frequency_days": 7,
    "next_send_at": 1760572800,
    "created_at": 1759968000,
    "updated_at": 1759968000
  },
  {
    "analytics_rule_name": "no_hits_queries",
    "recipients": ["search-team@example.com", "content@example.com"],
    "frequency_days": 1,
    "next_send_at": 1760054400,
    "created_at": 1759968000,
    "updated_at": 1759968000
  }
]
```

| Field                 | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| `analytics_rule_name` | Name of the analytics rule on the cluster                        |
| `recipients`          | Email addresses that receive the notifications                          |
| `frequency_days`      | Days between two notifications: `1`, `3`, `7` or `28`                  |
| `next_send_at`        | When the next notification is sent, as a Unix timestamp in seconds     |
| `created_at`          | When notifications were first scheduled, as a Unix timestamp in seconds    |
| `updated_at`          | When the schedule was last changed, as a Unix timestamp in seconds |

## Get a single notification schedule

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/analytics-rule-notifications/<AnalyticsRuleName>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "analytics_rule_name": "popular_queries",
  "recipients": ["search-team@example.com"],
  "frequency_days": 7,
  "next_send_at": 1760572800,
  "created_at": 1759968000,
  "updated_at": 1759968000
}
```

## Schedule or replace notifications

If the rule already has a schedule, the request replaces it entirely.
So you want to send the full list of recipients every time.

```shell
curl -X PUT --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/analytics-rule-notifications/<AnalyticsRuleName>" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "recipients": ["search-team@example.com", "content@example.com"],
          "frequency_days": 7,
          "starts_at": 1760572800
        }'
```

| Parameter        | Required | Description                                                                                                                                                                                                                                                                             |
|------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `recipients`     | Required | Array of email addresses that receive the notifications.                                                                                                                                                                                                                 |
| `frequency_days` | Required | Days between two notifications. One of `1` (daily), `3`, `7` (weekly) or `28` (monthly).                                                                                                                                                                                                      |
| `starts_at`      | Optional | Unix timestamp in seconds of the first notification. When omitted, an existing schedule keeps its next send time and a new schedule starts in one hour. |

**Response:**

You'll get an HTTP `201` when notifications are scheduled for the first time and an HTTP `200` when an existing schedule is replaced.

```json
{
  "analytics_rule_name": "popular_queries",
  "recipients": ["search-team@example.com", "content@example.com"],
  "frequency_days": 7,
  "next_send_at": 1760572800,
  "created_at": 1759968000,
  "updated_at": 1760054400
}
```

## Delete a notification schedule

This endpoint stops the notifications for a rule. The rule itself stays as is.

:::warning
Deleting the rule through the Typesense Server API doesn't delete its notification schedule.
So you want to delete the schedule too.
:::

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/analytics-rule-notifications/<AnalyticsRuleName>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "success": true
}
```

## Error responses

- HTTP `400` or `422` when a parameter isn't valid.
- HTTP `404` when the cluster doesn't exist on your account, or the rule has no notifications scheduled.

## Permissions

To [list](#list-all-notification-schedules), [get](#get-a-single-notification-schedule), [schedule or replace](#schedule-or-replace-notifications) or [delete](#delete-a-notification-schedule) notification schedules, you need a key with the `cluster_parameters:manage` capability.
Scheduling or replacing them also needs `search_insights:read`, because the emails carry the rule's search queries.
See [capabilities](./authentication.md#capabilities).
