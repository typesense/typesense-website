import type MarkdownIt from 'markdown-it'

// the old site aliased @images to .vuepress/public/images through webpack.
// left alone, vite tries to resolve those refs as module imports
const IMAGE_ALIAS_RE = /(~?@images)\//g
const rewriteImageSrc = (src: string): string => src.replace(IMAGE_ALIAS_RE, '/images/')

export function typesenseMarkdown(md: MarkdownIt): void {
  md.core.ruler.push('rewrite-image-aliases', (state) => {
    for (const token of state.tokens) {
      if (token.type === 'html_block' && token.content.includes('@images/')) {
        token.content = rewriteImageSrc(token.content)
      }
      if (token.type !== 'inline' || !token.children) continue
      for (const child of token.children) {
        if (child.type === 'image') {
          const src = child.attrGet('src')
          if (src && src.includes('@images/')) child.attrSet('src', rewriteImageSrc(src))
        } else if (child.type === 'html_inline' && child.content.includes('@images/')) {
          child.content = rewriteImageSrc(child.content)
        }
      }
    }
  })

  md.core.ruler.after('block', 'markdown-actions', (state) => {
    const tokens = state.tokens

    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i]
      if (token.type !== 'heading_open' || token.tag !== 'h1') continue

      let closeIndex = -1
      for (let j = i + 1; j < tokens.length; j += 1) {
        const closeToken = tokens[j]
        if (closeToken.type === 'heading_close' && closeToken.tag === 'h1') {
          closeIndex = j
          break
        }
      }
      if (closeIndex === -1) return

      const Token = state.Token
      const openWrapper = new Token('html_block', '', 0)
      // tailwind's content glob scans this literal
      openWrapper.content = '<div class="flex flex-wrap items-center justify-between gap-4">'

      const actions = new Token('html_block', '', 0)
      actions.content = '<MarkdownActions />'

      const closeWrapper = new Token('html_block', '', 0)
      closeWrapper.content = '</div>'

      tokens.splice(i, 0, openWrapper)
      tokens.splice(closeIndex + 2, 0, actions, closeWrapper)
      return
    }
  })

  md.core.ruler.after('markdown-actions', 'agent-docs-index', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i += 1) {
      if (tokens[i].type !== 'html_block' || !tokens[i].content.includes('</div>')) continue
      if (i < 2 || tokens[i - 1].content !== '<MarkdownActions />') continue
      const token = new state.Token('html_block', '', 0)
      token.content =
        '<div hidden><p><strong>AI agents and LLMs:</strong> before exploring further, fetch the full index of Typesense documentation with descriptions at <a href="https://typesense.org/docs/llms.txt">https://typesense.org/docs/llms.txt</a>.</p></div>\n'
      tokens.splice(i + 1, 0, token)
      return
    }
  })

  let currentHeading: { level: number; text: string } | null = null

  const defaultHeadingOpen =
    md.renderer.rules.heading_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    currentHeading = null

    const token = tokens[idx]
    const level = parseInt(token.tag.charAt(1), 10)
    if (level < 2 || level > 6) {
      return defaultHeadingOpen(tokens, idx, options, env, self)
    }

    for (let i = idx + 1; i < tokens.length; i += 1) {
      const nextToken = tokens[i]
      if (nextToken.type === 'heading_close') break
      if (nextToken.type === 'inline' && nextToken.content) {
        currentHeading = { level, text: nextToken.content }
        break
      }
    }

    return defaultHeadingOpen(tokens, idx, options, env, self)
  }

  const defaultHeadingClose =
    md.renderer.rules.heading_close ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.heading_close = function (tokens, idx, options, env, self) {
    let result = ''

    if (currentHeading && currentHeading.text) {
      const escapedText = currentHeading.text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      result += `<CopySectionButton headingText="${escapedText}" :headingLevel="${currentHeading.level}" />`
    }

    currentHeading = null
    return result + defaultHeadingClose(tokens, idx, options, env, self)
  }
}
