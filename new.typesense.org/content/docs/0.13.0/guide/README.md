# Getting Started Guide - v0.13.0

Let's begin by installing Typesense, indexing some documents and exploring the data with some search queries.

For a detailed dive into the Typesense API, refer to our [API documentation](/api/0.13.0/).

## Installing Typesense

You can find DEB, RPM and pre-built binaries available for Linux (X86_64) and Mac OS X on our [downloads page](/download/).

We also publish official Docker images for Typesense on [Docker hub](https://hub.docker.com/r/typesense/typesense/).

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

## Starting the Typesense server

:::warning NOTE
We are starting a single node here, but Typesense can also run in a clustered mode. See the [high availability](#high-availability) section for more details.
:::

### Installed via the package manager

If you had installed Typesense from a DEB/RPM package, the Typesense server is automatically started as a systemd service when installation is complete. You can check the status via:

```bash
systemctl status typesense-server
```

By default, Typesense will start on port 8108, and the installation will generate a random API key, which you can view/change from the configuration file at `/etc/typesense/typesense-server.ini`

## High Availability
