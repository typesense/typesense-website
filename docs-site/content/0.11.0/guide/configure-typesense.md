---
sitemap:
  priority: 0.3
---

# Configure Typesense

## Using Command Line Arguments

Command line arguments can be passed to the server as `--parameter=value`.

| Parameter      | Required    |Description                                            |
| -------------- | ----------- |-------------------------------------------------------| 
|`--config` | false  |Path to the configuration file. If you use this argument, you can define all of the other command line arguments in a configuration file. See the "Configuring Typesense" section for more details.|
|`--api-key`	|true	|API key that allows all operations.|
|`--search-only-api-key`	|false	|API key that allows only searches (i.e. restricted to the `/collections/collection_name/documents/search` end-point). Use this to make search requests directly from Javascript, without exposing your primary API key.|
|`--data-dir`	|true	|Path to the directory where data will be stored on disk.|
|`--log-dir`	|false	|By default, Typesense logs to stdout and stderr. To enable logging to a file, provide a path to a logging directory.|
|`--listen-address`	|false	|Address to which Typesense API service binds. Default: `0.0.0.0`|
|`--listen-port`	|false	|Port on which Typesense API service listens. Default: `8108`|
|`--master`	|false	|Starts the server as a read-only replica by defining the master Typesense server's address in <br />`http(s)://<master_address>:<master_port>` format|
|`--ssl-certificate`	|false	|Path to the SSL certificate file. You must also define `ssl-certificate-key` to enable HTTPS.|
|`--ssl-certificate-key`	|false	|Path to the SSL certificate key file. You must also define `ssl-certificate` to enable HTTPS.|

## Using a Configuration File

As an alternative to command line arguments, you can also configure Typesense server through a configuration file or via environment variables.

Command line arguments are given the highest priority, while environment variables are given the least priority.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
./typesense-server --config=/etc/typesense/typesense-server.ini
```

  </template>
</Tabs>

Our Linux DEB/RPM packages install the configuration file at `/etc/typesense/typesense-server.ini`.

The configuration file uses a simple INI format:

<Tabs :tabs="['INI']">
  <template v-slot:INI>

```ini
; /etc/typesense/typesense-server.ini

[server]

api-key = Rhsdhas2asasdasj2
data-dir = /tmp/ts
log-dir = /tmp/logs
listen-port = 9090
```
  </template>
</Tabs>

## Using Environment Variables

If you wish to use environment variables, you can do that too. The environment variables map to the command line arguments documented above: just use CAPS and underscores instead of hyphens.

For example, use `DATA_DIR` for the `--data-dir` argument.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
DATA_DIR=/tmp/ts API_KEY=AS3das2awQ2 ./typesense-server
```
  </template>
</Tabs>
