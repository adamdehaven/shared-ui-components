// Vitest unit test spec file

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KonnectGlobalSearch from './KonnectGlobalSearch.vue'

describe('<KonnectGlobalSearch />', () => {
  it('renders', () => {
    const wrapper = mount(KonnectGlobalSearch)

    expect(wrapper.exists()).toBe(true)
  })
})
