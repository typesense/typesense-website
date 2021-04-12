# Raft Based Clustering

High availability is essential for production environments. Typesense uses the [Raft Consensus Algorithm](https://raft.github.io/) to create a highly available cluster with more than one Typesense servers. With Raft, you need to create a cluster of 3 nodes to tolerate single node failures. If you wish to handle 2-node failures, then you need a minimum of 5 nodes in the cluster. Note that adding more nodes will also increase write latencies. 

More details on cluster operations can be found [here](../../api/cluster-operations.html).
