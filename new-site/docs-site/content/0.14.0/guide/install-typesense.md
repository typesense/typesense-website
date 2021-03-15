# Install Typesense

You can either self-host Typesense, run it on your local machine or use our managed Typesense Cloud service.

## Typesense Cloud

The easiest way to run Typesense is using our managed Cloud service called [Typesense Cloud](https://cloud.typesense.org/).

Sign-in with Github, pick a configuration and you'll have a production-grade cluster in a few minutes.

## Local Machine / Self-Hosting

You can also run Typesense on your local machine or self-host it.

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

:::tip
We are starting a single node here, but Typesense can also run in a clustered mode. See the [high availability](./high-availability.md) section for more details.
:::

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

```bash
mkdir /tmp/typesense-data
docker run -p 8108:8108 -v/tmp/typesense-data:/data typesense/typesense:0.19.0 \
--data-dir /data --api-key=$TYPESENSE_API_KEY
```

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

### Server arguments

| Parameter      | Required    |Description|
| -------------- | ----------- |-------------------------------------------| 
|config	|false	|Path to the configuration file. If you use this argument, you can define all of the other command line arguments in a configuration file. See the "Configuring Typesense" section for more details.|
|api-key	|true	|A bootstrap admin API key that allows all operations. Be sure to create additional keys with specific ACLs using the key [management API](../api/api-keys.md).<br><br>**NOTE**: Don't expose this admin API key to your browser JS client: use the key management API to create [search-only](../api/api-keys.md) or [scoped API keys](../api/api-keys.md##generate-scoped-search-key).|
|data-dir	|true	|Path to the directory where data will be stored on disk.|
|api-address	|false	|Address to which Typesense API service binds.<br> `Default: 0.0.0.0`|
|api-port	|false	|Port on which Typesense API service listens.<br> `Default: 8108`|
|peering-address	|false	|Internal IP address to which Typesense peering service binds. If this parameter is not specified, Typesense will attempt to use the first available internal IP.|
|peering-port	|false	|Port on which Typesense peering service listens. <br>`Default: 8107`|
|nodes	|false	|Path to file containing comma separated string of all nodes in the cluster.<br><br>Each node definition should be in the following format:<br>`<ip_address>:<peering_port>:<api_port>`<br><br>Example content of a `--nodes` file for a 3-node cluster:<br>`192.168.12.1:8107:8108,192.168.12.2:8107:8108,192.168.12.3:8107:8108`|
|log-dir	|false	|By default, Typesense logs to stdout and stderr. To enable logging to a file, provide a path to a logging directory.|
|ssl-certificate	|false	|Path to the SSL certificate file. You must also define `ssl-certificate-key` to enable HTTPS.|
|ssl-certificate-key	|false	|Path to the SSL certificate key file. You must also define `ssl-certificate` to enable HTTPS.|
|enable-cors	|false	|Allow Javascript client to access Typesense directly from the browser.|