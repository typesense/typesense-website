# Typesense Server Configuration Parameters API

Once you've provisioned a cluster via the Typesense Cloud web console or using the [Cluster Management API](./cluster-management.md), 
you can configure advanced <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">Typesense Server Configuration Parameters</RouterLink> that control various aspects of Typesense's behavior, 
such as CORS settings, performance tuning, and analytics configuration.

## List all configuration parameters

This endpoint returns all user-editable server configuration parameters for a cluster.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "parameter_name": "cors-domains",
    "parameter_value": "https://example.com,https://app.example.com",
    "created_at": "2025-06-14T12:00:00Z",
    "updated_at": "2025-06-14T12:00:00Z"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "parameter_name": "max-per-page",
    "parameter_value": "500",
    "created_at": "2025-06-14T12:00:00Z",
    "updated_at": "2025-06-14T12:00:00Z"
  }
]
```

## Get a single parameter

This endpoint retrieves information about a specific server configuration parameter.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters/<ParameterId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "parameter_name": "cors-domains",
  "parameter_value": "https://example.com,https://app.example.com",
  "created_at": "2025-06-14T12:00:00Z",
  "updated_at": "2025-06-14T12:00:00Z"
}
```

## Create a parameter

This endpoint creates a new server configuration parameter for a cluster.

```shell
curl -X POST --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "parameter_name": "cors-domains",
          "parameter_value": "https://example.com,https://app.example.com"
        }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "parameter_name": "cors-domains",
  "parameter_value": "https://example.com,https://app.example.com",
  "created_at": "2025-06-14T12:00:00Z",
  "updated_at": "2025-06-14T12:00:00Z"
}
```

### Available Parameters

The following parameters can be configured via this API:

| Parameter Name                | Description                                  | Valid Values                  | Typesense Version |
|-------------------------------|----------------------------------------------|-------------------------------|-------------------|
| `cors-domains`                | Comma-separated list of allowed CORS domains | HTTPS URLs only, no wildcards | All               |
| `analytics-flush-interval`    | How often to flush analytics data in seconds | 60 to 43,200 (12 hours)       | v26+              |
| `analytics-minute-rate-limit` | Rate limit for analytics events per minute   | 5 to 9,999,999                | v28+              |
| `cache-num-entries`           | Number of entries in the search cache        | 1,000 to 9,999,999            | v26+              |
| `db-compaction-interval`      | Database compaction interval in seconds      | 3,600 to 604,800 (7 days)     | v26+              |
| `filter-by-max-ops`           | Maximum filter operations per search         | 1 to 9,999,999                | v27+              |
| `max-per-page`                | Maximum results per page                     | 1 to 10,000                   | v27+              |
| `max-group-limit`             | Maximum group limit for grouped searches     | 1 to 9,999,999                | v29+              |

:::tip Note
Some parameters are only available in specific Typesense server versions. Make sure your cluster is running the required version before configuring these parameters.
:::

## Update a parameter

This endpoint updates the value of an existing server configuration parameter.

```shell
curl -X PATCH --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters/<ParameterId>" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY" \
    -d '{
          "parameter_value": "https://updated.example.com"
        }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "parameter_name": "cors-domains",
  "parameter_value": "https://updated.example.com",
  "created_at": "2025-06-14T12:00:00Z",
  "updated_at": "2025-06-14T13:00:00Z"
}
```

## Delete a parameter

This endpoint removes a server configuration parameter from a cluster.

```shell
curl -X DELETE --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/server-configuration-parameters/<ParameterId>" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "success": true
}
```

## Error Responses

When an error occurs, the API returns an error response with details about what went wrong.

### Validation Error Example

```json
{
  "success": false,
  "message": "Parameter value must start with https://"
}
```

## Important Notes

- Parameter changes take effect when the Typesense server is restarted. You need to restart your cluster for changes to take effect using the [Cluster Configuration Management API](./cluster-configuration-changes.md) by leaving out all the parameters except for `perform_change_at`.
- Each parameter can only be set once per cluster. To change a value, use the update endpoint.