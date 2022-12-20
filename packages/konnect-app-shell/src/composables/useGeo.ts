import { ref, computed } from 'vue'
import { Geo, KHCP_GEO_LOCAL_STORAGE_KEY } from '../types'
import { createI18n, useWindow } from '@kong-ui/core'
import english from '../locales/en.json'
// import { v5 as uuidv5 } from 'uuid'

// Define the `geos` ref outside of the composable so that they persist across `useGeo` imports
const geos = ref<Geo[]>([])

export default function useGeo() {
  // Must return null if no override is defined
  const activeGeoOverride = computed((): Geo | null => geos.value.find((geo: Geo) => geo.isActiveOverride === true) || null)

  // Generate a localStorage key based on the user's org and user id
  const geoLocalStorageKey = computed((): string => {
    // TODO: Integrate with the active user session data
    // const sessionStore = useSessionStore()
    // const { orgId, userId } = storeToRefs(sessionStore)

    // return `${KHCP_GEO_LOCAL_STORAGE_KEY}-${uuidv5(orgId.value, userId.value)}`

    return KHCP_GEO_LOCAL_STORAGE_KEY
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
    // First, determine the regularly active geo
    const activeGeo = geos.value.find((geo: Geo) => geo.isActive === true)

    if (allowOverride === true) {
      // Return active override if set, otherwise return active geo
      return activeGeoOverride.value || activeGeo
    }

    // allowOverride is false, so return the actual active geo
    return activeGeo
  }

  /**
   * Set the available geos
   * @param {string[]} geoCodes Array of two letter geo code strings
   */
  const setAllGeos = (geoCodes: string[]): void => {
    if (typeof geoCodes === 'undefined') {
      return
    }

    const i18n = createI18n('en-us', english)

    const geoOptions = geoCodes.map((geoCode: string) => {
      return {
        code: geoCode.toLowerCase(),
        name: i18n.source.geo.available_geos[geoCode],
        userCanSelect: true,
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
      let activeGeo = geoCode

      if (!activeGeo) {
        // grab from path
        const pathArray = win.getLocationPathname()?.split('/')
        if (pathArray.length > 1 && geoExists(pathArray[1])) {
          activeGeo = pathArray[1]
        }
      }

      if (!activeGeo) {
        // grab from localStorage and see if still valid
        const localStorageGeo: string = localStorage.getItem(geoLocalStorageKey.value) || ''
        if (geoExists(localStorageGeo)) {
          activeGeo = localStorageGeo
        }
      }

      // Still no activeGeo. If the organization entitlements only have one region, set it as active
      if (!activeGeo && geos.value.length === 1) {
        activeGeo = geos.value[0].code
      }

      // If activeGeo now has a value, store it in localStorage and the Vue store
      if (activeGeo) {
        // save to ref
        geos.value.forEach((geo: Geo) => {
          geo.isActive = geo.code === activeGeo
        })

        // Save to localStorage
        localStorage.setItem(geoLocalStorageKey.value, activeGeo)
      }
    } catch (err) {
      // Failed setting the active geo, likely because no session.data.user.id or session.data.organization.id are set, which causes the `uuidv5` generation to fail
      // If the user is on the /login page, remove the query params and reload the page
      const currentPath = win.getLocationPathname()
      if (currentPath.includes('/login') && win.getLocationSearch().includes('loginSuccess')) {
        win.setLocationHref(currentPath)
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

  return {
    geos,
    getActiveGeo,
    activeGeoOverride,
    setAllGeos,
    setActiveGeo,
    setActiveGeoOverride,
  }
}