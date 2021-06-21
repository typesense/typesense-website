/* eslint-disable */
!function (e, t, n) {
  function a() {
    setTimeout(function() {
      var e = t.getElementsByTagName("script")[0], n = t.createElement("script");
      n.type = "text/javascript", n.async = !0, n.src = "https://beacon-v2.helpscout.net", e.parentNode.insertBefore(n, e)
    }, 5000);
  }

  if (e.Beacon = n = function (t, n, a) {
    e.Beacon.readyQueue.push({method: t, options: n, data: a})
  }, n.readyQueue = [], "complete" === t.readyState) return a();
  e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1)
}(window, document, window.Beacon || function () {
});

if(window.matchMedia('(max-width: 576px)').matches) {
  window.Beacon('config', { display: { style: 'icon' } })
}

window.Beacon('init', '11291d62-d72c-4354-9f74-dfd71bb37718')
