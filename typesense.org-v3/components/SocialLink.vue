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
    :class="`${accent ? 'bg-secondary hover:bg-secondary/70' : 'bg-muted hover:bg-muted/50'} flex size-[40px] items-center justify-center rounded-full text-black transition-colors duration-200 hover:text-black/70`"
  >
    <slot></slot>
  </a>
</template>
