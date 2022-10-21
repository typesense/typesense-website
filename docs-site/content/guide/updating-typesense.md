# Updating Typesense

## Typesense Cloud

If you're on Typesense Cloud: 

1. Visit your cluster's dashboard page.
2. Click on "Modify Configuration" on the right pane under "Configuration".
3. Click on "Pick an Upgrade Window"

Once the upgrade is complete, you will receive an email notification to the Cluster Alerts email address you've set in your account page.

**Note**: 

- For single-node non-HA clusters, there will be a downtime of about 5-30 minutes depending on the size of your dataset while the upgrade happens.
- For multi-node HA and SDN clusters, the upgrade will happen one node at a time, so the other nodes in the cluster will continue to serve traffic and you should see a zero-downtime upgrade.

## Typesense Self-Hosted

The process of updating Typesense is simple:

1. Install the new version of Typesense
2. Restart the server

You won't need to re-index any of your documents.

So if you used the Docker image, just stop the running container, then run `docker run` with the new version. Make sure you pass the same arguments to `docker` run as before.

If you installed Typesense with one of the prebuilt binaries or from one of the package managers, just download the new version of Typesense, replace the binary, or use the package manager to upgrade the DEB/RPM and restart the process.

::: warning Important
If you are running Typesense in clustered mode for high availability, make sure you update the nodes **one at a time**. Wait until the `/health` endpoint responds with the status code `200` on the node you just updated, before updating the next node.
:::

### Updating via Docker
<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
docker stop <container_id>

docker run -p 8108:8108 -v$(pwd)/typesense-data:/data typesense/typesense:0.23.1 \
  --data-dir /data --api-key=$TYPESENSE_API_KEY
```
  </template>
</Tabs>

### Updating RPM package

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.23.1/typesense-server-0.23.1-1.x86_64.rpm

sudo yum install ./typesense-server-0.23.1-1.x86_64.rpm

sudo systemctl restart typesense-server.service
```

  </template>
</Tabs>

### Updating DEB package

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.23.1/typesense-server-0.23.1-amd64.deb

sudo apt install ./typesense-server-0.23.1-amd64.deb

sudo systemctl restart typesense-server.service
```

  </template>
</Tabs>

### Updating Linux binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.23.1/typesense-server-0.23.1-linux-amd64.tar.gz

tar xvzf ./typesense-server-0.23.1-linux-amd64.tar.gz

mv ./typesense-server $PATH_TO_EXISTING_BINARY

kill <TYPESENSE_PROCESS_ID> # will gracefully shutdown

## Finally, run Typesense server binary again

```

  </template>
</Tabs>

### Updating Mac binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
wget https://dl.typesense.org/releases/0.19.0/typesense-server-0.23.1-darwin-amd64.tar.gz

tar xvzf ./typesense-server-0.23.1-darwin-amd64.tar.gz

mv ./typesense-server $PATH_TO_EXISTING_BINARY

kill <TYPESENSE_PROCESS_ID> # will gracefully shutdown

## Finally, run Typesense server binary again

```

  </template>
</Tabs>

### Updating on macOS via Homebrew

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
brew services stop typesense-server

brew install typesense/tap/typesense-server@0.23.1

brew services start typesense-server
```

  </template>
</Tabs>
