import MarkdownActions from '../../components/MarkdownActions.vue'

export default ({ Vue, router, isServer }) => {
  Vue.component('MarkdownActions', MarkdownActions)

  if (isServer) {
    return
  }

  const injectMarkdownActions = () => {
    Vue.nextTick(() => {
      const h1s = document.querySelectorAll('.theme-default-content h1')

      if (h1s.length === 0) {
        return
      }

      const rootInstance = router.app ? router.app.$root : null

      h1s.forEach((h1, index) => {
        if (h1.closest('.h1-with-actions')) {
          return
        }

        const wrapper = document.createElement('div')
        wrapper.className = 'h1-with-actions'

        const mountPoint = document.createElement('div')
        mountPoint.className = 'h1-actions-mount'

        h1.parentNode.insertBefore(wrapper, h1)
        wrapper.appendChild(h1)
        wrapper.appendChild(mountPoint)

        const ComponentClass = Vue.extend(MarkdownActions)
        const instance = new ComponentClass({
          parent: rootInstance,
        })

        instance.$mount()
        mountPoint.appendChild(instance.$el)
      })
    })
  }

  router.onReady(() => {
    injectMarkdownActions()
  })

  router.afterEach(() => {
    injectMarkdownActions()
  })
}
