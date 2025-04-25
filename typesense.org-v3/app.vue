<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  --site-padding: 32px;
  --section-gap: 200px;
  --site-top-padding: calc(100px + 72px);
  --content-max-width: min(
    100%,
    calc(1440px - 2 * (152px - var(--site-padding)))
  );
}
@media not all and (min-width: 768px) {
  :root {
    --section-gap: 120px;
    --site-top-padding: calc(72px + 56px);
  }
}
@media not all and (min-width: 640px) {
  :root {
    --site-padding: 16px;
  }
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  font-family: "Inter", sans-serif;
  font-weight: 300;
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
  @apply max-md:!text-[24px];
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
b {
  font-weight: 500;
}

.site-padding {
  max-width: min(100%, calc(1440px - 2 * (152px - var(--site-padding))));
  margin: 0 auto;
  padding: 0 var(--site-padding);
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

.site-top-padding {
  margin-top: var(--site-top-padding);
}
.scrollbar-hidden {
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
