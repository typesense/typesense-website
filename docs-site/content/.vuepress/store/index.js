import Vue from 'vue'
import Vuex from 'vuex'

const { readPreferredCopyLanguages, writePreferredCopyLanguages } = require('../util/copyLanguagePreferences')

Vue.use(Vuex)

function readDefaultTab() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  try {
    return window.localStorage.getItem('default-tab')
  } catch (error) {
    console.error('Failed to read default tab from localStorage:', error)
    return null
  }
}

function writeDefaultTab(tab) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem('default-tab', tab)
  } catch (error) {
    console.error('Failed to persist default tab to localStorage:', error)
  }
}

export default new Vuex.Store({
  state: {
    defaultTab: readDefaultTab(),
    copyLanguages: readPreferredCopyLanguages(),
  },
  getters: {
    singlePreferredCopyLanguage: state => state.copyLanguages.length === 1 ? state.copyLanguages[0] : null,
  },
  mutations: {
    HYDRATE_COPY_LANGUAGES: (state) => {
      state.copyLanguages = readPreferredCopyLanguages()
    },
    SET_DEFAULT_TAB: (state, tab) => {
      state.defaultTab = tab
      writeDefaultTab(tab)
    },
    SET_COPY_LANGUAGES: (state, languages) => {
      state.copyLanguages = writePreferredCopyLanguages(languages)
    },
  },
})
