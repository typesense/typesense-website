# Import documents into a collection
The documents to be imported can be either an array of document objects or be formatted as a newline delimited JSON string (see [JSONL](https://jsonlines.org/)).

**Indexing multiple documents at the same time**
You can index multiple documents via the import API.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
let documents = [{
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}]

client.collections('companies').documents().import(documents, {action: 'create'})
```

  </template>

  <template v-slot:Php>

```php
$documents = [[
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
]]

$client->collections['companies']->documents->import($documents, ['action' => 'create'])
```

  </template>
  <template v-slot:Python>

```py
documents = [{
  'id': '124',
  'company_name': 'Stark Industries',
  'num_employees': 5215,
  'country': 'USA'
}]

client.collections['companies'].documents.import_(documents, {'action': 'create'})
```

  </template>
  <template v-slot:Ruby>

```rb
documents = [{
  'id'            => '124',
  'company_name'  => 'Stark Industries',
  'num_employees' => 5215,
  'country'       => 'USA'
}]

client.collections['companies'].documents.import(documents, action: 'create')
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/collections/companies/documents/import?action=create" \
        -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" 
        -X POST 
        -d '[{
              "id": "124",
              "company_name": "Stark Industries",
              "num_employees": 5215,
              "country": "USA"
            }]'
```

  </template>
</Tabs>

The other allowed `action` modes are `upsert` and `update`.

**Action modes**

<table>
    <tr>
        <td>create (default)</td>
        <td>Creates a new document. Fails if a document with the same id already exists</td>
    </tr>
    <tr>
        <td>upsert</td>
        <td>	Creates a new document or updates an existing document if a document with the same id already exists.</td>
    </tr>
    <tr>
        <td>update	</td>
        <td>Updates an existing document. Fails if a document with the given id does not exist.</td>
    </tr>
</table>

**Importing a JSONL file**

You can feed the output of a Typesense export operation directly as import to the import end-point since both use JSONL.

Here's an example file:

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```jsonlines
{"id": "1", "company_name": "Stark Industries", "num_employees": 5215, "country": "USA"}
{"id": "2", "company_name": "Orbit Inc.", "num_employees": 256, "country": "UK"}
```

  </template>
</Tabs>

You can import the above `documents.jsonl` file like this.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
const documentsInJsonl = await fs.readFile("documents.jsonl");
client.collections('companies').documents().import(documentsInJsonl, {action: 'create'});
```

  </template>

  <template v-slot:Php>

```php
$documentsInJsonl = file_get_contents('documents.jsonl');
client.collections['companies'].documents.import($documentsInJsonl, ['action' => 'create'])
```

  </template>
  <template v-slot:Python>

```py
with open('documents.jsonl') as jsonl_file:
  client.collections['companies'].documents.import_jsonl(jsonl_file.read(), {'action': 'create'})
```

  </template>
  <template v-slot:Ruby>

```rb
documents_jsonl = File.read('documents.jsonl')
collections['companies'].documents.import(documents_jsonl, action: 'create')

```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import?action=create"

```

  </template>
</Tabs>

In the example above, we're importing the documents with the `action` flag set to `create`. This means that the documents will be inserted only if a document with the same `id` is not already found.

As we have seen earlier, you can also use the `upsert` and `update` actions. If you don't provide an `action`, the default mode is `create`.

### Configuring the batch size used for import
By default, Typesense ingests 40 documents at a time into Typesense. To increase this value, use the `batch_size` parameter.

<Tabs :tabs="['JavaScript','Php','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
const documentsInJsonl = await fs.readFile("documents.jsonl");
client.collections('companies').documents().import(documentsInJsonl, {batch_size: 100});
```

  </template>

  <template v-slot:Php>

```php
$documentsInJsonl = file_get_contents('documents.jsonl');
client.collections['companies'].documents.import($documentsInJsonl, ['batch_size' => 100])
```

  </template>
  <template v-slot:Python>

```py
with open('documents.jsonl') as jsonl_file:
  client.collections['companies'].documents.import_jsonl(jsonl_file.read(), {'batch_size': 100})
```

  </template>
  <template v-slot:Ruby>

```rb
ddocuments_jsonl = File.read('documents.jsonl')
collections['companies'].documents.import(documents_jsonl, batch_size: 100)
```

  </template>
  <template v-slot:Shell>

```bash
curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" -X POST --data-binary @documents.jsonl \
"http://localhost:8108/collections/companies/documents/import?batch_size=100"
```

  </template>
</Tabs>

**NOTE**: Larger batch sizes will consume larger transient memory during import.

### Sample response

<Tabs :tabs="['JSONLines']">
  <template v-slot:JSONLines>

```jsonlines
{"success": true}
{"success": true}
```

  </template>
</Tabs>

Each line of the response indicates the result of each document present in the request body (in the same order). If the import of a single document fails, it does not affect the other documents.

If there is a failure, the response line will include a corresponding error message and as well as the actual document content. For example, the second document had an import failure in the following response:

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{"success": true}
{"success": false, "error": "Bad JSON.", "document": "[bad doc"}
```

  </template>
</Tabs>

### Definition
`POST ${TYPESENSE_HOST}/collections/:collection/documents/import`

