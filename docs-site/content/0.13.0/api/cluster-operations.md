# Cluster Operations

## Create Snapshot (for backups)
Creates a point-in-time snapshot of a Typesense node's state and data in the specified directory.

You can then backup the snapshot directory that gets created and later restore it as a data directory, as needed.

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>

  <template v-slot:Python>

```py
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>
  <template v-slot:Ruby>

```rb
client.operations.perform('snapshot', {'snapshot_path': '/tmp/typesense-data-snapshot'})
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/operations/snapshot?snapshot_path=/tmp/typesense-data-snapshot" -X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "success": true
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/operations/snapshot`

### Arguments
| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|snapshot_path	|yes	|The directory on the server where the snapshot should be saved.|

## Re-elect Leader
Triggers a follower node to initiate the raft voting process, which triggers leader re-election.

The follower node that you run this operation against will become the new leader, once this command succeeds.

<Tabs :tabs="['JavaScript','Python','Ruby','Shell']">
  <template v-slot:JavaScript>

```js
client.operations.perform('vote')
```

  </template>

  <template v-slot:Python>

```py
client.operations.perform('vote')
```

  </template>
  <template v-slot:Ruby>

```rb
client.operations.perform('vote')
```

  </template>
  <template v-slot:Shell>

```bash
curl "http://localhost:8108/operations/vote" -X POST \
-H "Content-Type: application/json" \
-H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"
```

  </template>
</Tabs>

#### Sample Response

<Tabs :tabs="['JSON']">
  <template v-slot:JSON>

```json
{
  "success": true
}
```

  </template>
</Tabs>

#### Definition
`POST ${TYPESENSE_HOST}/operations/vote`

