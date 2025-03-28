# Response Codes

This section talks about the error codes that the [Typesense Cloud **Cluster Management API**](README.md) might return.

If you're looking for the Typesense Server API docs, see [here](/api).

The following table lists all the status codes that the Cluster Management API might return:

| HTTP Code  | Description                                         |
|------------|-----------------------------------------------------|
| 200 or 201 | Resource creation or action was successful          |
| 400        | An API parameter is missing or malformed            |
| 403        | The request was denied                              |
| 404        | The resource was not found                          |
| 422        | Validation failed for the requested action          |
| 429        | Request was rate limited. Try again after 1 minute. |