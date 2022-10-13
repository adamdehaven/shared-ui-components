import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TestButton from './TestButton.vue'

describe('TestButton.vue', () => {
  it('renders', () => {
    const buttonText = 'This is a button'

    const wrapper = mount(TestButton, {
      props: {
        msg: buttonText,
      },
    })

    expect(wrapper.text()).toContain(buttonText)
  })
})
