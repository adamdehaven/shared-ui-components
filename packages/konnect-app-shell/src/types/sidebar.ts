import type { SidebarSecondaryItem } from '@kong-ui/app-layout'

export interface KonnectAppShellSidebarItem {
  /** Unique key (string) of the secondary item's top-level navigation parent item */
  parentKey: string
  items?: SidebarSecondaryItem[]
}
