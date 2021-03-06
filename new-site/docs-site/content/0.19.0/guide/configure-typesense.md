# Configuring Typesense
As an alternative to command line arguments, you can also configure Typesense server through a configuration file or via environment variables.

Command line arguments are given the highest priority, while environment variables are given the least priority.

**Using a configuration file**

Let's see how we can use a configuration file first:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
./typesense-server --config = /etc/typesense/typesense-server.ini
```

  </template>
</Tabs>

Our Linux DEB/RPM packages install the configuration file at `/etc/typesense/typesense-server.ini`.

The configuration file uses a simple INI format:

<Tabs :tabs="['Ini']">
  <template v-slot:Ini>

```ini
; /etc/typesense/typesense-server.ini

[server]

api-key = Rhsdhas2asasdasj2
data-dir = /tmp/ts
log-dir = /tmp/logs
api-port = 9090
```
  </template>
</Tabs>

**Using environment variables**

If you wish to use environment variables, you can do that too. The environment variables map to the command line arguments documented above: just use CAPS and underscores instead of hyphens, and prefix the variable names with `TYPESENSE_`.

For example, use `TYPESENSE_DATA_DIR` for the `--data-dir` argument.

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>

```bash
TYPESENSE_DATA_DIR=/tmp/ts TYPESENSE_API_KEY=AS3das2awQ2 ./typesense-server
```
  </template>
</Tabs>
