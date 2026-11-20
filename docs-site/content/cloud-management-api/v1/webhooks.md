---
description: "Typesense Cloud webhooks send a signed HTTPS request to your application when a cluster changes status, is reconfigured or restarted or runs low on memory, disk or CPU."
---

# Webhooks API

Webhooks let Typesense Cloud notify your application when something happens to one of your clusters: a status change, a configuration change or rolling restart, a node replacement or a cluster running low on memory, disk or CPU.
So instead of polling [Get single cluster](./cluster-management.md#get-single-cluster), your application can react when it happens.
To catch up on events you missed, or to read them without running an endpoint, [list events](#list-events).

Each webhook endpoint you add receives every event for every cluster on the account, or only the [event types](#event-types) you pick for it.
Each request is signed in the [Standard Webhooks](https://www.standardwebhooks.com/) format, so you can verify it with an existing library.

## Workflow

1. [Add a webhook endpoint](#add-a-webhook-endpoint) from the dashboard or the API, and save its signing secret.
2. In your endpoint, [verify the signature](#verify-the-signature) of each request and answer with a `2xx`.
3. [Send a test event](#send-a-test-event) to check your handler end to end.
4. If deliveries fail, [read the delivery](#get-a-delivery) to see what your endpoint answered, and [resend](#resend-a-delivery) it once it's fixed.
5. If your endpoint has been down, you want to [list events](#list-events) from the last one you handled to catch up.

## Add a webhook endpoint

From the Typesense Cloud dashboard:

1. Switch to the account you want to receive events for, using the account switcher on the top right.
2. Navigate to your [account page](https://cloud.typesense.org/account), and click on "Manage webhooks" next to "Want to know when your clusters change?".
3. Enter your endpoint's URL.
4. Under "Which events?", keep "All events", or pick "Let me choose" and tick the event types you want.
5. Click on "+ Add Webhook Endpoint".
6. Copy the signing secret, since this is the only time it's shown in full.

Or with the API:

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/account/webhooks" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "url": "https://hooks.example.com/typesense",
          "description": "Cluster sync",
          "event_types": ["cluster.in_service", "cluster.low_memory"]
        }'
```

**Response:**

```json
{
  "id": "whe_ddqa9oa6kwdszfcfezfh",
  "url": "https://hooks.example.com/typesense",
  "description": "Cluster sync",
  "event_types": ["cluster.in_service", "cluster.low_memory"],
  "status": "enabled",
  "disabled_at": null,
  "failing_since": null,
  "paused_until": null,
  "signing_secret_last4": "QNcg",
  "created_at": 1795467000,
  "signing_secret": "whsec_yhWNnZaRm7es4PeSpqq...PbQNcg="
}
```

:::warning
The `signing_secret` is only returned in this response. If you lose it, delete the endpoint and add it again.
:::

An account can have up to 5 webhook endpoints.
You can [change an endpoint's event types](#update-a-webhook-endpoint) later. To change its URL, delete it and add a new one.

### Request Parameters

| Parameter     | Required | Description |
|---------------|----------|-------------|
| `url`         | Required | An `https` URL on the default port (443). Its host name needs an IPv4 address, and must resolve only to public IP addresses. |
| `description` | Optional | A note to tell your endpoints apart. |
| `event_types` | Optional | The [event types](#event-types) the endpoint receives, as an array. Leave it out, or send `null`, to receive every event type, including ones we add later. |

### Rotating the signing secret

To rotate the secret, add a second endpoint with the same URL, switch your application to the new secret, then delete the old endpoint.
Both endpoints receive the same events with the same `webhook-id` in the meantime, so your handler can [skip the duplicates](#duplicates-and-ordering).

## List webhook endpoints

This endpoint lists the account's webhook endpoints, oldest first.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/account/webhooks" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "webhooks": [
    {
      "id": "whe_ddqa9oa6kwdszfcfezfh",
      "url": "https://hooks.example.com/typesense",
      "description": "Cluster sync",
      "event_types": ["cluster.in_service", "cluster.low_memory"],
      "status": "enabled",
      "disabled_at": null,
      "failing_since": null,
      "paused_until": null,
      "signing_secret_last4": "QNcg",
      "created_at": 1795467000
    }
  ]
}
```

### Response Parameters

| Field                  | Description |
|------------------------|-------------|
| `event_types`          | The [event types](#event-types) the endpoint receives, or `null` for every event type. |
| `status`               | `enabled`, or `disabled` when every delivery failed for 5 days. See [Retries](#retries). |
| `disabled_at`          | When the endpoint was disabled, or `null`. |
| `failing_since`        | When deliveries to the endpoint started failing, or `null` while its last delivery succeeded. |
| `paused_until`         | Set when the endpoint answered with a `429` or `503`: deliveries resume after this time. |
| `signing_secret_last4` | The last 4 characters of the signing secret, to tell endpoints apart. |

## Update a webhook endpoint

This endpoint changes which event types a webhook endpoint receives from now on. Events already waiting to be sent to it are still sent.

From the dashboard, open the endpoint from the Webhooks page and click on "Edit Events".

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "event_types": ["cluster.in_service", "cluster.low_memory", "cluster.low_disk"]
        }'
```

The response is the endpoint, in the same format as each endpoint in [List webhook endpoints](#list-webhook-endpoints).

### Request Parameters

| Parameter     | Required | Description |
|---------------|----------|-------------|
| `event_types` | Required | The [event types](#event-types) the endpoint receives, as an array, or `null` to receive every event type, including ones we add later. |

An unknown event type or an empty array is refused with a `422`.
[Test events](#send-a-test-event) can be sent for any type, whichever ones the endpoint receives.

## Delete a webhook endpoint

This endpoint deletes a webhook endpoint and its deliveries. Events still waiting to be sent to it are not sent.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

The response is the deleted endpoint, in the same format as each endpoint in [List webhook endpoints](#list-webhook-endpoints).

## Re-enable a webhook endpoint

This endpoint turns a disabled webhook endpoint back on.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>/enable" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

The response is the endpoint, in the same format as each endpoint in [List webhook endpoints](#list-webhook-endpoints).

## Receive events

Each event is sent to your endpoint as a `POST` request with a JSON body.
We call each event sent to an endpoint a delivery.

### Request headers

| Header              | Description |
|---------------------|-------------|
| `webhook-id`        | The event's ID, for example `evt_33a3b962973c3d723f858ccb`. It stays the same on every retry and on every endpoint. |
| `webhook-timestamp` | When this attempt was sent, as a Unix timestamp in seconds. |
| `webhook-signature` | `v1,` followed by the signature, for example `v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=`. |
| `Content-Type`      | `application/json` |
| `User-Agent`        | `Typesense-Cloud-Webhooks/1` |

### Verify the signature

You want to verify every request before you act on it, using the official [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) library for your language and your endpoint's signing secret.
Pass the raw request body exactly as you received it: parsing the JSON and serializing it again changes the bytes, and the signature won't match.

The libraries also reject a request whose `webhook-timestamp` is more than 5 minutes away from your server's clock, so a captured request can't be replayed later.
Since `webhook-timestamp` is the time of each attempt, retries pass this check.

Here's an example in Node.js, with Express and the [`standardwebhooks`](https://www.npmjs.com/package/standardwebhooks) package:

```js
const express = require('express')
const { Webhook } = require('standardwebhooks')

const app = express()
const webhook = new Webhook(process.env.TYPESENSE_WEBHOOK_SECRET)

app.post('/typesense', express.raw({ type: 'application/json' }), (req, res) => {
  let event
  try {
    event = webhook.verify(req.body, req.headers)
  } catch (error) {
    return res.status(400).send('Invalid signature')
  }

  console.log(event.type, event.data.cluster.id)
  res.sendStatus(200)
})
```

In Python, with Flask and the [`standardwebhooks`](https://pypi.org/project/standardwebhooks/) package:

```python
import os

from flask import Flask, request
from standardwebhooks import Webhook, WebhookVerificationError

app = Flask(__name__)
webhook = Webhook(os.environ["TYPESENSE_WEBHOOK_SECRET"])


@app.post("/typesense")
def typesense_webhook():
    try:
        event = webhook.verify(request.get_data(), dict(request.headers))
    except WebhookVerificationError:
        return "Invalid signature", 400

    print(event["type"], event["data"]["cluster"]["id"])
    return "", 200
```

In Ruby, with Rails and the [`standardwebhooks`](https://rubygems.org/gems/standardwebhooks) gem:

```ruby
class TypesenseWebhooksController < ActionController::API
  def create
    webhook = StandardWebhooks::Webhook.new(ENV.fetch('TYPESENSE_WEBHOOK_SECRET'))
    event = webhook.verify(request.raw_post, {
      'webhook-id' => request.headers['webhook-id'],
      'webhook-timestamp' => request.headers['webhook-timestamp'],
      'webhook-signature' => request.headers['webhook-signature']
    })

    Rails.logger.info("#{event['type']} #{event.dig('data', 'cluster', 'id')}")
    head :ok
  rescue StandardWebhooks::WebhookVerificationError
    head :bad_request
  end
end
```

:::tip Note
In another language, you can compute the signature yourself: base64-decode the part of the secret after `whsec_` and compute an HMAC-SHA256 with it over `<webhook-id>.<webhook-timestamp>.<raw body>`.
Base64-encode the result and compare it in constant time with the part of `webhook-signature` after `v1,`.
:::

### Respond with a 2xx

Any `2xx` status counts as delivered.
Your endpoint needs to answer within 15 seconds, so if handling an event takes longer, you want to save it and process it after you respond.

Redirects are not followed, so a `3xx` counts as a failed attempt.

### Retries

If an attempt fails (a non-`2xx` status, a timeout or a connection error), we try again.
Each event gets up to 10 attempts, at these times after the first one: 1 minute, 5 minutes, 30 minutes, 2 hours, 6 hours, 12 hours, 24 hours, 48 hours and 72 hours.
After the last attempt fails, the delivery is marked `failed`.

If your endpoint answers with a `429` or `503`, we pause all deliveries to it for the time in its `Retry-After` header (at most 1 hour), or for 1 minute if there's no `Retry-After`.
That attempt still counts towards the 10.

If every delivery to an endpoint fails for 5 days, we disable it and email the account's cluster alert recipients.
The endpoint's page in the dashboard shows when it started failing and when it will be disabled.
Any successful delivery, including a [test event](#send-a-test-event), resets the 5 days.
The deliveries that were still waiting are marked `failed`.
You can [re-enable it](#re-enable-a-webhook-endpoint) from the API or from the endpoint's page in the dashboard.
Events from while it was disabled aren't sent again, so you want to [list events](#list-events) from the last one you handled to catch up.

### Duplicates and ordering

Events are delivered at least once. For example, if your endpoint handles a request but its response times out, you get the event again.
You want to store the `webhook-id` of each event you've handled, and skip an event whose ID you've already seen.

Events to an endpoint are sent one at a time, oldest first.
But a retry can arrive after a newer event.
To tell which is newer, compare the events' `created_at`, or the `updated_at` of the configuration change or restart they carry.
When you need a resource's current state, for example before you act on a `cluster.suspended` event, you want to read it with the API: [Get single cluster](./cluster-management.md#get-single-cluster), [Get single configuration change](./cluster-configuration-changes.md#get-single-configuration-change) or [Get single rolling restart](./cluster-restarts.md#get-single-rolling-restart).

## Event payload

Every event has this shape (`cluster` is shortened here, see the [full example](#cluster-status)):

```json
{
  "id": "evt_33a3b962973c3d723f858ccb",
  "type": "cluster.in_service",
  "created_at": 1795467600,
  "initiated_by": {
    "user_name": "Jane Doe",
    "user_type": "User"
  },
  "data": {
    "cluster": { ... },
    "old_status": "initializing"
  }
}
```

| Field          | Description |
|----------------|-------------|
| `id`           | Same as `webhook-id`. |
| `type`         | The [event type](#event-types). |
| `created_at`   | When the event happened, as a Unix timestamp in seconds. |
| `initiated_by` | Who caused the event. `user_type` is `User` (with the person's name in `user_name`), `API Key` (with the key's name) or `Typesense` (with a `null` name) for changes made by Typesense, such as a suspension or a node replacement. |
| `test`         | `true` for a [test event](#send-a-test-event). It's left out of real events. |
| `data`         | The resources the event is about, in the same JSON the Management API returns for them. Every event carries `cluster`, the same as [Get single cluster](./cluster-management.md#get-single-cluster) returns at the time of the event. |

## Event types

### Cluster status

| Event                      | When it's sent |
|----------------------------|----------------|
| `cluster.provisioning`     | A new cluster is being provisioned. |
| `cluster.initializing`     | The cluster's nodes are up, and Typesense is being set up on them. |
| `cluster.in_service`       | The cluster is ready to use, or it was resumed after a suspension. |
| `cluster.suspended`        | The cluster was suspended due to billing issues. |
| `cluster.deprovisioning`   | The cluster is being terminated. |
| `cluster.terminated`       | The cluster was terminated. |

`data` carries the `cluster` and its `old_status`. `old_status` is `null` for a cluster that's new to the account.
See [`status`](./cluster-management.md#status) for what each status means.

Here's an example:

```json
{
  "id": "evt_33a3b962973c3d723f858ccb",
  "type": "cluster.in_service",
  "created_at": 1795467600,
  "initiated_by": {
    "user_name": "API Key: Deploy pipeline",
    "user_type": "API Key"
  },
  "data": {
    "cluster": {
      "id": "nuj9s7k6vplrg15yp",
      "name": null,
      "external_reference": null,
      "memory": "0.5_gb",
      "vcpu": "2_vcpus_1_hr_burst_per_day",
      "gpu": "no",
      "high_performance_disk": "no",
      "disk_gb_per_node": 24,
      "extra_disk_gb_per_node": 16,
      "typesense_server_version": "30.1",
      "typesense_server_version_end_of_support_at": null,
      "high_availability": "yes",
      "high_availability_node_count": 3,
      "search_delivery_network": "off",
      "load_balancing": "yes",
      "regions": [
        "mumbai",
        "mumbai",
        "mumbai"
      ],
      "region_node_counts": {
        "mumbai": 3
      },
      "auto_upgrade_capacity": null,
      "cpu_burst": null,
      "write_backlog": null,
      "hostnames": {
        "load_balanced": "nuj9s7k6vplrg15yp.a1.typesense.net",
        "nodes": [
          "nuj9s7k6vplrg15yp-1.a1.typesense.net",
          "nuj9s7k6vplrg15yp-2.a1.typesense.net",
          "nuj9s7k6vplrg15yp-3.a1.typesense.net"
        ]
      },
      "usage": {
        "runtime_hours": 1,
        "used_bandwidth_kb": {
          "last_7_days": {}
        }
      },
      "provisioned_by": {
        "user_name": "API Key: Deploy pipeline",
        "user_type": "API Key"
      },
      "provisioned_at": 1795467000,
      "status": "in_service"
    },
    "old_status": "initializing"
  }
}
```

The rest of the examples on this page shorten `cluster` to `{ ... }`.

### Configuration changes and rolling restarts

| Event                                  | When it's sent |
|----------------------------------------|----------------|
| `configuration_change.pending`         | A [configuration change](./cluster-configuration-changes.md) was scheduled. |
| `configuration_change.in_progress`     | The configuration change started. |
| `configuration_change.progressed`      | A node was changed, or the change's snapshot finished. |
| `configuration_change.succeeded`       | The configuration change finished. |
| `configuration_change.failed`          | The configuration change failed. |
| `configuration_change.canceled`        | The configuration change was canceled before it started. |
| `restart.pending`                      | A [rolling restart](./cluster-restarts.md) was scheduled. |
| `restart.in_progress`                  | The rolling restart started. |
| `restart.progressed`                   | A node was restarted. |
| `restart.succeeded`                    | Every node was restarted. |
| `restart.failed`                       | The rolling restart failed. |
| `restart.canceled`                     | The rolling restart was canceled before it started. |

`data` carries the `cluster`, the `configuration_change` or `restart` (the same JSON as [Get single configuration change](./cluster-configuration-changes.md#get-single-configuration-change) and [Get single rolling restart](./cluster-restarts.md#get-single-rolling-restart)) and its `old_status`, which is `null` when the change was just scheduled.

A `progressed` event is sent when `snapshot_status` becomes `completed` or `nodes_changed` goes up, and for a rolling restart when `nodes_restarted` goes up. It has no `old_status`, since the status is `in_progress`.

A Typesense Server version upgrade is a configuration change too, so it's sent as `configuration_change.succeeded` with the new version in `new_typesense_server_version`.

Here's an example of a configuration change that finished:

```json
{
  "id": "evt_a0f42f2a012e9204d8e47845",
  "type": "configuration_change.succeeded",
  "created_at": 1795474800,
  "initiated_by": {
    "user_name": "Jane Doe",
    "user_type": "User"
  },
  "data": {
    "cluster": { ... },
    "configuration_change": {
      "id": "ecf1d570-7f49-47ef-b648-41ccf7eaf5d2",
      "status": "succeeded",
      "created_at": 1795468000,
      "updated_at": 1795474800,
      "perform_change_at": 1795470000,
      "completed_at": 1795474800,
      "old_memory": "0.5_gb",
      "old_vcpu": "2_vcpus_1_hr_burst_per_day",
      "old_gpu": null,
      "old_high_performance_disk": null,
      "old_typesense_server_version": "30.1",
      "old_high_availability": "yes",
      "old_high_availability_node_count": 3,
      "old_search_delivery_network": "off",
      "old_load_balancing": "yes",
      "old_region_node_counts": {
        "mumbai": 3
      },
      "old_disk_gb_per_node": 24,
      "new_memory": "1_gb",
      "new_vcpu": "2_vcpus_2_hr_burst_per_day",
      "new_gpu": null,
      "new_high_performance_disk": null,
      "new_typesense_server_version": "30.1",
      "new_high_availability": "yes",
      "new_high_availability_node_count": 3,
      "new_search_delivery_network": "off",
      "new_load_balancing": "yes",
      "new_region_node_counts": {
        "mumbai": 3
      },
      "new_disk_gb_per_node": 24,
      "nodes_total": 3,
      "nodes_changed": 3,
      "snapshot_status": null,
      "estimated_seconds_remaining": null,
      "estimate_based_on_change_completed_at": null,
      "notification_email_addresses": [
        "email@example.com"
      ]
    },
    "old_status": "in_progress"
  }
}
```

And a rolling restart that finished:

```json
{
  "id": "evt_26af0b1eccb464a24ec9b3e6",
  "type": "restart.succeeded",
  "created_at": 1795481120,
  "initiated_by": {
    "user_name": "Jane Doe",
    "user_type": "User"
  },
  "data": {
    "cluster": { ... },
    "restart": {
      "id": "862c8506-2653-4b95-baca-dcaf61f62531",
      "status": "succeeded",
      "perform_restart_at": 1795479200,
      "nodes_total": 3,
      "nodes_restarted": 3,
      "created_at": 1795476000,
      "updated_at": 1795481120,
      "completed_at": 1795481120,
      "notification_email_addresses": [
        "email@example.com"
      ]
    },
    "old_status": "in_progress"
  }
}
```

### Node replacements

`cluster.node_replaced` is sent when Typesense replaces one of the cluster's nodes, for example to recover an unhealthy node.
Nodes replaced as part of a configuration change are covered by that change's events, so they don't send this event.

`data` carries only the `cluster`:

```json
{
  "id": "evt_8720b70b01e9f072198ca801",
  "type": "cluster.node_replaced",
  "created_at": 1795485600,
  "initiated_by": {
    "user_name": null,
    "user_type": "Typesense"
  },
  "data": {
    "cluster": { ... }
  }
}
```

### Capacity

These events are sent when a cluster starts running low on a resource, and again when it recovers.
Each one carries a field with the current value, which is `null` (or `ok` for `cpu_burst`) when the condition has cleared.

| Event                   | When it's sent | Field in `data` |
|-------------------------|----------------|-----------------|
| `cluster.low_memory`    | The cluster's free memory has stayed below a threshold for its memory size, or has recovered. | `low_memory` |
| `cluster.low_disk`      | The cluster's free disk space has dropped below a threshold for its disk size, or has recovered. | `low_disk` |
| `cluster.disk_full`     | Writes were rejected because the cluster ran out of disk space, or this has stopped. | `disk_full` |
| `cluster.cpu_burst`     | A cluster on a burst vCPU option is about to run out of burst CPU, has run out or has burst CPU again. | `cpu_burst` and `old_cpu_burst` |
| `cluster.write_backlog` | Writes are being rejected because the cluster's write queue has grown past what it can keep up with, or the queue has drained. | `write_backlog` and `old_write_backlog` |

`cpu_burst` and `write_backlog` have the same values as the cluster's [`cpu_burst`](./cluster-management.md#cpu-burst) and [`write_backlog`](./cluster-management.md#write-backlog) fields.
`cluster.low_memory`, `cluster.low_disk` and `cluster.disk_full` can arrive up to 12 hours after the condition starts.

Here's `cluster.low_memory` when it starts:

```json
{
  "id": "evt_f275740f82900e706c2234a6",
  "type": "cluster.low_memory",
  "created_at": 1795492800,
  "initiated_by": {
    "user_name": null,
    "user_type": "Typesense"
  },
  "data": {
    "cluster": { ... },
    "low_memory": {
      "since": 1795492800,
      "free_memory_bytes": 52428800,
      "threshold_bytes": 104857600,
      "new_memory": "1_gb",
      "new_vcpu": "2_vcpus_2_hr_burst_per_day",
      "price_per_node_hour_cents": 4
    }
  }
}
```

And when it clears, `"low_memory": null`.

| `low_memory` field          | Description |
|-----------------------------|-------------|
| `since`                     | When the condition was detected, as a Unix timestamp in seconds. |
| `free_memory_bytes`         | The free memory when it was detected. |
| `threshold_bytes`           | The free memory below which the cluster is considered low on memory. |
| `new_memory` and `new_vcpu` | The next larger configuration you could [change the cluster to](./cluster-configuration-changes.md#schedule-a-configuration-change). Left out when there's no larger size. |
| `price_per_node_hour_cents` | The price per node per hour of that configuration, in cents. Left out with `new_memory`. |

`cluster.low_disk` carries `since`, `free_disk_bytes` and `threshold_bytes`:

```json
"low_disk": {
  "since": 1795492800,
  "free_disk_bytes": 2147483648,
  "threshold_bytes": 4294967296
}
```

`cluster.disk_full` carries `since`, when the first write was rejected for lack of disk space in the 12 hours before it was detected, and `rejected_write_count`, the number of writes rejected since then:

```json
"disk_full": {
  "since": 1795492800,
  "rejected_write_count": 12
}
```

`cluster.cpu_burst` carries the new and the previous value, plus `new_memory`, `new_vcpu` and `price_per_node_hour_cents` for a configuration with more CPU when there is one:

```json
"data": {
  "cluster": { ... },
  "cpu_burst": "low",
  "old_cpu_burst": "ok",
  "new_memory": "2_gb",
  "new_vcpu": "2_vcpus_4_hr_burst_per_day",
  "price_per_node_hour_cents": 7
}
```

`cluster.write_backlog` carries the new and the previous value:

```json
"data": {
  "cluster": { ... },
  "write_backlog": {
    "kind": "single_document_writes",
    "since": 1795492800
  },
  "old_write_backlog": null
}
```

## Send a test event

This endpoint sends one event of the type you pick to your endpoint right away.
You can also do this with "Send Test Event" on the endpoint's page in the dashboard.

A test event is built from one of your own clusters (and its latest configuration change or rolling restart, for those event types).
Its body has `"test": true` and its `webhook-id` starts with `evt_test_`, so your handler can skip any side effects.
A test event isn't retried.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>/test" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "type": "cluster.in_service"
        }'
```

**Response:**

```json
{
  "event_id": "evt_test_jhdvcpbjuwafinqvzecfxoyc",
  "event_type": "cluster.in_service",
  "status": "delivered",
  "attempts": 0,
  "next_attempt_at": null,
  "last_attempted_at": 1795467700,
  "last_http_status": 200,
  "last_error_kind": null,
  "delivered_at": 1795467700,
  "test": true,
  "created_at": 1795467700,
  "body": {
    "id": "evt_test_jhdvcpbjuwafinqvzecfxoyc",
    "type": "cluster.in_service",
    "created_at": 1795467700,
    "initiated_by": {
      "user_name": null,
      "user_type": "Typesense"
    },
    "test": true,
    "data": {
      "cluster": { ... },
      "old_status": "initializing"
    }
  },
  "delivery_attempts": [
    {
      "attempted_at": 1795467700,
      "http_status": 200,
      "error_kind": null,
      "duration_ms": 84,
      "response_body": "{\"received\":true}",
      "manual": true
    }
  ]
}
```

The response is the test delivery after its attempt, in the same format as [Get a delivery](#get-a-delivery).

### Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `type`    | Required | Any of the [event types](#event-types). |

Test events and [resends](#resend-a-delivery) share a limit of 600 per endpoint per hour, and 3,000 per account. An endpoint that answers slowly can also be sent at most 7.5 minutes of them per hour, counted by how long each one waited for its response, and an account at most 37.5 minutes across its endpoints, deleted ones included.

## List deliveries

This endpoint lists a webhook endpoint's last 100 deliveries from the past 15 days, newest first.
Pass `status` to list the last 100 with that status, for example every `failed` delivery after a busy hour.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>/deliveries?status=failed" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

### Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `status`  | No       | `pending`, `delivered` or `failed`. Lists only deliveries with this status. |

**Response:**

```json
{
  "deliveries": [
    {
      "event_id": "evt_a0f42f2a012e9204d8e47845",
      "event_type": "configuration_change.succeeded",
      "status": "pending",
      "attempts": 3,
      "next_attempt_at": 1795476600,
      "last_attempted_at": 1795475100,
      "last_http_status": 500,
      "last_error_kind": null,
      "delivered_at": null,
      "test": false,
      "created_at": 1795474800
    }
  ]
}
```

### Response Parameters

| Field             | Description |
|-------------------|-------------|
| `event_id`        | The event's `webhook-id`. Use it to [get](#get-a-delivery) or [resend](#resend-a-delivery) the delivery. |
| `status`          | `pending`: waiting for its next attempt. `delivered`: your endpoint answered with a `2xx`. `failed`: every attempt failed, or the endpoint was disabled. |
| `attempts`        | How many of the 10 scheduled [attempts](#retries) were made. Test events and resends aren't counted. |
| `next_attempt_at` | When the next attempt is due, or `null`. |
| `last_http_status`| The HTTP status of the last attempt, or `null` if none came back. |
| `last_error_kind` | Why the last attempt failed when no HTTP status came back. See [`error_kind`](#error-kind). |

## Get a delivery

Use this endpoint to debug a failing webhook endpoint. It returns a delivery with the exact body that's sent on every attempt, and the result of each attempt, including what your endpoint answered.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>/deliveries/<EventId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "event_id": "evt_a0f42f2a012e9204d8e47845",
  "event_type": "configuration_change.succeeded",
  "status": "pending",
  "attempts": 3,
  "next_attempt_at": 1795476600,
  "last_attempted_at": 1795475100,
  "last_http_status": 500,
  "last_error_kind": null,
  "delivered_at": null,
  "test": false,
  "created_at": 1795474800,
  "body": {
    "id": "evt_a0f42f2a012e9204d8e47845",
    "type": "configuration_change.succeeded",
    "created_at": 1795474800,
    "initiated_by": {
      "user_name": "Jane Doe",
      "user_type": "User"
    },
    "data": {
      "cluster": { ... },
      "configuration_change": { ... },
      "old_status": "in_progress"
    }
  },
  "delivery_attempts": [
    {
      "attempted_at": 1795474800,
      "http_status": null,
      "error_kind": "timeout",
      "duration_ms": 15000,
      "response_body": null,
      "manual": false
    },
    {
      "attempted_at": 1795474860,
      "http_status": 500,
      "error_kind": null,
      "duration_ms": 112,
      "response_body": "{\"error\":\"database unavailable\"}",
      "manual": false
    },
    {
      "attempted_at": 1795475100,
      "http_status": 500,
      "error_kind": null,
      "duration_ms": 98,
      "response_body": "{\"error\":\"database unavailable\"}",
      "manual": false
    }
  ]
}
```

### Response Parameters

| Field               | Description |
|---------------------|-------------|
| `body`              | The event, exactly as it's sent on every attempt. |
| `delivery_attempts` | Every attempt, oldest first. |

Each attempt has:

| Field           | Description |
|-----------------|-------------|
| `attempted_at`  | When the attempt was made. |
| `http_status`   | The HTTP status your endpoint answered with, or `null` if none came back. |
| `error_kind`    | Why the attempt failed when no HTTP status came back. See [`error_kind`](#error-kind). |
| `duration_ms`   | How long the attempt took. |
| `response_body` | The start of your endpoint's response body. |
| `manual`        | `true` for a test event or a [resend](#resend-a-delivery). |

The other fields are the same as in [List deliveries](#list-deliveries).

#### `error_kind`

| `error_kind`                | Description |
|-----------------------------|-------------|
| `timeout`                   | Your endpoint didn't answer within 15 seconds. |
| `connection_refused`        | Nothing accepted the connection on port 443 of your endpoint's host, for example because no server is listening. |
| `connection_reset`          | Your endpoint's server reset or closed the connection before it answered. |
| `connection`                | We couldn't connect to your endpoint for another reason, like the network being unreachable. |
| `dns`                       | Your endpoint's hostname didn't resolve. |
| `non_public_address`        | Your endpoint's hostname resolved to a private IP address, so we didn't send the event. |
| `tls_certificate_expired`   | Your endpoint's TLS certificate has expired. |
| `tls_hostname_mismatch`     | Your endpoint's TLS certificate is for a different hostname than the one in your endpoint URL. |
| `tls_untrusted_certificate` | Your endpoint's TLS certificate isn't signed by a trusted certificate authority, for example a self-signed certificate. |
| `tls`                       | Your endpoint's TLS handshake failed for another reason. |
| `bad_response`              | Your endpoint's response wasn't valid HTTP, or its headers were too large. |

## Resend a delivery

This endpoint sends a delivery once more right away, with the same body and `webhook-id`, signed with the current time.
You can also do this with "Resend" on the delivery's page in the dashboard.

A `pending` delivery keeps its retry schedule. A `failed` delivery becomes `delivered` if your endpoint answers with a `2xx`.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/account/webhooks/<WebhookId>/deliveries/<EventId>/resend" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

The response is the delivery with the new attempt added, in the same format as [Get a delivery](#get-a-delivery).

Resends and [test events](#send-a-test-event) share a limit of 600 per endpoint per hour, and 3,000 per account. An endpoint that answers slowly can also be sent at most 7.5 minutes of them per hour, counted by how long each one waited for its response, and an account at most 37.5 minutes across its endpoints, deleted ones included.

## List events

Use this endpoint to catch up on events your webhook endpoint missed, for example while it was down or [disabled](#retries), or to read events without running an endpoint at all.
It lists the account's cluster events from the past 30 days, oldest first, each exactly as a webhook sends it, with the same ID.
To see what happened to one delivery, [get the delivery](#get-a-delivery) instead.

To catch up, you want to pass the `created_at` of the last event you handled as `created_after`, and skip any event whose `id` you've already handled.
While `has_more` is `true`, you want to list the next page with `after` set to the `id` of the last event in the page.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/account/events?created_after=1795467600" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

### Request Parameters

| Parameter       | Required | Description |
|-----------------|----------|-------------|
| `created_after` | No       | A Unix timestamp in seconds. Lists events created at or after it. |
| `after`         | No       | An event `id` from the previous page. Lists the events after it. |
| `per_page`      | No       | Events per page, from 1 to 100. Defaults to 25. |

**Response:**

```json
{
  "events": [
    {
      "id": "evt_33a3b962973c3d723f858ccb",
      "type": "cluster.in_service",
      "created_at": 1795467600,
      "initiated_by": {
        "user_name": "Jane Doe",
        "user_type": "User"
      },
      "data": {
        "cluster": { ... },
        "old_status": "initializing"
      }
    }
  ],
  "has_more": false
}
```

### Response Parameters

| Field      | Description |
|------------|-------------|
| `events`   | Events in the [event payload](#event-payload) format. [Test events](#send-a-test-event) aren't listed. |
| `has_more` | `true` when more events are waiting. |

An event shows up here a few seconds after it happens.
If the event you pass as `after` is older than 30 days, the response is a `410`: list again with `created_after`.

## Error Responses

| Status | When |
|--------|------|
| `400`  | A required parameter is missing. For [list events](#list-events): a parameter isn't valid. |
| `404`  | The webhook endpoint or delivery doesn't exist on this account. |
| `410`  | For [list events](#list-events): the `after` event is older than 30 days. |
| `422`  | A parameter isn't valid, or the account already has 5 webhook endpoints. |
| `422`  | For a test event or a resend: the webhook endpoint is disabled, had 30 test events and resends in the past hour or is still receiving another one. For a test event: the account has no cluster, configuration change or rolling restart to build it from. |

## Permissions

To [list webhook endpoints](#list-webhook-endpoints), [list deliveries](#list-deliveries) or [get a delivery](#get-a-delivery), you need a key with the `webhooks:read` capability.
To [add](#add-a-webhook-endpoint), [delete](#delete-a-webhook-endpoint) or [re-enable](#re-enable-a-webhook-endpoint) an endpoint, [send a test event](#send-a-test-event) or [resend a delivery](#resend-a-delivery), you need `webhooks:manage`.
To [list events](#list-events), you need `clusters:read`.
See [capabilities](./authentication.md#capabilities).

AI agents connected through the Typesense Cloud MCP server can list events.
They can also list webhook endpoints and read their deliveries, but can't be given `webhooks:manage`.
