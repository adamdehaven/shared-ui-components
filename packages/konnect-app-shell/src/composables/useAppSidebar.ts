import { ref, computed } from 'vue'
import { GLOBAL_GEO_PATH } from '../constants'
import composables from './'
import type { KonnectAppShellSidebarItem, KonnectAppShellSidebarPrimaryItem } from '../types'
import type { SidebarPrimaryItem, SidebarProfileItem } from '@kong-ui-public/app-layout'

export default function useAppSidebar() {
  const hostAppSidebarItem = ref<KonnectAppShellSidebarItem>()
  // activeGeo may be undefined at first, but everything in this function is reactive so they should update
  const { activeGeo } = composables.useGeo()
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
      to: `${activeGeoPath.value}overview/`,
      icon: 'sharedConfig',
    },
    {
      name: 'Runtime Manager',
      key: 'runtime-manager',
      to: `${activeGeoPath.value}runtime-manager/`,
      icon: 'runtimes',
    },
    {
      name: 'Mesh Manager',
      key: 'mesh-manager',
      to: `${activeGeoPath.value}mesh-manager/`,
      icon: 'brain',
    },
    {
      name: 'Service Hub',
      key: 'servicehub',
      to: `${activeGeoPath.value}servicehub/`,
      icon: 'serviceHub',
    },
    {
      name: 'Dev Portal',
      key: 'portal',
      to: `${activeGeoPath.value}portal/`,
      icon: 'devPortal',
    },
    {
      name: 'Analytics',
      key: 'analytics',
      to: `${activeGeoPath.value}analytics/`,
      icon: 'vitalsChart',
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
    },
    {
      name: 'Settings',
      key: 'settings',
      to: `${GLOBAL_GEO_PATH}settings/`,
      icon: 'cogwheel',
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
  const prepareSidebarPrimaryItems = (primaryItems: SidebarPrimaryItem[]): SidebarPrimaryItem[] => {
    if (!primaryItems || !primaryItems.length) {
      return []
    }

    if (!hostAppSidebarItem.value?.parentKey) {
      return primaryItems
    }

    return primaryItems.map((item: SidebarPrimaryItem) => {
      // Create a copy of the original for mutation
      // This is required to trigger reactivity
      const primaryItem: SidebarPrimaryItem = { ...item }

      // Treat all top-level nav items as external by default
      primaryItem.external = true

      // If the item.key equals the hostAppItem.parentKey
      if (primaryItem.key && primaryItem.key === hostAppSidebarItem.value?.parentKey) {
        // Since this link exists in the host app, set external to false so it renders a router-link instead
        primaryItem.external = false
        // Set active state
        primaryItem.active = true

        // If secondary sidebar items are present
        if (hostAppSidebarItem.value?.items?.length) {
          // Set the primary item label, if present
          primaryItem.label = hostAppSidebarItem.value?.label
          // Set secondary items
          primaryItem.items = hostAppSidebarItem.value?.items || []
          // Set expanded state
          primaryItem.expanded = true
        }
      } else {
        // Set active and expanded to false since the parentKey doesn't match
        primaryItem.active = false
        primaryItem.expanded = false
      }

      return primaryItem
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
