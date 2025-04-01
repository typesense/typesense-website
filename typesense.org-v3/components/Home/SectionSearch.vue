<script async setup lang="ts">
import BackgroundIllustration from "@/assets/images/background-illustration.svg";

onMounted(() => {
  const input = document.querySelector(
    "#section-search-focus .ais-SearchBox input[type=search]",
  ) as HTMLInputElement;
  if (input) {
    input?.focus();
    var val = input?.value;
    input.value = "";
    input.value = val;
  }
});
</script>

<template>
  <div class="relative min-h-[414px]">
    <BackgroundIllustration
      class="pointer-events-none absolute left-1/2 top-1/2 z-[-4] -translate-x-1/2 -translate-y-[42.5%] max-sm:hidden"
    />
    <div class="mb-1 text-sm text-text-muted/50 tracking-[-0.72px]">
      Try searching for a recipe ↴
    </div>
    <div
      id="section-search-focus"
      class="relative w-[784px] rounded-xl p-2 max-sm:w-full max-sm:overflow-hidden max-sm:p-1"
    >
      <div class="background"></div>
      <div class="gradient-secondary max-sm:hidden"></div>
      <div class="gradient"></div>
      <SearchDemo
        :class-names="{
          searchBarWrapper:
            'max-sm:flex-col max-sm:items-start max-sm:[&_.input-wrapper]:border-b-2 max-sm:[&_.input-wrapper]:border-bg-gray-1 max-sm:[&_.stats]:py-2',
          hitItem: '[&_a]:!text-text-muted',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.background {
  @apply pointer-events-none absolute inset-0 z-[-1];
  border-radius: 12px;
  box-shadow:
    0px 4px 80px 0px rgba(165, 165, 165, 0.15),
    0px 4px 9px 0px rgba(255, 255, 255, 0.25) inset;
}
.gradient-secondary {
  @apply absolute left-1/2 top-1/2 z-[-2] -translate-x-1/2 -translate-y-1/2 bg-secondary;
  width: 683.999px;
  height: 272px;
  opacity: 0.3;
  filter: blur(150px);
}
.gradient {
  @apply absolute inset-0 z-[-3] overflow-hidden rounded-xl;
}
.gradient::after {
  @apply pointer-events-none z-[-3] block size-full;
  content: "";
  background: linear-gradient(
    110deg,
    rgba(255, 255, 101, 0.3) -1.25%,
    rgba(53, 63, 215, 0.3) 99.32%
  );
  filter: blur(92px);
}
</style>
