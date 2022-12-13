---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Vector Search

Typesense supports vector search on `float[]` fields that specify a dimension via the `num_dim` property.

Let's create a collection called `docs` with a vector field called `vec` that contains just 4 dimensions. 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  'name': 'docs',
  'fields': [
    {
      'name': 'title',
      'type': 'string'
    },
    {
      'name': 'points',
      'type': 'int32'
    },
    {
      'name': 'vec',
      'type': 'float[]',
      'num_dim': 4
    }
  ],
  'default_sorting_field': 'points'
}

client.collections().create(schema)
```

  </template>

<template v-slot:PHP>

```php
$schema = [
  'name'      => 'docs',
  'fields'    => [
    [
      'name'  => 'title',
      'type'  => 'string'
    ],
    [
      'name'  => 'points',
      'type'  => 'int32'
    ],
    [
      'name'  => 'vec',
      'type'  => 'float[]',
      'num_dim'  => 4
    ]
  ],
  'default_sorting_field' => 'points'
];

$client->collections->create($schema);
```

  </template>

<template v-slot:Python>

```py
schema = {
  'name': 'docs',
  'fields': [
    {
      'name'  :  'title',
      'type'  :  'string'
    },
    {
      'name'  :  'points',
      'type'  :  'int32'
    },
    {
      'name'     :  'vec',
      'type'     :  'float[]',
      'num_dim'  :  4
    }
  ],
  'default_sorting_field': 'points'
}

client.collections.create(schema)
```

  </template>

<template v-slot:Ruby>

```rb
schema = {
  'name'      => 'places',
  'fields'    => [
    {
      'name'  => 'title',
      'type'  => 'string'
    },
    {
      'name'  => 'points',
      'type'  => 'int32'
    },
    {
      'name'     => 'vec',
      'type'     => 'float[]',
      'num_dim'  => 4
    }
  ],
  'default_sorting_field' => 'points'
}

client.collections.create(schema)
```

  </template>
<template v-slot:Java>

```java
CollectionSchema collectionSchema = new CollectionSchema();

collectionschema.name("docs")
                .addFieldsItem(new Field().name("title").type("string"))
                .addFieldsItem(new Field().name("points").type("int32"))
                .addFieldsItem(new Field().name("vec").type("float[]").num_dim(4))
                .defaultSortingField("points");

CollectionResponse collectionResponse = client.collections().create(collectionSchema);
```

  </template>
  <template v-slot:Shell>

```bash
curl -k "http://localhost:8108/collections" -X POST 
      -H "Content-Type: application/json" \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
        "name": "docs",
        "fields": [
          {"name": "title", "type": "string" },
          {"name": "points", "type": "int32" }, 
          {"name": "vec", "type": "float[]", "num_dim": 4}
        ],
        "default_sorting_field": "points"
      }'
```

  </template>
</Tabs>

Let's now index a document with a vector.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Shell']">
  <template v-slot:JavaScript>

```js
let document = {
  'title': 'Louvre Museuem',
  'points': 1,
  'vec': [0.04, 0.234, 0.113, 0.001]
}

client.collections('docs').documents().create(document)
```

  </template>

<template v-slot:PHP>

```php
$document = [
  'title'   => 'Louvre Museuem',
  'points'  => 1,
  'vec' => array(0.04, 0.234, 0.113, 0.001)
];

$client->collections['docs']->documents->create($document);
```

  </template>

<template v-slot:Python>

```py
document = {
  'title': 'Louvre Museuem',
  'points': 1,
  'location': [0.04, 0.234, 0.113, 0.001]
}

client.collections['docs'].documents.create(document)
```

  </template>

<template v-slot:Ruby>

```rb
document = {
  'title'    =>   'Louvre Museuem',
  'points'   =>   1,
  'vec' =>  [0.04, 0.234, 0.113, 0.001]
}

client.collections['docs'].documents.create(document)
```

  </template>

  <template v-slot:Java>

```java
HaashMap<String, Object> document = new HashMap<>();
float[] vec =  {0.04, 0.234, 0.113, 0.001}

document.add("title", "Louvre Museuem");
document.add("points", 1);
document.add("vec", vec);

client.collection("docs").documents.create(document);
```

  </template>

  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/docs/documents" -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{"points":1,"title":"Louvre Museuem", "vec": [0.04, 0.234, 0.113, 0.001]}'
```

  </template>
</Tabs>

## Nearest neighbor vector search

We can now search for documents that contain a `vec` field value "closest" to a given query vector. 

We use the `k` parameter to control the number of documents that are returned.  

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Java','Shell']">
  <template v-slot:JavaScript>

```js
let searchParameters = {
  'q'            : '*',
  'vector_query' : 'vec:([0.96826, 0.94, 0.39557, 0.306488], k:100)'
}

client.collections('docs').documents().search(searchParameters)
```

  </template>

<template v-slot:PHP>

```php
$searchParameters = [
  'q'            => '*',
  'vector_query' => 'vec:([0.96826, 0.94, 0.39557, 0.306488], k:100)'
];

$client->collections['docs']->documents->search($searchParameters);
```

  </template>

<template v-slot:Python>

```py
search_parameters = {
  'q'              : '*',
  'vector_query'   : 'vec:([0.96826, 0.94, 0.39557, 0.306488], k:100)'
}

client.collections['docs'].documents.search(search_parameters)
```

  </template>

<template v-slot:Ruby>

```rb
search_parameters = {
  'q'              => '*',
  'vector_query'   => 'vec:([0.96826, 0.94, 0.39557, 0.306488], k:100)'
}

client.collections['docs'].documents.search(search_parameters)
```

  </template>
  <template v-slot:Java>

```java
SearchParameters searchParameters = new SearchParameters()
                                        .q("*")
                                        .vectorQuery("vec:([0.96826, 0.94, 0.39557, 0.306488], k:100)");
SearchResult searchResult = client.collections("docs").documents().search(searchParameters);
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/collections/docs/documents/search?q=*&vector_query=vec:([0.96826, 0.94, 0.39557, 0.306488], k:100)"
```

  </template>
</Tabs>

**Sample Response**

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "facet_counts": [],
  "found": 1,
  "hits": [
    {
      "document": {
        "id": "0",
        "vec": [
          0.04, 0.234, 0.113, 0.001
        ]
      },
      "highlight": {
        "full": {},
        "snippet": {}
      },
      "highlights": []
    }
  ],
  "out_of": 1,
  "page": 1,
  "request_params": {
    "collection_name": "docs",
    "per_page": 10,
    "q": "*"
  },
  "search_cutoff": false,
  "search_time_ms": 0
}
```

  </template>
</Tabs>

## Brute-force searching

By default, Typesense uses the built-in HNSW index to do approximate nearest neighbor vector searches. This scales 
well for large datasets. However, if you wish to bypass the HNSW index and do a flat / brute-force ranking of 
vectors, you can do that via the `flat_search_cutoff` parameter.

For example, if you wish to do brute-force vector search when a given query matches fewer than 20 documents, sending 
`flat_search_cutoff=20` will bypass the HNSW index when the number of results found is less than 20.

Here's an example where we are filtering on the `category` field and asking the vector search to use direct 
flat searching if the number of results produced by the filtering operation is less than 20 results.

```shell
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/collections/docs/documents/search?q=*&filter_by=category:shoes&vector_query=vec:([0.96826, 0.94, 0.39557, 0.306488], k:100, flat_search_cutoff: 20)"
```
