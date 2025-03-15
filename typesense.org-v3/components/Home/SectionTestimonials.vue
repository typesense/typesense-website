<script lang="ts" setup>
import { type EmblaCarouselType } from "embla-carousel";
import { watchOnce } from "@vueuse/core";

const emblaApi = ref<EmblaCarouselType | null>(null);
const mediaQuery = ref<MediaQueryList | null>(null);
const totalCount = ref(0);
const current = ref(1);

const handleMediaChange = async (e: MediaQueryListEvent) => {
  if (e.matches) {
    await initEmbla();
  } else {
    // Clean up Embla when not needed
    if (emblaApi.value) {
      emblaApi.value.destroy();
      emblaApi.value = null;
    }
  }
};

const initEmbla = async () => {
  if (emblaApi.value) return;

  let EmblaCarousel = (await import("embla-carousel")).default;
  const emblaNode = document.querySelector("#embla") as HTMLDivElement;
  emblaApi.value = EmblaCarousel(emblaNode, { loop: false, startIndex: 1 });
  totalCount.value = emblaApi.value.slideNodes().length;
  current.value = emblaApi.value.selectedScrollSnap();

  emblaApi.value.on("select", () => {
    current.value = emblaApi.value?.selectedScrollSnap() || 0;
  });

  console.log(emblaApi.value);
};

function onDotClick(index: number) {
  emblaApi.value?.scrollTo(index);
}

onMounted(async () => {
  mediaQuery.value = window.matchMedia("(max-width: 767px)");
  mediaQuery.value.addEventListener("change", handleMediaChange);
  // Initial check
  if (mediaQuery.value.matches) {
    await initEmbla();
  }
});

onUnmounted(() => {
  if (mediaQuery.value) {
    mediaQuery.value.removeEventListener("change", handleMediaChange);
  }
  if (emblaApi.value) {
    emblaApi.value.destroy();
    emblaApi.value = null;
  }
});
</script>
<template>
  <section class="flex justify-between gap-10 max-md:flex-col">
    <div class="flex flex-col justify-between">
      <div class="flex-col items-center max-md:flex">
        <Badge>Testimonials</Badge>
        <h2>
          What <strong>People</strong> Say<br />
          about Typesense
        </h2>
        <p class="subtext">Rave reviews from our community</p>
      </div>
      <img
        width="135"
        class="mb-6 select-none max-md:hidden"
        src="/images/backgrounds/quote.svg"
        alt="quote"
      />
    </div>
    <div id="embla">
      <div
        class="flex flex-1 flex-col items-end justify-between gap-4 max-md:flex-row max-md:items-stretch max-md:gap-2"
      >
        <div class="card mr-[-80px] mt-24 h-min flex-1 max-md:mr-0 max-md:mt-0">
          <p class="subtext !mt-0">
            We made the switch to Typesense from Algolia and never looked back.
            As our business was scaling incredibly fast, Typesense was able to
            provide superior performance, technology and support which allowed
            us to take one large feature off our plates while focusing on other
            core business functionalities.
          </p>
          <img
            class="self-end"
            width="73.5"
            src="/images/user_logos/kick-logo.svg"
            alt="Kick"
          />
        </div>
        <div class="card relative right-24 !bg-secondary-bg max-md:right-0">
          <p class="subtext !mt-0 opacity-75">
            We switched from our in-house search solution to Typesense Cloud in
            a matter of days, and it has been working reliably for months now.
            Integrating it into our existing tech stack was a breeze, and the
            customization options within the Cloud Dashboard have been the real
            highlights so far.
          </p>
          <img class="self-end" src="/images/user_logos/n8n.svg" alt="n8n" />
        </div>
        <div class="card">
          <p class="subtext !mt-0">
            Switched from elasticsearch to @typesense and I think these results
            speak for themselves. The best part? The ranking is better too! ...
            This is what I like to call "brick-shittingly good improvement"
          </p>
          <span class="subtext !mt-0 self-end">- @nucknyan on twitter</span>
        </div>
      </div>
      <div class="mt-6 flex justify-center gap-1 md:hidden">
        <button
          class="px-1"
          v-for="(_, index) in totalCount"
          @click="onDotClick(index)"
          :key="index"
        >
          <div
            class="size-2 rounded-full bg-bg-gray-3"
            :class="{
              'bg-text-muted': index == current,
            }"
          ></div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  @apply flex min-h-[200px] min-w-[726px] max-w-[726px] flex-col justify-between gap-5 rounded-2xl bg-bg-gray-2 px-6 py-4 max-md:min-w-0 max-md:flex-[0_0_90%] max-md:p-4;
}
</style>
