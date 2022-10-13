// Import types for custom commands
/// <reference types="../../../cypress/support" />

// Cypress component test spec file

import {%%COMPONENT_NAME%%} from './{%%COMPONENT_NAME%%}.vue'
import { mount } from 'cypress/vue'

describe('<{%%COMPONENT_NAME%%} />', () => {
  it('TODO: This is an example test', () => {
    mount({%%COMPONENT_NAME%%})

    cy.get('.kong-ui-{%%PACKAGE_NAME%%}').should('be.visible')
  })
})
