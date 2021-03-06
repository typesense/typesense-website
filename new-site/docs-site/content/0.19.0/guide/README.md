Let's begin by installing Typesense, indexing some documents and exploring the data with some search queries.

For a detailed dive into the Typesense API, refer to our [API documentation](../api/README.md).

# Installing Typesense
You can find DEB, RPM and pre-built binaries available for Linux (X86_64) and Mac OS X on our downloads page.

We also publish official Docker images for Typesense on [Docker hub](https://hub.docker.com/r/typesense/typesense/).

We also offer a managed Cloud option called Typesense Cloud [here](https://cloud.typesense.org/?_ga=2.142997813.1232513525.1614309604-1445891162.1612758736).

## DEB package on Ubuntu/Debian

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
apt install ./typesense-server-<version>-amd64.deb
```

  </template>
</Tabs>

## RPM package on CentOS/RHEL
<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
yum install ./typesense-server-<version>.x86_64.rpm
```

  </template>
</Tabs>

## Starting the typesense server
>**Note**:
> We are starting a single node here, but Typesense can also run in a clustered mode. See the high availability section for more details.

Installed via the package manager
If you had installed Typesense from a DEB/RPM package, the Typesense server is automatically started as a systemd service when installation is complete. You can check the status via:

`systemctl status typesense-server`

By default, Typesense will start on port 8108, and the installation will generate a random API key, which you can view/change from the configuration file at `/etc/typesense/typesense-server.ini`

### From the pre-built binary
If you have downloaded the pre-built binary, you can start Typesense with minimal options like this:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
mkdir /tmp/typesense-data
./typesense-server --data-dir=/tmp/typesense-data --api-key=$TYPESENSE_API_KEY
```

  </template>
</Tabs>

### From the docker image
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
Shell
curl http://localhost:8108/health
{"ok":true}
```

  </template>
</Tabs>


## Server arguments

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
| config         | false       |Path to the configuration file. If you use this argument, you can define all of the other command line arguments in a configuration file. See the "Configuring Typesense" section for more details.|
|api-key	|true	|A bootstrap admin API key that allows all operations. Be sure to create additional keys with specific ACLs using the key management API. <br><br>**NOTE**: Don't expose this admin API key to your browser JS client: use the key management API to create search-only or scoped API keys.|
|data-dir	|true	|Path to the directory where data will be stored on disk.|
|api-address	|false	|Address to which Typesense API service binds. Default: `0.0.0.0`|
|api-port	|false	|Port on which Typesense API service listens. Default: `8108`|
|peering-address	|false	|Internal IP address to which Typesense peering service binds. If this parameter is not specified, Typesense will attempt to use the first available internal IP.|
|peering-port	|false	|Port on which Typesense peering service listens. Default: `8107`|
|nodes	|false	|Path to file containing comma separated string of all nodes in the cluster.|
log-dir	|false	|By default, Typesense logs to stdout and stderr. To enable logging to a file, provide a path to a logging directory.|
|ssl-certificate	|false	|Path to the SSL certificate file. You must also define `ssl-certificate-key` to enable HTTPS.|
|ssl-certificate-key	|false	|Path to the SSL certificate key file. You must also define `ssl-certificate` to enable HTTPS.|
|enable-cors	|false	|Allow Javascript client to access Typesense directly from the browser.|
|catch-up-threshold-percentage	|false	|The threshold at which a follower is deemed to have caught up with leader and will allow requests. Default: `95`.<br><br>**NOTE**: This threshold is used only when the lag between the follower and leader is more than 1,000 operations.|
|snapshot-interval-seconds	|false	|Frequency of replication log snapshots. Default: `3600` follower recovery.<br><br>**NOTE**: Frequent snapshotting helps in faster recovery from a cold start. However, if this value is too low for a large dataset, repeated snapshotting can actually slow down follower recovery.|
|log-slow-requests-time-ms	|false	|Requests that take over this amount of time (in milliseconds) are logged. Default: `-1` which disables slow request logging.|