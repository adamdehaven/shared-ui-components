import { kongAuthApi, session } from '@KHCP/services'
import { setupPiniaTestStore } from '@KHCP/stores/setupPiniaTestStore'
import { useGeoStore, KHCP_GEO_LOCAL_STORAGE_KEY, useSessionStore, usePermissionsStore } from '@KHCP/stores'
import { konnectRouter } from '@KHCP/router'
import composables from '@KHCP/composables'
import GeoSwitcher from './GeoSwitcher.vue'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { VueRouterKong } from '@KHCP/router/router'
import organizationAdminKrns from '../../cypress/fixtures/krns/organization-admin-krns.json'
import { createI18n } from '@kong-ui/core'
import english from '@KHCP/locales/en.json'
import { FeatureFlags } from '@KHCP/core/enums/feature-flags'

const geoSwitcher = {
  menu: '[data-testid="geo-switcher-global-menu"]',
  select: '.geo-switcher .k-select'
}

interface GeoSwitcherMountOptions {
  /**
   * Array of available geos for the organization
   */
  geos: string[]
  /**
   * Geo code to preset to the active geo for the test (typically this is only set when testing `/global/*` routes so that we can skip the Select Region page)
   */
  activeGeo?: string
  /**
   * Geo code to preset to the active geo override
   */
  activeGeoOverride?: string
  /**
   * Show the global picker
   */
  global: boolean
  /**
   * The route.path to visit
   */
  path: string
  /**
   * The organization tier for the test
   */
  tier?: string
  /**
   * Array of feature flags to evaluate
   */
  ldFeatureFlags?: {
    /**
     * The feature flag key
     */
    key: string
    /**
     * Mocked evaluated value of the flag
     */
    value: boolean
  }[]
}

describe('GeoSwitcher component', () => {
  session.exists = () => true

  let router: VueRouterKong

  // @ts-ignore
  kongAuthApi.me.meAPIRetrievePermissions = () => new Promise((resolve) => resolve({ data: { data: [] } }))

  const userId = uuidv4()
  const orgId = uuidv4()
  const geoLocalStorageKey = `${KHCP_GEO_LOCAL_STORAGE_KEY}-${uuidv5(orgId, userId)}`

  // Create a `createTestingPinia` instance of Pinia for usage in the test, you can pass in options as needed: https://pinia.vuejs.org/api/modules/pinia_testing.html#interfaces
  setupPiniaTestStore('cypress')

  const mountComponent = ({ global, geos = [], activeGeo = '', activeGeoOverride = null, path = '', tier = 'enterprise', ldFeatureFlags = [] }: GeoSwitcherMountOptions) => {
    const geoStore = useGeoStore()
    const sessionStore = useSessionStore()
    const permissionsStore = usePermissionsStore()

    createI18n('en-us', english, true)

    // Must be called before mounting the component
    sessionStore.setSession(session)
    sessionStore.setCurrentSessionData({
      // @ts-ignore
      user: {
        id: userId // fake UUID
      },
      organization: {
        id: orgId, // fake UUID
        entitlements: {
          tier: {
            // @ts-ignore
            name: tier,
            trial_expires_at: null
          }
        }
      }
    })

    // Stub feature flags
    cy.stub(composables, 'useLDFeatureFlag').callsFake((key, defaultValue) => {
      const stubbedLdFlag = ldFeatureFlags.find(f => f.key === key)

      return stubbedLdFlag ? stubbedLdFlag.value : defaultValue
    })

    // Get all geos from test
    geoStore.setAllGeos(geos)
    // Set the active geo
    geoStore.setActiveGeo(activeGeo)
    // Set the active geo override
    geoStore.setActiveGeoOverride(activeGeoOverride)

    router = konnectRouter()
    router.isAuthRoute = () => false
    cy.wrap(permissionsStore.addKrns({ krns: organizationAdminKrns, replaceAll: true }))

    cy.viewport(600, 400)

    if (path && path !== router.currentRoute.value.path) {
      cy.then(() => {
        return new Cypress.Promise((resolve) => {
          router.push({ path }).catch(() => { }).then(() => resolve('ok'))
          setTimeout(() => {
            resolve('ok')
          }, 1000)
        })
      })
    }

    // @ts-ignore
    cy.mount(GeoSwitcher, {
      router,
      props: {
        global
      },
    })
  }

  afterEach(() => {
    // Clear localStorage geo
    localStorage.removeItem(geoLocalStorageKey)
  })

  // TODO: Remove this describe block once the feature flag is removed
  describe('hide if multi-geo feature flag is false', () => {
    it('global switcher should still be hidden even if there is one geo', () => {
      mountComponent({ global: true, geos: ['us'], path: '/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: false }] })
      cy.get(geoSwitcher.menu).should('not.exist')
    })

    it('global switcher should still be hidden even if there are two geos', () => {
      mountComponent({ global: true, geos: ['us', 'eu'], path: '/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: false }] })
      cy.get(geoSwitcher.menu).should('not.exist')
    })

    it('local component switcher should be hidden even if there is one geo', () => {
      mountComponent({ global: false, geos: ['us'], path: '/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: false }] })
      cy.get(geoSwitcher.select).should('not.exist')
    })

    it('local component switcher should be hidden even if there are two geos', () => {
      mountComponent({ global: false, geos: ['us', 'eu'], path: '/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: false }] })
      cy.get(geoSwitcher.select).should('not.exist')
    })
  })

  describe('hide if no geos are returned', () => {
    it('global switcher should be hidden when there are no geos', () => {
      mountComponent({ global: true, geos: [], path: '/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(geoSwitcher.menu).should('not.exist')
    })

    it('local component switcher should be hidden when there are no geos', () => {
      mountComponent({ global: false, geos: [], path: '/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(geoSwitcher.select).should('not.exist')
    })
  })

  describe('global=true specific features', () => {
    it('should show the global picker and hide the override picker', () => {
      mountComponent({ global: true, geos: ['us'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(geoSwitcher.menu).should('be.visible')
      cy.get(geoSwitcher.select).should('not.exist')
    })

    it('should show one single geo', () => {
      mountComponent({ global: true, geos: ['us'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).click()
      cy.get('.k-popover.k-dropdown-popover [data-testid^="geo-switcher-global-menu-select-"]').should('have.length', 1)
    })

    it('should not show the enterprise pricing link for enterprise orgs', () => {
      mountComponent({ global: true, geos: ['us'], path: '/us/servicehub', tier: 'enterprise', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).click()
      cy.get('[data-testid="geo-switcher-global-more-regions-option-link"]').should('not.exist')
    })

    it('should show one single geo and the enterprise pricing link for non-enterprise orgs', () => {
      mountComponent({ global: true, geos: ['us'], path: '/us/servicehub', tier: 'plus', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).click()
      cy.get('[data-testid="geo-switcher-global-more-regions-option-link"]').should('be.visible')
    })

    it('should show the choice of geos', () => {
      mountComponent({ global: true, geos: ['us', 'eu'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).click()
      cy.get('.k-popover.k-dropdown-popover [data-testid^="geo-switcher-global-menu-select-"]').should('have.length', 2)
    })

    it('should get default geo from querystring and set localStorage', () => {
      cy.stub(composables, 'useWindow').returns({
        getLocationPathname: () => '/eu/servicehub'
      })

      mountComponent({ global: true, geos: ['us', 'eu'], path: '/eu/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).should('contain.text', english.geo.availableGeos.eu)

      cy.wrap(localStorage.getItem(geoLocalStorageKey)).should('eq', 'eu')
    })

    it('should get default geo from localStorage', () => {
      localStorage.setItem(geoLocalStorageKey, 'eu')

      mountComponent({ global: true, geos: ['us', 'eu'], path: '/eu/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).should('contain.text', english.geo.availableGeos.eu)
    })

    it('should handle show "Global" on global route', () => {
      localStorage.setItem(geoLocalStorageKey, 'us')
      mountComponent({ global: true, geos: ['us', 'eu'], path: '/global/organization/teams', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-btn"]`).should('contain.text', english.geo.global)
    })

    it('should reload the page when geo changed', () => {
      let called

      cy.stub(composables, 'useWindow').returns({
        getLocationPathname: () => '/us/servicehub',
        setLocationHref: (url: string) => (called = url)
      })

      mountComponent({ global: true, geos: ['us', 'eu'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })

      cy.get(`${geoSwitcher.menu} [data-testid="k-dropdown-trigger"] .k-button`).click()
      cy.get('.k-popover.k-dropdown-popover [data-testid^="geo-switcher-global-menu-select-eu"]').click().then(() =>
        expect(called).to.have.string('/eu/servicehub')
      )
    })
  })

  describe('global=false specific features', () => {
    it('should show the override picker and hide the global picker', () => {
      mountComponent({ global: false, geos: ['us'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get(geoSwitcher.menu).should('not.exist')
      cy.get(geoSwitcher.select).should('be.visible')
    })

    it('should show one single geo', () => {
      mountComponent({ global: false, geos: ['us'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get('.geo-switcher .k-select').click()
      cy.get(`${geoSwitcher.select} div[data-testid^="k-select-item-"]`).should('have.length', 1)
    })

    it('should show the choice of geos', () => {
      mountComponent({ global: false, geos: ['us', 'eu'], path: '/us/servicehub', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get('div.geo-switcher .k-select').click()
      cy.get('div[data-testid^="k-select-item-"]').should('have.length', 2)
    })

    it('should show the choices on global route', () => {
      mountComponent({ global: false, geos: ['us', 'eu'], path: '/global/organization/teams', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get('input').should('have.value', english.geo.availableGeos.us)
    })

    it('should grab value from isActiveOverride', () => {
      mountComponent({ global: false, geos: ['us', 'eu'], activeGeo: 'us', activeGeoOverride: 'eu', path: '/global/organization/teams', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })

      cy.get('input').should('have.value', english.geo.availableGeos.eu)
    })

    it('should change store isActiveOverride when geo changed', () => {
      mountComponent({ global: false, geos: ['us', 'eu'], activeGeo: 'us', path: '/global/organization/teams', ldFeatureFlags: [{ key: FeatureFlags.MultiGeo, value: true }] })
      cy.get('div.geo-switcher .k-select').click()
      cy.get('div[data-testid="k-select-item-eu"]').click().then(() => {
        const geoStore = useGeoStore()

        expect(geoStore.getActiveGeo({ allowOverride: false })?.code).to.eq('us')
        expect(geoStore.getActiveGeo({ allowOverride: true })?.code).to.eq('eu')
      })
    })
  })
})
