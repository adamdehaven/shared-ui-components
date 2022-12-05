// Vitest unit test spec file

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KonnectAppShell from './KonnectAppShell.vue'

describe('<KonnectAppShell />', () => {
  it('renders', () => {
    const wrapper = mount(KonnectAppShell)

    expect(wrapper.isVisible()).toBe(true)
  })
})
