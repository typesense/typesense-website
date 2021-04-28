# Scoped API Keys

Typesense is designed with security and fine-grained access control in mind. To perform any action with Typesense, you need API keys. Typesense also allows access control on API keys. You can define capabilities as to what a user can or cannot do. You can also restrict access to a specific document or collection. In the case of a multi-tenant environment, you can scope API keys to a particular subset. This is helpful when you have indexed data from multiple tenants in your Typesense server and want to restrict users to only access their subset of data.

Typesense allows you to create API keys that have pre-defined filters embedded in them. So, whenever you run a search query with these API keys, those filters are automatically applied and cannot be overridden. You can then provide those search API keys to users and they would only be able to access the data that is allowed by the set filter. To create scoped API keys, you just need a parent key.

Let's take example of a [company collection](../../api/collections.html#create-a-collection), that has the following documents:

```shell
{"company_id":124,"company_name":"Stark Industries","country":"USA","id":"0","num_employees":3355}
{"company_id":125,"company_name":"Wayne Enterprises","country":"USA","id":"1","num_employees":4538}
{"company_id":126,"company_name":"Daily Planet","country":"USA","id":"2","num_employees":2232}
{"company_id":127,"company_name":"New Stark Industries","country":"USA","id":"3","num_employees":7945}
```

Now, let's create a scoped API key that will restrict access to documents that have the `company_id` value as 124. 

<Tabs :tabs="['JavaScript','PHP','Python','Ruby', 'Shell']">
  <template v-slot:JavaScript>

```javascript
keyWithSearchPermissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
client.keys().generateScopedSearchKey(keyWithSearchPermissions, {'filter_by': 'company_id:124', 'expires_at': 1611590465})
```
  </template>

  <template v-slot:PHP>

```php
$keyWithSearchPermissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127';
$client->keys()->generateScopedSearchKey($keyWithSearchPermissions, ['filter_by' => 'company_id:124', 'expires_at' => 1611590465]);
```
  </template>
  <template v-slot:Python>

```python
key_with_search_permissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
client.keys().generate_scoped_search_key(key_with_search_permissions, {"filter_by": "company_id:124", "expires_at": 1611590465})
```
   </template>
   <template v-slot:Ruby>

```ruby
key_with_search_permissions = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
client.keys().generate_scoped_search_key(key_with_search_permissions, {'filter_by': 'company_id:124', 'expires_at': 1611590465})
```
  </template>
  <template v-slot:Shell>

```bash
KEY_WITH_SEARCH_PERMISSIONS="RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127"
EMBEDDED_SEARCH_PARAMETERS_JSON='{"filter_by":"company_id:124","expires_at":1611590465}'

digest=$(echo -n $EMBEDDED_SEARCH_PARAMETERS_JSON | openssl dgst -sha256 -hmac $KEY_WITH_SEARCH_PERMISSIONS -binary | base64)

scoped_api_key=$(echo -n "${digest}${KEY_WITH_SEARCH_PERMISSIONS:0:4}${EMBEDDED_SEARCH_PARAMETERS_JSON}" | base64)

echo $scoped_api_key
```

  </template>
</Tabs>

Sample response:

```json
"RDhxa2VKTnBQVkxaVlFIOS9JWDZ2bDdtMU5HL3laa0pab2pTeEUzbFBhZz1STjIzeyJmaWx0ZXJfYnkiOiJjb21wYW55X2lkOjEyNCIsImV4cGlyZXNfYXQiOjE2MTE1OTA0NjV9"
```

The `expires_at` parameter sets the expiration date for the API key and must be less that the expiration of parent API key. Let's perform a search using the scoped API key:

<Tabs :tabs="['JavaScript','PHP','Python','Ruby']">
  <template v-slot:JavaScript>

```javascript
let searchParameters = {
  'q'         : 'Stark',
  'query_by'  : 'company_name',
  'sort_by'   : 'num_employees:desc'
}

client.collections('companies')
  .documents()
  .search(searchParameters)
  .then(function (searchResults) {
    console.log(searchResults)
  })
```
  </template>

  <template v-slot:PHP>

```php
$$searchParameters = [
  'q'         => 'Stark',
  'query_by'  => 'company_name',
  'sort_by'   => 'num_employees:desc'
]

$client->collections['companies']->documents->search($searchParameters)
```
  </template> 
  <template v-slot:Python>

```python
search_parameters = {
  'q'         : 'Stark',
  'query_by'  : 'company_name',
  'sort_by'   : 'num_employees:desc'
}

client.collections['companies'].documents.search(search_parameters)
```
   </template>
   <template v-slot:Ruby>

```ruby
search_parameters = {
  'q'         => 'Stark',
  'query_by'  => 'company_name',
  'sort_by'   => 'num_employees:desc'
}

client.collections['companies'].documents.search(search_parameters)
```
  </template>
</Tabs>


Response:

```json
{
   "facet_counts": [],
   "found": 1,
   "hits": [
      {
         "document": {
            "company_id": 124,
            "company_name": "Stark Industries",
            "country": "USA",
            "id": "0",
            "num_employees": 3355
         },
         "highlights": [
            {
               "field": "company_name",
               "matched_tokens": [
                  "Stark"
               ],
               "snippet": "<mark>Stark</mark> Industries"
            }
         ],
         "text_match": 130816
      }
   ],
   "out_of": 4,
   "page": 1,
   "request_params": {
      "collection_name": "companies",
      "per_page": 10,
      "q": "stark"
   },
   "search_time_ms": 0
}
```

As you see in the response, the document with `company_id` set to 124 is shown in the output. There is another document that has the `company_name` as "New Stark Industries", but it won't be shown in the result. 

You can find more details about scoped API keys [here](../../api/api-keys.html#generate-scoped-search-key).
