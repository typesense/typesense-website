<template>
  <div class="bg-dark text-white py-5">
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <h2 class="text-primary">Docker</h2>
          <CodeBlockTabbed>
            <pre data-language="bash" data-display-language="Docker">
docker pull typesense/typesense:{{ typesenseLatestVersion }}
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <h2 class="text-primary">Linux</h2>
          <CodeBlockTabbed :underline-links="true">
            <pre data-language="bash" data-display-language="DEB">
wget https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-amd64.deb
            </pre>

            <pre data-language="bash" data-display-language="RPM">
wget https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-1.x86_64.rpm
            </pre>

            <pre data-language="bash" data-display-language="Binary">
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
          </div>
          <CodeBlockTabbed :underline-links="true">
            <pre data-language="bash" data-display-language="Binary">
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
          <CodeBlockTabbed>
            <pre data-language="powershell" data-display-language="Docker">
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
