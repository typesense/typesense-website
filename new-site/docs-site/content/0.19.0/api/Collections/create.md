## Create a collection
When a `collection` is created, we give it a name and describe the fields that will be indexed from the documents that are added to the `collection`.

Your documents can contain other fields not mentioned in the collection's schema - they will be stored but not indexed.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let schema = {
  'name': 'companies',
  'num_documents': 0,
  'fields': [
    {
      'name': 'company_name',
      'type': 'string',
      'facet': false
    },
    {
      'name': 'num_employees',
      'type': 'int32',
      'facet': false
    },
    {
      'name': 'country',
      'type': 'string',
      'facet': true
    }
  ],
  'default_sorting_field': 'num_employees'
}

client.collections().create(schema)
```

  </template>

  <template v-slot:Php>

```php
$schema = [
  'name'      => 'companies',
  'fields'    => [
    [
      'name'  => 'company_name',
      'type'  => 'string'
    ],
    [
      'name'  => 'num_employees',
      'type'  => 'int32'
    ],
    [
      'name'  => 'country',
      'type'  => 'string',
      'facet' => true
    ]
  ],
  'default_sorting_field' => 'num_employees'
]

$client->collections->create($schema)
```

  </template>
  <template v-slot:Python>

```py
schema = {
  'name': 'companies',
  'fields': [
    {
      'name'  :  'company_name',
      'type'  :  'string'
    },
    {
      'name'  :  'num_employees',
      'type'  :  'int32'
    },
    {
      'name'  :  'country',
      'type'  :  'string',
      'facet' :  True
    }
  ],
  'default_sorting_field': 'num_employees'
}

client.collections.create(schema)
```

  </template>
  <template v-slot:Ruby>

```rb
schema = {
  'name'      => 'companies',
  'fields'    => [
    {
      'name'  => 'company_name',
      'type'  => 'string'
    },
    {
      'name'  => 'num_employees',
      'type'  => 'int32'
    },
    {
      'name'  => 'country',
      'type'  => 'string',
      'facet' => true
    }
  ],
  'default_sorting_field' => 'num_employees'
}

client.collections.create(schema)
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections" -X POST -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -d '{
         "name": "companies",
         "fields": [
           {"name": "company_name", "type": "string" },
           {"name": "num_employees", "type": "int32" },
           {"name": "country", "type": "string", "facet": true }
         ],
         "default_sorting_field": "num_employees"
       }'
```

  </template>
</Tabs>

### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "name": "companies",
  "num_documents": 0,
  "fields": [
    {"name": "company_name", "type": "string" },
    {"name": "num_employees", "type": "int32" },
    {"name": "country", "type": "string", "facet": true }
  ],
  "default_sorting_field": "num_employees"
}
```

  </template>
</Tabs>

### Definition
`POST ${TYPESENSE_HOST}/collections`

### Arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|name	|yes	|Name of the collection you wish to create. |
|fields	|yes	|A list of fields that you wish to index for querying, filtering and faceting. For each field, you have to specify the `name` and `type`.<br><br>**Declaring a field as optional**<br>A field can be declared as optional by setting `"optional": true`.<br><br>**Declaring a field as a facet**<br>A field can be declared as a facetable field by setting `"facet": true`.<br><br>Faceted fields are indexed verbatim without any tokenization or preprocessing. For example, if you are building a product search, `color` and `brand` could be defined as facet fields.|
|default_sorting_field	|yes	|The name of an `int32 / float` field that determines the order in which the search results are ranked when a `sort_by` clause is not provided during searching. This field must indicate some kind of popularity. For example, in a product search application, you could define `num_reviews` field as the `default_sorting_field`.<br><br>Additionally, when a word in a search query matches multiple possible words (either because of a typo or during a prefix search), this parameter is used to rank such equally matching tokens. For e.g. both "john" and "joan" are 1-typo away from "jofn". Similarly, in a prefix search, both "apple" and "apply" would match the prefix "app".|

### Supported search field types
Typesense allows you to index the following types of fields:


<table>
  <tr>
    <td>string</td>
  </tr>
  <tr>
    <td>int32</td>
  </tr>
  <tr>
    <td>int64</td>
  </tr>
  <tr>
    <td>float</td>
  </tr>
  <tr>
    <td>bool</td>
  </tr>
</table>

You can define an array or multi-valued field by suffixing a [] at the end:

<table>
  <tr>
    <td>string[]</td>
  </tr>
  <tr>
    <td>int32[]</td>
  </tr>
  <tr>
    <td>int64[]</td>
  </tr>
  <tr>
    <td>float[]</td>
  </tr>
  <tr>
    <td>bool[]</td>
  </tr>
</table>