import { createApp } from 'vue'
import App from './App.vue'
import KonnectAppShell from '../src'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: HomeView,
      meta: {
        title: 'Overview',
      },
    },
    {
      path: '/runtime-manager',
      name: 'runtime-manager',
      component: HomeView,
      meta: {
        title: 'Runtime Manager',
      },
    },
    {
      path: '/mesh-manager',
      name: 'mesh-manager',
      component: HomeView,
      meta: {
        title: 'Mesh Manager',
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
  ],
})

const app = createApp(App)

app.use(Kongponents)
app.use(router)
app.use(KonnectAppShell)

app.mount('#app')
