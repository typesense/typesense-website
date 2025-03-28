# Typesense Benchmarks

- A dataset containing **2.2 Million recipes** (recipe names and ingredients):
  - Took up about 900MB of RAM when indexed in Typesense
  - Took 3.6mins to index all 2.2M records
  - On a server with 4vCPUs, Typesense was able to handle a concurrency of **104 concurrent search queries per second**, with an average search processing time of **11ms**.
- A dataset containing **28 Million books** (book titles, authors and categories):
  - Took up about 14GB of RAM when indexed in Typesense
  - Took 78mins to index all 28M records
  - On a server with 4vCPUs, Typesense was able to handle a concurrency of **46 concurrent search queries per second**, with an average search processing time of **28ms**.
- With a dataset containing **3 Million products** (Amazon product data), Typesense was able to handle a throughput of **250 concurrent search queries per second** on an 8-vCPU 3-node Highly Available Typesense cluster.

We'd love to benchmark with larger datasets, if we can find large ones in the public domain. If you have any suggestions for structured datasets that are open, please let us know by opening an issue. We'd also be delighted if you're able to share benchmarks from your own large datasets. Please send us a PR!
