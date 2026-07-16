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
import store from '../store'

const { syncPreferredCopyLanguagesToUrl } = require('../util/copyLanguagePreferences')

const KEYLESS_HISTORY_ENTRY_MARKER = '__typesenseKeylessHistoryEntry'

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

function getAnchorPosition(to) {
  const encodedAnchor = to.hash.slice(1)
  let targetAnchor

  try {
    targetAnchor = decodeURIComponent(encodedAnchor)
  } catch (error) {
    targetAnchor = encodedAnchor
  }

  const targetElement = document.getElementById(targetAnchor) || document.getElementsByName(targetAnchor)[0]

  if (targetElement) {
    return getElementPosition(targetElement)
  } else {
    return false
  }
}

function addSmoothScrolling(position) {
  return {
    x: position.x,
    y: position.y,
    behavior: 'smooth',
  }
}

function getCurrentScrollPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset,
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

  // Mark keyless entries before Vue Router can stamp its current key onto them
  // while normalizing the URL. The marker survives that history-state rewrite.
  let poppedHistoryEntryHasReliableKey = false
  if (!isServer) {
    window.addEventListener('popstate', event => {
      const state = event.state || {}
      const wasKeylessEntry = Boolean(state[KEYLESS_HISTORY_ENTRY_MARKER])
      const hasRouterKey = Boolean(state.key)

      poppedHistoryEntryHasReliableKey = hasRouterKey && !wasKeylessEntry

      if (!hasRouterKey && !wasKeylessEntry) {
        const markedState = Object.assign({}, window.history.state, {
          [KEYLESS_HISTORY_ENTRY_MARKER]: true,
        })
        window.history.replaceState(markedState, '', window.location.href)
      }
    })
  }

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
      store.commit('HYDRATE_COPY_LANGUAGES')
      syncPreferredCopyLanguagesToUrl(store.state.copyLanguages)

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
    // Only entries created with Vue Router keys have reliable saved positions.
    // Native fragment entries can inherit a stale key and saved position.
    const canRestoreSavedPosition = savedPosition && poppedHistoryEntryHasReliableKey

    // Preserve exact Back/Forward positions across pages. For same-page fragment
    // links, the requested anchor must take precedence over the pre-click position.
    if (canRestoreSavedPosition && to.path !== from.path) {
      return addSmoothScrolling(savedPosition)
    }

    if (to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return false
      }

      const anchorPosition = getAnchorPosition(to)
      if (anchorPosition) {
        return addSmoothScrolling(anchorPosition)
      }

      // During initial hydration or client-side navigation, VuePress can run
      // scrollBehavior before the rendered markdown has mounted.
      return new Promise(resolve => {
        let remainingFrames = 60

        const findAnchor = () => {
          if (router.currentRoute.fullPath !== to.fullPath) {
            // Vue Router applies a stale saved position when an async result
            // resolves without coordinates, so a canceled retry stays pending.
            return
          }

          const delayedAnchorPosition = getAnchorPosition(to)
          if (delayedAnchorPosition) {
            resolve(addSmoothScrolling(delayedAnchorPosition))
          } else if (remainingFrames > 0) {
            remainingFrames -= 1
            window.requestAnimationFrame(findAnchor)
          } else {
            resolve(getCurrentScrollPosition())
          }
        }

        window.requestAnimationFrame(findAnchor)
      })
    } else if (canRestoreSavedPosition) {
      return addSmoothScrolling(savedPosition)
    } else {
      return {
        x: 0,
        y: 0,
        behavior: 'smooth',
      }
    }
  }
}
