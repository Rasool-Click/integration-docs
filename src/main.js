import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import Layout from './components/Layout.vue'
import './style.css'

const routes = [
  { path: '/', component: Layout },
  { path: '/:platform', component: Layout }
]

import { createHead } from '@unhead/vue'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, head, isClient, initialState }) => {
    app.use(createPinia())
  }
)
