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
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: HomeView,
    },
  ],
})

const app = createApp(App)

app.use(Kongponents)

app.use(router)

app.use(KonnectAppShell)

app.mount('#app')
