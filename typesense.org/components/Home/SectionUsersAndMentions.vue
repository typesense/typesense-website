<template>
  <div class="py-5 container">
    <h2 class="text-center text-gradient-2">Trusted by teams of all sizes</h2>
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

    <div class="mb-4">&nbsp;</div>

    <HomeBadges />

    <div class="mb-3">&nbsp;</div>

    <div class="bg-light-2 p-5 mt-5">
      <div class="row">
        <div class="col-sm">
          <div class="text-center">
            <h5 class="mb-3">As Seen At</h5>
            <div class="d-flex justify-content-center align-items-baseline">
              <a
                href="https://www.youtube.com/watch?v=qBkyU1TJKDg&t=2404s"
                target="_blank"
              >
                <img
                  :src="require(`~/assets/images/Google-IO-Logo.svg`)"
                  alt="Typesense at Google/IO"
                  width="200"
                  height="83"
                />
              </a>
              <a
                href="https://typesense.org/blog/typesense-on-nasdaq-billboard-aug-2022/"
                target="_blank"
                class="ml-5"
              >
                <img
                  :src="require(`~/assets/images/NASDAQ_Logo.svg`)"
                  alt="Typesense on Nasdaq Billboard"
                  width="170"
                  height="48"
                />
              </a>
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
          href: 'https://ade.aero',
          imgPath: 'user_logos/aerotrade.svg',
          width: 150,
          height: 16,
          alt: 'AeroTrade',
        },
        {
          href: 'https://tradingstrategy.ai/blog/world-fastest-token-search',
          imgPath: 'user_logos/trading-strategy.svg',
          width: 125,
          height: 31,
          alt: 'Trading Stragey',
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
          href: 'https://soundsnap.com',
          imgPath: 'user_logos/soundsnap.svg',
          width: 150,
          height: 28,
          alt: 'Soundsnap',
        },
        {
          href: 'https://poorvika.com',
          imgPath: 'user_logos/poorvika-logo.svg',
          width: 150,
          height: 31,
          alt: 'Poorvika Mobiles',
        },
        {
          href: 'https://whatsinmyjar.com',
          imgPath: 'user_logos/whats_in_my_jar.svg',
          width: 75,
          height: 20,
          alt: "What's In My Jar",
        },
        {
          href: 'https://instatus.com',
          imgPath: 'user_logos/instatus.svg',
          width: 120,
          height: 26,
          alt: 'Instatus',
        },
        {
          href: 'https://www.echidnasewing.com.au',
          imgPath: 'user_logos/echidna-sewing-logo.svg',
          width: 95,
          height: 39,
          alt: 'Echidna Sewing',
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
