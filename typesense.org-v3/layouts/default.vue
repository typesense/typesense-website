<template>
  <div class="p-x-6 relative w-full overflow-x-hidden">
    <Navbar />
    <main class="flex flex-col gap-[var(--section-gap)]">
      <slot />
    </main>
    <Footer />
  </div>
</template>
