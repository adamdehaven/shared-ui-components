import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import RootView from './pages/RootView.vue'
import { generateRoutes } from '../src'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'app-root',
    component: RootView, // Must contain router-view
    children: [
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
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes: generateRoutes('mesh-manager', routes, 'home'),
})
