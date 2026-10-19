const UNDERLINE = [
  'after:absolute',
  'after:top-[var(--anchor-underline-top)]',
  'after:left-0',
  'after:h-0.5',
  'after:w-[var(--anchor-underline-width)]',
  'after:rounded-full',
  'after:bg-[var(--vp-c-brand-1)]',
  'after:animate-anchor-underline',
  'motion-reduce:after:hidden',
]

// the last letter of the last line. past it sit the header anchor, a trailing
// space and the copy button, which can wrap onto a line of its own
function lastLine(target: HTMLElement) {
  const range = document.createRange()
  range.selectNodeContents(target)
  const anchor = target.querySelector('.header-anchor')
  const text = anchor?.previousSibling
  if (text?.nodeType === Node.TEXT_NODE) range.setEnd(text, text.textContent!.trimEnd().length)
  else if (anchor) range.setEndBefore(anchor)
  const rects = range.getClientRects()
  return rects[rects.length - 1]
}

let current: HTMLElement | null = null

export function underlineAnchor(hash: string) {
  if (!hash) return
  requestAnimationFrame(() => {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    const line = target && lastLine(target)
    if (!target || !line) return
    current?.classList.remove(...UNDERLINE)
    current = target
    const box = target.getBoundingClientRect()
    target.style.setProperty('--anchor-underline-width', `${line.right - box.left}px`)
    target.style.setProperty('--anchor-underline-top', `${line.bottom - box.top + 4}px`)
    // reflow, or landing on the same heading twice won't replay it
    void target.offsetWidth
    target.classList.add(...UNDERLINE)
  })
}
