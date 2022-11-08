// Cypress component test spec file

// @ts-ignore
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { mount } from 'cypress/vue'
import SidebarNav from './SidebarNav.vue'
import { h } from 'vue'
import { topItems, bottomItems, profileItems } from '../../fixtures/sidebar-items'

const sidebar = '.kong-ui-sidebar-nav'

describe('<SidebarNav />', () => {
  it('renders a sidebar with top, bottom, nad profile nav', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems,
        bottomItems,
        profileItems,
        profileName: 'Marty McFly',
      },
    })

    cy.get(sidebar).should('be.visible')

    cy.get(sidebar).find('ul.top-items').should('be.visible')
    cy.get(sidebar).find('ul.top-items').find('li a').should('be.visible')
    cy.get(sidebar).find('ul.bottom-items').should('be.visible')
    cy.get(sidebar).find('ul.bottom-items').find('li a').should('be.visible')

    cy.get('.sidebar-profile-menu').should('be.visible')
    cy.get('.profile-dropdown-trigger').should('be.visible')
  })

  it('renders a router-link if item.to is an object', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Organization',
          key: 'organization',
          to: { name: 'organization' },
          icon: 'organizations',
        }],
      },
    })

    cy.get(sidebar).find('.sidebar-item-link').should('have.class', 'router-link')
  })

  it('renders an anchor tag if item.to is a string that starts with `http`', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Organization',
          key: 'organization',
          to: 'https://google.com',
          icon: 'organizations',
        }],
      },
    })

    cy.get(sidebar).find('.sidebar-item-link').should('not.have.class', 'router-link')
  })

  it('renders an anchor tag if item.external is true', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Organization',
          key: 'organization',
          to: '/organizations',
          external: true,
          icon: 'organizations',
        }],
      },
    })

    cy.get(sidebar).find('.sidebar-item-link').should('not.have.class', 'router-link')
  })

  it('navigates via anchor tag if item.external is true', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Organization',
          key: 'organization',
          to: '/organizations',
          external: true,
          icon: 'organizations',
        }],
      },
    })

    cy.get(sidebar).find('.sidebar-item-link').should('not.have.class', 'router-link')
  })

  // Top items
  describe('top items', () => {
    it('renders top nav items', () => {
      cy.mount(SidebarNav, {
        props: {
          topItems,
        },
      })

      cy.get(sidebar).find('ul.top-items').should('be.visible')
      cy.get(sidebar).find('ul.top-items').find('li').should('be.visible')
    })
  })

  // Bottom items
  describe('bottom items', () => {
    it('renders bottom nav items', () => {
      cy.mount(SidebarNav, {
        props: {
          bottomItems,
        },
      })

      cy.get(sidebar).find('ul.bottom-items').should('be.visible')
      cy.get(sidebar).find('ul.bottom-items').find('li').should('be.visible')
    })
  })

  // Profile items
  describe('profile items', () => {
    it('does not render the profile item if no profileItems or profileName are passed', () => {
      cy.mount(SidebarNav, {
        props: {
          topItems,
          bottomItems,
        },
      })

      cy.get(sidebar).find('.sidebar-footer').should('not.exist')
    })

    it('renders just the profileName if no nav items are passed', () => {
      const name = 'Marty McFly'

      cy.mount(SidebarNav, {
        props: {
          profileName: name,
        },
      })

      cy.get(sidebar).find('.sidebar-profile-name').should('contain.text', name)
      cy.get('.profile-dropdown-trigger').should('not.exist')
      cy.get('.sidebar-profile-menu-popover').should('not.exist')
    })

    it('displays the profile menu popup when clicked', () => {
      const name = 'Marty McFly'

      cy.mount(SidebarNav, {
        props: {
          profileItems,
          profileName: name,
        },
      })

      cy.get('.profile-dropdown-trigger').click()
      cy.get('.sidebar-profile-menu-popover').should('be.visible')
    })

    it('renders profile nav items in popover', () => {
      cy.mount(SidebarNav, {
        props: {
          profileItems,
        },
      })

      cy.get('.sidebar-profile-menu').should('be.visible')
      cy.get('.profile-dropdown-trigger').should('be.visible')

      cy.get('.profile-dropdown-trigger').click()

      cy.get('.sidebar-profile-menu-popover').should('be.visible')
      cy.get('.sidebar-profile-menu-popover').find('.k-dropdown-item').should('have.length', 2)
    })
  })

  it('displays a divider if top items and bottom items are present', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems,
        bottomItems,
      },
    })

    cy.get('.sidebar-level-divider').should('be.visible')
  })

  it('should not display a divider if only one of either top or bottom items are present', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems,
      },
    })

    cy.get('.sidebar-level-divider').should('not.exist')
  })

  it('displays a badge count if present for L2 items when the parent item is expanded', () => {
    const badgeCount = 27

    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Runtime Manager',
          to: '/?runtime-manager',
          label: 'runtime-group-rg',
          key: 'runtime-manager',
          active: true,
          expanded: true,
          icon: 'runtimes',
          items: [
            {
              name: 'Runtime Instances',
              to: '/?runtime-instances',
              badgeCount,
              active: true,
            },
          ],
        }],
      },
    })

    cy.get(sidebar).find('.level-primary.top-items').find('li').eq(0).should('be.visible')
    cy.get(sidebar).find('.level-primary.top-items').find('.level-secondary').should('be.visible')
    cy.get('.level-secondary').find('.item-badge').should('contain.text', badgeCount)
  })

  it('adds a testId attribute when provided', () => {
    const testIdL1 = 'l1-custom-test-selector'
    const testIdL2 = 'l2-custom-test-selector'

    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Runtime Manager',
          to: '/?runtime-manager',
          label: 'runtime-group-rg',
          key: 'runtime-manager',
          active: true,
          expanded: true,
          icon: 'runtimes',
          testId: testIdL1,
          items: [
            {
              name: 'Runtime Instances',
              to: '/?runtime-instances',
              testId: testIdL2,
              active: true,
            },
          ],
        }],
      },
    })

    cy.getTestId('sidebar-item-' + testIdL1).should('be.visible')
    cy.getTestId('sidebar-item-' + testIdL2).should('be.visible')
  })

  it('renders an icon next to L1 items when provided', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Runtime Manager',
          to: '/?runtime-manager',
          label: 'runtime-group-rg',
          key: 'runtime-manager',
          active: true,
          expanded: true,
          icon: 'runtimes',
        }],
      },
    })

    cy.get(sidebar).find('.level-primary.top-items').find('li').eq(0).should('be.visible')
    cy.get(sidebar).find('.level-primary.top-items').find('.sidebar-item-icon .kong-icon').should('be.visible')
  })

  it('does not render an icon next to L1 items when not provided', () => {
    cy.mount(SidebarNav, {
      props: {
        topItems: [{
          name: 'Runtime Manager',
          to: '/?runtime-manager',
          label: 'runtime-group-rg',
          key: 'runtime-manager',
          active: true,
          expanded: true,
        }],
      },
    })

    cy.get(sidebar).find('.level-primary.top-items').find('li').eq(0).should('be.visible')
    cy.get(sidebar).find('.level-primary.top-items').find('.sidebar-item-icon .kong-icon').should('not.exist')
  })

  // Expanded
  describe('expanded', () => {
    it('displays L2 items when the parent item `expanded` is true', () => {
      const childItemName = 'Runtime Instances'

      cy.mount(SidebarNav, {
        props: {
          topItems: [{
            name: 'Runtime Manager',
            to: '/?runtime-manager',
            label: 'retail-sandbox-rg',
            key: 'runtime-manager',
            active: true,
            expanded: true,
            icon: 'runtimes',
            items: [
              {
                name: childItemName,
                to: '/?runtime-instances',
                active: true,
              },
            ],
          }],
        },
      })

      cy.get(sidebar).find('.level-primary.top-items').find('li').eq(0).should('be.visible')
      cy.get(sidebar).find('.level-primary.top-items').find('.level-secondary').should('be.visible')
      cy.get('.level-secondary').find('li a').eq(0).should('contain.text', childItemName)
    })

    it('displays a label under the L1 when provided and expanded', () => {
      const labelText = 'retail-sandbox-rg'

      cy.mount(SidebarNav, {
        props: {
          topItems: [{
            name: 'Runtime Manager',
            to: '/?runtime-manager',
            label: labelText,
            key: 'runtime-manager',
            active: true,
            expanded: true,
            icon: 'runtimes',
            items: [
              {
                name: 'Runtime Instances',
                to: '/?runtime-instances',
                active: true,
              },
            ],
          }],
        },
      })

      cy.get(sidebar).find('.level-primary.top-items').find('li').eq(0).should('be.visible')
      cy.get(sidebar).find('.level-primary.top-items').find('.sidebar-item-label').should('contain.text', labelText)
    })

    it('does not display a label under the L1 when the item is not expanded', () => {
      const labelText = 'retail-sandbox-rg'

      cy.mount(SidebarNav, {
        props: {
          topItems: [{
            name: 'Runtime Manager',
            to: '/?runtime-manager',
            label: labelText,
            key: 'runtime-manager',
            active: true,
            expanded: false,
            icon: 'runtimes',
            items: [
              {
                name: 'Runtime Instances',
                to: '/?runtime-instances',
                active: true,
              },
            ],
          }],
        },
      })

      cy.get(sidebar).find('.level-primary.top-items').find('li').eq(0).should('be.visible')
      cy.get(sidebar).find('.level-primary.top-items').find('.sidebar-item-label').should('not.exist')
    })
  })

  // Events
  describe('events', () => {
    it('emits a `click` event with an `item` payload when clicked', () => {
      cy.mount(SidebarNav, {
        props: {
          topItems,
        },
      })

      cy.get(sidebar).find('.sidebar-item-link').eq(1).click().then(() => {
        // Check for emitted event
        cy.wrap(Cypress.vueWrapper.emitted()).should('have.property', 'click').then((evt) => {
          // Verify emit payload
          cy.wrap(evt[0][0]).should('have.property', 'name')
          cy.wrap(evt[0][0]).should('have.property', 'key')
          cy.wrap(evt[0][0]).should('have.property', 'to')
          cy.wrap(evt[0][0]).should('have.property', 'icon')
          cy.wrap(evt[0][0]).should('have.property', 'testId')
        })
      })
    })
  })

  // Slots
  describe('slots', () => {
    // Header slot
    describe('header', () => {
      it('renders header slot content', () => {
        const headerSlotText = 'This is my logo'

        cy.mount(SidebarNav, {
          props: {
            headerHeight: 100,
          },
          slots: {
            header: () => h('div', {}, headerSlotText),
          },
        })

        cy.get('.sidebar-header').should('contain.text', headerSlotText)
      })

      it('sets the header height from the header-height prop', () => {
        const height = 120

        cy.mount(SidebarNav, {
          props: {
            headerHeight: height,
          },
          slots: {
            header: () => h('div', {}, 'This is my logo'),
          },
        })

        cy.get('.sidebar-header').invoke('outerHeight').should('eq', height)
      })
    })
  })
})
