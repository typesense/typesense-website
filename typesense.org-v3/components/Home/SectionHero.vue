<script setup lang="ts">
import ArrowRight from "@/assets/icons/arrow-right.svg";
</script>
<template>
  <section class="flex w-full flex-col items-center pt-32 text-center">
    <Badge>NO PHD REQUIRED</Badge>
    <h1 class="font-heading text-[56px] leading-[1.2]">
      Lightning Fast, <br /><strong>Open Source </strong>Search
    </h1>
    <p class="subtext">
      Cutting-edge, in-memory search engine for mere mortals. Knowledge of
      rocket science optional.
    </p>

    <div class="mb-14 mt-[60px] flex items-center gap-3">
      <Button> Try For Free <ArrowRight /> </Button>
      <Button type="white"> Typesense Cloud <ArrowRight /> </Button>
    </div>

    <HomeSectionSearch />
  </section>
</template>
