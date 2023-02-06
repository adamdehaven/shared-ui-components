// Cypress component test spec file

import KonnectGlobalSearch from './KonnectGlobalSearch.vue'

describe('<KonnectGlobalSearch />', () => {
  it('TODO: This is an example test', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: 'false',
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('be.visible')
  })
})
