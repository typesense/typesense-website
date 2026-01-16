const fs = require('fs')
const path = require('path')

function withBase(base, url) {
  if (!url || /^https?:\/\//.test(url) || !base || base === '/') return url

  const basePath = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`

  if (normalizedUrl.startsWith(`${basePath}/`)) return normalizedUrl
  return `${basePath}${normalizedUrl}`
}

module.exports = (options, context) => ({
  name: 'embed-markdown',

  beforeDevServer(app) {
    app.get('*.md', (req, res, next) => {
      const base = context.base || '/'
      const basePath = base.endsWith('/') ? base.slice(0, -1) : base
      let requestPath = req.path
      if (basePath && basePath !== '/' && requestPath.startsWith(`${basePath}/`)) {
        requestPath = requestPath.slice(basePath.length)
      }

      console.log('MD Request:', requestPath)

      let htmlPath = requestPath.replace(/\.md$/, '.html')

      if (requestPath.endsWith('/README.md')) {
        htmlPath = requestPath.replace('/README.md', '/')
      }

      console.log('Looking for HTML path:', htmlPath)

      const page = context.pages.find(p => p.path === htmlPath)
      console.log('Found page:', page ? page.relativePath : 'NOT FOUND')

      if (page && page.relativePath) {
        try {
          const sourceFile = path.join(context.sourceDir, page.relativePath)
          console.log('Reading file:', sourceFile)
          let markdown = fs.readFileSync(sourceFile, 'utf-8')
          markdown = markdown.replace(/^---\n[\s\S]*?\n---\n*/m, '')

          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.send(markdown)
          console.log('Served successfully')
        } catch (error) {
          console.error('Error:', error.message)
          next()
        }
      } else {
        console.log('Page not found, calling next()')
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

      $page.markdown = markdown

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

    for (const page of pages) {
      if (!page.relativePath || !page.relativePath.endsWith('.md')) continue

      try {
        const sourceFile = path.join(sourceDir, page.relativePath)
        let markdown = fs.readFileSync(sourceFile, 'utf-8')

        markdown = markdown.replace(/^---\n[\s\S]*?\n---\n*/m, '')

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

        fs.writeFileSync(outputPath, markdown, 'utf-8')
      } catch (error) {
        console.error(`Failed to generate markdown for ${page.path}:`, error.message)
      }
    }

    console.log(
      `Generated ${pages.filter(p => p.relativePath && p.relativePath.endsWith('.md')).length} markdown files`,
    )
  },
})
