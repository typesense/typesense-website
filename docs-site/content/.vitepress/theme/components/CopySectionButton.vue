<template>
  <ClientOnly>
    <button
      v-if="pageMarkdown"
      type="button"
      class="copy-section-button inline-flex ml-2 px-1 border-0 bg-transparent align-middle cursor-pointer opacity-0 transition-opacity duration-150"
      :class="isCopied ? '!opacity-100 text-accent' : 'text-accent hover:text-accent-hover'"
      :title="isCopied ? 'Copied!' : 'Copy this section as Markdown'"
      @click="copySection"
    >
      <span class="relative flex h-[0.65em] w-[0.65em] items-center justify-center">
        <Copy
          class="absolute h-full w-full transition-all duration-300"
          :class="isCopied ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'"
        />
        <Check
          class="absolute h-full w-full transition-all duration-300"
          :class="isCopied ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'"
        />
      </span>
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'
import { Copy, Check } from 'lucide-vue-next'
import { docsStore } from '../store'
import { filterMarkdownByCopyLanguages } from '../util/markdownCopyFilter'
import { decodeMarkdown } from '../util/decodeMarkdown'

// rendered after every h2-h6 by the markdown pipeline
const props = defineProps<{ headingText: string; headingLevel: number }>()
const { page } = useData()

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

const pageMarkdown = computed<string | undefined>(() => decodeMarkdown((page.value as any).markdown))
const tabGroups = computed(() => (page.value as any).markdownCopyTabGroups || [])

// runs to the next heading of the same or higher level, ignoring the # inside
// fenced code blocks
function extractSection(markdown: string): string {
  const lines = markdown.split('\n')
  const headingRe = /^(#{1,6})\s+(.*)$/
  const target = props.headingText.trim()
  let start = -1
  let inFence = false
  let fenceMarker = ''

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      if (!inFence) {
        inFence = true
        fenceMarker = fenceMatch[1][0]
      } else if (line.trimStart().startsWith(fenceMarker)) {
        inFence = false
      }
      continue
    }
    if (inFence) continue

    const m = line.match(headingRe)
    if (!m) continue
    const level = m[1].length
    if (start === -1) {
      if (level === props.headingLevel && m[2].trim().replace(/\s*#.*$/, '').trim() === target) {
        start = i
      }
      continue
    }
    if (level <= props.headingLevel) {
      return lines.slice(start, i).join('\n').trim()
    }
  }
  return start === -1 ? '' : lines.slice(start).join('\n').trim()
}

async function copySection() {
  if (!pageMarkdown.value) return
  let section = extractSection(pageMarkdown.value)
  if (!section) return
  const languages = docsStore.state.copyLanguages
  if (languages.length > 0) {
    section = filterMarkdownByCopyLanguages(section, tabGroups.value, languages)
  }
  try {
    await navigator.clipboard.writeText(section)
    isCopied.value = true
    clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => (isCopied.value = false), 2000)
  } catch (error) {
    console.error('Failed to copy section markdown:', error)
  }
}

onBeforeUnmount(() => clearTimeout(copyTimeout))
</script>

<!-- css because the parent heading is vitepress-generated, no room for a
     tailwind `group` class -->
<style scoped>
:is(h1, h2, h3, h4, h5, h6):hover .copy-section-button {
  opacity: 1;
}
</style>
