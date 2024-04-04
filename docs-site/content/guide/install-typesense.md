# Install Typesense

Here are a couple of available options to install and run Typesense.

## Option 1: Typesense Cloud

The easiest way to run Typesense is using our managed Cloud service called [Typesense Cloud](https://cloud.typesense.org/). 

- Sign-in with GitHub 
- Pick a configuration and click on Launch. You'll have a ready-to-use cluster in a few minutes.
- Then click on "Generate API Key", which will give you the hostnames and API keys to use in your code.

## Option 2: Local Machine / Self-Hosting

You can also run Typesense on your local machine or self-host it.

You'll find DEB, RPM and pre-built binaries for Linux and macOS on our [downloads](https://typesense.org/downloads) page.

We also publish official Docker images for Typesense on [Docker hub](https://hub.docker.com/r/typesense/typesense/).

### Docker

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code>export TYPESENSE_API_KEY=xyz
<br>    
mkdir $(pwd)/typesense-data
<br>
docker run -p 8108:8108 \
            -v$(pwd)/typesense-data:/data typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }} \
            --data-dir /data \
            --api-key=$TYPESENSE_API_KEY \
            --enable-cors</code></pre>
    </div>
  </template>
</Tabs>

### Docker Compose

<Tabs :tabs="['yml']">
  <template v-slot:yml>
    <div class="manual-highlight">
      <pre class="language-yaml"><code>version: '3.4'
services:
  typesense:
    image: typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }}
    restart: on-failure
    ports:
      - "8108:8108"
    volumes:
      - ./typesense-data:/data
    command: '--data-dir /data --api-key=xyz --enable-cors'</code></pre>
    </div>
  </template>
</Tabs>

```shell
mkdir $(pwd)/typesense-data

docker-compose up
```

### Kubernetes

There are a couple of **community supported** contributions for deploying on Kubernetes:

- via [Kubernetes Operator](https://github.com/sai3010/Typesense-Kubernetes-Operator)
- via [Kompose](https://github.com/typesense/typesense-kubernetes)

### Mac via Homebrew

:::warning Compatibility with macOS
The macOS native binary only works with macOS Ventura (13.x) or above.

For older versions of macOS, please use the [Docker](#docker) or [Docker Compose](#docker-compose) installation method above.   
:::

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code>brew install typesense/tap/typesense-server@{{ $site.themeConfig.typesenseLatestVersion }}
brew services start typesense-server@{{ $site.themeConfig.typesenseLatestVersion }}</code></pre>
    </div>
  </template>
</Tabs>

For macOS running on Intel CPUs:
- The default API key is `xyz` and the default port is `8108`
- The config file is at `/usr/local/etc/typesense/typesense.ini`
- Logs are under `/usr/local/var/log/typesense/`
- Data dir is under `/usr/local/var/lib/typesense/`

For macOS running on Apple Silicon CPUs:
- The default API key is `xyz` and the default port is `8108`
- The config file is at `/opt/homebrew/etc/typesense/typesense.ini`
- Logs are under `/opt/homebrew/var/log/typesense/`
- Data dir is under `/opt/homebrew/var/lib/typesense/`

### Mac Binary

:::warning Compatibility with macOS
The macOS native binary only works with macOS Ventura (13.x) or above.

For older versions of macOS, please use the [Docker](#docker) or [Docker Compose](#docker-compose) installation method above.   
:::

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code># Apple Silicon CPU
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-arm64.tar.gz
tar -xzf typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-arm64.tar.gz
<br>
# Intel CPUs
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-amd64.tar.gz
tar -xzf typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-darwin-amd64.tar.gz
<br>
# Start Typesense
export TYPESENSE_API_KEY=xyz
mkdir $(pwd)/typesense-data
./typesense-server --data-dir=$(pwd)/typesense-data --api-key=$TYPESENSE_API_KEY --enable-cors</code></pre>
    </div>
  </template>
</Tabs>

### DEB package on Ubuntu/Debian

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
sudo systemctl start typesense-server.service</code></pre>
    </div>
  </template>
</Tabs>

- The config file is at `/etc/typesense/typesense-server.ini`
  - The admin API key is auto-generated and can be found inside the config file.
- Logs are under `/var/log/typesense/`
- Data dir is under `/var/lib/typesense/`

:::warning Compatibility
v26.0 of Typesense Server requires Ubuntu 20 or later.
:::

### RPM package on CentOS/RHEL
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
sudo systemctl start typesense-server.service</code></pre>
    </div>
  </template>
</Tabs>

- The config file is at `/etc/typesense/typesense-server.ini`
  - The admin API key is auto-generated and can be found inside the config file.
- Logs are under `/var/log/typesense/`
- Data dir is under `/var/lib/typesense/`

:::warning Compatibility
v26.0 of Typesense Server requires recent versions of the Linux kernel.
:::

### Linux Binary

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
# Start Typesense
export TYPESENSE_API_KEY=xyz
mkdir $(pwd)/typesense-data # Use a directory like /var/lib/typesense in production
./typesense-server --data-dir=$(pwd)/typesense-data --api-key=$TYPESENSE_API_KEY --enable-cors</code></pre>
    </div>
  </template>
</Tabs>

:::warning Compatibility
v26.0 of Typesense Server requires Ubuntu 20 or later or recent versions of the Linux kernel.
:::

### Windows [(WSL)](https://docs.microsoft.com/en-us/windows/wsl/install)

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
    <pre class="language-bash"><code>wsl
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-amd64.deb
sudo apt install ./typesense-server-{{ $site.themeConfig.typesenseLatestVersion }}-amd64.deb
<br>
# Start Typesense
sudo /usr/bin/./typesense-server --config=/etc/typesense/typesense-server.ini</code></pre>
    </div>
  </template>
</Tabs>

Note: Post install, you might see the message "installed typesense-server package post-installation script subprocess returned error exit status 1".
You can safely ignore this error message. Executing `apt list --installed | grep typesense` should show that installation was successful.

You can retrieve the hostname for the server on which Typesense is running using `wsl hostname -I` in cmd.
**You should be able to connect to this hostname/IP address directly from Windows**.

If you'd like Typesense to be started at startup, you can create a BAT file with the command `powershell.exe /c wsl.exe sudo /usr/bin/./typesense-server --config=/etc/typesense/typesense-server.ini` and set it to execute at startup.

By default, Typesense will start on port 8108, and the installation will generate a random API key, which you can view/change from the [configuration file](./configure-typesense.md#using-a-configuration-file) at `/etc/typesense/typesense-server.ini`


:::tip
We are starting a single node here, but Typesense can also run in a clustered mode. See the [High Availability](./high-availability.md) section for more details.
:::


### Using a GPU (optional)

Using a GPU will be handy for generating embeddings for vector search and for voice query.

You would have to install the following additional dependencies, after which Typesense will automatically make use of any available Nvidia GPUs:

1. Install CUDA following the instructions on Nvidia's site [here](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html).

    You want to specifically install the following versions of these packages: `cuda=11.8.0-1`, `libcudnn8=8.9.2.26-1+cuda11.8` and `libcudnn8-dev=8.9.2.26-1+cuda11.8` and their dependencies.

2. Install cuDNN following the instructions [here](https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html).

    You want to specifically install the `libcudnn8` and `libcudnn8-dev` packages.

3. Add the following to `/etc/profile.d/cuda-path.sh`:

    ```bash
    export PATH=/usr/local/cuda/bin${PATH:+:${PATH}}
    export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/local/cuda/lib64
    export CUDA_HOME=/usr/local/cuda
    ```

4. Install the Typesense GPU dependencies package:

<Tabs :tabs="['Shell']">
  <template v-slot:Shell>
    <div class="manual-highlight">
      <pre class="language-bash"><code># x64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-gpu-deps-{{ $site.themeConfig.typesenseLatestVersion }}-amd64.deb
sudo apt install ./typesense-gpu-deps-{{ $site.themeConfig.typesenseLatestVersion }}-amd64.deb
<br>
# arm64
curl -O https://dl.typesense.org/releases/{{ $site.themeConfig.typesenseLatestVersion }}/typesense-gpu-deps-{{ $site.themeConfig.typesenseLatestVersion }}-arm64.deb
sudo apt install ./typesense-gpu-deps-{{ $site.themeConfig.typesenseLatestVersion }}-arm64.deb
      </code></pre>
    </div>
  </template>
</Tabs>


## 🆗 Health Check

You can use the `/health` API end-point to verify that the server is ready to accept requests.

```bash
curl http://localhost:8108/health
{"ok":true}
```

## ⚙️ Configure Typesense

You can configure various Typesense Server settings using command line arguments. 
Read this reference article for more information on 
<RouterLink :to="`/${this.$site.themeConfig.typesenseLatestVersion}/api/server-configuration.html`">How To Configure Typesense Server</RouterLink>.
