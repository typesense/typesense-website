---
description: "Typesense Cloud Cluster Management API keys allow 30 requests per minute by default and return HTTP 429 when the limit is exceeded."
---

# Rate Limits

Cluster Management API Calls are rate-limited as a precaution.

By default, each API Key you create can make a total of 30 requests per minute. 
If you need to have this limit increase, please reach out to support aT typesense dOt org.

Once the rate limit is reached, requests to the API will return a `HTTP 429`:

```json
{"success": false, "message": "Rate Limit Exceeded. Please try again later."}
```

:::warning NOTE
This section talks about the rate limits that apply to the [Typesense Cloud **Cluster Management API**](README.md) which is what you'd use to create new clusters, change capacity of clusters, etc.

There are NO HTTP rate limits applied to the [**Typesense Server API**](/api) which is what you'd use to search or send writes to. 
:::

## Typesense Cloud MCP server

An [AI agent connected to Typesense Cloud](../../guide/typesense-cloud/mcp-server.md) has the same two limits: 300 data calls (search, documents, reads and writes) per minute per connection, and 30 cluster-management actions per minute. A Cluster Management API key used as the bearer token keeps its own limit.
