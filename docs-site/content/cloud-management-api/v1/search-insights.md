---
description: "Read a collection's top no-hit and popular search queries, the words its index holds and its synonym sets through the Typesense Cloud Cluster Management API, to find synonyms worth adding."
---

# Search Insights API

Search insights help you find the synonyms worth adding to a collection.
This endpoint returns the searches that found nothing, the popular searches, the words the index holds and the collection's synonym sets.

The searches come from the collection's `popular_queries` and `nohits_queries` <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/analytics-query-suggestions.html`">analytics rules</RouterLink>.
So the collection needs at least one of those rules, on a cluster that runs Typesense Server `v30` or later.

To add a synonym, use the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/synonyms.html`">Typesense Server synonyms API</RouterLink> with the cluster's admin key.
If you'd like Typesense Cloud to propose synonyms from these insights every week using your own LLM provider key, see [Synonym Suggestions](./synonym-suggestions.md).

## Get search insights for a collection

Here's how to read a collection's search insights:

```shell
curl -X GET --location "https://cloud.typesense.org/api/v1/clusters/<ClusterId>/collections/<CollectionName>/search-insights" \
    -H "Accept: application/json" \
    -H "X-TYPESENSE-CLOUD-MANAGEMENT-API-KEY: YOUR-API-KEY"
```

**Response:**

```json
{
  "collection_name": "products",
  "analytics_rules": [
    { "name": "products_nohits", "type": "nohits_queries", "destination_collection": "product_nohits_queries" },
    { "name": "products_popular", "type": "popular_queries", "destination_collection": "product_queries" }
  ],
  "nohits_queries": [
    {
      "q": "telly",
      "count": 7,
      "matches_as_typed": null,
      "checked": false,
      "spelling_matches": []
    },
    {
      "q": "telivision",
      "count": 3,
      "matches_as_typed": false,
      "checked": true,
      "spelling_matches": [
        { "term": "Televisions", "field": "category", "found": 60 },
        { "term": "Television", "field": "name", "found": 25 }
      ]
    }
  ],
  "popular_queries": [
    { "q": "sofa", "count": 412 }
  ],
  "index_terms": [
    { "term": "sofa", "found": 60, "source": "popular_query" },
    { "term": "Televisions", "found": 60, "source": "facet_value", "field": "category" }
  ],
  "synonym_sets": [
    {
      "name": "products_synonyms",
      "items": [
        { "id": "couch", "root": "sofa", "synonyms": ["couch", "settee"] }
      ]
    }
  ],
  "truncated": false
}
```

| Field | Description |
|---|---|
| `analytics_rules` | The collection's `popular_queries` and `nohits_queries` rules the queries were read from. Empty when it has none. |
| `nohits_queries` | Up to 100 searches that found nothing, highest `count` first, combined across rules. |
| `nohits_queries[].matches_as_typed` | `true` when the query does find documents exactly as typed in some indexed string field, so the search missed because of a filter or narrower search settings. `null` when `checked` is `false`. |
| `nohits_queries[].checked` | `false` when the check for this query failed on the cluster, or the collection has no indexed string field to check. `matches_as_typed` and `spelling_matches` are then unknown. |
| `nohits_queries[].spelling_matches` | Up to 5 words in the index that Typesense reaches from the query by spelling (typos, split or joined words), most documents first. `found` is the number of documents the word matches as typed. Existing synonyms are not applied. |
| `popular_queries` | Up to 100 searches that found results, highest `count` first, combined across rules. |
| `index_terms` | Up to 300 popular queries and top values of the collection's string facet fields that match documents exactly as typed, most documents first. These are the words a synonym for a no-hit query can point to. `field` is set for a `facet_value`. |
| `synonym_sets` | Up to 10 synonym sets attached to the collection, with up to 250 items across them. A set whose items did not fit is listed with fewer or no items. `root` is set only for a one-way synonym. |
| `truncated` | `true` when something was left out: the collection has more than 10 synonym sets or 250 synonym items, a search behind `index_terms` failed on the cluster or the response was too large. |

## Error responses

- HTTP `404` when the cluster doesn't exist on your account, or the collection doesn't exist on the cluster.
- HTTP `422` when the cluster isn't `in_service`, runs a Typesense Server version before `v30` or refuses to read an analytics rule's queries. The message says which.
- HTTP `503` when the cluster didn't answer in time. Retry in a few minutes.

## Permissions

To [get search insights](#get-search-insights-for-a-collection), you need a key with the `search_insights:read` capability.
`metrics:read` doesn't cover it, since the response has document values, field names and synonym items in it.
See [capabilities](./authentication.md#capabilities).
