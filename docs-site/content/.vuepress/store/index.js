import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defaultTab: window.localStorage ? window.localStorage.getItem('default-tab') : null,
  },
  mutations: {
    UPDATE_DEFAULT_TAB: (state, tab) => {
      state.defaultTab = tab
      if (window.localStorage) {
        window.localStorage.setItem('default-tab', tab)
      }
    },
  },
})
