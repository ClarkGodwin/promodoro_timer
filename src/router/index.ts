import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: () => import('@/components/Timer.vue'),
    meta : {showToast : false }
  },
  { 
    path: '/settings', 
    name: 'settings',
    component: () => import('@/components/Settings.vue')
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from))

export default router
