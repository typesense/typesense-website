<template>
  <div class="p-x-6 relative w-full overflow-x-hidden">
    <Navbar />
    <AnnouncementBanner />
    <main class="m-auto flex max-w-[1440px] flex-col gap-[var(--section-gap)] pt-[72px] max-md:pt-[56px]">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import AnnouncementBanner from '@/components/AnnouncementBanner.vue'
</script>
