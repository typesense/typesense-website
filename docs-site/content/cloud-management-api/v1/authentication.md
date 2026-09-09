---
description: "Authenticate with the Typesense Cloud Cluster Management API by creating a capability-limited API key and passing it in an HTTP header."
---

# Authentication

This section talks about how to authenticate with the [Typesense Cloud **Cluster Management API**](README.md).

If you're looking for the Typesense Server API docs, see [here](/api).

## Getting an API Key

1. Log in to Typesense Cloud
2. Switch to the account you want to generate an API Key for, using the account switcher on the top right.
3. Navigate to your [account page](https://cloud.typesense.org/account).
4. Scroll all the way down, and click on the "Read More" link next to "Need programmatic access to create clusters".
5. On the next page, choose a capability preset or a custom capability set, then click "New Cluster Management API Key".

Make sure you note this API Key down, as this will be the only time you'll be able to see the full API Key.

## Capabilities and presets

Each key has one or more capabilities:

- `clusters:read`
- `metrics:read`
- `clusters:create`
- `clusters:configure`
- `cluster_parameters:manage`
- `clusters:clone`
- `cluster_credentials:issue`
- `billing:read`
- `clusters:terminate`

`clusters:read` covers every read, including configuration-change and cloning history and server parameters. `clusters:configure` covers sizing, topology, rename, and auto-upgrade; `cluster_parameters:manage` covers Typesense server parameters. The `read-only` preset grants `clusters:read` and `metrics:read`. The `provision` preset grants `clusters:read`, `metrics:read`, `clusters:create`, and `clusters:configure`. The `operate` preset grants `clusters:read`, `metrics:read`, `clusters:configure`, and `cluster_parameters:manage`. The `admin` preset grants every capability. Choose custom capabilities when a task needs a different combination.

`cluster_credentials:issue` can return a wildcard Typesense Server admin key, so grant it only to trusted workflows that need to create cluster credentials. Cloning copies cluster data, and billing access can reveal billing information, so those capabilities are separate from read-only cluster access.

## Making API Calls

Set the API key in the `X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY` HTTP header. An [AI agent that cannot open a browser](../../guide/typesense-cloud/mcp-server.md#running-without-a-browser) can also present this key as a bearer token to the Typesense Cloud MCP server.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: INSERT-YOUR-KEY-HERE"
```

## Revoking API Keys

To revoke a key, go back to the [Cluster Management API Keys page](https://cloud.typesense.org/account/management-api-keys) under your account, find the key in the list, and click the trash icon next to it. Confirm the prompt and the key stops working immediately.

Keys are minted at the account level, and are not tied to the individual user who created them. The "Created By" line on the keys page is there for attribution: a key keeps working after that user leaves the account, so revoke any keys you no longer want to be usable.
