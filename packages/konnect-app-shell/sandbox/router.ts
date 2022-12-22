import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import { generateRoutes } from '../src'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Mesh Manager Home',
    },
    children: [
      {
        path: 'child',
        name: 'mesh-manager-child',
        component: HomeView,
        meta: {
          title: 'Mesh Manager Child',
        },
      },
    ],
  },
  {
    path: 'about',
    name: 'about',
    component: HomeView,
    meta: {
      title: 'Mesh Manager About',
    },
  },
]

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const globalRoutes: RouteRecordRaw[] = [
  {
    path: 'global-child-page',
    name: 'global-child-page',
    component: HomeView,
    meta: {
      title: 'Mesh Manager Global Child Page',
    },
    children: [
      {
        path: 'another-child-page',
        name: 'another-child-page',
        component: HomeView,
        meta: {
          title: 'Mesh Manager Another Child Page',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes({
    konnectPrimaryRouteKey: 'mesh-manager',
    type: 'geo',
    routes,
    defaultHomeRouteName: 'home',
  }),
})

// Add navigation guards, etc.

export default router
