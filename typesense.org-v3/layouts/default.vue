<template>
  <div class="p-x-6 relative w-full overflow-x-hidden">
    <Navbar />
    <main class="m-auto flex max-w-[1440px] flex-col gap-[var(--section-gap)]">
      <slot />
    </main>
    <Footer />
  </div>
</template>
