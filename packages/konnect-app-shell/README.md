# @kong-ui/konnect-app-shell

## TODO/Questions

- How can a consuming app close the mobile sidebar on navigate?


## Host application requirements


### Root App component

The host application **must** only include the `KonnectAppShell.vue` inside the `App.vue` root component with a single `<router-view />` child element in the default slot (other than other component-provided template slots).

If any `<router-link>` elements are utilized inside any of the template slots provided by the `KonnectAppShell.vue` component, they **must** pass along the active geo as a route param and be wrapped in `v-if` logic that prevents them from rending until the active geo has been determined.

```html
<template>
  <KonnectAppShell
    :sidebar-items="sidebarItems"
    @update:active-geo="updateActiveGeo"
    @ready="appShellReady"
  >
    <template #navbar>
      <router-link
        v-if="activeGeo"
        :to="{ name: 'home', params: { geo: activeGeo.code } }"
      >
        Navbar example link
      </router-link>
    </template>

    <router-view />
  </KonnectAppShell>
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

The content of this component **must** define a `prop` of `activeGeo` so that it can hide all default content until the active geo is set:

```html
<template>
  <template v-if="activeGeo && activeGeo.code">
    <!-- Host App code -->
  </template>
</template>

<script setup lang="ts">
defineProps({
  activeGeo: {
    type: Object as PropType<Geo | undefined>,
    default: undefined,
    required: true,
  },
})
</script>

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
    history: createWebHistory(baseGuiPath),
    routes: generateRoutes('mesh-manager', routes, 'home'),
  })
```
