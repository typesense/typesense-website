---
title: "Typesense Cloud MCP Server"
description: "Connect Claude Code, Codex, Cursor, claude.ai, ChatGPT or any MCP client to Typesense Cloud so your agent can create clusters, build collections, index data and tune search with the permissions you choose."
---

# Typesense Cloud MCP Server

Connect your AI agent to Typesense Cloud and it can create and configure clusters, build collections, index your data, tune search and read metrics, all from the conversation. You decide what it is allowed to do when you connect it, and you can disconnect it at any time.

## Step 1: Connect

Add the Typesense Cloud MCP server to your AI Agent:

```
https://cloud.typesense.org/mcp/v1
```

It is a remote MCP server over Streamable HTTP with OAuth, so any client that supports those works. 

Here are instructions for common agents:

**Claude Code:**

```shell
claude mcp add --transport http typesense-cloud https://cloud.typesense.org/mcp/v1
```

Then open a new Claude Code session, type `/mcp`, select the `typesense-cloud` MCP you just added, and select "Authenticate"

**Codex CLI:**

```shell
codex mcp add typesense-cloud --url https://cloud.typesense.org/mcp/v1
```

Codex reads your project's `AGENTS.md` every turn. Add this line to it so Codex reaches for Typesense Cloud instead of asking you for keys:

```plaintext
For anything about my Typesense Cloud account, clusters or collections, use the typesense-cloud MCP tools.
```

**Cursor** (`mcp.json`, [MCP setup docs](https://cursor.com/docs/context/mcp)):

```json
{ "mcpServers": { "typesense-cloud": { "url": "https://cloud.typesense.org/mcp/v1" } } }
```

**claude.ai and Claude Desktop** ([custom connector docs](https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp)): 

Go to Customize, then Connectors, then Add custom connector, and paste this URL: `https://cloud.typesense.org/mcp/v1`

**ChatGPT** ([MCP setup docs](https://learn.chatgpt.com/docs/extend/mcp?surface=app)): 

In the ChatGPT desktop app, go to Settings, then Plugins, then MCP, then Add, then Add MCP Server. Name it "Typesense Cloud", set the type to Streamable HTTP and the URL to `https://cloud.typesense.org/mcp/v1`, and save. 

Then ask: "Using Typesense Cloud MCP, show me my clusters."

**Other Clients**:

Any other client that supports MCP over Streamable HTTP with OAuth works the same way.

## Step 2: Consent Screen

Once you add the MCP Server, follow your client's instructions to authenticate the MCP Server.

Your browser will open a Typesense Cloud consent page. 

Sign in (or sign up), choose the account the agent should work on, choose what [permissions](#what-you-can-let-the-agent-do) it has, and click Connect.

If you're part of a team account, the permissions in the consent screen will be capped at permissions your [RBAC role](./role-based-access-control-admin-dashboard.md) in your team account already gives you. 
So for eg: someone on your team with a curator role, connecting their agent, will only be able to add permissions for searching and curation, and not any of the other permissions.  

:::tip

- A connection is tied to one account. To work on another account, add the MCP server again with the same URL as above, but give it a different name.
- The account owner receives an email whenever a new connection is approved, and every connection is listed under Account, then Connected apps, where you can disconnect it.
- If Cursor does not show the tools after connecting, restart it. Cursor caches a server's tool list until it restarts.

:::

## Step 3: Start with a prompt

Once connected, paste this into your agent:

```plaintext
Using MCP, set up Typesense Cloud for me: create a cluster, then index my data (it's in <describe or point to it>) and build a first search.
```

The agent creates a free-tier cluster, asks what your data looks like, proposes a schema, imports the data and runs a search you can check. From there, ask your agent for what you need. Here are some examples for inspiration:

**Working with your data:**

- "Create a collection for my products and import them from `products.jsonl`"
- "Show me the schema of the `products` collection and a few sample documents"
- "How many documents are in each collection?"
- "Add `brand` as a facet field to the `products` collection"
- "Point the `products_live` alias at the `products_v2` collection"
- "Delete every document in `orders` where `status:=cancelled`"
- "Export the `orders` collection to a file"

**Searching:**

- "Search for running shoes under $100, sorted by rating"
- "Search `products` and `articles` for `trail running` in one call and show me the top three of each"
- "Run a hybrid search on `articles` for `getting started with vector search`"
- "Group the results by `brand` and show me two per brand"

**Tuning search results:**

- "Make in-stock products rank above out-of-stock ones"
- "Boost newer products: sort by relevance first, then by `created_at` descending"
- "Pin product 123 to the top when someone searches for `sneakers`"
- "Add synonyms so that `sneakers` also matches `trainers`"
- "Allow one typo on `title` but none on `sku`"
- "Add `the`, `a` and `an` as stopwords for the `articles` collection"
- "Save these search settings as a preset called `storefront`"
- "Set up popular-queries analytics so I can see what people search for most"
- "Set up natural language search on `products` so people can type `cheap red shoes for kids`"
- "Add a conversation model so I can build a chat over the `docs` collection"

**Search Typesense docs:**

> The MCP server will automatically query the docs for the version your Typesense Cloud cluster is running on

- "How do I do geo search within 5 km of a point?"
- "What does `drop_tokens_threshold` do and what should I set it to?"
- "Which search parameters does my cluster's version support for vector search?"

**Managing your cluster's infrastructure**:

- "Show CPU and memory for the last 24 hours"
- "Upgrade my cluster to 4 GB of RAM"
- "Turn on high availability and schedule the change for 2 am UTC"
- "Upgrade my cluster to the latest Typesense version"
- "Cancel the configuration change that is still pending"
- "Set `max-per-page` to 500 on this cluster"
- "Restart my cluster tonight at 2 am UTC so the new server parameters take effect"
- "Clone my production cluster into a staging cluster"
- "Which regions and cluster sizes can I choose from?"
- "Give me the search-only key for my web app"
- "Terminate the `staging-old` cluster"

**Analyzing your billing data**:

- "Show me my last three invoices?"
- "What changed between my invoice from this week vs last week?"
- "Based on my last 6 invoices, how much should I prepay for the credits to last a year?"
- "Which cluster cost me the most last month?"

## Starting without an account

Your agent can create a cluster before you have a Typesense Cloud account, and you claim the cluster into your account later.

Until you authenticate the MCP server, it offers your agent just two tools: one creates a free cluster and one checks on it.
The cluster is the free-tier shape (0.5 GB memory, 2 vCPU burst, one node), in the region nearest the agent unless it asks for another one.
The agent gets the cluster's hostname and an API key, and works with it directly through the [Typesense Server API](/api/).
That key can create collections, import, search and set up synonyms, curation, presets, stopwords and analytics rules. It can't delete anything or manage API keys.

The agent also gives you a claim link.
Open it, sign in or sign up and pick the account that should own the cluster: your own or one of your team accounts.
The cluster keeps its ID, hostname and data, so nothing changes for your app.

:::warning Note
An unclaimed cluster is deleted 72 hours after it was created.
:::

:::tip
- The agent's API key keeps working for 24 hours after you claim the cluster, so it can finish what it was doing. You can revoke it as you claim instead.
- If the account you claim into has already used its free tier, the claim needs a payment method. The claim page shows the cost before you confirm.
- To configure the cluster or do anything else with your account, [authenticate the MCP server](#step-2-consent-screen).
:::

## What you can let the agent do

When you connect your agent, the permissions page shows five presets:

| Preset | The agent can |
|---|---|
| Search only | Search collections and read schemas, list clusters. |
| Search and curate | Search, plus synonyms, curation, presets and stopwords, plus list clusters. |
| Manage clusters | Create, resize, rename, restart and tune clusters, and read their backups. No access to the data inside them. |
| Build (default) | Manage clusters and everything inside them. No terminating, cloning or billing. The only key it can create is a search-only cluster key for an app. |
| Everything | Every capability your role allows, including terminating clusters. |

You can also enable or disable individual permissions. Cluster permissions are the same ones a [Cluster Management API key](../../cloud-management-api/v1/authentication.md#capabilities) can carry:

- `clusters:read`: list clusters and read their configuration, status, history and server parameters
- `metrics:read`: read cluster metrics, request logs and each node's health
- `search_insights:read`: read a collection's search insights (its top no-hit and popular queries, top facet values, field names and synonym sets) and its synonym suggestions
- `clusters:create`: create clusters (billed to the account)
- `clusters:configure`: resize, change topology, rename and toggle auto-upgrade (billable changes)
- `clusters:restart`: start and cancel rolling restarts
- `cluster_parameters:manage`: change Typesense server parameters and synonym suggestion settings, run or dismiss synonym suggestions (suggestion runs use your own LLM provider key and are billed by that provider) and read and change analytics rule notifications (scheduling them also needs `search_insights:read`)
- `clusters:clone`: clone clusters
- `cluster_credentials:issue`: issue a cluster's admin and search-only keys
- `cluster_credentials:manage`: list, create and revoke cluster API keys
- `cluster_network:manage`: read and replace a cluster's IP allowlist (which IPv4 addresses can reach it)
- `backups:read`: list a cluster's backups and read its backup settings and their estimated cost
- `backups:manage`: turn backups on or off, change their schedule and regions (billed) and delete backups
- `backups:restore`: restore a backup to a new cluster (billed), or onto the backed-up cluster, replacing all of its data
- `billing:read`: read invoices, the billing summary (prepaid credit balance, spend by month, the upcoming invoice and the billing cycle), invoiced usage, what each cluster cost per month and prices
- `billing:manage`: switch the account between weekly and monthly billing
- `clusters:terminate`: terminate clusters

Data permissions match the cluster UI dashboard's permissions:

- `data:view`: read collections, schemas, documents and aliases
- `data:search`: search, and create a search-only cluster key for an app (if your role manages keys)
- `data:full_access`: manage collections (create, change and drop), documents (add, update and delete) and aliases. It includes `data:view` and `data:search`. It doesn't include the `data:manage_*` permissions below
- `data:manage_synonyms` (also needed to accept a synonym suggestion), `data:manage_overrides` (curation), `data:manage_presets`, `data:manage_stopwords`, `data:manage_stemming`
- `data:manage_analytics_rules`, `data:manage_conversation_models`, `data:manage_natural_language_models`

Every tool is offered to every connection, but each tool call is checked against the permissions you granted.
When a call is refused, the agent is told which permission it's missing, along with a link to pass on to you.
The link opens "Edit capabilities" for that connection with the permission already ticked.
After you click "Save", the agent has that permission on its next call.
You can also change a connection's permissions yourself by going to Account > Connected apps and clicking on "Edit capabilities".
Only the person who connected an agent can change what it can do.

The tools that change things (`manage_cluster`, `documents` and `change_cluster_data`) are marked destructive, so clients that honor that annotation ask you before running them.

On a team account you can only grant what [your own role](./role-based-access-control-admin-dashboard.md) allows. Options your role doesn't cover are grayed out with the reason.

## What the agent works with

These are the tools available for your agent to use once it is connected. Agents read the tool descriptions, so you don't need to name tools or actions in your prompts.

- `whoami`: which account and permissions the connection has, the clusters on the account, and what to do with them first. Agents call it first.
- `search_typesense_docs`: searches this documentation, matched to your cluster's Typesense version.
- `search_documents`: searches a collection, including multi-search and vector or hybrid queries.
- `get_clusters`: reads everything about your clusters and account:
  - Clusters: configuration, status, metrics, server parameters, the IP allowlist, API keys (never a key's value) and configuration-change, cloning and rolling-restart history.
  - Monitoring: request logs (the access log, slow requests, top client IPs and API keys, plus when each API key was last used).
  - Search analytics: a collection's search insights and synonym suggestions, synonym suggestion settings and analytics rule notifications.
  - Backups: backup settings and kept backups.
  - Billing: invoices, the billing summary, invoiced usage, costs by cluster and prices.
  - Options: the regions, memory and vCPU options a cluster can be created with and which memory sizes fit an existing cluster's data.
- `manage_cluster`: makes changes:
  - Clusters: creates, renames, resizes, tunes, restarts, clones and terminates clusters, and cancels pending configuration changes, restarts and clones.
  - Access: replaces a cluster's IP allowlist and issues, creates and revokes cluster API keys.
  - Search analytics: schedules analytics rule notifications, sets up and runs synonym suggestions and accepts or dismisses them.
  - Backups: turns backups on or off and deletes or restores them.
  - Billing: switches the account between weekly and monthly billing.
- `documents`: indexes, updates, fetches, deletes, imports and exports documents.
- `read_cluster_data` and `change_cluster_data`: everything else in the [Typesense Server API](/api/) by path: collections, aliases, synonyms, curation, presets, stopwords, stemming dictionaries, analytics, conversation models and natural language search models. This also covers the cluster's own `/health` and `/metrics.json`.
- `submit_feedback`: lets the agent tell the Typesense Cloud team about a paper cut it hit, such as a tool that refused something that should work or a missing action. The team reads every submission, but nobody replies through the tool. For anything blocking you, [contact support](https://cloud-help.typesense.org/article/contact-us).

Typesense Cloud performs data operations against your cluster with a key it keeps server-side. The agent does not receive your cluster's admin key.

## Large imports and exports

The agent imports up to 1,000 documents or 10 MB in one call. For anything larger, and for every export, it receives a curl command to run on your machine instead, so the data moves directly between your machine and the cluster. The command uses a temporary key that Typesense Cloud creates for that one job: scoped to that collection and that action, valid for 24 hours, fetched once into a private file on your machine.

Browser-based assistants such as claude.ai and ChatGPT cannot run commands, so their imports stay within the inline limit.

## Free tier and billing

A new account can create a free-tier cluster (0.5 GB memory, 2 vCPU burst, one node) without a payment method. Creating anything beyond the free tier needs a payment method on the account, or enough prepaid credit for a new cluster. Changing a cluster's configuration or cloning it needs a payment method or a positive prepaid credit balance. Upgrading the Typesense server version is exempt, and free-tier clusters can always take it. The agent tells you when a payment method is needed and can offer to test with a subset of your data that fits the free tier.

## Rate Limits

Each connection gets 300 data calls (search, documents, reads and writes) per minute.
Cluster-management actions are limited to 30 per minute, the same as the [Cloud Management API](../../cloud-management-api/v1/rate-limits.md).

## Running without a browser

An agent on a server, in CI, or anywhere it cannot open a browser can use a [Cluster Management API key](../../cloud-management-api/v1/authentication.md) as the bearer token on the same URL:

```shell
claude mcp add --transport http typesense-cloud https://cloud.typesense.org/mcp/v1 \
  --header "Authorization: Bearer ${TYPESENSE_CLOUD_MANAGEMENT_API_KEY}"
```

Use the key exactly as it was shown when you created it. A key unlocks the cluster tools (`whoami`, `search_typesense_docs`, `get_clusters` and `manage_cluster`) with the capabilities the key carries. The data tools act as a signed-in person, so they need the browser connection. A headless agent provisions the cluster and issues its keys over MCP, then works with the data through the [Typesense Server API](/api/) directly.

## Cluster API keys

`manage_cluster` can issue a cluster's admin key and search-only key, both covering every collection and neither expiring. The keys do not appear in the conversation: the agent receives a curl command that downloads them once into a private file on your machine, and reads a key from that file when it needs one. An assistant with no shell, such as claude.ai or ChatGPT, can ask for the keys inline in the response instead.

Keep the admin key on your server and give applications the search-only key. A connection with `data:search` can also create a search-only key for an application directly on the cluster, if your role manages keys, so the Build preset covers "make my catalog searchable from my app" end to end without issuing an admin key.

For a key limited to certain collections, actions or an expiry, you want to ask the agent to create one.
With `cluster_credentials:manage`, `manage_cluster` creates a key with exactly the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#create-an-api-key`">actions and collections</RouterLink> you name, with an optional expiry.
It hands over the key's value through the same one-time download, or inline for an assistant with no shell.
If different users must see different parts of one collection, use a <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">scoped search key</RouterLink>.

With the same permission, `get_clusters` lists the keys on a cluster with their id, description, scope and the first characters of their value.
`manage_cluster` can then revoke a key by its id, including the admin and search-only keys it issued earlier.
