<!--
  empty stand-in for vitepress's own VPNavBarSearch, aliased in config.mts. the
  stock one drags in @docsearch/css and .DocSearch-* rules that collide with our
  modal. only the layout box survives, search itself lives in Layout.vue.

  the alias keys on this filename, update it if a vitepress upgrade renames it.
-->
<template>
  <div class="VPNavBarSearch" />
</template>

<style>
.VPNavBarSearch {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .VPNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch {
    padding-left: 32px;
  }
}
</style>
