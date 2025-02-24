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
  overflow-x: hidden;
}
h1 {
  @apply font-heading;
  font-size: 56px;
  line-height: 1.2;
  letter-spacing: -1.44px;
}
h1 strong {
  @apply text-primary;
  font-weight: inherit;
}
</style>
