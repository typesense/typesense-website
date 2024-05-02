# Updating Typesense

## Typesense Cloud

If you're running Typesense on Typesense Cloud: 

1. Click on the "Clusters" link on the top nav bar after logging in.
2. Click on your Typesense Cloud cluster's dashboard link
3. Click on the "Cluster Configuration" section in the left pane
4. Click on the "Modify" button on the top of the page
5. On the next screen, you'll be able to pick an upgrade timeframe, and then specify which configuration parameters you want to change
6. Click on "Schedule Change" at the bottom of the page

Once the upgrade is complete, you will receive an email notification to the Cluster Alerts email address you've set in your account page.

We support the following configuration changes in Typesense Cloud:
* Upgrading Typesense Server versions
* Downgrading Typesense Server versions (when supported by a version)
* Upgrading or Downgrading RAM
* Upgrading or Downgrading CPU cores
* Enabling or disabling High Performance disk
* Enabling or disabling GPU Acceleration
* Enabling High Availability

For all other types of configuration changes, you would have to provision a new cluster with the desired configuration and reindex your data in it.

**Note**: 

- For single-node non-HA clusters, there will be a downtime of about 5-60 minutes depending on the size of your dataset while the upgrade happens.
- For multi-node HA and SDN clusters, the upgrade will happen one node at a time, so the other nodes in the cluster will continue to serve traffic and you should see a zero-downtime upgrade. Learn more [here](https://typesense-cloud.helpscoutdocs.com/article/10-high-availability).

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
    <div class="manual-highlight">
      <pre class="language-bash"><code>docker stop &lt;container_id&gt;
<br>
docker run -p 8108:8108 \
            -v"$(pwd)"/typesense-data:/data typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }} \
            --data-dir /data \
            --api-key=$TYPESENSE_API_KEY \
            --enable-cors</code></pre>
    </div>
  </template>
</Tabs>

### Updating RPM package

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code># x64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-1.x86_64.rpm
sudo yum install ./typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-1.x86_64.rpm
<br>
# arm64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-1.arm64.rpm
sudo yum install ./typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-1.arm64.rpm
<br>
# Start Typesense
sudo systemctl restart typesense-server.service</code></pre>
    </div>
  </template>
</Tabs>

### Updating DEB package

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code># x64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-amd64.deb
sudo apt install ./typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-amd64.deb
<br>
# arm64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-arm64.deb
sudo apt install ./typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-arm64.deb
<br>
# Start Typesense
sudo systemctl restart typesense-server.service</code></pre>
    </div>
  </template>
</Tabs>

### Updating Linux binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
    <pre class="language-bash"><code># x64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-linux-amd64.tar.gz
tar -xzf typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-linux-amd64.tar.gz
<br>
# arm64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-linux-arm64.tar.gz
tar -xzf typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-linux-arm64.tar.gz
<br>
mv ./typesense-server $PATH_TO_EXISTING_BINARY
<br>
kill &lt;TYPESENSE_PROCESS_ID&gt; # will gracefully shutdown
<br>
# Start Typesense
export TYPESENSE_API_KEY=xyz
./typesense-server --data-dir="$(pwd)"/typesense-data --api-key=$TYPESENSE_API_KEY --enable-cors</code></pre>
    </div>
  </template>
</Tabs>

### Updating Mac binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code># Apple Silicon CPU 
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-arm64.tar.gz
tar -xzf typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-arm64.tar.gz
<br>
# Intel CPU 
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-amd64.tar.gz
tar -xzf typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-amd64.tar.gz
<br>
mv ./typesense-server $PATH_TO_EXISTING_BINARY
<br>
kill &lt;TYPESENSE_PROCESS_ID&gt; # will gracefully shutdown
<br>
# Start Typesense
export TYPESENSE_API_KEY=xyz
./typesense-server --data-dir="$(pwd)"/typesense-data --api-key=$TYPESENSE_API_KEY --enable-cors</code></pre>
    </div>
  </template>
</Tabs>

### Updating on macOS via Homebrew

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code>brew services stop typesense-server
brew install typesense/tap/typesense-server@{{ $site.themeConfig.typesenseLatestVersion }}
brew services start typesense-server@{{ $site.themeConfig.typesenseLatestVersion }}</code></pre>
    </div>
  </template>
</Tabs>
