import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import './style.css'
import { routes } from './router'

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ({ app }) => {
    app.config.errorHandler = (error, instance, info) => {
      console.error('WESSAAL documentation error:', error, info)
    }
  },
)
