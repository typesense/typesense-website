<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  --site-margin: 8.421vw;
}
@media not all and (min-width: 640px) {
  :root {
    --site-margin: 16px;
  }
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  font-family: "Inter", sans-serif;
}
h1,
h2,
h3,
h4 {
  @apply font-heading font-medium capitalize;
  line-height: 1.2;
  letter-spacing: -1.44px;
}
h1 {
  @apply max-sm:!text-[40px];
  font-size: 56px;
}
h2 {
  @apply max-sm:!text-[32px];
  font-size: 48px;
}
h3 {
  font-size: 32px;
}
h4 {
  @apply max-sm:!text-[20px];
  font-size: 24px;
}
h1 strong,
h2 strong {
  @apply text-primary;
  font-weight: inherit;
}

.site-padding {
  margin: 0 var(--site-margin);
}
</style>
