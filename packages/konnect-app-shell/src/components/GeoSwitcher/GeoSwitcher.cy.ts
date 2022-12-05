// Cypress component test spec file

import GeoSwitcher from './GeoSwitcher.vue'
import { mount } from 'cypress/vue'

describe('<GeoSwitcher />', () => {
  it('TODO: This is an example test', () => {
    mount(GeoSwitcher)

    cy.get('.kong-ui-geo-switcher').should('be.visible')
  })
})
