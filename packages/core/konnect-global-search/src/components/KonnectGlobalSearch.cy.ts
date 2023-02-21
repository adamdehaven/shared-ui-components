// Cypress component test spec file

import { SearchResultSource, KonnectSearchIndexType } from '../types'
import composables from '../composables'
import KonnectGlobalSearch from './KonnectGlobalSearch.vue'
import {
  searchData,
  serviceId,
  servicePackage1,
  serviceVersion1,
  serviceVersion,
  developer,
  user,
  serviceDoc,
} from '../../fixtures/mockData.js'

interface SearchResult {
  index: KonnectSearchIndexType
  source: SearchResultSource,
  label: string,
  value: string
}

const getNonMatchedResults = (matchedResults: SearchResult[]): SearchResult[] => {
  return searchData.data.filter((entry: SearchResult) => !matchedResults.find((match: SearchResult) => entry.value === match.value))
}

describe('<KonnectGlobalSearch />', () => {
  let searchStub: any

  beforeEach(() => {
    searchStub = cy.stub(composables, 'useSearchApi').as('search')
  })

  it('renders props when passed', () => {
    searchStub.callsFake(() => ({
      results: { value: [] },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('exist')
    // search icon
    cy.get('.kong-ui-konnect-global-search .search-container .global-search-icon').should('be.visible')
    // search select input
    cy.getTestId('filter-select').should('be.visible')
    // filter category dropdown
    cy.getTestId('search-dropdown-toggle').should('be.visible')
    cy.getTestId('search-dropdown-toggle').click()
    // dropdown items
    cy.get('[data-testid="select-service_packages,service_versions"]').should('be.visible')
    cy.getTestId('select-users').should('be.visible')
    cy.getTestId('select-developers').should('be.visible')
    cy.get('[data-testid="select-service_package_documents,service_version_documents"]').should('be.visible')
  })

  it('correctly filters by all', () => {
    searchStub.callsFake(() => ({
      results: { value: searchData },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('exist')
    cy.getTestId('filter-select').should('be.visible')

    cy.getTestId('filter-select').click()
    cy.getTestId(`k-select-item-${serviceId}`).should('be.visible')

    // mock filtering
    const resultArr = {
      data: [servicePackage1, serviceVersion1, serviceVersion, serviceDoc],
    }
    searchStub.reset()
    searchStub.callsFake(() => ({
      results: { value: resultArr },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('filter-select').type('good')

    // check visible content
    resultArr.data.forEach((visibleItem: SearchResult) => {
      cy.getTestId(`k-select-item-${visibleItem.value}`).should('be.visible')
    })

    // check hidden content
    const hiddenArr = getNonMatchedResults(resultArr.data)

    hiddenArr.forEach((hiddenItem: SearchResult) => {
      cy.getTestId(`k-select-item-${hiddenItem.value}`).should('not.exist')
    })
  })

  it('correctly filters by entity - Services (and Service Versions)', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('exist')
    cy.getTestId('filter-select').should('be.visible')
    cy.getTestId('search-dropdown-toggle').click()

    cy.get('[data-testid="select-service_packages,service_versions"]').should('be.visible')

    searchStub.callsFake(() => ({
      results: { value: searchData },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.get('[data-testid="select-service_packages,service_versions"]').click()

    // mock filtering
    const resultArr = {
      data: [servicePackage1, serviceVersion1, serviceVersion],
    }
    searchStub.reset()
    searchStub.callsFake(() => ({
      results: { value: resultArr },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('filter-select').type('good')

    // check visible content
    resultArr.data.forEach((visibleItem: SearchResult) => {
      cy.getTestId(`k-select-item-${visibleItem.value}`).should('be.visible')
    })

    // check hidden content
    const hiddenArr = getNonMatchedResults(resultArr.data)

    hiddenArr.forEach((hiddenItem: SearchResult) => {
      cy.getTestId(`k-select-item-${hiddenItem.value}`).should('not.exist')
    })
  })

  it('correctly filters by entity - users', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('exist')
    cy.getTestId('filter-select').should('be.visible')
    cy.getTestId('search-dropdown-toggle').click()

    cy.getTestId('select-users').should('be.visible')

    searchStub.callsFake(() => ({
      results: { value: searchData },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('select-users').click()

    // mock filtering
    const resultArr = {
      data: [user],
    }
    searchStub.reset()
    searchStub.callsFake(() => ({
      results: { value: resultArr },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('filter-select').type('n')

    // check visible content
    resultArr.data.forEach((visibleItem: SearchResult) => {
      cy.getTestId(`k-select-item-${visibleItem.value}`).should('be.visible')
    })

    // check hidden content
    const hiddenArr = getNonMatchedResults(resultArr.data)

    hiddenArr.forEach((hiddenItem: SearchResult) => {
      cy.getTestId(`k-select-item-${hiddenItem.value}`).should('not.exist')
    })
  })

  it('correctly filters by entity - developers', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('exist')
    cy.getTestId('filter-select').should('be.visible')
    cy.getTestId('search-dropdown-toggle').click()

    cy.getTestId('select-developers').should('be.visible')

    searchStub.callsFake(() => ({
      results: { value: searchData },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('select-developers').click()

    // mock filtering
    const resultArr = {
      data: [developer],
    }
    searchStub.reset()
    searchStub.callsFake(() => ({
      results: { value: resultArr },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('filter-select').type('t')

    // check visible content
    resultArr.data.forEach((visibleItem: SearchResult) => {
      cy.getTestId(`k-select-item-${visibleItem.value}`).should('be.visible')
    })

    // check hidden content
    const hiddenArr = getNonMatchedResults(resultArr.data)

    hiddenArr.forEach((hiddenItem: SearchResult) => {
      cy.getTestId(`k-select-item-${hiddenItem.value}`).should('not.exist')
    })
  })

  it('correctly filters by entity - Documents', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    cy.get('.kong-ui-konnect-global-search').should('exist')
    cy.getTestId('filter-select').should('be.visible')
    cy.getTestId('search-dropdown-toggle').click()

    cy.get('[data-testid="select-service_package_documents,service_version_documents"]').should('be.visible')

    searchStub.callsFake(() => ({
      results: { value: searchData },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.get('[data-testid="select-service_package_documents,service_version_documents"]').click()

    // mock filtering
    const resultArr = {
      data: [serviceDoc],
    }
    searchStub.reset()
    searchStub.callsFake(() => ({
      results: { value: resultArr },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.getTestId('filter-select').type('good')

    // check visible content
    resultArr.data.forEach((visibleItem: SearchResult) => {
      cy.getTestId(`k-select-item-${visibleItem.value}`).should('be.visible')
    })

    // check hidden content
    const hiddenArr = getNonMatchedResults(resultArr.data)

    hiddenArr.forEach((hiddenItem: SearchResult) => {
      cy.getTestId(`k-select-item-${hiddenItem.value}`).should('not.exist')
    })
  })

  it('renders error state content', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    searchStub.callsFake(() => ({
      results: { value: [] },
      error: 'Could not fetch url',
      fetchSearchResults: () => {},
    }))

    cy.get('.kong-ui-konnect-global-search').should('exist')

    cy.getTestId('filter-select').click()

    cy.getTestId('global-search-error-state').should('be.visible')
  })

  it('renders empty state when filter matches no items', () => {
    cy.mount(KonnectGlobalSearch, {
      props: {
        activeGeoCode: 'us',
        searchApiUrl: '/us/kong-api/konnect',
        shouldNavigate: false,
      },
    })

    searchStub.callsFake(() => ({
      results: { value: [] },
      error: undefined,
      fetchSearchResults: () => {},
    }))

    cy.get('.kong-ui-konnect-global-search').should('exist')

    cy.getTestId('filter-select').type('xxx')

    cy.getTestId('global-search-empty-state').should('be.visible')
  })
})
