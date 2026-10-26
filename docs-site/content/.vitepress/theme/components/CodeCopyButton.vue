<template>
  <button
    type="button"
    :title="isCopied ? 'Copied!' : 'Copy code'"
    class="absolute right-2 top-2 z-[3] flex h-8 items-center overflow-hidden rounded-md border border-line transition-[opacity,background-color] duration-300 focus-visible:opacity-100 [:hover>&]:opacity-100 [@media(hover:none)]:opacity-100 [:hover>&+.lang]:opacity-0 [&:focus-visible+.lang]:opacity-0 [@media(hover:none)]:[&+.lang]:hidden"
    :class="isCopied ? 'bg-accent-selected text-accent' : 'bg-surface-gray text-ink opacity-0 hover:bg-surface-gray-hover'"
    @click="copy"
  >
    <span
      class="grid transition-[grid-template-columns] duration-200 ease-out-expo motion-reduce:transition-none"
      :class="isCopied ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'"
      :aria-hidden="!isCopied"
    >
      <span class="overflow-hidden">
        <span class="block whitespace-nowrap border-r border-accent-light px-2.5 text-xs font-medium leading-[30px]">Copied!</span>
      </span>
    </span>
    <span class="relative flex size-[30px] items-center justify-center">
      <Copy
        class="absolute size-3.5 transition-[transform,opacity,filter] duration-200 ease-out-expo"
        :class="isCopied ? 'scale-50 opacity-0 blur-[2px]' : 'scale-100 opacity-100'"
      />
      <Check
        class="absolute size-3.5 transition-[transform,opacity,filter] duration-200 ease-out-expo"
        :class="isCopied ? 'scale-100 opacity-100' : 'scale-50 opacity-0 blur-[2px]'"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

// rendered in place of vitepress's copy button by the markdown pipeline
const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

async function copy(event: MouseEvent) {
  const block = (event.currentTarget as HTMLElement).parentElement!
  const pre = block.querySelector('pre')!.cloneNode(true) as HTMLElement
  pre.querySelectorAll('.vp-copy-ignore, .diff.remove').forEach((node) => node.remove())
  const code = pre.textContent ?? ''
  // shell snippets drop their prompts, like vitepress does
  const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(block.className)
  try {
    await navigator.clipboard.writeText(isShell ? code.replace(/^ *(\$|>) /gm, '').trim() : code)
    isCopied.value = true
    clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => (isCopied.value = false), 2000)
  } catch (error) {
    console.error('Failed to copy code:', error)
  }
}

onBeforeUnmount(() => clearTimeout(copyTimeout))
</script>
