<template>
  <div class="p-x-6 relative w-full overflow-x-hidden">
    <Navbar />
    <AnnouncementBanner />
    <main
      class="site-top-padding m-auto flex max-w-[1440px] flex-col gap-[var(--section-gap)]"
    >
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import AnnouncementBanner from "@/components/AnnouncementBanner.vue";
</script>
