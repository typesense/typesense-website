---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Conversational Search (RAG)

Typesense has the ability to respond to free-form questions, with conversational responses and also maintain context for follow-up questions and answers.

Think of this feature as a ChatGPT-style Q&A interface, but with the data you've indexed in Typesense. 

Typesense uses a technique called [Retrieval Augmented Generation](https://www.promptingguide.ai/techniques/rag) (RAG) to enable this style of conversational searches. 

Instead of having to build your own RAG pipeline, Typesense essentially has built-in RAG using it's [Vector Store](./vector-search.md) for [semantic search](../../guide/semantic-search.md), and it's pre-built integration with LLMs for formulating conversational responses.

## Create a Conversation Model

Let's start by creating a conversation model resource, that will hold the model name and parameters.

Typesense currently supports OpenAI and Cloudflare hosted Large Language Models. 

<Tabs :tabs="['OpenAI', 'Cloudflare']">

<template v-slot:OpenAI>

```shell
curl 'http://localhost:8108/conversations/models' \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
        "model_name": "openai/gpt-3.5-turbo",
        "api_key": "OPENAI_API_KEY",
        "system_prompt": "Be concise in your responses, with just one or two sentences."
        "max_bytes": 1024
      }'
```

</template>

<template v-slot:Cloudflare>

```shell
curl 'http://localhost:8108/conversations/models' \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
        "model_name": "cf/mistral/mistral-7b-instruct-v0.1",
        "api_key": "CLOUDFLARE_API_KEY",
        "account_id": "CLOUDFLARE_ACCOUNT_ID",
        "system_prompt": "Be concise in your responses, with just one or two sentences."
        "max_bytes": 1024
      }'
```

</template>

</Tabs>

#### Parameters

| Parameter     | Description                                                                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| model_name    | Name of the LLM model offered by OpenAI or Cloudflare                                                                                                     |
| api_key       | The LLM service's API Key                                                                                                                                 |
| account_id    | LLM service's account ID (only applicable for Cloudflare)                                                                                                 |
| system_prompt | The system prompt that contains special instructions to the LLM                                                                                           |
| max_bytes     | The maximum number of bytes to send to the LLM in every API call. Consult the LLM's documentation on the number of bytes supported in the context window. |


**Response:**

This will return a response with an auto-generated conversation model ID, that we will use in our search queries:

```json
{
  "api_key": "sk-7K**********************************************",
  "id": "5a11318f-e31b-4144-81b3-b302a86571d3",
  "max_bytes": 1024,
  "model_name": "openai/gpt-3.5-turbo",
  "system_prompt": "Be concise in your responses, with just one or two sentences."
}
```

## Start a Conversation

Once we've created a conversation model, we can start a conversation using the [search](./federated-multi-search.md) endpoint and the following _search_ parameters:

- `conversation = true`
- `conversation_model_id = X`
- `q = <Any conversational question>`
- `query_by = <an auto-embedding field>`

Where `X` is the auto-generated Conversation Model ID returned by Typesense in the step above and `query_by` is an [auto-embedding field](./vector-search.md#option-b-auto-embedding-generation-within-typesense).

Here's an example, where we ask the question "Can you suggest an action series?" in the `q` parameter, using data we've indexed in a collection called `tv_shows` in Typesense.

```shell
curl 'http://localhost:8108/multi_search?q=can+you+suggest+an+action+series&conversation=true&conversation_model_id=5a11318f-e31b-4144-81b3-b302a86571d3' \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
              "searches": [
                {
                  "collection": "tv_shows",
                  "query_by": "embedding",
                  "exclude_fields": "embedding"
                }
              ]
            }'
```
**Response:**

Typesense will now return a new field in the search API response called `conversation`.

You'd display the `conversation.answer` key to your user, as the response to their question. 

```json
{
  "conversation": {
    "answer": "I would suggest \"Starship Salvage\", a sci-fi action series set in a post-war galaxy where a crew of salvagers faces dangers and ethical dilemmas while trying to rebuild.",
    "conversation_history": {
      "conversation": [
        {
          "user": "can you suggest an action series"
        },
        {
          "assistant": "I would suggest \"Starship Salvage\", a sci-fi action series set in a post-war galaxy where a crew of salvagers faces dangers and ethical dilemmas while trying to rebuild."
        }
      ],
      "id": "771aa307-b445-4987-b100-090c00a13f1b",
      "last_updated": 1694962465,
      "ttl": 86400
    },
    "conversation_id": "771aa307-b445-4987-b100-090c00a13f1b",
    "query": "can you suggest an action series"
  },
  "results": [
    {
      "facet_counts": [],
      "found": 10,
      "hits": [
        ...
      ],
      "out_of": 47,
      "page": 1,
      "request_params": {
        "collection_name": "tv_shows",
        "per_page": 10,
        "q": "can you suggest an action series"
      },
      "search_cutoff": false,
      "search_time_ms": 3908
    }
  ]
}
```

:::tip Excluding Conversation History
You can exclude conversation history from the search API response by setting `exclude_fields: conversation_history` as a search parameter.
:::

:::tip Multi-Search
When using the `multi_search` endpoint with the Conversations feature, the `q` parameter has to be set as a query parameter and not as a body parameter inside a particular search.

You can search multiple collections within the multi_search endpoint, and Typesense will use the top results from each collection when communicating with the LLM. 
:::

:::tip Auto-Embedding Model
In our experience, we've found that models that are specifically meant for Q&A use-cases (like the `ts/all-MiniLM-L12-v2` S-BERT model) perform well for conversations. You can also use OpenAI's text embedding models.
:::

## Follow-up Questions

We can continue a conversation that we started previously and ask follow-up questions, using the `conversation_id` parameter returned by Typesense, when starting a conversation.

Continuing our example from above, let's ask the follow-up question - "How about another one" in the `q` parameter:

```shell
curl 'http://localhost:8108/multi_search?q=how+about+another+one&conversation=true&conversation_model_id=5a11318f-e31b-4144-81b3-b302a86571d3&conversation_id=771aa307-b445-4987-b100-090c00a13f1b' \
        -X POST \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
              "searches": [
                {
                  "collection": "tv_shows",
                  "query_by": "embedding",
                  "exclude_fields": "embedding"
                }
              ]
            }'
```

Notice the addition of the `conversation_id` as a query parameter above. 

This parameter causes Typesense to include prior context when communicating with the LLM.

**Response:**

```json
{
  "conversation": {
    "answer": "Sure! How about \"Galactic Quest\"? It could follow a group of intergalactic adventurers as they travel through different planets and encounter various challenges and mysteries along the way.",
    "conversation_history": {
      "conversation": [
        {
          "user": "can you suggest an action series"
        },
        {
          "assistant": "I would suggest \"Starship Salvage\", a sci-fi action series set in a post-war galaxy where a crew of salvagers faces dangers and ethical dilemmas while trying to rebuild."
        },
        {
          "user": "how about another one"
        },
        {
          "assistant": "Sure! How about \"Galactic Quest\"? It follows a group of intergalactic adventurers as they travel through different planets and encounter various challenges and mysteries along the way."
        }
      ],
      "id": "771aa307-b445-4987-b100-090c00a13f1b",
      "last_updated": 1694963173,
      "ttl": 86400
    },
    "conversation_id": "771aa307-b445-4987-b100-090c00a13f1b",
    "query": "how about another one"
  },
  "results": [
    {
      "facet_counts": [],
      "found": 10,
      "hits": [
        ...
      ],
      "out_of": 47,
      "page": 1,
      "request_params": {
        "collection_name": "tv_shows",
        "per_page": 10,
        "q": "how about another one"
      },
      "search_cutoff": false,
      "search_time_ms": 3477
    }
  ]
}
```

Under the hood, for each follow-up question, Typesense makes an API call to the LLM to generate a standalone question that captures all relevant context from the conversation history, using the following prompt:

```markdown
Rewrite the follow-up question on top of a human-assistant conversation history as a standalone question that encompasses all pertinent context.

<Conversation history>
{actual conversation history without system prompts}

<Question>
{follow up question}

<Standalone Question>
```

The generated standalone question will be used for semantic/hybrid search within the collection, and the results will then be forwarded to the LLM as context for answering the generated standalone question.

:::tip Context Window Limits
Although we retain the entire conversation history in Typesense, only the most recent 3000 tokens (approximately 1200 characters) of the conversation history will be sent for generating the standalone question due to the context limit.

Similar to the conversation history, only the top search results, limited to 3000 tokens, will be sent along with the standalone question.
:::

## Managing Past Conversations

Typesense stores all questions and answers, along with a `conversation_id` parameter for 24 hours, to support follow-ups. 

Conversation histories are not tied to specific collections, making them versatile and compatible with different collections at any time.

You can manage conversation histories using the following endpoints.

### Fetch all conversations

```bash
curl 'http://localhost:8108/conversations' \
  -X GET \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

### Fetch a single conversation

```bash
curl 'http://localhost:8108/conversations/771aa307-b445-4987-b100-090c00a13f1b' \
  -X GET \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

### Update the TTL for a conversation

Conversations are stored by default for 24 hours, and then purged. 

To expire them in a different time frame, you can set a TTL like this:

```bash
curl 'http://localhost:8108/conversations/771aa307-b445-4987-b100-090c00a13f1b' \
  -X PUT \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
        "ttl": 3600
      }'
```

### Delete a conversation

```bash
curl 'http://localhost:8108/conversations/771aa307-b445-4987-b100-090c00a13f1b' \
  -X DELETE \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

## Managing Conversation Models

### Retrieve all models

```shell
curl 'http://localhost:8108/conversations/models' \
  -X GET \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

### Retrieve a single model

```shell
curl 'http://localhost:8108/conversations/models/5a11318f-e31b-4144-81b3-b302a86571d3' \
  -X GET \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

### Update a model

```shell
curl 'http://localhost:8108/conversations/models/5a11318f-e31b-4144-81b3-b302a86571d3' \
  -X PUT \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d '{
        "system_prompt": "Be elaborate in your responses"
      }'
```

### Delete a model

```shell
curl 'http://localhost:8108/conversations/models/5a11318f-e31b-4144-81b3-b302a86571d3' \
  -X DELETE \
  -H 'Content-Type: application/json' \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```