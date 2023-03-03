<template>
  <h2>Konnect API</h2>
  <RouteList
    :can-create="konnectActions.canCreate"
    :can-delete="konnectActions.canDelete"
    :can-edit="konnectActions.canEdit"
    :can-retrieve="konnectActions.canRetrieve"
    :config="konnectConfig"
  />

  <hr>

  <h2>Kong Manager API</h2>
  <RouteList :config="kongManagerConfig" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouteList } from '../../src'
import type { KonnectRouteListConfig, KongManagerRouteListConfig } from '../../src'
import { canUserAccess } from '@kong-ui/konnect-app-shell'

const controlPlaneId = import.meta.env.VITE_KONNECT_CONTROL_PLANE_ID || ''

const konnectConfig = ref<KonnectRouteListConfig>({
  app: 'konnect',
  apiBaseUrl: '/us/kong-api', // `/{geo}/kong-api`, with leading slash and no trailing slash; Consuming app would pass in something like `https://us.api.konghq.com`
  // Set the root `.env.development.local` variable to a control plane your PAT can access
  controlPlaneId,
})

const kongManagerConfig = ref<KongManagerRouteListConfig>({
  app: 'kongManager',
  workspace: 'default',
  apiBaseUrl: '/kong-manager', // For local dev server proxy
  isExactMatch: false,
  filterSchema: {
    name: {
      type: 'text',
    },
    protocols: {
      type: 'text',
    },
    hosts: {
      type: 'text',
    },
    methods: {
      type: 'text',
    },
    paths: {
      type: 'text',
    },
  },
})

const konnectActions = reactive({
  canCreate: async (): Promise<boolean> => await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `runtimegroups/${controlPlaneId}/routes/*` }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canDelete: async (row: Record<string, any>): Promise<boolean> => await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `runtimegroups/${controlPlaneId}/routes/*` }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canEdit: async (row: Record<string, any>): Promise<boolean> => await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `runtimegroups/${controlPlaneId}/routes/*` }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canRetrieve: async (row: Record<string, any>): Promise<boolean> => await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `runtimegroups/${controlPlaneId}/routes/*` }),
})
</script>
