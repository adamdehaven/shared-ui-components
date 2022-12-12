/* eslint-disable no-unused-vars */
import type { SidebarSecondaryItem } from '@kong-ui/app-layout'

export interface KonnectAppShellSidebarItem {
  /** Unique key (string) of the secondary item's top-level navigation parent item */
  parentKey: string
  items?: SidebarSecondaryItem[]
}

export enum SidebarPrimaryItemKeys {
  OVERVIEW = 'overview',
  RUNTIME_MANAGER = 'runtime-manager',
  MESH_MANAGER = 'mesh-manager',
  SERVICE_HUB = 'service-hub',
  DEV_PORTAL = 'dev-portal',
  ANALYTICS = 'analytics',
  ORGANIZATION = 'organization',
  SETTINGS = 'settings',
}
