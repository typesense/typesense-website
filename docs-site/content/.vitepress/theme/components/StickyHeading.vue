<template>
  <div
    ref="anchor"
    class="sticky z-10 h-0 transition-[top] duration-300 ease-out-expo motion-reduce:transition-none narrow:top-[calc(var(--vp-nav-height)+48px)] min-[1280px]:top-[var(--vp-nav-height)]"
    :class="navHidden ? 'top-12' : 'top-[calc(var(--vp-nav-height)+48px)]'"
    aria-hidden="true"
    @transitionend.self="onScroll"
  >
    <div
      class="absolute inset-x-0 top-0 -mx-6 min-[640px]:mx-0"
      :style="{ transform: `translateY(${section?.shift ?? 0}px)` }"
    >
      <!-- must come before the h2 bar so it slides up underneath it -->
      <div
        ref="h3Bar"
        class="absolute inset-x-0 top-full hidden border-b border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] px-6 pb-2.5 pt-1.5 text-xl font-semibold leading-7 tracking-[-0.01em] text-[var(--vp-c-text-1)] transition-opacity duration-300 ease-out-expo min-[640px]:px-0 min-[768px]:block"
        :class="{ invisible: !subsection?.header || cleared, 'max-narrow:pointer-events-none max-narrow:opacity-0': !navHidden }"
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
    <!-- scrollOffset in config.mts -->
    <div data-sticky-floor class="absolute inset-x-0 h-0" :style="{ top: `${floor}px` }" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useLocalNav } from 'vitepress/theme'
import { useNavHidden } from '../composables/useNavHidden'
import { settleAnchorWith } from '../util/settleAnchor'

// not sticky h2/h3s. vitepress's outline picks the active item by offsetTop,
// which a stuck heading reports as its pinned spot
const { headers } = useLocalNav()
const navHidden = useNavHidden()
const wide = useMediaQuery('(min-width: 960px)')

type Header = { element: HTMLElement; title: string; children: Header[] }
type Pinned = { header?: Header; end: number; shift: number; past: number }

const anchor = ref<HTMLElement | null>(null)
const h2Bar = ref<HTMLElement | null>(null)
const h3Bar = ref<HTMLElement | null>(null)
const section = ref<Pinned>()
const subsection = ref<Pinned>()
const docked = ref(false)
const floor = ref(0)
const cleared = ref(false)
let frame = 0

function inset(el: HTMLElement) {
  return el.clientTop + parseFloat(getComputedStyle(el).paddingTop)
}

function outset(el: HTMLElement) {
  return el.offsetHeight - el.clientHeight - el.clientTop + parseFloat(getComputedStyle(el).paddingBottom)
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

function place() {
  if (!anchor.value || !h2Bar.value || !h3Bar.value) return
  const top = anchor.value.getBoundingClientRect().top
  const bottom = document.querySelector('.vp-doc')?.getBoundingClientRect().bottom ?? Infinity

  section.value = pin(headers.value, h2Bar.value, top, bottom)
  subsection.value = pin(
    section.value.header?.children ?? [],
    h3Bar.value,
    top + h2Bar.value.offsetHeight,
    section.value.end,
  )

  // pushed past its title, the h3 bar would only draw a second rule under the h2 bar
  cleared.value = h3Bar.value.offsetHeight + subsection.value.shift <= outset(h3Bar.value)

  const h2Bottom = section.value.header ? section.value.shift + h2Bar.value.offsetHeight : 0
  const h3Bottom =
    subsection.value.header && h3Shown() && !cleared.value
      ? h2Bottom + subsection.value.shift + h3Bar.value.offsetHeight
      : 0
  floor.value = Math.max(0, h2Bottom, h3Bottom)
}

function update() {
  const [previousSection, previous] = [section.value?.header, subsection.value?.header]
  place()
  if (!section.value || !subsection.value) return

  // the real heading stays hidden under the bar for these 24px, so scrolling back
  // up can ease the indent out. a new subsection renders undocked for one frame
  // so its indent transitions in even when a fast scroll lands past them
  const settled = subsection.value.past > 24
  docked.value = settled && subsection.value.header === previous
  if (settled && !docked.value) onScroll()

  // pin() measured the bars with their old titles
  if (section.value.header !== previousSection || subsection.value.header !== previous) {
    nextTick(place)
  }
}

function h3Shown() {
  return !!h3Bar.value?.offsetParent && (navHidden.value || wide.value)
}

function barHeight(bar: HTMLElement, title: string) {
  const ghost = bar.cloneNode() as HTMLElement
  ghost.textContent = title
  ghost.classList.add('invisible')
  bar.after(ghost)
  const height = ghost.offsetHeight
  ghost.remove()
  return height
}

// a jump stops a heading just short of pinning, so it shows below the bars,
// which name only the sections around it
function rest(target: HTMLElement) {
  if (!anchor.value || !h2Bar.value || !h3Bar.value) return 0
  // mid-slide, the computed top is wherever the nav has got to
  anchor.value.getAnimations().forEach((animation) => animation.finish())
  const top = parseFloat(getComputedStyle(anchor.value).top)
  const upTo = ({ element }: Header) =>
    element === target || !!(element.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
  const h2 = headers.value.findLast(upTo)
  const h3 = h3Shown() ? h2?.children.findLast(upTo) : undefined
  const h2Height = h2 ? barHeight(h2Bar.value, h2.title) : 0

  const lines = new Map<HTMLElement, number>()
  if (h2) lines.set(h2.element, top - 1)
  if (h3) lines.set(h3.element, top + h2Height + inset(h3Bar.value) + 2)
  if (!lines.has(target)) {
    lines.set(target, top + h2Height + (h3 ? barHeight(h3Bar.value, h3.title) : 0) + 24)
  }
  return Math.max(...[...lines].map(([element, line]) => element.getBoundingClientRect().top - line))
}

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(update)
}

onMounted(() => {
  // a scroll reaches document before window, where vitepress's outline reads
  // the floor through getScrollOffset()
  document.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  settleAnchorWith(rest)
})

onUnmounted(() => {
  document.removeEventListener('scroll', update)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(frame)
  settleAnchorWith()
})

watch(headers, () => nextTick(update))
</script>
