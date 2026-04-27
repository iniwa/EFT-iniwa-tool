import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/style.css'

const params = new URLSearchParams(window.location.search)
const isOverlay = params.get('overlay') === 'tasks'

if (isOverlay) {
  document.documentElement.style.background = 'transparent'
  document.body.style.background = 'transparent'
  const appEl = document.getElementById('app')
  if (appEl) appEl.style.background = 'transparent'
  import('./components/OverlayWindow.vue').then(({ default: OverlayWindow }) => {
    createApp(OverlayWindow).mount('#app')
  })
} else {
  Promise.all([
    import('./App.vue'),
    import('./router/index.js'),
  ]).then(([{ default: App }, { default: router }]) => {
    createApp(App).use(router).mount('#app')
  })
}
