import { reactive } from 'vue'
import composables from '../../composables'
import type { Session } from '../../types'
import HelpDropdown from './HelpDropdown.vue'

describe('<HelpDropdown />', () => {
  const mountComponent = async () => {

    cy.stub(composables, 'useSession').callsFake(() => ({
      session: reactive<Partial<Session>>({
        exists: true,
        data: {
          // @ts-ignore
          organization: {
            id: 'orgId',
            name: 'orgName',
          },
        },
      }),
    }))

    cy.viewport(600, 400)

    // @ts-ignore
    cy.mount(HelpDropdown, {})
  }

  it('should display the help menu for everyone', () => {
    mountComponent()
    cy.get('[data-testid="k-dropdown-trigger"]').should('exist')
  })

  it('should display org name and copy org id button', () => {
    mountComponent()
    const selector = '[data-testid="k-dropdown-trigger"]'

    cy.get(selector).should('be.visible')
    cy.get(selector).click()

    cy.get('[data-testid="help-menu-org-name"]').should('be.visible')
    cy.get('[data-testid="help-menu-copy-org-id"]').should('be.visible')
  })

  it('should display a link to the docs', () => {
    mountComponent()
    const selector = '[data-testid="k-dropdown-trigger"]'

    cy.get(selector).should('be.visible')
    cy.get(selector).click()

    cy.get('[data-testid="docs-link"]').should('be.visible')
  })

  it('should display a link to the status page', () => {
    mountComponent()
    const selector = '[data-testid="k-dropdown-trigger"]'

    cy.get(selector).should('be.visible')
    cy.get(selector).click()

    cy.get('[data-testid="status-link"]').should('be.visible')
  })

  it('should display a link to the support portal and enterprise badge', () => {
    mountComponent()
    const selector = '[data-testid="k-dropdown-trigger"]'

    cy.get(selector).should('be.visible')
    cy.get(selector).click()

    cy.get('[data-testid="enterprise-logo"]').should('be.visible')

    cy.get('[data-testid="support-link"]').should('be.visible')
  })
})
