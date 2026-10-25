<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute left-0 top-0 -z-10 rounded-lg bg-accent-selected motion-reduce:transition-none"
    :class="[
      animate && 'narrow:transition-[transform,width,height] narrow:duration-500 narrow:ease-out-expo',
      rect ? 'opacity-100' : 'opacity-0',
    ]"
    :style="
      rect && {
        transform: `translate(${rect.left}px, ${rect.top}px)`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }
    "
  />
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const rect = ref<Rect | null>(null)
const animate = ref(false)

let nav: HTMLElement | null = null
let mutations: MutationObserver | undefined
let resize: ResizeObserver | undefined
let frame = 0
let revealed: HTMLElement | null = null

// vitepress leaves the sidebar at the top, however far down the current page is
function reveal(item: HTMLElement) {
  const sidebar = item.closest<HTMLElement>('.VPSidebar')
  if (!sidebar) return
  const box = sidebar.getBoundingClientRect()
  const at = item.getBoundingClientRect()
  if (at.top >= box.top && at.bottom <= box.bottom) return
  sidebar.scrollTop += at.top - box.top - sidebar.clientHeight / 2 + at.height / 2
}

function update() {
  const active = nav?.querySelector<HTMLElement>('.VPSidebarItem.is-active > .item')
  // an active item inside a collapsed group has no box
  if (!nav || !active || !active.offsetParent) {
    rect.value = null
    // snap back into place when it reappears instead of sliding in from the top
    animate.value = false
    return
  }
  if (active !== revealed) {
    revealed = active
    reveal(active)
  }
  const from = nav.getBoundingClientRect()
  const to = active.getBoundingClientRect()
  rect.value = { top: to.top - from.top, left: to.left - from.left, width: to.width, height: to.height }
  if (!animate.value) requestAnimationFrame(() => (animate.value = true))
}

function schedule() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(update)
}

onMounted(async () => {
  await nextTick()
  nav = document.getElementById('VPSidebarNav')
  if (!nav) return
  nav.dataset.activePill = ''
  update()
  // is-active moves on navigation, collapsed toggles on group clicks
  mutations = new MutationObserver(schedule)
  mutations.observe(nav, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true })
  resize = new ResizeObserver(schedule)
  resize.observe(nav)
})

onUnmounted(() => {
  mutations?.disconnect()
  resize?.disconnect()
  cancelAnimationFrame(frame)
  if (nav) delete nav.dataset.activePill
})
</script>
