<script lang="ts" setup>
interface Props {
  type?: "primary" | "secondary" | "white" | "primary-white-shadow";
}

const { type = "secondary" } = defineProps<Props>();

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
  <button
    :class="`flex items-center gap-2 rounded-full px-6 py-2 text-base font-semibold tracking-[-0.32px] shadow-[-4px_4px_0px_0px] shadow-dark-bg ${classes}`"
  >
    <slot></slot>
  </button>
</template>
