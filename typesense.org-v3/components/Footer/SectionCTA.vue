<script setup lang="ts">
import ArrowRight from "@/assets/icons/arrow-right.svg";
import Dots from "@/assets/images/dots.svg";
</script>
<template>
  <section
    class="footer-cta relative mt-[200px] flex h-[500px] justify-between gap-[100px] overflow-hidden bg-secondary-bg pl-16 pt-20"
  >
    <div>
      <Badge>NO PHD REQUIRED</Badge>
      <h1 class="font-heading text-[56px] leading-[1.2]">
        Lightning-Fast <br /><strong>Open Source </strong>Search
      </h1>

      <div class="mt-10 flex items-center gap-3">
        <Button type="primary">
          Try For Free
          <ArrowRight class="text-text-inverted" />
        </Button>
        <Button type="white"> Typesense Cloud <ArrowRight /> </Button>
      </div>
    </div>
    <div class="relative bottom-[-12px]">
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
      class="absolute bottom-0 left-0 right-0 h-[93px] bg-[linear-gradient(180deg,rgba(231,231,231,0)_0%,#818181_100%)] opacity-15"
    ></div>
  </section>
</template>
