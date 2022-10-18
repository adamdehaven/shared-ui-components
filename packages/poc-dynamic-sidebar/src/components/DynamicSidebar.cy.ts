// Cypress component test spec file

import DynamicSidebar from './DynamicSidebar.vue'
import { mount } from 'cypress/vue'

describe('<DynamicSidebar />', () => {
  it('TODO: This is an example test', () => {
    mount(DynamicSidebar)

    cy.get('.kong-ui-poc-dynamic-sidebar').should('be.visible')
  })
})
