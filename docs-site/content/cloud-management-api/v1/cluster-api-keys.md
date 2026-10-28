---
description: "List, create and revoke a cluster's Typesense API keys through the Typesense Cloud Cluster Management API."
---

# Cluster API Keys API

Every Typesense Cloud cluster has its own set of <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html`">Typesense Server API keys</RouterLink>, which your applications use to talk to the cluster directly.

There are three ways to create these keys:

| You want to | Use |
|---|---|
| Get an admin key and a search-only key for a new cluster | [Generate API key](./cluster-management.md#generate-api-key) |
| Create a key limited to certain actions, collections or an expiry date, or list and revoke keys | [The endpoints on this page](#create-an-api-key-with-a-given-scope) |
| Create and manage keys from your own application | The cluster's own <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#create-an-api-key`">`/keys` endpoint</RouterLink> |

The first two are part of the Cloud Management API, so they work with your account's management API key.
That lets you manage the keys of any cluster in your account without holding each cluster's admin key, for example from a script that provisions clusters.
The cluster's `/keys` endpoint is part of the Typesense Server API, so you call it on the cluster's hostname with the cluster's admin key.

All three create the same kind of key on the cluster.
So you can list and revoke a key here, no matter how it was created.

The cluster has to be `in_service` for these endpoints.

## List all API keys

This endpoint lists every API key on the cluster, newest first.

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
| `id`           | The key's id on the cluster. Use it to [revoke the key](#revoke-an-api-key).                                          |
| `description`  | What the key is for                                                                                                  |
| `actions`      | The Typesense actions the key permits, for example `documents:search`. `*` permits every action.                     |
| `collections`  | The collection names or regular expressions the key covers. `*` covers every collection.                             |
| `expires_at`   | When the key stops working, as a Unix timestamp in seconds. A key that never expires reports a far-future value.     |
| `value_prefix` | The first characters of the key's value. The full value is never returned here.                                      |

To see when each key was last used, match `value_prefix` against the [API key last use](./cluster-logs.md#get-when-each-api-key-was-last-used) endpoint.

Keys Typesense Cloud creates for itself show up in the list too, for example the temporary key for a bulk import you start through the [MCP Server](../../guide/typesense-cloud/mcp-server.md#large-imports-and-exports).

## Create an API key with a given scope

:::warning
You want to keep admin keys on your servers. Give applications a key limited to the actions and collections they need. When different users need to see different parts of one collection, use a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">scoped search key</RouterLink> derived from a search-only key.
:::

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

### Request Parameters

| Parameter     | Required | Description                                                                                                                                                                                                                                       |
|---------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `actions`     | Required | Array of <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#create-an-api-key`">Typesense action names</RouterLink> the key permits, for example `["documents:search"]`. `["*"]` creates an admin key. |
| `collections` | Required | Array of collection names or regular expressions the key covers, for example `["products"]` or `["products_.*"]`. `["*"]` covers every collection. |
| `description` | Optional | What the key is for.                                                                                                                                                                 |
| `expires_at`  | Optional | Unix timestamp in seconds after which the key stops working. Omit it for a key that never expires.                                                                                                                             |

:::tip
Typesense doesn't check action names, so a misspelled action never matches anything.
:::

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


:::warning
Revoking a key can't be undone. So create the replacement key first, roll it out and then revoke the old one.
:::

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

## Error responses

- HTTP `400` when a parameter isn't valid.
- HTTP `400` when the cluster refuses the request, with the cluster's own message.
- HTTP `404` when the cluster id is not on your account, or on revoke, when no key with that id exists on the cluster.
- HTTP `422` when the cluster isn't in service.
- HTTP `503` when the cluster can't be reached right now.

## Permissions

To [list](#list-all-api-keys), [create](#create-an-api-key-with-a-given-scope) or [revoke](#revoke-an-api-key) keys, you need a key with the `cluster_credentials:manage` capability.
See [capabilities](./authentication.md#capabilities).
