<template>
  <div class="bg-dark text-white py-5">
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <h2 class="text-primary">Docker</h2>
          <CodeBlockTabbed>
            <pre data-language="bash" data-display-language="Shell">
docker pull typesense/typesense:{{ typesenseLatestVersion }}
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <h2 class="text-primary">Linux</h2>
          <div class="mt-4 d-flex">
            <h5>DEB</h5>
            <a
              :href="`https://dl.typesense.org/releases/${typesenseLatestVersion}/typesense-server-${typesenseLatestVersion}-amd64.deb`"
            >
              <img
                class="ml-3"
                src="~assets/images/np_download_3750199_FFD000.svg"
                height="20"
              />
            </a>
          </div>
          <CodeBlockTabbed>
            <pre data-language="bash">
wget https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-amd64.deb
            </pre>
          </CodeBlockTabbed>

          <div class="mt-4 d-flex">
            <h5>RPM</h5>
            <a
              :href="`https://dl.typesense.org/releases/${typesenseLatestVersion}/typesense-server-${typesenseLatestVersion}-1.x86_64.rpm`"
            >
              <img
                class="ml-3"
                src="~assets/images/np_download_3750199_FFD000.svg"
                height="20"
              />
            </a>
          </div>
          <CodeBlockTabbed>
            <pre data-language="bash">
wget https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-1.x86_64.rpm
            </pre>
          </CodeBlockTabbed>

          <div class="mt-4 d-flex">
            <h5>Binary</h5>
            <a
              :href="`https://dl.typesense.org/releases/${typesenseLatestVersion}/typesense-server-${typesenseLatestVersion}-linux-amd64.tar.gz`"
            >
              <img
                class="ml-3"
                src="~assets/images/np_download_3750199_FFD000.svg"
                height="20"
              />
            </a>
          </div>
          <CodeBlockTabbed>
            <pre data-language="bash">
wget https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{
                typesenseLatestVersion
              }}-linux-amd64.tar.gz
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <div class="mt-4 d-flex align-items-center">
            <h2 class="text-primary">MacOS</h2>
            <a
              :href="`https://dl.typesense.org/releases/${typesenseLatestVersion}/typesense-server-${typesenseLatestVersion}-darwin-amd64.tar.gz`"
            >
              <img
                class="ml-3"
                src="~assets/images/np_download_3750199_FFD000.svg"
                height="20"
              />
            </a>
          </div>
          <CodeBlockTabbed>
            <pre data-language="bash">
wget https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{
                typesenseLatestVersion
              }}-darwin-amd64.tar.gz
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <h2 class="text-primary">Windows</h2>
          <h5 class="mt-4">Docker</h5>
          <CodeBlockTabbed>
            <pre data-language="Shell">
docker pull typesense/typesense:{{ typesenseLatestVersion }}
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { typesenseLatestVersion } from '../../../typsenseVersions'
export default {
  data() {
    return {
      typesenseLatestVersion,
    }
  },
}
</script>

<style scoped lang="scss">
a {
  border-bottom: unset;
}
</style>
