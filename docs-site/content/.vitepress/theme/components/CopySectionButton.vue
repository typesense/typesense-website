<template>
  <ClientOnly>
    <button
      v-if="pageMarkdown"
      ref="button"
      type="button"
      class="copy-section-button inline-flex ml-2 px-1 border-0 bg-transparent align-middle cursor-pointer opacity-0 transition-opacity duration-150 focus-visible:opacity-100"
      :class="[
        isCopied ? '!opacity-100 text-accent' : 'text-accent hover:text-accent-hover',
        nearTop && '[@media(hover:none)]:opacity-100',
      ]"
      :title="isCopied ? 'Copied!' : 'Copy this section as Markdown'"
      @click="copySection"
    >
      <span class="relative flex h-[0.65em] w-[0.65em] items-center justify-center">
        <Copy
          class="absolute h-full w-full transition-[transform,opacity,filter] duration-200 ease-out-expo"
          :class="isCopied ? 'scale-50 opacity-0 blur-[2px]' : 'scale-100 opacity-100'"
        />
        <Check
          class="absolute h-full w-full transition-[transform,opacity,filter] duration-200 ease-out-expo"
          :class="isCopied ? 'scale-100 opacity-100' : 'scale-50 opacity-0 blur-[2px]'"
        />
      </span>
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { useData } from 'vitepress'
import { Copy, Check } from 'lucide-vue-next'
import { docsStore } from '../store'
import { filterMarkdownByCopyLanguages, getVisibleCopyTabs } from '../util/markdownCopyFilter'
import { decodeMarkdown } from '../util/decodeMarkdown'
import type { TypesensePageData } from '../types'

// rendered after every h2-h6 by the markdown pipeline
const props = withDefaults(defineProps<{ headingText: string; headingLevel: number; headingIndex?: number }>(), {
  headingIndex: 0,
})
const { page } = useData()

const button = ref<HTMLElement | null>(null)
// touch has no hover to reveal it, so only headings in the top half of the screen show theirs
const nearTop = useElementVisibility(button, { rootMargin: '0px 0px -50% 0px' })

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

const pageMarkdown = computed<string | undefined>(() =>
  decodeMarkdown((page.value as TypesensePageData).markdown),
)
const tabGroups = computed(() => (page.value as TypesensePageData).markdownCopyTabGroups || [])

// runs to the next heading of the same or higher level, ignoring the # inside
// fenced code blocks
function extractSection(markdown: string): string {
  const lines = markdown.split('\n')
  const headingRe = /^ {0,3}(#{1,6})\s+(.*)$/
  const target = props.headingText.trim()
  let start = -1
  let matches = 0
  let inFence = false
  let fenceMarker = ''

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    // like markdown-it, only a bare fence at least as long as the opener closes it
    const fenceMatch = line.match(/^\s*(```+|~~~+)(.*)$/)
    if (fenceMatch) {
      if (!inFence) {
        inFence = true
        fenceMarker = fenceMatch[1]
      } else if (fenceMatch[1].startsWith(fenceMarker) && !fenceMatch[2].trim()) {
        inFence = false
      }
      continue
    }
    if (inFence) continue

    const m = line.match(headingRe)
    if (!m) continue
    const level = m[1].length
    if (start === -1) {
      const same = level === props.headingLevel && m[2].trim().replace(/\s*#.*$/, '').trim() === target
      if (same && matches++ === props.headingIndex) start = i
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
  const filteredMarkdown = filterMarkdownByCopyLanguages(
    pageMarkdown.value,
    tabGroups.value,
    docsStore.state.copyLanguages,
    false,
    getVisibleCopyTabs(tabGroups.value, docsStore.state.defaultTab),
  )
  const section = extractSection(filteredMarkdown)
  if (!section) return
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
