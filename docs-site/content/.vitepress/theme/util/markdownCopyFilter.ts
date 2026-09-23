import { normalizeCopyLanguages } from './copyLanguages'
import type { CopySlot, CopyTabGroup } from './markdownCopy'

function markSlotLinesForRemoval(linesToRemove: Set<number>, slot: CopySlot): void {
  for (let lineNumber = slot.startLine; lineNumber < slot.endLine; lineNumber += 1) {
    linesToRemove.add(lineNumber)
  }
}

// by default a group with none of the selected languages is left intact, keeping
// some code on screen for the reader. dropGroupsMissingLanguage strips it
// instead, which is what the per-language .md build wants
function filterMarkdownByCopyLanguages(
  markdown: string,
  copyTabGroups: CopyTabGroup[],
  selectedLanguages: unknown,
  dropGroupsMissingLanguage = false,
): string {
  if (!copyTabGroups || copyTabGroups.length === 0) {
    return markdown
  }

  const normalizedLanguages = normalizeCopyLanguages(selectedLanguages)
  if (normalizedLanguages.length === 0) {
    const linesToRemove = new Set<number>()

    copyTabGroups.forEach(group => {
      group.slots.forEach(slot => markSlotLinesForRemoval(linesToRemove, slot))
    })

    return markdown
      .split('\n')
      .filter((_, lineNumber) => !linesToRemove.has(lineNumber))
      .join('\n')
  }

  const selectedLanguageSet = new Set<string>(normalizedLanguages)
  const linesToRemove = new Set<number>()

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

export {
  filterMarkdownByCopyLanguages,
}
