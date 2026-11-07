import Layout from '../components/Layout.vue'

export const routes = [
  { path: '/', component: Layout },
  { path: '/linked', redirect: '/' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
