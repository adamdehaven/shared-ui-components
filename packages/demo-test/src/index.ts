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

export { TestButton, registerWebComponent }
