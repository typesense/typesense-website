import fs from 'node:fs'
import path from 'node:path'


const Sections = ["overview", "api", "guide", "cloud"] as const
const sectionTitlesMap = {
  overview: 'Overview',
  api: 'API Reference',
  guide: 'Guides',
  cloud: 'Cloud Management API',
} as const satisfies Record<typeof Sections[number], string>;

type Section = typeof Sections[number]

export interface LlmsPage {
  path: string
  relativePath: string
  title: string
  frontmatter: Record<string, string>
}

export interface LlmsArtifacts {
  llmsTxt: string
  llmsFullTxt: string
}

interface LlmsInput {
  pages: LlmsPage[]
  base: string
  latestVersion: `${number}.${number}`
  cleanedByPath: Map<string, string>
  pageVersionByPath: Map<string, string | null>
}

function withBase(base: string, url: string): string {
  if (!url || /^https?:\/\//.test(url) || !base || base === '/') return url
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  if (normalizedUrl.startsWith(`${basePath}/`)) return normalizedUrl
  return `${basePath}${normalizedUrl}`
}

function markdownUrlForPage(pagePath: string): string {
  if (pagePath.endsWith('/')) return `${pagePath}README.md`
  return pagePath.replace(/\.html$/, '.md')
}

function classifyPage(pagePath: string, latestVersion: string): Section | null {
  if (!pagePath || pagePath === '/') return null
  if (pagePath.startsWith('/overview/')) return 'overview'
  if (pagePath.startsWith('/guide/')) return 'guide'
  if (pagePath.startsWith('/cloud-management-api/')) return 'cloud'
  if (latestVersion && pagePath.startsWith(`/${latestVersion}/api/`)) return 'api'
  return null
}

function sectionHeadingFor(section: Section, latestVersion: string): string {
  if (section === 'api') return `${sectionTitlesMap.api} (${latestVersion})`
  return sectionTitlesMap[section]
}

type GroupedPages = Record<Section, LlmsPage[]>

function groupPages(pages: LlmsPage[], latestVersion: string): GroupedPages {
  const grouped = Object.fromEntries(Sections.map(key => [key, [] as LlmsPage[]])) as GroupedPages
  pages.forEach(page => {
    if (!page.relativePath || !page.relativePath.endsWith('.md')) return

    const section = classifyPage(page.path, latestVersion)
    if (!section) return

    grouped[section].push(page)
  })
  Sections.forEach(section => {
    grouped[section].sort((a, b) => a.path.localeCompare(b.path))
  })
  return grouped
}

function cleanTitle(raw: string): string {
  return raw.replace(/\s*\|\s*Typesense\s*$/, '').trim()
}

function stripLeadingFrontmatter(md: string): string {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '')
}

function resolveVuePageTemplates(md: string, pageVersion: string | null | undefined): string {
  if (!pageVersion) return md
  return md.replace(/\{\{\s*\$page\.typesenseVersion\s*\}\}/g, pageVersion)
}

function sanitizeForConcat(md: string, pageVersion: string | null | undefined): string {
  return resolveVuePageTemplates(stripLeadingFrontmatter(md), pageVersion)
}

function buildLlmsTxt(grouped: GroupedPages, base: string, latestVersion: string): string {
  const lines: string[] = []
  lines.push('# Typesense Documentation')
  lines.push('')
  lines.push(`> Open-source typo-tolerant search engine. Latest version: ${latestVersion}.`)
  lines.push('')

  Sections.forEach(section => {
    const entries = grouped[section]
    if (entries.length === 0) return
    lines.push(`## ${sectionHeadingFor(section, latestVersion)}`)
    lines.push('')
    entries.forEach(page => {
      if (!page.title) return
      const title = cleanTitle(page.title)
      const href = withBase(base, markdownUrlForPage(page.path))
      const desc = (page.frontmatter && page.frontmatter.description) || ''
      lines.push(desc ? `- [${title}](${href}): ${desc}` : `- [${title}](${href})`)
    })
    lines.push('')
  })

  lines.push('## Per-language variants')
  lines.push('')
  lines.push(
    'Append `.{lang}.md` to any page that has tabbed code samples to retrieve a single-language slice (e.g. `search.javascript.md`, `building-a-search-application.python.md`). Available languages: javascript, python, php, ruby, dart, java, go, swift, shell. Languages are only emitted when the page documents that language. API pages older than the latest two versions ship the base `.md` only, no language variants.',
  )
  lines.push('')
  lines.push('## OpenAPI spec')
  lines.push('')
  lines.push('- https://raw.githubusercontent.com/typesense/typesense-api-spec/master/openapi.yml')
  lines.push('')

  return lines.join('\n')
}

function buildLlmsFullTxt(input: LlmsInput, grouped: GroupedPages): string {
  const { latestVersion, cleanedByPath, pageVersionByPath } = input
  const parts: string[] = []
  parts.push(`# Typesense Documentation (full)\n\nLatest version: ${latestVersion}.\n`)

  Sections.forEach(section => {
    const entries = grouped[section]
    if (entries.length === 0) return
    parts.push(`\n\n# ${sectionHeadingFor(section, latestVersion)}\n`)
    entries.forEach(page => {
      const rawMd = cleanedByPath.get(page.path)
      if (!rawMd || !page.title) return
      const pageVersion = pageVersionByPath && pageVersionByPath.get(page.path)
      const md = sanitizeForConcat(rawMd, pageVersion)
      const hasBodyH1 = /^\s*#\s+\S/.test(md)
      const header = hasBodyH1 ? '' : `\n# ${cleanTitle(page.title)}\n`
      parts.push(`\n\n<!-- source: ${page.path} -->${header}\n${md}\n`)
    })
  })

  return parts.join('')
}

function buildLlmsArtifacts(input: LlmsInput): LlmsArtifacts {
  const grouped = groupPages(input.pages, input.latestVersion)
  return {
    llmsTxt: buildLlmsTxt(grouped, input.base, input.latestVersion),
    llmsFullTxt: buildLlmsFullTxt(input, grouped),
  }
}

function writeLlmsArtifacts(input: LlmsInput & { outDir: string }): void {
  const { llmsTxt, llmsFullTxt } = buildLlmsArtifacts(input)

  fs.writeFileSync(path.join(input.outDir, 'llms.txt'), llmsTxt, 'utf-8')
  console.log(`Generated llms.txt (${llmsTxt.split('\n').length} lines)`)

  fs.writeFileSync(path.join(input.outDir, 'llms-full.txt'), llmsFullTxt, 'utf-8')
  const sizeKb = Math.round(Buffer.byteLength(llmsFullTxt, 'utf-8') / 1024)
  console.log(`Generated llms-full.txt (${sizeKb} KB)`)
  if (sizeKb > 2 ** 11) {
    console.warn(`llms-full.txt exceeds 2 MB (${sizeKb} KB).`)
  }
}

export { buildLlmsArtifacts, writeLlmsArtifacts }
