<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="site-padding">
    <HomeSectionHero />
    <HomeSectionAchievements />
    <HomeSectionUsers />
    <HomeSectionUseCases />
    <HomeSectionComparison />
    <HomeSectionAPILibraries />
    <HomeSectionFeatures />
  </div>
  <HomeSectionDeveloperExperience />
  <div class="site-padding">
    <HomeSectionIntegrations />
    <HomeSectionShowcase />
    <HomeSectionSearchUIIntegration />
    <HomeSectionSupport />
  </div>
</template>
