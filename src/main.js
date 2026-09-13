import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import './style.css'
import { routes } from './router'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ({ app }) => {
    // @unhead/vue and Shiki initialization are automatically handled by their respective plugins or integrations (vite-ssg manages head automatically).
    // The head instance is automatically created and injected into the app when ViteSSG mounts.

    // Global Vue error handler to prevent hard crashes
    app.config.errorHandler = (err, instance, info) => {
      console.error('Global Vue Error:', err, info)
      // Implementation for external logging (e.g. Sentry) can be placed here.
    }
  }
)