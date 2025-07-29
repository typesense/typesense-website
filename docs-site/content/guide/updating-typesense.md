# Updating Typesense

Before updating Typesense versions, please make sure you've read the [release notes](https://github.com/typesense/typesense/releases) for each of the versions since the one you'll be upgrading from. 

While we strive hard to minimize any breaking changes between versions, sometimes there might be behavior changes or changes to defaults that might affect search behavior. 
So we recommend testing version upgrades in a staging environment, before updating your production environment.

We'd also recommend having a set of test search terms and expected results that you can use to verify behavior changes between versions. 

[[toc]]

## Typesense Cloud

### Upgrade Steps

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

### Zero-Downtime Upgrades on Typesense Cloud

**For clusters that have High Availability enabled and/or Search Delivery Network enabled**: the upgrade will happen one node at a time. So the other nodes in the cluster will continue to serve traffic and you should see a zero-downtime upgrade. 
Learn more [here](https://typesense-cloud.helpscoutdocs.com/article/10-high-availability) about all the scenarios when HA helps.

:::warning IMPORTANT
When you have a cluster with High Availability enabled, you want to ensure that you have also configured your client libraries as described [here](./high-availability.md#when-using-typesense-cloud-or-a-load-balancer) with all the hostnames you see in your cluster dashboard, before triggering the config change.
:::

**For single-node non-HA clusters**: there will be a downtime of about 5-60 minutes depending on the size of your dataset while the upgrade happens. You want to enable HA on your cluster to avoid this downtime. Note that once HA is enabled on a cluster it cannot be turned off. 

## Typesense Self-Hosted

The process of updating Typesense is simple - install the new version of Typesense and restart the server. You won't need to re-index any of your documents. 
Typesense will automatically use the raw data from disk and rebuild the in-memory indices on the new version as needed. 

So if you used the Docker image, just stop the running container, then run `docker run` with the new version. Make sure you pass the same arguments to `docker` run as before.

If you installed Typesense with one of the prebuilt binaries or from one of the package managers, just download the new version of Typesense, replace the binary, or use the package manager to upgrade the DEB/RPM and restart the process.

### Zero-Downtime Upgrades when Self-Hosting

If you've deployed Typesense in a multi-node [Highly Available](./high-availability.md) configuration, you can do zero-downtime upgrades by doing a rolling upgrade. 

To do this, you want to make sure you update **one node at a time**, wait until the `/health` endpoint responds with the status code `200` on the node you just updated, before updating the next node.

#### Upgrade Order
During the upgrade, you want to ensure that the leader of the cluster is using the **older** Typesense version.
In other words, you want to upgrade each of the followers first and the leader last. 
You can determine whether a node is a leader or follower by the value of the `state` field in the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#debug`">`/debug`</RouterLink> end-point response.

| State | Role     |
|-------|----------|
| 1     | LEADER   |
| 4     | FOLLOWER |

1. Trigger a snapshot to <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/cluster-operations.html#create-snapshot-for-backups`">create a backup</RouterLink> of your data on the leader node.
2. On any follower, stop Typesense and replace the binary via the tar package or via the DEB/RPM installer, or via Docker. (See below for code snippets for each installation method).
3. Start Typesense server back again and wait for node to rejoin the cluster as a follower and catch-up (`/health` should return healthy).
4. Repeat steps 2 and 3 for the other _followers_, leaving the leader node uninterrupted for now.
5. Once all followers have been upgraded to your desired version, stop Typesense on the leader.
6. The other nodes will elect a new leader and keep working.
7. Replace the binary on the old leader and start the Typesense server back again.
8. This node will re-join the cluster as a follower, and we are done.

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
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-1.aarch64.rpm
sudo yum install ./typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-1.aarch64.rpm
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
