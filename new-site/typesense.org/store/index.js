export const state = () => ({
  codeLanguage: 'bash',
})

export const mutations = {
  setCodeLanguage(state, codeLanguage) {
    state.codeLanguage = codeLanguage
  },
}
