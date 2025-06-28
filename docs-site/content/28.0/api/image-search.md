---
sidebarDepth: 2
sitemap:
  priority: 0.3
---

# Image Search

Typesense can be used for:

1. Searching through images, based on the description of items in the image and 
2. For Image Similarity search

Using Typesense's built-in support for the [CLIP ML model](https://openai.com/research/clip).

## Create a collection

We'll create a new collection and use the `ts/clip-vit-b-p32` CLIP model.

Here's the [collection schema](./collections.md#create-a-collection) to use:

```json{8-12,16-22}
{
  "name": "images",
  "fields": [
    {
      "name": "name",
      "type": "string"
    },
    {
      "name": "image",
      "type": "image",
      "store": false
    },
    {
      "name": "embedding",
      "type": "float[]",
      "embed": {
        "from": [
          "image"
        ],
        "model_config": {
          "model_name": "ts/clip-vit-b-p32"
        }
      }
    }
  ]
}
```

Notice the new data type called `type: image` for the field named `image`, which is a base64 encoded string of the image in BMP, JPG or PNG formats.

The `store: false` property in the field definition tells Typesense to use the field only for generating the embeddings, and to then discard the image from the document and not store it on disk. 

You can also combine text and image into a single embedding with a collection schema like the following:

```json{8-12,16-22}
{
  "name": "images",
  "fields": [
    {
      "name": "name",
      "type": "string"
    },
    {
      "name": "image",
      "type": "image",
      "store": false
    },
    {
      "name": "embedding",
      "type": "float[]",
      "embed": {
        "from": [
          "name",
          "image"
        ],
        "model_config": {
          "model_name": "ts/clip-vit-b-p32"
        }
      }
    }
  ]
}
```

## Index documents with images

Here's an example of how your JSON document that you [import](./documents.md#index-multiple-documents) into Typesense might look:

```json
{
  "name": "an image with a dog",
  "image": "<base64 encoded string of the image>"
}
```

## Search for images using semantic search

Now let's search for all images that have animals in them:

```bash
curl "http://localhost:8108/multi_search" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "searches": [
            {
              "collection": "images",
              "q": "animals",
              "query_by": "embedding"
            }
          ]
        }'
```

Behind the scenes, Typesense uses the value of the `q` parameter to generate an embedding using the same CLIP model, does a nearest-neighbor search with those vectors and returns the closest results. 

## Search for similar images

To search for similar images, given a particular image in our dataset, we can use a search query like this:

```bash
curl "http://localhost:8108/multi_search" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "searches": [
            {
              "collection": "images",
              "q": "*",
              "vector_query": "embedding:([], id:123)"
            }
          ]
        }'
```

This will return all images similar to the image in the document `id: 123`, as determined by the CLIP model.
