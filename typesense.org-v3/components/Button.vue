<script lang="ts" setup>
import ArrowRight from "@/assets/icons/arrow-right.svg";

interface Props {
  type?: "primary" | "secondary" | "white" | "primary-white-shadow";
  link?: string;
  class?: string;
  withArrow?: boolean;
}

const {
  type = "secondary",
  link = "/",
  class: className = "",
  withArrow = false,
} = defineProps<Props>();

let classes = "";
switch (type) {
  case "secondary":
    classes = "bg-secondary text-text-primary";
    break;
  case "white":
    classes = "bg-bg text-text-primary";
    break;
  default:
    classes = "bg-primary text-white";
    break;
}
</script>
<template>
  <CustomLink :to="link">
    <button
      :class="`flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold tracking-[-0.32px] shadow-[-4px_4px_0px_0px] shadow-dark-bg max-md:px-4 max-md:py-2.5 max-sm:text-sm ${classes} ${className}`"
    >
      <slot></slot> <ArrowRight v-if="withArrow" />
    </button>
  </CustomLink>
</template>
