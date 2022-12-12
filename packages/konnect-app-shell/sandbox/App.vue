<template>
  <KonnectAppShell
    :sidebar-items="sidebarItems"
  >
    <router-view />
  </KonnectAppShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarItems = computed(() => {
  // Determine if the sidebar item is active if any matched route.name evaluates to the `routeName` string passed
  const active = (routeName: string): boolean => !!route?.matched.some(({ name }) => name === routeName)

  if (active('mesh-manager')) {
    return {
      parentKey: 'mesh-manager',
      items: [{
        name: 'Child page',
        to: { name: 'mesh-manager-child' },
        active: active('mesh-manager-child'),
      }],
    }
  }

  return null
})
</script>
