const MarkdownIt = require('markdown-it')
const { COPY_LANGUAGE_OPTIONS } = require('./copyLanguages')

const markdownParser = new MarkdownIt({ html: true })
const CLIENT_LANGUAGE_TABS = COPY_LANGUAGE_OPTIONS
const CLIENT_LANGUAGE_TAB_SET = new Set(CLIENT_LANGUAGE_TABS)

function readQuotedAttribute(line, attributeName) {
  const attributeIndex = line.indexOf(`${attributeName}=`)
  if (attributeIndex === -1) {
    return null
  }

  const valueStart = attributeIndex + attributeName.length + 1
  const quote = line.charAt(valueStart)
  if (quote !== '"' && quote !== "'") {
    return null
  }

  const valueEnd = line.indexOf(quote, valueStart + 1)
  if (valueEnd === -1) {
    return null
  }

  return line.slice(valueStart + 1, valueEnd)
}

function takeUntilDelimiter(value) {
  return [' ', '>', '/']
    .map(delimiter => {
      const index = value.indexOf(delimiter)
      return index === -1 ? value.length : index
    })
    .reduce((smallestIndex, index) => Math.min(smallestIndex, index), value.length)
}

function parseTabsLine(line) {
  const tabsValue = readQuotedAttribute(line, ':tabs')
  if (!tabsValue) {
    return []
  }

  const quote = tabsValue.includes("'") ? "'" : '"'

  return tabsValue
    .split(quote)
    .filter((_, index) => index % 2 === 1)
    .map(label => label.trim())
}

function parseTemplateSlotLine(line) {
  const slotName = line.split('v-slot:')[1]
  if (!slotName) {
    return null
  }

  return slotName.slice(0, takeUntilDelimiter(slotName)) || null
}

function isVueMarkdownWrapperLine(line) {
  const trimmedLine = line.trim()

  if (trimmedLine === '</Tabs>' || trimmedLine === '</template>') {
    return true
  }

  if (trimmedLine.startsWith('<Tabs')) {
    const nextCharacter = trimmedLine.charAt('<Tabs'.length)
    return nextCharacter === '' || nextCharacter === ' ' || nextCharacter === '>' || nextCharacter === '/'
  }

  if (trimmedLine.startsWith('<template')) {
    const nextCharacter = trimmedLine.charAt('<template'.length)
    return (
      (nextCharacter === '' || nextCharacter === ' ' || nextCharacter === '>' || nextCharacter === '/') &&
      trimmedLine.includes('v-slot')
    )
  }

  return false
}

function getVueMarkdownWrapperLines(lines, tokens) {
  const wrapperLines = new Set()

  tokens.forEach(token => {
    if (token.type !== 'html_block' || !token.map) {
      return
    }

    Array.from({ length: token.map[1] - token.map[0] }, (_, offset) => token.map[0] + offset).forEach(lineNumber => {
      if (isVueMarkdownWrapperLine(lines[lineNumber])) {
        wrapperLines.add(lineNumber)
      }
    })
  })

  return wrapperLines
}

function stripVueMarkdownWrappers(markdown) {
  const lines = markdown.split('\n')
  const tokens = markdownParser.parse(markdown, {})
  const wrapperLines = getVueMarkdownWrapperLines(lines, tokens)

  return lines.filter((_, lineNumber) => !wrapperLines.has(lineNumber)).join('\n')
}

function getHtmlBlockLines(tokens) {
  const htmlBlockLines = new Set()

  tokens.forEach(token => {
    if (token.type !== 'html_block' || !token.map) {
      return
    }

    Array.from({ length: token.map[1] - token.map[0] }, (_, offset) => token.map[0] + offset).forEach(lineNumber =>
      htmlBlockLines.add(lineNumber),
    )
  })

  return htmlBlockLines
}

function findFirstSanitizedLine(originalToSanitizedLine, startLine, endLine) {
  const line = originalToSanitizedLine
    .slice(startLine, endLine)
    .find(lineNumber => lineNumber !== -1 && lineNumber !== undefined)

  return line === undefined ? null : line
}

function findLastSanitizedLine(originalToSanitizedLine, startLine, endLine) {
  const line = originalToSanitizedLine
    .slice(startLine, endLine)
    .reverse()
    .find(lineNumber => lineNumber !== -1 && lineNumber !== undefined)

  return line === undefined ? null : line + 1
}

function isFilterableLanguageGroup(tabs) {
  return tabs.length > 1 && tabs.every(tab => CLIENT_LANGUAGE_TAB_SET.has(tab))
}

function analyzeMarkdownForCopy(markdown) {
  const lines = markdown.split('\n')
  const tokens = markdownParser.parse(markdown, {})
  const wrapperLines = getVueMarkdownWrapperLines(lines, tokens)
  const htmlBlockLines = getHtmlBlockLines(tokens)
  const originalToSanitizedLine = []
  const sanitizedLines = []

  lines.forEach((line, lineNumber) => {
    if (wrapperLines.has(lineNumber)) {
      originalToSanitizedLine[lineNumber] = -1
      return
    }

    originalToSanitizedLine[lineNumber] = sanitizedLines.length
    sanitizedLines.push(line)
  })

  const groups = []
  let currentGroup = null
  let currentSlot = null

  lines.forEach((line, lineNumber) => {
    if (!htmlBlockLines.has(lineNumber)) {
      return
    }

    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('<Tabs')) {
      currentGroup = {
        tabs: parseTabsLine(trimmedLine),
        slots: [],
      }
      return
    }

    if (!currentGroup) {
      return
    }

    const slotName = parseTemplateSlotLine(trimmedLine)
    if (slotName) {
      currentSlot = {
        label: slotName,
        rawStartLine: lineNumber + 1,
        rawEndLine: null,
      }
      currentGroup.slots.push(currentSlot)
      return
    }

    if (trimmedLine === '</template>' && currentSlot) {
      currentSlot.rawEndLine = lineNumber
      currentSlot = null
      return
    }

    if (trimmedLine === '</Tabs>') {
      groups.push(currentGroup)
      currentGroup = null
      currentSlot = null
    }
  })

  const filterableGroups = groups
    .filter(group => isFilterableLanguageGroup(group.tabs))
    .map(group => ({
      tabs: group.tabs,
      slots: group.slots
        .filter(slot => slot.rawEndLine !== null)
        .map(slot => ({
          label: slot.label,
          startLine: findFirstSanitizedLine(originalToSanitizedLine, slot.rawStartLine, slot.rawEndLine),
          endLine: findLastSanitizedLine(originalToSanitizedLine, slot.rawStartLine, slot.rawEndLine),
        }))
        .filter(slot => slot.startLine !== null && slot.endLine !== null),
    }))
    .filter(group => group.slots.length > 1)

  return {
    markdown: sanitizedLines.join('\n'),
    copyTabGroups: filterableGroups,
    copyLanguages: CLIENT_LANGUAGE_TABS.filter(language =>
      filterableGroups.some(group => group.slots.some(slot => slot.label === language)),
    ),
  }
}

module.exports = {
  analyzeMarkdownForCopy,
  stripVueMarkdownWrappers,
}
