# Cloud Cluster Management API <Badge type="tip" text="Advanced" vertical="middle" />

The Typesense Cloud **Cluster Management API** lets you programmatically provision clusters, 
instead of having to click buttons in the Typesense Cloud Web Console.

:::tip
If you're familiar with AWS or GCP, a good analogy for what the Typesense Cloud Cluster Management API lets you do, is what the AWS/GCP REST APIs allow you to do: 
provision resources, manage their lifecycle, access control, etc. programmatically, instead of having to click on buttons in the AWS / GCP Web Console.
:::

## What You Can Do with this API

The Cloud Cluster Management API lets you do the following operations on Typesense Cloud:

1. Provision new clusters
2. Terminate clusters
3. Generate API Keys for clusters
4. Update select attributes of the cluster (Name, Auto Upgrade Capacity)
5. Schedule cluster configuration changes

Once you provision a cluster via this API,
you'll then use the hostname(s) returned by this API to connect to your cluster's [Typesense Server API](/api) directly to index your data and search on it.

## Architecture

Here's an architecture diagram that shows you how the Typesense Cloud Management API fits into the picture: 

<figure>
<img src="~@images/cloud-management-api/management-api-architecture.png" alt="Typesense Cloud Management API Architecture" height="400">
<figcaption>Architecture of Cloud Cluster Management API</figcaption>
</figure>