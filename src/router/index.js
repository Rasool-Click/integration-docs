import Layout from '../components/Layout.vue'

const publicRoutes = ['/', '/quickstart', '/authentication', '/endpoints', '/webhooks']
export const routes = [
  ...publicRoutes.map(path => ({ path, component: Layout })),
  { path: '/linked', redirect: '/' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
