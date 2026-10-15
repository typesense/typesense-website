<template>
  <div
    ref="anchor"
    class="sticky top-12 z-10 h-0 narrow:top-[calc(var(--vp-nav-height)+48px)] min-[1280px]:top-[var(--vp-nav-height)]"
    aria-hidden="true"
  >
    <div
      class="absolute inset-x-0 top-0 -mx-6 min-[640px]:mx-0"
      :style="{ transform: `translateY(${section?.shift ?? 0}px)` }"
    >
      <!-- must come before the h2 bar so it slides up underneath it -->
      <div
        ref="h3Bar"
        class="absolute inset-x-0 top-full hidden border-b border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-6 pb-2.5 pt-1.5 text-xl font-semibold leading-7 tracking-[-0.01em] text-[var(--vp-c-text-1)] min-[640px]:px-0 min-[768px]:block"
        :class="{ invisible: !subsection?.header }"
        :style="{ transform: `translateY(${subsection?.shift ?? 0}px)` }"
      >
        <div v-if="subsection?.header" :key="subsection.header.title">
          <span
            class="absolute inset-y-0 left-0 my-auto h-4 w-[3px] rounded-full bg-[var(--vp-c-brand-1)] transition-transform duration-300 ease-out-expo motion-reduce:transition-none"
            :class="docked ? 'scale-100' : 'scale-0'"
          />
          <span
            class="block transition-transform duration-300 ease-out-expo motion-reduce:transition-none"
            :class="{ 'translate-x-4': docked }"
          >
            {{ subsection.header.title }}
          </span>
        </div>
      </div>
      <div
        ref="h2Bar"
        class="relative border-b border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-6 py-2 text-2xl font-semibold leading-8 tracking-[-0.02em] text-[var(--vp-c-text-1)] min-[640px]:px-0"
        :class="{ invisible: !section?.header }"
      >
        {{ section?.header?.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocalNav } from 'vitepress/theme'

// not sticky h2/h3s. vitepress's outline picks the active item by offsetTop,
// which a stuck heading reports as its pinned spot
const { headers } = useLocalNav()

type Header = { element: HTMLElement; title: string; children: Header[] }
type Pinned = { header?: Header; end: number; shift: number; past: number }

const anchor = ref<HTMLElement | null>(null)
const h2Bar = ref<HTMLElement | null>(null)
const h3Bar = ref<HTMLElement | null>(null)
const section = ref<Pinned>()
const subsection = ref<Pinned>()
const docked = ref(false)
let frame = 0

function inset(el: HTMLElement) {
  return el.clientTop + parseFloat(getComputedStyle(el).paddingTop)
}

function pin(headers: Header[], bar: HTMLElement, top: number, last: number): Pinned {
  const line = top + inset(bar)
  const past = headers.map(
    ({ element }) => line - element.getBoundingClientRect().top - inset(element),
  )
  const index = past.filter((distance) => distance >= 0).length - 1
  const end = headers[index + 1]?.element.getBoundingClientRect().top ?? last
  const height = bar.offsetHeight
  return {
    header: headers[index],
    end,
    shift: Math.max(-height, Math.min(0, end - top - height)),
    past: past[index] ?? 0,
  }
}

function update() {
  if (!anchor.value || !h2Bar.value || !h3Bar.value) return
  const top = anchor.value.getBoundingClientRect().top
  const bottom = document.querySelector('.vp-doc')?.getBoundingClientRect().bottom ?? Infinity
  const previous = subsection.value?.header

  section.value = pin(headers.value, h2Bar.value, top, bottom)
  subsection.value = pin(
    section.value.header?.children ?? [],
    h3Bar.value,
    top + h2Bar.value.offsetHeight,
    section.value.end,
  )

  // the real heading stays hidden under the bar for these 24px, so scrolling back
  // up can ease the indent out. a new subsection renders undocked for one frame
  // so its indent transitions in even when a fast scroll lands past them
  const settled = subsection.value.past > 24
  docked.value = settled && subsection.value.header === previous
  if (settled && !docked.value) onScroll()
}

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(update)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(frame)
})

watch(headers, () => nextTick(update))
</script>
