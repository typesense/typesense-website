---
description: "Typesense Cloud dashboard link endpoints let your app send a person into one cluster's dashboard, without a Typesense Cloud account."
---

# Dashboard Links API

Dashboard links let you send a person from your own app into one cluster's Typesense Cloud dashboard.
This is helpful when you want to give someone access to particular portions of a cluster's dashboard, without them needing access to other parts of the dashboard or to other clusters.
The person doesn't need a Typesense Cloud account.

## Workflow

1. When the person clicks a link in your app, your server [creates a dashboard link](#create-a-dashboard-link) for their cluster.
2. Your server redirects their browser to the `url` in the response, within 60 seconds. Open it in a top-level window or tab: the dashboard can't be embedded in a frame.
3. The link opens once. The person lands on the cluster's dashboard, on the page you chose with `dashboard_path`.
4. The session lasts 60 minutes. When it ends, or the link is revoked, the next page the person opens sends their browser to your `return_url`, with `cluster_id` and `dashboard_path` (the page they were on) added to the query string. So your app can create a new link to the same page.

If you don't set a `return_url`, the person sees a page saying the link has expired.

:::warning Note
Opening a dashboard link signs out any Typesense Cloud user who is signed in on that browser. They're asked to confirm first.
:::

## Create a dashboard link

This endpoint creates a link that opens a cluster's dashboard for one person, with the [permissions](#link-permissions) you give them. The cluster must be in service.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/dashboard-links" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "permissions": ["data:view", "data:search", "data:manage_synonyms", "data:manage_overrides"],
          "return_url": "https://app.example.com/search-settings",
          "dashboard_path": "/collections",
          "label": "user-1234"
        }'
```

**Response:**

```json
{
  "id": "Rk7mQ2vX9pLs4TnW8bYc3dHf",
  "permissions": [
    "data:view",
    "data:search",
    "data:manage_synonyms",
    "data:manage_overrides"
  ],
  "preset": null,
  "state": "waiting",
  "label": "user-1234",
  "return_url": "https://app.example.com/search-settings",
  "dashboard_path": "/collections",
  "openable_until": "2026-10-28T15:04:05Z",
  "opened_at": null,
  "opened_ip": null,
  "session_expires_at": null,
  "revoked_at": null,
  "created_at": "2026-10-28T15:03:05Z",
  "url": "https://cloud.typesense.org/clusters/<ClusterId>/dash#d9Xc2..."
}
```

:::tip Note
The `url` is only returned in this response. Redirect the person's browser to it right away: it stops working 60 seconds after it was created, and it can only be opened once.
:::

### Request Parameters

| Parameter        | Required | Description                                                                                                                                                       |
|------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `permissions`    | Conditional | The permissions to give the person. Required unless you send `preset`. See [Link permissions](#link-permissions).                                                                              |
| `preset`         | Conditional | `curator` or `developer`, instead of `permissions`. Required unless you send `permissions`.                                                                    |
| `return_url`     | Optional | An `https` URL in your app that the browser is sent to when the session expires.                                                              |
| `dashboard_path` | Optional | The dashboard page to open, relative to the cluster's dashboard, such as `/collections`, `/synonym-sets` or `/analytics`. Defaults to the cluster's overview page. |
| `label`          | Optional | Who the link is for, for your own records. It is returned when you list links, and is never shown to the person.                             |

### Example: redirecting from your server

Here's an example in a Node.js Express app:

```js
app.get('/search-settings/open-dashboard', async (req, res) => {
  const response = await fetch(
    `https://cloud.typesense.org/api/v1/clusters/${req.user.clusterId}/dashboard-links`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY': process.env.TYPESENSE_CLOUD_MANAGEMENT_API_KEY,
      },
      body: JSON.stringify({
        permissions: ['data:view', 'data:search', 'data:manage_synonyms', 'data:manage_overrides'],
        return_url: 'https://app.example.com/search-settings/open-dashboard',
        dashboard_path: req.query.dashboard_path || '/collections',
        label: req.user.id,
      }),
    }
  )
  const link = await response.json()
  res.redirect(303, link.url)
})
```

Since the `return_url` here points back to the same route, a person whose session expired is sent straight into a new session on the page they were on.

:::warning
You want to keep your Management API key on your server and never send it to the browser.
:::

## Link permissions

These are the permissions you can give the person.
Every link needs `data:view` or `data:full_access`.

| Permission                              | What the person can do                                                                                      |
|-----------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `data:view`                             | Read collections, schemas, documents and aliases.                                                           |
| `data:search`                           | Search collections.                                                                                         |
| `data:full_access`                      | Create, change and drop collections. Add, update and delete documents. Manage aliases. Includes `data:view` and `data:search`. |
| `data:manage_synonyms`                  | Manage synonyms.                                                                                            |
| `data:manage_overrides`                 | Manage curation (overrides).                                                                                |
| `data:manage_presets`                   | Manage search presets.                                                                                      |
| `data:manage_stopwords`                 | Manage stopwords.                                                                                           |
| `data:manage_stemming`                  | Manage stemming dictionaries.                                                                               |
| `data:manage_analytics_rules`           | Manage analytics rules and events.                                                                          |
| `data:manage_conversation_models`       | Manage conversation models.                                                                                 |
| `data:manage_natural_language_models`   | Manage natural-language search models.                                                                      |
| `metrics:read`                          | See the cluster's metrics and request logs.                                                                 |
| `cluster_credentials:manage`            | List, create and delete the cluster's API keys.                                                             |

:::warning
What `cluster_credentials:manage` and the two model permissions hand out keeps working after the link expires. A cluster API key created on the API Keys page works until someone deletes it. The conversation and natural-language model settings include the LLM provider API key you saved with the model. Please give these permissions only to people you would give those keys to.
:::

Or you can pass a `preset` instead of `permissions`:

| `preset`    | Permissions                                                                                                         |
|-------------|---------------------------------------------------------------------------------------------------------------------|
| `curator`   | `data:view`, `data:search`, `data:manage_synonyms`, `data:manage_overrides`, `data:manage_presets`, `data:manage_stopwords` |
| `developer` | Every permission in the [table above](#link-permissions).                                                                                           |

Every link lists its `permissions`, and its `preset` when they match one exactly (otherwise `null`).

## List dashboard links

This endpoint lists a cluster's dashboard links that haven't expired: links that haven't been opened yet, and opened links whose session is still going. The `url` is never returned here.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/dashboard-links" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "dashboard_links": [
    {
      "id": "Rk7mQ2vX9pLs4TnW8bYc3dHf",
      "permissions": [
        "data:view",
        "data:search",
        "data:manage_synonyms",
        "data:manage_overrides"
      ],
      "preset": null,
      "state": "active",
      "label": "user-1234",
      "return_url": "https://app.example.com/search-settings",
      "dashboard_path": "/collections",
      "openable_until": "2026-10-28T15:04:05Z",
      "opened_at": "2026-10-28T15:03:07Z",
      "opened_ip": "203.0.113.24",
      "session_expires_at": "2026-10-28T16:03:07Z",
      "revoked_at": null,
      "created_at": "2026-10-28T15:03:05Z"
    }
  ]
}
```

The list includes links team members made on the Share Dashboard page. For one that never expires, `openable_until` and `session_expires_at` are `null`.

### Response Parameters

#### `state`

| `state`   | Description                                                                                        |
|-----------|----------------------------------------------------------------------------------------------------|
| `waiting` | The link hasn't been opened yet, and can still be opened until `openable_until`.                  |
| `active`  | The link was opened, and the person's session lasts until `session_expires_at`.                     |
| `expired` | The link wasn't opened in time or its session ended. A link also expires early when the key that created it is revoked or the cluster is terminated. |
| `revoked` | The link was [revoked](#revoke-a-dashboard-link).                                                  |

All timestamps on dashboard links are ISO 8601 strings in UTC.

## Revoke a dashboard link

A revoked link can no longer be opened, and a session already opened from it stops working on its next request.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/dashboard-links/<LinkId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "Rk7mQ2vX9pLs4TnW8bYc3dHf",
  "permissions": [
    "data:view",
    "data:search",
    "data:manage_synonyms",
    "data:manage_overrides"
  ],
  "preset": null,
  "state": "revoked",
  "label": "user-1234",
  "return_url": "https://app.example.com/search-settings",
  "dashboard_path": "/collections",
  "openable_until": "2026-10-28T15:04:05Z",
  "opened_at": "2026-10-28T15:03:07Z",
  "opened_ip": "203.0.113.24",
  "session_expires_at": "2026-10-28T16:03:07Z",
  "revoked_at": "2026-10-28T15:20:41Z",
  "created_at": "2026-10-28T15:03:05Z"
}
```

## Error responses

| Status | When                                                                                                         |
|--------|--------------------------------------------------------------------------------------------------------------|
| `400`  | A parameter is missing or isn't valid, or both `permissions` and `preset` are given. |
| `404`  | The cluster or the link doesn't exist on this account.                                                      |
| `422`  | The cluster isn't in service.                                       |

## Permissions

To [create](#create-a-dashboard-link), [list](#list-dashboard-links) or [revoke](#revoke-a-dashboard-link) dashboard links, you need a key with the `dashboard_links:manage` capability.
See [capabilities](./authentication.md#capabilities).

Dashboard links aren't available to AI agents connected through the Typesense Cloud MCP server, so a sign-in link never ends up in an agent's conversation.
