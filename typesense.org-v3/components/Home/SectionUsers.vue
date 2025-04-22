<script lang="ts" setup>
const users = [
  {
    href: "https://codecademy.com",
    imgPath: "/images/user-logos/codecademy-logo.svg",
    height: 24,
    alt: "Codecademy",
  },
  {
    href: "https://www.logitech.com",
    imgPath: "/images/user-logos/logitech_logo.svg",
    height: 24,
    alt: "Logitech",
  },
  {
    href: "https://www.bbcmaestro.com",
    imgPath: "/images/user-logos/bbc-maestro-logo.svg",
    height: 15.5,
    alt: "Soundsnap",
  },
  {
    href: "https://kick.com",
    imgPath: "/images/user-logos/kick-logo.svg",
    height: 17,
    alt: "Kick.com",
  },
  {
    href: "https://lonelyplanet.com",
    imgPath: "/images/user-logos/lonely-planet-logo.svg",
    height: 19,
    alt: "Lonely Planet",
  },
  {
    href: "https://changelog.com",
    imgPath: "/images/user-logos/changelog.svg",
    height: 34,
    alt: "Changelog",
  },
  {
    href: "https://eats.oddle.me",
    imgPath: "/images/user-logos/oddle_eats.svg",
    height: 16,
    alt: "Oddle Eats",
  },
  {
    href: "https://macrofactorapp.com",
    imgPath: "/images/user-logos/macro-factor.svg",
    height: 20,
    alt: "Macro Factor",
    noref: true,
  },
  {
    href: "https://poorvika.com",
    imgPath: "/images/user-logos/poorvika-logo.svg",
    height: 26,
    alt: "Poorvika Mobiles",
  },
  {
    href: "https://elevenlabs.io",
    imgPath: "/images/user-logos/eleven-labs.svg",
    height: 15,
    alt: "ElevenLabs",
  },
];

const asSeenAt = [
  {
    href: "https://twitter.com/jasonbosco/status/1565073075040882688",
    imgPath: "/images/user-logos/nasdaq.svg",
    height: 35,
    alt: "Typesense on Nasdaq billboard",
  },
  {
    href: "https://www.youtube.com/watch?v=qBkyU1TJKDg&t=2404s",
    imgPath: "/images/user-logos/google-io.svg",
    height: 57,
    alt: "Typesense at Google I/O",
  },
  {
    href: "https://www.thoughtworks.com/en-us/radar/tools?blipid=202203031",
    imgPath: "/images/user-logos/thoughtworks.svg",
    height: 44,
    alt: "Typesense on ThoughtWorks Technology Radar",
  },
];
</script>

<template>
  <div>
    <section>
      <div
        class="grid grid-cols-2 gap-4 max-lg:grid-cols-3 max-md:gap-6 max-sm:grid-cols-1"
      >
        <div class="max-lg:col-span-2 max-sm:col-span-1 max-sm:text-center">
          <div
            class="flex flex-col max-sm:items-center max-sm:text-center md:mb-10"
          >
            <Badge>You'll be in good company</Badge>
            <h2 class="max-sm:hidden">
              From <strong>Scrappy</strong> Startups to
              <strong>Household</strong> Names
            </h2>
            <h2 class="hidden max-sm:block">
              Trusted <strong>by Teams</strong><br />
              of all Sizes
            </h2>
          </div>
        </div>
        <div
          class="grid grid-cols-2 items-end gap-4 max-lg:grid-cols-1 max-md:gap-3 max-sm:grid-cols-2 max-lg:[&>*:nth-child(2)]:hidden max-sm:[&>*:nth-child(2)]:block"
        >
          <CustomLink
            v-for="user in users.slice(0, 2)"
            :key="user.href + '123'"
            :to="user.href"
          >
            <Card>
              <img
                class="max-md:scale-[0.75]"
                :src="user.imgPath"
                :alt="user.alt"
                :style="`height:${user.height}px !important;`"
              />
            </Card>
          </CustomLink>
        </div>
      </div>
      <div class="card-list mt-4 max-sm:mt-3">
        <CustomLink
          class="hidden max-lg:block max-sm:hidden"
          :to="users[1].href"
        >
          <Card>
            <img
              class="max-md:scale-[0.75]"
              :src="users[1].imgPath"
              :alt="users[1].alt"
              :style="`height:${users[1].height}px !important;`"
            />
          </Card>
        </CustomLink>
        <CustomLink
          v-for="user in users.slice(2)"
          :key="user.href + '123'"
          :to="user.href"
        >
          <Card>
            <img
              class="max-md:scale-[0.75]"
              :src="user.imgPath"
              :alt="user.alt"
              :style="`height:${user.height}px !important;`"
            />
          </Card>
        </CustomLink>
      </div>
    </section>
    <section class="mt-[100px]">
      <h2 class="mb-[30px] max-md:mb-6">As seen at</h2>
      <div
        class="grid grid-cols-4 justify-between gap-4 max-md:flex max-md:flex-col max-md:gap-3"
      >
        <div
          class="col-span-3 mr-28 grid grid-cols-2 gap-4 max-md:m-0 max-md:grid-cols-1 max-md:gap-6"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between px-4">
              <p class="text-sm text-gray-500">
                The iconic Nasdaq billboard in New York
              </p>
              <a
                href="https://typesense.org/blog/typesense-on-nasdaq-billboard-aug-2022/"
                target="_blank"
                class="text-sm text-primary hover:text-primary/80"
                >View ›</a
              >
            </div>
            <CustomLink
              to="https://typesense.org/blog/typesense-on-nasdaq-billboard-aug-2022/"
              class="relative block h-[500px] overflow-hidden transition-transform hover:scale-[1.02] max-md:w-full max-sm:h-[400px]"
            >
              <div class="relative h-full w-full">
                <img
                  class="h-full w-full rounded-3xl object-cover object-[center_20%]"
                  src="@/assets/images/typesense-on-nasdaq.jpeg"
                  alt="Typesense on the Nasdaq billboard in New York City"
                />
              </div>
            </CustomLink>
          </div>

          <div class="space-y-3 max-md:mt-8">
            <div class="flex items-center justify-between px-4">
              <p class="text-sm text-gray-500">
                Hundreds of San Francisco billboards
              </p>
              <a
                href="https://typesense.org/blog/typesense-on-san-francisco-billboards-apr-2025/"
                target="_blank"
                class="text-sm text-primary hover:text-primary/80"
                >View ›</a
              >
            </div>
            <CustomLink
              to="https://typesense.org/blog/typesense-on-san-francisco-billboards-apr-2025/"
              class="relative block h-[500px] overflow-hidden transition-transform hover:scale-[1.02] max-md:w-full max-sm:h-[400px]"
            >
              <div class="relative h-full w-full">
                <img
                  class="h-full w-full rounded-3xl object-cover object-[center_20%]"
                  src="@/assets/images/typesense-at-sf-1.jpg"
                  alt="Typesense in San Francisco"
                />
              </div>
            </CustomLink>
          </div>
        </div>
        <div
          class="flex justify-center gap-4 max-md:flex-wrap max-md:gap-2 md:flex-col"
        >
          <CustomLink
            class="basis-[calc(25%-10.67px)] max-md:basis-[calc(50%-6px)]"
            v-for="item in asSeenAt"
            :key="item.href"
            :to="item.href"
          >
            <Card>
              <img
                class="max-md:scale-[0.75]"
                :src="item.imgPath"
                :alt="item.alt"
                :style="`height:${item.height}px !important;`"
              />
            </Card>
          </CustomLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
