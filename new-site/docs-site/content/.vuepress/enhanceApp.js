/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'vue-prism-component'
import Vuex from 'vuex'
import VueGtag from "vue-gtag";


export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer, // is this enhancement applied in server-rendering or client
}) => {
  Vue.component('Prism', Prism)
  Vue.use(Vuex)

  Vue.use(VueGtag, {
    config: {
      id: "UA-116415641-1",
      params: {
        linker: {
          'domains': ['new-site.typesense.org', 'typesense.org', 'cloud.typesense.org']
        }
      }
    }
  });

  router.addRoute({ path: '/overview/', redirect: '/overview/what-is-typesense' })
  router.addRoute({ path: '/overview', redirect: '/overview/what-is-typesense' })
  router.addRoute({ path: '/guide', redirect: `/${siteData.themeConfig.typesenseLatestVersion}/guide` })
  router.addRoute({ path: '/api', redirect: `/${siteData.themeConfig.typesenseLatestVersion}/api` })
  router.addRoute({ path: '/latest/guide', redirect: `/${siteData.themeConfig.typesenseLatestVersion}/guide` })
  router.addRoute({ path: '/latest/api', redirect: `/${siteData.themeConfig.typesenseLatestVersion}/api` })
  router.addRoute({ path: '/latest', redirect: `/${siteData.themeConfig.typesenseLatestVersion}/` })
}
