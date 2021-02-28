# Export documents from a collection

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.collections('companies').documents().export()
```

  </template>

  <template v-slot:Php>

```php
$client->collections['companies']->documents->export()
```

  </template>
  <template v-slot:Python>

```py
client.collections['companies'].documents.export()
```

  </template>
  <template v-slot:Ruby>

```rb
client.collections['companies'].documents.export
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X GET
    "http://localhost:8108/collections/companies/documents/export"
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```jsonlines
{"id": "124", "company_name": "Stark Industries", "num_employees": 5215,\
"country": "US"}
{"id": "125", "company_name": "Future Technology", "num_employees": 1232,\
"country": "UK"}
{"id": "126", "company_name": "Random Corp.", "num_employees": 531,\
"country": "AU"}
```

  </template>
</Tabs>

### Definition
`GET ${TYPESENSE_HOST}/collections/:collection/documents/export`