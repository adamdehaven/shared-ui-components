import { describe, it, expect, vi, afterEach, beforeAll, SpyInstance } from 'vitest'
import * as composables from '../index'
import { SESSION_NAME } from '../../constants'
import { SessionData } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import { AxiosResponse } from 'axios'

const userId = uuidv4()
const orgId = uuidv4()
const orgTier = 'enterprise'

describe('useSession', async () => {
  const { session, initializeSession, exists, destroy } = composables.useSession()
  const { kAuthApi } = composables.useKAuthApi()
  const windowLocationSpy: SpyInstance<[], Partial<Location>> = vi.spyOn(window, 'location', 'get')

  beforeAll(() => {
    const { config } = composables.useAppShellConfig()
    const configSpy = vi.spyOn(config, 'value', 'get')
    configSpy.mockReturnValue({
      env: 'production',
      api: {
        v1: {
          kauth: '/kauth',
        },
        v2: {
          global: '',
        },
      },
    })

    vi.spyOn(kAuthApi, 'value', 'get').mockReturnValue({
      // @ts-ignore
      users: {
        userAPIRetrieveMe: () => new Promise((resolve) => resolve({
          data: {
            id: userId,
            email: 'user@example.com',
            full_name: 'Ready Player One',
            active: true,
            created_at: '',
            preferred_name: 'Player1',
            feature_set: '',
          },
        } as AxiosResponse)),
      },
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
    })

    // Mock any redirects redirect
    windowLocationSpy.mockReturnValue({
      assign: () => vi.fn(),
    })
  })

  afterEach(async () => {
    // Important: Destroy session
    await destroy()

    vi.clearAllMocks()
  })

  it('sets the current session data', async () => {
    // Should start empty
    expect(session.value?.user?.id).toEqual(undefined)

    await initializeSession()

    expect(session.value?.user?.id).toEqual(userId)
    expect(session.value?.organization?.id).toEqual(orgId)
    expect(session.value?.organization?.entitlements?.tier?.name).toEqual(orgTier)
  })

  it('saves the session data to localStorage', async () => {
    // Should start empty
    expect(session.value?.user?.id).toEqual(undefined)

    await initializeSession()

    expect(localStorage.getItem(SESSION_NAME)).toBe(btoa(encodeURIComponent(JSON.stringify(session.value))))
  })

  it('removes data from localStorage on destroy', async () => {
    // Should start empty
    expect(localStorage.getItem(SESSION_NAME)).toBe(null)

    await initializeSession()

    expect(localStorage.getItem(SESSION_NAME)).toBe(btoa(encodeURIComponent(JSON.stringify(session.value))))

    await destroy()

    expect(localStorage.getItem(SESSION_NAME)).toBe(null)
  })

  it('stores the user-desired route in localStorage when passed to the destroy method', async () => {
    await initializeSession()

    // Destroy session and pass the current path
    const currentPath = '/mesh-manager/child'
    destroy(currentPath)

    const sessionDataFromLocalStorage: SessionData = JSON.parse(decodeURIComponent(atob(localStorage.getItem(SESSION_NAME) || '')))

    console.log('sessionDataFromLocalStorage', sessionDataFromLocalStorage)

    // @ts-ignore
    expect(sessionDataFromLocalStorage.to?.path).toBe(currentPath)
    // Ensure the other properties were removed
    expect(sessionDataFromLocalStorage.user).toBe(undefined)
    expect(sessionDataFromLocalStorage.organization).toBe(undefined)
  })

  it('determines if there is an existing session based on session data', async () => {
    // Should start empty
    expect(session.value?.user?.id).toEqual(undefined)

    await initializeSession()

    expect(exists.value).toBe(true)

    await destroy()

    expect(exists.value).toBe(false)
  })
})
