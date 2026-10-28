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

Each key carries one or more capabilities, and each request needs one of them.
If a key doesn't have the capability a request needs, you'll get an HTTP `403` that names the capability (see [Response Codes](./response-codes.md)).
The keys page in Typesense Cloud groups them under the same headings as this table.

| Group | Capability | What it allows | In presets |
|-------|------------|----------------|------------|
| Clusters | `clusters:read` | List clusters and read their configuration, status, history (configuration changes, cloning, rolling restarts) and server parameters | all |
| | `clusters:create` | [Create clusters](./cluster-management.md#create-new-cluster) (billed to the account) | `provision` |
| | `clusters:configure` | Resize, change topology, rename and toggle auto-upgrade (billable changes) | `provision`, `operate` |
| | `clusters:restart` | Start and cancel [rolling restarts](./cluster-restarts.md) | `provision`, `operate` |
| | `clusters:clone` | [Clone clusters](./cluster-cloning.md) | |
| | `clusters:terminate` | [Terminate clusters](./cluster-management.md#terminate-cluster) | |
| Server parameters | `cluster_parameters:manage` | Change [Typesense server parameters](./typesense-server-configuration-parameters.md) and [synonym suggestion](./synonym-suggestions.md) settings, and read and change [analytics rule notifications](./analytics-rule-notifications.md) (scheduling them also needs `search_insights:read`) | `operate` |
| Metrics | `metrics:read` | Read [cluster metrics](./cluster-metrics.md) and [request logs](./cluster-logs.md), including when each API key was last used | all |
| | `search_insights:read` | Read a collection's [search insights](./search-insights.md) and its [synonym suggestions](./synonym-suggestions.md) | |
| Backups | `backups:read` | List a cluster's [backups](./cluster-backups.md) and read its backup settings and their estimated cost | all |
| | `backups:manage` | Turn backups on or off, delete backups and change their schedule and regions (billed) | |
| | `backups:restore` | Restore a backup onto a new cluster (billed), or onto the backed-up cluster itself, replacing all of its data | |
| Cluster API keys | `cluster_credentials:issue` | [Issue](./cluster-management.md#generate-api-key) a cluster's standard admin and search-only key pair | |
| | `cluster_credentials:manage` | [List, create and revoke](./cluster-api-keys.md) a cluster's keys, including keys with a custom scope | |
| Network access | `cluster_network:manage` | Read and replace a cluster's [IP allowlist](./ip-allowlist.md) | |
| Billing | `billing:read` | Read [invoices](./invoices.md), the [billing summary](./billing-summary.md) and [usage, costs by cluster and prices](./usage-and-prices.md) | |
| | `billing:manage` | [Switch the account](./billing-summary.md) between weekly and monthly billing | |

There are four presets:

- `read-only`: `clusters:read`, `metrics:read` and `backups:read`.
- `provision`: everything in `read-only`, plus `clusters:create`, `clusters:configure` and `clusters:restart`.
- `operate`: everything in `read-only`, plus `clusters:configure`, `clusters:restart` and `cluster_parameters:manage`.
- `admin`: every capability. A few requests need `admin` itself because they write to the data inside a cluster. Accepting a [synonym suggestion](./synonym-suggestions.md#accept-a-synonym-suggestion) is one of them.

Choose custom capabilities when a task needs a different combination.
On a team account, a key can only carry what your own role allows.

`cluster_credentials:issue` and `cluster_credentials:manage` can each return a wildcard Typesense Server admin key.
So you want to grant them only to trusted workflows that need to create cluster credentials.
`cluster_network:manage` can cut off every client of the cluster, so it isn't in any preset and you have to grant it by name.
Cloning and restoring copy cluster data, and billing access can reveal billing information, so those capabilities are separate from read-only cluster access.

## Making API Calls

Set the API key in the `X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY` HTTP header. An [AI agent that cannot open a browser](../../guide/typesense-cloud/mcp-server.md#running-without-a-browser) can also present this key as a bearer token to the Typesense Cloud MCP server.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

## Check which account a key acts on

Any key can look up the account it belongs to and the capabilities it carries, whatever those capabilities are.
Here's the request:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/account" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": 123456789,
  "name": "acme",
  "type": "team",
  "status": "active",
  "credential": {
    "type": "management_api_key",
    "capabilities": ["clusters:read", "metrics:read"],
    "acting_as": null
  }
}
```

`type` is `individual` or `team`.
`credential.capabilities` lists the key's capabilities, or `["admin"]` for a key with every capability.
When an AI agent calls this through the [MCP server](../../guide/typesense-cloud/mcp-server.md) with your consent, `credential.type` is `oauth_grant` and `acting_as` is your username.

## Revoking API Keys

To revoke a key, go back to the [Cluster Management API Keys page](https://cloud.typesense.org/account/management-api-keys) under your account, find the key in the list, and click the trash icon next to it. Confirm the prompt and the key stops working immediately.

Keys are minted at the account level, and are not tied to the individual user who created them. The "Created By" line on the keys page is there for attribution: a key keeps working after that user leaves the account, so revoke any keys you no longer want to be usable.
