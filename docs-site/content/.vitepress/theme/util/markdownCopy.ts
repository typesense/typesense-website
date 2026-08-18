import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'
import { COPY_LANGUAGE_OPTIONS } from './copyLanguages'

const markdownParser = new MarkdownIt({ html: true })
const CLIENT_LANGUAGE_TABS = COPY_LANGUAGE_OPTIONS
const CLIENT_LANGUAGE_TAB_SET = new Set<string>(CLIENT_LANGUAGE_TABS)

// supplies the template vars a <RouterLink :to> binding can interpolate
export interface RouterLinkContext {
  latestVersion: string
  pageVersion: string | null
}

export interface CopySlot {
  label: string
  startLine: number
  endLine: number
}

export interface CopyTabGroup {
  tabs: string[]
  slots: CopySlot[]
}

export interface MarkdownCopyAnalysis {
  markdown: string
  copyTabGroups: CopyTabGroup[]
  copyLanguages: string[]
}

function readQuotedAttribute(line: string, attributeName: string): string | null {
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

function findOpenTagEnd(source: string, startIndex: number): number {
  let i = startIndex
  while (i < source.length) {
    const ch = source.charAt(i)
    if (ch === '>') {
      return i
    }
    if (ch === '"' || ch === "'") {
      const closeIndex = source.indexOf(ch, i + 1)
      if (closeIndex === -1) {
        return -1
      }
      i = closeIndex + 1
      continue
    }
    i++
  }
  return -1
}

const ROUTER_LINK_TEMPLATE_VARS: Record<string, keyof RouterLinkContext> = {
  '$site.themeConfig.typesenseLatestVersion': 'latestVersion',
  '$page.typesenseVersion': 'pageVersion',
}

function resolveRouterLinkBoundBinding(rawValue: string, context: RouterLinkContext): string | null {
  if (typeof rawValue !== 'string' || rawValue.length < 2) {
    return null
  }

  if (rawValue.startsWith("'") && rawValue.endsWith("'")) {
    return rawValue.slice(1, -1)
  }

  if (!rawValue.startsWith('`') || !rawValue.endsWith('`')) {
    return null
  }

  const template = rawValue.slice(1, -1)
  const parts: string[] = []
  let cursor = 0

  while (cursor < template.length) {
    const dollarIndex = template.indexOf('${', cursor)
    if (dollarIndex === -1) {
      parts.push(template.slice(cursor))
      break
    }

    parts.push(template.slice(cursor, dollarIndex))

    const close = template.indexOf('}', dollarIndex + 2)
    if (close === -1) {
      return null
    }

    const expression = template.slice(dollarIndex + 2, close).trim()
    const contextKey = ROUTER_LINK_TEMPLATE_VARS[expression]
    if (!contextKey || !context[contextKey]) {
      return null
    }

    parts.push(context[contextKey] as string)
    cursor = close + 1
  }

  return parts.join('')
}

function readBoundaryQuotedAttribute(openTag: string, attributeName: string): string | null {
  const needle = `${attributeName}=`
  let cursor = 0
  while (cursor < openTag.length) {
    const idx = openTag.indexOf(needle, cursor)
    if (idx === -1) {
      return null
    }
    const before = idx === 0 ? ' ' : openTag.charAt(idx - 1)
    if (before === ' ' || before === '\t' || before === '\n') {
      const valueStart = idx + needle.length
      const quote = openTag.charAt(valueStart)
      if (quote !== '"' && quote !== "'") {
        return null
      }
      const valueEnd = openTag.indexOf(quote, valueStart + 1)
      if (valueEnd === -1) {
        return null
      }
      return openTag.slice(valueStart + 1, valueEnd)
    }
    cursor = idx + 1
  }
  return null
}

function resolveRouterLinkUrl(openTag: string, context: RouterLinkContext): string | null {
  const boundValue = readBoundaryQuotedAttribute(openTag, ':to')
  if (boundValue !== null) {
    return resolveRouterLinkBoundBinding(boundValue, context)
  }

  const staticValue = readBoundaryQuotedAttribute(openTag, 'to')
  if (staticValue !== null) {
    return staticValue
  }

  return null
}

const ROUTER_LINK_INLINE_TAG_MARKERS: Record<string, string> = {
  strong: '**',
  b: '**',
  em: '*',
  i: '*',
  code: '`',
}

function readTagName(tagContent: string): string {
  const withoutSlash = tagContent.charAt(0) === '/' ? tagContent.slice(1) : tagContent
  const endIndex = [' ', '\t', '\n', '/', '>']
    .map(delimiter => {
      const index = withoutSlash.indexOf(delimiter)
      return index === -1 ? withoutSlash.length : index
    })
    .reduce((smallest, index) => Math.min(smallest, index), withoutSlash.length)
  return withoutSlash.slice(0, endIndex).toLowerCase()
}

function transformRouterLinkInner(inner: string): string {
  const parts: string[] = []
  let i = 0

  while (i < inner.length) {
    const ch = inner.charAt(i)
    if (ch !== '<') {
      const nextTag = inner.indexOf('<', i)
      parts.push(inner.slice(i, nextTag === -1 ? inner.length : nextTag))
      i = nextTag === -1 ? inner.length : nextTag
      continue
    }

    const tagEnd = findOpenTagEnd(inner, i + 1)
    if (tagEnd === -1) {
      parts.push(inner.slice(i))
      break
    }

    const tagName = readTagName(inner.slice(i + 1, tagEnd).trim())
    const marker = ROUTER_LINK_INLINE_TAG_MARKERS[tagName]
    if (marker) {
      parts.push(marker)
    }

    i = tagEnd + 1
  }

  return parts.join('')
}

function isRouterLinkOpenAt(source: string, index: number): boolean {
  if (!source.startsWith('<RouterLink', index)) {
    return false
  }
  const nextCharacter = source.charAt(index + '<RouterLink'.length)
  return nextCharacter === ' ' || nextCharacter === '\t' || nextCharacter === '\n' || nextCharacter === '>' || nextCharacter === '/'
}

function getFencedLineRanges(tokens: Token[]): [number, number][] {
  const ranges: [number, number][] = []
  tokens.forEach(token => {
    if ((token.type === 'fence' || token.type === 'code_block') && token.map) {
      ranges.push(token.map)
    }
  })
  return ranges
}

function buildOffsetToLine(source: string): number[] {
  const offsetToLine = new Array<number>(source.length + 1)
  let line = 0
  for (let i = 0; i <= source.length; i++) {
    offsetToLine[i] = line
    if (source.charAt(i) === '\n') {
      line++
    }
  }
  return offsetToLine
}

function isLineInFencedRange(line: number, fencedRanges: [number, number][]): boolean {
  return fencedRanges.some(([start, end]) => line >= start && line < end)
}

function transformRouterLinks(markdown: string, context: RouterLinkContext): string {
  if (!markdown.includes('<RouterLink')) {
    return markdown
  }

  const tokens = markdownParser.parse(markdown, {})
  const fencedRanges = getFencedLineRanges(tokens)
  const offsetToLine = buildOffsetToLine(markdown)

  const parts: string[] = []
  let cursor = 0

  while (cursor < markdown.length) {
    const next = markdown.indexOf('<RouterLink', cursor)
    if (next === -1) {
      parts.push(markdown.slice(cursor))
      break
    }

    if (!isRouterLinkOpenAt(markdown, next) || isLineInFencedRange(offsetToLine[next], fencedRanges)) {
      parts.push(markdown.slice(cursor, next + 1))
      cursor = next + 1
      continue
    }

    const openEnd = findOpenTagEnd(markdown, next + '<RouterLink'.length)
    if (openEnd === -1) {
      parts.push(markdown.slice(cursor, next + 1))
      cursor = next + 1
      continue
    }

    const openTag = markdown.slice(next, openEnd + 1)
    const closeIndex = markdown.indexOf('</RouterLink>', openEnd + 1)
    if (closeIndex === -1) {
      parts.push(markdown.slice(cursor, next + 1))
      cursor = next + 1
      continue
    }

    const afterClose = closeIndex + '</RouterLink>'.length
    const url = resolveRouterLinkUrl(openTag, context)

    if (url === null) {
      parts.push(markdown.slice(cursor, afterClose))
      cursor = afterClose
      continue
    }

    const innerHtml = markdown.slice(openEnd + 1, closeIndex)
    const linkText = transformRouterLinkInner(innerHtml).trim()

    parts.push(markdown.slice(cursor, next))
    parts.push(`[${linkText}](${url})`)
    cursor = afterClose
  }

  return parts.join('')
}

function takeUntilDelimiter(value: string): number {
  return [' ', '>', '/']
    .map(delimiter => {
      const index = value.indexOf(delimiter)
      return index === -1 ? value.length : index
    })
    .reduce((smallestIndex, index) => Math.min(smallestIndex, index), value.length)
}

function parseTabsLine(line: string): string[] {
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

function parseTemplateSlotLine(line: string): string | null {
  const slotName = line.split('v-slot:')[1]
  if (!slotName) {
    return null
  }

  return slotName.slice(0, takeUntilDelimiter(slotName)) || null
}

function isVueMarkdownWrapperLine(line: string): boolean {
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

function getVueMarkdownWrapperLines(lines: string[], tokens: Token[]): Set<number> {
  const wrapperLines = new Set<number>()

  tokens.forEach(token => {
    if (token.type !== 'html_block' || !token.map) {
      return
    }

    Array.from({ length: token.map[1] - token.map[0] }, (_, offset) => token.map![0] + offset).forEach(lineNumber => {
      if (isVueMarkdownWrapperLine(lines[lineNumber])) {
        wrapperLines.add(lineNumber)
      }
    })
  })

  return wrapperLines
}

function stripVueMarkdownWrappers(markdown: string): string {
  const lines = markdown.split('\n')
  const tokens = markdownParser.parse(markdown, {})
  const wrapperLines = getVueMarkdownWrapperLines(lines, tokens)

  return lines.filter((_, lineNumber) => !wrapperLines.has(lineNumber)).join('\n')
}

function getHtmlBlockLines(tokens: Token[]): Set<number> {
  const htmlBlockLines = new Set<number>()

  tokens.forEach(token => {
    if (token.type !== 'html_block' || !token.map) {
      return
    }

    Array.from({ length: token.map[1] - token.map[0] }, (_, offset) => token.map![0] + offset).forEach(lineNumber =>
      htmlBlockLines.add(lineNumber),
    )
  })

  return htmlBlockLines
}

function findFirstSanitizedLine(originalToSanitizedLine: number[], startLine: number, endLine: number): number | null {
  const line = originalToSanitizedLine
    .slice(startLine, endLine)
    .find(lineNumber => lineNumber !== -1 && lineNumber !== undefined)

  return line === undefined ? null : line
}

function findLastSanitizedLine(originalToSanitizedLine: number[], startLine: number, endLine: number): number | null {
  const line = originalToSanitizedLine
    .slice(startLine, endLine)
    .reverse()
    .find(lineNumber => lineNumber !== -1 && lineNumber !== undefined)

  return line === undefined ? null : line + 1
}

function isFilterableLanguageGroup(tabs: string[]): boolean {
  return tabs.length > 1 && tabs.every(tab => CLIENT_LANGUAGE_TAB_SET.has(tab))
}

interface RawSlot {
  label: string
  rawStartLine: number
  rawEndLine: number | null
}

interface RawGroup {
  tabs: string[]
  slots: RawSlot[]
}

function analyzeMarkdownForCopy(markdown: string): MarkdownCopyAnalysis {
  const lines = markdown.split('\n')
  const tokens = markdownParser.parse(markdown, {})
  const wrapperLines = getVueMarkdownWrapperLines(lines, tokens)
  const htmlBlockLines = getHtmlBlockLines(tokens)
  const originalToSanitizedLine: number[] = []
  const sanitizedLines: string[] = []

  lines.forEach((line, lineNumber) => {
    if (wrapperLines.has(lineNumber)) {
      originalToSanitizedLine[lineNumber] = -1
      return
    }

    originalToSanitizedLine[lineNumber] = sanitizedLines.length
    sanitizedLines.push(line)
  })

  const groups: RawGroup[] = []
  let currentGroup: RawGroup | null = null
  let currentSlot: RawSlot | null = null

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

  const filterableGroups: CopyTabGroup[] = groups
    .filter(group => isFilterableLanguageGroup(group.tabs))
    .map(group => ({
      tabs: group.tabs,
      slots: group.slots
        .filter((slot): slot is RawSlot & { rawEndLine: number } => slot.rawEndLine !== null)
        .map(slot => ({
          label: slot.label,
          startLine: findFirstSanitizedLine(originalToSanitizedLine, slot.rawStartLine, slot.rawEndLine),
          endLine: findLastSanitizedLine(originalToSanitizedLine, slot.rawStartLine, slot.rawEndLine),
        }))
        .filter((slot): slot is CopySlot => slot.startLine !== null && slot.endLine !== null),
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

export {
  analyzeMarkdownForCopy,
  stripVueMarkdownWrappers,
  transformRouterLinks,
}
