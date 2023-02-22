// Cypress component test spec file
import EntityDeleteModal from './EntityDeleteModal.vue'
import composables from '../../composables'

describe('<EntityDeleteModal />', () => {
  const { i18n: { t } } = composables.useI18n()
  const entityType = 'route'
  const entityName = 'route-1'

  it('should show title and description', () => {
    const title = 'Continue?'
    const description = 'Shall we proceed?'
    cy.mount(EntityDeleteModal, {
      props: {
        visible: true,
        entityType,
        title,
        description,
      },
    })

    cy.get('.k-prompt-header-content').should('contain.text', title)
    cy.get('.kong-ui-entity-delete-modal .description').should('contain.text', description)
  })

  it('should show entity type', () => {
    cy.mount(EntityDeleteModal, {
      props: {
        visible: true,
        entityType,
      },
    })

    cy.get('.kong-ui-entity-delete-modal .message')
      .should('contain.text', t('deleteModal.message', { entityType }))
    cy.get('.kong-ui-entity-delete-modal .description').should('not.exist')
    cy.get('.k-prompt-confirm-text').should('not.exist')
  })

  it('should show entity name and confirmation input', () => {
    cy.mount(EntityDeleteModal, {
      props: {
        visible: true,
        entityType,
        entityName,
      },
    })

    cy.get('.kong-ui-entity-delete-modal .message')
      .should('contain.text', t('deleteModal.messageWithName', { entityType, entityName }))
    cy.get('.k-prompt-confirm-text').should('exist')
  })

  it('should disable action button', () => {
    cy.mount(EntityDeleteModal, {
      props: {
        visible: true,
        entityType,
        actionPending: true,
      },
    })

    cy.get('.k-prompt-proceed').should('be.disabled')
    cy.get('.k-prompt-proceed .kong-icon-spinner').should('exist')
  })
})
