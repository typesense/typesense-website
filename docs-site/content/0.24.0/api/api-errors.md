---
sitemap:
  priority: 0.3
---

# API errors
Typesense API uses standard HTTP response codes to indicate the success or failure of a request.

Codes in the 2xx range indicate success, codes in the 4xx range indicate an error given the information provided (e.g. a required parameter was omitted), and codes in the 5xx range indicate an error with the Typesense service itself.

| Parameter      | Required    |
| -------------- | ----------- |
|400	|Bad Request - The request could not be understood due to malformed syntax.|
|401	|Unauthorized - Your API key is wrong.|
|404	|Not Found - The requested resource is not found.|
|409	|Conflict - When a resource already exists.|
|422	|Unprocessable Entity - Request is well-formed, but cannot be processed.|
|503	|Service Unavailable - We’re temporarily offline. Please try again later.|