---
sitemap:
  priority: 0.7
---

# Install Typesense

Here are a couple of available options to install and run Typesense.

## Option 1: Typesense Cloud

The easiest way to run Typesense is using our managed Cloud service called [Typesense Cloud](https://cloud.typesense.org/). 

- Sign-in with Github 
- Pick a configuration and click on Launch. You'll have a ready-to-use cluster in a few minutes.
- Then click on "Generate API Key", which will give you the hostnames and API keys to use in your code.

## Option 2: Local Machine / Self-Hosting

You can also run Typesense on your local machine or self-host it.

You'll find DEB, RPM and pre-built binaries for Linux (X86_64) and macOS on our [downloads](https://typesense.org/downloads) page.

We also publish official Docker images for Typesense on [Docker hub](https://hub.docker.com/r/typesense/typesense/).

### 📥 Download & Install

#### Mac Binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>wget https://dl.typesense.org/releases/{{ $page.typesenseVersion }}/typesense-server-{{ $page.typesenseVersion }}-darwin-amd64.tar.gz
</code></pre>

  </template>
</Tabs>

#### Linux Binary

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>wget https://dl.typesense.org/releases/{{ $page.typesenseVersion }}/typesense-server-{{ $page.typesenseVersion }}-linux-amd64.tar.gz
</code></pre>

  </template>
</Tabs>

#### Docker

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>docker pull typesense/typesense:{{ $page.typesenseVersion }}
</code></pre>

  </template>
</Tabs>

#### DEB package on Ubuntu/Debian

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>wget https://dl.typesense.org/releases/{{ $page.typesenseVersion }}/typesense-server-{{ $page.typesenseVersion }}-amd64.deb
sudo apt install ./typesense-server-{{ $page.typesenseVersion }}-amd64.deb
</code></pre>

  </template>
</Tabs>

#### RPM package on CentOS/RHEL
<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>wget https://dl.typesense.org/releases/{{ $page.typesenseVersion }}/typesense-server-{{ $page.typesenseVersion }}-1.x86_64.rpm
sudo yum install ./typesense-server-{{ $page.typesenseVersion }}.x86_64.rpm
</code></pre>

  </template>
</Tabs>

### 🎬 Start

#### From the pre-built binary
If you downloaded the pre-built binary for Mac / Linux, you can start Typesense with minimal options like this:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
export TYPESENSE_API_KEY=xyz
mkdir /tmp/typesense-data
./typesense-server --data-dir=/tmp/typesense-data --api-key=$TYPESENSE_API_KEY
```

  </template>
</Tabs>

#### From the Docker image
If you want to use Docker, you can run Typesense like this:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>export TYPESENSE_API_KEY=xyz

mkdir /tmp/typesense-data

docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:{{ $page.typesenseVersion }} \
  --data-dir /data --api-key=$TYPESENSE_API_KEY </code></pre>

  </template>
</Tabs>

#### From DEB / RPM package

If you had installed Typesense from a DEB/RPM package, the Typesense server is automatically started as a systemd service when installation is complete. You can check the status via:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
sudo systemctl status typesense-server.service
```

  </template>
</Tabs>

By default, Typesense will start on port 8108, and the installation will generate a random API key, which you can view/change from the [configuration file](./configure-typesense.md#using-a-configuration-file) at `/etc/typesense/typesense-server.ini`

:::tip
We are starting a single node here, but Typesense can also run in a clustered mode. See the [High Availability](./high-availability.md) section for more details.
:::

### 🆗 Health Check

You can use the `/health` API end-point to verify that the server is ready to accept requests.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl http://localhost:8108/health
{"ok":true}
```

  </template>
</Tabs>
