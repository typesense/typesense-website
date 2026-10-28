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
5. On the next page, pick the key's [capabilities](#capabilities), then click "New Cluster Management API Key".

Make sure you note this API Key down, as this will be the only time you'll be able to see the full API Key.

## Capabilities

When you create a key in the Typesense Cloud dashboard, you can pick one or more of these capabilities.
If a key doesn't have the capability a request needs, you'll get an HTTP `403` that names the capability (see [Response Codes](./response-codes.md)).

| Group | Capability | What it allows |
|-------|------------|----------------|
| | `admin` | Every capability below. A few requests need `admin` itself because they write to the data inside a cluster, such as [accepting a synonym suggestion](./synonym-suggestions.md#accept-a-synonym-suggestion). |
| Clusters | `clusters:read` | [List clusters](./cluster-management.md#list-all-clusters) and [read their configuration and status](./cluster-management.md#get-single-cluster), their history of [configuration changes](./cluster-configuration-changes.md#list-all-configuration-changes), [cloning](./cluster-cloning.md#list-all-cloning-operations) and [rolling restarts](./cluster-restarts.md#list-all-rolling-restarts), and their [server parameters](./typesense-server-configuration-parameters.md#list-all-configuration-parameters) |
| | `clusters:create` | [Create clusters](./cluster-management.md#create-new-cluster) (billed to the account) |
| | `clusters:configure` | [Resize, change topology, rename and toggle auto-upgrade](./cluster-configuration-changes.md#schedule-a-configuration-change) (billable changes) |
| | `clusters:restart` | [Start](./cluster-restarts.md#start-a-rolling-restart) and [cancel](./cluster-restarts.md#cancel-a-pending-rolling-restart) rolling restarts |
| | `clusters:clone` | [Clone clusters](./cluster-cloning.md#start-a-cloning-operation) |
| | `clusters:terminate` | [Terminate clusters](./cluster-management.md#terminate-cluster) |
| Server parameters | `cluster_parameters:manage` | Change [Typesense server parameters](./typesense-server-configuration-parameters.md#update-a-parameter) and [synonym suggestion settings](./synonym-suggestions.md#set-up-or-replace-synonym-suggestions), and read and change [analytics rule notifications](./analytics-rule-notifications.md) (scheduling them also needs `search_insights:read`) |
| Metrics | `metrics:read` | Read [cluster metrics](./cluster-metrics.md) and [request logs](./cluster-logs.md), including when each API key was last used |
| | `search_insights:read` | Read a collection's [search insights](./search-insights.md) and [list its synonym suggestions](./synonym-suggestions.md#list-synonym-suggestions) |
| Backups | `backups:read` | [List a cluster's backups](./cluster-backups.md#list-backups) and [read its backup settings](./cluster-backups.md#get-backup-settings) and their estimated cost |
| | `backups:manage` | [Turn backups on or off and change their schedule and regions](./cluster-backups.md#change-backup-settings) (billed), and [delete backups](./cluster-backups.md#delete-a-backup) |
| | `backups:restore` | [Restore a backup](./cluster-backups.md#restore-a-backup) onto a new cluster (billed), or onto the backed-up cluster itself, replacing all of its data |
| Cluster API keys | `cluster_credentials:issue` | [Issue](./cluster-management.md#generate-api-key) a cluster's standard admin and search-only key pair |
| | `cluster_credentials:manage` | [List](./cluster-api-keys.md#list-all-api-keys), [create](./cluster-api-keys.md#create-an-api-key-with-a-given-scope) and [revoke](./cluster-api-keys.md#revoke-an-api-key) a cluster's keys, including keys with a custom scope |
| Network access | `cluster_network:manage` | Read and replace a cluster's [IP allowlist](./ip-allowlist.md) |
| Dashboard links | `dashboard_links:manage` | [Create](./dashboard-links.md#create-a-dashboard-link), [list](./dashboard-links.md#list-dashboard-links) and [revoke](./dashboard-links.md#revoke-a-dashboard-link) links that open one cluster's dashboard for a person without a Typesense Cloud account |
| Billing | `billing:read` | Read [invoices](./invoices.md), the [billing summary](./billing-summary.md#get-billing-summary) and [usage](./cluster-usage-and-costs.md#list-usage), [costs by cluster](./cluster-usage-and-costs.md#list-costs-by-cluster) and [prices](./prices.md#list-prices) |
| | `billing:manage` | [Switch the account between weekly and monthly billing](./billing-summary.md#switch-billing-cycle) |

On a team account, a key can only carry what your own role allows.

:::warning Grant these with care
- `cluster_credentials:issue` and `cluster_credentials:manage` can each return a wildcard Typesense Server admin key, so you want to grant them only to trusted workflows that need to create cluster credentials.
- `cluster_network:manage` can cut off every client of the cluster.
- `dashboard_links:manage` hands out sign-ins to a cluster's dashboard. AI agents connected through the MCP server can't be given it at all.
- Cloning and restoring copy cluster data, and billing access can reveal billing information, so those capabilities are separate from `clusters:read`.
:::

## Making API Calls

Set the API key in the `X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY` HTTP header. An [AI agent that cannot open a browser](../../guide/typesense-cloud/mcp-server.md#running-without-a-browser) can also present this key as a bearer token to the Typesense Cloud MCP server.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

## Check which account a key acts on

Any key can look up the account it belongs to and the capabilities it carries:

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

To revoke a key, click the trash icon next to it on the [Cluster Management API Keys page](https://cloud.typesense.org/account/management-api-keys).

Keys belong to the account, so a key keeps working after the user who created it leaves the account.
