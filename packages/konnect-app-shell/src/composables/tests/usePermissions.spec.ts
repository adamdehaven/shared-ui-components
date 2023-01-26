import { vi, describe, expect, test } from 'vitest'
import composables from '../../composables'
import { AxiosResponse } from 'axios'

describe('usePermissions', () => {
  const { kAuthApi } = composables.useKAuthApi()

  vi.spyOn(kAuthApi, 'value', 'get').mockReturnValue({
    // @ts-ignore
    me: {
      meAPIRetrievePermissions: () => new Promise((resolve) => resolve({
        data: {
          actions: [],
          resource: '',
        },
      } as AxiosResponse)),
    },
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("should return true for a user with '#root' permissions ", async () => {
    const permissions = [
      { krn: { service: 'konnect', action: '#list', resourcePath: 'runtimegroups/12345/consumers' }, expect: true },
      { krn: { service: 'konnect', action: '#create', resourcePath: 'services/*' }, expect: true },
      { krn: { service: 'accounts', action: '#root', resourcePath: null }, expect: true },
    ]

    for (const krnSet of permissions) {
      test(JSON.stringify(krnSet.krn), async () => {
        const { addKrns, canUserAccess } = composables.usePermissions()

        // inital list of krns
        await addKrns({
          krns: [{
            resource: 'krn:accounts:reg/{regionID}:org/{orgID}',
            actions: ['#root'],
          }],
          replaceAll: true,
        })

        const isAuthorized = await canUserAccess(krnSet.krn)

        expect(isAuthorized).toEqual(krnSet.expect)
      })
    }
  })

  describe('invalid krn formats', () => {
    test("should return false if resourcePath includes '/undefined'", async () => {
      const { addKrns, canUserAccess } = composables.usePermissions()

      // inital list of krns
      await addKrns({
        krns: [{
          resource: 'krn:konnect:reg/regionID:org/12345:services/12345',
          actions: [
            '#list',
            '#retrieve',
            '#edit',
          ],
        }],
        replaceAll: true,
      })

      const isAuthorized = await canUserAccess({ service: 'konnect', action: '#list', resourcePath: 'runtimegroups/undefined/consumers' })

      expect(isAuthorized).toEqual(false)
    })

    test("should return false if resourcePath includes '{' or '}'", async () => {
      const { addKrns, canUserAccess } = composables.usePermissions()

      // inital list of krns
      await addKrns({
        krns: [{
          resource: 'krn:konnect:reg/regionID:org/12345:services/12345',
          actions: [
            '#list',
            '#retrieve',
            '#edit',
          ],
        }],
        replaceAll: true,
      })

      const isAuthorized = await canUserAccess({ service: 'konnect', action: '#list', resourcePath: 'services/{id}' })

      expect(isAuthorized).toEqual(false)
    })
  })
})
