---
sitemap:
  priority: 0.3
---

# API Keys
Typesense allows you to create API Keys with fine-grain access control. You can restrict access on both a per-collection and per-action level.

:::warning
We will be using the initial bootstrap key that you started Typesense with (via `--api-key`>) to create additional keys. It's **strongly recommended** that you don't use the bootstrap API key directly in your production applications. Instead you want to generate an appropriately-scoped key for the application at hand.
:::

## Create an API Key
Let's begin by creating an API key that allows you to do all operations, i.e. it's effectively an admin key and is equivalent to the key that you start Typesense with (via `--api-key`).

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
key = client.keys().create({
  'description': 'Admin key.',
  'actions': ['*'],
  'collections': ['*']
})
```

  </template>

  <template v-slot:PHP>

```php
$key = $client->keys->create([
  'description' => 'Admin key.',
  'actions' => ['*'],
  'collections' => ['*']
])
```

  </template>
  <template v-slot:Python>

```py
key = client.keys.create({
  "description": "Admin key.",
  "actions": ["*"],
  "collections": ["*"]
})

```

  </template>
  <template v-slot:Ruby>

```rb
key = client.keys.create({
  'description' => 'Admin key.',
  'actions' => ['*'],
  'collections' => ['*']
})

```

  </template>
  <template v-slot:Shell>

```bash
curl 'http://localhost:8108/keys' -X POST -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-H 'Content-Type: application/json' \
-d '{"description":"Admin key.","actions": ["*"], "collections": ["*"]}'
```

  </template>
</Tabs>

By setting both `actions` and `collections` to a wildcard `['*']` scope, we're able to create an admin key that gives you universal access. However, you should refrain from creating such widely scoped keys.

:::warning
The generated key is only returned during creation. You want to store this key carefully in a secure place.
:::

Let's now see how we can create a search-only key that allows you to limit the key's scope to only the search action, and also for only a specific collection.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.keys().create({
  'description': 'Admin key.',
  'actions': ['documents:search'],
  'collections': ['companies']
})
```

  </template>

  <template v-slot:PHP>

```php
$client->keys->create([
  'description' => 'Search-only companies key.',
  'actions' => ['documents:search'],
  'collections' => ['companies']
])
```

  </template>
  <template v-slot:Python>

```py
client.keys.create({
  "description": "Search-only companies key.",
  "actions": ["documents:search"],
  "collections": ["companies"]
})
```

  </template>
  <template v-slot:Ruby>

```rb
client.keys.create({
  'description' => 'Search-only companies key.',
  'actions' => ['documents:search'],
  'collections' => ['companies']
})
```

  </template>
  <template v-slot:Shell>

```bash
curl 'http://localhost:8108/keys' -X POST -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
-H 'Content-Type: application/json' \
-d '{"description":"Search-only companies key.","actions": ["documents:search"], "collections": ["companies"]}'
```

  </template>
</Tabs>

By setting the `actions` scope to `["documents:search"]` and the `collections` scope to `["companies"]`, we can generate a key that is allowed to only conduct searches on the `companies` collection.

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "actions": [
    "*"
  ],
  "collections": [
    "*"
  ],
  "description": "Admin key.",
  "id": 1,
  "value": "k8pX5hD0793d8YQC5aD1aEPd7VleSuGP"
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/keys`

### Sample actions

| Action         | Description |
| -------------- | ----------- |
|`documents:search	`|Allows only search requests.|
|`documents:get	`|Allows fetching a single document.|
|`collections:delete	`|Allows a collection to be deleted.|
|`collections:create	`|Allows a collection to be created.|
|`collections:*	`|Allow all kinds of collection related operations.|
|`*	`|Allows all operations.|


## Retrieve an API Key
Retrieve (metadata about) a key.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
key = client.keys(1).retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$key = $client->keys[1]->retrieve()

```

  </template>
  <template v-slot:Python>

```py
key = client.keys[1].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
key = client.keys[1].retrieve
```

  </template>
  <template v-slot:Shell>

```bash
curl 'http://localhost:8108/keys/1' -X GET -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "actions": [ "documents:search" ],
  "collections": [ "*" ],
  "description": "Search-only key.",
  "id": 1,
  "value_prefix": "vxpx"
}
```

  </template>
</Tabs>

Notice how only the key prefix is returned when you retrieve a key. Due to security reasons, only the create endpoint returns the full API key.

#### Definition
`GET ${TYPESENSE_HOST}/keys/:id`

## List all Keys
Retrieve (metadata about) all keys.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.keys().retrieve()
```

  </template>

  <template v-slot:PHP>

```php
$client->keys->retrieve()
```

  </template>
  <template v-slot:Python>

```py
client.keys.retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.keys.retrieve
```

  </template>
  <template v-slot:Shell>

```bash
curl 'http://localhost:8108/keys' -X GET -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "keys": [
    {
      "actions": [
        "documents:search"
      ],
      "collections": [
        "users"
      ],
      "description": "Search-only key.",
      "id": 1,
      "value_prefix": "iKBT"
    },
    {
      "actions": [
        "documents:search"
      ],
      "collections": [
        "users"
      ],
      "description": "Search-only key.",
      "id": 2,
      "value_prefix": "wst8"
    }
  ]
}
```

  </template>
</Tabs>

Notice how only the key prefix is returned when you retrieve a key. Due to security reasons, only the create endpoint returns the full API key.

#### Definition
`GET ${TYPESENSE_HOST}/keys/`

## Delete API Key
Delete an API key given its ID.

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
key = client.keys(1).delete()
```

  </template>

  <template v-slot:PHP>

```php
key = client.keys(1).delete()
```

  </template>
  <template v-slot:Python>

```py
key = client.keys[1].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
key = client.keys[1].delete()
```

  </template>
  <template v-slot:Shell>

```bash
curl 'http://localhost:8108/keys/1' -X DELETE -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "id": 1
}
```

  </template>
</Tabs>

#### Definition
`DELETE ${TYPESENSE_HOST}/keys/:id`

## Generate Scoped Search Key
You can generate scoped search API keys that have embedded search parameters in them. This is useful for example when you have multi-tenant data indexed in your Typesense instance, but only want your users to access their own subset of the data.

To do this, you can embed a filter in a generated scoped search API key. When you use that key for search operations, those filters will get automatically applied and cannot be overriden.

We can generate scoped search API keys without having to make any calls to the Typesense server. We use an API key that we previously generated with a search scope, create an HMAC digest of the parameters with this key and use that as the API key. Our client libraries handle this logic for you, but you can also generate scoped search API keys from the command line.

:::warning
Remember to never expose your main search key client-side, since exposing the main search key will allow anyone to query the entire data set without your embedded search parameters.
:::

<Tabs :tabs="['JavaScript','PHP','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
keyWithSearchPermissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
client.keys().generateScopedSearchKey(keyWithSearchPermissions, {'filter_by': 'company_id:124')
```

  </template>

  <template v-slot:PHP>

```php
$keyWithSearchPermissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
$client->keys->generateScopedSearchKey($keyWithSearchPermissions, ['filter_by' => 'company_id:124')
```

  </template>
  <template v-slot:Python>

```py
key_with_search_permissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
client.keys().generate_scoped_search_key(key_with_search_permissions, {"filter_by": "company_id:124")
```

  </template>
  <template v-slot:Ruby>

```rb
key_with_search_permissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
client.keys().generate_scoped_search_key(key_with_search_permissions, {'filter_by': 'company_id:124')
```

  </template>
  <template v-slot:Shell>

```bash
KEY_WITH_SEARCH_PERMISSIONS="RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127"
EMBEDDED_SEARCH_PARAMETERS_JSON='{"filter_by":"company_id:124"}'

digest=$(echo -n $EMBEDDED_SEARCH_PARAMETERS_JSON | openssl dgst -sha256 -hmac $KEY_WITH_SEARCH_PERMISSIONS -binary | base64 -w0)

scoped_api_key=$(echo -n "${digest}${KEY_WITH_SEARCH_PERMISSIONS:0:4}${EMBEDDED_SEARCH_PARAMETERS_JSON}" | base64 -w0)

echo $scoped_api_key
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
"RDhxa2VKTnBQVkxaVlFIOS9JWDZ2bDdtMU5HL3laa0pab2pTeEUzbFBhZz1STjIzeyJmaWx0ZXJfYnkiOiJjb21wYW55X2lkOjEyNCIsImV4cGlyZXNfYXQiOjE2MTE1OTA0NjV9"

```

  </template>
</Tabs>
