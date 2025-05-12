<script setup lang="ts">
import Dots from "@/assets/images/dots.svg";
</script>
<template>
  <section
    class="footer-cta relative mt-[var(--section-gap)] flex h-[500px] justify-between gap-20 overflow-hidden bg-secondary-bg pl-16 pt-20 max-lg:h-[700px] max-lg:flex-col max-lg:gap-[52px] max-lg:px-4 max-lg:pt-8 max-sm:h-[500px]"
  >
    <div class="flex-col items-center max-lg:flex">
      <Badge>NO PHD REQUIRED</Badge>
      <h1 class="text-nowrap max-lg:text-center max-sm:!text-[32px]">
        Lightning-Fast <br class="max-lg:hidden" /><strong
          >Open <br class="show-lg" />Source </strong
        ><br class="max-lg:hidden" />Search
      </h1>

      <div class="mt-10 flex items-center gap-3 max-md:mt-6">
        <Button :link="STATIC.link_get_started" with-arrow type="primary">
          Quick Start
        </Button>
        <Button :link="STATIC.link_typesense_cloud" with-arrow type="white">
          Typesense Cloud
        </Button>
      </div>
    </div>
    <div
      class="relative bottom-[-12px] max-lg:absolute max-lg:-bottom-[160px] max-lg:right-0 max-[900px]:left-10 max-sm:-bottom-[254px] max-sm:left-6"
    >
      <div
        class="flex h-full w-[860px] flex-col gap-4 rounded-tl-3xl bg-bg-gray-2 px-4 pt-4 shadow-[-5px_4px_34px_0px_rgba(0,0,0,0.10)]"
      >
        <div>
          <Dots />
        </div>
        <SearchDemo
          :class-names="{
            searchBarWrapper: '!mb-3',
            hitList: '!gap-1.5 bg-bg-gray-2',
            hitItem:
              '!bg-bg !h-14 rounded-xl [&_.circle]:hidden [&_a]:!p-0 [&_a]:!text-text-muted [&_.external-link-icon]:!size-4',
          }"
        />
      </div>
    </div>

    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-[93px] bg-[linear-gradient(180deg,rgba(231,231,231,0)_0%,#818181_100%)] opacity-15 max-md:hidden"
    ></div>
  </section>
</template>
