import { ref, reactive, computed, watch, readonly } from 'vue'
import type { Ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import composables from './'
import { SESSION_LOCAL_STORAGE_KEY, SESSION_USER_LOCAL_STORAGE_KEY, CYPRESS_USER_SESSION_EXISTS, HEADER_KONNECT_ACTING_AS, HEADER_KONNECT_FEATURE_SET } from '../constants'
import type { Session, SessionData, Tier } from '../types'
import { useWindow } from '@kong-ui/core'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { datadogRum } from '@datadog/browser-rum'

// Initialize these ref(s) outside the function for persistence
const session = reactive<Session>({
  data: {},
  exists: false,
  refresh: async (): Promise<boolean> => false,
  destroy: async (): Promise<void> => undefined,
})
const initialPermissionsFetched = ref<boolean>(false)

export default function useSession() {
  const isRefreshing = ref<boolean>(false)
  const isLoggingOut = ref<boolean>(false)
  const win = useWindow()
  const { activeGeo } = composables.useGeo()

  /**
   * Generate a v5 UUID comprised of the orgId and userId
   */
  const userOrgGeneratedUuid = computed((): string => {
    if (session.data.organization?.id && session.data.user?.id) {
      return uuidv5(session.data.organization?.id, session.data.user?.id)
    }

    return uuidv5(uuidv4(), uuidv4())
  })

  /**
   * If the SESSION_USER_LOCAL_STORAGE_KEY localStorage value changes, refresh all browser tabs
   * @param {StorageEvent} event window storage event
   * @param {string} localStorageKey The local storage key to check
   */
  const refreshOnUserChange = (event: StorageEvent, localStorageKey: string = SESSION_USER_LOCAL_STORAGE_KEY): void => {
    // If not a localStorage event, exit
    if (event?.storageArea !== localStorage) {
      return
    }

    // Only trigger for our desired key
    if (event.key === localStorageKey) {
      // If the value changes, refresh the page
      if (event.oldValue !== event.newValue) {
        window?.location?.reload()
      }
    }
  }

  const fetchSessionData = async (): Promise<{
    error: Ref<boolean>,
    forceAuthentication: Ref<boolean>,
  }> => {
    const forceAuthentication = ref<boolean>(false)
    const error = ref<boolean>(false)

    try {
      // Reset the error state
      error.value = false

      const { kAuthApi } = composables.useKAuthApi()
      const [userMe, organizationMe, organizationEntitlements, userPermissions] = await Promise.all([
        await kAuthApi.value.v2.me.getUsersMe(),
        await kAuthApi.value.organization.organizationAPIRetrieveCurrentOrganization(),
        await kAuthApi.value.entitlement.entitlementAPIRetrieveCurrentEntitlement(),
        // Fetch the top_level permissions for this user for ALL regions
        await kAuthApi.value.me.meAPIRetrievePermissions('', '', true, [], ''),
      ])

      const userTopLevelPermissions = userPermissions?.data?.data || []
      const orgEntitledRegions = organizationEntitlements?.data?.regions || []

      const userRegionsWithPermissions = new Set<string>()

      const { parseKrn, userHasNoPermissions } = composables.usePermissions()

      // Check if the user has permissions in each entitled region
      if (userTopLevelPermissions.length && orgEntitledRegions.length) {
        // Loop through all top-level permissions
        for (const krn of userTopLevelPermissions) {
          // If all entitled regions have been added, exit
          if (userRegionsWithPermissions.size === orgEntitledRegions.length) {
            break
          }

          const krnRegion = krn.resource ? parseKrn(krn.resource).region : undefined

          // If the krnRegion is undefined, skip it
          if (!krnRegion) {
            continue
          }

          // If the user has wildcard `*` permissions for any region, automatically add all regions to the array and exit
          if (krnRegion === '*') {
            for (const region of orgEntitledRegions) {
              userRegionsWithPermissions.add(region)
            }

            // Exit early
            break
          }

          for (const region of orgEntitledRegions) {
            if (krnRegion === region && !userRegionsWithPermissions.has(region)) {
              userRegionsWithPermissions.add(region)
              continue
            }
          }
        }
      } else if (!userTopLevelPermissions.length) {
        userHasNoPermissions.value = true
      }

      // User id and Org id are required, so error if they are missing
      if (!userMe?.data?.id || !organizationMe?.data?.id) {
        throw new Error('Could not fetch session data')
      }

      const userSessionData: SessionData = {
        user: {
          id: userMe?.data?.id || '',
          email: userMe?.data?.email || '',
          full_name: userMe?.data?.full_name || '',
          preferred_name: userMe?.data?.preferred_name || '',
          is_owner: (!!userMe?.data?.id && (userMe?.data?.id === organizationMe?.data?.owner_id)) || false,
          active: userMe?.data?.active || false,
          feature_set: userMe?.headers && userMe?.headers[HEADER_KONNECT_FEATURE_SET] !== undefined ? userMe.headers[HEADER_KONNECT_FEATURE_SET] : '',
          allowed_regions: [...userRegionsWithPermissions],
          created_at: userMe?.data?.created_at || '',
          updated_at: userMe?.data?.updated_at || '',
        },
        organization: {
          id: organizationMe?.data?.id || '',
          name: organizationMe?.data?.name || '',
          billing_email: organizationMe?.data?.billing_email || '',
          owner_id: organizationMe?.data?.owner_id || '',
          entitlements: {
            runtime_group_limit: organizationEntitlements?.data?.runtime_group_limit || 0,
            regions: orgEntitledRegions,
            tier: {
              name: (organizationEntitlements?.data?.tier?.name) as Tier || '',
              trial_expires_at: organizationEntitlements?.data?.tier?.trial_expires_at || null,
            },
          },
          login_path: organizationMe?.data?.login_path || '',
          created_at: organizationMe?.data?.created_at || '',
          updated_at: organizationMe?.data?.updated_at || '',
          // Helpers
          isEnterprise: organizationEntitlements?.data?.tier?.name === 'enterprise',
          isPlus: organizationEntitlements?.data?.tier?.name === 'plus',
          // Fallback to free tier if no tier can be determined
          isFree: organizationEntitlements?.data?.tier?.name === 'free' || (organizationEntitlements?.data?.tier?.name !== 'enterprise' && organizationEntitlements?.data?.tier?.name !== 'plus'),
          isInTrial: Boolean(organizationEntitlements?.data?.tier?.trial_expires_at),
        },
        // Set the impersonation state from the response header, fallback to false
        konnectActAs: userMe?.headers && userMe?.headers[HEADER_KONNECT_ACTING_AS] !== undefined ? userMe.headers[HEADER_KONNECT_ACTING_AS] === 'true' : false,
      }

      // Ensure to combine with existing data
      session.data = { ...(session.data || {}), ...userSessionData }

      // Store the session data
      await saveSessionData(session.data)

      // Store the generated UUID to localStorage
      localStorage?.setItem(SESSION_USER_LOCAL_STORAGE_KEY, userOrgGeneratedUuid.value)
      // Refresh the page if the localStorage object is changed in another tab
      window?.removeEventListener('storage', (event: StorageEvent) => refreshOnUserChange(event, SESSION_USER_LOCAL_STORAGE_KEY))
      window?.addEventListener('storage', (event: StorageEvent) => refreshOnUserChange(event, SESSION_USER_LOCAL_STORAGE_KEY))

      // Initialize DataDog with the actual user id
      datadogRum.setUser({
        id: session.data?.user?.id,
        orgId: session.data?.organization?.id,
        featureSet: session.data?.user?.feature_set,
      })

      // Init Launch Darkly with session user before calling segment
      const { initialize: initLaunchDarkly } = composables.useLaunchDarkly()
      await initLaunchDarkly()

      return {
        error: readonly(error),
        forceAuthentication: readonly(forceAuthentication),
      }
    } catch (err: any) {
      /**
       * Super Important: you MUST destroy the session on fail.
       *
       * The application must call this `fetchSessionData` method before any error/refresh
       * interceptors are bound to the API client in order to retrieve the Konnect regions
       * enabled for the organization, meaning if it fails, it has to be handled here.
       */
      // TODO: Ensure you only want to destroy if 401 error
      if ([401, 403].includes(err.response?.status)) {
        // log for debugging
        console.warn('fetchSessionData', err)
        forceAuthentication.value = true
        await destroy(win.getLocationPathname())
      } else {
        error.value = true
        console.error(err)
      }

      return {
        error: readonly(error),
        forceAuthentication: readonly(forceAuthentication),
      }
    }
  }

  // Automatically fetch the user's permissions once the activeGeo has been determined
  // Fetching here avoids some content delay when rendering the sidebar
  watch(() => activeGeo.value?.code, async (geoCode) => {
    // Only perform the fetch once
    if (!initialPermissionsFetched.value && geoCode) {
      // Set the persistent ref to true to prevent subsequent fetches
      initialPermissionsFetched.value = true

      // Fetch the initial permissions in order to evaluate the sidebar items
      const { fetchUserPermissions } = composables.usePermissions()

      await fetchUserPermissions(false, geoCode)
    }
  })

  /**
   * Is the provided object undefined or empty?
   * @param obj JavaScript Object
   * @returns {boolean} True if the object is undefined or an empty object `{}`
   */
  const objectIsEmpty = (obj: any): boolean => (!obj || (Object.keys(obj).length === 0 && obj.constructor === Object))

  /**
   * Encode an object for localStorage
   * @param {SessionData} data The data object to encode
   * @returns {string} Encoded JSON string
   */
  const encode = (data?: SessionData): string => {
    try {
      if (objectIsEmpty(data)) {
        return ''
      }

      return btoa(encodeURIComponent(JSON.stringify(data)))
    } catch (e) {
      if (data?.user) {
        // this means session invalided
        // do not console any error.
        return ''
      }

      console.error('Failed to encode session')
    }

    return ''
  }

  /**
   * Decode a localStorage object
   * @param {string} encodedJson localStorage encoded JSON to decode
   * @returns {string} Decoded object
   */
  const decode = <T>(encodedJson: string): T | {} => {
    return JSON.parse(decodeURIComponent(atob(encodedJson)))
  }

  /**
   * Attempt to fetch the session data from localStorage
   * @return {(Promise<SessionData | undefined>)} Stored session data
   */
  const fetchLocalStorageData = async (): Promise<SessionData | undefined> => {
    try {
      const sessionDataRaw = localStorage?.getItem(SESSION_LOCAL_STORAGE_KEY) || encode(session.data) || encode({})

      if (!sessionDataRaw) {
        return session.data
      }

      session.data = decode(sessionDataRaw)

      return session.data
    } catch (_) {
      saveSessionData()
    }
  }

  /**
   * Save the session data to localStorage
   * @param {SessionData} data The session data
   * @param {boolean} force Force overwriting the stored object
   */
  const saveSessionData = async (data: SessionData = {}, force = true) => {
    session.data = { ...data }

    // only set the session to local if specifying to force save,
    // or if the session doesn't exist and force is false.
    if (force || (!force && !exists.value)) {
      if (objectIsEmpty(session.data)) {
        localStorage?.removeItem(SESSION_LOCAL_STORAGE_KEY)
      } else {
        localStorage?.setItem(SESSION_LOCAL_STORAGE_KEY, encode(session.data))
      }
    }
  }

  /**
   * Attempt to refresh the auth cookie
   * @returns {boolean} Returns true if refresh was successful.
   */
  const refresh = async (): Promise<boolean> => {
    try {
      const { kAuthApi } = composables.useKAuthApi()
      // Trigger auth refresh
      const response = await kAuthApi.value.authentication.refresh({})

      if (response?.status === 200) {
        // refresh data
        await saveSessionData(await fetchLocalStorageData())

        // Successful refresh, session did not expire
        return true
      } else {
        // Fallback to failure
        return false
      }
    } catch (err) {
      return false
    }
  }

  const getCookieValue = (name: string): string => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || ''

  /**
   * Is there an existing user session?
   * @return {boolean}
   */
  const exists = computed((): boolean => {
    // Return true if the session.data?.user.id has a value
    // We also return true here for a cookie value so that Cypress tests do not automatically get logged out. This should never be set for an actual user.
    let userShouldHaveSession = false

    try {
      // Get URL search params
      const urlSearchParams = window && (new URL(window.location.href)).searchParams

      userShouldHaveSession = urlSearchParams.get('loginSuccess') === 'true'
    } catch (_) {
      // Fallback to session.data?.user?.id exists
      userShouldHaveSession = !!session.data?.user?.id
    }

    return !!session.data?.user?.id || userShouldHaveSession === true || !!getCookieValue(CYPRESS_USER_SESSION_EXISTS)
  })

  // Bind the exists value to the session and update whenver it changes
  watch(exists, () => (session.exists = exists.value), { immediate: true })

  /**
   * Destroy the user's session and log them out via KAuth
   * @param {string} loginRedirect The path to redirect the user to upon logging back in
   * @return {Promise<void>}
   */
  const destroy = async (loginRedirect?: RouteLocationNormalized | string): Promise<void> => {
    if (isLoggingOut.value) {
      return
    }

    isLoggingOut.value = true

    // Grab the login_path before clearing the session data
    const storedLoginPath = session.data.organization?.login_path || ''

    const toRoute: { path: string, name?: string, [key: string]: any } = {
      path: '',
      name: '',
    }

    // Store the 'to' route if not login or logout or undefined
    if (typeof loginRedirect === 'string') {
      toRoute.path = loginRedirect && !loginRedirect?.includes('login') && !loginRedirect?.includes('logout') && !loginRedirect?.includes('undefined') ? (loginRedirect || '') : ''
    } else {
      toRoute.path = (loginRedirect && !['login', 'logout'].includes(String(loginRedirect?.name || '')) && !loginRedirect?.path?.includes('/undefined') ? loginRedirect.path : '')
    }

    try {
      // Remove the generated user session UUID from localStorage
      localStorage?.removeItem(SESSION_USER_LOCAL_STORAGE_KEY)
      // Remove the session event listener
      window?.removeEventListener('storage', (event: StorageEvent) => refreshOnUserChange(event, SESSION_USER_LOCAL_STORAGE_KEY))

      const { kAuthApi } = composables.useKAuthApi()

      // Log out the user
      const { data: { loginPath } } = await kAuthApi.value.authentication.logout() || { data: { loginPath: '' } }

      // Try using the loginPath from the response; otherwise, fallback to the stored organization login_path
      const organizationLoginPath: string = loginPath || storedLoginPath

      // Get the login path with IdP loginPath if configured, otherwise just the login path
      // (WITH leading slash)
      const loginPagePath = organizationLoginPath ? `/login/${organizationLoginPath}` : '/login'

      if (!toRoute?.path) {
        session.data = {}
        localStorage?.removeItem(SESSION_LOCAL_STORAGE_KEY)
      } else {
        saveSessionData({ to: toRoute }, true)
      }

      // Clear session cookie
      document.cookie = `${CYPRESS_USER_SESSION_EXISTS}=; Max-Age=-1`

      // Otherwise, build a new URL from the root and the loginPagePath
      const logoutUrl = new URL(`${window.location.origin}${loginPagePath}`)

      // Add a `?logout=true` query parameter so the login element will not auto-initialize IdP login
      logoutUrl.searchParams.append('logout', 'true')

      // Redirect user to logout
      win.setLocationAssign(logoutUrl.href)
    } catch (err) {
      console.error(err)
      // Always clear the session data
      session.data = {}
      localStorage?.removeItem(SESSION_LOCAL_STORAGE_KEY)
      localStorage?.removeItem(SESSION_USER_LOCAL_STORAGE_KEY)
      document.cookie = `${CYPRESS_USER_SESSION_EXISTS}=; Max-Age=-1`

      // Redirect user to logout
      win.setLocationAssign(`${window.location.origin}/login?logout=true`)
    } finally {
      isLoggingOut.value = false
    }
  }

  /**
   * Attempt to initialize the session from localStorage and init helper functions.
   * Should only be called once in the KonnectAppShell onBeforeMount hook.
   * This method is required and must be called before using any other session methods.
   */
  const initializeSession = async (): Promise<{ error: Ref<boolean>, forceAuthentication: Ref<boolean> }> => {
    // Fetch session data from localStorage
    await saveSessionData(await fetchLocalStorageData())

    // Bind the refresh function
    session.refresh = refresh

    // Bind the destroy function
    session.destroy = destroy

    // Attempt to fetch the session data from the server
    const { forceAuthentication, error } = await fetchSessionData()

    return {
      error,
      forceAuthentication,
    }
  }

  return {
    session: readonly(session), // do not allow mutating the session
    userOrgGeneratedUuid,
    isRefreshing,
    // methods
    initializeSession,
  }
}
