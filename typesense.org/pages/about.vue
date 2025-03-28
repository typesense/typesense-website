<template>
  <div>
    <header>
      <Navbar color-scheme="dark" />
    </header>
    <AboutSectionHero />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'About Us | Typesense',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'We are a lean team of engineers passionate about making great search technology accessible to everyone. Our goal is to democratize search.',
        },
      ],
    }
  },
}
</script>
