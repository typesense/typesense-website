# Drop a collection
Permanently drops a collection. This action cannot be undone. For large collections, this might have an impact on read latencies.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').delete()
```

  </template>

  <template v-slot:Php>

```php
$client->collections['companies']->delete()
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].delete()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].delete
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X DELETE
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
`DELETE ${TYPESENSE_HOST}/collections/:collection`