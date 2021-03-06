import Vue from 'vue'

export const state = () => ({
  'code-block': 'bash',
})

export const mutations = {
  setCodeLanguage(state, { codeBlockStateId, codeLanguage }) {
    Vue.set(state, codeBlockStateId, codeLanguage)
  },
}
