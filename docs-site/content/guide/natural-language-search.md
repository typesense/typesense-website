# Natural Language Search

One of the most powerful capabilities of Large Language Models (LLMs) is their ability to turn natural language into structured data. 
In this guide, we will learn how to make use of this capability to understand a user's search query and convert it into a structured Typesense search query.

## Use-case

Let's take an example of a public [cars dataset](https://www.kaggle.com/datasets/rupindersinghrana/car-features-and-prices-dataset).
Using Google's [Gemini](https://deepmind.google/technologies/gemini/) LLM along with Typesense we can support natural language queries like the following:

- `A honda or BMW with at least 200hp, rear-wheel drive, from 20K to 50K, must be newer than 2014`
- `Show me the most powerful car you have`
- `High performance Italian cars, above 700hp`
- `I don't know how to drive a manual`

Notice how in some queries there might be multiple criteria mentioned, and in some cases the keyword itself might not be present in the dataset. 

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

## Data flow

The key idea is this:

1. Take the natural language query that the user types in
2. Send it to the LLM with specific instructions on how to convert it into a Typesense search query with the `filter_by`, `sort_by` and `q` search parameters
3. Execute a query in Typesense with those search parameters returned by the LLM and return the results

We're essentially doing something similar to Text-to-SQL, except that we're now doing Text-to-Typesense-Query, running the query and returning results. 

This seemingly simple concept helps build powerful natural language search experiences. 
The trick though with LLMs is to [refine the prompt](#writing-the-prompt) well-enough that it consistently produces a good translation of the text into valid Typesense syntax.

## Live Demo

Here's a video of what we'll be building in this guide:

<iframe width="560" height="315" src="https://www.youtube.com/embed/xyXccgMqBow?si=utqcCh9HDEnoGtmL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can also play around with it live here: [https://natural-language-search-cars-genkit.typesense.org/](https://natural-language-search-cars-genkit.typesense.org/)

Let's now see how to build this application end-to-end.

## Setting up the project

We will be using [Next.js](https://nextjs.org/) and [Genkit](https://github.com/firebase/genkit) which is a framework that makes it really easy to add generative AI in our applications. 

Follow the instructions in [Genkit's documentation](https://firebase.google.com/docs/genkit/nextjs) to learn how to initialize Genkit in a Next.js app.

Next, let's install the Typesense client and [zod](https://zod.dev/) into our app:

```shell
npm i typesense@next zod
```

The dataset we will use can be downloaded [from Github](https://github.com/typesense/showcase-generation-augmented-retrieval-genkit/blob/main/scripts/data/cars.jsonl).

## Initializing Typesense client

We will need two separate Typesense API keys:

- A search-only API key for use on the front end
- A backend API key with write access

Please refer to <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#search-only-api-key`">API Keys</RouterLink> docs on how to generate a search-only-api key. 

If you're using [Typesense Cloud](./install-typesense.md#option-1-typesense-cloud), click on the "Generate API key" button on the cluster page. This will give you a set of hostnames and API keys to use.

<Tabs :tabs="['JavaScript']">
  <template v-slot:JavaScript>

```js
import Typesense from 'typesense'
/*
 *  Our JavaScript client library works on both the server and the browser.
 *  When using the library on the browser, please be sure to use the
 *  search-only API Key rather than an admin API key since the latter
 *  has write access to Typesense and you don't want to expose that.
 */
export const typesense = ({ isServer = false } = {}) =>
  new Typesense.Client({
    apiKey:
      (isServer ? process.env.TYPESENSE_ADMIN_API_KEY : process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY) || 'xyz',
    nodes: [
      {
        url: process.env.NEXT_PUBLIC_TYPESENSE_URL || 'http://localhost:8108',
      },
    ],
    connectionTimeoutSeconds: 5,
  })
```

  </template>
</Tabs>

## Create the Typesense collection

We'll use the following schema to create a Typesense Collection and import our cars dataset into it:

<Tabs :tabs="['JavaScript']">
  <template v-slot:JavaScript>

```js
typesense({ isServer: true })
  .collections()
  .create({
    name: 'cars',
    fields: [
      { name: 'make', type: 'string', facet: true },
      { name: 'model', type: 'string', facet: true },
      { name: 'year', type: 'int32' },
      { name: 'engine_fuel_type', type: 'string', facet: true },
      { name: 'engine_hp', type: 'float' },
      { name: 'engine_cylinders', type: 'int32' },
      { name: 'transmission_type', type: 'string', facet: true },
      { name: 'driven_wheels', type: 'string', facet: true },
      { name: 'number_of_doors', type: 'int32' },
      { name: 'market_category', type: 'string[]', facet: true },
      { name: 'vehicle_size', type: 'string', facet: true },
      { name: 'vehicle_style', type: 'string', facet: true },
      { name: 'highway_mpg', type: 'int32' },
      { name: 'city_mpg', type: 'int32' },
      { name: 'popularity', type: 'int32' },
      { name: 'msrp', type: 'int32' },
    ],
  })
```

  </template>
</Tabs>

We're now ready to index the dataset into the collection we just created:

<Tabs :tabs="['JavaScript']">
  <template v-slot:JavaScript>

```js
let fs = require('fs/promises')

const carsInJsonl = await fs.readFile('cars.jsonl')
// IMPORTANT: Be sure to increase connectionTimeoutSeconds to at least 5 minutes or more for imports,
//  when instantiating the client
typesense({ isServer: true }).collections('cars').documents().import(carsInJsonl)
```

  </template>
</Tabs>

## Writing the prompt

Our goal is to translate a natural language query e.g. `'Latest Ford under 40K$'` into Typesense's query format:

```json
{
  "filter_by": "make:Ford && msrp:<40000",
  "sort_by": "year:desc"
}
```

In Genkit, the model output schema is defined using Zod.

<Tabs :tabs="['JavaScript']">
<template v-slot:JavaScript>

```js
import * as z from 'zod'

const TypesenseQuerySchema = z
  .object({
    query: z.string().describe('a full-text search query'),
    filter_by: z.string().describe('a filter query in Typesense format'),
    sort_by: z.string().describe('a sorting query in Typesense format'),
  })
  .partial()
```

  </template>
</Tabs>

We can make the LLM ouput conform to our `TypesenseQuerySchema` by specifying it in `defineDotprompt()`:

<Tabs :tabs="['JavaScript']">
  <template v-slot:JavaScript>

```js
import { defineDotprompt } from '@genkit-ai/dotprompt'

const typesensePrompt = async () =>
  defineDotprompt(
    {
      model: 'googleai/gemini-1.5-flash',
      input: {
        schema: z.object({
          query: z.string(),
        }),
      },
      output: {
        schema: TypesenseQuerySchema,
      },
      name: 'typesense-prompt',
    },
    `You are assisting a user in searching for cars. Convert their query into the appropriate Typesense query format based on the instructions below.

### Typesense Query Syntax ###

## Filtering (for the filter_by property) ##

Matching values: The syntax is {fieldName} follow by a match operator : and a string value or an array of string values each separated by a comma. Do not encapsulate the value in double quote or single quote. Examples:
- model:prius
- make:[BMW,Nissan] returns cars that are manufactured by BMW OR Nissan.

Numeric Filters: Use :[min..max] for ranges, or comparison operators like :>, :<, :>=, :<=, :=. Examples:
 - year:[2000..2020]
 - highway_mpg:>40
 - msrp:=30000

Multiple Conditions: Separate conditions with &&. Examples:
 - num_employees:>100 && country:[USA,UK]
 - categories:=Shoes && categories:=Outdoor

OR Conditions Across Fields: Use || only for different fields. Examples:
 - vehicle_size:Large || vehicle_style:Wagon
 - (vehicle_size:Large || vehicle_style:Wagon) && year:>2010

If the same field is used for filtering multiple values in an || (OR) operation, then use the multi-value OR syntax. For eg:
\`make:BMW || make:Honda || make:Ford\`
should be simplified as:
\`make:[BMW, Honda, Ford]\`

Negation: Use :!= to exclude values. Examples:
 - make:!=Nissan
 - make:!=[Nissan,BMW]

If any string values have parentheses, surround the value with backticks to escape them.

For eg, if a field has the value "premium unleaded (required)", and you need to use it in a filter_by expression, then you would use it like this:

- fuel_type:\`premium unleaded (required)\`
- fuel_type!:\`premium unleaded (required)\`

## Sorting (for the sort_by property) ##

You can only sort maximum 3 sort fields at a time. The syntax is {fieldName}: follow by asc (ascending) or dsc (descending), if sort by multiple fields, separate them by a comma. Examples:
 - msrp:desc
 - year:asc,city_mpg:desc

Sorting hints:
  - When a user says something like "good mileage", sort by highway_mpg or/and city_mpg.
  - When a user says something like "powerful", sort by engine_hp.
  - When a user says something like "latest", sort by year.

## Car properties ##

| Name | Data Type | Filter | Sort | Enum Values  | Description|
|------|-----------|--------|------|--------------|------------|
${await getCachedCollectionProperties()}

### Query (for the query property) ###
Include query only if both filter_by and sort_by are inadequate.

### User-Supplied Query ###

{{query}}

### Output Instructions ###

Provide the valid JSON with the correct filter and sorting format, only include fields with non-null values. Do not add extra text or explanations.`,
  )
```

  </template>
</Tabs>

### Dynamic Prompt based on the Schema

Notice the `getCachedCollectionProperties()` function in the prompt above.

That function essentially converts the Typesense collection schema into a tabular format with a list of field names and sample enum values in each field. 
We're using a markdown format to help the LLM recognize these field values in the query and convert them into appropriate field filters.

Here's an example of what the output of that function could look like:

```markdown
## Car properties ##

| Name | Data Type | Filter | Sort | Enum Values  | Description|
|------|-----------|--------|------|--------------|------------|
```

Here's how that function looks:

<Tabs :tabs="['JavaScript']">
<template v-slot:JavaScript>

```js
async function getCollectionProperties() {
  const collection = await typesense({ isServer: true }).collections('cars').retrieve()
  const facetableFields = []
  const rows = []

  collection.fields?.forEach(field => {
    if (field.facet) {
      facetableFields.push(field)
    } else {
      const { name, type, sort } = field
      rows.push(
        // prettier-ignore
        `| ${name} | ${type} | Yes | ${booleanToYesNo(sort)} | N/A | ${collection.metadata?.[name] || ''} |`,
      )
    }
  })

  const facetValues = await typesense()
    .collections('cars')
    .documents()
    .search({
      q: '*',
      facet_by: facetableFields?.map(({ name }) => name).join(','),
      max_facet_values: MAX_FACET_VALUES + 1, // plus 1 so we can check if any fields exceed the limit
    })

  const facetableRows = facetableFields?.map(({ type, name, sort }, i) => {
    const counts = facetValues.facet_counts?.[i].counts
    const exceedMaxNumValues =
      counts && counts?.length > MAX_FACET_VALUES ? 'There are more enum values for this field' : 'N/A'
    const enums = counts?.map(item => item.value).join(', ')
    // prettier-ignore
    return `| ${name} | ${type} | Yes | ${booleanToYesNo(sort)} | ${enums} | ${collection.metadata?.[name] || ''
    } ${exceedMaxNumValues} |`;
  })
  return rows.concat(facetableRows).join('\n')
}

function booleanToYesNo(bool: boolean | null | undefined) {
  return bool ? 'Yes' : 'No'
}
```

  </template>
</Tabs>

For facet enabled fields, we can supply facet values to the LLM via the `Enum Values` column by making a search request with `q: "*", facet_by: field`. When a collection has too many facet values to fit in the prompt, the number of values returned can be limited using the `max_facet_values` parameter.

We can add and update the field description by updating our collection metadata. Let's specify the currency for our `msrp` field (manufacturer's suggested retail price) as USD.

<Tabs :tabs="['JavaScript']">
<template v-slot:JavaScript>

```js
await typesense.collections('cars').update({
  metadata: {
    msrp: 'in USD',
  },
})
```

  </template>
</Tabs>

Since fetching the collection properties everytime the user make a search request is expensive, we will cache its response using Nextjs `unstable_cache`.

<Tabs :tabs="['JavaScript']">
<template v-slot:JavaScript>

```js
import { unstable_cache } from 'next/cache'

const getCachedCollectionProperties = unstable_cache(async () => await getCollectionProperties(), [], {
  tags: ['getCollectionProperties'],
  revalidate: false, // Since the Typesense data for this demo is static, we will cache the response indefinitely.
})
```

  </template>
</Tabs>

## Integrate with Typesense

Let's now integrate our dynamic prompt into our application:

<Tabs :tabs="['JavaScript']">
  <template v-slot:JavaScript>

```js
'use server'
import { configureGenkit } from '@genkit-ai/core'
import { defineFlow, runFlow } from '@genkit-ai/flow'
import { googleAI } from '@genkit-ai/googleai'
import { TypesenseQuerySchema } from '@/schemas/typesense'

configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
})

const generateTypesenseQuery = defineFlow(
  {
    name: 'generateTypesenseQuery',
    inputSchema: z.string(),
    outputSchema: TypesenseQuerySchema,
  },
  async query => {
    const llmResponse = await typesensePrompt().generate({
      model: 'googleai/gemini-1.5-flash-latest',
      input: { query },
    })
    return llmResponse.output()
  },
)

export async function callGenerateTypesenseQuery(query: string) {
  return await runFlow(generateTypesenseQuery, query)
}
```

  </template>
</Tabs>

Finally, we can call the server action and use its response to make a search request to Typesense.

<Tabs :tabs="['JavaScript']">
  <template v-slot:JavaScript>

```js
async function getCars(q: string) {
  const generatedQ = await callGenerateTypesenseQuery(q)

  const params = {
    q: generatedQ.query || '*',
    filter_by: generatedQ.filter_by || '',
    sort_by: generatedQ.sort_by || '',
  }

  const searchResponse = await typesense()
    .collections('cars')
    .documents()
    .search({
      ...params,
      query_by: 'make,model,market_category',
      per_page: 12,
    })

  console.log(searchResponse)
}
```

  </template>
</Tabs>

That's it! Our users can now use natural language to search for cars and the intended filters will automatically be applied!

Keep in mind that LLMs may occasionally misunderstand queries or generate Typesense queries that are invalid. In such cases, tweaking the prompt to handle specific edge cases or incorporating fallback logic can ensure better results over time.

You can find the [full source code](https://github.com/typesense/showcase-generation-augmented-retrieval-genkit) of the demo application on GitHub and a live demo [here](https://natural-language-search-cars-genkit.typesense.org/).
