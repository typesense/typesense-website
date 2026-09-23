// pageData.markdown is base64-encoded, see embed-markdown.ts
export function decodeMarkdown(encoded?: string): string | undefined {
  if (!encoded) return undefined
  try {
    const binary = atob(encoded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return undefined
  }
}
