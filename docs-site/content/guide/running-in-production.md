# Running Typesense in Production

In addition to performance and ease-of-use, Typesense is also designed to have low operational overhead in Production.

When running Typesense in [Typesense Cloud](https://cloud.typesense.org), running in production is as simple as flipping a switch to enable "High Availability" and you'll have a distributed multi-node cluster that is production-ready and ready-to-use.

Typesense is a single self-contained binary with no runtime dependencies. So when self-hosting, running Typesense in Production involves simply [installing Typesense](./install-typesense.md), starting the Typesense process as a daemon, either via Docker or a process manager (our DEB and RPM packages do this for you) and configuring [High Availability](./high-availability.md) as needed.

## Production Best Practices

Here are a couple of pointers to ensure that you get an optimal experience from Typesense in Production.

::: tip
Most of the server infrastructure related items are not applicable to Typesense Cloud clusters, since we manage the infrastructure for you.
:::

### Configuration

- Ensure that you have picked the right [system configuration](./system-requirements.md) for your dataset and traffic patterns.
- Typesense comes built-in with a [high performance HTTP server](https://github.com/h2o/h2o) that is used by likes of [Fastly](https://fastly.com) in their edge servers at scale.
  So Typesense can be directly exposed to incoming public-facing internet traffic, without the need to place it behind another web server like Nginx / Apache or your backend API.
  - Typesense also has a [robust authentication mechanism](./data-access-control.md) that lets you configure Role-Based Access to a subset of data for particular users, should you need it.
  - Enable CORS using the `--enable-cors` [server configuration](./configure-typesense.md) should you need it. (We manage this for you in [Typesense Cloud](https://cloud.typesense.org)). 
- Run a [Highly-Available](./high-availability.md) cluster when serving Production traffic (optional, but highly recommended).
  - Make sure that you have configured your API clients to use all nodes in your cluster.
  - If you're using the [Search Delivery Network](./system-requirements.md#choosing-search-delivery-network-sdn) (SDN) option in [Typesense Cloud](https://cloud.typesense.org), make sure that you have [configured the clients](../latest/api/authentication.md#search-delivery-network) appropriately to use the SDN endpoint.
- Configure a minimal amount of swap space for safety reasons, but if you see swap being used, that will start affecting performance and is a sure sign that you'd need to upgrade RAM capacity.
- If you're integrating Typesense with a mobile app, we highly recommend that you store the Typesense hostnames and API Key(s) on your backend, and have your app dynamically fetch the remote configs on load, instead of hard-coding these in the app. 
  This is helpful if you need to change the hostnames / API keys for any reason. With remote configs, you can change these values without having to go through a round of app store review processes.  

### Monitoring

- Monitor the [`/health` API endpoint](../latest/api/cluster-operations.md#health) for uptime.
- Monitor RAM usage to ensure that it is below 85% of total RAM - you want to ensure that the OS has sufficient RAM to do its thing.
  - You can access memory usage metrics via the [`/metrics.json` endpoint](../latest/api/cluster-operations.md#cluster-metrics) or via the Typesense Cloud Dashboard.
- Monitor the [`/stats.json` API endpoint](../latest/api/cluster-operations.md#api-stats) for request rate and latency. 
- Monitor CPU usage to ensure that it is below 90% on average. If it spikes beyond that, you might need to upgrade to higher CPU capacity.
  - You can access CPU usage metrics via the [`/metrics.json` endpoint](../latest/api/cluster-operations.md#cluster-metrics) or via the Typesense Cloud Dashboard.
- When using the [`import` API](../latest/api/documents.md#index-multiple-documents) to [ingest](./syncing-data-into-typesense.md) large batches of data, make sure that you have configured a sufficiently high timeout value to let your large imports complete, since all write operations are synchronous in Typesense.

### Search Relevance

- Setup [search analytics](./search-analytics.md).
  - Monitor the search terms users are using, and setup [synonyms](../latest/api/synonyms.md) as appropriate.
  - Monitor the search terms users are using, and [curate results](../latest/api/curation.md) as needed.
- While Typesense's default relevance parameters work out-of-the-box for majority of use cases, you can also fine-tune [search relevance](./ranking-and-relevance.md) parameters as needed.
  - While [`default_sorting_order`](./ranking-and-relevance.md#default-ranking-order) is optional, it is highly recommended especially if you have a field in your documents that is a proxy for how popular a document is within your dataset.

### Security

- Set `--api-port` [server parameter](./configure-typesense.md) to `443` and **use `HTTPS` in production**. 
  - Ensure that your firewall only allows inbound public traffic via this port.
  - Configure your SSL certificate and key using the `--ssl-certificate` and `--ssl-certificate-key` parameters.
- When running a [Highly-Available](./high-availability.md) cluster, ensure that the `--peering-address` parameter is an IP Address on your **INTERNAL** private network.
- Ensure that you have a [strategy](./data-access-control.md#key-rotation) for expiring and rotating API keys regularly, using the [`expires_at`](../latest/api/api-keys.md#arguments) parameter.
- If you are storing multi-tenant data in a single collection, ensure that you have configured your [Scoped Search API Keys](../latest/api/api-keys.md#generate-scoped-search-key) correctly, to include the logged-in user's ID in the embedded filter.
  - Scoped Search API Keys need to be generated in your backend stack, and passed on to the frontend which should then send that to Typesense in API Calls. 
  - Be sure to never expose your parent Search API Key to users, since that key has unrestricted access to all records.
- On Typesense Cloud, set up a [team account](./typesense-cloud/team-accounts.md) to manage access and setup [Single Sign-On](./typesense-cloud/single-sign-on.md).

### Schema Management

- Set up a [collection alias](../latest/api/collection-alias.md) and use the alias to access the collection and documents from your application. 
  - This is especially helpful when you need to update the schema of a collection. You'd create a new timestamped collection, re-index your data in it and then swap the alias to point to it.
- Prefer a [pre-defined schema](../latest/api/collections.md#with-pre-defined-schema) when possible. But you can also use Regex fields name and [auto schema detection](../latest/api/collections.md#with-auto-schema-detection) especially when field names are dynamic. 

### Staying Up-To-Date
 
- To get updates when new versions of Typesense are released, click on "Watch" → "Custom" → "Releases" in the [Typesense GitHub repository](https://github.com/typesense/typesense).
  - Follow these [update instructions](./updating-typesense.md) to update to the latest version.
- We also post updates on Twitter [@typesense](https://twitter.com/typesense) and in our [Slack Community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig).

### Support

We've strived to keep Typesense as self-service and out-of-the-box as possible, with fully public documentation.

But if you need help or have any questions, feel free to reach out through one of these channels:

- Open a [GitHub issue](https://github.com/typesense/typesense/issues)
- Join our public [Slack community](https://join.slack.com/t/typesense-community/shared_invite/zt-2fetvh0pw-ft5y2YQlq4l_bPhhqpjXig) to discuss general questions and/or issues
- Browse through [past conversations](https://threads.typesense.org/) in our Slack community
- For prioritized support with private Slack, email & phone-based support with guaranteed SLAs, see [here](https://typesense.org/support)
