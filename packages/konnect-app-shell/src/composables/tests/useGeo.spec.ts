import { describe, it, expect, vi, afterEach, beforeAll, SpyInstance } from 'vitest'
import * as composables from '../index'
import { KHCP_GEO_LOCAL_STORAGE_KEY } from '../../constants'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'

const userId = uuidv4()
const orgId = uuidv4()
// Test utilizes the fallback storage key (no uuid)
const testStorageKey = `${KHCP_GEO_LOCAL_STORAGE_KEY}-${uuidv5(orgId, userId)}`

describe('useGeo', async () => {
  const { session } = composables.useSession()
  const { setAllGeos, geos, setActiveGeo, setActiveGeoOverride, getActiveGeo, activeGeo, activeGeoOverride, geoLocalStorageKey } = composables.useGeo()
  const windowLocationSpy: SpyInstance<[], Partial<Location>> = vi.spyOn(window, 'location', 'get')

  beforeAll(() => {
    // Stub the session org and user id to generate the localStorage key
    const sessionSpy = vi.spyOn(session, 'value', 'get')
    sessionSpy.mockReturnValue({
      // @ts-ignore
      user: {
        id: userId,
      },
      // @ts-ignore
      organization: {
        id: orgId,
      },
    })
  })

  afterEach(() => {
    // Clear localStorage
    localStorage?.removeItem(testStorageKey)
    localStorage?.removeItem(KHCP_GEO_LOCAL_STORAGE_KEY)
    // Since the geos persist, clear the geos after each test
    setAllGeos([])

    vi.clearAllMocks()
  })

  it('sets all available geos', () => {
    const availableGeos = ['us', 'eu']

    expect(geos.value).toEqual([])
    setAllGeos(availableGeos)

    // Expect 2 available geos
    expect(geos.value.length).toBe(2)
    // Expect each geo to have a code and an active property
    expect(geos.value.every(geo => geo.code !== undefined))
    expect(geos.value.every(geo => typeof geo.isActive === 'boolean'))
  })

  it('sets the values of the computed properties', () => {
    const availableGeos = ['us', 'eu']

    expect(geos.value).toEqual([])
    setAllGeos(availableGeos)

    // Expect 2 available geos
    expect(geos.value.length).toBe(2)

    // Set the active geo
    setActiveGeo('us')

    expect(activeGeo.value?.code).toBe('us')
    expect(activeGeoOverride.value).toBe(null)
  })

  it('sets the active geo if the organization only has 1 entitled region', () => {
    const availableGeos = ['us']

    expect(geos.value).toEqual([])
    setAllGeos(availableGeos)

    // Expect 1 available geos
    expect(geos.value.length).toBe(1)

    // Set the active geo
    setActiveGeo()

    expect(activeGeo.value?.code).toBe(availableGeos[0])
  })

  it('sets the active geo from the URL', () => {
    // Create an existing localStorage entry (this should be ignored since the URL will have a geo in the path)
    localStorage?.setItem(testStorageKey, 'us')
    // Verify localStorage item exists
    expect(localStorage?.getItem(testStorageKey)).toEqual('us')

    // Pass a URL with a valid `geo` in the path
    windowLocationSpy.mockReturnValue({
      pathname: '/eu/mesh-manager',
    })

    const availableGeos = ['us', 'eu']

    setAllGeos(availableGeos)
    expect(geos.value.length).toBe(2)

    // don't pass in a geo so that it's determined based on the URL
    setActiveGeo()
    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('eu')
  })

  it('creates a localStorage key from the orgId and userId', () => {
    const availableGeos = ['us']

    setAllGeos(availableGeos)
    setActiveGeo()

    expect(geoLocalStorageKey.value).toEqual(testStorageKey)
    // Verify localStorage item key is correct
    expect(localStorage?.getItem(geoLocalStorageKey.value)).toEqual('us')
  })

  it('sets the active geo from localStorage', () => {
    // Pass a URL with no `geo` in the path
    windowLocationSpy.mockReturnValue({
      pathname: '/',
    })

    // Create an existing localStorage entry
    localStorage?.setItem(testStorageKey, 'eu')
    // Verify localStorage item exists
    expect(localStorage?.getItem(testStorageKey)).toEqual('eu')

    const availableGeos = ['us', 'eu']

    setAllGeos(availableGeos)
    expect(geos.value.length).toBe(2)

    // don't pass in a geo so that it's determined based on the localStorage object
    setActiveGeo()

    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('eu')
  })

  it('ignores the active geo from localStorage if stored under a different orgId/userId generated key', () => {
    const otherOrgId = uuidv4()
    const otherUserId = uuidv4()
    const otherUserLocalStorageKey = `${KHCP_GEO_LOCAL_STORAGE_KEY}-${uuidv5(otherOrgId, otherUserId)}`

    // Pass a URL with no `geo` in the path
    windowLocationSpy.mockReturnValue({
      pathname: '/',
    })

    // Create an existing localStorage entry for this orgId/userId combo
    localStorage?.setItem(testStorageKey, 'us')
    // Verify localStorage item exists for this orgId/userId combo
    expect(localStorage?.getItem(testStorageKey)).toEqual('us')

    // Create an existing localStorage entry for another orgId/userId combo
    localStorage?.setItem(otherUserLocalStorageKey, 'eu')
    // Verify localStorage item exists for this orgId/userId combo
    expect(localStorage?.getItem(otherUserLocalStorageKey)).toEqual('eu')

    const availableGeos = ['us', 'eu']

    setAllGeos(availableGeos)
    expect(geos.value.length).toBe(2)

    // don't pass in a geo so that it's determined based on the localStorage object
    setActiveGeo()
    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('us')
  })

  it('sets the active geo when a valid code is passed', () => {
    const availableGeos = ['us', 'eu']

    setAllGeos(availableGeos)
    expect(geos.value.length).toBe(2)

    setActiveGeo('eu')
    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('eu')
  })

  it('sets a localStorage key with UUID for the active geo', () => {
    const availableGeos = ['us']

    setAllGeos(availableGeos)
    expect(geos.value.length).toBe(1)
    setActiveGeo('us')
    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('us')
    // Verify localStorage item exists with correct key/value
    expect(localStorage?.getItem(testStorageKey)).toEqual('us')
  })

  it('sets the active geo override', () => {
    const availableGeos = ['us', 'eu']

    setAllGeos(availableGeos)
    expect(geos.value.length).toBe(2)

    setActiveGeo('us')
    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('us')

    setActiveGeoOverride('eu')
    expect(getActiveGeo({ allowOverride: false })?.code).toEqual('us')
    expect(getActiveGeo({ allowOverride: true })?.code).toEqual('eu')
  })
})
