import { ref, computed, inject, ComputedRef } from 'vue'
import { GLOBAL_GEO_PATH } from '../constants'
import { KonnectAppShellSidebarItem, SidebarPrimaryItemKeys, Geo } from '../types'
import symbolInjectionKeys from '../symbol-injection-keys'
import type { SidebarPrimaryItem, SidebarProfileItem } from '@kong-ui/app-layout'

export default function useAppSidebar() {
  const hostAppSidebarItem = ref<KonnectAppShellSidebarItem>()
  const { konnectAppShellActiveGeo } = symbolInjectionKeys
  // Get the activeGeo; always fallback to 'us`
  const activeGeo: ComputedRef<Geo> = inject(konnectAppShellActiveGeo, computed((): Geo => ({
    code: 'us',
    name: 'US (North America)', // TODO: should come from i18n
    userCanSelect: true,
    isActive: true,
    isActiveOverride: false,
  })))

  const activeGeoPath = computed((): string => `/${activeGeo.value.code}/`)

  /**
   * All top-level items must:
   * - utilize a value from the `SidebarPrimaryItemKeys` enum for the `key` property
   * - set `external` to true
   * - define the `to` property as a string with a trailing slash
   * - -- Example: `${activeGeoPath.value}runtime-manager/`
   */
  const sidebarTopPrimaryItems = computed((): SidebarPrimaryItem[] => ([
    {
      name: 'Overview',
      key: SidebarPrimaryItemKeys.OVERVIEW,
      to: `${activeGeoPath.value}`, // No trailing slash since this is the root route
      icon: 'sharedConfig',
      external: true,
    },
    {
      name: 'Runtime Manager',
      key: SidebarPrimaryItemKeys.RUNTIME_MANAGER,
      to: `${activeGeoPath.value}runtime-manager/`,
      icon: 'runtimes',
      external: true,
    },
    {
      name: 'Mesh Manager',
      key: SidebarPrimaryItemKeys.MESH_MANAGER,
      to: `${activeGeoPath.value}mesh-manager/`,
      icon: 'brain',
      external: true,
    },
    {
      name: 'Service Hub',
      key: SidebarPrimaryItemKeys.SERVICE_HUB,
      to: `${activeGeoPath.value}servicehub/`,
      icon: 'serviceHub',
      external: true,
    },
    {
      name: 'Dev Portal',
      key: SidebarPrimaryItemKeys.DEV_PORTAL,
      to: `${activeGeoPath.value}portal/`,
      icon: 'devPortal',
      external: true,
    },
    {
      name: 'Analytics',
      key: SidebarPrimaryItemKeys.ANALYTICS,
      to: `${activeGeoPath.value}analytics/`,
      icon: 'vitalsChart',
      external: true,
    },
  ]))

  /**
   * All top-level items must:
   * - utilize a value from the `SidebarPrimaryItemKeys` enum for the `key` property
   * - set `external` to true
   * - define the `to` property as a string with a trailing slash
   * - -- Example: `${GLOBAL_GEO_PATH.value}organization/`
   */
  const sidebarBottomPrimaryItems = computed((): SidebarPrimaryItem[] => ([
    {
      name: 'Organization',
      key: SidebarPrimaryItemKeys.ORGANIZATION,
      to: `${GLOBAL_GEO_PATH}organization/`,
      icon: 'organizations',
      external: true,
    },
    {
      name: 'Settings',
      key: SidebarPrimaryItemKeys.SETTINGS,
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
