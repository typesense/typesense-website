---
description: "Typesense Cloud backup endpoints turn automatic cluster backups on or off, set their schedule, retention and regions, and let you list, delete or restore backups."
---

# Cluster Backups API

Backups are automatic copies of a cluster's data, taken on a schedule you choose and kept for 7, 14 or 30 days in 1 to 3 regions.
You can restore a backup to a new cluster in any region, or onto the cluster it was taken from.

:::warning
Backups are billed for the storage they use and the bandwidth it takes to upload them, as described in [Billing](#billing).
To turn them on, you need a payment method or prepaid credits on your account.
:::

## Workflow

Here's a typical sequence of API calls you'd perform when using this API:

1. [Get the backup settings](#get-backup-settings) to see the estimated monthly cost of a schedule at your cluster's data size.
2. [Turn backups on](#change-backup-settings), with the schedule, retention and regions you want.
3. [List the backups](#list-backups) the cluster keeps.
4. [Restore a backup](#restore-a-backup) to a new cluster or onto this cluster, then poll the [cloning operation](./cluster-cloning.md#get-single-cloning-operation) that runs the restore until it succeeds.

## Get backup settings

This endpoint returns the cluster's backup settings, when the next backup is due and what these settings are estimated to cost each month:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/backup-settings" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "enabled": true,
  "frequency_hours": 12,
  "retention_days": 14,
  "regions": [
    "oregon",
    "frankfurt"
  ],
  "start_hour_utc": 3,
  "restore_test_enabled": true,
  "next_backup_at": 1792465200,
  "estimated_monthly_cost": {
    "total_cents": 4305,
    "storage_cents": 1355,
    "bandwidth_cents": 2927,
    "restore_test_cents": 23,
    "backups_kept": 28,
    "uploads_per_day": 2,
    "price_per_gb_month_cents": {
      "oregon": 10,
      "frankfurt": 10
    },
    "data_size_bytes": 2420000000,
    "data_size_source": "latest_backup"
  }
}
```

A cluster that has never had backups returns the defaults: backups off, taken every 24 hours, kept for 7 days in the cluster's own region, with the monthly restore test on.
`start_hour_utc` defaults to an hour of the day picked for the cluster.

### Response Parameters

| Field                    | Description                                                                                                                                                   |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `enabled`                | Whether backups are taken on schedule.                                                                                                                        |
| `frequency_hours`        | Hours between backups: `3`, `6`, `12` or `24`.                                                                                                                |
| `retention_days`         | Days each new backup is kept: `7`, `14` or `30`.                                                                                                              |
| `regions`                | The regions each backup is stored in. Region names are the same as in [cluster regions](./cluster-management.md#regions).                                     |
| `start_hour_utc`         | The hour of the day's first backup, in UTC, from `0` to `23`. Backups are taken at this hour and every `frequency_hours` after it.                             |
| `restore_test_enabled`   | Whether the latest backup is restored to a temporary cluster once a month to check that it restores. See [Restore test](#restore-test).                        |
| `next_backup_at`         | Unix timestamp in seconds of the next scheduled backup. `null` while backups are off.                                                                          |
| `estimated_monthly_cost` | The estimated cost of these settings over a 30-day month, at the cluster's current data size. `null` when the data size is not known yet, or the cluster is terminated. |

#### `estimated_monthly_cost`

All amounts are in US cents.

| Field                      | Description                                                                                                                                         |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `total_cents`              | Storage plus bandwidth, plus the restore test when `restore_test_enabled` is `true`.                                                                |
| `storage_cents`            | The storage of the backups kept, in every region.                                                                                                   |
| `bandwidth_cents`          | The bandwidth to upload each backup to every region.                                                                                                |
| `restore_test_cents`       | The cost of the monthly restore test. It's included even when the test is off, and only counted in `total_cents` when it's on.                      |
| `backups_kept`             | How many backups are kept at a time in each region.                                                                                                 |
| `uploads_per_day`          | How many backups are taken each day.                                                                                                                |
| `price_per_gb_month_cents` | The storage price per GB-month in each region.                                                                                                      |
| `data_size_bytes`          | The data size the estimate is based on.                                                                                                             |
| `data_size_source`         | `latest_backup` when the estimate uses the size of the latest backup, or `cluster_disk` when it uses the data disk in use now, before the first backup. |

## Change backup settings

This endpoint turns backups on or off, or changes their settings.
It only changes the settings you send:

```shell
curl -X PUT --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/backup-settings" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "enabled": true,
          "frequency_hours": 12,
          "retention_days": 14,
          "regions": ["oregon", "frankfurt"],
          "start_hour_utc": 3
        }'
```

**Response:**

Here are the settings as saved, in the same format as [Get backup settings](#get-backup-settings):

```json
{
  "enabled": true,
  "frequency_hours": 12,
  "retention_days": 14,
  "regions": [
    "oregon",
    "frankfurt"
  ],
  "start_hour_utc": 3,
  "restore_test_enabled": true,
  "next_backup_at": 1792465200,
  "estimated_monthly_cost": {
    "total_cents": 4305,
    "storage_cents": 1355,
    "bandwidth_cents": 2927,
    "restore_test_cents": 23,
    "backups_kept": 28,
    "uploads_per_day": 2,
    "price_per_gb_month_cents": {
      "oregon": 10,
      "frankfurt": 10
    },
    "data_size_bytes": 2420000000,
    "data_size_source": "latest_backup"
  }
}
```

:::tip Note
You want to check `estimated_monthly_cost` from [Get backup settings](#get-backup-settings) before you turn backups on.
Each region you add stores its own copy of every backup and adds its own upload.
:::

### Request Parameters

| Parameter              | Required | Description |
|------------------------|----------|-------------|
| `enabled`              | Optional | `true` turns backups on. `false` turns them off. Backups already kept stay until they expire. |
| `frequency_hours`      | Optional | Hours between backups: `3`, `6`, `12` or `24`. |
| `retention_days`       | Optional | Days each backup is kept: `7`, `14` or `30`. A new retention only applies to new backups. Backups already taken keep the expiry they were taken with. |
| `regions`              | Optional | An array of 1 to 3 different regions to store each backup in, for example `["oregon", "frankfurt"]`. A new list only applies to new backups. |
| `start_hour_utc`       | Optional | The hour of the day's first backup, in UTC, from `0` to `23`. With `"start_hour_utc": 3` and `"frequency_hours": 12`, backups are taken at 03:00 and 15:00 UTC. |
| `restore_test_enabled` | Optional | `true` turns on the monthly [restore test](#restore-test). |

### Error Responses

The API returns HTTP `400` and leaves the settings unchanged when a parameter isn't valid.
It returns HTTP `402` when backups would be on and the account has neither a payment method nor prepaid credits.
It returns HTTP `409` when the cluster is terminated.

## List backups

This endpoint lists every backup the cluster keeps, newest first, with the regions each one is stored in and when it expires:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/backups" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "backup_in_progress": false,
  "backups": [
    {
      "id": 48213,
      "status": "succeeded",
      "kind": "scheduled",
      "size_bytes": 2420000000,
      "regions": [
        "oregon",
        "frankfurt"
      ],
      "taken_at": 1792422000,
      "completed_at": 1792422240,
      "expires_at": 1793631840,
      "deleted_at": null
    },
    {
      "id": 48177,
      "status": "succeeded",
      "kind": "scheduled",
      "size_bytes": 2418000000,
      "regions": [
        "oregon",
        "frankfurt"
      ],
      "taken_at": 1792378800,
      "completed_at": 1792379040,
      "expires_at": 1793588640,
      "deleted_at": null
    }
  ]
}
```

A backup is listed once it completes.
While one is being taken, `backup_in_progress` is `true`.
A backup is no longer listed once it expires.

### Response Parameters

| Field          | Description                                                                                         |
|----------------|-----------------------------------------------------------------------------------------------------|
| `id`           | The backup ID, used to [delete](#delete-a-backup) or [restore](#restore-a-backup) the backup.       |
| `status`       | See [`status`](#status).                                                                              |
| `kind`         | `scheduled` for a backup taken on the cluster's backup schedule. `pre_termination` for the snapshot kept when a cluster was terminated because the account used up its free tier or didn't pay its invoices (see [Bringing back a terminated cluster](#bringing-back-a-terminated-cluster)). |
| `size_bytes`   | The size of the backup.                                                                             |
| `regions`      | The regions the backup is stored in. Empty once the backup is deleted.                              |
| `taken_at`     | Unix timestamp in seconds when the backup started.                                                  |
| `completed_at` | Unix timestamp in seconds when the backup completed.                                                |
| `expires_at`   | Unix timestamp in seconds when the backup expires. An expired backup is deleted automatically.      |
| `deleted_at`   | Unix timestamp in seconds when the backup was deleted, or `null`.                                   |

#### `status`

| `status`    | Description                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------|
| `succeeded` | The backup is kept, and can be restored or deleted.                                                  |
| `deleting`  | The backup is being deleted. It can't be restored any more.                                          |
| `deleted`   | The backup was deleted. A backup you delete is listed with this status for one hour after deletion.  |

## Delete a backup

This endpoint deletes a backup from every region it's stored in.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/backups/<BackupId>" \
      -H "Accept: application/json" \
      -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": 48177,
  "status": "deleting",
  "size_bytes": 2418000000,
  "regions": [
    "oregon",
    "frankfurt"
  ],
  "taken_at": 1792378800,
  "completed_at": 1792379040,
  "expires_at": 1793588640,
  "deleted_at": null
}
```

Deletion runs in the background and takes up to a few minutes.
Sending the same request again while the backup is being deleted returns the same response.

### Error Responses

The API returns HTTP `404` when the cluster has no backup with this ID, or the backup has already been deleted.

```json
{
  "success": false,
  "message": "Resource Not Found"
}
```

## Restore a backup

This endpoint restores a backup, either to a new cluster or onto this cluster.
The restore runs in the background, as a [cloning operation](./cluster-cloning.md), and takes from a few minutes to several hours depending on the data.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/backups/<BackupId>/restore" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "target": "new_cluster",
          "region": "oregon",
          "name": "products-restored"
        }'
```

**Response:**

```json
{
  "success": true,
  "cloning_operation": {
    "id": "3d0c6f8e-6a1b-4f0e-9a52-1c7b2e4d9f13",
    "status": "pending",
    "created_at": 1792436400,
    "updated_at": 1792436400,
    "completed_at": null,
    "source_region": "oregon",
    "target_region": "oregon",
    "typesense_server_version": "29.0",
    "target_cluster_name": "products-restored",
    "target_cluster_reference_id": null,
    "notification_email_addresses": []
  }
}
```

You want to poll the [cloning operation info endpoint](./cluster-cloning.md#get-single-cloning-operation) with the returned `id` about every 60 seconds until its `status` is `succeeded`.
For a restore to a new cluster, `target_cluster_reference_id` then holds the new cluster's ID.

`source_region` is the region the backup is read from: the backup's copy in the target region when there is one, otherwise another region the backup is stored in.

:::warning IMPORTANT
A restore with `"target": "in_place"` replaces all of the cluster's data with the backup's data, and can't be undone.
The cluster can't serve searches or writes while it restores.
:::

### Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `target`  | Required | `new_cluster` or `in_place`, as described below. |
| `region`  | Optional | `new_cluster` only. The region of the new cluster. Default: this cluster's region. When the backup isn't stored in that region, it's copied there, and the copy is billed as bandwidth (see [Billing](#billing)). |
| `name`    | Optional | `new_cluster` only. A name for the new cluster. |

| `target`      | Description                                                                                                                                                                                                                   |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `new_cluster` | Restores the backup to a new single-node cluster with this cluster's RAM, CPU and GPU configuration, on the Typesense version the backup was taken on. |
| `in_place`    | Restores the backup onto this cluster, replacing all of its data. Only for a single-node cluster that is In Service, with no other operation running or scheduled. The cluster keeps its Typesense version, so the backup must have been taken on the same or an older version. |

### Error Responses

The API returns HTTP `400` and doesn't start the restore when:

- a parameter isn't valid
- for `in_place`: the cluster doesn't meet the conditions in the `target` table above
- for `new_cluster`: the Typesense version the backup was taken on is no longer available for new clusters

It returns HTTP `402` when you restore to a new cluster and the account has neither a payment method nor a positive prepaid credit balance.
It returns HTTP `403` when you restore to a new cluster and the account has unpaid invoices with failed payments.
It returns HTTP `422` when the account has reached its maximum number of clusters, or the backup has expired.
It returns HTTP `404` when the cluster has no backup with this ID that can be restored, for example one that's being deleted.

## Restore test

With `restore_test_enabled` on, we restore the latest backup to a temporary single-node cluster about once a month, and check that the restored cluster holds the backup's collections and documents.
While the test runs, the temporary cluster appears in your cluster list, named `[Automated] Backup Restore Testing on <date>`.
It's terminated automatically once the check finishes.

When the backup has no copy in the cluster's own region, copying it there is billed as bandwidth.

## When backups run

Backups are taken while the cluster is In Service, at `start_hour_utc` and every `frequency_hours` after it.
A scheduled backup is skipped, and the next one is taken at its usual time, when:

- the previous backup is still running
- the account no longer has a payment method or prepaid credits
- another operation on the cluster (a configuration change, a rolling restart or a cloning operation) is running or about to start

While a backup is running, the cluster can't be [cloned](./cluster-cloning.md#start-a-cloning-operation) and its [configuration can't be changed](./cluster-configuration-changes.md#schedule-a-configuration-change).
Those requests return HTTP `400` until it finishes.

## Backups and terminated clusters

When you [terminate a cluster](./cluster-management.md#terminate-cluster), no new backups are taken.
Its kept backups stay until they expire, unless you send `"delete_backups": true` with the terminate request, in which case they're deleted along with the cluster.

Kept backups of a terminated cluster can still be [listed](#list-backups), [deleted](#delete-a-backup) and [restored to a new cluster](#restore-a-backup).
Their storage through their expiry is billed when the cluster is terminated.
[List all clusters](./cluster-management.md#list-all-clusters) keeps returning a cluster terminated more than a week ago while it still has kept backups, but only to a key with the `backups:read` capability.

### Bringing back a terminated cluster

When a cluster is terminated because the account used up its free tier or didn't pay its invoices, we take a snapshot of its data first and keep it for 30 days at no charge.
It's listed with `"kind": "pre_termination"`.

Once the account has a payment method or enough prepaid credit for a new cluster, and it has no unpaid invoices, you can [restore it to a new cluster](#restore-a-backup) with `"target": "new_cluster"`.
The new cluster gets the terminated cluster's ID and hostname back, so your app doesn't need a config change.

A terminated cluster can be brought back only once.
The restore returns HTTP `400` when the cluster has already been brought back, or when a restore of it is still running.
It returns HTTP `402` when the account has neither a payment method nor enough prepaid credit for a new cluster, or still has unpaid invoices.

## Billing

- Storage: each backup is billed for the data it holds in each region it's stored in, per GB-month, at that region's price (`price_per_gb_month_cents`). Storage is measured daily and billed on the next invoice, as a `backup_storage` [invoice line item](./invoices.md#line-item-types) for each cluster and region.
- Bandwidth: each backup is uploaded once to each region. The upload to the first region is counted in the cluster's regular bandwidth usage. Each copy to a further region is billed as bandwidth in whole GB, at least 1 GB per copy. Restoring a backup from a region other than the target region is billed the same way.
- [Restore test](#restore-test): billed as node hours of the temporary cluster.

## Permissions

To [get backup settings](#get-backup-settings) or [list backups](#list-backups), you need a key with the `backups:read` capability.
To [change backup settings](#change-backup-settings) or [delete a backup](#delete-a-backup), you need `backups:manage`.
To [restore a backup](#restore-a-backup), you need `backups:restore`.
See [capabilities](./authentication.md#capabilities).
