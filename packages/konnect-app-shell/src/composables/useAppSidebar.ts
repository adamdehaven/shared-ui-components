import { ref, computed } from 'vue'
import { GLOBAL_GEO_PATH } from '../constants'
import useGeo from './useGeo'
import { KonnectAppShellSidebarItem, KonnectAppShellSidebarPrimaryItem } from '../types'
import type { SidebarPrimaryItem, SidebarProfileItem } from '@kong-ui/app-layout'

export default function useAppSidebar() {
  const hostAppSidebarItem = ref<KonnectAppShellSidebarItem>()
  // activeGeo may be undefined at first, but everything in this function is reactive so they should update
  const { activeGeo } = useGeo()
  // Default to a leading-slash so the KonnectAppShell will redirect accordingly as a fallback
  const activeGeoPath = computed((): string => activeGeo.value ? `/${activeGeo.value.code}/` : '/')

  /**
   * All top-level items must:
   * - utilize a value from the `KonnectPrimaryRouteKey` interface for the `key` property
   * - set `external` to true
   * - define the `to` property as a string with a trailing slash
   * - -- Example: `${activeGeoPath.value}runtime-manager/`
   */
  const sidebarTopPrimaryItems = computed((): KonnectAppShellSidebarPrimaryItem[] => ([
    {
      name: 'Overview',
      key: 'overview',
      to: `${activeGeoPath.value}overview/`, // No trailing slash since this is the root route
      icon: 'sharedConfig',
      external: true,
    },
    {
      name: 'Runtime Manager',
      key: 'runtime-manager',
      to: `${activeGeoPath.value}runtime-manager/`,
      icon: 'runtimes',
      external: true,
    },
    {
      name: 'Mesh Manager',
      key: 'mesh-manager',
      to: `${activeGeoPath.value}mesh-manager/`,
      icon: 'brain',
      external: true,
    },
    {
      name: 'Service Hub',
      key: 'servicehub',
      to: `${activeGeoPath.value}servicehub/`,
      icon: 'serviceHub',
      external: true,
    },
    {
      name: 'Dev Portal',
      key: 'portal',
      to: `${activeGeoPath.value}portal/`,
      icon: 'devPortal',
      external: true,
    },
    {
      name: 'Analytics',
      key: 'analytics',
      to: `${activeGeoPath.value}analytics/`,
      icon: 'vitalsChart',
      external: true,
    },
  ]))

  /**
   * All top-level items must:
   * - utilize a value from the `KonnectPrimaryRouteKey` interface for the `key` property
   * - set `external` to true
   * - define the `to` property as a string with a trailing slash
   * - -- Example: `${GLOBAL_GEO_PATH.value}organization/`
   */
  const sidebarBottomPrimaryItems = computed((): KonnectAppShellSidebarPrimaryItem[] => ([
    {
      name: 'Organization',
      key: 'organization',
      to: `${GLOBAL_GEO_PATH}organization/`,
      icon: 'organizations',
      external: true,
    },
    {
      name: 'Settings',
      key: 'settings',
      to: `${GLOBAL_GEO_PATH}settings/`,
      icon: 'cogwheel',
      external: true,
    },
  ]))

  /**
   * All profile items must:
   * - set `external` to true
   * - define the `to` property as a string with a trailing slash
   * - -- Example: `${GLOBAL_GEO_PATH.value}organization/`
   */
  const sidebarProfileItems = computed((): SidebarProfileItem[] => ([
    {
      name: 'Personal access tokens',
      to: `${GLOBAL_GEO_PATH}tokens`,
      external: true,
    },
    {
      name: 'Logout',
      to: '/logout', // No global path needed
      hasDivider: true,
      external: true,
    },
  ]))

  // Keep the local variable in-sync with the KonnectAppShell prop(s)
  const update = (items: KonnectAppShellSidebarItem): void => {
    hostAppSidebarItem.value = items
  }

  /**
   * Modify the sidebar items based on the parentKey and child items
   * @param {SidebarPrimaryItem[]} items The sidebar items
   * @returns {SidebarPrimaryItem[]}
   */
  const prepareSidebarPrimaryItems = (items: SidebarPrimaryItem[]): SidebarPrimaryItem[] => {
    if (!items || !items.length) {
      return []
    }

    if (!hostAppSidebarItem.value || !hostAppSidebarItem.value.parentKey) {
      return items
    }

    return items.map((item: SidebarPrimaryItem) => {
      // Treat all top-level nav items as external
      item.external = true

      // If the item.key equals the hostAppSidebarItem.value.parentKey
      if (item.key && item.key === hostAppSidebarItem.value?.parentKey) {
        // Set active state
        item.active = true

        // If secondary sidebar items are present
        if (hostAppSidebarItem.value.items?.length) {
          // Set secondary items
          item.items = hostAppSidebarItem.value.items
          // Set expanded state
          item.expanded = true
        }
      } else {
        // Set active and expanded to false since the parentKey doesn't match
        item.active = false
        item.expanded = false
      }

      return item
    })
  }

  // Sidebar items must be exported as computed properties to keep them reactive
  const topItems = computed((): SidebarPrimaryItem[] => {
    return prepareSidebarPrimaryItems(sidebarTopPrimaryItems.value)
  })
  const bottomItems = computed((): SidebarPrimaryItem[] => {
    return prepareSidebarPrimaryItems(sidebarBottomPrimaryItems.value)
  })
  const profileItems = computed((): SidebarProfileItem[] => {
    return sidebarProfileItems.value
  })

  return {
    topItems,
    bottomItems,
    profileItems,
    update,
  }
}
