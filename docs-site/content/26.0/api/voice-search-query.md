---
sidebarDepth: 2
sitemap:
  priority: 0.7
---

# Voice Query

You can send a short audio clip to Typesense and use that as a basis for query text. The voice clip will have to be sent as a base64 encoded 
data, which Typesense will transcribe through a pre-configured voice query model.

## Configure voice query model

To use the voice query feature, we should first associate a voice query model with the collection:

```json
{
    "name": "products",
    "fields": [
        {"name": "name", "type": "string"}
    ],
    "voice_query_model": {
        "model_name": "ts/whisper/base.en"
    }
}
```

## Multi search using voice query

Your audio file MUST be in 16 khz 16-bit WAV format. You should convert your audio file to this format before base64 encoding it. 
You can use following script to convert with `ffmpeg`:

```shell
ffmpeg -i <your_file> -ar 16000 -ac 1 -c:a pcm_s16le voice_query.wav
```

You'd then send the base64 encoded audio data via the multi_search API.

:::tip
Since `GET /documents/search` endpoint has a limit for query text length, you should use multi search for voice queries.
:::

```json
{
    "searches": [
        {
            "collection": "products",
            "query_by": "name",
            "voice_query": "<base64 encoded audio file>"
        }
    ]
}
```

Like text embedding models, Whisper models will run on GPU if you configure Typesense with [GPU support](../../guide/install-typesense.md#using-a-gpu-optional) 
or choose a GPU-enabled instance on Typesense Cloud.

Here's a simple script you can use to record a 5s speech clip from the command line using `sox`, base64 encode it and send it to Typesense in a curl request:

```shell
VOICE_QUERY=$(sox -d -r 16000 -b 16 -c 1 -e signed-integer output.wav trim 0 5 && cat output.wav | base64)

curl 'http://localhost/multi_search' \
      -X 'POST' \
      -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
      --data-binary '
          {
            "searches": [
              {
                "collection": "products",
                "query_by": "name",
                "voice_query": "'${VOICE_QUERY}'"
              }
            ]
          }
      '
```
