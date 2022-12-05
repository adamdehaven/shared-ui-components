// Vitest unit test spec file

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Navbar from './NavbarHeader.vue'

describe('<Navbar />', () => {
  it('renders', () => {
    const wrapper = mount(Navbar)

    expect(wrapper.isVisible()).toBe(true)
  })
})
