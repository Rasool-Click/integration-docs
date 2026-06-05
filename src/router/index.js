import Layout from '../components/Layout.vue'

export const routes = [
  {
    path: '/',
    component: Layout,
    // Add child routes or actual page components later.
    // For now, mapping / to Layout component or a separate page
  },
  {
    path: '/linked',
    component: () => import('../components/Layout.vue'), // Lazy-load placeholder
  },
  {
    path: '/official',
    component: () => import('../components/Layout.vue'), // Lazy-load placeholder
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    // Fallback logic, reusing Layout for now but can be customized to an Error component.
    component: () => import('../components/Layout.vue'),
  }
]
