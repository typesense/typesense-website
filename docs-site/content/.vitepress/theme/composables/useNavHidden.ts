import { createSharedComposable, useEventListener, useWindowScroll } from '@vueuse/core'
import { ref, watch } from 'vue'

export const useNavHidden = createSharedComposable(() => {
  const { y } = useWindowScroll()
  const hidden = ref(true)
  let byUser = false

  // jumps the page makes on its own (anchor links, search results, back/forward,
  // tab groups holding their place) leave the nav as it was
  useEventListener(['click', 'popstate'], () => (byUser = false), { capture: true })
  useEventListener(['touchmove', 'wheel'], () => (byUser = true), { passive: true })
  useEventListener('keydown', e => (byUser = e.key !== 'Enter'))

  watch(y, (next, prev) => {
    // ios reports its rubber-band bounce, which reads as a reversal at either end
    const max = document.documentElement.scrollHeight - window.innerHeight - 1
    const [to, from] = [next, prev].map(v => Math.min(Math.max(v, 0), max))
    if (byUser && to !== from) hidden.value = to > from
  })

  return hidden
})
