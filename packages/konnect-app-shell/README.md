# @kong-ui/konnect-app-shell

> **TODO**: Component description

- [Host application requirements](#host-application-requirements)
  - [Root App component](#root-app-component)
  - [Router configuration](#router-configuration)
- [Evaluating Permissions](#evaluating-permissions)

---

## Host application requirements


### Root App component

The host application **must** only include the `KonnectAppShell.vue` inside the `App.vue` root component. A single `<router-view />` child element is **already included** in the component. No other content should be added as a child of the component (other than other component-provided template slots).

If any `<router-link>` elements are utilized inside any of the template slots provided by the `KonnectAppShell.vue` component, they **must** pass along the active geo as a route param and be wrapped in `v-if` logic that prevents them from rending until the active geo has been determined.

```html
<template>
  <KonnectAppShell
    :sidebar-items="sidebarItems"
    @update:active-geo="updateActiveGeo"
    @ready="appShellReady"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { KonnectAppShellSidebarItem, Geo } from '@kong-ui/konnect-app-shell'

const showAppContent = ref(false)
const activeGeo = ref<Geo>()

const sidebarItems = computed((): KonnectAppShellSidebarItem => {
  return {
    parentKey: 'mesh-manager',
    items: (store.state.selectedMesh && [ // items are dependent on a required route param, so ensure it exists to initialize items, otherwise return an empty array
      {
        name: 'Zone CPs',
        to: { name: 'zones' },
        active: route.name === 'zones',
      },
      {
        name: 'Services',
        to: { name: 'service-list-view', params: { mesh: store.state.selectedMesh } },
        active: route.name === 'service-list-view',
      },
      {
        name: 'Gateways',
        to: { name: 'gateway-list-view', params: { mesh: store.state.selectedMesh } },
        active: route.name === 'gateway-list-view',
      },
    ]) || [],
  }
})

const appShellReady = async (): Promise<void> => {
  showAppContent.value = true
}

const updateActiveGeo = (geo: Geo): void => {
  activeGeo.value = geo
}
</script>
```

### Router configuration

The host application's router configuration **must** utilize the provided `generateRoutes` function.

It **must** wrap all routes in a route with path of `path: ''` and initialize a component with its own `<router-view />`

```html
<template>
  <!-- Host App code -->
</template>
```


```ts
const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'app-root',
    component: () => import('@/app/RootView.vue'), // Must contain router-view
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: 'Overview',
        },
        component: () => import('@/app/main-overview/views/MainOverviewView.vue'),
      },
      {
        path: 'diagnostics',
        name: 'diagnostics',
        meta: {
          title: 'Diagnostics',
        },
        component: () => import('@/app/diagnostics/views/DiagnosticsView.vue'),
      },
    ],
  },
]

const router = createVueRouter({
  history: createWebHistory(baseGuiPath),f
  routes: generateRoutes('mesh-manager', routes, 'home'),
})
```

## Evaluating Permissions

[See the docs for information on evaluating permissions](docs/permissions.md)
