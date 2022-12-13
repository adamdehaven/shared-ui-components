import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './pages/HomeView.vue'
import { GLOBAL_GEO_PATH } from '../src/constants'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'root',
      meta: {
        title: 'Root',
      },
      redirect: { name: 'geo' },
      children: [
        {
          path: 'us', // default to 'us' region for the sandbox
          name: 'geo',
          meta: {
            title: 'Geo',
          },
          redirect: { name: 'overview' },
          children: [
            {
              path: '',
              name: 'overview',
              component: HomeView,
              meta: {
                title: 'Overview',
              },
            },
            {
              path: 'runtime-manager',
              name: 'runtime-manager',
              component: HomeView,
              meta: {
                title: 'Runtime Manager',
              },
            },
            {
              path: 'mesh-manager',
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
            {
              path: 'servicehub',
              name: 'service-hub',
              component: HomeView,
              meta: {
                title: 'Service Hub',
              },
              children: [
                {
                  path: 'child',
                  name: 'service-hub-child',
                  component: HomeView,
                  meta: {
                    title: 'Service Hub Child',
                  },
                },
              ],
            },
            {
              path: 'portal',
              name: 'portal',
              component: HomeView,
              meta: {
                title: 'Dev Portal',
              },
            },
            {
              path: 'analytics',
              name: 'analytics',
              component: HomeView,
              meta: {
                title: 'Analytics',
              },
            },
          ],
        },
      ],
    },
    {
      path: `${GLOBAL_GEO_PATH}/organization`,
      name: 'organization',
      component: HomeView,
      meta: {
        title: 'Organization',
      },
    },
    {
      path: `${GLOBAL_GEO_PATH}/settings`,
      name: 'settings',
      component: HomeView,
      meta: {
        title: 'Settings',
      },
    },
    {
      path: `${GLOBAL_GEO_PATH}/tokens`,
      name: 'tokens',
      component: HomeView,
      meta: {
        title: 'Personal Access Tokens',
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: HomeView,
      meta: {
        title: 'Logout',
      },
    },
  ],
})
