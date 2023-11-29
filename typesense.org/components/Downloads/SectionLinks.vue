<template>
  <div class="bg-dark text-white py-5">
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <h2 class="text-primary">Docker</h2>
          <CodeBlockTabbed state-id="docker">
            <pre data-language="bash" data-display-language="Docker">
docker pull typesense/typesense:{{ typesenseLatestVersion }}
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <h2 class="text-primary">Linux</h2>
          <CodeBlockTabbed :underline-links="true" state-id="linux">
            <pre data-language="bash" data-display-language="DEB (x64)">
curl -O https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-amd64.deb
            </pre>

            <pre data-language="bash" data-display-language="RPM (x64)">
curl -O https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-1.x86_64.rpm
            </pre>

            <pre data-language="bash" data-display-language="Binary (x64)">
curl -O https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{
                typesenseLatestVersion
              }}-linux-amd64.tar.gz
            </pre>
            <pre data-language="bash" data-display-language="DEB (arm64)">
curl -O https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-arm64.deb
            </pre>

            <pre data-language="bash" data-display-language="RPM (arm64)">
curl -O https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{ typesenseLatestVersion }}-1.arm64.rpm
            </pre>

            <pre data-language="bash" data-display-language="Binary (arm64)">
curl -O https://dl.typesense.org/releases/{{
                typesenseLatestVersion
              }}/typesense-server-{{
                typesenseLatestVersion
              }}-linux-arm64.tar.gz
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <div class="mt-4 d-flex align-items-center">
            <h2 class="text-primary">MacOS</h2>
          </div>
          <CodeBlockTabbed :underline-links="true" state-id="macOS">
            <pre data-language="bash" data-display-language="Apple Silicon">
docker pull typesense/typesense:{{ typesenseLatestVersion }}
            </pre>
            <pre data-language="bash" data-display-language="Homebrew (Intel)">
brew install typesense/tap/typesense-server@{{ typesenseLatestVersion }}
            </pre>
            <pre data-language="bash" data-display-language="Binary (Intel)">
curl -O https://dl.typesense.org/releases/{{
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
          <CodeBlockTabbed state-id="windows">
            <pre data-language="powershell" data-display-language="Docker">
docker pull typesense/typesense:{{ typesenseLatestVersion }}
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm">
          <h2 class="text-primary">Typesense Cloud</h2>
          <CodeBlockTabbed state-id="typesenseCloud">
            <pre data-language="bash" data-display-language=" ">
1. Login or Signup at https://cloud.typesense.org
2. Click on "New Cluster" and choose a version
3. Click on Launch
            </pre>
          </CodeBlockTabbed>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { typesenseLatestVersion } from '../../../typesenseVersions'
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
