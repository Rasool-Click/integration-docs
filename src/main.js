import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory('/docs/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./components/Layout.vue'),
    },
  ],
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
