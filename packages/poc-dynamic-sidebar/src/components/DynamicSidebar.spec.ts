// Vitest unit test spec file

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DynamicSidebar from './DynamicSidebar.vue'

describe('<DynamicSidebar />', () => {
  it('renders', () => {
    const wrapper = mount(DynamicSidebar)

    expect(wrapper.isVisible()).toBe(true)
  })
})
