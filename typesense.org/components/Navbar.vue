<template>
  <div>
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
            height="44"
          />
        </NuxtLink>
        <div :class="colorScheme === 'light' ? 'navbar-dark' : 'navbar-light'">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            @click="toggleNavbar"
          >
            <span class="navbar-toggler-icon" />
          </button>
        </div>

        <div
          id="navbarSupportedContent"
          class="collapse navbar-collapse"
          :class="{ show }"
        >
          <ul class="navbar-nav ml-auto">
            <!--            <li class="nav-item justify-content-center align-self-center mr-5">-->
            <!--              <a href="https://github.com/typesense/typesense">-->
            <!--                <img-->
            <!--                  src="https://img.shields.io/github/stars/typesense/typesense?style=social"-->
            <!--                  alt="GitHub Stars"-->
            <!--                  class="d-none d-sm-block"-->
            <!--                  height="20"-->
            <!--                />-->
            <!--              </a>-->
            <!--            </li>-->
            <li
              v-for="(item, index) in navLinks"
              :key="item.link || item.externalLink"
              class="nav-item"
            >
              <a
                v-if="item.externalLink"
                :href="item.externalLink"
                :class="[
                  colorScheme === 'light' ? 'text-light' : 'text-dark',
                  index === navLinks.length - 1 ? 'mr-0' : '',
                ]"
                class="nav-link"
                :target="item.target ? item.target : '_self'"
              >
                {{ item.text }}
              </a>
              <NuxtLink
                v-if="item.link"
                :to="item.link"
                :class="[
                  colorScheme === 'light' ? 'text-light' : 'text-dark',
                  index === navLinks.length - 1 ? 'mr-0' : '',
                ]"
                class="nav-link"
              >
                {{ item.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    colorScheme: {
      type: String,
      default: 'light',
    },
  },
  data() {
    return {
      show: false,
      navLinks: [
        {
          text: 'Home',
          link: '/',
        },
        {
          text: 'About',
          link: '/about/',
        },
        {
          text: 'Docs',
          externalLink: '/docs/',
          target: '_blank',
        },
        {
          text: 'Downloads',
          link: '/downloads/',
        },
        {
          text: 'Roadmap',
          externalLink: 'https://github.com/orgs/typesense/projects/1',
          target: '_blank',
        },
        {
          text: 'Typesense Cloud',
          externalLink: 'https://cloud.typesense.org',
          target: '_blank',
        },
        {
          text: 'Blog',
          externalLink: 'https://typesense.org/blog/',
          target: '_blank',
        },
        {
          text: 'Support',
          link: '/support/',
        },
      ],
    }
  },
  methods: {
    toggleNavbar() {
      this.show = !this.show
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
  margin-left: 0.9rem;
  margin-right: 0.9rem;
}

a {
  text-decoration: unset;
  border-bottom: unset;
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
