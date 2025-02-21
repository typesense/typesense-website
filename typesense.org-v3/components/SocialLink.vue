<script lang="ts" setup>
interface Props {
  accent?: bool;
}

const { accent = false } = defineProps<Props>();
</script>
<template>
  <a
    href="/"
    target="_blank"
    rel="noopener noreferrer"
    :class="`${accent ? 'bg-secondary' : 'bg-muted'} flex size-[40px] items-center justify-center rounded-full`"
  >
    <slot></slot>
  </a>
</template>
