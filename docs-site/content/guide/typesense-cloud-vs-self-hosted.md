---
description: "Compare Typesense Cloud with self-hosting Typesense: API parity, admin UI, managed infrastructure, backups, monitoring, access control, cost and support."
---

# Typesense Cloud vs Self-Hosted

Typesense is open source, so you can self-host it on your own infrastructure, or have us run it for you in [Typesense Cloud](https://cloud.typesense.org).

Here's how Typesense Cloud and Self-Hosted (on any VPS or other cloud) compare:

## API Parity

We run the same binaries we publish open source in Typesense Cloud as well, so the core APIs and features are the same.

## Admin UI

Typesense Self-Hosted is an API-only product. Whereas in Typesense Cloud we provide a UI to explore the data, setup synonyms, aliases, overrides, merchandizing, etc by pointing and clicking - ideal for non-technical members of your team to manage search behavior themselves, without having to take up engineering time.

## Managed Infrastructure

In Typesense Cloud we take care of the infrastructure for you completely. As you scale, we can automatically scale your clusters for you (when you turn this setting on). Setting up a [Highly Available cluster](./high-availability.md), changing [cluster capacity](./system-requirements.md) and changing [Typesense versions](./updating-typesense.md) is point and click (or can be automated via the [Typesense Cloud Management API](/cloud-management-api/v1/README.md)) in Typesense Cloud, saving your infrastructure team valuable time.

## Control Over Infrastructure

In Typesense Cloud, you choose the RAM, CPU, disk, GPU and regions for each cluster from the [options we offer](https://cloud.typesense.org/pricing/), and you can [change a cluster's configuration](./updating-typesense.md#typesense-cloud) later.
You can also customize Typesense's <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">server configuration parameters</RouterLink>.

When self-hosting, you can run Typesense on any hardware and with any hosting provider, including inside your own private network or on-premise.

## Backups

In Typesense Cloud, we can [back up your cluster's data](./backups.md#typesense-cloud) automatically on a schedule you choose and store each backup in up to 3 regions.
You can then restore any backup to a new cluster in a few clicks.

When self-hosting, you want to call the snapshot API on a schedule, move the snapshots to remote storage and test restoring them periodically, as described [here](./backups.md#typesense-self-hosted).

## Monitoring

In Typesense Cloud, you get graphs of memory, CPU, disk and request metrics for each node.
You also get request logs that show you slow requests and which API keys and IP addresses send the most requests.
We can also notify your application using [webhooks](../cloud-management-api/v1/webhooks.md) when a cluster is running low on memory, disk or CPU.

When self-hosting, Typesense exposes metrics and request stats via the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#cluster-metrics`">`/metrics.json`</RouterLink> and <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#api-stats`">`/stats.json`</RouterLink> endpoints, which you want to connect to your own monitoring and alerting tools.

## Search Analytics

In Typesense Cloud, you can see the popular searches and the searches that found nothing in each collection, and have them emailed to your team on a schedule.
You can also get synonym suggestions for the searches that found nothing.

When self-hosting, you can collect popular and no-hit searches using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/analytics-query-suggestions.html`">analytics rules</RouterLink> and build your own reporting on top of them.

## Globally Distributed

In Typesense Cloud, we offer a [Search Delivery Network](/guide/typesense-cloud/search-delivery-network.md) feature that works like a CDN, but we _replicate_ your full dataset to each of the regions you choose (unlike in a CDN where only frequently used items are kept on the edge), and the node that's closest to a searcher will respond to the search request. This reduces network latency and speeds up the search for your users around the world.

## Role-Based Access Control

In Typesense Cloud, we give you Role Based Access control for members of your team, so you don't have to share API keys with team members to give them selective access to different parts of the UI.

## Single Sign-On

In Typesense Cloud, members of your team can log in to the dashboard using your existing [SSO provider](./typesense-cloud/single-sign-on.md), without any additional charges.

## Hosted MCP Server

We offer an official [Hosted MCP Server on Typesense Cloud](./typesense-cloud/mcp-server.md) that you can connect with your AI agents like Claude Code, Codex, Cursor, etc to interact with your clusters using your agents. This MCP Server is deeply integrated with the RBAC permission system in Typesense Cloud, so if you can have different members of your team with varying levels of access, they'll only get access to the subset of capabilities you've defined via their agent, just like in the web UI.

## Switching Effort

Since we run the same binaries, you can migrate between self-hosted and Typesense Cloud by just exporting and importing data.

## Cost

You'll have to compare the [pricing](https://cloud.typesense.org/pricing/) we publish on Typesense Cloud, with what it would cost to run an equivalent capacity VM(s) on your server hosting provider, plus add the engineering time required to self-host, manage infrastructure and keep up with updates. In general, we find that once you add engineering time, Typesense Cloud becomes cheaper, because we're able to amortize engineering time on our side across all customers, bringing down costs for all users.

## Support

We offer [Prioritized Support](https://typesense.org/support/) on Typesense Cloud, whereas for Self-Hosted support is best-effort or usually [self-service](/help.md).
