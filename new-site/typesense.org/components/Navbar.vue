<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-dark">
    <div class="container">
      <NuxtLink :to="'/'" class="navbar-brand">
        <img
          src="~/assets/typesense_logo_white.svg"
          alt="Typesense"
          width="200"
        />
      </NuxtLink>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item justify-content-center align-self-center mr-5">
            <GithubButton
              href="https://github.com/typesense/typesense"
              data-icon="octicon-star"
              data-size="small"
              data-show-count="true"
              aria-label="Star typesense/typesense on GitHub"
              >Star
            </GithubButton>
          </li>
          <li
            v-for="item in data.navLinks"
            :key="item.link || item.externalLink"
            class="nav-item"
          >
            <a
              v-if="item.externalLink"
              :href="item.externalLink"
              class="nav-link"
              target="_blank"
            >
              {{ item.text }}
            </a>
            <NuxtLink v-if="item.link" :to="item.link" class="nav-link">
              {{ item.text }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import GithubButton from 'vue-github-button'

export default {
  name: 'Navbar',
  components: {
    GithubButton,
  },
  computed: {
    data() {
      return {
        navLinks: [
          {
            text: 'Home',
            link: '/',
          },
          {
            text: 'About',
            link: '/about',
          },
          {
            text: 'Docs',
            externalLink: '/docs',
          },
          {
            text: 'Support',
            link: '/support',
          },
          {
            text: 'Github',
            externalLink: 'https://github.com/typesense/typesense',
          },
          {
            text: 'Hosted Search',
            externalLink: 'https://cloud.typesense.org',
          },
        ],
      }
    },
  },
}
</script>

<style scoped></style>
