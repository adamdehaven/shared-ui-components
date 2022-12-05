// Cypress component test spec file

import KonnectAppShell from './KonnectAppShell.vue'
import { mount } from 'cypress/vue'

describe('<KonnectAppShell />', () => {
  it('TODO: This is an example test', () => {
    mount(KonnectAppShell)

    cy.get('.kong-ui-konnect-app-shell').should('exist')
  })
})
