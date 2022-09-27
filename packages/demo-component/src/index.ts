import type { App } from 'vue'
import { defineCustomElement } from 'vue'
import TestButton from '../src/TestButton.vue'

// Export Vue plugin as the default
export default {
  install: (app: App, options?: { name: string }): void => {
    app.component(options?.name || 'TestButton', TestButton)
  },
}

const TestButtonCustomElement = defineCustomElement(TestButton)
// Export a function that registers a native web component
const registerWebComponent = () => {
  customElements.define('test-button', TestButtonCustomElement)
}

// @ts-ignore
window.TestButton = TestButton

console.log('package window defined?', typeof window !== 'undefined')
console.log('package window', window)

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.kongui = {
    // @ts-ignore
    ...window.kongui,
    demo_component: {
      TestButton,
    },
  }
}

export { TestButton, registerWebComponent }
