import { RouteRecordRaw } from 'vue-router'
export const routes: Array<RouteRecordRaw & { label?: string }> = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path: '/entity-delete-modal',
    name: 'entity-delete-modal',
    label: 'EntityDeleteModal',
    component: () => import('./pages/EntityDeleteModalPage.vue'),
  },
  {
    path: '/entity-base-table',
    name: 'entity-base-table',
    label: 'EntityBaseTable',
    component: () => import('./pages/EntityBaseTablePage.vue'),
  },
  {
    path: '/entity-filter',
    name: 'entity-filter',
    label: 'EntityFilter',
    component: () => import('./pages/EntityFilterPage.vue'),
  },
]
