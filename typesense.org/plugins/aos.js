// Source: https://zacheryng.com/nuxt-with-animated-on-scroll/
export default ({ app }) => {
  // Load this only on scroll for SEO purposes
  // Source: https://github.com/michalsnik/aos/issues/506
  document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('scroll', async function () {
      if (app.AOS == null) {
        // Load CSS only on scroll, for SEO so elements are not hidden
        // Source: https://github.com/michalsnik/aos/issues/87#issuecomment-392277930
        await import('aos/dist/aos.css')
        const AOS = await import('aos')

        // eslint-disable-next-line
        app.AOS = new AOS.init({
          // disable: window.innerWidth < 640,
          offset: 10,
          duration: 800,
          easing: 'linear',
        })
      }
    })
  })
}
