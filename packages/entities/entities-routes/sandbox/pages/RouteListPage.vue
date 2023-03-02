<template>
  <h2>Konnect API</h2>
  <RouteList
    :can-delete="canDelete"
    :can-edit="canEdit"
    :config="konnectConfig"
  />

  <hr>

  <h2>Kong Manager API</h2>
  <RouteList :config="kongManagerConfig" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouteList } from '../../src'
import type { KonnectRouteListConfig, KongManagerRouteListConfig } from '../../src'
import { canUserAccess } from '@kong-ui/konnect-app-shell'

const konnectConfig = ref<KonnectRouteListConfig>({
  app: 'konnect',
  apiBaseUrl: '/us/kong-api', // `/{geo}/kong-api`, with leading slash and no trailing slash; Consuming app would pass in something like `https://us.api.konghq.com`
  controlPlaneId: 'b3b22183-c0d0-445d-8737-c04525ad2b0e',
})

const kongManagerConfig = ref<KongManagerRouteListConfig>({
  app: 'kongManager',
  workspace: 'default',
  apiBaseUrl: '/kong-manager', // For local dev server proxy
})

const canEdit = async (row: Record<string, any>): Promise<boolean> => {
  return await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `services/${row.id}` })
}

const canDelete = async (row: Record<string, any>): Promise<boolean> => {
  // Org admin
  return await canUserAccess({ service: 'accounts', action: '#root', resourcePath: null })
}
</script>
