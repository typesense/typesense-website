import { reactive, computed } from 'vue'
import { readPreferredCopyLanguages, writePreferredCopyLanguages } from './util/copyLanguagePreferences'

function readDefaultTab(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    return window.localStorage.getItem('default-tab')
  } catch (error) {
    console.error('Failed to read default tab from localStorage:', error)
    return null
  }
}

function writeDefaultTab(tab: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem('default-tab', tab)
  } catch (error) {
    console.error('Failed to persist default tab to localStorage:', error)
  }
}

const state = reactive<{ defaultTab: string | null; copyLanguages: string[] }>({
  defaultTab: readDefaultTab(),
  copyLanguages: readPreferredCopyLanguages(),
})

const singlePreferredCopyLanguage = computed(() =>
  state.copyLanguages.length === 1 ? state.copyLanguages[0] : null,
)

export const docsStore = {
  state,
  singlePreferredCopyLanguage,
  hydrateCopyLanguages() {
    state.copyLanguages = readPreferredCopyLanguages()
  },
  setDefaultTab(tab: string) {
    state.defaultTab = tab
    writeDefaultTab(tab)
  },
  setCopyLanguages(languages: string[]) {
    state.copyLanguages = writePreferredCopyLanguages(languages)
  },
}

export type DocsStore = typeof docsStore
