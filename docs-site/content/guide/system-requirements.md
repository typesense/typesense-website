# System Requirements

Typesense is an in-memory datastore optimized for fast, low-latency retrieval.
In order to do this, it stores the entire search index in-memory and a copy of the raw data on disk.

To get the expected performance characteristics out of Typesense, it is critical to choose a good system configuration.

## Choosing RAM

The Typesense process itself is quite light-weight and only takes up about `20MB` of RAM when there's no data indexed. 
The amount of RAM required is completely dependent on the size of the data you index.

#### For Keyword Search

In general, if the size of your dataset is `X MB`, you'd typically need `2X-3X MB` RAM to index the data in Typesense.

For example: If your dataset size is `1GB`, you'd need between `2GB - 3GB` RAM to hold the whole index in memory.

RAM usage will be on the lower end if your dataset has many documents with overlapping words (or tokens), and on the higher end if documents contain words (or tokens) unique to them.

#### For Vector / Semantic / Hybrid Search

When indexing documents for <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">Vector Search</RouterLink>, each vector requires 7 bytes of memory. 

So if your embedding model returns N-dimension vectors, and you have X number of records, memory consumption would be `7 bytes * N dimensions * X records` bytes. 

For eg: if you're using the S-BERT model which has 384 dimensions and you have 100K records, memory consumption would be `7 bytes * 384 dimensions * 100,000 records = 268.8 MB`. 

## Choosing CPU Capacity

CPU capacity is important to handle concurrent search traffic and indexing operations.

::: warning Important
Typesense requires at least `2 vCPUs` of compute capacity to operate.
:::

Typesense is designed to be **highly scalable out-of-the-box** with no additional configuration needed. 
It automatically takes advantage of all the compute capacity available to it. 
So the maximum number of requests per second a particular CPU configuration can handle is fully dependent on your search query patterns and the shape & size of the data indexed. 

While it's hard to make an exact recommendation for ideal CPU capacity, since it depends on your data, here are some reference data points to give you a good picture of CPU needs:

- A **4vCPU** Typesense node was able to handle **104 concurrent search queries per second**, with 2.2 Million records.
- A **4vCPU** Typesense node was able to handle **46 concurrent search queries per second**, with 28 Million records.
- An **8vCPU 3-node** Typesense cluster was able to handle **250 concurrent search queries per second**, with 3 Million records.

::: tip
In Typesense Cloud, you have the option to use nodes with "Burst" vCPU capacity. 
If you have relatively low baseline traffic for most of the day with the occasional moderate spike during indexing, you can pick one of our "Burst" vCPU options to save costs. 
Note that this option is not a good fit if you have a high baseline of traffic or high indexing volume. 
You will start seeing slowdowns in response times if you direct a consistently large amount of traffic at nodes in this offering.
:::

## Using a GPU (optional)

When using <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#using-built-in-models`">built-in embedding models</RouterLink> for Semantic Search / Hybrid Search,
you can speed up the embedding generation process by making use of a GPU.

Built-in models can still be run using just CPU, but since they are computationally intensive to run there is a marked improvement in performance when running Typesense on a GPU.

GPU is not necessary when using remote embedding models like OpenAI, PaLM API or Vertex AI API, since the embedding generation happens on those remote services' servers and not inside of Typesense.

Typesense currently only support Nvidia GPUs.

:::tip
In Typesense Cloud, you'll find the option to turn on "GPU Acceleration" for [select RAM / CPU configurations](https://typesense.helpscoutdocs.com/article/174-gpu-acceleration) 
when provisioning a new cluster or under Cluster Configuration > Modify for Typesense versions `0.25.0` and above.
:::

## Choosing Disk

Typesense stores a copy of the raw data on disk and then builds the in-memory index using this data. 
Then at search time, after determining the final set of documents to return in the API response, it fetches these documents (only) from disk and puts them in the API response.

You'd need enough disk space, at least the size of your raw dataset, to run Typesense. SSDs are significantly faster than Magnetic Disks and are recommended.

::: tip
In Typesense Cloud, we automatically manage disk space for you. 
When you enable the "High Performance Disk" option (available only for Highly-Available Non-Burst configurations), 
we use NVMEe SSD disks that give you the fastest data transfer rates.
:::

## Choosing Number of Nodes

Typesense can run in a single-node configuration, or in a [Highly-Available](./high-availability.md) multi-node cluster configuration.

We strongly recommend that you run a Highly-Available 3-node or 5-node configuration in your Production environment, to ensure that your search service is resilient against inevitable infrastructure issues.

Typesense uses Raft as its consensus algorithm and since Raft requires a quorum of nodes for consensus, you need to run a minimum of 3 nodes to tolerate a 1-node failure. Running a 5-node cluster will tolerate failures of up to 2 nodes, but at the expense of higher write latencies.

## Choosing Search Delivery Network (SDN)

In [Typesense Cloud](https://cloud.typesense.org), you have the option of creating a Typesense cluster that spans multiple geographic regions around the world, called a Search Delivery Network (SDN).
You are given an SDN endpoint and queries sent to this endpoint will automatically be routed to the node that's closest to where the search request is originating from.

If your users are geographically distributed across countries (or even across states in the case of the US, where we have multiple data center options in different cities),
and you make calls out to Typesense from your website/app directly, then choosing an SDN configuration will ensure that your users get **consistent ultra-low-latency searches regardless of their location**,
since the SDN endpoint automatically routes each search query to the data center that's closest to your user.

Read more about Search Delivery Network [here](typesense-cloud/search-delivery-network.md).
