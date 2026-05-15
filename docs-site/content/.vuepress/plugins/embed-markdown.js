const fs = require('fs')
const path = require('path')
const { analyzeMarkdownForCopy, stripVueMarkdownWrappers, transformRouterLinks } = require('../util/markdownCopy')
const { COPY_LANGUAGE_OPTIONS, filterMarkdownByCopyLanguages } = require('../util/markdownCopyFilter')

const LANGUAGE_VARIANT_FANOUT_DEPTH = 2

function getFanoutVersions(context) {
  const themeConfig = (context.siteConfig && context.siteConfig.themeConfig) || {}
  const versions = themeConfig.typesenseVersions || []
  return new Set(versions.slice(0, LANGUAGE_VARIANT_FANOUT_DEPTH))
}

function shouldFanoutPage(pagePath, context, fanoutVersions) {
  const themeConfig = (context.siteConfig && context.siteConfig.themeConfig) || {}
  const knownVersions = themeConfig.typesenseVersions || []
  const pageVersion = getPageVersion(pagePath, knownVersions)
  if (pageVersion === null) return true
  return fanoutVersions.has(pageVersion)
}

function variantOutputPath(outDir, pagePath, langSlug) {
  if (pagePath.endsWith('/')) {
    return path.join(outDir, pagePath, `README.${langSlug}.md`)
  }
  return path.join(outDir, pagePath.replace(/\.html$/, `.${langSlug}.md`))
}

function withBase(base, url) {
  if (!url || /^https?:\/\//.test(url) || !base || base === '/') return url

  const basePath = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`

  if (normalizedUrl.startsWith(`${basePath}/`)) return normalizedUrl
  return `${basePath}${normalizedUrl}`
}

function getPageVersion(pagePath, knownVersions) {
  if (typeof pagePath !== 'string') return null
  const segment = pagePath.split('/')[1]
  if (!segment) return null
  return knownVersions.includes(segment) ? segment : null
}

function getRouterLinkContext(context, pagePath) {
  const themeConfig = (context.siteConfig && context.siteConfig.themeConfig) || {}
  const latestVersion = themeConfig.typesenseLatestVersion || null
  const knownVersions = themeConfig.typesenseVersions || []
  return {
    latestVersion,
    pageVersion: getPageVersion(pagePath, knownVersions),
  }
}

module.exports = (options, context) => ({
  name: 'embed-markdown',

  beforeDevServer(app) {
    const langSlugSet = new Set(COPY_LANGUAGE_OPTIONS.map(lang => lang.toLowerCase()))
    const fanoutVersions = getFanoutVersions(context)

    app.get('*.md', (req, res, next) => {
      const base = context.base || '/'
      const basePath = base.endsWith('/') ? base.slice(0, -1) : base
      let requestPath = req.path
      if (basePath && basePath !== '/' && requestPath.startsWith(`${basePath}/`)) {
        requestPath = requestPath.slice(basePath.length)
      }

      const variantMatch = requestPath.match(/^(.*)\.([a-z]+)\.md$/)
      let requestedLang = null
      let normalizedPath = requestPath
      if (variantMatch && langSlugSet.has(variantMatch[2])) {
        requestedLang = variantMatch[2]
        normalizedPath = `${variantMatch[1]}.md`
      }

      console.log('MD Request:', requestPath, requestedLang ? `(lang=${requestedLang})` : '')

      let htmlPath = normalizedPath.replace(/\.md$/, '.html')

      if (normalizedPath.endsWith('/README.md')) {
        htmlPath = normalizedPath.replace('/README.md', '/')
      }

      const page = context.pages.find(p => p.path === htmlPath)

      if (page && page.relativePath) {
        try {
          const sourceFile = path.join(context.sourceDir, page.relativePath)
          let rawMarkdown = fs.readFileSync(sourceFile, 'utf-8')
          rawMarkdown = rawMarkdown.replace(/^---\n[\s\S]*?\n---\n*/m, '')

          const routerCtx = getRouterLinkContext(context, page.path)

          if (requestedLang) {
            if (!shouldFanoutPage(page.path, context, fanoutVersions)) {
              return next()
            }
            const { markdown: cleaned, copyTabGroups, copyLanguages } = analyzeMarkdownForCopy(rawMarkdown)
            if (copyTabGroups.length === 0) {
              return next()
            }
            const language = COPY_LANGUAGE_OPTIONS.find(lang => lang.toLowerCase() === requestedLang)
            if (!language || !copyLanguages.includes(language)) {
              return next()
            }
            const filtered = filterMarkdownByCopyLanguages(cleaned, copyTabGroups, [language], true)
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
            res.send(transformRouterLinks(filtered, routerCtx))
            return
          }

          let markdown = stripVueMarkdownWrappers(rawMarkdown)
          markdown = transformRouterLinks(markdown, routerCtx)

          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.send(markdown)
        } catch (error) {
          console.error('Error:', error.message)
          next()
        }
      } else {
        next()
      }
    })
  },

  extendPageData($page) {
    if (!$page.relativePath || !$page.relativePath.endsWith('.md')) return

    try {
      const sourceFile = path.join(context.sourceDir, $page.relativePath)
      let markdown = fs.readFileSync(sourceFile, 'utf-8')

      markdown = markdown.replace(/^---\n[\s\S]*?\n---\n*/m, '')

      const markdownCopyData = analyzeMarkdownForCopy(markdown)
      const routerLinkContext = getRouterLinkContext(context, $page.path)

      $page.markdown = transformRouterLinks(markdownCopyData.markdown, routerLinkContext)
      $page.markdownCopyTabGroups = markdownCopyData.copyTabGroups
      $page.markdownCopyLanguages = markdownCopyData.copyLanguages

      if ($page.path.endsWith('/')) {
        $page.markdownUrl = `${$page.path}README.md`
      } else {
        $page.markdownUrl = $page.path.replace(/\.html$/, '.md')
      }

      if (!$page.frontmatter.head) {
        $page.frontmatter.head = []
      }
      $page.frontmatter.head.push([
        'link',
        {
          rel: 'alternate',
          type: 'text/markdown',
          href: withBase(context.base, $page.markdownUrl),
        },
      ])
    } catch (error) {
      console.error(`Failed to embed markdown for ${$page.relativePath}:`, error.message)
    }
  },

  async generated() {
    const { outDir, pages, sourceDir } = context
    const fanoutVersions = getFanoutVersions(context)
    let variantCount = 0

    for (const page of pages) {
      if (!page.relativePath || !page.relativePath.endsWith('.md')) continue

      try {
        const sourceFile = path.join(sourceDir, page.relativePath)
        let rawMarkdown = fs.readFileSync(sourceFile, 'utf-8')

        rawMarkdown = rawMarkdown.replace(/^---\n[\s\S]*?\n---\n*/m, '')

        const { markdown: cleaned, copyTabGroups, copyLanguages } = analyzeMarkdownForCopy(rawMarkdown)
        const routerCtx = getRouterLinkContext(context, page.path)
        const baseMarkdown = transformRouterLinks(cleaned, routerCtx)

        let outputPath
        if (page.path.endsWith('/')) {
          outputPath = path.join(outDir, page.path, 'README.md')
        } else {
          outputPath = path.join(outDir, page.path.replace(/\.html$/, '.md'))
        }

        const outputDir = path.dirname(outputPath)

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }

        fs.writeFileSync(outputPath, baseMarkdown, 'utf-8')

        if (copyTabGroups.length === 0) continue
        if (!shouldFanoutPage(page.path, context, fanoutVersions)) continue

        for (const language of copyLanguages) {
          const langSlug = language.toLowerCase()
          const filtered = filterMarkdownByCopyLanguages(cleaned, copyTabGroups, [language], true)
          const variantMarkdown = transformRouterLinks(filtered, routerCtx)
          const variantPath = variantOutputPath(outDir, page.path, langSlug)
          fs.writeFileSync(variantPath, variantMarkdown, 'utf-8')
          variantCount += 1
        }
      } catch (error) {
        console.error(`Failed to generate markdown for ${page.path}:`, error.message)
      }
    }

    const baseCount = pages.filter(p => p.relativePath && p.relativePath.endsWith('.md')).length
    console.log(`Generated ${baseCount} markdown files (+${variantCount} language variants)`)
  },
})
