import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import mathjax3 from 'markdown-it-mathjax3'
import { sidebar } from './sidebar'
import { typesenseMarkdown } from './markdown/typesense'
import { injectPageMarkdown, mdDevMiddleware, generateMarkdownArtifacts } from './embed-markdown'

const srcDir = fileURLToPath(new URL('..', import.meta.url))
import pkg from '../../package.json'
import versions from '../../../typesenseVersions.json'

const { description } = pkg
const { typesenseVersions, typesenseLatestVersion } = versions

// lets the version picker grey out versions that predate the current page
const typesenseVersionPages = Object.fromEntries(
  typesenseVersions.map((version) => [
    version,
    readdirSync(join(srcDir, version), { recursive: true })
      .map(String)
      .filter((file) => file.endsWith('.md'))
      .map((file) => `/${file.replace(/(^|\/)README\.md$/, '$1').replace(/\.md$/, '')}`),
  ]),
)

export default defineConfig({
  base: '/docs/',
  title: 'Typesense Documentation',
  description,
  // content links are authored with .html, and the published site serves them
  cleanUrls: false,

  // without this vitepress emits README.html and every /…/ url breaks
  rewrites: {
    'README.md': 'index.md',
    ':dir(.*)/README.md': ':dir/index.md',
  },
  lastUpdated: true,
  // the versioned tree is full of stale cross-links
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'theme-color', content: '#c0ff58' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Typesense Documentation' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: 'https://typesense.org/docs/images/opengraph_banner.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Typesense Documentation' }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: 'https://typesense.org/docs/images/opengraph_banner.png' }],
    ['link', { rel: 'icon', href: '/docs/favicon.png' }],
    // Google Analytics (page views fired manually on route change — see theme).
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=UA-116415641-1' }],
    [
      'script',
      {},
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());" +
      "gtag('config','UA-116415641-1',{anonymize_ip:true,send_page_view:false,linker:{domains:['typesense.org','cloud.typesense.org']}});",
    ],
  ],

  sitemap: {
    // keep the trailing slash, new URL(path, hostname) drops /docs without it
    hostname: 'https://typesense.org/docs/',
  },

  themeConfig: {
    // two files because an <img> can't see our --typesense-logo-* vars
    logo: {
      light: '/images/typesense_logo_light.svg',
      dark: '/images/typesense_logo_dark.svg',
      alt: 'Typesense',
    },

    siteTitle: false,

    outline: { level: [2, 6], label: 'On this page' },

    nav: [
      { text: 'Overview', link: '/overview/', activeMatch: '/overview/' },
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      // api reference lives under every version prefix, not just the latest
      { text: 'API Reference', link: `/${typesenseLatestVersion}/api/`, activeMatch: '/api/' },
      { text: 'Help', link: '/help' },
      { text: 'Roadmap', link: 'https://github.com/orgs/typesense/projects/1' },
    ],

    sidebar,

    editLink: {
      pattern: 'https://github.com/typesense/typesense-website/edit/master/docs-site/content/:path',
      text: 'Edit page',
    },

    // @ts-expect-error custom themeConfig fields
    typesenseVersions,
    typesenseLatestVersion,
    typesenseVersionPages,

    typesenseDocsearch: {
      typesenseServerConfig: {
        nearestNode: { host: '01brzocp328nd4xvp.a1.typesense.net', port: 443, protocol: 'https' },
        nodes: [
          { host: '01brzocp328nd4xvp-1.a1.typesense.net', port: 443, protocol: 'https' },
          { host: '01brzocp328nd4xvp-2.a1.typesense.net', port: 443, protocol: 'https' },
          { host: '01brzocp328nd4xvp-3.a1.typesense.net', port: 443, protocol: 'https' },
        ],
        apiKey: 'SnXV7QElNiek7WN3QRT3ibhR5qLjJzS8',
      },
      typesenseCollectionName: 'typesense_docs',
      typesenseSearchParameters: {
        per_page: 6,
        query_by:
          'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6,content,embedding',
        vector_query: 'embedding:([], k: 5, distance_threshold: 1.0, alpha: 0.2)',
      },
    },
  },

  markdown: {
    lineNumbers: false,
    config(md) {
      typesenseMarkdown(md)
      md.use(mathjax3)
    },
  },

  vite: {
    plugins: [
      {
        // vue 3 templates have no `this`, and fenced code blocks are v-pre,
        // which would render the latest-version token literally
        name: 'typesense:strip-legacy-this',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('.md')) return
          if (!code.includes('this.$') && !code.includes('typesenseLatestVersion')) return
          return code
            .replace(/this\.\$(site|page)\b/g, '$$$1')
            .replace(/\{\{\s*\$site\.themeConfig\.typesenseLatestVersion\s*\}\}/g, typesenseLatestVersion)
        },
      },
      {
        name: 'typesense:embed-markdown-dev',
        configureServer(server) {
          server.middlewares.use(mdDevMiddleware(srcDir))
        },
      },
    ],
    // static assets still live in the old vuepress public dir until they move
    publicDir: fileURLToPath(new URL('../.vuepress/public', import.meta.url)),
    resolve: {
      alias: [
        { find: '@images', replacement: fileURLToPath(new URL('../.vuepress/public/images', import.meta.url)) },
        { find: '@', replacement: fileURLToPath(new URL('./theme', import.meta.url)) },
        // stubbed out: it drags in @docsearch/css and .DocSearch-* rules that
        // collide with our own search modal
        {
          // vite matches the import string, not the resolved path
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/VPNavBarSearch.vue', import.meta.url)),
        },
      ],
    },
  },

  buildEnd(siteConfig) {
    generateMarkdownArtifacts(siteConfig)
  },

  // port of typesense-enhancements extendPageData
  async transformPageData(pageData) {
    const version = pageData.relativePath.split('/')[0]
    const isVersioned = typesenseVersions.includes(version)

    pageData.frontmatter.head ??= []

    if (isVersioned) {
      // @ts-expect-error custom field surfaced to the theme
      pageData.typesenseVersion = version
      const canonicalPath = `/docs/${pageData.relativePath.replace(/\.md$/, '.html').replace(version, typesenseLatestVersion)}`
      pageData.frontmatter.head.push(['link', { rel: 'canonical', href: `https://typesense.org${canonicalPath}` }])
    } else {
      // @ts-expect-error custom field surfaced to the theme
      pageData.typesenseVersion = null
      pageData.frontmatter.head.push(['meta', { name: 'docsearch:version', content: 'unversioned' }])
    }

    if (pageData.title) {
      pageData.title = pageData.title.replace(/\{\{ ?\$page\.typesenseVersion ?\}\}/, version)
    }

    injectPageMarkdown(pageData, srcDir)
  },
})
