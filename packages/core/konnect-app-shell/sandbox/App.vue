<template>
  <KonnectAppShell
    :sidebar-items="sidebarItems"
    @ready="appShellReady"
    @update:active-geo="geoChanged"
    @update:session="sessionChanged"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { KonnectAppShellSidebarItem, Geo, Session } from '../src/types'
import { evaluateFeatureFlag } from '../src'

const route = useRoute()
const activeGeo = ref()
const session = ref<Session>()
const geoChanged = (geo: Geo) => {
  activeGeo.value = geo
}
const sessionChanged = (sessionObj: Session) => {
  session.value = sessionObj
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

  console.log('evaluateFeatureFlag', evaluateFeatureFlag('kp-14-multi-geo', false))
}
</script>
