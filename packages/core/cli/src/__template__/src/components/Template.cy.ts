// Cypress component test spec file

import {%%COMPONENT_NAME%%} from './{%%COMPONENT_NAME%%}.vue'

describe('<{%%COMPONENT_NAME%%} />', () => {
  it('TODO: This is an example test', () => {
    cy.mount({%%COMPONENT_NAME%%})

    cy.get('.kong-ui-{%%PACKAGE_NAME%%}').should('be.visible')
  })
})
