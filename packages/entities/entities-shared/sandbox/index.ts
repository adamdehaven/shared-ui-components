import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/HomePage.vue'),
    },
    {
      path: '/entity-delete-modal',
      name: 'entity-delete-modal',
      component: () => import('./pages/EntityDeleteModalPage.vue'),
    },
    {
      path: '/entity-base-table',
      name: 'entity-base-table',
      component: () => import('./pages/EntityBaseTablePage.vue'),
    },
  ],
})

const app = createApp(App)

app.use(Kongponents)
app.use(router)

app.mount('#app')
