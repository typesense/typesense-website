const fs = require('fs')
const path = require('path')

const sectionTitlesMap = {
  overview: 'Overview',
  api: 'API Reference',
  guide: 'Guides',
  cloud: 'Cloud Management API',
}

function withBase(base, url) {
  if (!url || /^https?:\/\//.test(url) || !base || base === '/') return url
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  if (normalizedUrl.startsWith(`${basePath}/`)) return normalizedUrl
  return `${basePath}${normalizedUrl}`
}

function markdownUrlForPage(pagePath) {
  if (pagePath.endsWith('/')) return `${pagePath}README.md`
  return pagePath.replace(/\.html$/, '.md')
}

function classifyPage(pagePath, latestVersion) {
  if (!pagePath || pagePath === '/') return null
  if (pagePath.startsWith('/overview/')) return 'overview'
  if (pagePath.startsWith('/guide/')) return 'guide'
  if (pagePath.startsWith('/cloud-management-api/')) return 'cloud'
  if (latestVersion && pagePath.startsWith(`/${latestVersion}/api/`)) return 'api'
  return null
}

function sectionHeadingFor(section, latestVersion) {
  if (section === 'api') return `${sectionTitlesMap.api} (${latestVersion})`
  return sectionTitlesMap[section]
}

function groupPages(pages, latestVersion) {
  const grouped = Object.fromEntries(Object.keys(sectionTitlesMap).map(key => [key, []]))
  pages.map(page => {
    if (!page.relativePath || !page.relativePath.endsWith('.md')) return

    const section = classifyPage(page.path, latestVersion)
    if (!section) return

    grouped[section].push(page)
  })
  Object.keys(sectionTitlesMap).map(section => {
    grouped[section].sort((a, b) => a.path.localeCompare(b.path))
  })
  return grouped
}

function cleanTitle(raw) {
  return raw.replace(/\s*\|\s*Typesense\s*$/, '').trim()
}

function stripLeadingFrontmatter(md) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '')
}

function resolveVuePageTemplates(md, pageVersion) {
  if (!pageVersion) return md
  return md.replace(/\{\{\s*\$page\.typesenseVersion\s*\}\}/g, pageVersion)
}

function sanitizeForConcat(md, pageVersion) {
  return resolveVuePageTemplates(stripLeadingFrontmatter(md), pageVersion)
}

function writeLlmsTxt({ outDir, grouped, base, latestVersion }) {
  const lines = []
  lines.push('# Typesense Documentation')
  lines.push('')
  lines.push(`> Open-source typo-tolerant search engine. Latest version: ${latestVersion}.`)
  lines.push('')

  Object.keys(sectionTitlesMap).map(section => {
    const entries = grouped[section]
    if (entries.length === 0) return
    lines.push(`## ${sectionHeadingFor(section, latestVersion)}`)
    lines.push('')
    entries.map(page => {
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

  const outputPath = path.join(outDir, 'llms.txt')
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')
  console.log(`Generated llms.txt (${lines.length} lines)`)
}

function writeLlmsFullTxt({ outDir, grouped, latestVersion, cleanedByPath, pageVersionByPath }) {
  const parts = []
  parts.push(`# Typesense Documentation (full)\n\nLatest version: ${latestVersion}.\n`)

  Object.keys(sectionTitlesMap).map(section => {
    const entries = grouped[section]
    if (entries.length === 0) return
    parts.push(`\n\n# ${sectionHeadingFor(section, latestVersion)}\n`)
    entries.map(page => {
      const rawMd = cleanedByPath.get(page.path)
      if (!rawMd || !page.title) return
      const pageVersion = pageVersionByPath && pageVersionByPath.get(page.path)
      const md = sanitizeForConcat(rawMd, pageVersion)
      const hasBodyH1 = /^\s*#\s+\S/.test(md)
      const header = hasBodyH1 ? '' : `\n# ${cleanTitle(page.title)}\n`
      parts.push(`\n\n<!-- source: ${page.path} -->${header}\n${md}\n`)
    })
  })

  const body = parts.join('')
  const outputPath = path.join(outDir, 'llms-full.txt')
  fs.writeFileSync(outputPath, body, 'utf-8')
  const sizeKb = Math.round(Buffer.byteLength(body, 'utf-8') / 1024)
  console.log(`Generated llms-full.txt (${sizeKb} KB)`)
  if (sizeKb > 2 ** 11) {
    console.warn(`llms-full.txt exceeds 2 MB (${sizeKb} KB).`)
  }
}

function writeLlmsArtifacts({ outDir, pages, base, latestVersion, cleanedByPath, pageVersionByPath }) {
  const grouped = groupPages(pages, latestVersion)
  writeLlmsTxt({ outDir, grouped, base, latestVersion })
  writeLlmsFullTxt({ outDir, grouped, latestVersion, cleanedByPath, pageVersionByPath })
}

module.exports = { writeLlmsArtifacts }
