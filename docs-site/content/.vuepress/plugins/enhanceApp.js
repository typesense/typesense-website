/* global gtag */

/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

import Vuex from 'vuex'
import VueGtag from 'vue-gtag'

import { typesenseLatestVersion } from './../../../../typesenseVersions'
import isSemVer from '../utils/isSemVer'

// fork from vue-router@3.0.2
// src/util/scroll.js
function getElementPosition(el) {
  const docEl = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top,
  }
}

function scrollToAnchor(to) {
  const targetAnchor = to.hash.slice(1)
  const targetElement = document.getElementById(targetAnchor) || document.querySelector(`[name='${targetAnchor}']`)

  if (targetElement) {
    return window.scrollTo({
      top: getElementPosition(targetElement).y,
      behavior: 'smooth',
    })
  } else {
    return false
  }
}

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer, // is this enhancement applied in server-rendering or client
}) => {
  Vue.use(Vuex)

  Vue.use(VueGtag, {
    config: {
      id: 'UA-116415641-1',
      params: {
        anonymize_ip: true, // anonymize IP
        send_page_view: false, // might be necessary to avoid duplicated page track on page reload
        linker: {
          domains: ['typesense.org', 'cloud.typesense.org'],
        },
      },
    },
  })

  router.beforeEach((to, from, next) => {
    const splitPath = to.fullPath.split('/')
    const typesenseServerVersion = splitPath[1]

    // Handle /docs/latest/...
    // This only handles the redirect once the SPA is loaded.
    // We also have a Cloudfront function that serves up
    //  docs-site/index.html for /docs/latest/*, so the route doesn't 404 server-side.
    if (typesenseServerVersion === 'latest') {
      splitPath[1] = typesenseLatestVersion
      router.replace(splitPath.join('/'))
      return next()
    }

    // Handle /docs/version/guide/... -> /docs/guide
    // TODO: Need to add to cloudfront function
    if (isSemVer(typesenseServerVersion) && splitPath[2] === 'guide') {
      if (splitPath[3] === '#what-s-new') {
        const [majorVersion, minorVersion, patchVersion] = typesenseServerVersion.split('.')
        if (parseInt(majorVersion) >= 0 && parseInt(minorVersion) >= 20) {
          // After v0.20, replace /guide with /api
          splitPath[2] = 'api'
        }
      } else {
        // Remove version from URL
        splitPath.splice(1, 1)
      }

      router.replace(splitPath.join('/'))
      return next()
    }
    next()
  })

  // Analytics
  let gtagPageViewDebounceTimerId
  router.afterEach(to => {
    if (!isServer) {
      const pagePath = siteData.base + to.fullPath.substring(1)
      const locationPath = window.location.origin + siteData.base + to.fullPath.substring(1)

      if (gtagPageViewDebounceTimerId) {
        clearTimeout(gtagPageViewDebounceTimerId)
      }
      gtagPageViewDebounceTimerId = setTimeout(() => {
        window.gtag('config', 'UA-116415641-1', { page_path: pagePath, location_path: locationPath })
      }, 2000)
    }
  })

  // Adapted from https://github.com/vuepress/vuepress-community/blob/7feb5c514090b6901cd7d9998f4dd858e0055b7a/packages/vuepress-plugin-smooth-scroll/src/enhanceApp.ts#L21
  // With a bug fix for handling long pages
  router.options.scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
      return window.scrollTo({
        top: savedPosition.y,
        behavior: 'smooth',
      })
    } else if (to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return false
      }
      const scrollResult = scrollToAnchor(to)

      if (scrollResult) {
        return scrollResult
      } else {
        window.onload = () => {
          scrollToAnchor(to)
        }
      }
    } else {
      return window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }
}
