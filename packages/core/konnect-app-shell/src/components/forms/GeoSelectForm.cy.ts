// Cypress component test spec file
import { computed, reactive } from 'vue'
import GeoSelectForm from './GeoSelectForm.vue'
import composables from '../../composables'
import type { Session } from '../../types'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'

describe('<GeoSelectForm />', () => {
  const { i18n: { t } } = composables.useI18n()
  const { setAllGeos } = composables.useGeo()
  const userId = uuidv4()
  const orgId = uuidv4()

  const mountComponent = async ({ geos = [], userAllowedRegions = [] }: { geos: string[], userAllowedRegions: string[] }) => {
    cy.stub(composables, 'useSession').callsFake(() => ({
      session: reactive<Partial<Session>>({
        exists: true,
        data: {
          // @ts-ignore
          user: {
            allowed_regions: userAllowedRegions,
          },
          // @ts-ignore
          organization: {
            id: orgId,
            name: 'orgName',
            isEnterprise: true,
          },
        },
      }),
      userOrgGeneratedUuid: computed((): string => uuidv5(orgId, userId)),
    }))

    // Set available geos
    setAllGeos(geos)

    // Mount component
    cy.mount(GeoSelectForm)
  }

  it('should show the choice of geos', () => {
    mountComponent({ geos: ['us', 'eu'], userAllowedRegions: ['us', 'eu'] })

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('be.visible')
    cy.get('.k-select').click()
    cy.get('.k-select').find('.k-select-item').should('have.length', 2)
    cy.get('.k-select').find('.k-select-item').eq(0).should('contain.text', t('geo.available_geos.us'))
    cy.get('.k-select').find('.k-select-item').eq(1).should('contain.text', t('geo.available_geos.eu'))
  })

  it('should allow the user to select a geo', () => {
    mountComponent({ geos: ['us', 'eu'], userAllowedRegions: ['us', 'eu'] })

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('be.visible')
    cy.get('.k-select').click()
    cy.get('.k-select').find('.k-select-item').should('have.length', 2)
    cy.get('.k-select').find('.k-select-item').eq(1).click()

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('have.attr', 'placeholder', t('geo.available_geos.eu'))
  })

  it('should only allow the user to select geos they have permissions in', () => {
    mountComponent({ geos: ['us', 'eu'], userAllowedRegions: ['eu'] })

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('be.visible')
    cy.get('.k-select').click()
    cy.get('.k-select').find('.k-select-item').should('have.length', 1)
    cy.get('.k-select').find('.k-select-item').eq(0).click()

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('have.attr', 'placeholder', t('geo.available_geos.eu'))
  })
})
