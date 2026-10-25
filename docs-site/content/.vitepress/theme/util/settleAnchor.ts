import { getScrollOffset } from 'vitepress'

const INPUTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

let release: (() => void) | undefined

// tab groups only render client side and the web font swaps in late, both
// after vitepress has jumped to the #hash. ios safari has no scroll anchoring,
// so without this the heading ends up screens below the fold
export function settleAnchor() {
  release?.()
  const id = decodeURIComponent(location.hash.slice(1))
  // back/forward restores its own saved position
  if (!id || history.state?.scrollPosition) return

  const observer = new ResizeObserver(() => {
    const target = document.getElementById(id)
    if (!target) return
    const drift =
      target.getBoundingClientRect().top -
      getScrollOffset() +
      parseInt(getComputedStyle(target).paddingTop, 10)
    if (Math.abs(drift) >= 1) window.scrollBy(0, drift)
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
