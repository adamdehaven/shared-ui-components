// Cypress component test spec file

import GeoSelectForm from './GeoSelectForm.vue'
import composables from '../../composables'

describe('<GeoSelectForm />', () => {
  const { i18n: { t } } = composables.useI18n()

  before(() => {
    const { setAllGeos } = composables.useGeo()

    // Set available geos
    setAllGeos(['us', 'eu'])
  })

  it('should show the choice of geos', () => {
    cy.mount(GeoSelectForm)

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('be.visible')
    cy.get('.k-select').click()
    cy.get('.k-select').find('.k-select-item').should('have.length', 2)
    cy.get('.k-select').find('.k-select-item').eq(0).should('contain.text', t('geo.available_geos.us'))
    cy.get('.k-select').find('.k-select-item').eq(1).should('contain.text', t('geo.available_geos.eu'))
  })

  it('should allow the user to select a geo', () => {
    cy.mount(GeoSelectForm)

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('be.visible')
    cy.get('.k-select').click()
    cy.get('.k-select').find('.k-select-item').should('have.length', 2)
    cy.get('.k-select').find('.k-select-item').eq(1).click()

    cy.getTestId('kong-ui-konnect-app-shell-region-select-input').should('have.attr', 'placeholder', t('geo.available_geos.eu'))
  })
})
