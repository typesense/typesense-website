const STORAGE_KEY = 'typesense.docs.copyMarkdownLanguages'
const { COPY_LANGUAGE_OPTIONS } = require('./copyLanguages')

function getPreferredCopyLanguages() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    const parsedValue = value ? JSON.parse(value) : []
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch (error) {
    return []
  }
}

function setPreferredCopyLanguages(languages) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(languages))
}

function markSlotLinesForRemoval(linesToRemove, slot) {
  for (let lineNumber = slot.startLine; lineNumber < slot.endLine; lineNumber += 1) {
    linesToRemove.add(lineNumber)
  }
}

function filterMarkdownByCopyLanguages(markdown, copyTabGroups, selectedLanguages) {
  if (!copyTabGroups || copyTabGroups.length === 0) {
    return markdown
  }

  if (!selectedLanguages || selectedLanguages.length === 0) {
    const linesToRemove = new Set()

    copyTabGroups.forEach(group => {
      group.slots.forEach(slot => markSlotLinesForRemoval(linesToRemove, slot))
    })

    return markdown
      .split('\n')
      .filter((_, lineNumber) => !linesToRemove.has(lineNumber))
      .join('\n')
  }

  const selectedLanguageSet = new Set(selectedLanguages)
  const linesToRemove = new Set()

  copyTabGroups.forEach(group => {
    const hasSelectedLanguageInGroup = group.slots.some(slot => selectedLanguageSet.has(slot.label))
    if (!hasSelectedLanguageInGroup) {
      return
    }

    group.slots.forEach(slot => {
      if (!selectedLanguageSet.has(slot.label)) {
        markSlotLinesForRemoval(linesToRemove, slot)
      }
    })
  })

  return markdown
    .split('\n')
    .filter((_, lineNumber) => !linesToRemove.has(lineNumber))
    .join('\n')
}

module.exports = {
  COPY_LANGUAGE_OPTIONS,
  filterMarkdownByCopyLanguages,
  getPreferredCopyLanguages,
  setPreferredCopyLanguages,
}
