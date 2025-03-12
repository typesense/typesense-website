<script setup lang="ts">
import ArrowRight from "@/assets/icons/arrow-right.svg";
</script>
<template>
  <section class="flex w-full flex-col items-center pt-32 text-center">
    <Badge>NO PHD REQUIRED</Badge>
    <h1>Lightning Fast, <br /><strong>Open Source </strong>Search</h1>
    <p class="subtext max-sm:hidden">
      Cutting-edge, in-memory search engine for mere mortals. Knowledge of
      rocket science optional.
    </p>

    <div
      class="mt-[60px] flex flex-col gap-14 max-sm:mt-7 max-sm:flex-col-reverse max-sm:gap-8"
    >
      <div class="flex flex-col items-center">
        <p class="subtext !mt-0 mb-6 text-base sm:hidden">
          Typesense is a lightning-fast, open-source search engine designed to
          deliver instant, relevant search results.
        </p>
        <div class="flex items-center gap-3">
          <Button> Try For Free <ArrowRight /> </Button>
          <Button type="white"> Typesense Cloud <ArrowRight /> </Button>
        </div>
      </div>
      <HomeSectionSearch />
    </div>
  </section>
</template>
