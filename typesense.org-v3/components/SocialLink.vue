<script lang="ts" setup>
interface Props {
  accent?: boolean;
  linkTo: string;
}

const { accent = false, linkTo } = defineProps<Props>();
</script>
<template>
  <a
    :href="linkTo"
    target="_blank"
    rel="noopener noreferrer"
    :class="`${accent ? 'bg-secondary' : 'bg-muted'} flex size-[40px] items-center justify-center rounded-full`"
  >
    <slot></slot>
  </a>
</template>
