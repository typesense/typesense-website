---
description: "Back up and restore Typesense data, using scheduled backups in Typesense Cloud or the snapshot API when self-hosting."
---

# Backing Up and Restoring Typesense Data

You can back up the data in a Typesense cluster and restore it later, both in Typesense Cloud and when you self-host Typesense.

[[toc]]

## Typesense Cloud

In Typesense Cloud, we can back up your cluster's data automatically on a schedule you choose, and store each backup in up to 3 regions.
You can then restore any backup when you need it.

### Turning on backups

1. Click on the "Clusters" link on the top nav bar after logging in.
2. Click on your Typesense Cloud cluster's dashboard link
3. Click on the "Backups" section in the left pane
4. Pick how often to take a backup (every 3, 6, 12 or 24 hours), how long to keep each backup (7, 14 or 30 days) and which regions to store copies in
5. Click on the "Turn On Backups" button

To take a backup right away, click on "Back Up Now" on the same page.

:::warning Note
Backups are billed for the storage they use and the bandwidth it takes to upload them.
The "Backups" page shows an estimated monthly cost for the schedule you pick.
:::

### Restoring a backup

On the "Backups" page, click on "Restore" next to the backup you want to restore.

You can restore a backup to a new cluster in any region, which gets the same RAM, CPU and GPU configuration as your existing cluster.
Your existing cluster is not affected, so you can verify the restored data before pointing your application to the new cluster's hostnames.

If you have a single-node cluster, you can also restore a backup onto the same cluster.

:::warning IMPORTANT
Restoring onto the same cluster replaces all the data in your cluster with the backup's data, and this can't be undone.
The cluster can't serve searches or writes while it restores.
:::

A restore takes from a few minutes to several hours, depending on the size of your dataset.

### Testing your backups

When you turn on the "Monthly Restore Test" setting, we restore your latest backup to a temporary cluster once a month to check that it holds the backup's collections and documents.
The temporary cluster is terminated once the check finishes.

### Managing backups programmatically

To change backup settings, take a backup or restore a backup from your own code, you want to use the Typesense Cloud [Cluster Backups API](../cloud-management-api/v1/cluster-backups.md).

## Typesense Self-Hosted

When you send documents to Typesense, it stores your data in the directory indicated by the `data-dir` <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">server configuration parameter</RouterLink> and then builds the in-memory data structures that power search.
When a Typesense process is restarted, the data is read from the data directory and the in-memory indices are rebuilt.

### Backup steps

It is unsafe to directly archive/backup Typesense's data directory, since Typesense might have open files that it's writing to, as the backup is being taken. 
Instead, you want to do the following:

1. Call the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#create-snapshot-for-backups`">Snapshot API endpoint</RouterLink>, specifying the directory to which to write the snapshot to on the server. 
2. Backup this directory to remote storage, using say `tar -czvf backup.tar.gz -C /tmp/typesense-data-snapshot .`

### Restore steps

1. Stop any running Typesense processes.
2. Delete the contents of the existing data dir. Eg: `rm -rf /var/lib/typesense/*`
3. Extract the tar gzip backup file to the data directory. Eg: `cd /var/lib/typesense ; tar -xf backup.tar.gz .`
4. Start the Typesense process again.

Typesense will then read the snapshot from the data dir and build the in-memory index.

