---
title: "Typesense Cloud MCP Server"
description: "Connect Claude Code, Codex, Cursor, claude.ai, ChatGPT or any MCP client to Typesense Cloud so your agent can create clusters, build collections, index data and tune search with the permissions you choose."
---

# Typesense Cloud MCP Server

Connect your AI agent to Typesense Cloud and it can create and configure clusters, build collections, index your data, tune search and read metrics, all from the conversation. You decide what it is allowed to do when you connect it, and you can disconnect it at any time.

## Connect

Add the Typesense Cloud MCP server to your client:

```
https://cloud.typesense.org/mcp/v1
```

Claude Code:

```shell
claude mcp add --transport http typesense-cloud https://cloud.typesense.org/mcp/v1
```

Codex CLI:

```shell
codex mcp add typesense-cloud --url https://cloud.typesense.org/mcp/v1
codex mcp login typesense-cloud
```

Cursor (`mcp.json`):

```json
{ "mcpServers": { "typesense-cloud": { "url": "https://cloud.typesense.org/mcp/v1" } } }
```

claude.ai and Claude Desktop: Settings, then Connectors, then Add custom connector, and paste the URL.

ChatGPT: Settings, then Connectors (developer mode), and add the URL.

Any other client that supports MCP with OAuth works the same way.

Your browser opens a Typesense Cloud page. Sign in (or sign up), choose the account the agent should work on, choose what it may do, and click Connect.

### Helpful Tips

- A connection is tied to one account. To work on another account, add the server again under a different name.
- The account owner receives an email whenever a new connection is approved, and every connection is listed under Account, then Connected apps, where you can disconnect it.
- If Cursor does not show the tools after connecting, restart it. Cursor caches a server's tool list until it restarts.

## Start with a prompt

Once connected, paste this into your agent:

```plaintext
Set up Typesense Cloud for me: create a cluster, then index my data (it's in <describe or point to it>) and build a first search.
```

The agent creates a free-tier cluster, asks what your data looks like, proposes a schema, imports the data and runs a search you can check. From there, ask for what you need. For example:

Working with your data:

- "Create a collection for my products and import them from `products.jsonl`"
- "Show me the schema of the `products` collection and a few sample documents"
- "How many documents are in each collection?"
- "Add `brand` as a facet field to the `products` collection"
- "Search for running shoes under $100, sorted by rating"
- "Export the `orders` collection to a file"

Tuning search results:

- "Make in-stock products rank above out-of-stock ones"
- "Boost newer products: sort by relevance first, then by `created_at` descending"
- "Pin product 123 to the top when someone searches for `sneakers`"
- "Add synonyms so that `sneakers` also matches `trainers`"
- "Allow one typo on `title` but none on `sku`"
- "Save these search settings as a preset called `storefront`"

Running the cluster:

- "Show CPU and memory for the last 24 hours"
- "Upgrade my cluster to 4 GB of RAM"
- "Upgrade my cluster to the latest Typesense version"

## What you can let the agent do

When you connect your agent, the permissions page shows five presets:

| Preset | The agent can |
|---|---|
| Search only | Search collections and read schemas. |
| Search and curate | Search, plus manage synonyms, curation, presets and stopwords. |
| Manage clusters | Create, resize, rename and tune clusters. No access to the data inside them. |
| Build (default) | Manage clusters and everything inside them. No terminating, cloning, billing or key issuance. |
| Everything | Every capability your role allows, including terminating clusters. |

You can also enable or disable individual permissions. Cluster permissions are the same ones a [Cluster Management API key](../../cloud-management-api/v1/authentication.md#capabilities-and-presets) can carry. Data capabilities match the cluster dashboard's permissions:

- `data:view`: read collections, schemas, documents and aliases
- `data:search`: search
- `data:full_access`: create, change and drop collections; add, update and delete documents; manage aliases
- `data:manage_synonyms`, `data:manage_overrides` (curation), `data:manage_presets`, `data:manage_stopwords`
- `data:manage_analytics_rules`, `data:manage_conversation_models`, `data:manage_natural_language_models`

Terminating a cluster, cloning it and issuing cluster API keys are marked destructive, so your client asks you before running them.

On a team account you can only grant what [your own role](./role-based-access-control-admin-dashboard.md) allows. Options your role does not cover are greyed out with the reason.

## What the agent works with

These are the tools available for your agent to use once it is connected:

- `whoami`: which account and permissions the connection has. Agents call it first.
- `search_typesense_docs`: searches this documentation, matched to your cluster's Typesense version.
- `search_documents`: searches a collection, including multi-search and vector or hybrid queries.
- `get_clusters`: lists clusters and reads configuration, status, metrics, configuration-change and cloning history, server parameters and invoices, plus the regions, memory and vCPU options a cluster can be created with.
- `manage_cluster`: creates, renames, resizes, tunes, clones and terminates clusters, and issues cluster API keys.
- `documents`: indexes, updates, fetches, deletes, imports and exports documents.
- `read_cluster_data` and `change_cluster_data`: everything else in the [Typesense Server API](/api/) by path: collections, aliases, synonyms, curation, presets, stopwords, analytics, models, stemming dictionaries.

Typesense Cloud performs data operations against your cluster with a key it keeps server-side. The agent does not receive your cluster's admin key.

## Large imports and exports

The agent imports up to 1,000 documents or 10 MB in one call. For anything larger, and for every export, it receives a curl command to run on your machine instead, so the data moves directly between your machine and the cluster. The command uses a temporary key that Typesense Cloud creates for that one job: scoped to that collection and that action, valid for 24 hours, fetched once into a private file on your machine.

Browser-based assistants such as claude.ai and ChatGPT cannot run commands, so their imports stay within the inline limit.

## Free tier and billing

A new account can create a free-tier cluster (0.5 GB memory, 2 vCPU burst, one node) without a payment method. Larger configurations, configuration changes and clones need one; the agent will tell you when that is the case and can offer to test with a subset of your data that fits the free tier.

## Rate Limits

Each connection gets 300 data calls (search, documents, reads and writes) per minute and 30 cluster-management actions per minute, the same as the [Cloud Management API](../../cloud-management-api/v1/rate-limits.md).

## Running without a browser

An agent on a server, in CI, or anywhere it cannot open a browser can use a [Cluster Management API key](../../cloud-management-api/v1/authentication.md) as the bearer token on the same URL:

```shell
claude mcp add --transport http typesense-cloud https://cloud.typesense.org/mcp/v1 \
  --header "Authorization: Bearer ${TYPESENSE_CLOUD_MANAGEMENT_API_KEY}"
```

Use the key exactly as it was shown when you created it. A key unlocks the cluster tools (`whoami`, `search_typesense_docs`, `get_clusters` and `manage_cluster`); the data tools act as a signed-in person, so they need the browser connection. A headless agent provisions the cluster and issues its keys over MCP, then works with the data through the [Typesense Server API](/api/) directly.

## Cluster API keys

`manage_cluster` can issue a cluster's admin key and search-only key, both covering every collection. Keep the admin key on your server and give applications the search-only key. For a key limited to certain collections, actions or an expiry, ask the agent to <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#create-an-api-key`">create one</RouterLink>. If different users must see different parts of one collection, use a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">scoped search key</RouterLink>.
