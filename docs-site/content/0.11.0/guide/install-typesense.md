# Install Typesense

You'll find DEB, RPM and pre-built binaries for Linux (X86_64) and Mac OS X on our [downloads](https://typesense.org/downloads) page.

We also publish official Docker images for Typesense on [Docker hub](https://hub.docker.com/r/typesense/typesense/).

### Installing Typesense

#### DEB package on Ubuntu/Debian

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
apt install ./typesense-server-<version>-amd64.deb
```

  </template>
</Tabs>

#### RPM package on CentOS/RHEL
<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
yum install ./typesense-server-<version>.x86_64.rpm
```

  </template>
</Tabs>

### Starting the Typesense Server

Installed via the package manager
If you had installed Typesense from a DEB/RPM package, the Typesense server is automatically started as a systemd service when installation is complete. You can check the status via:

`systemctl status typesense-server`

By default, Typesense will start on port 8108, and the installation will generate a random API key, which you can view/change from the configuration file at `/etc/typesense/typesense-server.ini`

#### From the pre-built binary
If you have downloaded the pre-built binary, you can start Typesense with minimal options like this:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
mkdir /tmp/typesense-data
./typesense-server --data-dir=/tmp/typesense-data --api-key=$TYPESENSE_API_KEY
```

  </template>
</Tabs>

#### From the Docker image
If you want to use Docker, you can run Typesense like this:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

<pre class="language-bash"><code>mkdir /tmp/typesense-data

docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:{{ $page.typesenseVersion }} \
  --data-dir /data --api-key=$TYPESENSE_API_KEY </code></pre>

  </template>
</Tabs>

You can use the `/health` API end-point to verify that the server is ready to accept requests.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
curl http://localhost:8108/health
{"ok":true}
```

  </template>
</Tabs>
