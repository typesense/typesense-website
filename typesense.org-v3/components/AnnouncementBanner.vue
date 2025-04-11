<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const opacity = ref(1);

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const fadeStart = 0;
  const fadeEnd = 200;
  
  if (scrollPosition <= fadeStart) {
    opacity.value = 1;
  } else if (scrollPosition >= fadeEnd) {
    opacity.value = 0;
  } else {
    opacity.value = 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div 
    class="fixed top-[72px] left-0 right-0 z-[100] max-md:top-[56px] transition-opacity duration-500"
    :style="{ opacity }"
  >
    <div class="container mx-auto flex justify-center px-4 md:w-[95%] xl:max-w-6xl max-md:px-0">
      <a 
        href="https://x.com/typesense/status/1910474969772876185" 
        target="_blank" 
        rel="noopener noreferrer"
        class="group inline-flex h-9 -mt-1 items-center gap-2 rounded-b-2xl bg-dark-bg px-5 py-2 text-xs font-light shadow-lg max-md:h-8 max-md:w-full max-md:px-4 max-md:py-1 max-md:gap-1.5 max-md:rounded-b-xl max-md:justify-center max-md:shadow-none"
      >
        <span class="inline-flex h-1 w-1 animate-pulse rounded-full bg-[#FFB800] max-md:h-[3px] max-md:w-[3px]"></span>
        <span class="rounded-sm bg-[#FFB800]/20 px-1 py-0.5 text-[10px] font-normal uppercase tracking-wider text-[#FFB800] max-md:text-[9px] max-md:px-0.5">New</span>
        <span class="text-text-inverted font-light whitespace-nowrap">
          <span class="max-md:hidden">Check out our billboards live in San Francisco</span>
          <span class="hidden max-md:inline text-[11px]">Check out our billboards live in SF</span>
        </span>
        <span class="ml-1 rounded px-2 py-1 text-[10px] font-light text-[#FFB800] transition-colors group-hover:text-[#FFB800]/70 max-md:text-[9px] max-md:px-1">
          view photos ›
        </span>
      </a>
    </div>
  </div>
</template>