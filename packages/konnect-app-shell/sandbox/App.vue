<template>
  <KonnectAppShell
    :sidebar-items="sidebarItems"
    @ready="appShellReady"
    @update:active-geo="geoChanged"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { KonnectAppShellSidebarItem, Geo } from '../src/types'

const route = useRoute()
const activeGeo = ref()
const geoChanged = (geo: Geo) => {
  activeGeo.value = geo
}
const sidebarItems = computed((): KonnectAppShellSidebarItem | null => {
  if (!activeGeo.value) {
    return null
  }

  // Determine if the sidebar item is active if any matched route.name evaluates to the `routeName` string passed
  const active = (routeName: string): boolean => !!route?.matched.some(({ name }) => name === routeName)

  // Example of a host application providing its secondary navigation items.
  // In a real host app, only one of these entries would be needed.
  if (active('mesh-manager')) {
    return {
      parentKey: 'mesh-manager',
      items: [
        {
          name: 'Child page',
          to: {
            name: 'mesh-manager-child',
          },
          active: active('mesh-manager-child'),
        },
      ],
    }
  }

  return null
})

const appShellReady = (): void => {
  console.log('Konnect App Shell @ready event fired')
}
</script>
