import { normalizeCopyLanguages } from './copyLanguages'
import type { CopySlot, CopyTabGroup } from './markdownCopy'

function markSlotLinesForRemoval(linesToRemove: Set<number>, slot: CopySlot): void {
  for (let lineNumber = slot.startLine; lineNumber < slot.endLine; lineNumber += 1) {
    linesToRemove.add(lineNumber)
  }
}

// The rendered Tabs components know their active tab. Match them to source
// groups by tab labels, preserving document order for repeated groups.
function getVisibleCopyTabs(copyTabGroups: CopyTabGroup[], defaultTab: string | null): string[] {
  const activeTabsByGroup = new Map<string, string[]>()
  if (typeof document !== 'undefined') {
    document.querySelectorAll<HTMLElement>('[data-copy-tabs]').forEach(element => {
      const tabs = element.dataset.copyTabs
      const activeTab = element.dataset.copyActiveTab
      if (!tabs || !activeTab) return
      const activeTabs = activeTabsByGroup.get(tabs) || []
      activeTabs.push(activeTab)
      activeTabsByGroup.set(tabs, activeTabs)
    })
  }

  return copyTabGroups.map(group =>
    activeTabsByGroup.get(JSON.stringify(group.tabs))?.shift() || defaultTab || group.tabs[0],
  )
}

// Tab wrappers leave extra blank lines around fenced examples. Keep one blank
// separator after a fence without changing whitespace inside the code block.
function collapseBlankLinesAfterFences(markdown: string): string {
  const lines = markdown.split('\n')
  const result: string[] = []
  let openFence: string | null = null
  let afterFence = false

  lines.forEach(line => {
    const trimmed = line.trim()
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})/)

    if (openFence) {
      result.push(line)
      if (fence && fence[1][0] === openFence[0] && fence[1].length >= openFence.length &&
        trimmed.slice(fence[1].length).trim() === '') {
        openFence = null
        afterFence = true
      }
      return
    }

    if (fence) {
      openFence = fence[1]
      afterFence = false
      result.push(line)
      return
    }

    if (afterFence && trimmed === '') {
      if (result[result.length - 1]?.trim() !== '') result.push('')
      return
    }

    afterFence = false
    result.push(line)
  })

  return result.join('\n')
}

// When none of the selected languages occur in a group, keep the current tab
// (or its first tab). Per-language .md files instead drop unmatched groups.
function filterMarkdownByCopyLanguages(
  markdown: string,
  copyTabGroups: CopyTabGroup[],
  selectedLanguages: unknown,
  dropGroupsMissingLanguage = false,
  visibleTabs: string[] = [],
): string {
  if (!copyTabGroups || copyTabGroups.length === 0) {
    return markdown
  }

  const selectedLanguageSet = new Set<string>(normalizeCopyLanguages(selectedLanguages))
  const linesToRemove = new Set<number>()

  copyTabGroups.forEach((group, groupIndex) => {
    const hasSelectedLanguageInGroup = group.slots.some(slot => selectedLanguageSet.has(slot.label))
    // "Other Languages" is an explanatory UI tab that directs readers to Shell.
    const visibleTab = visibleTabs[groupIndex] === 'Other Languages' ? 'Shell' : visibleTabs[groupIndex]
    const fallbackSlot = group.slots.find(slot => slot.label === visibleTab) || group.slots[0]

    group.slots.forEach(slot => {
      const keepSlot = hasSelectedLanguageInGroup
        ? selectedLanguageSet.has(slot.label)
        : !dropGroupsMissingLanguage && slot === fallbackSlot
      if (!keepSlot) markSlotLinesForRemoval(linesToRemove, slot)
    })
  })

  const filteredMarkdown = markdown
    .split('\n')
    .filter((_, lineNumber) => !linesToRemove.has(lineNumber))
    .join('\n')
  return collapseBlankLinesAfterFences(filteredMarkdown)
}

export {
  filterMarkdownByCopyLanguages,
  getVisibleCopyTabs,
}
