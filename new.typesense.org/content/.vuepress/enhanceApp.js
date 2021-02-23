import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'vue-prism-component'
import Vuex from 'vuex'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './theme/styles/bootstrap_overrides.scss'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer, // is this enhancement applied in server-rendering or client
}) => {
  Vue.component('prism', Prism)
  Vue.use(Vuex)
  Vue.mixin({ store: store })

  Vue.use(BootstrapVue)
  Vue.use(IconsPlugin)
}
