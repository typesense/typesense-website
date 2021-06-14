---
sitemap:
  priority: 0.3
---

# Updating Typesense
The process of updating Typesense is simple:

1. Install the new version of Typesense
2. Restart the server

You won't need to re-index any of your documents.

So if you used the Docker image, just stop the running container, then run `docker run` with the new version. Make sure you pass the same arguments to `docker` run as before.

If you installed Typesense with one of the prebuilt binaries or from one of the package managers, just download the new version of Typesense, replace the binary, or use the package manager to upgrade the DEB/RPM and restart the process.

::: tip
If you are running Typesense in clustered mode for high availability, make sure you update the nodes one at a time. Wait until the `/health` endpoint responds with the status code `200` before updating the next node.
:::

### Updating via Docker
<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
docker stop <container_id>

docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:0.19.0 \
  --data-dir /data --api-key=$TYPESENSE_API_KEY
```
  </template>
</Tabs>

### Updating RPM package

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.19.0/typesense-server-0.19.0-1.x86_64.rpm

sudo yum install ./typesense-server-0.19.0-1.x86_64.rpm

sudo systemctl restart typesense-server.service
```

  </template>
</Tabs>

### Updating DEB package

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.19.0/typesense-server-0.19.0-amd64.deb

sudo apt install ./typesense-server-0.19.0-amd64.deb

sudo systemctl restart typesense-server.service
```

  </template>
</Tabs>

### Updating Linux binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.19.0/typesense-server-0.19.0-linux-amd64.tar.gz

tar xvzf ./typesense-server-0.19.0-linux-amd64.tar.gz

mv ./typesense-server $PATH_TO_EXISTING_BINARY

## Finally Restart the Typesense process

```

  </template>
</Tabs>

### Updating Mac binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.19.0/typesense-server-0.19.0-darwin-amd64.tar.gz

tar xvzf ./typesense-server-0.19.0-darwin-amd64.tar.gz

mv ./typesense-server $PATH_TO_EXISTING_BINARY

## Finally Restart the Typesense process

```

  </template>
</Tabs>
