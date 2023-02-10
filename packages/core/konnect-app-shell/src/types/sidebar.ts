import { KonnectPrimaryRouteKey } from './routes'
import type { SidebarPrimaryItem, SidebarSecondaryItem, SidebarProfileItem } from '@kong-ui-public/app-layout'

/**
 * The KonnectAppShell sidebar top-level navigation items
 */
export interface KonnectAppShellSidebarPrimaryItem extends SidebarPrimaryItem {
  /** The Konnect top-level navigation item key */
  key: KonnectPrimaryRouteKey
  /** Pass in the canUserAccess function with the associated krn parameters */
  isAuthorized?: () => Promise<boolean>
}

export interface KonnectAppShellSidebarItem {
  /** Unique key (string) of the secondary item's top-level navigation parent item */
  parentKey: KonnectPrimaryRouteKey
  /** The optional label to show under the primary navigation item's name when the item is expanded */
  label?: string
  /** The host app's secondary sidebar navigation items that should be injected into the top-level primary sidebar item with the corresponding `parentKey` */
  items?: SidebarSecondaryItem[]
}

// Export types from '@kong-ui-public/app-layout'
export type {
  SidebarPrimaryItem,
  SidebarSecondaryItem,
  SidebarProfileItem,
}
