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

### Clusters

- [Create](./cluster-management.md#create-new-cluster), [list](./cluster-management.md#list-all-clusters), [rename](./cluster-management.md#update-cluster-attributes) and [terminate](./cluster-management.md#terminate-cluster) clusters, and look up the [regions, memory and vCPU options](./cluster-management.md#get-cluster-options) a cluster can use
- [Change a cluster's configuration](./cluster-configuration-changes.md#schedule-a-configuration-change): memory, vCPU, high availability, Typesense version and more
- [Restart a cluster's nodes one at a time](./cluster-restarts.md#start-a-rolling-restart)
- [Clone a cluster](./cluster-cloning.md#start-a-cloning-operation)
- [Back up a cluster on a schedule](./cluster-backups.md#change-backup-settings) and [restore its backups](./cluster-backups.md#restore-a-backup)
- [Set Typesense server parameters](./typesense-server-configuration-parameters.md)

### Access

- [List](./cluster-api-keys.md#list-all-api-keys), [create](./cluster-api-keys.md#create-an-api-key-with-a-given-scope) and [revoke](./cluster-api-keys.md#revoke-an-api-key) a cluster's API keys
- [Limit which IP addresses can reach a cluster](./ip-allowlist.md)
- [Open one cluster's dashboard for someone without a Typesense Cloud account](./dashboard-links.md)

### Monitoring

- [Read per-node cluster metrics](./cluster-metrics.md)
- [Read a cluster's request logs](./cluster-logs.md#get-access-log), including [slow requests](./cluster-logs.md#get-slow-requests) and [when each API key was last used](./cluster-logs.md#get-when-each-api-key-was-last-used)

### Search analytics

- [Read a collection's search insights](./search-insights.md)
- [Get synonym suggestions for searches that found nothing](./synonym-suggestions.md)
- [Email an analytics rule's results, such as popular or no-hit queries, on a schedule](./analytics-rule-notifications.md)

### Billing

- [Read invoices](./invoices.md#list-all-invoices) and [download them as PDFs](./invoices.md#download-an-invoice-as-a-pdf)
- [Read spend by month, the upcoming invoice and any prepaid credit balance](./billing-summary.md#get-billing-summary), and [switch between weekly and monthly billing](./billing-summary.md#switch-billing-cycle)
- Read the [usage you were invoiced for](./cluster-usage-and-costs.md#list-usage), [what each cluster cost per month](./cluster-usage-and-costs.md#list-costs-by-cluster) and [current prices](./prices.md#list-prices)

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
