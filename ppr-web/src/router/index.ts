import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/datasource' },
      {
        path: 'datasource',
        name: 'Datasource',
        component: () => import('@/views/datasource/index.vue'),
      },
      {
        path: 'view-designer',
        name: 'ViewDesigner',
        component: () => import('@/views/view-designer/index.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

