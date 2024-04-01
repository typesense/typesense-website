---
sidebarDepth: 1
sitemap:
  priority: 0.7
---

# Stopwords

Stopwords are keywords which will be removed from search query while searching. 

**NOTE:** Stopwords are NOT dropped during indexing.

## Adding stopwords

Let's first create a stopwords set called `stopword_set1` with the `en` locale (optional).

```shell
curl "http://localhost:8108/stopwords/stopword_set1" -X PUT \
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    -d '{
        "stopwords": ["Germany", "France", "Italy", "United States"], 
        "locale": "en"
    }'
```

On successfully adding the stopword set we will get a response like this:

```json
{
  "name": "stopword_set1",
  "locale": "en",
  "stopwords": [
    "states","united","france","germany","italy"
  ]
}
```

Notice how the phrase `United States` is added as two different words. This is because stopwords are tokenized.

## Using stopwords during search

While searching, we can pass a stopword set via the `stopwords` parameter, and the keywords present in the set 
will be removed from the search query.

```shell
curl "http://localhost:8108/multi_search" -X POST \
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    -d '{
      "searches": [
        {
          "collection": "books",
          "q": "the"
          "query_b": "title"
          "stopwords": "stopword_set1",
        }
      ]
    }'
```

## Getting all stopwords sets

We can fetch all stopword sets via the listing end-point.

```shell
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  "http://localhost:8108/stopwords"
```

## Get a specific stopwords set

To get stopwords associated with a specific stopwords set:

```shell
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  "http://localhost:8108/stopwords/countries" 
```

## Updating stopwords

We can overwrite a stopwords set with a new set of stopwords. For example, to overwrite the stopwords associated 
with the set `countries`, we can do:

```shell
curl "http://localhost:8108/stopwords/countries" -X PUT \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{"stopwords": ["Germany", "France", "Italy"], "locale": "en"}'
```
