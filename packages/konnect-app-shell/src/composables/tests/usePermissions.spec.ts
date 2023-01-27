import { vi, describe, expect, it, afterEach } from 'vitest'
import { ROOT_READONLY_ALLOWED_ACTIONS } from '../../constants'
import composables from '../../composables'
import { flushPromises } from '@vue/test-utils'

const rootPermissions = ['#root', '#root-readonly']

describe('usePermissions', () => {
  afterEach(async () => {
    const { addKrns } = composables.usePermissions()

    // Clear all stored krns
    await addKrns({
      krns: [],
      replaceAll: true,
    })

    vi.resetAllMocks()
  })

  describe('#root-readonly allowed actions', () => {
    it('should only contain list/retrieve actions', () => {
      expect(ROOT_READONLY_ALLOWED_ACTIONS).toHaveLength(2)
      expect(ROOT_READONLY_ALLOWED_ACTIONS).toContain('#list')
      expect(ROOT_READONLY_ALLOWED_ACTIONS).toContain('#retrieve')
      // Ensure the array never contains `#root` action
      expect(ROOT_READONLY_ALLOWED_ACTIONS).not.toContain('#root')
      // Ensure the array never contains certain actions
      expect(ROOT_READONLY_ALLOWED_ACTIONS).not.toContain('#edit')
      expect(ROOT_READONLY_ALLOWED_ACTIONS).not.toContain('#create')
    })
  })

  for (const rootPermmission of rootPermissions) {
    describe(`'${rootPermmission}' permissions`, async () => {
      const permissions = [
        { krn: { service: 'konnect', action: '#list', resourcePath: 'runtimegroups/12345/consumers' }, expect: true },
        { krn: { service: 'konnect', action: '#create', resourcePath: 'services/*' }, expect: rootPermmission === '#root' },
        { krn: { service: 'konnect', action: '#edit', resourcePath: 'services/12345/versions/12345' }, expect: rootPermmission === '#root' },
        { krn: { service: 'accounts', action: '#root', resourcePath: null }, expect: rootPermmission === '#root' },
      ]

      for (const krnSet of permissions) {
        it(`expect: ${krnSet.expect} => ${krnSet.krn.action} => ${krnSet.krn.resourcePath}`, async () => {
          const { addKrns, canUserAccess } = composables.usePermissions()

          // inital list of krns
          await addKrns({
            krns: [{
              resource: 'krn:accounts:reg/{regionID}:org/{orgID}',
              actions: [rootPermmission],
            }],
            replaceAll: true,
          })

          const isAuthorized = await canUserAccess(krnSet.krn)

          expect(isAuthorized).toEqual(krnSet.expect)
        })
      }
    })
  }

  describe('invalid krn formats', () => {
    it("should return false if resourcePath includes '/undefined'", async () => {
      const { addKrns, canUserAccess } = composables.usePermissions()

      // inital list of krns
      await addKrns({
        krns: [{
          resource: 'krn:konnect:reg/regionID:org/12345:runtimegroups/12345',
          actions: [
            '#list',
            '#retrieve',
            '#edit',
          ],
        }],
        replaceAll: true,
      })

      const isAuthorized = await canUserAccess({ service: 'konnect', action: '#list', resourcePath: 'runtimegroups/undefined' })

      expect(isAuthorized).toEqual(false)
    })

    it("should return false if resourcePath includes '{' or '}'", async () => {
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

      // Notice the invalid curly braces in the resourcePath property
      const isAuthorized = await canUserAccess({ service: 'konnect', action: '#list', resourcePath: 'services/{id}' })

      expect(isAuthorized).toEqual(false)
    })
  })

  // Sidebar tests require utilizing the flushPromises helper
  describe('sidebar', () => {
    for (const rootPermmission of rootPermissions) {
      it(`should show all items if user has ${rootPermmission} permissions`, async () => {
        const { addKrns, userHasSomePermissions } = composables.usePermissions()
        const { topItems, bottomItems, profileItems } = composables.useAppSidebar()

        // Clear all stored krns
        await addKrns({
          krns: [{
            resource: 'krn:accounts:reg/{regionID}:org/{orgID}',
            actions: [rootPermmission],
          }],
          replaceAll: true,
        })

        // Await all promises to resolve
        await flushPromises()

        expect(userHasSomePermissions.value).toEqual(true)

        expect(topItems.value?.length).toEqual(6)
        expect(bottomItems.value?.length).toEqual(2)
        // Profile items are always available
        expect(profileItems.value?.length).toEqual(2)
      })
    }

    it('should show zero items if user has no permissions', async () => {
      const { addKrns, userHasSomePermissions } = composables.usePermissions()
      const { topItems, bottomItems, profileItems } = composables.useAppSidebar()

      // Clear all stored krns
      await addKrns({
        krns: [],
        replaceAll: true,
      })

      // Await all promises to resolve
      await flushPromises()

      expect(userHasSomePermissions.value).toEqual(false)

      expect(topItems.value?.length).toEqual(0)
      expect(bottomItems.value?.length).toEqual(0)
      // Profile items are always available
      expect(profileItems.value?.length).toEqual(2)
    })

    it('should show proper items for user with Service Developer permissions', async () => {
      const { addKrns, userHasSomePermissions } = composables.usePermissions()
      const { topItems, bottomItems, profileItems } = composables.useAppSidebar()

      // Clear all stored krns
      await addKrns({
        krns: [
          {
            resource: 'krn:konnect:reg/*:org/{orgId}:services',
            actions: ['#list'],
          },
          {
            resource: 'krn:konnect:reg/*:org/{orgId}:runtimegroups',
            actions: ['#list'],
          },
        ],
        replaceAll: true,
      })

      // Await all promises to resolve
      await flushPromises()

      expect(userHasSomePermissions.value).toEqual(true)

      expect(topItems.value?.length).toEqual(2)
      expect(bottomItems.value?.length).toEqual(0)
      // Profile items are always available
      expect(profileItems.value?.length).toEqual(2)
    })

    it('should show proper items for user with Analytics Admin permissions', async () => {
      const { addKrns, userHasSomePermissions } = composables.usePermissions()
      const { topItems, bottomItems, profileItems } = composables.useAppSidebar()

      // Clear all stored krns
      await addKrns({
        krns: [
          {
            resource: 'krn:konnect:reg/*:org/{orgId}:reports',
            actions: ['#list', '#retrieve', '#create'],
          },
          {
            resource: 'krn:konnect:reg/*:org/{orgId}:runtimegroups',
            actions: ['#list'],
          },
        ],
        replaceAll: true,
      })

      // Await all promises to resolve
      await flushPromises()

      expect(userHasSomePermissions.value).toEqual(true)

      expect(topItems.value?.length).toEqual(2)
      expect(bottomItems.value?.length).toEqual(0)
      // Profile items are always available
      expect(profileItems.value?.length).toEqual(2)
    })
  })
})
