// Cypress component test spec file
import RouteList from './RouteList.vue'

describe('<RouteList />', () => {
  it('TODO: This is an example test', () => {
    cy.mount(RouteList, {
      props: {
        config: {
          app: 'konnect',
          apiBaseUrl: '/us', // active geo, with leading slash and no trailing slash; Consuming app would pass in something like `https://us.api.konghq.com`
          controlPlaneId: 'b3b22183-c0d0-445d-8737-c04525ad2b0e',
        },
      },
    })

    cy.get('.kong-ui-entities-routes-list').should('be.visible')
  })
})
