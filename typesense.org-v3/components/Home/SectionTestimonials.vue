<script lang="ts" setup>
import { type EmblaCarouselType } from "embla-carousel";

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
  <section class="flex justify-between gap-10 max-[1180px]:flex-col">
    <div class="flex flex-1 flex-col justify-between">
      <div class="flex-col items-center max-md:flex">
        <Badge>Testimonials</Badge>
        <h2 class="text-nowrap">
          What <strong>People</strong> Say<br />
          about Typesense
        </h2>
        <p class="subtext">Rave reviews from our community</p>
      </div>
      <img
        width="135"
        class="mb-6 select-none max-[1180px]:hidden"
        src="/images/backgrounds/quote.svg"
        alt="quote"
      />
    </div>
    <div id="embla">
      <div
        class="flex flex-1 flex-col items-end justify-between gap-4 max-md:flex-row max-md:items-stretch max-md:gap-2"
      >
        <div class="card flex-1 min-[1180px]:mt-24 min-[1360px]:mr-[-80px]">
          <p class="subtext !mt-0">
            We made the switch to Typesense from Algolia and never looked back.
            As our business was scaling incredibly fast, Typesense was able to
            provide superior performance, technology and support which allowed
            us to take one large feature off our plates while focusing on other
            core business functionalities.
          </p>
          <CustomLink to="https://kick.com/" class="self-end">
            <img
              width="73.5"
              src="/images/user-logos/kick-logo.svg"
              alt="Kick"
            />
          </CustomLink>
        </div>
        <div class="card !bg-secondary-bg md:relative md:right-24">
          <p class="subtext !mt-0 opacity-75">
            We switched from our in-house search solution to Typesense Cloud in
            a matter of days, and it has been working reliably for months now.
            Integrating it into our existing tech stack was a breeze, and the
            customization options within the Cloud Dashboard have been the real
            highlights so far.
          </p>
          <CustomLink to="https://n8n.io/" class="self-end">
            <img src="/images/user-logos/n8n.svg" alt="n8n" />
          </CustomLink>
        </div>
        <div class="card">
          <div class="flex justify-between gap-5 max-md:flex-col">
            <p class="subtext !mt-0">
              Switched from elasticsearch to @typesense and I think these
              results speak for themselves. The best part? The ranking is better
              too! ... This is what I like to call "brick-shittingly good
              improvement"
            </p>
            <img
              class="m-auto max-w-[200px] rounded-xl"
              src="/images/tweet-testimonial.png"
              alt="Switched from elasticsearch to @typesense"
            />
          </div>
          <CustomLink
            to="https://x.com/nucknyan/status/1700673403970326989"
            class="self-end"
          >
            -
            <span class="subtext !mt-0 self-end underline underline-offset-2"
              >@nucknyan on twitter</span
            >
          </CustomLink>
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
  @apply flex min-h-[200px] w-full max-w-[680px] flex-col justify-between gap-5 rounded-2xl bg-bg-gray-2 px-6 py-4 max-lg:max-w-[min(680px,85%)] max-md:min-w-0 max-md:flex-[0_0_90%] max-md:p-4;
}
</style>
