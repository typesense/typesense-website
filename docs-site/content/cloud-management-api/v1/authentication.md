# Authentication

This section talks about how to authenticate with the [Typesense Cloud **Cluster Management API**](README.md).

If you're looking for the Typesense Server API docs, see [here](/api).

## Getting an API Key

1. Log in to Typesense Cloud
2. Switch to the account you want to generate an API Key for, using the account switcher on the top right.
3. Navigate to your [account page](https://cloud.typesense.org/account).
4. Scroll all the way down, and click on the "Read More" link next to "Need programmatic access to create clusters".
5. On the next page, click on "New Cluster Management API Key".

Make sure you note this API Key down, as this will be the only time you'll be able to see the full API Key.

## Making API Calls

You can set the API Key in the `X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY` HTTP header, or also as a query parameter with the same name.

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: INSERT-YOUR-KEY-HERE"
```

