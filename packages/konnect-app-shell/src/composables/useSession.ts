import { ref, computed, readonly } from 'vue'
import type { Ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import composables from './'
import { SESSION_NAME, CYPRESS_USER_SESSION_EXISTS } from '../constants'
import type { SessionData, Tier } from '../types'
import { useWindow } from '@kong-ui/core'

const session = ref<SessionData>()

export default function useSession() {
  const isRefreshing = ref<boolean>(false)
  const isLoggingOut = ref<boolean>(false)

  const { kAuthApi } = composables.useKAuthApi()
  const win = useWindow()

  const fetchSessionData = async (): Promise<{
    error: Ref<boolean>,
    forceAuthentication: Ref<boolean>,
  }> => {
    const forceAuthentication = ref<boolean>(false)
    const error = ref<boolean>(false)

    try {
      // Reset the error state
      error.value = false

      const [userMe, organizationMe, organizationEntitlements] = await Promise.all([
        await kAuthApi.value.users.userAPIRetrieveMe(),
        await kAuthApi.value.organization.organizationAPIRetrieveCurrentOrganization(),
        await kAuthApi.value.entitlement.entitlementAPIRetrieveCurrentEntitlement(),
      ])

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
          feature_set: userMe?.data?.feature_set || '',
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
            regions: organizationEntitlements?.data?.regions || [],
            tier: {
              name: (organizationEntitlements?.data?.tier?.name) as Tier || '',
              trial_expires_at: organizationEntitlements?.data?.tier?.trial_expires_at || null,
            },
          },
          created_at: organizationMe?.data?.created_at || '',
          updated_at: organizationMe?.data?.updated_at || '',
          // Helpers
          isEnterprise: organizationEntitlements?.data?.tier?.name === 'enterprise',
          isPlus: organizationEntitlements?.data?.tier?.name === 'plus',
          // Fallback to free tier if no tier can be determined
          isFree: organizationEntitlements?.data?.tier?.name === 'free' || (organizationEntitlements?.data?.tier?.name !== 'enterprise' && organizationEntitlements?.data?.tier?.name !== 'plus'),
        },
      }

      // Ensure to combine with existing data
      session.value = { ...(session.value || {}), ...userSessionData }

      await saveSessionData(session.value)

      // Initialize DataDog with the actual user id
      globalThis.DD_RUM && globalThis.DD_RUM.onReady(() => {
        globalThis.DD_RUM.setUser({
          id: session.value?.user?.id,
          orgId: session.value?.organization?.id,
        })
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
      const sessionDataRaw = localStorage?.getItem(SESSION_NAME) || encode(session.value) || encode({})

      if (!sessionDataRaw) {
        return session.value
      }

      session.value = decode(sessionDataRaw)

      return session.value
    } catch (_) {
      console.error('Failed to validate session')
      saveSessionData()
    }
  }

  /**
   * Save the session data to localStorage
   * @param {SessionData} data The session data
   * @param {boolean} force Force overwriting the stored object
   */
  const saveSessionData = async (data: SessionData = {}, force = true) => {
    session.value = { ...data }

    // only set the session to local if specifying to force save,
    // or if the session doesn't exist and force is false.
    if (force || (!force && !exists.value)) {
      if (objectIsEmpty(session.value)) {
        localStorage?.removeItem(SESSION_NAME)
      } else {
        localStorage?.setItem(SESSION_NAME, encode(session.value))
      }
    }
  }

  /**
   * Attempt to refresh the auth cookie
   * @returns {boolean} Returns false if refresh was successful.
   */
  const refresh = async (): Promise<boolean> => {
    try {
      // Trigger auth refresh
      const response = await kAuthApi.value.authentication.refresh({})

      if (response?.status === 200) {
        // refresh data
        await saveSessionData(await fetchLocalStorageData())

        // Successful refresh, session did not expire
        return false
      } else {
        // Fallback to failure
        return true
      }
    } catch (err) {
      return true
    }
  }

  const getCookieValue = (name: string): string => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || ''

  const exists = computed((): boolean => {
    // Return true if the session.value.data.user.id has a value
    // We also return true here for a cookie value so that Cypress tests do not automatically get logged out. This should never be set for an actual user.
    let userShouldHaveSession = false

    try {
      // Get URL search params
      const urlSearchParams = window && (new URL(window.location.href)).searchParams

      userShouldHaveSession = urlSearchParams.get('loginSuccess') === 'true'
    } catch (_) {
      // Fallback to session.value?.user?.id exists
      userShouldHaveSession = !!session.value?.user?.id
    }

    return !!session.value?.user?.id || userShouldHaveSession === true || !!getCookieValue(CYPRESS_USER_SESSION_EXISTS)
  })

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

    // Store the 'to' route if not login or logout or undefined
    const toRoute: { path: string, name?: string, [key: string]: any } = {
      path: '',
      name: '',
    }

    if (typeof loginRedirect === 'string') {
      toRoute.path = loginRedirect && !loginRedirect?.includes('login') && !loginRedirect?.includes('logout') && !loginRedirect?.includes('undefined') ? (loginRedirect || '') : ''
    } else {
      toRoute.path = (loginRedirect && !['login', 'logout'].includes(String(loginRedirect?.name || '')) && !loginRedirect?.path?.includes('/undefined') ? loginRedirect.path : '')
    }

    try {
      if (!toRoute?.path) {
        session.value = undefined
        localStorage?.removeItem(SESSION_NAME)
      } else {
        saveSessionData({ to: toRoute }, true)
      }

      const { data: { loginPath } } = await kAuthApi.value.authentication.logout()

      // Get the login path with IdP loginPath if configured, otherwise just the login path
      const loginPagePath = loginPath ? `login/${loginPath}` : 'login'

      // Clear session cookie
      document.cookie = `${CYPRESS_USER_SESSION_EXISTS}=; Max-Age=-1`

      // Otherwise, build a new URL from the root
      const logoutUrl = new URL(`${window.location.origin}/${loginPagePath}`)

      // Add a `logout=true` parameter so the login element will not initialize login
      logoutUrl.searchParams.append('logout', 'true')

      // Redirect user to logout
      win.setLocationAssign(logoutUrl.href)
    } catch (err) {
      // Always clear the session data
      session.value = undefined
      localStorage?.removeItem(SESSION_NAME)
      document.cookie = `${CYPRESS_USER_SESSION_EXISTS}=; Max-Age=-1`

      // Redirect user to logout
      win.setLocationAssign(`${window.location.origin}/login?logout=true`)
    } finally {
      isLoggingOut.value = false
    }
  }

  /**
   * Attempt to nitialize the session from localStorage. Should only be called once in the KonnectAppShell onBeforeMount hook.
   */
  const initializeSession = async (): Promise<{ error: Ref<boolean>, forceAuthentication: Ref<boolean> }> => {
    // Fetch session data from localStorage
    await saveSessionData(await fetchLocalStorageData())

    // Attempt to fetch the session data from the server
    const { forceAuthentication, error } = await fetchSessionData()

    return {
      error,
      forceAuthentication,
    }
  }

  return {
    session: readonly(session), // do not allow mutating the session
    isRefreshing,
    // methods
    initializeSession,
    exists,
    refresh,
    destroy,
  }
}
