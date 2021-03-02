<template>
  <nav
    class="navbar navbar-expand-lg py-4"
    :class="colorScheme === 'light' ? 'text-light' : 'text-dark'"
  >
    <div class="container">
      <NuxtLink :to="'/'" class="navbar-brand">
        <img
          :src="
            colorScheme === 'light'
              ? require('~/assets/images/typesense_logo_white.svg')
              : require('~/assets/images/typesense_logo.svg')
          "
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
          <li class="nav-item justify-content-center align-self-end mr-5">
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
              :class="colorScheme === 'light' ? 'text-light' : 'text-dark'"
              class="nav-link"
              target="_blank"
            >
              {{ item.text }}
            </a>
            <NuxtLink
              v-if="item.link"
              :to="item.link"
              :class="colorScheme === 'light' ? 'text-light' : 'text-dark'"
              class="nav-link"
            >
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
  props: {
    colorScheme: {
      type: String,
      default: 'light',
    },
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

<style lang="scss" scoped>
GithubButton {
  line-height: unset;
}

.navbar {
  font-size: 0.85rem;
}

.navbar-expand-lg .navbar-nav .nav-link {
  padding-right: 0;
  padding-left: 0;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.nav-link {
  &.text-light {
    &.nuxt-link-exact-active {
      padding-bottom: 0;
      border-bottom: $primary 1px solid;
    }

    &:hover {
      color: unset !important;
      padding-bottom: 0;
      border-bottom: $primary 1px solid;
    }
  }

  &.text-dark {
    &.nuxt-link-exact-active {
      padding-bottom: 0;
      border-bottom: $primary 2px solid;
    }

    &:hover {
      color: unset !important;
      padding-bottom: 0;
      border-bottom: $primary 2px solid;
    }
  }
}
</style>
