<template>
  <div>
    <HomeSectionHero />

    <HomeSectionExpandedDescription />

    <div class="my-5">&nbsp;</div>
    <div class="my-1">&nbsp;</div>

    <HomeBadges />

    <div class="my-5">&nbsp;</div>

    <HomeSectionUsersAndMentions />

    <div class="mt-5">&nbsp;</div>

    <HomeSectionFeatureList />

    <div class="my-5">&nbsp;</div>
    <div class="my-2">&nbsp;</div>

    <HomeSectionDeveloperExperience />

    <div class="my-3">&nbsp;</div>

    <HomeSectionAPILibraries class="mt-5" />

    <div class="my-1">&nbsp;</div>

    <HomeSectionShowcase class="mt-5" />

    <div class="mt-3">&nbsp;</div>

    <HomeSectionSupport class="mt-5" />

    <div class="mt-5">&nbsp;</div>
    <div class="my-5 text-center">
      <HomeCTAs />
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Typesense is a fast, typo-tolerant search engine optimized for instant search-as-you-type experiences and ease of use.',
        },
      ],
    }
  },
}
</script>
