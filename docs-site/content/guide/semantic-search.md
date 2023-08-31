# Semantic Search

Typesense supports the ability to do semantic search out-of-the-box, using built-in Machine Learning models or you can also use external ML models like OpenAI, PaLM API and Vertex AI API (starting from `v0.25`).

## Use Case

Semantic search helps retrieve results that are conceptually related to a user's query. 

For eg, let's say a user types in "ocean", but your dataset only contains the keyword "sea", semantic search can help pull up the "sea" result, since "ocean" is related to "sea". 

In this article, we'll take a simple products dataset to show you how to implement semantic search in a few steps. 

## Step 1: Create a collection

This is very similar to creating a regular collection, except for the addition of an <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#option-b-auto-embedding-generation-within-typesense`">auto-embedding field</RouterLink> highlighted below.

```shell{15-22}
curl -X POST \
  'http://localhost:8108/collections' \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
        "name": "products",
        "fields": [
          {
            "name": "product_name",
            "type": "string"
          },
          {
            "name": "embedding",
            "type": "float[]",
            "embed": {
              "from": [
                "product_name"
              ],
              "model_config": {
                "model_name": "ts/all-MiniLM-L12-v2"
              }
            }
          }
        ]
      }'
```

We're using the built-in ML model `ts/all-MiniLM-L12-v2` (aka S-BERT) in this example to automatically generate embeddings from the `product_name` field in the documents we'll be adding to this collection.

You can also use
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#using-openai-api`">OpenAI</RouterLink>, 
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#using-google-palm-api`">PaLM API</RouterLink> or
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#using-gcp-vertex-ai-api`">Vertex AI API</RouterLink> to have Typesense automatically make API calls out to these services for generating embeddings that will power the semantic search.

## Step 2: Index your JSON data

You can send your JSON data as usual into Typesense:

```shell
curl "http://localhost:8108/collections/products/documents/import?action=create" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -H "Content-Type: text/plain" \
        -X POST \
        -d '{"product_name": "Cell phone"}
            {"product_name": "Laptop"}
            {"product_name": "Desktop"}
            {"product_name": "Printer"}
            {"product_name": "Keyboard"}
            {"product_name": "Monitor"}
            {"product_name": "Mouse"}'
```

Typesense will automatically use the ML model you specified when creating the schema to generate and store embeddings for each of your JSON documents.

And that's it! It's semantic search time.

## Step 3: Semantic Search

To do a semantic search, we just have to add the `embedding` field to the `query_by` search parameter:

```shell{7-8}
curl 'http://localhost:8108/multi_search' \
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    -X POST \
    -d '{
      "searches": [
        {
          "q": "device to type things on",
          "query_by": "embedding",
          "collection": "products",
          "prefix": "false",
          "exclude_fields": "embedding",
          "per_page": 1
        }
      ]
    }'
```

This will return the following result. 

Notice how we searched for `device to type things on` and even though those keywords don't exist in our JSON dataset, Typesense was able to do a semantic search and return the result as `Keyboard` since it is conceptually related:

```json{10}
{
  "results": [
    {
      "facet_counts": [],
      "found": 1,
      "hits": [
        {
          "document": {
            "id": "4",
            "product_name": "Keyboard"
          },
          "highlight": {},
          "highlights": [],
          "vector_distance": 0.38377559185028076
        }
      ],
      "out_of": 7,
      "page": 1,
      "request_params": {
        "collection_name": "products",
        "per_page": 1,
        "q": "device to type things on"
      },
      "search_cutoff": false,
      "search_time_ms": 16
    }
  ]
}
```

### Hybrid Search

In many cases, you might want to combine keyword searches along with semantic search. We call this Hybrid Search. 

You can do this in Typesense, by adding a keyword field name to `query_by`, in addition to the auto-embedding field:

```shell{7-8}
curl 'http://localhost:8108/multi_search' \
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
    -X POST \
    -d '{
      "searches": [
        {
          "query_by": "product_name,embedding",
          "q": "desktop copier",
          "collection": "products",
          "prefix": "false",
          "exclude_fields": "embedding",
          "per_page": 2
        }
      ]
    }'
```

This will return the following results.

Notice how searching for `Desktop copier` returns `Desktop` as a result which is a keyword match, followed by `Printer` which is a semantic match.

```json{10,45}
{
  "results": [
    {
      "facet_counts": [],
      "found": 7,
      "hits": [
        {
          "document": {
            "id": "2",
            "product_name": "Desktop"
          },
          "highlight": {
            "product_name": {
              "matched_tokens": [
                "Desktop"
              ],
              "snippet": "<mark>Desktop</mark>"
            }
          },
          "highlights": [
            {
              "field": "product_name",
              "matched_tokens": [
                "Desktop"
              ],
              "snippet": "<mark>Desktop</mark>"
            }
          ],
          "hybrid_search_info": {
            "rank_fusion_score": 0.8500000238418579
          },
          "text_match": 1060320051,
          "text_match_info": {
            "best_field_score": "517734",
            "best_field_weight": 102,
            "fields_matched": 3,
            "score": "1060320051",
            "tokens_matched": 0
          },
          "vector_distance": 0.510231614112854
        },
        {
          "document": {
            "id": "3",
            "product_name": "Printer"
          },
          "highlight": {},
          "highlights": [],
          "hybrid_search_info": {
            "rank_fusion_score": 0.30000001192092896
          },
          "text_match": 0,
          "text_match_info": {
            "best_field_score": "0",
            "best_field_weight": 0,
            "fields_matched": 0,
            "score": "0",
            "tokens_matched": 0
          },
          "vector_distance": 0.4459354281425476
        }
      ],
      "out_of": 7,
      "page": 1,
      "request_params": {
        "collection_name": "products",
        "per_page": 2,
        "q": "desktop copier"
      },
      "search_cutoff": false,
      "search_time_ms": 22
    }
  ]
}
```

## Live Demo

[Here's](https://hn-comments-search.typesense.org) a live demo that shows you how to implement Semantic Search and Hybrid Search.

You'll find the source code linked in the description.

Read the full API reference documentation about <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">Vector Search here</RouterLink>.  
