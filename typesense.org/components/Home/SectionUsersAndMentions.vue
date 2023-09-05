<template>
  <div class="py-5 container">
    <h2 class="text-center text-gradient-2">Trusted by Teams of all Sizes</h2>
    <div class="text-center">You'll be in good company</div>

    <div class="row mt-3">
      <div class="col-sm">
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

    <div class="mb-5">&nbsp;</div>

    <HomeBadges />

    <div class="mb-3">&nbsp;</div>

    <div class="bg-light-2 p-5 mt-5">
      <div class="row">
        <div class="col-sm">
          <div class="text-center">
            <h5 class="mb-5">As Seen At</h5>
            <div>
              <a
                href="https://www.youtube.com/watch?v=qBkyU1TJKDg&t=2404s"
                target="_blank"
              >
                <img
                  :src="require(`~/assets/images/Google-IO-Logo.svg`)"
                  alt="Typesense at Google/IO"
                  width="200"
                  height="83"
                  style="object-position: 0px -10px"
                />
              </a>
              <a
                href="https://www.thoughtworks.com/en-us/radar/tools?blipid=202203031"
                target="_blank"
                class="ml-4 pt-3"
              >
                <img
                  :src="require(`~/assets/images/thoughtworks-logo.svg`)"
                  alt="Typesense on ThoughtWorks Technology Radar"
                  width="210"
                  height="61"
                />
              </a>
              <div class="mt-sm-3 mt-4">
                <a
                  href="https://twitter.com/jasonbosco/status/1565073075040882688"
                  target="_blank"
                  class="ml-4"
                >
                  <img
                    :src="require(`~/assets/images/NASDAQ_Logo.svg`)"
                    alt="Typesense on Nasdaq Billboard"
                    width="170"
                    height="48"
                  />
                </a>
                <div class="mt-4 mt-sm-5">
                  <a
                    href="https://twitter.com/jasonbosco/status/1565073075040882688"
                    target="_blank"
                  >
                    <!-- prettier-ignore -->
                    <img
                      :src="require(`~/assets/images/typesense-on-nasdaq.jpeg`)"
                      alt="Typesense on Nasdaq Billboard"
                      width="400"
                      class="img-fluid"
                      style="filter: drop-shadow(7px 7px 8px rgba(0,0,0,0.36)); border-radius: 5px;"
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
          width: 150,
          height: 30,
          alt: 'Codecademy',
        },
        {
          href: 'https://changelog.com',
          imgPath: 'user_logos/changelog.svg',
          width: 146,
          height: 45,
          alt: 'Changelog',
        },
        {
          href: 'https://eats.oddle.me',
          imgPath: 'user_logos/oddle_eats.svg',
          width: 120,
          height: 19,
          alt: 'Oddle Eats',
        },
        {
          href: 'https://macrofactorapp.com',
          imgPath: 'user_logos/macro-factor.svg',
          width: 150,
          height: 21,
          alt: 'Macro Factor',
          noref: true,
        },
        {
          href: 'https://poorvika.com',
          imgPath: 'user_logos/poorvika-logo.svg',
          width: 150,
          height: 31,
          alt: 'Poorvika Mobiles',
        },
        {
          href: 'https://ade.aero',
          imgPath: 'user_logos/aerotrade.svg',
          width: 150,
          height: 16,
          alt: 'AeroTrade',
        },
        {
          href: 'https://soundsnap.com',
          imgPath: 'user_logos/soundsnap.svg',
          width: 150,
          height: 28,
          alt: 'Soundsnap',
        },
        {
          href: 'https://tradingstrategy.ai/blog/world-fastest-token-search',
          imgPath: 'user_logos/trading-strategy.svg',
          width: 125,
          height: 31,
          alt: 'Trading Strategy',
        },
        {
          href: 'https://instatus.com',
          imgPath: 'user_logos/instatus.svg',
          width: 120,
          height: 26,
          alt: 'Instatus',
        },
        {
          href: 'https://rerobe.se',
          imgPath: 'user_logos/rerobe.svg',
          width: 90,
          height: 22,
          alt: 'Rerobe',
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 80px;
  justify-items: center;
  align-items: center;
  justify-content: space-evenly;
  align-content: space-evenly;

  @media (max-width: map-get($grid-breakpoints, 'sm')) {
    grid-template-columns: repeat(5, minmax(200px, 1fr));
    justify-content: unset;
    grid-auto-rows: 80px;
  }
}
</style>
