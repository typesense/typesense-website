<template>
  <div>
    <header>
      <Navbar color-scheme="dark" />
    </header>
    <SupportSectionHero />
    <SupportSectionTiers />
    <SupportSectionLowerCTA class="mt-5" />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Support | Typesense',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            "Need help building with Typesense? We've got your covered. Github issues, Slack community, Weekly Office Hours, Email, Phone Calls.",
        },
      ],
    }
  },
}
</script>
