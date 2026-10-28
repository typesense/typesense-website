---
description: "Restrict which IP addresses can reach a Typesense Cloud cluster, through the Cluster Management API."
---

# IP Allowlist API

A cluster's IP allowlist limits which IPv4 addresses and CIDR ranges can reach the cluster's hostnames, for example your application servers or your CDN's egress ranges.
Requests from any other address are refused at the network level, before they reach Typesense.
The allowlist doesn't apply to the Typesense Cloud dashboard, so you can always change the list from there.

## Get allowlist

Here's how to read a cluster's allowlist:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/ip-allowlist" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "enabled": true,
  "change_in_progress": false,
  "last_change_failed": false,
  "entries": [
    {
      "cidr": "203.0.113.7/32",
      "description": "Office",
      "created_at": 1760054400
    },
    {
      "cidr": "198.51.100.0/24",
      "description": "Production servers",
      "created_at": 1760054400
    }
  ]
}
```

| Field                | Description                                                                                                                     |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `enabled`            | The saved state: `true` when at least one entry is listed, `false` when the list is empty and every address can reach the cluster. |
| `change_in_progress` | `true` while the last change is still being applied to the cluster. This takes about a minute.                                 |
| `last_change_failed` | `true` when the last change couldn't be applied, so the saved list may not be in effect. Sending the list again retries it. |
| `entries`            | The listed addresses. `cidr` is normalized (a single address ends in `/32`). `created_at` is a Unix timestamp in seconds.     |

## Replace allowlist

This endpoint replaces the whole list, so send every address you want to allow, every time.

Here's how to set the list to two entries:

```shell
curl -X PUT --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/ip-allowlist" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "entries": [
            { "cidr": "203.0.113.7", "description": "Office" },
            { "cidr": "198.51.100.0/24", "description": "Production servers" }
          ]
        }'
```

### Request Parameters

| Parameter               | Required | Description                                                                                                                                                                |
|-------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `entries`               | Required | Array of up to 25 entries. An empty array removes the allowlist.                                                                                                           |
| `entries[].cidr`        | Required | An IPv4 address (`203.0.113.7`) or CIDR range (`203.0.113.0/24`). IPv6 addresses aren't supported.                         |
| `entries[].description` | Optional | A label for the entry.                                                     |

**Response:**

You'll get back the list as saved, with `change_in_progress` set to `true` while the cluster is being updated:

```json
{
  "enabled": true,
  "change_in_progress": true,
  "last_change_failed": false,
  "entries": [
    {
      "cidr": "203.0.113.7/32",
      "description": "Office",
      "created_at": 1760054400
    },
    {
      "cidr": "198.51.100.0/24",
      "description": "Production servers",
      "created_at": 1760054400
    }
  ]
}
```

### Error Responses

- HTTP `422` when an entry isn't valid, with a message naming it. The existing list stays as it was.
- HTTP `409` when an earlier change is still being applied, or the cluster isn't in service yet. So you want to wait for `change_in_progress` to turn `false` and send the request again.

:::warning
A [cloned cluster](./cluster-cloning.md#start-a-cloning-operation) doesn't inherit the allowlist.
:::

## Permissions

To [get](#get-allowlist) or [replace](#replace-allowlist) the allowlist, you need a key with the `cluster_network:manage` capability.
See [capabilities](./authentication.md#capabilities).
