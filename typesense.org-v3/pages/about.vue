<template>
  <img
    class="absolute left-1/2 top-0 z-[-1] -translate-x-1/2 max-md:hidden"
    src="/images/backgrounds/tunnels-top.svg"
    alt="background"
  />
  <div class="relative flex flex-col gap-[150px] max-md:gap-[120px]">
    <div class="site-padding mt-[120px] max-md:mt-24">
      <section>
        <div class="mb-4 flex gap-4 max-md:mb-2">
          <FlashFill /> <SearchFill />
        </div>
        <h1 class="mb-8 max-md:mb-4">About <strong>Us</strong></h1>
        <div class="flex max-w-[700px] flex-col gap-12">
          <p
            class="text-justify text-xl leading-[1.8] tracking-[-0.4px] text-text-muted max-md:text-[14px] [&_b]:text-text-primary"
          >
            Typesense is an open source, typo tolerant search engine that is
            optimized for <b>instant sub-50ms searches</b>, while providing an
            <b> intuitive developer experience </b>.<br /><br />
            We are a lean
            <CustomLink
              class="text-primary underline underline-offset-4"
              to="https://typesense.org/blog/why-we-are-not-raising-funds/"
              >customer-funded</CustomLink
            >
            team of engineers passionate about making great search technology
            accessible to everyone. We believe that search technology choices
            widely available to developers today, either have a steep learning
            curve and a heavy operational burden, or are proprietary and
            expensive.<br />
            <br />
            <b>We are on a mission to democratize search</b>. We want to reduce
            the time-to-market for developers to build a blazing-fast search
            experience that provides relevant results out-of-the-box, all
            without breaking the bank and without operational overhead.<br /><br />
            We are a small team trying to do big things and we believe that open
            sourcing our work helps combine forces with our community and
            force-multiply our collective efforts. If this resonates with you,
            <CustomLink
              class="underline underline-offset-4"
              to="https://github.com/typesense/typesense/blob/master/CONTRIBUTING.md"
              >here</CustomLink
            >
            are a couple of ways to get involved.
          </p>
          <img
            class="w-max self-end max-sm:w-[150px]"
            src="/typesense-team.svg"
            alt="From Typesense Team"
          />
        </div>
      </section>
    </div>
    <section>
      <Badge>Timeline</Badge>
      <h2 class="mb-14 text-center max-md:mb-8">
        Typesense<br class="show-md" />
        <strong> Journey</strong>
      </h2>
      <div class="flex w-full flex-col gap-3 tracking-[-0.42px]">
        <div
          class="relative flex items-center justify-between pr-12 text-[14px] max-md:pr-0 [&:last-of-type_.bar]:bg-secondary-bg"
          v-for="item in timeline"
          :key="item.achievement"
        >
          <div
            class="bar flex items-center justify-between gap-[52px] rounded-r-2xl bg-bg-gray-2 p-6 pl-12 font-semibold max-md:!w-full max-md:justify-start max-md:rounded-none max-md:pl-4"
            :style="`width:${item.width}%`"
          >
            <span>{{ item.year }}</span>
            <div
              class="whitespace-pre text-[18px] capitalize leading-[1.3] tracking-[-0.54px]"
            >
              {{ item.achievement }}
            </div>
          </div>
          <span class="opacity-50 max-md:hidden">{{ item.year }}</span>
          <div
            class="custom-border absolute bottom-[1px] left-0 right-0 top-[1px]"
          ></div>
        </div>
      </div>
      <div class="site-padding w-full">
        <div
          class="mt-[100px] grid w-full grid-cols-4 gap-4 max-md:grid-cols-1"
        >
          <div v-for="item in people" :key="item.img">
            <div
              class="relative overflow-hidden rounded-2xl bg-bg-gray-2 max-md:aspect-[3/2]"
            >
              <img
                class="absolute h-full w-full"
                src="/images/backgrounds/people-bg-gradient.svg"
                alt="Gradient background"
              />
              <img
                class="relative z-10 h-full w-full object-contain"
                :src="item.img"
                :alt="`${item.name}-${item.role}`"
              />
            </div>
            <h3 class="mb-1 mt-4 !text-[20px] !tracking-[-0.6px]">
              {{ item.name }}
            </h3>
            <div class="text-sm leading-[1.2] tracking-[-0.42px] text-primary">
              {{ item.role }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="site-padding w-full">
      <div class="flex w-full flex-col items-center">
        <h2 class="mb-12 max-md:mb-6">Try <strong>Typesense</strong></h2>
        <div
          class="grid w-full grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-2 [&_>_a]:aspect-[28/15] [&_>_a]:items-end max-md:[&_>_a]:aspect-[17/10] max-md:[&_>_a]:items-start [&_img]:size-[200px] max-md:[&_img]:size-[120px]"
        >
          <CustomLink
            to="/docs/guide"
            class="flex justify-between gap-6 rounded-3xl bg-secondary-bg p-6 max-md:p-4"
          >
            <div class="flex h-full flex-col justify-between">
              <ExternalArrow />
              <div>
                <div
                  class="mb-3 tracking-tighter max-md:mb-2 max-md:text-[14px]"
                >
                  Start Building with
                </div>
                <h3>
                  Typesense<br />
                  Open Source
                </h3>
              </div>
            </div>
            <img
              src="/images/illustrations/tasks.svg"
              alt="Typesense Features"
            />
          </CustomLink>
          <CustomLink
            :to="LINK_TYPESENSE_CLOUD"
            class="flex justify-between gap-6 rounded-3xl bg-bg-gray-2 p-6 max-md:p-4"
          >
            <div class="flex h-full flex-col justify-between">
              <ExternalArrow />
              <div>
                <div
                  class="mb-3 tracking-tighter max-md:mb-2 max-md:text-[14px]"
                >
                  Deploy on
                </div>
                <h3>
                  Typesense<br />
                  Cloud
                </h3>
              </div>
            </div>
            <img
              src="/images/illustrations/cloud.svg"
              alt="Typesense Features"
            />
          </CustomLink>
        </div>
      </div>
    </section>
    <img
      class="absolute bottom-[-735px] left-1/2 z-[-1] w-max -translate-x-1/2 scale-x-[1.35] max-md:bottom-[-240px] max-md:scale-[2]"
      src="/images/backgrounds/tunnels-top.svg"
      alt="background"
    />
  </div>
</template>
<style scoped>
section {
  @apply flex flex-col items-center;
}
.custom-border {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1438' height='93' viewBox='0 0 1438 93' fill='none'%3E%3Cline x1='1438' y1='0.5' x2='-8.99242e-08' y2='0.499939' stroke='%23B9B9B9' stroke-dasharray='10 10'/%3E%3Cline x1='1438' y1='92.5' x2='-8.99242e-08' y2='92.4999' stroke='%23B9B9B9' stroke-dasharray='10 10'/%3E%3C/svg%3E");
}
</style>
<script lang="ts" setup>
useSeoMeta({
  title: "About Us | Typesense",
  ogTitle: "About Us | Typesense",
  description:
    "We are a lean team of engineers passionate about making great search technology accessible to everyone. Our goal is to democratize search.",
  ogDescription:
    "We are a lean team of engineers passionate about making great search technology accessible to everyone. Our goal is to democratize search.",
});

import ExternalArrow from "@/assets/icons/external-arrow.svg";
import FlashFill from "@/assets/icons/flash-fill.svg";
import SearchFill from "@/assets/icons/search-fill.svg";
const timeline = [
  {
    year: 2015,
    achievement: "The idea for\nTypesense is born",
    width: 30,
  },
  {
    year: 2018,
    achievement: "First open source\nrelease of Typesense",
    width: 40,
  },
  {
    year: 2020,
    achievement: "Typesense Cloud\nlaunches",
    width: 50,
  },
  {
    year: 2023,
    achievement: "1 Billion Searches per\nmonth on Typesense Cloud",
    width: 65,
  },
  {
    year: 2024,
    achievement: "10 Billion Searches per\nmonth on Typesense Cloud",
    width: 80,
  },
  {
    year: 2025,
    achievement: "20 Billion Searches per\nmonth on Typesense Cloud",
    width: 92,
  },
];
const people = [
  {
    name: "Tom Holand",
    role: "Founder",
    img: "/images/people/placeholder.png",
  },
  {
    name: "Tom Holand",
    role: "Founder",
    img: "/images/people/placeholder.png",
  },
  {
    name: "Tom Holand",
    role: "Founder",
    img: "/images/people/placeholder.png",
  },
  {
    name: "Tom Holand",
    role: "Founder",
    img: "/images/people/placeholder.png",
  },
];
</script>
