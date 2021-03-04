## Retrieve a collection
Retrieve the details of a collection, given its name.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').retrieve()
```

  </template>

  <template v-slot:Php>

```php
$client->collections['companies']->retrieve()
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].retrieve()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].retrieve
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET
    "http://localhost:8108/collections/companies"
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "num_documents": 1250,
  "fields": [
    {"name": "company_name", "type": "string"},
    {"name": "num_employees", "type": "int32"},
    {"name": "country", "type": "string", "facet": true}
  ],
  "default_sorting_field": "num_employees"
}
```

  </template>
</Tabs>

### Definition
`GET ${TYPESENSE_HOST}/collections/:collection`