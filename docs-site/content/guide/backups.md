# Backing Up and Restoring Typesense Data

When you send documents to Typesense, it stores your data in the directory indicated by the `data-dir` <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration`">server configuration parameter</RouterLink> and then builds the in-memory data structures that power search.
When a Typesense process is restarted, the data is read from the data directory and the in-memory indices are rebuilt.   

:::tip
This article only applies when you self-host Typesense.
:::

## Backup steps

It is unsafe to directly archive/backup Typesense's data directory, since Typesense might have open files that it's writing to, as the backup is being taken. 
Instead, you want to do the following:

1. Call the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#create-snapshot-for-backups`">Snapshot API endpoint</RouterLink>, specifying the directory to which to write the snapshot to on the server. 
2. Backup this directory to remote storage, using say `tar -czvf backup.tar.gz -C /tmp/typesense-data-snapshot .`

## Restore steps

1. Stop any running Typesense processes.
2. Delete the contents of the existing data dir. Eg: `rm -rf /var/lib/typesense/*`
3. Extract the tar gzip backup file to the data directory. Eg: `cd /var/lib/typesense ; tar -xf backup.tar.gz .`
4. Start the Typesense process again.

Typesense will then read the snapshot from the data dir and build the in-memory index.


