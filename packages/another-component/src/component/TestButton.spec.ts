import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TestButton from './TestButton.vue'

describe('TestButton', () => {
  it('renders properly', () => {
    const wrapper = mount(TestButton, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
