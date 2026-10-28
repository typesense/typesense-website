---
description: "Typesense Cloud Cluster Management API documentation covers programmatic cluster provisioning, lifecycle management, access, and architecture."
---

# Cloud Cluster Management API <Badge type="tip" text="Advanced" vertical="middle" />

The Typesense Cloud **Cluster Management API** lets you programmatically provision clusters, 
instead of having to click buttons in the Typesense Cloud Web Console.

:::tip
If you're familiar with AWS or GCP, a good analogy for what the Typesense Cloud Cluster Management API lets you do, is what the AWS/GCP REST APIs allow you to do: 
provision resources, manage their lifecycle, access control, etc. programmatically, instead of having to click on buttons in the AWS / GCP Web Console.
:::

## What You Can Do with this API

The Cloud Cluster Management API lets you do the following on Typesense Cloud:

### Clusters

- [Create, list, rename and terminate clusters](./cluster-management.md), and look up the regions, memory and vCPU options a cluster can use
- [Change a cluster's configuration](./cluster-configuration-changes.md): memory, vCPU, high availability, Typesense version and more
- [Restart a cluster's nodes one at a time](./cluster-restarts.md)
- [Clone a cluster](./cluster-cloning.md)
- [Back up a cluster on a schedule and restore its backups](./cluster-backups.md)
- [Set Typesense server parameters](./typesense-server-configuration-parameters.md)

### Access

- [List, create and revoke a cluster's API keys](./cluster-api-keys.md)
- [Limit which IP addresses can reach a cluster](./ip-allowlist.md)

### Monitoring

- [Read per-node cluster metrics](./cluster-metrics.md)
- [Read a cluster's request logs](./cluster-logs.md), including slow requests and when each API key was last used

### Search analytics

- [Read a collection's search insights](./search-insights.md)
- [Get synonym suggestions for searches that found nothing](./synonym-suggestions.md)
- [Email an analytics rule's results, such as popular or no-hit queries, on a schedule](./analytics-rule-notifications.md)

### Billing

- [Read invoices](./invoices.md) and download them as PDFs
- [Read the prepaid credit balance and spend by month](./billing-summary.md), and switch between weekly and monthly billing
- [Read the usage you were invoiced for, what each cluster cost per month and current prices](./usage-and-prices.md)

Once you provision a cluster via this API,
you'll then use the hostname(s) returned by this API to connect to your cluster's [Typesense Server API](/api) directly to index your data and search on it.

## Architecture

Here's an architecture diagram that shows you how the Typesense Cloud Management API fits into the picture: 

<figure>
<img src="~@images/cloud-management-api/management-api-architecture.png" alt="Typesense Cloud Management API Architecture" height="400">
<figcaption>Architecture of Cloud Cluster Management API</figcaption>
</figure>

## OpenAPI Spec

A machine-readable [OpenAPI 3.1 spec](https://cloud.typesense.org/api/v1/openapi.json) of this API describes every endpoint, request and response schema, the management-key capability each endpoint needs, and the error responses, so AI agents and code generators can work from it directly.
