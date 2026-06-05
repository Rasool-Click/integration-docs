import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { routes } from './router'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ({ app, router, routes, isClient, initialState }) => {
    const pinia = createPinia()
    app.use(pinia)

    // @unhead/vue and Shiki initialization are automatically handled by their respective plugins or integrations (vite-ssg manages head automatically).
    // The head instance is automatically created and injected into the app when ViteSSG mounts.

    if (import.meta.env.SSR)
      initialState.pinia = pinia.state.value
    else
      pinia.state.value = initialState.pinia || {}
  }
)
