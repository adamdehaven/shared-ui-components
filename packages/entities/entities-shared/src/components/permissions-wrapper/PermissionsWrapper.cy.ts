// Cypress component test spec file
import PermissionsWrapper from './PermissionsWrapper.vue'
import { h } from 'vue'

describe('<PermissionsWrapper />', () => {
  it('should show the slot content by default', () => {
    const slotContent = 'I need to slot some content'

    cy.mount(PermissionsWrapper, {
      slots: {
        default: () => h('div', { 'data-testid': 'slot-content' }, slotContent),
      },
    })

    cy.getTestId('slot-content').should('be.visible')
  })

  it('should show the slot content if the authFunction evaluates to true', () => {
    const slotContent = 'I need to slot some content'
    const testFn = async () => true

    cy.mount(PermissionsWrapper, {
      props: {
        authFunction: testFn,
      },
      slots: {
        default: () => h('div', { 'data-testid': 'slot-content' }, slotContent),
      },
    })

    cy.getTestId('slot-content').should('be.visible')
  })

  it('should not show the slot content if the authFunction evaluates to false', () => {
    const slotContent = 'I need to slot some content'
    const testFn = async () => false

    cy.mount(PermissionsWrapper, {
      props: {
        authFunction: testFn,
      },
      slots: {
        default: () => h('div', { 'data-testid': 'slot-content' }, slotContent),
      },
    })

    cy.getTestId('slot-content').should('not.exist')
  })

  it('should show the slot content after a long delay if the authFunction evaluates to true', () => {
    const slotContent = 'I need to slot some content'
    const testFn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return true
    }

    cy.mount(PermissionsWrapper, {
      props: {
        authFunction: testFn,
      },
      slots: {
        default: () => h('div', { 'data-testid': 'slot-content' }, slotContent),
      },
    })

    cy.getTestId('slot-content').should('be.visible')
  })
})
