// Cypress component test spec file

import Navbar from './NavbarHeader.vue'
import { mount } from 'cypress/vue'

describe('<Navbar />', () => {
  it('TODO: This is an example test', () => {
    mount(Navbar)

    cy.get('.kong-ui-navbar').should('be.visible')
  })
})
