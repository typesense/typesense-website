import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defaultTab: window.localStorage ? window.localStorage.getItem('default-tab') : null,
    currentTypesenseVersion: window.localStorage ? window.localStorage.getItem('current-typesense-version') : null,
  },
  mutations: {
    UPDATE_DEFAULT_TAB: (state, tab) => {
      state.defaultTab = tab
      if (window.localStorage) {
        window.localStorage.setItem('default-tab', tab)
      }
    },
    UPDATE_CURRENT_TYPESENSE_VERSION: (state, version) => {
      state.currentTypesenseVersion = version
      if (window.localStorage) {
        window.localStorage.setItem('current-typesense-version', version)
      }
    }
  },
})
