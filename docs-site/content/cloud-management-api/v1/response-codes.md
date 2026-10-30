---
description: "Typesense Cloud Cluster Management API response codes explain the HTTP statuses returned for successful requests and common errors."
---

# Response Codes

This section talks about the error codes that the [Typesense Cloud **Cluster Management API**](README.md) might return.

If you're looking for the Typesense Server API docs, see <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/`">here</RouterLink>.

The following table lists all the status codes that the Cluster Management API might return:

| HTTP Code  | Description                                         |
|------------|-----------------------------------------------------|
| 200 or 201 | Resource creation or action was successful          |
| 400        | An API parameter is missing or malformed            |
| 402        | A payment method is required for this paid operation |
| 403        | The API key is invalid, the key doesn't have the capability this request needs or the account can't make this request (for example, it has unpaid invoices) |
| 404        | The resource was not found                          |
| 409        | Another change of the same kind is still in progress, for example an IP allowlist change. Retry once it finishes |
| 422        | Validation failed for the requested action          |
| 429        | Request was rate limited. Try again after 1 minute. |
| 503        | A temporary service outage prevented the operation  |

Error responses use this shape, with the message describing the request-specific failure:

```json
{
  "success": false,
  "message": "..."
}
```

A free-tier cluster can be created without a payment method. HTTP `402` means the request (creating a cluster, cloning one, or a paid configuration change) needs a payment method on the account. Add one in Typesense Cloud, then retry the request.

When a `403` is due to a missing capability, the response also has `"error": "missing_capability"` and a `required_capability` field that names the [capability](./authentication.md#capabilities) you want to add to the key:

```json
{
  "success": false,
  "error": "missing_capability",
  "required_capability": "clusters:configure",
  "message": "This credential is missing the required capability: clusters:configure. ..."
}
```

HTTP `404` is also returned when the resource exists but is not visible to the management key you used. After HTTP `429`, wait a minute before retrying. HTTP `503` is temporary, so retry after a short wait.
