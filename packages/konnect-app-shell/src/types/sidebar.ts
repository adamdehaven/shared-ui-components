/* eslint-disable no-unused-vars */
import type { SidebarPrimaryItem, SidebarSecondaryItem } from '@kong-ui/app-layout'
import { KonnectPrimaryRouteKey } from './routes'

/**
 * The KonnectAppShell sidebar top-level navigation items
 */
export interface KonnectAppShellSidebarPrimaryItem extends SidebarPrimaryItem {
  key: KonnectPrimaryRouteKey
}

export interface KonnectAppShellSidebarItem {
  /** Unique key (string) of the secondary item's top-level navigation parent item */
  parentKey: KonnectPrimaryRouteKey
  items?: SidebarSecondaryItem[]
}
