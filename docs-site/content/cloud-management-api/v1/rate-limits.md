# Rate Limits

Cluster Management API Calls are rate-limited as a precaution.

By default, each API Key you create can make a total of 30 requests per minute. 
If you need to have this limit increase, please reach out to support aT typesense dOt org.

Once the rate limit is reached, requests to the API will return a `HTTP 429`.

:::warning NOTE
This section talks about the rate limits that apply to the [Typesense Cloud **Cluster Management API**](README.md) which is what you'd use to create new clusters, change capacity of clusters, etc.

There are NO HTTP rate limits applied to the [**Typesense Server API**](/api) which is what you'd use to search or send writes to. 
:::
