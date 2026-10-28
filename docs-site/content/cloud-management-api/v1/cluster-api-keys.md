---
description: "List, create and revoke a cluster's Typesense API keys through the Typesense Cloud Cluster Management API."
---

# Cluster API Keys API

Every Typesense Cloud cluster has its own set of <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html`">Typesense Server API keys</RouterLink>, which your applications use to talk to the cluster directly.
With this API you can list those keys, create a key with just the scope you need and revoke keys you no longer need.
These are the same keys you see on the API Keys page in the Typesense Cloud dashboard.

The standard admin and search-only key pair comes from the [Generate API key](./cluster-management.md#generate-api-key) endpoint.
Keys issued that way show up in the list below too, and you can revoke them like any other key.

You'll need the `cluster_credentials:manage` capability to list, create or revoke keys.
The cluster also has to be `in_service`.
See [Error Responses](#error-responses) for what you get back for other statuses.

## List all API keys

This endpoint lists every API key on the cluster, newest first.
You only ever see a key's full value when the key is created.
So the list carries the first few characters of each value as `value_prefix`, to help you tell keys apart.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/api-keys" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
[
  {
    "id": 3,
    "description": "Storefront search",
    "actions": ["documents:search"],
    "collections": ["products"],
    "expires_at": 1792108800,
    "value_prefix": "y7CF"
  },
  {
    "id": 2,
    "description": "Search-only key",
    "actions": ["documents:search"],
    "collections": ["*"],
    "expires_at": 64723363199,
    "value_prefix": "kQ2n"
  },
  {
    "id": 1,
    "description": "Admin key",
    "actions": ["*"],
    "collections": ["*"],
    "expires_at": 64723363199,
    "value_prefix": "cBKq"
  }
]
```

| Field          | Description                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------|
| `id`           | The key's id on the cluster. Use it to revoke the key.                                                                |
| `description`  | What the key is for, as shown on the dashboard's API Keys page                                                       |
| `actions`      | The Typesense actions the key permits, for example `documents:search`. `*` permits every action.                     |
| `collections`  | The collection names or regular expressions the key covers. `*` covers every collection.                             |
| `expires_at`   | When the key stops working, as a Unix timestamp in seconds. A key that never expires reports a far-future value.     |
| `value_prefix` | The first characters of the key's value. The full value is never returned here.                                      |

Keys Typesense Cloud creates for itself show up in the list too, for example the temporary key for a bulk import you start through the [MCP Server](../../guide/typesense-cloud/mcp-server.md#large-imports-and-exports).
You can revoke those like any other key.

## Create an API key with a given scope

This endpoint creates one API key with exactly the actions and collections you give it, and an optional expiry.
It's the equivalent of the "Create key" form on the dashboard's API Keys page.

If you want the standard admin and search-only pair, use [Generate API key](./cluster-management.md#generate-api-key) instead.

Here's how to create a search key for one collection that expires on a given date:

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/api-keys/custom" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "description": "Storefront search",
          "actions": ["documents:search"],
          "collections": ["products"],
          "expires_at": 1792108800
        }'
```

| Parameter     | Required | Description                                                                                                                                                                                                                                       |
|---------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `actions`     | Yes      | Array of <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#create-an-api-key`">Typesense action names</RouterLink> the key permits, for example `["documents:search"]`. `["*"]` creates an admin key. At least one entry, at most 100. |
| `collections` | Yes      | Array of collection names or regular expressions the key covers, for example `["products"]` or `["products_.*"]`. `["*"]` covers every collection. At least one entry, at most 100.                                                                    |
| `description` | No       | What the key is for. Shown on the dashboard's API Keys page. At most 255 characters.                                                                                                                                                                 |
| `expires_at`  | No       | Unix timestamp in seconds after which the key stops working. Must be in the future. Omit it for a key that never expires.                                                                                                                             |

**Response:**

You'll get an HTTP `201` with the new key, including its value:

```json
{
  "id": 3,
  "description": "Storefront search",
  "actions": ["documents:search"],
  "collections": ["products"],
  "expires_at": 1792108800,
  "value_prefix": "y7CF",
  "value": "y7CFw2zEgu09FFhoDgLzC99j0RwKi0kL"
}
```

:::warning IMPORTANT
This is the only time you'll see the key's `value`, so store it right away.
If you lose it, you want to revoke the key and create a new one.
:::

## Revoke an API key

This endpoint deletes a key from the cluster.
Any request made with that key fails from then on.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/api-keys/<KeyId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

`<KeyId>` is the key's `id` from [List all API keys](#list-all-api-keys).

**Response:**

```json
{
  "success": true
}
```

If no key with that id exists on the cluster, you'll get an HTTP `404`.

## Error responses

When an error occurs, the API returns an error response with details about what went wrong.

- HTTP `400` when the request is malformed: `actions` or `collections` is not a non-empty array of strings or has more than 100 entries, `description` is longer than 255 characters or `expires_at` is not a Unix timestamp in seconds or is in the past.
- HTTP `400` when the cluster refuses the request, with the cluster's own message. Typesense stores action names as given and doesn't check them. So a misspelled action never matches anything, and the key can't do what you meant.
- HTTP `404` when the cluster id is not on your account, or on revoke, when no key with that id exists on the cluster.
- HTTP `422` when the cluster isn't in service. The message names the cluster's current status, so you can tell whether waiting will help. A `provisioning` cluster will get there, a terminated one won't.
- HTTP `503` when the cluster can't be reached right now. Retry after a moment.

### Validation Error Example

```json
{
  "success": false,
  "message": "actions must be a non-empty array of strings"
}
```

### Cluster Not In Service Example

```json
{
  "success": false,
  "message": "Cluster is not In Service (status: provisioning)"
}
```

### Cluster Unreachable Example

```json
{
  "success": false,
  "message": "Node is temporarily unavailable, please try again later"
}
```

## Important notes

- You want to keep admin keys on your servers. Give applications a key limited to the actions and collections they need. When different users need to see different parts of one collection, use a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">scoped search key</RouterLink> derived from a search-only key.
- Timestamps in this API are Unix timestamps in seconds. A 13-digit value is in milliseconds, so it's rejected.
- Revoking a key takes effect immediately and can't be undone. So create the replacement key first, roll it out and then revoke the old one.
