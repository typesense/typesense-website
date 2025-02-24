<script lang="ts" setup>
const userLogos = [
  {
    href: "https://codecademy.com",
    imgPath: "/user_logos/codecademy-logo.svg",
    height: 26 * 1.2,
    alt: "Codecademy",
  },
  {
    href: "https://www.logitech.com",
    imgPath: "/user_logos/logitech_logo.svg",
    height: 25 * 1.2,
    alt: "Logitech",
  },
  {
    href: "https://www.bbcmaestro.com",
    imgPath: "/user_logos/bbc-maestro-logo.svg",
    height: 17 * 1.2,
    alt: "Soundsnap",
  },
  {
    href: "https://kick.com",
    imgPath: "/user_logos/kick-logo.svg",
    height: 15 * 1.2,
    alt: "Kick.com",
  },
  {
    href: "https://lonelyplanet.com",
    imgPath: "/user_logos/lonely-planet-logo.svg",
    height: 19 * 1.2,
    alt: "Lonely Planet",
  },
  {
    href: "https://changelog.com",
    imgPath: "/user_logos/changelog.svg",
    height: 34 * 1.2,
    alt: "Changelog",
  },
  {
    href: "https://eats.oddle.me",
    imgPath: "/user_logos/oddle_eats.svg",
    height: 15 * 1.2,
    alt: "Oddle Eats",
  },
  {
    href: "https://macrofactorapp.com",
    imgPath: "/user_logos/macro-factor.svg",
    height: 18 * 1.2,
    alt: "Macro Factor",
    noref: true,
  },
  {
    href: "https://poorvika.com",
    imgPath: "/user_logos/poorvika-logo.svg",
    height: 24 * 1.2,
    alt: "Poorvika Mobiles",
  },
  {
    href: "https://elevenlabs.io",
    imgPath: "/user_logos/eleven-labs.svg",
    height: 14 * 1.2,
    alt: "ElevenLabs",
  },
];
</script>

<template>
  <section class="mt-[200px]">
    <div class="grid grid-cols-4 grid-rows-4 gap-4">
      <div class="col-span-2 mb-6">
        <Badge>You'll be in good company</Badge>
        <h2>
          From <strong>Scrappy</strong> Startups to
          <strong>Household</strong> Names
        </h2>
      </div>

      <img
        class="col-span-2 row-span-2 mt-3.5 max-h-[390px] w-full rounded-3xl object-cover"
        src="@/assets/images/typesense-on-nasdaq.jpeg"
        alt="Typesense on Nasdaq billboard in New York City"
      />
      <Card v-for="userLogo in userLogos">
        <a :key="userLogo.href" :href="userLogo.href" target="_blank">
          <img
            class=""
            :src="userLogo.imgPath"
            :alt="userLogo.alt"
            :style="`height:${userLogo.height}px !important;`"
          />
        </a>
      </Card>
    </div>
  </section>
</template>
