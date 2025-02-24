<script setup lang="ts">
import SectionHero from "~/components/Home/SectionHero.vue";
import SectionAchievements from "~/components/Home/SectionAchievements.vue";
import SectionUsers from "~/components/Home/SectionUsers.vue";
definePageMeta({
  layout: "default",
});
</script>

<template>
  <SectionHero />
  <SectionAchievements />
  <SectionUsers />
</template>
