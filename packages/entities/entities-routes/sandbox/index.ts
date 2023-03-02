import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { initializeKAuth, initializeSession } from '@kong-ui/konnect-app-shell'
import Kongponents from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

const app = createApp(App)

// Initializing in an async function in order to fetch session and permissions data for the sandbox ONLY.
// DO NOT DO THIS IN AN ACTUAL APP
const init = async () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('./pages/HomePage.vue'),
      },
      {
        path: '/route-list',
        name: 'route-list',
        component: () => import('./pages/RouteListPage.vue'),
      },
    ],
  })

  app.use(Kongponents)
  app.use(router)

  /**
   * Just for the sandbox purposes, initialize KAuth and fetch session data
   * DO NOT PERFORM THESE FETCHES IN AN ACTUAL APP
   */
  try {
    await initializeKAuth()
    await initializeSession()
  } catch (err) {
    console.error('Could not initialize sandbox data', err)
  }

  app.mount('#app')
}

init()
