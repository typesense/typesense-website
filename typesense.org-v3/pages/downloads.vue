<template>
  <img
    class="absolute left-1/2 top-0 z-[-1] -translate-x-1/2 max-md:hidden"
    src="/images/backgrounds/tunnels-top.svg"
    alt="background"
  />
  <div class="relative flex flex-col gap-[150px] max-md:gap-[120px]">
    <div
      class="site-padding mt-[120px] !gap-[150px] max-md:mt-24 max-md:!gap-[80px]"
    >
      <section>
        <div class="mb-4 flex gap-4 max-md:mb-2">
          <FlashFill /> <SearchFill />
        </div>
        <h1 class="mb-8 max-md:mb-4">
          Download<br />
          <strong>Typesense</strong>
        </h1>
        <p
          class="max-w-[700px] text-justify text-xl leading-[1.8] tracking-[-0.4px] text-text-muted max-md:text-[14px] [&_b]:text-text-primary"
        >
          Typesense is an open source search engine that can be downloaded and
          run from your computer locally or from any server. We also offer a
          hosted version of Typesense called
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="https://typesense.org/blog/why-we-are-not-raising-funds/"
            >Typesense Cloud</CustomLink
          >.
          <br />
          <br />
          To download Typesense, <b>click on one of the links below</b> or use
          the <b>terminal commands</b> shown, depending on your operating system
          and CPU architecture.
          <br />
          <br />
          Once you’ve downloaded Typesense, read the documentation to
          <CustomLink
            class="text-primary underline underline-offset-4"
            to="https://typesense.org/blog/why-we-are-not-raising-funds/"
            >Get Started</CustomLink
          >.
        </p>
      </section>
      <section class="gap-20 px-12 max-md:gap-14 max-md:px-0">
        <div class="flex w-full flex-col gap-12 text-nowrap">
          <div class="install-option">
            <div class="platform">
              <div class="img-wrapper">
                <img
                  src="/images/illustrations/docker.svg"
                  alt="Install Typesense via Docker"
                />
              </div>
              <h3>Docker</h3>
              <p class="subtext">If you love some container action</p>
            </div>
            <CodeBlockTabbed
              displayStyle="border"
              state-id="docker"
              class="code"
            >
              <pre data-language="bash" data-display-language="Docker">
docker pull typesense/typesense:{{ STATIC.typesenseLatestVersion }}</pre
              >
            </CodeBlockTabbed>
          </div>
          <div class="divider"></div>
          <div class="install-option">
            <div class="platform">
              <div class="img-wrapper">
                <img
                  src="/images/illustrations/linux.svg"
                  alt="Install Typesense on Linux"
                />
              </div>
              <h3>Linux</h3>
              <p class="subtext">
                Power to the Penguin.<br class="max-md:hidden" />
                Open Source, FTW.
              </p>
            </div>
            <CodeBlockTabbed
              displayStyle="border"
              :underline-links="true"
              state-id="linux"
              class="code"
            >
              <pre data-language="bash" data-display-language="DEB (x64)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-amd64.deb
      </pre
              >
              <pre data-language="bash" data-display-language="RPM (x64)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-1.x86_64.rpm
      </pre
              >
              <pre data-language="bash" data-display-language="Binary (x64)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-linux-amd64.tar.gz
      </pre
              >
              <pre data-language="bash" data-display-language="DEB (arm64)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-arm64.deb
      </pre
              >
              <pre data-language="bash" data-display-language="RPM (arm64)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-1.aarch64.rpm
      </pre
              >
              <pre data-language="bash" data-display-language="Binary (arm64)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-linux-arm64.tar.gz
      </pre
              >
            </CodeBlockTabbed>
          </div>
          <div class="divider"></div>
          <div class="install-option">
            <div class="platform">
              <div class="img-wrapper">
                <img
                  src="/images/illustrations/macos.svg"
                  alt="Install Typesense on MacOS"
                />
              </div>
              <h3>MacOS</h3>
              <p class="subtext">Brew up some search magic.</p>
            </div>
            <CodeBlockTabbed
              displayStyle="border"
              :underline-links="true"
              state-id="macOS"
              class="code"
            >
              <pre data-language="bash" data-display-language="Homebrew">
brew install typesense/tap/typesense-server@{{ STATIC.typesenseLatestVersion }}
      </pre
              >
              <pre
                data-language="bash"
                data-display-language="Binary (Apple Silicon)"
              >
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-darwin-arm64.tar.gz
      </pre
              >
              <pre data-language="bash" data-display-language="Binary (Intel)">
curl -O https://dl.typesense.org/releases/{{
                  STATIC.typesenseLatestVersion
                }}/typesense-server-{{
                  STATIC.typesenseLatestVersion
                }}-darwin-amd64.tar.gz
      </pre
              >
            </CodeBlockTabbed>
          </div>
          <div class="divider"></div>
          <div class="install-option">
            <div class="platform">
              <div class="img-wrapper">
                <img
                  src="/images/illustrations/windows.svg"
                  alt="Install Typesense on Windows"
                />
              </div>
              <h3>Windows</h3>
              <p class="subtext">Did someone say containers?</p>
            </div>
            <CodeBlockTabbed
              displayStyle="border"
              state-id="windows"
              class="code"
            >
              <pre data-language="powershell" data-display-language="Docker">
docker pull typesense/typesense:{{ STATIC.typesenseLatestVersion }}
              </pre>
            </CodeBlockTabbed>
          </div>
          <div class="divider"></div>
          <div class="install-option">
            <div class="platform">
              <div class="img-wrapper">
                <img
                  src="/images/illustrations/cloud-infra.svg"
                  alt="Using Typesense Cloud"
                />
              </div>
              <h3>
                Typesense<br class="max-md:hidden" />
                Cloud
              </h3>
              <p class="subtext">Zero hassle. Point and click. Go.</p>
            </div>
            <CodeBlockTabbed
              displayStyle="border"
              state-id="typesenseCloud"
              class="code"
            >
              <pre data-language="bash" data-display-language="NONE">
1. Login or Signup at https://cloud.typesense.org
2. Click on "New Cluster" and choose a version
3. Click on Launch
              </pre>
            </CodeBlockTabbed>
          </div>
        </div>
        <div class="w-full px-9 max-md:px-0">
          <div
            class="relative isolate flex w-full items-center justify-between gap-6 overflow-hidden rounded-2xl bg-primary px-8 py-6 max-md:flex-col max-md:items-end max-md:p-4"
          >
            <img
              class="absolute right-0 top-0 z-[-1] h-full max-md:-right-36"
              src="/images/backgrounds/layer.svg"
              alt="Read the Guide"
            />
            <h3
              class="normal-case tracking-[-0.96px] text-text-inverted max-md:self-start"
            >
              <span class="text-secondary">Get Started</span> after<br />
              downloading <br class="show-md" />
              Typesense
            </h3>
            <Button link="/docs" with-arrow>Read the Guide</Button>
          </div>
        </div>
      </section>
    </div>
    <img
      class="absolute bottom-[-1000px] left-1/2 z-[-1] w-max -translate-x-1/2 scale-x-110 max-md:bottom-[-220px] max-md:scale-[2]"
      src="/images/backgrounds/tunnels-bottom.svg"
      alt="background"
    />
  </div>
</template>
<style scoped>
section {
  @apply flex flex-col items-center;
}
.platform {
}
.install-option {
  @apply flex w-full justify-between gap-16 max-md:flex-col max-md:gap-4;
}
.img-wrapper {
  @apply mb-8 w-max rounded-2xl bg-secondary-bg p-5 max-md:mb-4 max-md:rounded-lg max-md:p-3;
}
.img-wrapper img {
  @apply max-md:size-6;
}
.code {
  @apply h-[280px] w-[65%] max-w-[704px] max-md:h-[180px] max-md:w-full;
}
.divider {
  @apply relative h-[1px] w-[200vw] -translate-x-1/2 bg-bg-gray-3;
}
</style>

<script lang="ts" setup>
useSeoMeta({
  title: "Downloads | Typesense",
  ogTitle: "Downloads | Typesense",
  description:
    "Run on Typesense Cloud, or download DEB, RPM and binary packages.",
  ogDescription:
    "Run on Typesense Cloud, or download DEB, RPM and binary packages.",
});

import FlashFill from "@/assets/icons/flash-fill.svg";
import SearchFill from "@/assets/icons/search-fill.svg";
</script>
