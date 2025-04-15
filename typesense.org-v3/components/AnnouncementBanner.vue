<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ArrowRight from "@/assets/icons/arrow-right.svg";

const opacity = ref(1);

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const fadeStart = 0;
  const fadeEnd = 100;

  if (scrollPosition <= fadeStart) {
    opacity.value = 1;
  } else if (scrollPosition >= fadeEnd) {
    opacity.value = 0;
  } else {
    opacity.value = 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div
    class="fixed left-0 right-0 top-24 z-30 transition-opacity duration-500 max-md:top-16"
    :style="{ opacity }"
  >
    <div class="container mx-auto flex justify-center px-4">
      <a
        href="https://typesense.org/blog/typesense-on-san-francisco-billboards-apr-2025/"
        target="_blank"
        rel="noopener noreferrer"
        class="group inline-flex h-9 items-center gap-2 rounded-full bg-primary px-3 py-2.5 text-sm max-md:-mt-1 max-md:text-xs"
      >
        <img src="/icons/promo.svg" alt="New announcement" />
        <span class="whitespace-nowrap text-text-inverted">
          <span class="max-md:hidden"
            >Check out our billboards live in San Francisco</span
          >
          <span class="hidden max-md:inline"
            >Check out our billboards live in SF</span
          >
        </span>
        <span
          class="inline-flex items-center gap-1 rounded font-normal tracking-tight text-secondary underline underline-offset-[3px] transition-colors group-hover:text-secondary/85 md:ml-1"
        >
          View Photos <ArrowRight class="stroke-[1.75px]" />
        </span>
      </a>
    </div>
  </div>
</template>
