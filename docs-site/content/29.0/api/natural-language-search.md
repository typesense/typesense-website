# Natural Language Search

Natural Language Search in Typesense allows you to transform any free-form sentences a user might type into your search bar, into a structured set of search parameters. 

This feature leverages the magic of Large Language Models (LLMs) to interpret user intent and generate appropriate search parameters like filter conditions, sort orders, and query terms that work with Typesense's search syntax.

## Use-case

Let's take an example of a cars dataset indexed in Typesense. 

Here's a sample record from this dataset for context:

```json
{
  "city_mpg": 13,
  "driven_wheels": "rear wheel drive",
  "engine_cylinders": 8,
  "engine_fuel_type": "premium unleaded (recommended)",
  "engine_hp": 707,
  "highway_mpg": 22,
  "id": "1480",
  "make": "Dodge",
  "market_category": ["Factory Tuner", "High-Performance"],
  "model": "Charger",
  "msrp": 65945,
  "number_of_doors": 4,
  "popularity": 1851,
  "transmission_type": "AUTOMATIC",
  "vehicle_size": "Large",
  "vehicle_style": "Sedan",
  "year": 2017
}
```

Using Typesense's built-in Natural Language Search feature, your users can now query this dataset using natural language queries like this:


```markdown
- A honda or BMW with at least 200hp, rear-wheel drive, from 20K to 50K
- Show me the most powerful car you have
- High performance Italian cars, above 700hp
- I don't know how to drive a manual 
```

Notice how in some queries there might be multiple criteria mentioned, and in some cases the keyword itself might not be present in the dataset.

Typesense will automatically use an LLM to parse the natural language queries into filters, sorts and/or text-based queries, and execute the search for you using those parameters.

Let's see how we can set this up.

## Create a Natural Language Search Model

First, you need to configure a model that will process natural language queries:

```bash
curl -X POST http://localhost:8108/nl_search_models \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-H "Content-Type: application/json" \
-d '{
  "model_name": "openai/gpt-4o",
  "api_key": "YOUR_OPENAI_TYPESENSE_API_KEY",
  "max_bytes": 16000,
  "temperature": 0.0
}'
```

### Supported Model Types

1. **OpenAI Models**:
   ```json
   {
     "model_name": "openai/gpt-4o",
     "api_key": "YOUR_OPENAI_API_KEY",
     "max_bytes": 16000,
     "temperature": 0.0,
     "system_prompt": "Optional custom system prompt to override default"
   }
   ```

2. **Cloudflare Workers AI**:
   ```json
   {
     "model_name": "cloudflare/@cf/meta/llama-2-7b-chat-int8",
     "api_key": "YOUR_CLOUDFLARE_API_KEY",
     "account_id": "YOUR_CLOUDFLARE_ACCOUNT_ID",
     "max_bytes": 16000
   }
   ```

3. **vLLM Self-hosted Models**:
   ```json
   {
     "model_name": "vllm/mistral-7b-instruct",
     "api_url": "http://your-vllm-server:8000/generate",
     "max_bytes": 16000,
     "temperature": 0.0
   }
   ```

## Perform a Natural Language Search Query

Once you've set up a model, you can use natural language queries in your search requests:

### Single-Search

```bash
curl "http://localhost:8108/collections/products/documents/search" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-G \
--data-urlencode "q=show me red shirts under $50" \
--data-urlencode "nl_query=true" \
--data-urlencode "query_by=name,description,color,category" \
--data-urlencode "nl_model_id=<your-model-id-from the above step>"
```

You can combine natural language queries with traditional search parameters:

```bash
curl "http://localhost:8108/collections/products/documents/search" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-G \
--data-urlencode "q=red shirts" \
--data-urlencode "nl_query=true" \
--data-urlencode "query_by=name,description,color,category" \
--data-urlencode "filter_by=in_stock:true" \
--data-urlencode "nl_model_id=<your-model-id-from the above step>"
```

The LLM-generated filter (e.g., `color:red && category:shirt && price:<50`) will be combined with your explicit filter (`in_stock:true`) using the AND operator, resulting in `in_stock:true && color:red && category:shirt && price:<50`.

### Multi-Search

You can also use natural language queries in multi-search requests:

```bash
curl -X POST "http://localhost:8108/multi_search" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-H "Content-Type: application/json" \
-d '
{
  "searches": [
    {
      "collection": "products",
      "q": "affordable red shirts",
      "nl_query": true,
      "query_by": "name,description,color,category",
      "nl_model_id": "<your-model-id-from the above step>"
    },
    {
      "collection": "products",
      "q": "blue jeans on sale",
      "nl_query": true,
      "query_by": "name,description,color,category",
      "nl_model_id": "<your-model-id-from the above step>"
    }
  ]
}'
```

## Debugging

You can enable debug mode to see the raw LLM response:

```bash
curl "http://localhost:8108/collections/products/documents/search" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-G \
--data-urlencode "q=red shirts under $50" \
--data-urlencode "nl_query=true" \
--data-urlencode "query_by=name,description,color,category" \
--data-urlencode "nl_query_debug=true" \
--data-urlencode "nl_model_id=<your-model-id-from the above step>"
```

## Response Structure

Here's an example response structure when using natural language search:

```json
{
  "found": 42,
  "hits": [
    {
      "document": {
        "id": "124",
        "name": "Classic Red T-Shirt",
        "description": "Comfortable cotton t-shirt in vibrant red",
        "price": 24.99,
        "color": "red",
        "category": "shirt"
      },
      "highlights": [
        {
          "field": "name",
          "snippet": "Classic <mark>Red</mark> T-<mark>Shirt</mark>"
        }
      ]
    },
    // ... more hits
  ],
  "parsed_nl_query": {
    "parse_time_ms": 428,
    "generated_params": {
      "filter_by": "color:red && category:shirt && price:<50",
      "sort_by": "price:asc"
    },
    "augmented_params": {
      "q": "*",
      "filter_by": "in_stock:true && color:red && category:shirt && price:<50",
      "sort_by": "price:asc",
      "query_by": "name,description,color,category"
    }
  },
  "request_params": {
    "q": "show me red shirts under $50",
    "nl_query": true,
    "query_by": "name,description,color,category",
    "filter_by": "in_stock:true"
  }
}
```

### Response Fields

- **parsed_nl_query**: Contains information about the natural language processing
  - **parse_time_ms**: Time taken to process the natural language query (in milliseconds)
  - **generated_params**: Parameters generated solely by the LLM from the natural language query
    - **q**: Generated search query text (if needed)
    - **filter_by**: Generated filter conditions
    - **sort_by**: Generated sort order
  - **augmented_params**: The final parameters used for the search (combination of LLM-generated and explicitly provided search parameters)

- **request_params**: The original request parameters including the natural language query


## Example Use Cases with Sample Dataset

Let's use a product catalog as an example, with the following documents:

```json
[
  {
    "id": "1",
    "name": "Men's Red Cotton T-Shirt",
    "description": "Comfortable casual t-shirt",
    "price": 24.99,
    "category": "Apparel",
    "color": "Red",
    "in_stock": true,
    "rating": 4.5
  },
  {
    "id": "2",
    "name": "Women's Blue Denim Jeans",
    "description": "Classic straight-cut denim jeans",
    "price": 49.99,
    "category": "Apparel",
    "color": "Blue",
    "in_stock": true,
    "rating": 4.2
  },
  {
    "id": "3",
    "name": "Running Shoes - Green",
    "description": "Lightweight shoes perfect for running",
    "price": 89.99,
    "category": "Footwear",
    "color": "Green",
    "in_stock": false,
    "rating": 4.8
  }
]
```

Let's now see how various natural language search queries are transformed into structured search parameters: 

1. **"Find red shirts under $30"**

   Search request:
   ```json
   {
     "collection": "products",
     "q": "Find red shirts under $30",
     "nl_query": true,
     "query_by": "name,description,color,category"
   }
   ```

   Generated parameters:
   ```json
   {
     "filter_by": "color:Red && category:Apparel && price:<30"
   }
   ```

2. **"Show me available footwear sorted by price"**

   Search request:
   ```json
   {
     "collection": "products",
     "q": "Show me available footwear sorted by price",
     "nl_query": true,
     "query_by": "name,description,category"
   }
   ```

   Generated parameters:
   ```json
   {
     "filter_by": "category:Footwear && in_stock:true",
     "sort_by": "price:asc"
   }
   ```

3. **"What's the highest rated apparel?"**

   Search request:
   ```json
   {
     "collection": "products",
     "q": "What's the highest rated apparel?",
     "nl_query": true,
     "query_by": "name,description,category"
   }
   ```

   Generated parameters:
   ```json
   {
     "filter_by": "category:Apparel",
     "sort_by": "rating:desc"
   }
   ```

4. **Combining explicit filter_by and LLM-generated filter_by**

   Search request:
   ```json
   {
     "collection": "products",
     "q": "red items",
     "nl_query": true,
     "query_by": "name,description,color",
     "filter_by": "in_stock:true"
   }
   ```

   Generated parameters from LLM:
   ```json
   {
     "filter_by": "color:Red"
   }
   ```

   Final combined filter used for search:
   ```
   in_stock:true && color:Red
   ```

## Managing Natural Language Search Models

### List All Models

```bash
curl -X GET "http://localhost:8108/nl_search_models" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

### Get Model Details

```bash
curl -X GET "http://localhost:8108/nl_search_models/{model_id}" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

### Update Model

```bash
curl -X PUT "http://localhost:8108/nl_search_models/{model_id}" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-H "Content-Type: application/json" \
-d '{
  "temperature": 0.2,
  "system_prompt": "New system prompt instructions"
}'
```

### Delete Model

```bash
curl -X DELETE "http://localhost:8108/nl_search_models/{model_id}" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

## Troubleshooting

If natural language processing fails (e.g., due to API errors or timeouts), Typesense falls back to:

1. Using the original natural language query as the `q` parameter if no `q` parameter was explicitly provided
2. Using any explicitly provided search parameters (`filter_by`, `sort_by`, etc.)
3. Including an `error` field in the response with details about the failure

In development, use the `nl_query_debug=true` parameter to see the raw LLM responses.

Use custom system prompts to tune the behavior for specific collections or use cases, or provide more domain knowledge about terminology in your dataset to the LLM.