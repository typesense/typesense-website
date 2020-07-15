import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defaultTab: localStorage ? localStorage.getItem('default-tab') : null,
  },
  // getters: {
  //   example: state => state.example,
  // },
  // actions: {
  //   UPDATE_EXAMPLE: async ({ commit }) => {
  //     try {
  //       const awaited = await fetch('https://myexample.com/file.json');
  //       const promised = await awaited.json();

  //       commit('SET_EXAMPLE', promised); // In nuxt we would have to return this for asyncFetch
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // },
  mutations: {
    UPDATE_DEFAULT_TAB: (state, tab) => {
      state.defaultTab = tab
      localStorage.setItem('default-tab', tab)
    },
  },
})
