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

/**
 * Filter language-specific code blocks inside `<Tabs>` groups in markdown.
 *
 * Default behavior keeps a group whose tabs do not include any selected
 * language, so the docs UI still shows code in some language when the user's
 * preferred language is not documented for that section.
 *
 * When `dropGroupsMissingLanguage` is true, groups that do not document any
 * selected language are stripped entirely. Used by the agent-facing per-language
 * `.md` build so e.g. `search.php.md` contains only PHP snippets, with nothing
 * shown for sections that have no PHP variant.
 *
 * @param {string} markdown Cleaned markdown (Vue wrappers already stripped).
 * @param {Array<{slots: Array<{label: string, startLine: number, endLine: number}>}>} copyTabGroups Tab groups from `analyzeMarkdownForCopy`.
 * @param {string[]} selectedLanguages Language labels to keep (e.g. `['JavaScript']`). Empty array removes all tab-group code.
 * @param {boolean} [dropGroupsMissingLanguage=false] Also strip groups that have none of the selected languages.
 * @returns {string} Filtered markdown.
 */
function filterMarkdownByCopyLanguages(markdown, copyTabGroups, selectedLanguages, dropGroupsMissingLanguage = false) {
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
      if (dropGroupsMissingLanguage) {
        group.slots.forEach(slot => markSlotLinesForRemoval(linesToRemove, slot))
      }
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
