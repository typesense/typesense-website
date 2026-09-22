<template>
  <TooltipProvider :delay-duration="200">
    <ButtonGroup
      class="markdown-actions shrink-0 overflow-hidden rounded-md border border-line bg-surface-gray"
    >
      <!-- copy markdown -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="sm"
            class="h-8 gap-1.5 rounded-none border-r border-line px-2.5 text-xs text-ink hover:bg-surface-gray-hover hover:text-ink"
            :class="isCopied ? 'bg-accent-selected text-accent hover:bg-accent-selected hover:text-accent' : ''"
            @click="copyMarkdown"
          >
            <span class="relative flex h-3.5 w-3.5 items-center justify-center">
              <Copy
                class="absolute h-3.5 w-3.5 transition-all duration-300"
                :class="isCopied ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'"
              />
              <Check
                class="absolute h-3.5 w-3.5 text-accent transition-all duration-300"
                :class="isCopied ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'"
              />
            </span>
            <span class="text-[0.8rem] font-medium">Copy Markdown</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ buttonTitle }}</TooltipContent>
      </Tooltip>

      <!-- language options -->
      <Popover v-if="hasLanguageFilters" v-model:open="showOptions">
        <PopoverAnchor as-child>
          <Tooltip>
            <TooltipTrigger as-child>
              <PopoverTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 gap-1 rounded-none border-r border-line px-2 text-xs text-ink hover:bg-surface-gray-hover hover:text-ink aria-expanded:bg-surface-gray-hover"
                  aria-label="Choose copied languages"
                >
                  <Braces class="h-3.5 w-3.5 shrink-0" :stroke-width="1.8" />
                  <ChevronDown
                    class="h-3 w-3 shrink-0 opacity-60 transition-transform"
                    :class="showOptions ? 'rotate-180' : ''"
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Choose copied languages</TooltipContent>
          </Tooltip>
        </PopoverAnchor>
        <PopoverContent align="end" :side-offset="6" class="w-64 p-2">
          <div class="mb-1 border-b border-line px-1 pb-2">
            <div class="text-sm font-semibold text-ink">Copy languages</div>
            <div class="pt-1 text-xs font-normal leading-snug text-ink-muted">
              Choose which tabbed code examples are included when copying markdown.
            </div>
          </div>
          <div class="flex items-center justify-between gap-3 px-1 pb-1">
            <span class="text-[0.68rem] font-medium text-ink-light">{{ availableLanguageCount }} available on this page</span>
            <button
              type="button"
              class="cursor-pointer text-[0.68rem] font-semibold text-accent hover:underline"
              @click="toggleAllAvailableLanguages"
            >
              {{ allAvailableLanguagesSelected ? 'Deselect all' : 'Select all' }}
            </button>
          </div>
          <button
            v-for="language in languageOptions"
            :key="language"
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded px-2 py-[0.45rem] text-left leading-tight transition-colors enabled:hover:bg-surface-gray disabled:cursor-not-allowed text-sm"
            :class="isLanguagePresent(language) ? 'text-ink' : 'text-ink-lighter'"
            :disabled="!isLanguagePresent(language)"
            @click="handleLanguageClick(language)"
          >
            <span class="inline-flex min-w-0 items-center gap-2">
              <Checkbox
                :model-value="isLanguagePresent(language) && isLanguageSelected(language)"
                :disabled="!isLanguagePresent(language)"
                class="pointer-events-none"
                :class="isLanguagePresent(language) ? 'outline outline-1 outline-line' : ''"
                tabindex="-1"
              />
              <span>{{ language }}</span>
            </span>
            <span v-if="!isLanguagePresent(language)" class="ml-auto text-[0.65rem] font-semibold text-ink-lightest">
              Unavailable
            </span>
          </button>
        </PopoverContent>
      </Popover>

      <!-- view raw markdown -->
      <Tooltip v-if="markdownUrl">
        <TooltipTrigger as-child>
          <Button
            as="a"
            variant="ghost"
            size="sm"
            class="h-8 rounded-none px-2.5 !text-ink hover:bg-surface-gray-hover hover:!text-ink"
            :href="markdownUrl"
            target="_blank"
            aria-label="View raw markdown"
          >
            <ExternalLink class="h-3.5 w-3.5 shrink-0" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View raw markdown</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { Copy, Check, Braces, ChevronDown, ExternalLink } from 'lucide-vue-next'
import { Popover, PopoverAnchor, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { docsStore } from '@/store'
import { COPY_LANGUAGE_OPTIONS } from '@/util/copyLanguages'
import { filterMarkdownByCopyLanguages } from '@/util/markdownCopyFilter'
import { decodeMarkdown } from '@/util/decodeMarkdown'
import type { TypesensePageData } from '@/types'

const { page } = useData()
const route = useRoute()

const isCopied = ref(false)
const showOptions = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

const buttonTitle = computed(() =>
  isCopied.value ? 'Markdown copied to clipboard' : 'Copy markdown source to clipboard',
)
const pageMarkdown = computed(() => decodeMarkdown((page.value as TypesensePageData).markdown))
const markdownUrl = computed(() => {
  const url = (page.value as TypesensePageData).markdownUrl
  return url ? withBase(url) : null
})
const tabGroups = computed(() => (page.value as TypesensePageData).markdownCopyTabGroups || [])
const presentLanguages = computed<string[]>(() => {
  const langs = (page.value as TypesensePageData).markdownCopyLanguages
  return Array.isArray(langs) ? langs : []
})
const languageOptions = COPY_LANGUAGE_OPTIONS
const selectedLanguages = computed<string[]>(() => docsStore.state.copyLanguages)
const hasLanguageFilters = computed(() => presentLanguages.value.length > 0)
const availableLanguageCount = computed(() => presentLanguages.value.length)
const allAvailableLanguagesSelected = computed(
  () =>
    presentLanguages.value.length > 0 &&
    presentLanguages.value.every((l) => selectedLanguages.value.includes(l)),
)

function isLanguageSelected(language: string) {
  return selectedLanguages.value.includes(language)
}
function isLanguagePresent(language: string) {
  return presentLanguages.value.includes(language)
}
function handleLanguageClick(language: string) {
  if (!isLanguagePresent(language)) return
  const next = isLanguageSelected(language)
    ? selectedLanguages.value.filter((l) => l !== language)
    : selectedLanguages.value.concat(language)
  docsStore.setCopyLanguages(next)
}
function toggleAllAvailableLanguages() {
  const next = allAvailableLanguagesSelected.value
    ? selectedLanguages.value.filter((l) => !isLanguagePresent(l))
    : languageOptions.filter((l) => (isLanguagePresent(l) ? true : selectedLanguages.value.includes(l)))
  docsStore.setCopyLanguages(next)
}

async function copyMarkdown() {
  clearTimeout(copyTimeout)
  isCopied.value = true
  try {
    if (!pageMarkdown.value) throw new Error('Markdown content not available')
    const markdown = filterMarkdownByCopyLanguages(pageMarkdown.value, tabGroups.value, selectedLanguages.value)
    await navigator.clipboard.writeText(markdown)
    copyTimeout = setTimeout(() => (isCopied.value = false), 2000)
  } catch (error) {
    console.error('Failed to copy markdown:', error)
    isCopied.value = false
    alert('Failed to copy markdown. Please try again.')
  }
}

watch(
  () => route.path,
  () => {
    clearTimeout(copyTimeout)
    isCopied.value = false
    showOptions.value = false
  },
)
</script>
