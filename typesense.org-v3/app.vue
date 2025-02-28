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
h1,
h2 {
  @apply font-heading font-medium capitalize;
  font-size: 56px;
  line-height: 1.2;
  letter-spacing: -1.44px;
}
h2 {
  font-size: 48px;
}
h1 strong,
h2 strong {
  @apply text-primary;
  font-weight: inherit;
}
.subtext {
  @apply mt-2 text-base tracking-tighter text-text-muted;
  line-height: 1.8;
}
</style>
