import Layout from '../components/Layout.vue'

export const routes = [
  {
    path: '/',
    component: Layout,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Layout,
  },
]
