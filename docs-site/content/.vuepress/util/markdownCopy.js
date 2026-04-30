const MarkdownIt = require('markdown-it')

const markdownParser = new MarkdownIt({ html: true })

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

function stripVueMarkdownWrappers(markdown) {
  const lines = markdown.split('\n')
  const tokens = markdownParser.parse(markdown, {})
  const linesToRemove = new Set()

  tokens.forEach(token => {
    if (token.type !== 'html_block' || !token.map) {
      return
    }

    for (let lineNumber = token.map[0]; lineNumber < token.map[1]; lineNumber += 1) {
      if (isVueMarkdownWrapperLine(lines[lineNumber])) {
        linesToRemove.add(lineNumber)
      }
    }
  })

  return lines.filter((_, lineNumber) => !linesToRemove.has(lineNumber)).join('\n')
}

module.exports = {
  stripVueMarkdownWrappers,
}
