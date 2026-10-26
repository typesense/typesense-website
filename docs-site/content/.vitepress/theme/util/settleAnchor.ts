import { getScrollOffset } from 'vitepress'

const INPUTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

const offsetDrift = (target: HTMLElement) =>
  target.getBoundingClientRect().top -
  getScrollOffset() +
  parseInt(getComputedStyle(target).paddingTop, 10)

let drift = offsetDrift
let release: (() => void) | undefined

// StickyHeading knows which of its bars stay up over a target
export function settleAnchorWith(fn = offsetDrift) {
  drift = fn
}

// tab groups only render client side and the web font swaps in late, both
// after vitepress has jumped to the #hash. ios safari has no scroll anchoring,
// so without this the heading ends up screens below the fold
export function settleAnchor(smooth = false) {
  release?.()
  let id: string
  // a stray % throws, and on a direct load the app only mounts after this
  try {
    id = decodeURIComponent(location.hash.slice(1))
  } catch {
    return
  }
  // back/forward restores its own saved position
  if (!id || history.state?.scrollPosition) return

  const observer = new ResizeObserver(() => {
    const target = document.getElementById(id)
    if (!target) return
    const by = drift(target)
    if (Math.abs(by) >= 1) window.scrollBy({ top: by, behavior: smooth ? 'smooth' : 'auto' })
    smooth = false
  })
  observer.observe(document.body)

  const stop = () => {
    observer.disconnect()
    INPUTS.forEach((type) => window.removeEventListener(type, stop, { capture: true }))
    release = undefined
  }
  INPUTS.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }))
  release = stop
}
