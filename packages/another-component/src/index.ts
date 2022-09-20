import type { App } from 'vue'
import TestButton from '@/component/TestButton.vue'

export default {
  install: (app: App, options?: { name: string }): void => {
    app.component(options?.name || 'TestButton', TestButton)
  },
}

export { TestButton }
