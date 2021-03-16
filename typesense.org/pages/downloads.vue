<template>
  <div>
    <header>
      <Navbar color-scheme="dark" />
    </header>
    <DownloadsSectionHero />
    <DownloadsSectionLinks />
    <DownloadsSectionLowerCTA class="mt-5" />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Downloads | Typesense',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Run on Typesense Cloud, or download DEB, RPM and binary packages.',
        },
      ],
    }
  },
}
</script>
