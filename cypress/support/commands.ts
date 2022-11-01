import { mount } from 'cypress/vue'
import { ComponentPublicInstance, App } from 'vue'
import RouterLink from '../fixtures/RouterLink.vue'
import Kongponents from '@kong/kongponents'

interface VueError {
  err: unknown
  instance: ComponentPublicInstance | null
  info: string
}

Cypress.Commands.add('getTestId', (dataTestId: string): any => {
  return cy.get(`[data-testid=${dataTestId}]`)
})

Cypress.Commands.add('findTestId', (dataTestId: string): any => {
  return cy.find(`[data-testid=${dataTestId}]`)
})

Cypress.Commands.add('onVueError', (vueError: VueError) => {
  console.error(vueError?.err)

  // Ensure the test fails
  // @ts-ignore
  assert.fail(vueError.err.stack)
})

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.stubs = options.global.stubs || {}
  options.global.stubs.transition = false
  options.global.components = options.global.components || {}
  options.global.plugins = options.global.plugins || []

  options.global.components.RouterLink = RouterLink

  // Add plugins
  options.global.plugins.push({
    install(app: App) {
      // Kongponents
      app.use(Kongponents)

      // Register error handler
      // TODO: IMPORTANT: if you get a Cypress error in the assertion output, disable this app.config.errorHandler and Cypress will output the actual error
      app.config.errorHandler = (error, instance, info) => {
        cy.onVueError({ err: error, instance, info })
      }
    },
  })

  return mount(component, options)
})
