<template>
  <div class="py-5">
    <div class="container">
      <h2 class="text-center text-gradient-2">Trusted by Teams of all Sizes</h2>
      <div class="text-center">You'll be in good company</div>

      <div class="row d-flex justify-content-center mt-3">
        <div class="col-sm-10">
          <div class="text-center logos-container overflow-auto mt-4">
            <a
              v-for="userLogo in userLogos"
              :key="userLogo.href"
              :href="userLogo.href"
              target="_blank"
            >
              <img
                :src="require(`~/assets/images/${userLogo.imgPath}`)"
                :alt="userLogo.alt"
                :width="userLogo.width"
                :height="userLogo.height"
                class="mt-4 mt-sm-0"
              />
            </a>
          </div>
        </div>
      </div>

      <div class="mb-3">&nbsp;</div>
    </div>
    <div class="p-5 mt-4">
      <div class="row">
        <div class="col-sm">
          <div class="text-center">
            <h3 class="mb-5 text-gradient-1">As Seen At</h3>
            <div class="row">
              <div class="col-sm-5 d-flex flex-column align-items-sm-end pl-4">
                <div class="mb-5">
                  <a
                    href="https://www.youtube.com/watch?v=qBkyU1TJKDg&t=2404s"
                    target="_blank"
                  >
                    <img
                      :src="require(`~/assets/images/Google-IO-Logo.svg`)"
                      alt="Typesense at Google I/O"
                      height="75"
                      style="object-position: 0px -10px"
                    />
                  </a>
                </div>
                <div class="mb-5">
                  <a
                    href="https://www.thoughtworks.com/en-us/radar/tools?blipid=202203031"
                    target="_blank"
                    class="ml-4 pt-3"
                  >
                    <img
                      :src="require(`~/assets/images/thoughtworks-logo.svg`)"
                      alt="Typesense on ThoughtWorks Technology Radar"
                      height="55"
                    />
                  </a>
                </div>
                <div class="mb-3">
                  <a
                    href="https://twitter.com/jasonbosco/status/1565073075040882688"
                    target="_blank"
                    class="ml-4"
                  >
                    <img
                      :src="require(`~/assets/images/NASDAQ_Logo.svg`)"
                      alt="Typesense on Nasdaq Billboard"
                      height="40"
                    />
                  </a>
                </div>
              </div>
              <div
                class="col-sm-7 d-flex flex-column align-items-start mt-5 mt-sm-0"
              >
                <a
                  href="https://twitter.com/jasonbosco/status/1565073075040882688"
                  target="_blank"
                >
                  <!-- prettier-ignore -->
                  <img
                      :src="require(`~/assets/images/typesense-on-nasdaq.jpeg`)"
                      alt="Typesense on Nasdaq Billboard"
                      width="400"
                      class="img-fluid ml-sm-5"
                      style="filter: drop-shadow(0px 0px 10px #ffdd1750); border-radius: 15px;"
                      loading="lazy"
                    />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userLogos: [
        {
          href: 'https://codecademy.com',
          imgPath: 'user_logos/codecademy-logo.svg',
          height: 26,
          alt: 'Codecademy',
        },
        {
          href: 'https://www.logitech.com',
          imgPath: 'user_logos/logitech_logo.svg',
          height: 25,
          alt: 'Logitech',
        },
        {
          href: 'https://changelog.com',
          imgPath: 'user_logos/changelog.svg',
          height: 37,
          alt: 'Changelog',
        },
        {
          href: 'https://kick.com',
          imgPath: 'user_logos/kick-logo.svg',
          height: 15,
          alt: 'Kick.com',
        },
        {
          href: 'https://elevenlabs.io',
          imgPath: 'user_logos/eleven-labs.svg',
          height: 15,
          alt: 'ElevenLabs',
        },
        {
          href: 'https://eats.oddle.me',
          imgPath: 'user_logos/oddle_eats.svg',
          height: 15,
          alt: 'Oddle Eats',
        },
        {
          href: 'https://macrofactorapp.com',
          imgPath: 'user_logos/macro-factor.svg',
          height: 17,
          alt: 'Macro Factor',
          noref: true,
        },
        {
          href: 'https://poorvika.com',
          imgPath: 'user_logos/poorvika-logo.svg',
          height: 24,
          alt: 'Poorvika Mobiles',
        },
        {
          href: 'https://lonelyplanet.com',
          imgPath: 'user_logos/lonely-planet-logo.svg',
          height: 18,
          alt: 'Lonely Planet',
        },
        {
          href: 'https://soundsnap.com',
          imgPath: 'user_logos/soundsnap.svg',
          height: 25,
          alt: 'Soundsnap',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
a {
  border-bottom: none;
}

.logos-container {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  grid-auto-rows: 80px;
  justify-items: center;
  align-items: center;
  justify-content: space-evenly;
  align-content: space-evenly;

  @media (max-width: map-get($grid-breakpoints, 'sm')) {
    grid-template-columns: repeat(5, minmax(170px, 1fr));
    justify-content: unset;
    grid-auto-rows: 80px;
  }
}
</style>
