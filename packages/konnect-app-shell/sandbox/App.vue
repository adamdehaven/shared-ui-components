<template>
  <KonnectAppShell
    :sidebar-items="sidebarItems"
    :sidebar-profile-items="[{ name: 'Logout', to: '/logout'}]"
    sidebar-profile-name="Shell App User"
  >
    <router-view />
  </KonnectAppShell>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { SidebarPrimaryItemKeys, Geo } from '../src/types'
import { symbolInjectionKeys } from '../src/index'

const route = useRoute()
const { konnectAppShellActiveGeo } = symbolInjectionKeys
const sidebarItems = computed(() => {
  // Determine if the sidebar item is active if any matched route.name evaluates to the `routeName` string passed
  const active = (routeName: string): boolean => !!route?.matched.some(({ name }) => name === routeName)

  // Example of a host application providing its secondary navigation items.
  // In a real host app, only one of these entries would be needed.
  if (active('mesh-manager')) {
    return {
      parentKey: SidebarPrimaryItemKeys.MESH_MANAGER,
      items: [{
        name: 'Child page',
        to: { name: 'mesh-manager-child' },
        active: active('mesh-manager-child'),
      }],
    }
  } else if (active('service-hub')) {
    return {
      parentKey: SidebarPrimaryItemKeys.SERVICE_HUB,
      items: [{
        name: 'Child page',
        to: { name: 'service-hub-child' },
        active: active('service-hub-child'),
      }],
    }
  }

  return null
})

// Set the active geo
// TODO: This would actually be done by the KonnectAppShell when it fetches the /organizations/me/entitlements
provide(konnectAppShellActiveGeo, ref<Geo>({
  code: 'eu',
  name: 'EU (Europe)', // TODO: should come from i18n
  userCanSelect: true,
  isActive: true,
  isActiveOverride: false,
}))
</script>
