<script lang="ts" setup>
const { searchPlaceHolder, autocompleteItems } = defineProps({
  searchPlaceHolder: {
    type: String,
    default: "Type in a search term...",
  },
  autocompleteItems: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
</script>
<template>
  <ul
    class="flex min-h-64 w-[386px] flex-col gap-1.5 rounded-3xl bg-bg p-4 shadow-[-5px_4px_34px_0px_rgba(0,0,0,0.10)]"
  >
    <li class="flex-1 !font-normal !text-primary">{{ searchPlaceHolder }}</li>
    <li v-for="item in autocompleteItems" :key="item">
      {{ item }}
    </li>
    <li v-if="autocompleteItems.length > 0"></li>
  </ul>
</template>

<style scoped>
li {
  @apply flex h-14 items-start text-nowrap rounded-xl bg-bg-gray-2 p-5 text-sm font-light tracking-tight text-[#c1c1c1];
}
</style>
