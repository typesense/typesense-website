# Rate Limits

This section talks about the rate limits that apply to the [Typesense Cloud **Cluster Management API**](README.md).

If you're looking for the Typesense Server API docs, see [here](/api).

## API-Key-Based Rate Limiting

Cluster Management API Calls are rate-limited as a precaution.

By default, each API Key you create can make a total of 30 requests per minute. 
If you need to have this limit increase, please reach out to support aT typesense dOt org.

Once the rate limit is reached, requests to the API will return a `HTTP 429`.