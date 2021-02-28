# Update a document
Update an individual document from a collection by using its id. The update can be partial, as shown below:

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let document = {
  'company_name': 'Stark Industries',
  'num_employees': 5500
}

client.collections('companies').documents('124').update(document)
```

  </template>

  <template v-slot:Php>

```php
$document = [
  'company_name'  => 'Stark Industries',
  'num_employees' => 5500
]

$client->collections['companies']->documents['124']->update($document)
```

  </template>
  <template v-slot:Python>

```py
document = {
  'company_name': 'Stark Industries',
  'num_employees': 5500
}

client.collections['companies'].documents['124'].update(document)
```

  </template>
  <template v-slot:Ruby>

```rb
document = {
  'company_name'  => 'Stark Industries',
  'num_employees' => 5500
}

client.collections['companies'].documents['124'].update(document)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents/124" -X PATCH \
        -H "Content-Type: application/json" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
        -d '{
          "company_name": "Stark Industries",
          "num_employees": 5500
        }'
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "company_name": "Stark Industries",
  "num_employees": 5500
}
```

  </template>
</Tabs>

### Definition
`PATCH ${TYPESENSE_HOST}/collections/:collection/documents/:id`