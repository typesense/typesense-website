---
description: "Have Typesense Cloud propose synonyms for searches that found nothing, using your own OpenAI, Anthropic or OpenAI-compatible API key, then list, accept or dismiss the suggestions through the Typesense Cloud Cluster Management API."
---

# Synonym Suggestions API

A synonym suggestion is a one-way synonym that maps a search that found nothing to words your collection already holds.
Once a week, Typesense Cloud uses an LLM to propose these for each collection that has a `nohits_queries` <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/analytics-query-suggestions.html`">analytics rule</RouterLink>.
Runs use your own OpenAI or Anthropic API key, or your own [OpenAI-compatible endpoint](#using-an-openai-compatible-endpoint).

:::warning
Each run is billed to your account with that provider.
:::

Nothing is written to your cluster until you accept a suggestion.
When you accept one, it's written to a synonym set for the collection, as suggested or with your edits.
If you dismiss one, the same suggestion is never made again.

Synonym suggestions need Typesense Server `v30` or later.

## Workflow

Here's a typical sequence of API calls you'd perform when using this API:

1. [Set up synonym suggestions](#set-up-or-replace-synonym-suggestions) with your provider, API key and the email addresses that should get the weekly digest. With `enabled` set to `true`, the first run starts within 10 minutes.
2. [List the pending suggestions](#list-synonym-suggestions).
3. [Accept](#accept-a-synonym-suggestion) or [dismiss](#dismiss-a-synonym-suggestion) each one.

## Set up or replace synonym suggestions

Before a new or changed API key, provider, model or base URL is saved, we check it with one request to the provider.
If the provider refuses the key, it isn't stored.

Here's how you set it up with an Anthropic API key:

```shell
curl -X PUT --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestion-settings" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "provider": "anthropic",
          "api_key": "YOUR-ANTHROPIC-API-KEY",
          "enabled": true,
          "recipients": ["search-team@example.com"]
        }'
```

**Response:**

You get HTTP `201` when the settings are created and HTTP `200` when they're replaced.

```json
{
  "provider": "anthropic",
  "model": "claude-haiku-5-5",
  "base_url": null,
  "api_key_last4": "x9Qa",
  "enabled": true,
  "recipients": ["search-team@example.com"],
  "next_run_at": 1792422000,
  "last_run_at": null,
  "run_in_progress": false,
  "run_now_available_at": null,
  "last_error": null,
  "last_error_message": null,
  "created_at": 1792422000,
  "updated_at": 1792422000
}
```

### Request Parameters

| Parameter    | Required | Description |
|--------------|----------|-------------|
| `provider`   | Required | `anthropic`, `openai` or `openai_compatible`. |
| `recipients` | Required | Email addresses that get the digest of new suggestions and an email when a run fails at the provider. Send an empty array for no email. |
| `api_key`    | Conditional | Your API key for the provider. Required when creating the settings or changing the provider or the base URL. Leave it out to keep the stored key. |
| `base_url`   | Conditional | For `openai_compatible` only: the `https` base URL of your endpoint, such as `https://ai-gateway.example.com/v1`. Required when creating the settings or changing the provider. Leave it out to keep the stored base URL. |
| `model`      | Conditional | The model to run. When you leave it out, the stored model is kept if the provider is unchanged. Otherwise a small, fast model from that provider is used, and the settings response names it. Required for `openai_compatible` when creating the settings or changing the provider. |
| `enabled`    | Optional | Whether suggestions run every week. Defaults to `true`. With `false`, nothing runs on a schedule, but you can still [run suggestions now](#run-synonym-suggestions-now). |

We store your API key encrypted and never return it.

### Using an OpenAI-compatible endpoint

To run suggestions through your own AI gateway or any OpenAI-compatible provider, set `provider` to `openai_compatible`, with the endpoint's `base_url`, the `model` to run and the API key for that endpoint:

```shell
curl -X PUT --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestion-settings" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "provider": "openai_compatible",
          "base_url": "https://ai-gateway.example.com/v1",
          "model": "YOUR-MODEL",
          "api_key": "YOUR-ENDPOINT-API-KEY",
          "enabled": true,
          "recipients": ["search-team@example.com"]
        }'
```

The endpoint and the model need to support Chat Completions with structured output (`response_format` of type `json_schema`).
The base URL has to use `https` and be reachable from the internet.

### Error Responses

- HTTP `400` or `422` when a parameter isn't valid, or the cluster runs a Typesense Server version before `v30`.
- HTTP `404` when the cluster doesn't exist on your account.
- HTTP `422` when the provider refused the key or model, with an `error` code from the [`last_error` table](#last-error) and a message.

#### Error Example

```json
{
  "success": false,
  "error": "invalid_api_key",
  "message": "Anthropic didn't accept this API key. Check it and save again."
}
```

## Get synonym suggestion settings

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestion-settings" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "provider": "anthropic",
  "model": "claude-haiku-5-5",
  "base_url": null,
  "api_key_last4": "x9Qa",
  "enabled": true,
  "recipients": ["search-team@example.com"],
  "next_run_at": 1793027400,
  "last_run_at": 1792422600,
  "run_in_progress": false,
  "run_now_available_at": 1792426200,
  "last_error": null,
  "last_error_message": null,
  "created_at": 1792422000,
  "updated_at": 1792422600
}
```

### Response Parameters

| Field                  | Description |
|------------------------|-------------|
| `provider`             | `anthropic`, `openai` or `openai_compatible`. |
| `model`                | The model runs use. |
| `base_url`             | The base URL of your OpenAI-compatible endpoint. `null` for `anthropic` and `openai`. |
| `api_key_last4`        | The last 4 characters of the stored API key. |
| `enabled`              | Whether suggestions run every week. |
| `recipients`           | Email addresses that get the digest and run error emails. |
| `next_run_at`          | When the next weekly run is due, as a Unix timestamp in seconds. |
| `last_run_at`          | When the last run finished, as a Unix timestamp in seconds. `null` before the first run. |
| `run_in_progress`      | `true` while a run is queued or running. |
| `run_now_available_at` | From when you can [run suggestions now](#run-synonym-suggestions-now) again, as a Unix timestamp in seconds. `null` before the first run. |
| `last_error`           | Why the last run failed at the provider, as a code from the table below. `null` when it succeeded. |
| `last_error_message`   | The same, in words. |
| `created_at`           | When the settings were created, as a Unix timestamp in seconds. |
| `updated_at`           | When the settings were last changed, as a Unix timestamp in seconds. |

#### `last_error`

| `last_error`      | Description |
|-------------------|-------------|
| `invalid_api_key` | The provider rejected the API key. Weekly runs stop until you save a new key. |
| `model_not_found` | The model is not available to this API key. Weekly runs stop until you save another model or key. |
| `quota_exceeded`  | Your provider account is out of credit or over its spending limit. |
| `rate_limited`    | The provider rate-limited the request. Suggestions are tried again at the next weekly run. |
| `refused`         | The provider declined to answer the request. |
| `provider_error`  | The provider returned an error. Suggestions are tried again at the next weekly run. |
| `request_rejected` | Your OpenAI-compatible endpoint didn't accept a Chat Completions request with structured output. |
| `endpoint_not_allowed` | Your OpenAI-compatible endpoint is no longer reachable from the internet. Weekly runs stop until you save a base URL that is. |

The recipients get one email for each new error code.

### Error Responses

- HTTP `404` when the cluster doesn't exist on your account, or has no synonym suggestion settings.

## Stop synonym suggestions

This endpoint deletes the settings and the stored API key.
Suggestions already made stay listed.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestion-settings" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "success": true
}
```

The settings and the stored API key are also deleted when the cluster moves to another account.
Terminating a cluster deletes its settings and its suggestions.

### Error Responses

- HTTP `404` when the cluster doesn't exist on your account, or has no synonym suggestion settings.

## Run synonym suggestions now

This endpoint starts a run in the background, outside the weekly schedule.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestions/run" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

You get HTTP `202` and the [settings](#get-synonym-suggestion-settings), with `run_in_progress` set to `true`.
You want to poll the settings until `run_in_progress` is `false`, then [list the suggestions](#list-synonym-suggestions).
The next weekly run is then due a week after this one.

```json
{
  "provider": "anthropic",
  "model": "claude-haiku-5-5",
  "base_url": null,
  "api_key_last4": "x9Qa",
  "enabled": true,
  "recipients": ["search-team@example.com"],
  "next_run_at": 1793027400,
  "last_run_at": 1792422600,
  "run_in_progress": true,
  "run_now_available_at": 1792426200,
  "last_error": null,
  "last_error_message": null,
  "created_at": 1792422000,
  "updated_at": 1792422600
}
```

### Error Responses

- HTTP `404` when the cluster doesn't exist on your account, or has no synonym suggestion settings.
- HTTP `422` when the run is refused. The `error` field says why:

| `error`                 | Description |
|-------------------------|-------------|
| `ran_recently`          | A run finished recently. Try again after `run_now_available_at`. |
| `run_in_progress`       | A run is already queued or running. |
| `cluster_not_supported` | The cluster isn't `in_service`.  |

A cluster on a Typesense Server version before `v30` also gets HTTP `422`.

## List synonym suggestions

This endpoint lists up to 100 suggestions, newest first.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestions?status=pending" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

### Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `status`  | Optional | `pending`, `accepted` or `dismissed`. Default: `pending` |

**Response:**

```json
[
  {
    "id": 4810573926,
    "collection_name": "products",
    "root": "telly",
    "synonyms": ["Televisions", "tv"],
    "rationale": "Telly is an informal word for television.",
    "evidence": {
      "count": 7,
      "targets": [
        { "term": "Televisions", "found": 60, "field": "category", "source": "facet_value" },
        { "term": "tv", "found": 25, "source": "popular_query" }
      ]
    },
    "status": "pending",
    "generated_at": 1792422600,
    "decided_at": null,
    "accepted_item": null
  }
]
```

| Field             | Description |
|-------------------|-------------|
| `id`              | The suggestion's ID, used to accept or dismiss it. |
| `collection_name` | The collection whose no-hit queries the suggestion comes from. |
| `root`            | The search that found nothing. |
| `synonyms`        | Up to 10 words the collection holds as typed. As suggested, a search for `root` also finds these. |
| `rationale`       | The model's one-sentence reason for the suggestion. |
| `evidence.count`  | How many times `root` was searched and found nothing. |
| `evidence.targets` | Each synonym, with `found`, the number of documents it matched as typed when the suggestion was made, and `source`: `popular_query`, `facet_value` or `spelling_match`. `field` is the field the word was found in, and is left out for a popular query, which is checked across the collection's string fields. |
| `status`          | `pending`, `accepted` or `dismissed`. |
| `generated_at`    | When the run made the suggestion, as a Unix timestamp in seconds. |
| `decided_at`      | When the suggestion was accepted or dismissed, as a Unix timestamp in seconds. `null` while it is pending. |
| `accepted_item`   | The synonym item written to the cluster: `root` and `synonyms` for a one-way synonym, or `synonyms` alone, with the root among them, for a multi-way one. `null` until the suggestion is accepted. |

When a pending suggestion's synonyms show up in the collection's synonym sets, for example because you added them yourself, the next run marks it `accepted`.
`accepted_item` is then `null` unless the item on the cluster is the suggestion's own.

### Error Responses

- HTTP `400` when a parameter isn't valid.
- HTTP `404` when the cluster doesn't exist on your account.

## Accept a synonym suggestion

This endpoint writes a pending suggestion to the cluster as a synonym item, as suggested or edited.
The item goes into the collection's own synonym set, named `<collection>_suggested_synonyms`.
The set is created on the first accept and attached to the collection next to its other synonym sets.
When the suggestion's collection name is an alias, the set is attached to the collection the alias points to.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestions/<SuggestionId>/accept" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "synonyms": ["Televisions", "tv", "TV set"],
          "one_way": true
        }'
```

**Response:**

```json
{
  "id": 4810573926,
  "status": "accepted",
  "decided_at": 1792429800,
  "synonym_set_name": "products_suggested_synonyms",
  "attached_to_collection": "products"
}
```

| Field                    | Description |
|--------------------------|-------------|
| `synonym_set_name`       | The synonym set the item was written to. |
| `attached_to_collection` | The collection the set is attached to: the suggestion's collection, or the collection its alias points to. |

To read `accepted_item`, [list the accepted suggestions](#list-synonym-suggestions).

### Request Parameters

To write the suggestion as it was made, send no body.

| Parameter  | Required | Description |
|------------|----------|-------------|
| `synonyms` | Optional | The words to write instead of the suggested ones, as an array of strings. |
| `one_way`  | Optional | `true` (the default) writes a one-way synonym: a search for the root also finds the synonyms. `false` writes a multi-way synonym: every word, the root included, finds every other. |

### Error Responses

- HTTP `404` when the cluster doesn't exist on your account, or the suggestion does not exist on the cluster.
- HTTP `422` when a parameter isn't valid, the suggestion was already accepted or dismissed, the cluster runs a Typesense Server version before `v30` or the cluster refused the change, for example because the collection no longer exists. The message says which.
- HTTP `503` when the cluster couldn't be reached or isn't `in_service`. Try again in a minute.

## Dismiss a synonym suggestion

This endpoint dismisses a pending suggestion. The same suggestion is never made again.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/synonym-suggestions/<SuggestionId>/dismiss" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": 4810573926,
  "status": "dismissed",
  "decided_at": 1792429800
}
```

### Error Responses

- HTTP `404` when the cluster doesn't exist on your account, or the suggestion does not exist on the cluster.
- HTTP `422` when the suggestion was already accepted or dismissed.

## Permissions

To [set up](#set-up-or-replace-synonym-suggestions), [get](#get-synonym-suggestion-settings) or [stop](#stop-synonym-suggestions) synonym suggestions, [run them now](#run-synonym-suggestions-now) or [dismiss one](#dismiss-a-synonym-suggestion), you need a key with the `cluster_parameters:manage` capability.
Setting up an [OpenAI-compatible endpoint](#using-an-openai-compatible-endpoint) also needs `search_insights:read`.
To [list suggestions](#list-synonym-suggestions), you need `search_insights:read`. `metrics:read` doesn't cover it, since suggestions carry your users' search queries and values from your documents.
To [accept a suggestion](#accept-a-synonym-suggestion), you need the `admin` capability. An agent connected through the [MCP server](../../guide/typesense-cloud/mcp-server.md) needs the `data:manage_synonyms` permission instead.
See [capabilities](./authentication.md#capabilities).
