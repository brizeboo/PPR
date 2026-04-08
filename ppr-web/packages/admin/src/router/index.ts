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
      {
        path: 'report-designer',
        name: 'ReportDesigner',
        component: () => import('@/views/report-designer/index.vue'),
      },
      {
        path: 'template-designer',
        name: 'TemplateDesigner',
        component: () => import('@/views/template-designer/index.vue'),
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/file/index.vue'),
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/views/schedule/index.vue'),
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/log/index.vue'),
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

