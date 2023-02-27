import { describe, it, expect, vi, afterEach, beforeAll, SpyInstance } from 'vitest'
import composables from '../index'
import { SESSION_LOCAL_STORAGE_KEY, SESSION_USER_LOCAL_STORAGE_KEY } from '../../constants'
import { SessionData } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import { AxiosResponse } from 'axios'

const userId = uuidv4()
const orgId = uuidv4()
const orgTier = 'enterprise'

describe('useSession', async () => {
  const { session, initializeSession, userOrgGeneratedUuid } = composables.useSession()
  const { kAuthApi } = composables.useKAuthApi()
  const windowLocationSpy: SpyInstance<[], Partial<Location>> = vi.spyOn(window, 'location', 'get')

  beforeAll(() => {
    const { config } = composables.useAppConfig()
    const configSpy = vi.spyOn(config, 'value', 'get')
    configSpy.mockReturnValue({
      env: 'production',
      api: {
        v1: {
          konnect: '/konnect-api',
          kauth: '/kauth',
        },
        v2: {
          global: '',
          geo: '',
        },
      },
      launchDarkly: {
        key: '',
        platform_id: '',
      },
    })

    vi.spyOn(kAuthApi, 'value', 'get').mockReturnValue({
      // @ts-ignore
      organization: {
        organizationAPIRetrieveCurrentOrganization: () => new Promise((resolve) => resolve({
          data: {
            id: orgId,
            name: 'Unit Test Organization',
            billing_email: 'billing@example.com',
            owner_id: '',
            created_at: '',
            updated_at: '',
          },
        } as AxiosResponse)),
      },
      // @ts-ignore
      entitlement: {
        entitlementAPIRetrieveCurrentEntitlement: () => new Promise((resolve) => resolve({
          data: {
            runtime_group_limit: 3,
            regions: ['us'],
            tier: {
              name: orgTier,
              trial_expires_at: '',
            },
          },
        } as AxiosResponse)),
      },
      // @ts-ignore
      authentication: {
        logout: () => new Promise((resolve) => resolve({
          data: {
            loginPath: '',
          },
        } as AxiosResponse)),
        refresh: () => new Promise((resolve) => resolve({
          data: {},
        } as AxiosResponse)),
      },
      // @ts-ignore
      me: {
        meAPIRetrievePermissions: () => new Promise((resolve) => resolve({
          data: [],
        } as AxiosResponse)),
      },
      v2: {
        // @ts-ignore
        me: {
          getUsersMe: () => new Promise((resolve) => resolve({
            data: {
              id: userId,
              email: 'user@example.com',
              full_name: 'Ready Player One',
              active: true,
              created_at: '',
              preferred_name: 'Player1',
            },
          } as AxiosResponse)),
        },
      },
    })

    // Mock any redirects redirect
    windowLocationSpy.mockReturnValue({
      assign: () => vi.fn(),
    })
  })

  afterEach(async () => {
    // Important: Destroy session
    await session.destroy()

    vi.clearAllMocks()
  })

  it('sets the current session data', async () => {
    // Should start empty
    expect(session.data?.user?.id).toEqual(undefined)

    await initializeSession()

    expect(session.data?.user?.id).toEqual(userId)
    expect(session.data?.organization?.id).toEqual(orgId)
    expect(session.data?.organization?.entitlements?.tier?.name).toEqual(orgTier)
  })

  it('saves the session data to localStorage', async () => {
    // Should start empty
    expect(session.data?.user?.id).toEqual(undefined)

    await initializeSession()

    expect(localStorage.getItem(SESSION_LOCAL_STORAGE_KEY)).toBe(btoa(encodeURIComponent(JSON.stringify(session.data))))
    expect(localStorage.getItem(SESSION_USER_LOCAL_STORAGE_KEY)).toBe(userOrgGeneratedUuid.value)
  })

  it('removes data from localStorage on destroy', async () => {
    // Should start empty
    expect(localStorage.getItem(SESSION_LOCAL_STORAGE_KEY)).toBe(null)
    expect(localStorage.getItem(SESSION_USER_LOCAL_STORAGE_KEY)).toBe(null)

    await initializeSession()

    expect(localStorage.getItem(SESSION_LOCAL_STORAGE_KEY)).toBe(btoa(encodeURIComponent(JSON.stringify(session.data))))
    expect(localStorage.getItem(SESSION_USER_LOCAL_STORAGE_KEY)).toBe(userOrgGeneratedUuid.value)

    await session.destroy()

    expect(localStorage.getItem(SESSION_LOCAL_STORAGE_KEY)).toBe(null)
    expect(localStorage.getItem(SESSION_USER_LOCAL_STORAGE_KEY)).toBe(null)
  })

  it('stores the user-desired route in localStorage when passed to the destroy method', async () => {
    await initializeSession()

    // Destroy session and pass the current path
    const currentPath = '/mesh-manager/child'
    session.destroy(currentPath)

    const sessionDataFromLocalStorage: SessionData = JSON.parse(decodeURIComponent(atob(localStorage.getItem(SESSION_LOCAL_STORAGE_KEY) || '')))

    // @ts-ignore
    expect(sessionDataFromLocalStorage.to?.path).toBe(currentPath)
    // Ensure the other properties were removed
    expect(sessionDataFromLocalStorage.user).toBe(undefined)
    expect(sessionDataFromLocalStorage.organization).toBe(undefined)
  })

  it('determines if there is an existing session based on session data', async () => {
    // Should start empty
    expect(session.data?.user?.id).toEqual(undefined)

    expect(session.exists).toBe(false)

    await initializeSession()

    expect(session.exists).toBe(true)

    await session.destroy()

    expect(session.exists).toBe(false)
  })
})
