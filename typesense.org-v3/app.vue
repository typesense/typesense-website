<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  font-family: "Inter", sans-serif;
}
h1 {
  @apply font-heading;
  font-size: 56px;
  line-height: 1.2;
}
h1 strong {
  @apply text-primary;
  font-weight: inherit;
}
</style>
