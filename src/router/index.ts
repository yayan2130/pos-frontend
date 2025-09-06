import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/pos' },
    { path: '/pos', component: () => import('../pages/Pos.vue') },
    { path: "/activity", component: () => import("../pages/Activity.vue") },
    // { path: "/reports", component: () => import("../pages/Reports.vue") },
    // { path: "/inventory", component: () => import("../pages/Inventory.vue") },
    // { path: "/teams", component: () => import("../pages/Teams.vue") },
  ],
})

export default router
