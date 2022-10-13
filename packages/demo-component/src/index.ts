import type { App } from 'vue'
// import { defineCustomElement } from 'vue'
import TestButton from './components/TestButton.vue'
import RedButton from './components/RedButton.vue'

// Export Vue plugin as the default
export default {
  install: (app: App): void => {
    app.component('TestButton', TestButton)
    app.component('RedButton', RedButton)
  },
}

// const TestButtonCustomElement = defineCustomElement(TestButton)
// Export a function that registers a native web component
// const registerWebComponent = () => {
//   customElements.define('test-button', TestButtonCustomElement)
// }

export { TestButton, RedButton }
