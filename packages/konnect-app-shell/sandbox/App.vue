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
  if (route.name === 'mesh-manager') {
    return {
      parentKey: 'mesh-manager',
      items: [{
        name: 'Child page',
        to: '/',
      }],
    }
  }

  return null
})
</script>
