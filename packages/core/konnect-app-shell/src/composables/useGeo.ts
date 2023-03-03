import { ref, computed, readonly } from 'vue'
import composables from './'
import { KHCP_GEO_LOCAL_STORAGE_KEY } from '../constants'
import type { Geo } from '../types'
import { useWindow } from '@kong-ui/core'

// Initialize these ref(s) outside the function for persistence
const geos = ref<Geo[]>([])

export default function useGeo() {
  // This computed variable will NOT respect an active override
  const activeGeo = computed((): Geo | undefined => geos.value.find((geo: Geo) => geo.isActive === true) || undefined)
  // Must return null if no override is defined
  const activeGeoOverride = computed((): Geo | null => geos.value.find((geo: Geo) => geo.isActiveOverride === true) || null)

  // Generate a localStorage key based on the user's org and user id
  const geoLocalStorageKey = computed((): string => {
    // Warning: The session composable must be utilized inside a function within this file to prevent infinite import loop
    const { userOrgGeneratedUuid } = composables.useSession()
    return `${KHCP_GEO_LOCAL_STORAGE_KEY}-${userOrgGeneratedUuid.value}`
  })

  /**
   * Does the geo code exist in the available geos as well as in the organization's entitled geos
   * @param {string} code Two letter geo code string
   * @returns {boolean}
   */
  const geoExists = (code: string): boolean => !!geos.value.find((geo: Geo) => geo.code === code)

  /**
   * Get the active geo from the store, and pass { allowOverride: boolean } to either respect or ignore an override, if set
   * @param {boolean} allowOverride should the returned value respect an active override, if set
   * @returns {Geo} The currently active geo, based on the allowOverride param
   */
  const getActiveGeo = ({ allowOverride = false }: { allowOverride: boolean }): Geo | undefined => {
    if (allowOverride === true) {
      // Return active override if set, otherwise return active geo
      return activeGeoOverride.value || activeGeo.value
    }

    // allowOverride is false, so return the actual active geo
    return activeGeo.value
  }

  /**
   * Set the available geos
   * @param {string[]} geoCodes Array of two letter geo code strings
   */
  const setAllGeos = (geoCodes: string[] | readonly string[]): void => {
    if (typeof geoCodes === 'undefined') {
      return
    }

    const { i18n } = composables.useI18n()

    const geoOptions = geoCodes.map((geoCode: string) => {
      const code = geoCode.toLowerCase()
      // Warning: The session composable must be utilized inside a function within this file to prevent infinite import loop
      const { session } = composables.useSession()

      return {
        code,
        name: i18n.source.geo.available_geos[code],
        userCanSelect: session.data.user?.allowed_regions?.includes(code) || false,
        isActive: false,
        isActiveOverride: false,
      }
    })

    // save to store
    geos.value = geoOptions
  }

  /**
   * Set the active geo, or determine it based on the app environment if the code is not provided
   * @param {string} geoCode The two letter geo code
   */
  const setActiveGeo = (geoCode?: string): void => {
    const win = useWindow()

    try {
      // On app hydration this will be undefined and will init the active geo on load
      let newGeo = geoCode

      if (!newGeo) {
        // grab from path
        const pathArray = win.getLocationPathname()?.split('/')
        if (pathArray.length > 1 && geoExists(pathArray[1])) {
          newGeo = pathArray[1]
        }
      }

      if (!newGeo) {
        // grab from localStorage and see if still valid
        const localStorageGeo: string = localStorage.getItem(geoLocalStorageKey.value) || ''
        if (geoExists(localStorageGeo)) {
          newGeo = localStorageGeo
        }
      }

      // Still no newGeo. If the user only has permissions in one region, set it as active
      if (!newGeo && geos.value.filter((geo: Geo) => geo.userCanSelect).length === 1) {
        newGeo = geos.value.filter((geo: Geo) => geo.userCanSelect)[0].code
      }

      // If newGeo now has a value, store it in localStorage and the Vue store
      if (newGeo) {
        // save to ref
        geos.value.forEach((geo: Geo) => {
          geo.isActive = geo.code === newGeo
        })

        // Save to localStorage
        localStorage.setItem(geoLocalStorageKey.value, newGeo)
      }
    } catch (err) {
      // Failed setting the active geo, likely because no session.data?.user.id or session.data?.organization.id are set, which causes the `uuidv5` generation to fail
      // If the user is on the /login page, remove the query params and reload the page
      const currentPath = win.getLocationPathname()
      if (currentPath.includes('/login') && win.getLocationSearch().includes('loginSuccess')) {
        win.setLocationReplace(currentPath)
      } else {
        // Log to the console so DataDog will alert on the error
        console.error(err)
      }
    }
  }

  /**
   * Override the app's active geo for `global/` interfaces
   * @param {string | null} geoCode The two letter geo code to set for the override
   */
  const setActiveGeoOverride = (geoCode: string | null): void => {
    geos.value.forEach((geo: Geo) => {
      geo.isActiveOverride = !!geoCode && geo.code === geoCode
    })
  }

  // Unset the active geo in localStorage
  const unsetLocalStorageGeo = (): void => {
    localStorage.removeItem(geoLocalStorageKey.value)
  }

  return {
    geos: readonly(geos),
    activeGeo,
    activeGeoOverride,
    getActiveGeo,
    setAllGeos,
    setActiveGeo,
    setActiveGeoOverride,
    unsetLocalStorageGeo,
    geoLocalStorageKey,
  }
}
