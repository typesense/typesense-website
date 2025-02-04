---
sidebarDepth: 1
sitemap:
  priority: 0.7
---

# Stemming

Stemming is a technique that helps handle variations of words during search. When stemming is enabled, a search for one form of a word will also match other grammatical forms of that word. For example:

- Searching for "run" would match "running", "runs", "ran"
- Searching for "walk" would match "walking", "walked", "walks"
- Searching for "company" would match "companies"

Typesense provides two approaches to handle word variations:

## Basic Stemming

Basic stemming uses the [Snowball stemmer](https://snowballstem.org/) algorithm to automatically detect and handle word variations. Being rules-based, it works well for common word patterns in the configured language, but may produce unintended side effects with brand names, proper nouns, and locations. Since these rules are designed primarily for common nouns, applying them to specialized content like company names or locations can sometimes degrade search relevance.

To enable basic stemming for a field, set `"stem": true` in your collection schema:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections" -X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "name": "companies",
  "fields": [
    {"name": "description", "type": "string", "stem": true}
  ]
}'
```

  </template>
</Tabs>

The language used for stemming is automatically determined from the `locale` parameter of the field. For example, setting `"locale": "fr"` will use French-specific stemming rules.

## Custom Stemming Dictionaries

For cases where you need more precise control over word variations, or when dealing with irregular forms that algorithmic stemming can't handle well, you can use stemming dictionaries. These allow you to define exact mappings between words and their root forms.

### Pre-made Dictionaries

Typesense provides a pre-made English plurals dictionary that handles common singular/plural variations. You can download it [here](dl.typesense.org/data/stemming/plurals_en_v1.jsonl) 

This dictionary is particularly useful when you need reliable handling of English plural forms without the potential side effects of algorithmic stemming.

### Creating a Stemming Dictionary

First, create a JSONL file with your word mappings:

```json
{"word": "people", "root": "person"}
{"word": "children", "root": "child"}
{"word": "geese", "root": "goose"}
```

Then upload it using the stemming dictionary API:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/stemming/dictionaries/import?id=irregular-plurals" \
-X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
--data-binary @dictionary.jsonl
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": "irregular-plurals",
  "words": [
    {"root": "person", "word": "people"},
    {"root": "child", "word": "children"},
    {"root": "goose", "word": "geese"}
  ]
}
```

  </template>
</Tabs>

### Using a Stemming Dictionary

To use a stemming dictionary, specify it in your collection schema using the `stem_dictionary` parameter:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections" -X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
  "name": "companies",
  "fields": [
    {"name": "title", "type": "string", "stem_dictionary": "irregular-plurals"}
  ]
}'
```

  </template>
</Tabs>

:::tip Combining Both Approaches
You can use both basic stemming (`"stem": true`) and dictionary stemming (`"stem_dictionary": "dictionary_name"`) on the same field. When both are enabled, dictionary stemming takes precedence for words that exist in the dictionary.
:::

### Managing Dictionaries

#### Retrieve a Dictionary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/stemming/dictionaries/irregular-plurals"
```

  </template>
</Tabs>

#### List All Dictionaries

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
"http://localhost:8108/stemming/dictionaries"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "dictionaries": ["irregular-plurals", "company-terms"]
}
```

  </template>
</Tabs>

## Best Practices

1. **Start with Basic Stemming**: For most use cases, basic stemming with the appropriate locale setting will handle common word variations well.

2. **Use Dictionaries for Exceptions**: Add stemming dictionaries when you need to handle:
   - Domain-specific variations
   - Cases where basic stemming doesn't give desired results

3. **Language-Specific Considerations**: Remember that basic stemming behavior changes based on the `locale` parameter. Set this appropriately for your content's language.
