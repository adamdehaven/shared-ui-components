import TestButton from './TestButton.vue'
import { mount } from 'cypress/vue'

describe('TestButton.vue', () => {
  it('renders', () => {
    const buttonText = 'This is a button'

    mount(TestButton, {
      props: {
        msg: buttonText,
      },
    })

    cy.get('button').should('contain.text', buttonText)
  })
})