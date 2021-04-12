<template>
  <div class="docs-sections">
    <DocsSectionButton section-link="#what-s-new" section-name="What's New" />
    <DocsSectionButton :section-link="`/${$page.typesenseVersion}/guide/`" section-name="Guide" />
    <DocsSectionButton :section-link="`/${$page.typesenseVersion}/api/`" section-name="API Reference" />
  </div>
</template>

<style scoped lang="stylus">
.docs-sections
  display grid
  grid-template-columns: repeat(3, 1fr)
  gap 10px

  @media(max-width $MQMobile)
    grid-template-columns: repeat(1, 1fr)
    grid-template-rows: repeat(3, 1fr)
</style>
