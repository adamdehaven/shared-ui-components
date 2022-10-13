import type { App } from 'vue'
import {%%COMPONENT_NAME%%} from './components/{%%COMPONENT_NAME%%}.vue'

// Export Vue plugin as the default
export default {
  install: (app: App): void => {
    app.component('{%%COMPONENT_NAME%%}', {%%COMPONENT_NAME%%})
  },
}

export { {%%COMPONENT_NAME%%} }
